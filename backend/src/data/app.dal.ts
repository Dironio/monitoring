import pool from "../pool";
import { Application } from "../services/@types/app.dto";
import { CreateApplicationDao, UpdateApplicationDao } from './@types/app.dao';


class AppDal {
    async create(dao: CreateApplicationDao): Promise<Application> {
        const result = await pool.query(``)

        return result.rows[0];
    }

    async getAll(): Promise<Application> {
        const result = await pool.query(``)

        return result.rows[0];
    }

    async update(dao: UpdateApplicationDao): Promise<Application> {
        const result = await pool.query(``)

        return result.rows[0];
    }

    async delete(id: number): Promise<Application> {
        const result = await pool.query(``)

        return result.rows[0];
    }

    async getOne(id: number): Promise<Application> {
        const result = await pool.query(``)

        return result.rows[0];
    }
}

const appDal = new AppDal();
export default appDal;