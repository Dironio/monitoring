import pool from "../pool";
import { RawEvent } from "../services/@types/event.dto";
import { CreateEventDao, UpdateEventDao } from './@types/event.dao'


class EventDal {
    async create(dao: CreateEventDao): Promise<RawEvent> {
        const currentTimestamp = new Date().toISOString();

        const result = await pool.query(`
          INSERT INTO raw_events (
            user_id, product_id, analyst_id, owner_id, event_id, event_data,
            page_url, timestamp, seller_id, web_id, session_id, referrer, geolocation,
            created_at, updated_at
          )
          VALUES (\$1, \$2, \$3, \$4, \$5, \$6, \$7, \$8, \$9, \$10, \$11, \$12, \$13, \$14, $15)
          RETURNING *
        `, [
            dao.user_id, dao.product_id, dao.analyst_id, dao.owner_id, dao.event_id,
            dao.event_data, dao.page_url, dao.timestamp, dao.seller_id, dao.web_id,
            dao.session_id, dao.referrer, dao.geolocation, currentTimestamp, currentTimestamp
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
          WHERE id = $1
          RETURNING *
        `, [
            dao.id,
            dao.user_id, dao.product_id, dao.analyst_id, dao.owner_id, dao.event_id,
            dao.event_data, dao.page_url, dao.timestamp, dao.seller_id, dao.web_id,
            dao.session_id, dao.referrer, dao.geolocation, updatedAt
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
            ORDER BY day DESC
            LIMIT 30
        `, [web_id]);

        return result.rows;
    }

    async getAverageSessionTime(): Promise<RawEvent[]> {
        const result = await pool.query(`
            SELECT 
                DATE_TRUNC('day', timestamp_day) AS day,  
                AVG(session_duration) AS avg_time
            FROM (
                SELECT 
                    session_id,
                    DATE_TRUNC('day', "timestamp") AS timestamp_day,
                    SUM(CAST(event_data->>'duration' AS INTEGER)) AS session_duration
                FROM raw_events
                WHERE event_data->>'duration' IS NOT NULL AND session_id IS NOT NULL
                GROUP BY session_id, DATE_TRUNC('day', "timestamp")
            ) AS session_data
            GROUP BY timestamp_day
            ORDER BY timestamp_day DESC
            LIMIT 30
          `);

        return result.rows;
    }

    async getTopPages(): Promise<RawEvent[]> {
        const result = await pool.query(`
            SELECT 
                page_url, 
                COUNT(*) AS visits
            FROM raw_events
            WHERE event_data::text NOT LIKE '%scrollTop%'
                AND event_data::text NOT LIKE '%scrollPercentage%'
                AND page_url IS NOT NULL
            GROUP BY page_url
            ORDER BY visits DESC
            --LIMIT 10
        `);

        return result.rows;
    }


    async getAvgTime(): Promise<RawEvent[]> {
        const result = await pool.query(`
        SELECT 
            timestamp_day AS day,
            AVG(session_duration) AS avg_session_time,
            MAX(session_duration) AS max_session_time,
            SUM(session_duration) AS total_site_time,
            COUNT(DISTINCT session_id) AS total_sessions
        FROM (
            SELECT 
                session_id,
                DATE_TRUNC('day', "timestamp") AS timestamp_day,
                SUM(CAST(event_data->>'duration' AS INTEGER)) AS session_duration
            FROM raw_events
            WHERE event_data->>'duration' IS NOT NULL AND session_id IS NOT NULL
            GROUP BY session_id, DATE_TRUNC('day', "timestamp")
        ) AS session_data
        GROUP BY timestamp_day
        ORDER BY timestamp_day DESC
        LIMIT 30
    `);

        return result.rows;
    }










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
}

const eventDal = new EventDal();
export default eventDal;