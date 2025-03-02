const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');
const { generatePDF } = require('./templates/generate-pdf');
const fs = require('fs').promises;
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

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

// Test database connection
app.get('/api/test-db', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.json({ success: true, time: result.rows[0].now });
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

// Get all estimates
app.get('/api/estimates', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM estimates ORDER BY created_at DESC');
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
        const result = await db.query('SELECT * FROM estimates WHERE id = $1', [id]);
        
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