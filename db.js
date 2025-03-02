const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        require: true
    }
});

// Add connection error handling
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

// Add connection testing
pool.on('connect', () => {
    console.log('Database connected successfully');
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
}; 