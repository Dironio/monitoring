import { TimeUnit } from "../services/@types/clustering.dto";
import pool from "../pool";
import { DeviceMetrics, GeoMetrics, InteractionData, PageTransition, SequenceEvent, SessionMetrics, TemporalData, UserMetrics } from './@types/cluster.dao'

class ClusteringDal {
    getTimeFunction(timeUnit: keyof TimeUnit): string {
        switch (timeUnit) {
            case 'minute':
                return "date_trunc('minute', timestamp)";
            case 'hour':
                return "date_trunc('hour', timestamp)";
            case 'day':
                return "date_trunc('day', timestamp)";
            case 'week':
                return "date_trunc('week', timestamp)";
            case 'month':
                return "date_trunc('month', timestamp)";
            default:
                return "date_trunc('hour', timestamp)";
        }
    }

    async getInteractions(webId: number): Promise<InteractionData[]> {
        const result = await pool.query(`
            SELECT 
                (event_data->>'x')::float as x,
                (event_data->>'y')::float as y,
                (event_data->>'duration')::float as duration,
                page_url,
                timestamp,
                session_id,
                user_id
            FROM raw_events
            WHERE web_id = $1 
            AND event_data->>'x' IS NOT NULL 
            AND event_data->>'y' IS NOT NULL
            AND event_data->>'duration' IS NOT NULL
            AND event_data::text NOT LIKE '%scrollTop%'
            AND event_data::text NOT LIKE '%scrollPercentage%'
            ORDER BY timestamp DESC
        `, [webId]);

        return result.rows;
    }

    async getTemporalData(webId: number, timeUnit: keyof TimeUnit): Promise<TemporalData[]> {
        const timeFunction = this.getTimeFunction(timeUnit);

        const result = await pool.query(`
            WITH time_series AS (
                SELECT 
                    $2 as time_bucket,
                    COUNT(*) as event_count,
                    COUNT(DISTINCT COALESCE(user_id::text, session_id)) as unique_users
                FROM raw_events
                WHERE web_id = $1
                AND event_data->>'x' IS NOT NULL 
                GROUP BY time_bucket
            )
            SELECT 
                time_bucket,
                event_count,
                unique_users
            FROM time_series
            ORDER BY time_bucket ASC
        `, [webId, timeFunction]);

        return result.rows;
    }

    async getClusterMetrics(webId: number): Promise<any> {
        const result = await pool.query(`
            WITH interaction_metrics AS (
                SELECT 
                    page_url,
                    COUNT(*) as interaction_count,
                    COUNT(DISTINCT COALESCE(user_id::text, session_id)) as unique_visitors,
                    AVG((event_data->>'duration')::float) as avg_duration,
                    percentile_cont(0.5) WITHIN GROUP (ORDER BY (event_data->>'duration')::float) as median_duration
                FROM raw_events
                WHERE web_id = $1 
                AND event_data->>'x' IS NOT NULL
                AND event_data->>'duration' IS NOT NULL
                GROUP BY page_url
            )
            SELECT 
                page_url,
                interaction_count,
                unique_visitors,
                avg_duration,
                median_duration,
                interaction_count::float / NULLIF(unique_visitors, 0) as interactions_per_visitor
            FROM interaction_metrics
            ORDER BY interaction_count DESC
        `, [webId]);

        return result.rows;
    }

    async getSessionPatterns(webId: number): Promise<any> {
        const result = await pool.query(`
            WITH session_events AS (
                SELECT 
                    session_id,
                    ARRAY_AGG(
                        json_build_object(
                            'x', (event_data->>'x')::float,
                            'y', (event_data->>'y')::float,
                            'duration', (event_data->>'duration')::float,
                            'timestamp', timestamp
                        ) ORDER BY timestamp
                    ) as events,
                    COUNT(*) as event_count,
                    MAX(timestamp) - MIN(timestamp) as session_duration
                FROM raw_events
                WHERE web_id = $1 
                AND event_data->>'x' IS NOT NULL
                AND session_id IS NOT NULL
                GROUP BY session_id
                HAVING COUNT(*) >= 5
            )
            SELECT 
                session_id,
                events,
                event_count,
                session_duration
            FROM session_events
            ORDER BY event_count DESC
        `, [webId]);

        return result.rows;
    }

    async getPageTransitions(webId: number): Promise<any> {
        const result = await pool.query(`
            WITH page_sequence AS (
                SELECT 
                    session_id,
                    page_url,
                    LAG(page_url) OVER (
                        PARTITION BY session_id 
                        ORDER BY timestamp
                    ) as previous_page
                FROM raw_events
                WHERE web_id = $1
                AND page_url IS NOT NULL
            )
            SELECT 
                previous_page,
                page_url as current_page,
                COUNT(*) as transition_count
            FROM page_sequence
            WHERE previous_page IS NOT NULL
            GROUP BY previous_page, current_page
            HAVING COUNT(*) >= 3
            ORDER BY transition_count DESC
        `, [webId]);

        return result.rows;
    }

    async getDwellTimeDistribution(webId: number): Promise<any> {
        const result = await pool.query(`
            WITH page_durations AS (
                SELECT 
                    page_url,
                    (event_data->>'duration')::float as duration,
                    width_bucket(
                        (event_data->>'duration')::float,
                        0,
                        60,
                        6
                    ) as duration_bucket
                FROM raw_events
                WHERE web_id = $1
                AND event_data->>'duration' IS NOT NULL
                AND (event_data->>'duration')::float <= 60
            )
            SELECT 
                page_url,
                duration_bucket * 10 as duration_range_start,
                (duration_bucket + 1) * 10 as duration_range_end,
                COUNT(*) as count
            FROM page_durations
            GROUP BY page_url, duration_bucket
            ORDER BY page_url, duration_bucket
        `, [webId]);

        return result.rows;
    }







    async getUserAnalysis(webId: number): Promise<UserMetrics[]> {
        const result = await pool.query(`
            WITH session_times AS (
                SELECT
                    session_id,
                    MAX(timestamp) - MIN(timestamp) as total_duration
                FROM raw_events
                WHERE web_id = $1
                GROUP BY session_id
            ),
            max_scroll_per_session AS (
                SELECT
                    session_id,
                    MAX((event_data->>'y')::float) as max_y,
                    1000 as base_height  
                FROM raw_events
                WHERE web_id = $1
                GROUP BY session_id
            )
            SELECT
                r.session_id as "sessionId",
                EXTRACT(EPOCH FROM st.total_duration) as "timeOnPage",
                LEAST(
                    ROUND(
                        (ms.max_y / ms.base_height) * 100
                    ),
                    100
                ) as "scrollDepth",
                COUNT(CASE WHEN r.event_id = 2 THEN 1 END) as "clickCount"
            FROM raw_events r
            JOIN session_times st ON st.session_id = r.session_id
            JOIN max_scroll_per_session ms ON ms.session_id = r.session_id
            WHERE r.web_id = $1
            GROUP BY 
                r.session_id, 
                st.total_duration,
                ms.max_y,
                ms.base_height;
        `, [webId]);

        return result.rows
            .filter(item => item.timeOnPage != null &&
                item.scrollDepth != null &&
                item.clickCount != null)
            .map(item => ({
                sessionId: item.sessionId,
                timeOnPage: Number(item.timeOnPage),
                scrollDepth: Number(item.scrollDepth),
                clickCount: Number(item.clickCount)
            }));
    }

    async getSequenceAnalysis(webId: number): Promise<SequenceEvent[]> {
        const result = await pool.query(`
           WITH session_durations AS (
    SELECT
        session_id,
        MAX(CASE
            WHEN event_data->>'duration' IS NOT NULL
            THEN (event_data->>'duration')::float
            ELSE 0
        END) as final_duration
    FROM raw_events
    WHERE web_id = $1
    GROUP BY session_id
),
parsed_urls AS (
    SELECT
        r.session_id,
        REGEXP_REPLACE(
            REGEXP_REPLACE(r.page_url, '^https?://[^/]+', ''),
            '[?#].*$', ''
        ) as path_only,
        r.timestamp,
        sd.final_duration as duration
    FROM raw_events r
    JOIN session_durations sd ON sd.session_id = r.session_id
    WHERE r.web_id = $1
),
filtered_paths AS (
    SELECT
        session_id,
        path_only,
        timestamp,
        duration
    FROM (
        SELECT 
            session_id,
            path_only,
            timestamp,
            duration,
            LAG(path_only) OVER (
                PARTITION BY session_id 
                ORDER BY timestamp
            ) as prev_path
        FROM parsed_urls
    ) sub
    WHERE path_only != prev_path OR prev_path IS NULL
)
SELECT 
    session_id,
    path_only as page_url,
    timestamp,
    duration
FROM filtered_paths
ORDER BY session_id, timestamp
LIMIT 1000;
            `, [webId]);

        return result.rows;
    }














    async getSessionSimilarity(webId: number): Promise<SessionMetrics[]> {
        const result = await pool.query(`
            WITH recent_sessions AS (
                SELECT DISTINCT session_id
                FROM raw_events
                WHERE web_id = $1
                AND timestamp >= CURRENT_DATE - INTERVAL '7 days'
                LIMIT 100
            )
            SELECT 
                COALESCE(s1.session_id, 'Unknown') as session_a,
                COALESCE(s2.session_id, 'Unknown') as session_b,
                COUNT(DISTINCT COALESCE(s1.page_url, 'Unknown')) as common_pages,
                COALESCE(ABS(SUM(s1.duration) - SUM(s2.duration)), 0) as duration_diff,
                COALESCE(
                    CAST(COUNT(DISTINCT s1.page_url) AS FLOAT) /
                    NULLIF(COUNT(DISTINCT s1.page_url) + COUNT(DISTINCT s2.page_url), 0),
                    0
                ) as similarity_score
            FROM recent_sessions rs1
            JOIN raw_events s1 ON s1.session_id = rs1.session_id
            JOIN recent_sessions rs2 ON rs1.session_id < rs2.session_id
            JOIN raw_events s2 ON s2.session_id = rs2.session_id
            WHERE s1.web_id = $1 AND s2.web_id = $1
            GROUP BY s1.session_id, s2.session_id;
        `, [webId]);

        return result.rows;
    }

    async getGeoMetrics(webId: number): Promise<GeoMetrics[]> {
        const result = await pool.query(`
            SELECT 
                COALESCE(geolocation->>'country', 'Unknown') as country,
                COALESCE(geolocation->>'region', 'Unknown') as region,
                COALESCE(geolocation->>'city', 'Unknown') as city,
                COUNT(DISTINCT session_id) as session_count,
                COUNT(DISTINCT user_id) as user_count,
                COUNT(*) as event_count
            FROM raw_events
            WHERE web_id = $1
            AND timestamp >= CURRENT_DATE - INTERVAL '30 days'
            GROUP BY 
                COALESCE(geolocation->>'country', 'Unknown'),
                COALESCE(geolocation->>'region', 'Unknown'),
                COALESCE(geolocation->>'city', 'Unknown');
        `, [webId]);

        return result.rows;
    }

    async getPageSimilarity(webId: number): Promise<PageTransition[]> {
        const result = await pool.query(`
            WITH transitions AS (
                SELECT 
                    e.session_id,
                    e.timestamp,
                    REGEXP_REPLACE(e.page_url, 'https?://[^/]+', '') as page_url,
                    REGEXP_REPLACE(LEAD(e.page_url) OVER (
                        PARTITION BY e.session_id 
                        ORDER BY e.timestamp
                    ), 'https?://[^/]+', '') as next_page_url,
                    FIRST_VALUE(event_data->>'duration') OVER (
                        PARTITION BY e.session_id 
                        ORDER BY e.timestamp DESC
                    ) as session_duration
                FROM raw_events e
                WHERE e.web_id = $1
            )
            SELECT 
                page_url as source_url,
                next_page_url as target_url,
                COUNT(*) as transition_count,
                ROUND(AVG(session_duration::integer)::numeric, 2) as avg_duration,
                MIN(session_duration::integer) as min_duration,
                MAX(session_duration::integer) as max_duration
            FROM transitions
            WHERE 
                next_page_url IS NOT NULL 
                AND page_url != next_page_url
            GROUP BY source_url, target_url
            HAVING COUNT(*) >= 5
            ORDER BY transition_count DESC
            LIMIT 50;
        `, [webId]);

        return result.rows;
    }

    async getDeviceMetrics(webId: number): Promise<DeviceMetrics[]> {
        const result = await pool.query(`
            WITH browser_details AS (
                SELECT
                    session_id,
                    user_id,
                    COALESCE(user_agent->>'os', 'Unknown') as os,
                    CASE 
                        WHEN (user_agent->>'userAgent') LIKE '%YaBrowser%' THEN 'Yandex Browser'
                        WHEN (user_agent->>'userAgent') LIKE '%Edg/%' THEN 'Microsoft Edge'
                        WHEN (user_agent->>'userAgent') LIKE '%Firefox%' THEN 'Firefox'
                        WHEN (user_agent->>'userAgent') LIKE '%Chrome%' 
                            AND (user_agent->>'userAgent') NOT LIKE '%Edg/%'
                            AND (user_agent->>'userAgent') NOT LIKE '%YaBrowser%'
                            AND (user_agent->>'userAgent') NOT LIKE '%OPR/%' 
                            THEN 'Chrome'
                            WHEN (user_agent->>'userAgent') LIKE '%Safari%' 
                            AND (user_agent->>'userAgent') NOT LIKE '%Chrome%' 
                            AND (user_agent->>'userAgent') NOT LIKE '%Edg/%'
                            THEN 'Safari'
                        WHEN (user_agent->>'userAgent') LIKE '%OPR/%' 
                            OR (user_agent->>'userAgent') LIKE '%Opera%' 
                            THEN 'Opera'
                        ELSE COALESCE(user_agent->>'browser', 'Unknown')
                    END as browser,
                    COALESCE(user_agent->>'platform', 'Unknown') as platform,
                    COALESCE(user_agent->>'browserVersion', 'Unknown') as browser_version,
                    COALESCE(user_agent->>'language', 'Unknown') as language
                FROM raw_events
                WHERE 
                    web_id = $1
                    AND timestamp >= CURRENT_DATE - INTERVAL '30 days'
            )
            SELECT 
                os,
                browser || ' ' || 
                CASE 
                    WHEN browser_version != 'Unknown' 
                    THEN browser_version
                    ELSE ''
                END as browser,
                platform,
                language,
                COUNT(DISTINCT session_id) as session_count,
                COUNT(DISTINCT user_id) as user_count,
                ROUND(COUNT(DISTINCT session_id)::numeric * 100.0 / SUM(COUNT(DISTINCT session_id)) OVER(), 2) as session_percentage
            FROM browser_details
            GROUP BY 
                os,
                browser,
                platform,
                browser_version,
                language
            HAVING COUNT(DISTINCT session_id) >= 3
            ORDER BY session_count DESC;
        `, [webId]);

        return result.rows;
    }
}

const clusteringDal = new ClusteringDal();
export default clusteringDal;