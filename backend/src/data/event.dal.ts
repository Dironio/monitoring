import pool from "../pool";
import { RawEvent } from "../services/@types/event.dto";
import { CreateEventDao } from './@types/event.dao'


class EventDal {
    async create(dao: CreateEventDao): Promise<RawEvent> {
        const result = await pool.query(`
            INSERT INTO raw_events (user_id, product_id, analyst_id, owner_id, event_type, event_data, page_url, timestamp)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
            `)

        return result.rows[0];
    }

    async getAll(): Promise<RawEvent> {
        const result = await pool.query(`
            SELECT * FROM raw_events
            ORDER BY timestamp DESC
            LIMIT 50
        `);

        return result.rows[0];
    }

    async update(dao: CreateEventDao): Promise<RawEvent> {
        // const { event_data, } = dao;
        const result = await pool.query(`
            UPDATE raw_events
            SET 
            WHERE id = $1
            RETURNING *
            `,
            // [event_data]
        )

        return result.rows[0];
    }

    async delete(id: number): Promise<RawEvent> {
        const result = await pool.query(`
            DELETE FROM raw_events
            WHERE id = $1
            `, [id])

        return result.rows[0];
    }

    async getOne(id: number): Promise<RawEvent> {
        const result = await pool.query(`
            SELECT * FROM raw_events
            WHERE id = $1
            `, [id])

        return result.rows[0];
    }








}

const eventDal = new EventDal();
export default eventDal;