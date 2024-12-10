import pool from "../pool";
import bcrypt from "bcrypt";

class UserDal {
    async create(dao: CreateUserDao): Promise<User> {
        const { username, email, password, firstName, lastName, img, age, birthday, gender } = dao;
        const createdAt = new Date();

        const hashedPassword = await bcrypt.hash(password, 10);

        const defaultRoleId = 2;

        const result = await pool.query(`
            INSERT INTO users (username, email, password, first_name, last_name, img, age, birthday, gender, role_id, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *`,
            [username, email, hashedPassword, firstName, lastName, img, age, birthday, gender, defaultRoleId, createdAt]
        );

        return result.rows[0];
    }

    async getAll(): Promise<User[]> {
        const result = await pool.query(`
            SELECT users.id, username, email, "password", first_name, last_name, img, age, birthday, gender, role_id, role, created_at, updated_at
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


    async update(dao: UpdateUserDao): Promise<User> {
        const { id, username, email, password, firstName, lastName, img, age, birthday, gender, role_id } = dao;
        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

        const result = await pool.query(`
            UPDATE users
            SET 
                username = COALESCE($2, username), 
                email = COALESCE($3, email),
                password = COALESCE($4, password),
                first_name = COALESCE($5, first_name),
                last_name = COALESCE($6, last_name),
                img = COALESCE($7, img),
                age = COALESCE($8, age),
                birthday = COALESCE($9, birthday),
                gender = COALESCE($10, gender),
                role_id = COALESCE($11, role_id)
            WHERE id = $1
            RETURNING *`,
            [id, username, email, hashedPassword, firstName, lastName, img, age, birthday, gender, role_id]
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
}

const userDal = new UserDal();
export default userDal;