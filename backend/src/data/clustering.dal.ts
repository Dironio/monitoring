import { TimeUnit } from "../services/@types/clustering.dto";
import pool from "../pool";
import { InteractionData, SequenceEvent, TemporalData, UserMetrics } from './@types/cluster.dao'

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
}

const clusteringDal = new ClusteringDal();
export default clusteringDal;