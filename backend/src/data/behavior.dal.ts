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

    async getTotalUsers(webId: number): Promise<any> {
        const result = await pool.query(
            `
            SELECT
                COUNT(DISTINCT user_id) AS total_users
            FROM
                raw_events
            WHERE
                web_id = $1;
            `,
            [webId]
        );
        return result.rows[0];
    }

    async getTotalVisits(webId: number): Promise<any> {
        const result = await pool.query(
            `
            SELECT
                COUNT(DISTINCT session_id) AS total_visits
            FROM
                raw_events
            WHERE
                web_id = $1;
            `,
            [webId]
        );
        return result.rows[0];
    }

    async getReturningUsers(webId: number): Promise<any> {
        const result = await pool.query(
            `
            WITH user_visits AS (
                SELECT
                    user_id,
                    COUNT(DISTINCT DATE(timestamp)) AS visit_count
                FROM
                    raw_events
                WHERE
                    web_id = $1
                GROUP BY
                    user_id
            )
            SELECT
                COUNT(*) FILTER (WHERE visit_count > 1) * 100.0 / COUNT(*) AS returning_user_rate
            FROM
                user_visits;
            `,
            [webId]
        );
        return result.rows[0];
    }

    async getBounceRate(webId: number): Promise<any> {
        const result = await pool.query(
            `
            WITH session_activity AS (
                SELECT
                    session_id,
                    COUNT(DISTINCT page_url) AS page_count
                FROM
                    raw_events
                WHERE
                    web_id = $1
                GROUP BY
                    session_id
            )
            SELECT
                COUNT(*) FILTER (WHERE page_count = 1) * 100.0 / COUNT(*) AS bounce_rate
            FROM
                session_activity;
            `,
            [webId]
        );
        return result.rows[0];
    }

    async getTotalSales(webId: number): Promise<any> {
        const result = await pool.query(
            `
            SELECT
                COUNT(*) AS total_sales
            FROM
                raw_events
            WHERE
                event_id = 14
                AND web_id = $1;
            `,
            [webId]
        );
        return result.rows[0];
    }

    async getTotalConversions(webId: number): Promise<any> {
        const result = await pool.query(
            `
            SELECT
                COUNT(DISTINCT user_id) AS total_conversions
            FROM
                raw_events
            WHERE
                event_id = 14
                AND web_id = $1;
            `,
            [webId]
        );
        return result.rows[0];
    }

    async getActiveUsers(webId: number): Promise<any> {
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
        return result.rows[0];
    }
}

const behaviorDal = new BehaviorDal();
export default behaviorDal;