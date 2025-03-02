const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();

// Configure CORS
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:5000',
        'https://eliterenovationworks.ca',
        'https://www.eliterenovationworks.ca'
    ],
    credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Test database connection endpoint
app.get('/api/test-db', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.json({ success: true, time: result.rows[0].now });
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

// Get all estimates with filters
app.get('/api/estimates', async (req, res) => {
    try {
        const { startDate, endDate, status } = req.query;
        let query = 'SELECT * FROM estimates WHERE 1=1';
        const params = [];

        if (startDate) {
            params.push(startDate);
            query += ` AND created_at >= $${params.length}`;
        }
        if (endDate) {
            params.push(endDate);
            query += ` AND created_at <= $${params.length}`;
        }
        if (status) {
            params.push(status);
            query += ` AND status = $${params.length}`;
        }

        query += ' ORDER BY created_at DESC';
        
        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get estimate by ID
app.get('/api/estimates/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(
            'SELECT * FROM estimates WHERE id = $1',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Estimate not found' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// For Vercel serverless deployment
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export for Vercel
module.exports = app; 