import pool from "../pool";

class BehaviorDal {
    async getPageLoadingSpeed(webId: number): Promise<any> {
        const result = await pool.query(
            `
            WITH page_load_times AS (
                SELECT
                    session_id,
                    page_url,
                    MIN(timestamp) AS load_start,
                    MAX(timestamp) AS load_end,
                    DATE(timestamp) AS load_date
                FROM
                    raw_events
                WHERE
                    web_id = $1
                GROUP BY
                    session_id, page_url, DATE(timestamp)
            )
            SELECT
                load_date AS date,
                AVG(EXTRACT(EPOCH FROM (load_end - load_start))) AS load_time_ms
            FROM
                page_load_times
            GROUP BY
                load_date
            ORDER BY
                load_date
            `,
            [webId]
        );
        return result.rows;
    }

    async getTotalUsers(webId: number): Promise<any> {
        const result = await pool.query(
            `
        WITH daily_users AS (
            SELECT
                DATE(timestamp) AS date,
                COUNT(DISTINCT user_id) AS daily_users
            FROM
                raw_events
            WHERE
                web_id = $1
            GROUP BY
                DATE(timestamp)
        )
        SELECT
            date,
            (SELECT COUNT(DISTINCT user_id) FROM raw_events WHERE web_id = $1 AND DATE(timestamp) <= daily_users.date) AS total_users,
            daily_users
        FROM
            daily_users
        ORDER BY
            date;
        `,
            [webId]
        );
        return result.rows;
    }

    async getTotalVisits(webId: number): Promise<any> {
        const result = await pool.query(
            `
        WITH daily_metrics AS (
            SELECT
                DATE(timestamp) AS date,
                COUNT(DISTINCT user_id) AS daily_users,
                COUNT(DISTINCT session_id) AS daily_visits
            FROM
                raw_events
            WHERE
                web_id = $1
            GROUP BY
                DATE(timestamp)
        )
        SELECT
            date,
            (SELECT COUNT(DISTINCT user_id) FROM raw_events WHERE web_id = $1 AND DATE(timestamp) <= daily_metrics.date) AS total_users,
            (SELECT COUNT(DISTINCT session_id) FROM raw_events WHERE web_id = $1 AND DATE(timestamp) <= daily_metrics.date) AS total_visits,
            daily_users,
            daily_visits
        FROM
            daily_metrics
        ORDER BY
            date;
        `,
            [webId]
        );
        return result.rows;
    }

    async getReturningUsers(webId: number): Promise<any> {
        const result = await pool.query(
            `
        WITH daily_user_visits AS (
            SELECT
                DATE(timestamp) AS date,
                user_id,
                COUNT(DISTINCT session_id) AS visit_count
            FROM
                raw_events
            WHERE
                web_id = $1
            GROUP BY
                DATE(timestamp),
                user_id
        ),
        daily_returning_users AS (
            SELECT
                date,
                COUNT(*) FILTER (WHERE visit_count > 1) AS returning_users,
                COUNT(*) AS total_users
            FROM
                daily_user_visits
            GROUP BY
                date
        )
        SELECT
            date,
            ROUND((returning_users * 100.0) / total_users, 2) AS returning_rate
        FROM
            daily_returning_users
        ORDER BY
            date;
        `,
            [webId]
        );
        return result.rows;
    }

    async getBounceRate(webId: number): Promise<any> {
        const result = await pool.query(
            `
        WITH daily_session_activity AS (
            SELECT
                DATE(timestamp) AS date,
                session_id,
                COUNT(DISTINCT page_url) AS page_count
            FROM
                raw_events
            WHERE
                web_id = $1
            GROUP BY
                DATE(timestamp),
                session_id
        ),
        daily_bounce_rates AS (
            SELECT
                date,
                COUNT(*) FILTER (WHERE page_count = 1) AS bounces,
                COUNT(*) AS total_sessions
            FROM
                daily_session_activity
            GROUP BY
                date
        )
        SELECT
            date,
            ROUND((bounces * 100.0) / total_sessions, 2) AS bounce_rate
        FROM
            daily_bounce_rates
        ORDER BY
            date;
        `,
            [webId]
        );
        return result.rows;
    }

    async getTotalSales(webId: number): Promise<any> {
        const result = await pool.query(
            `
            SELECT
                DATE(timestamp) AS date,
                COUNT(*) AS sales_count
            FROM
                raw_events
            WHERE
                event_id = 14
                AND web_id = $1
            GROUP BY
                DATE(timestamp)
            ORDER BY
                DATE(timestamp);
            `,
            [webId]
        );
        return result.rows;
    }

    async getTotalConversions(webId: number): Promise<any> {
        const result = await pool.query(
            `
            SELECT
                DATE(timestamp) AS date,
                COUNT(DISTINCT user_id) AS conversions_count
            FROM
                raw_vents
            WHERE
                event_id = 14
                AND web_id = $1
            GROUP BY
                DATE(timestamp)
            ORDER BY
                DATE(timestamp);
            `,
            [webId]
        );
        return result.rows;
    }

    async getActiveUsers(webId: number): Promise<any> {
        const result = await pool.query(
            `
            WITH current_users AS (
                SELECT
                    COUNT(DISTINCT session_id) AS active_users
                FROM
                    raw_events
                WHERE
                    timestamp >= NOW() - INTERVAL '5 minutes'
                    AND web_id = $1
            ),
            yesterday_users AS (
                SELECT
                    COUNT(DISTINCT session_id) AS active_users
                FROM
                    raw_events
                WHERE
                    timestamp >= NOW() - INTERVAL '1 day 5 minutes'
                    AND timestamp <= NOW() - INTERVAL '1 day'
                    AND web_id = $1
            )
            SELECT
                (SELECT active_users FROM current_users) AS current_active_users,
                (SELECT active_users FROM yesterday_users) AS yesterday_active_users;
            `,
            [webId]
        );
        return result.rows;
    }

    async getMonthlyWeeklyActiveUsers(webId: number, interval: 'month' | 'week'): Promise<any> {
        const result = await pool.query(
            `
            SELECT
                DATE(timestamp) AS date,
                COUNT(DISTINCT session_id) AS daily_active_users
            FROM
                raw_events
            WHERE
                timestamp >= NOW() - INTERVAL '1 ${interval}'
                AND web_id = $1
            GROUP BY
                DATE(timestamp)
            ORDER BY
                DATE(timestamp);
            `,
            [webId]
        );
        return result.rows;
    }

















    async getAverageTimeOnSite(webId: number, interval: 'month' | 'week'): Promise<any> {
        const result = await pool.query(
            `
        WITH session_durations AS (
            SELECT
                session_id,
                DATE(timestamp) AS date,
                MIN(timestamp) AS session_start,
                MAX(timestamp) AS session_end
            FROM
                raw_events
            WHERE
                web_id = $1
                AND timestamp >= NOW() - INTERVAL '1 ${interval}'
            GROUP BY
                session_id, DATE(timestamp)
        )
        SELECT
            date,
            AVG(EXTRACT(EPOCH FROM (session_end - session_start))) AS average_time_on_site
        FROM
            session_durations
        GROUP BY
            date
        ORDER BY
            date ASC;
        `,
            [webId]
        );
        return result.rows;
    }

    async getAveragePageDepth(webId: number, interval: 'month' | 'week'): Promise<any> {
        const result = await pool.query(
            `
        WITH page_views_per_session AS (
            SELECT
                session_id,
                DATE(timestamp) AS date,
                COUNT(DISTINCT page_url) AS page_count
            FROM
                raw_events
            WHERE
                web_id = $1
                --AND event_id = 1
                AND timestamp >= NOW() - INTERVAL '1 ${interval}'
            GROUP BY
                session_id, DATE(timestamp)
        )
        SELECT
            date,
            AVG(page_count) AS average_page_depth
        FROM
            page_views_per_session
        GROUP BY
            date
        ORDER BY
            date ASC;
        `,
            [webId]
        );
        return result.rows;
    }

    async getClickAnalysis(webId: number, interval: 'month' | 'week'): Promise<any> {
        const result = await pool.query(
            `
        SELECT
            event_data->>'element_tag' AS element_tag,
            COUNT(*) AS click_count
        FROM
            raw_events
        WHERE
            web_id = $1
            AND event_id = 2
            AND timestamp >= NOW() - INTERVAL '1 ${interval}'
        GROUP BY
            event_data->>'element_tag'
        ORDER BY
            click_count DESC;
        `,
            [webId]
        );
        return result.rows;
    }

    async getEventAnalysis(webId: number, interval: 'month' | 'week'): Promise<any> {
        const result = await pool.query(
            `
            SELECT
                event_id,
                COUNT(*) AS event_count
            FROM
                raw_events
            WHERE
                web_id = $1
                AND timestamp >= NOW() - INTERVAL '1 ${interval}'
            GROUP BY
                event_id
            ORDER BY
                event_count DESC;
            `,
            [webId]
        );
        return result.rows;
    }

    async getAverageScrollPercentage(webId: number, interval: 'month' | 'week'): Promise<any> {
        const result = await pool.query(
            `
        SELECT
            DATE(timestamp) AS date,
            AVG((event_data->>'scrollPercentage')::numeric) AS average_scroll_percentage
        FROM
            raw_events
        WHERE
            web_id = $1
            AND event_id = 4
            AND event_data->>'scrollPercentage' IS NOT NULL
            AND timestamp >= NOW() - INTERVAL '1 ${interval}'
        GROUP BY
            DATE(timestamp)
        ORDER BY
            DATE(timestamp) ASC;
        `,
            [webId]
        );
        return result.rows[0];
    }

    async getFormAnalysis(webId: number, interval: 'month' | 'week'): Promise<any> {
        const result = await pool.query(
            `
        SELECT
            event_data->>'form_id' AS form_id,
            COUNT(*) AS form_submit_count
        FROM
            raw_events
        WHERE
            web_id = $1
            AND event_id = 3
            AND timestamp >= NOW() - INTERVAL '1 ${interval}'
        GROUP BY
            event_data->>'form_id'
        ORDER BY
            form_submit_count DESC;
        `,
            [webId]
        );
        return result.rows;
    }





    async getPerformanceMetrics(webId: number): Promise<any> {
        const result = await pool.query(
            `
            WITH page_load_times AS (
                SELECT
                    session_id,
                    page_url,
                    MIN(timestamp) AS load_start,
                    MAX(timestamp) AS load_end
                FROM
                    raw_events
                WHERE
                    web_id = $1
                    AND event_id = 1
                GROUP BY
                    session_id, page_url
            )
            SELECT
                AVG(EXTRACT(EPOCH FROM (load_end - load_start))) AS average_load_time
            FROM
                page_load_times;
            `,
            [webId]
        );
        return result.rows[0];
    }

    async getErrorAnalysis(webId: number): Promise<any> {
        const result = await pool.query(
            `
            SELECT
                event_data->>'errorType' AS error_type,
                COUNT(*) AS error_count
            FROM
                raw_events
            WHERE
                web_id = $1
                AND event_id = 15
            GROUP BY
                event_data->>'errorType'
            ORDER BY
                error_count DESC;
            `,
            [webId]
        );
        return result.rows;
    }

    async getUptimeStatus(webId: number): Promise<any> {
        const result = await pool.query(
            `
            SELECT
                DATE(timestamp) AS date,
                CASE
                    WHEN COUNT(*) FILTER (WHERE event_id = 15) > 0 THEN 'down'
                    ELSE 'up'
                END AS status
            FROM
                raw_events
            WHERE
                web_id = $1
            GROUP BY
                DATE(timestamp)
            ORDER BY
                date;
            `,
            [webId]
        );
        return result.rows;
    }

    async getResourceAnalysis(webId: number): Promise<any> {
        const result = await pool.query(
            `
            SELECT
                event_data->>'resourceType' AS resource_type,
                AVG((event_data->>'size')::numeric) AS average_size
            FROM
                raw_events
            WHERE
                web_id = $1
                AND event_data->>'resourceType' IS NOT NULL
            GROUP BY
                event_data->>'resourceType'
            ORDER BY
                average_size DESC;
            `,
            [webId]
        );
        return result.rows;
    }

    async getSeoAnalysis(webId: number): Promise<any> {
        const result = await pool.query(
            `
            SELECT
                page_url AS page,
                AVG(LENGTH(event_data->>'title')) AS average_title_length,
                AVG(LENGTH(event_data->>'metaDescription')) AS average_meta_description_length,
                AVG((event_data->>'h1Count')::numeric) AS average_h1_count
            FROM
                raw_events
            WHERE
                web_id = $1
                AND (event_data->>'title' IS NOT NULL
                OR event_data->>'metaDescription' IS NOT NULL
                OR event_data->>'h1Count' IS NOT NULL)
            GROUP BY
                page_url
            ORDER BY
                page;
            `,
            [webId]
        );
        return result.rows;
    }

    async getActiveUsersNow(webId: number): Promise<any> {
        const result = await pool.query(
            `
            SELECT
                COUNT(DISTINCT session_id) AS active_users
            FROM
                raw_events
            WHERE
                timestamp >= NOW() - INTERVAL '5 minutes'
                AND web_id = $1;
            `,
            [webId]
        );
        return result.rows;
    }

    async getActiveUsersComparison(webId: number): Promise<any> {
        const result = await pool.query(
            `
            SELECT
                DATE(timestamp) AS date,
                COUNT(DISTINCT session_id) AS active_users
            FROM
                raw_events
            WHERE
                timestamp >= NOW() - INTERVAL '7 days'
                AND web_id = $1
            GROUP BY
                DATE(timestamp)
            ORDER BY
                date;
            `,
            [webId]
        );
        return result.rows;
    }







    async getUserGeolocation(webId: number, interval: 'month' | 'week'): Promise<any> {
        const result = await pool.query(
            `
        SELECT
            geolocation->'country' AS country,
            geolocation->'city' AS city,
            COUNT(DISTINCT session_id) AS users
        FROM
            raw_events
        WHERE
            web_id = $1
            AND geolocation IS NOT NULL
            AND jsonb_typeof(geolocation) = 'object'
            AND geolocation->'country' IS NOT NULL
            AND geolocation->'city' IS NOT NULL
            AND timestamp >= NOW() - INTERVAL '1 ' || '1 $2'
        GROUP BY
            geolocation->'country',
            geolocation->'city'
        ORDER BY
            users DESC;
        `,
            [webId, interval]
        );
        return result.rows;
    }

    async getTopCountries(webId: number): Promise<any> {
        const result = await pool.query(
            `
        SELECT
            geolocation->'country' AS country,
            COUNT(DISTINCT user_id) AS users
        FROM
            raw_events
        WHERE
            web_id = $1
            AND geolocation IS NOT NULL
            AND jsonb_typeof(geolocation) = 'object' -- Проверка, что geolocation — это JSON-объект
        GROUP BY
            geolocation->'country'
        ORDER BY
            users DESC;
        `,
            [webId]
        );
        return result.rows;
    }

    async getTopCities(webId: number): Promise<any> {
        const result = await pool.query(
            `
            SELECT
                geolocation->>'city' AS city,
                geolocation->>'country' AS country,
                COUNT(DISTINCT user_id) AS users
            FROM
                raw_events
            WHERE
                web_id = $1
                AND geolocation IS NOT NULL
                AND geolocation != '[NULL]'
            GROUP BY
                geolocation->>'city',
                geolocation->>'country'
            ORDER BY
                users DESC;
            `,
            [webId]
        );
        return result.rows;
    }

    async getUserRegions(webId: number): Promise<any> {
        const result = await pool.query(
            `
            SELECT
                geolocation->>'region' AS region,
                COUNT(DISTINCT user_id) AS users
            FROM
                raw_events
            WHERE
                web_id = $1
                AND geolocation IS NOT NULL
                AND geolocation != '[NULL]'
            GROUP BY
                geolocation->>'region'
            ORDER BY
                users DESC;
            `,
            [webId]
        );
        return result.rows;
    }

    async getGeolocationComparison(webId: number): Promise<any> {
        const result = await pool.query(
            `
            WITH current_period AS (
                SELECT
                    geolocation->>'country' AS country,
                    geolocation->>'city' AS city,
                    COUNT(DISTINCT user_id) AS current_users
                FROM
                    raw_events
                WHERE
                    web_id = $1
                    AND geolocation IS NOT NULL
                    AND geolocation != '[NULL]'
                    AND timestamp >= NOW() - INTERVAL '7 days'
                GROUP BY
                    geolocation->>'country',
                    geolocation->>'city'
            ),
            previous_period AS (
                SELECT
                    geolocation->>'country' AS country,
                    geolocation->>'city' AS city,
                    COUNT(DISTINCT user_id) AS previous_users
                FROM
                    raw_events
                WHERE
                    web_id = $1
                    AND geolocation IS NOT NULL
                    AND geolocation != '[NULL]'
                    AND timestamp < NOW() - INTERVAL '7 days'
                    AND timestamp >= NOW() - INTERVAL '14 days'
                GROUP BY
                    geolocation->>'country',
                    geolocation->>'city'
            )
            SELECT
                COALESCE(cp.country, pp.country) AS country,
                COALESCE(cp.city, pp.city) AS city,
                COALESCE(cp.current_users, 0) AS current_users,
                COALESCE(pp.previous_users, 0) AS previous_users
            FROM
                current_period cp
            FULL OUTER JOIN
                previous_period pp
            ON
                cp.country = pp.country
                AND cp.city = pp.city
            ORDER BY
                current_users DESC;
            `,
            [webId]
        );
        return result.rows;
    }
}

const behaviorDal = new BehaviorDal();
export default behaviorDal;