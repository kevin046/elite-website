const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generatePDF(templateName, data) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        // Read the HTML template
        const templatePath = path.join(__dirname, `${templateName}_template.html`);
        console.log('Template Path:', templatePath); // Debug log
        
        let html = fs.readFileSync(templatePath, 'utf8');
        console.log('Data received:', data); // Debug log
        
        // Replace placeholders with actual data
        Object.keys(data).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            html = html.replace(regex, data[key] || '');
        });
        
        // Set content and generate PDF
        await page.setContent(html);
        const outputDir = path.join(__dirname, '../output');
        
        // Create output directory if it doesn't exist
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        const pdfPath = path.join(outputDir, `${templateName}-${Date.now()}.pdf`);
        console.log('PDF Path:', pdfPath); // Debug log
        
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            }
        });

        await browser.close();
        return pdfPath;
    } catch (error) {
        console.error('Error in generatePDF:', error);
        throw error;
    }
}

module.exports = { generatePDF }; 