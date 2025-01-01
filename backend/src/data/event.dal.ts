import pool from "../pool";
import { RawEvent } from "../services/@types/event.dto";
import { CreateEventDao, UpdateEventDao } from './@types/event.dao'


class EventDal {
    async create(dao: CreateEventDao): Promise<RawEvent> {
        const result = await pool.query(`
            INSERT INTO raw_events (user_id, product_id, analyst_id, owner_id, event_type, event_data, page_url, timestamp, seller_id, web_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        `, [dao.user_id, dao.product_id, dao.analyst_id, dao.owner_id, dao.event_type, dao.event_data, dao.page_url, dao.timestamp, dao.seller_id, dao.web_id]);

        return result.rows[0];
    }

    async getAll(): Promise<RawEvent[]> {
        const result = await pool.query(`
            SELECT * FROM raw_events
            ORDER BY timestamp DESC
            LIMIT 50
        `);
        return result.rows;
    }

    async update(dao: UpdateEventDao): Promise<RawEvent> {
        const result = await pool.query(`
            UPDATE raw_events
            SET event_data = $1
            WHERE id = $2
            RETURNING *
        `, [dao.event_data, dao.id]);
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