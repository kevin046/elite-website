const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const { generatePDF } = require('./templates/generate-pdf');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        require: true
    }
});

app.post('/api/generate-pdf', async (req, res) => {
    try {
        const data = req.body;
        console.log('Generating PDF with data:', data);
        
        const pdfPath = await generatePDF(data);
        const pdfBuffer = await fs.readFile(pdfPath);
        
        // Clean up the file
        await fs.unlink(pdfPath);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=estimate-${data.estimateNumber}.pdf`);
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
});

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
        
        const result = await pool.query(query, params);
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
        const result = await pool.query(
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 