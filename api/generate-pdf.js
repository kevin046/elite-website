import { generatePDF } from '../admin/generate-pdf';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { templateType, data } = req.body;
        const pdfPath = await generatePDF(templateType, data);
        
        const pdfBuffer = fs.readFileSync(pdfPath);
        fs.unlinkSync(pdfPath); // Clean up the file

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${templateType}-${Date.now()}.pdf`);
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
} 