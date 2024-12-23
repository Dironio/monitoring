import pool from "../pool";
import { RawEvent } from "../services/@types/event.dto";
import { CreateEventDao } from './@types/event.dao'


class EventDal {
    async create(dao: CreateEventDao): Promise<RawEvent> {
        const result = await pool.query(``)

        return result.rows[0];
    }

    async getAll(): Promise<RawEvent> {
        const result = await pool.query(``)

        return result.rows[0];
    }

    async update(dao: CreateEventDao): Promise<RawEvent> {
        const result = await pool.query(``)

        return result.rows[0];
    }

    async delete(id: number): Promise<RawEvent> {
        const result = await pool.query(``)

        return result.rows[0];
    }

    async getOne(dao: CreateEventDao): Promise<RawEvent> {
        const result = await pool.query(``)

        return result.rows[0];
    }
}

const eventDal = new EventDal();
export default eventDal;