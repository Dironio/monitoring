import pool from "../pool";
import bcrypt from "bcrypt";
import { CreateUserDao, UpdateUserDao } from './types/user.dao'
import { User } from "../services/types/user.dto";


class UserDal {
    async create(dao: CreateUserDao): Promise<User> {
        const { username, email, password, first_name, last_name } = dao;
        const createdAt = new Date();

        const hashedPassword = await bcrypt.hash(password, 10);

        const defaultRoleId = 1;

        const result = await pool.query(`
            INSERT INTO users (username, email, password, first_name, last_name, role_id, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
            `,
            [username, email, hashedPassword, first_name, last_name, defaultRoleId, createdAt]
        );

        return result.rows[0];
    }

    async getAll(): Promise<User[]> {
        const result = await pool.query(`
            SELECT users.id, username, email, password, first_name, last_name, role_id, role, created_at, updated_at
            FROM users
            JOIN roles on users.role_id = roles.id
        `);

        return result.rows;
    }

    async getOne(userId: number): Promise<User> {
        const result = await pool.query(`
            SELECT users.*, roles.role as role 
            FROM users
            JOIN roles on users.role_id = roles.id
            WHERE users.id = $1`,
            [userId]
        );

        return result.rows[0];
    }

    async getUserByIndentity({ username, email }: { username: string; email: string }): Promise<User> {
        const result = await pool.query(`
            SELECT * FROM users
            WHERE username = $1 or email = $2`,
            [username, email]
        );

        return result.rows[0];
    }

    async getUserByUsername(username: string): Promise<User> {
        const result = await pool.query(`
            SELECT * FROM users
            WHERE username = $1`,
            [username]
        );

        return result.rows[0];
    }

    async getUserByEmail(email: string): Promise<User> {
        const result = await pool.query(`
            SELECT * FROM users
            WHERE email = $1`,
            [email]
        );

        return result.rows[0];
    }


    async update(dao: UpdateUserDao): Promise<User> {
        const { id, username, email, password, first_name, last_name } = dao;
        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

        const result = await pool.query(`
            UPDATE users
            SET 
                username = COALESCE($2, username), 
                email = COALESCE($3, email),
                password = COALESCE($4, password),
                first_name = COALESCE($5, first_name),
                last_name = COALESCE($6, last_name)
            WHERE id = $1
            RETURNING *`,
            [id, username, email, hashedPassword, first_name, last_name]
        );

        return result.rows[0];
    }

    async delete(id: number): Promise<User> {
        const result = await pool.query(`
            DELETE FROM users
            WHERE id = $1
            RETURNING *`,
            [id]
        );
        return result.rows[0];
    }


    async getRoleById(role_id: number): Promise<User> {
        const result = await pool.query(`
            SELECT * FROM roles WHERE id = $1
        `, [role_id]);

        if (!result.rows[0]) {
            throw new Error('Role not found');
        }

        console.log(result);

        return result.rows[0];
    }
}

const userDal = new UserDal();
export default userDal;