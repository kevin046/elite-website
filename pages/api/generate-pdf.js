import { generatePDF } from '../../admin/generate-pdf';
const fs = require('fs').promises;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { templateType, data } = req.body;
        
        // Generate PDF
        const pdfPath = await generatePDF(templateType, data);
        
        // Read the generated PDF
        const pdfBuffer = await fs.readFile(pdfPath);
        
        // Clean up the temporary file
        await fs.unlink(pdfPath);

        // Send the PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${templateType}-${Date.now()}.pdf`);
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ error: 'Failed to generate PDF', details: error.message });
    }
} 