import pool from "../pool";
import { RawEvent } from "../services/@types/event.dto";
import { ClickHeatmapData, CreateEventDao, ScrollHeatmapData, UpdateEventDao } from './@types/event.dao'


class EventDal {
    async create(dao: CreateEventDao): Promise<RawEvent> {
        const currentTimestamp = new Date().toISOString();

        const result = await pool.query(`
          INSERT INTO raw_events (
            user_id, product_id, analyst_id, owner_id, event_id, event_data,
            page_url, timestamp, seller_id, web_id, session_id, referrer, geolocation,
            created_at, updated_at, user_agent
          )
          VALUES (\$1, \$2, \$3, \$4, \$5, \$6, \$7, \$8, \$9, \$10, \$11, \$12, \$13, \$14, $15)
          RETURNING *
        `, [
            dao.user_id, dao.product_id, dao.analyst_id, dao.owner_id, dao.event_id,
            dao.event_data, dao.page_url, dao.timestamp, dao.seller_id, dao.web_id,
            dao.session_id, dao.referrer, dao.geolocation, currentTimestamp, currentTimestamp, dao.user_agent
        ]);

        return result.rows[0];
    }

    async getAll(): Promise<RawEvent[]> {
        const result = await pool.query(`
            SELECT * FROM raw_events
            JOIN event_types ON raw_events.event_id = event_types.id
            JOIN web_sites on raw_events.web_id = web_sites.id
            ORDER BY timestamp DESC
            LIMIT 50
        `);
        return result.rows;
    }

    async update(dao: UpdateEventDao): Promise<RawEvent> {
        const updatedAt = new Date().toISOString();

        const result = await pool.query(`
          UPDATE raw_events
          SET
            user_id = $2,
            product_id = $3,
            analyst_id = $4,
            owner_id = $5,
            event_id = $6,
            event_data = $7,
            page_url = $8,
            timestamp = $9,
            seller_id = $10,
            web_id = $11,
            session_id = $12,
            referrer = $13,
            geolocation = $14,
            updated_at = $15
            user_agent = $16
          WHERE id = $1
          RETURNING *
        `, [
            dao.id,
            dao.user_id, dao.product_id, dao.analyst_id, dao.owner_id, dao.event_id,
            dao.event_data, dao.page_url, dao.timestamp, dao.seller_id, dao.web_id,
            dao.session_id, dao.referrer, dao.geolocation, updatedAt, dao.user_agent
        ]);

        return result.rows[0];
    }

    async delete(id: number): Promise<RawEvent> {
        const result = await pool.query(`
            DELETE FROM raw_events
            WHERE id = $1
            RETURNING *
        `, [id]);
        return result.rows[0];
    }

    async getOne(id: number): Promise<RawEvent> {
        const result = await pool.query(`
            SELECT * FROM raw_events
            WHERE id = $1
        `, [id]);
        return result.rows[0];
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////


    async getActiveUsersDaily(web_id: number): Promise<RawEvent[]> {
        const result = await pool.query(`
            SELECT 
                DATE_TRUNC('day', timestamp) AS day, 
                COUNT(DISTINCT session_id) AS active_users
            FROM raw_events
            WHERE session_id IS NOT NULL 
                AND ($1::INT IS NULL OR web_id = $1)
            GROUP BY day
            ORDER BY day ASC
            LIMIT 30
        `, [web_id]);

        return result.rows;
    }

    async getAverageSessionTime(web_id: number): Promise<RawEvent[]> {
        const result = await pool.query(`
            SELECT
                DATE_TRUNC('day', timestamp_day) AS day,
                AVG(last_duration) AS avg_time
            FROM (
                SELECT
                    session_id,
                    DATE_TRUNC('day', timestamp) AS timestamp_day,
                    (array_agg(CAST(event_data->>'duration' AS INTEGER) 
                ORDER BY timestamp DESC))[1] AS last_duration
                FROM raw_events
                WHERE 
                    event_data->>'duration' IS NOT NULL 
                    AND session_id IS NOT NULL
                    AND ($1::INT IS NULL OR web_id = $1)
                GROUP BY session_id, DATE_TRUNC('day', timestamp)
            ) AS session_data
            GROUP BY timestamp_day
            ORDER BY timestamp_day ASC
            LIMIT 30
          `, [web_id]);

        return result.rows;
    }

    async getTopPages(web_id: number): Promise<RawEvent[]> {
        const result = await pool.query(`
            SELECT
                REGEXP_REPLACE(page_url, 'http://localhost:[0-9]+', '') as page_url,
                COUNT(*) AS visits
            FROM raw_events
            WHERE event_data::text NOT LIKE '%scrollTop%'
                AND event_data::text NOT LIKE '%scrollPercentage%'
                AND page_url IS NOT NULL
                AND ($1::INT IS NULL OR web_id = $1)
            GROUP BY REGEXP_REPLACE(page_url, 'http://localhost:[0-9]+', '')
            ORDER BY visits DESC
        `, [web_id]);

        return result.rows;
    }


    async getAvgTime(webId: number): Promise<RawEvent[]> {
        const result = await pool.query(`
        WITH session_durations AS (
            SELECT
                session_id,
                DATE_TRUNC('day', "timestamp") AS timestamp_day,
                (array_agg(CAST(event_data->>'duration' AS INTEGER) 
                 ORDER BY "timestamp" DESC))[1] AS last_duration,
                COUNT(*) as events_count,
                COUNT(DISTINCT page_url) as unique_pages
            FROM raw_events
            WHERE 
                event_data->>'duration' IS NOT NULL 
                AND session_id IS NOT NULL
                AND web_id = $1
            GROUP BY 
                session_id, 
                DATE_TRUNC('day', "timestamp")
        )
        SELECT
            timestamp_day AS day,
            AVG(last_duration) AS avg_session_time,
            MAX(last_duration) AS max_session_time,
            SUM(last_duration) AS total_site_time,
            COUNT(DISTINCT session_id) AS total_sessions,
            AVG(events_count) AS avg_events_per_session,
            AVG(unique_pages) AS avg_pages_per_session,
            COUNT(CASE WHEN events_count = 1 THEN 1 END)::FLOAT / 
                COUNT(*) * 100 AS bounce_rate
        FROM session_durations
        GROUP BY timestamp_day
        ORDER BY timestamp_day DESC
        LIMIT 30

    `, [webId]);

        return result.rows;
    }


    async getAnalysisData(webId: number): Promise<RawEvent[]> {
        const result = await pool.query(`
            WITH scroll_events AS (
                SELECT 
                    session_id,
                    DATE_TRUNC('second', timestamp) as time_window,
                    AVG(CAST(event_data->>'duration' AS FLOAT)) as avg_duration,
                    COUNT(*) as scroll_count
                FROM raw_events
                WHERE web_id = $1
                    AND timestamp >= NOW() - INTERVAL '30 days'
                    AND event_id = 4  -- События скролла
                GROUP BY session_id, DATE_TRUNC('second', timestamp)
            ),
            non_scroll_events AS (
                SELECT 
                    CAST(event_data->>'duration' AS FLOAT) as duration
                FROM raw_events
                WHERE web_id = $1
                    AND timestamp >= NOW() - INTERVAL '30 days'
                    AND event_id != 4
            ),
            combined_events AS (
                SELECT duration FROM non_scroll_events
                UNION ALL
                SELECT avg_duration FROM scroll_events
            )   
            SELECT 
                FLOOR(duration/100)*100 as duration_range,
                COUNT(*) as event_count
            FROM combined_events
            GROUP BY duration_range
            ORDER BY duration_range;
        `, [webId]);

        return result.rows;
    }




    ////////////////////////////////////////////////////////


    // Метрика: Ключевые события
    async getKeyEvents(): Promise<{ event_type: string, count: number }[]> {
        const result = await pool.query(`
            SELECT event_type, COUNT(*) as count
            FROM raw_events
            GROUP BY event_type
            ORDER BY count DESC
        `);
        return result.rows;
    }

    // Метрика: Активные пользователи
    async getActiveUsers(startDate: string, endDate: string): Promise<number> {
        const result = await pool.query(`
            SELECT COUNT(DISTINCT user_id) as active_users
            FROM raw_events
            WHERE timestamp BETWEEN $1 AND $2
        `, [startDate, endDate]);
        return result.rows[0].active_users;
    }

    // Метрика: Покупки
    async getPurchases(): Promise<number> {
        const result = await pool.query(`
            SELECT COUNT(*) as purchases
            FROM raw_events
            WHERE event_type = 'purchase'
        `);
        return result.rows[0].purchases;
    }

    // Метрика: Новые пользователи
    async getNewUsers(startDate: string, endDate: string): Promise<number> {
        const result = await pool.query(`
            SELECT COUNT(DISTINCT user_id) as new_users
            FROM raw_events
            WHERE timestamp BETWEEN $1 AND $2
            AND user_id NOT IN (
                SELECT DISTINCT user_id
                FROM raw_events
                WHERE timestamp < $1
            )
        `, [startDate, endDate]);
        return result.rows[0].new_users;
    }

    // Метрика: Вернувшиеся пользователи
    async getReturningUsers(startDate: string, endDate: string): Promise<number> {
        const result = await pool.query(`
            SELECT COUNT(DISTINCT user_id) as returning_users
            FROM raw_events
            WHERE timestamp BETWEEN $1 AND $2
            AND user_id IN (
                SELECT DISTINCT user_id
                FROM raw_events
                WHERE timestamp < $1
            )
        `, [startDate, endDate]);
        return result.rows[0].returning_users;
    }



    ////////////////////////////////////////////////////////////////




    async getUniquePages(webId: number): Promise<string[]> {
        const result = await pool.query(`
            SELECT DISTINCT page_url
            FROM raw_events
            WHERE web_id = $1
            AND timestamp >= NOW() - INTERVAL '30 days'
            ORDER BY page_url
        `, [webId]);

        return result.rows.map(row => row.page_url);
    }

    async getClickHeatmapData(webId: number, pageUrl: string): Promise<ClickHeatmapData[]> {
        const result = await pool.query(`
            SELECT 
                event_data::jsonb->'x' as x,
                event_data::jsonb->'y' as y,
                COUNT(*) as click_count
            FROM raw_events
            WHERE 
                web_id = $1
                AND regexp_replace(regexp_replace(page_url, '^https?://[^/]+', ''), ':\d+', '') = regexp_replace(regexp_replace($2, '^https?://[^/]+', ''), ':\d+', '')
                AND event_id = 2
                AND timestamp >= NOW() - INTERVAL '30 days'
                AND event_data::jsonb ? 'x'
                AND event_data::jsonb ? 'y'
            GROUP BY event_data::jsonb->'x', event_data::jsonb->'y'
            ORDER BY click_count DESC;
        `, [webId, pageUrl]);

        return result.rows.map(row => ({
            eventData: {
                x: Number(row.x),
                y: Number(row.y)
            },
            clickCount: Number(row.click_count)
        }));
    }

    async getScrollHeatmapData(webId: number, pageUrl: string): Promise<ScrollHeatmapData[]> {
        const result = await pool.query(`
            SELECT 
                event_data::jsonb as event_data,
                COUNT(*) as scroll_count
            FROM raw_events
            WHERE web_id = $1 
                AND page_url = $2
                AND event_id = 4  -- ID для событий скролла
                AND timestamp >= NOW() - INTERVAL '30 days'
                AND event_data::jsonb ? 'scrollTop'
                AND event_data::jsonb ? 'scrollPercentage'
            GROUP BY event_data
        `, [webId, pageUrl]);

        return result.rows.map(row => ({
            eventData: JSON.parse(row.event_data),
            scrollCount: parseInt(row.scroll_count)
        }));
    }

    async getPageHeatmap(webId: number, pageUrl: string): Promise<RawEvent[]> {
        const result = await pool.query(`
            SELECT *
            FROM raw_events
            WHERE web_id = $1 
                AND page_url = $2
                AND timestamp >= NOW() - INTERVAL '30 days'
            ORDER BY timestamp DESC
        `, [webId, pageUrl]);

        return result.rows;
    }


    //////////////////////////////////////////////////////////////


    async getHistorySessions(webId: number): Promise<RawEvent[]> {
        const result = await pool.query(`
            SELECT
                session_id,
                MIN(timestamp) as session_start,
                MAX(timestamp) as session_end,
                COUNT(*) as events_count,
                COUNT(DISTINCT page_url) as pages_visited,
                MAX(duration) as session_duration,
                STRING_AGG(DISTINCT REGEXP_REPLACE(page_url, 'http://localhost:[0-9]+', ''), ', ') as visited_pages,
                MIN(referrer) as traffic_source,
                JSON_BUILD_OBJECT(
                    'city', MIN(geolocation->>'city'),
                    'country', MIN(geolocation->>'country'),
                    'region', MIN(geolocation->>'region'),
                    'timezone', MIN(geolocation->>'timezone')
                ) as location_info
            FROM raw_events
            WHERE
                web_id = $1
                AND session_id IS NOT NULL
                AND timestamp >= CURRENT_DATE - INTERVAL '30 days'
            GROUP BY session_id
            ORDER BY session_start DESC
            --LIMIT 100
        `, [webId]);

        return result.rows;
    }


    async getHistoryOneSession(webId: number, session_id: string): Promise<RawEvent[]> {
        const result = await pool.query(`
            SELECT
                session_id,
                MIN(timestamp) as session_start,
                MAX(timestamp) as session_end,
                COUNT(*) as events_count,
                COUNT(DISTINCT page_url) as pages_visited,
                MAX(duration) as session_duration,
                STRING_AGG(DISTINCT REGEXP_REPLACE(page_url, 'http://localhost:[0-9]+', ''), ', ') as visited_pages,
                MIN(referrer) as traffic_source,
                JSON_BUILD_OBJECT(
                    'city', MIN(geolocation->>'city'),
                    'country', MIN(geolocation->>'country'),
                    'region', MIN(geolocation->>'region'),
                    'timezone', MIN(geolocation->>'timezone')
                ) as location_info
            FROM raw_events
            WHERE
                web_id = $1
                AND session_id = $2
                AND timestamp >= CURRENT_DATE - INTERVAL '30 days'
            GROUP BY session_id
            ORDER BY session_start DESC
            --LIMIT 100
            `, [webId, session_id]);

        return result.rows;
    }


    ////////////////////////////////////////////



}

const eventDal = new EventDal();
export default eventDal;