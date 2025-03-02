const express = require('express');
const db = require('./db');
const app = express();

app.use(express.json());

// Example endpoint to handle form submissions
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, phone, service, message } = req.body;
        
        const query = `
            INSERT INTO contact_submissions (name, email, phone, service, message)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        
        const values = [name, email, phone, service, message];
        const result = await db.query(query, values);
        
        res.json({
            success: true,
            message: 'Form submitted successfully',
            data: result.rows[0]
        });
    } catch (err) {
        console.error('Error submitting form:', err);
        res.status(500).json({
            success: false,
            message: 'Error submitting form'
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 