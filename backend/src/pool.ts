import { Pool } from "pg";
import { config } from "dotenv";

config({ path: './.env' });


const pool = new Pool({
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
});


export default pool;