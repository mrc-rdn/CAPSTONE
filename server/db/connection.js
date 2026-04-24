import pg from 'pg'
import env from "dotenv"
env.config();

const db = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
        process.env.NODE_ENV === 'production'
        ? {rejectUnauthorized:false} 
        : false,
    // user: process.env.PG_USER,
    // host: process.env.PG_HOST,
    // database: process.env.PG_DATABASE,
    // password: process.env.PG_PASSWORD,
    // port: process.env.PG_PORT,
    
});

// Confirm Neon DB connection
db.connect((err, client, release) => {
    if (err) {
        console.error("❌ Failed to connect to Neon Database:", err.message );
    } else {
        console.log("✅ Successfully connected to Neon Database " );
        release(); // release client back to pool
    }
});

export default db;