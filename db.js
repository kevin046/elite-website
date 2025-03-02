const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        require: true,
        rejectUnauthorized: false
    },
    max: 1, // Adjust for serverless
    connectionTimeoutMillis: 5000
});

// Add error handling for the pool
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

// Add connection testing
pool.on('connect', () => {
    console.log('Database connected successfully');
});

module.exports = {
    query: async (text, params) => {
        const client = await pool.connect();
        try {
            return await client.query(text, params);
        } finally {
            client.release();
        }
    },
    pool
}; 