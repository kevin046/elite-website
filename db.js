const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        require: true,
        rejectUnauthorized: false
    },
    max: 1,
    idleTimeoutMillis: 120000,
    connectionTimeoutMillis: 10000
});

// Add error handling for the pool
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

// Add connection testing
pool.on('connect', () => {
    console.log('Database connected successfully');
});

module.exports = {
    query: async (text, params) => {
        const client = await pool.connect();
        try {
            const start = Date.now();
            const result = await client.query(text, params);
            const duration = Date.now() - start;
            console.log('Executed query', { text, duration, rows: result.rowCount });
            return result;
        } finally {
            client.release();
        }
    },
    pool
}; 