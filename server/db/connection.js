import pg from 'pg'
import env from "dotenv"
env.config();

const db = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
        process.env.NODE_ENV === 'production'
        ? {rejectUnauthorized:false} 
        : false,
});

export default db;