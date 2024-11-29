const express = require('express');
const cors = require('cors');
const { generatePDF } = require('./admin/generate-pdf');
const fs = require('fs').promises;
const path = require('path');

const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname)));

// Admin route
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin/admin-login.html'));
});

// PDF generation endpoint
app.post('/api/generate-pdf', async (req, res) => {
    try {
        console.log('Received request:', req.body); // Debug log
        const { templateType, data } = req.body;
        
        // Generate PDF
        const pdfPath = await generatePDF(templateType, data);
        console.log('PDF generated at:', pdfPath); // Debug log
        
        // Read the generated PDF
        const pdfBuffer = await fs.readFile(pdfPath);
        
        // Clean up the temporary file
        await fs.unlink(pdfPath);

        // Send the PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${templateType}-${Date.now()}.pdf`);
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ 
            error: 'Failed to generate PDF', 
            details: error.message,
            stack: error.stack 
        });
    }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Server directory: ${__dirname}`);
}); 