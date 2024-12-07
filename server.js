const express = require('express');
const cors = require('cors');
const { generatePDF } = require('./templates/generate-pdf');
const fs = require('fs').promises;
const path = require('path');

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

app.get('/api/estimates', async (req, res) => {
    try {
        const estimates = JSON.parse(await fs.readFile(ESTIMATES_FILE, 'utf8'));
        res.json(estimates);
    } catch (error) {
        console.error('Error reading estimates:', error);
        res.status(500).json({ error: 'Failed to load estimates' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 