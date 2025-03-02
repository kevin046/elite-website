const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

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

// Create new estimate
app.post('/api/estimates', async (req, res) => {
    try {
        const { estimate_number, client_name, client_email, client_phone, client_address, 
                project_description, payment_method, line_items, subtotal, tax, total } = req.body;
        
        const result = await db.query(
            `INSERT INTO estimates (
                estimate_number, client_name, client_email, client_phone, client_address,
                project_description, payment_method, line_items, subtotal, tax, total
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
            [estimate_number, client_name, client_email, client_phone, client_address,
             project_description, payment_method, line_items, subtotal, tax, total]
        );
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 