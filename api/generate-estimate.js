const { generatePDF } = require('../admin/generate-pdf');
const fs = require('fs').promises;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Get form data
        const data = req.body;
        
        // Generate PDF using the template
        const pdfPath = await generatePDF('estimation', data);
        
        // Read the generated PDF
        const pdfBuffer = await fs.readFile(pdfPath);
        
        // Clean up the temporary file
        await fs.unlink(pdfPath);

        // Send the PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=estimate-${data.estimateNumber}.pdf`);
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ error: 'Failed to generate PDF', details: error.message });
    }
} 