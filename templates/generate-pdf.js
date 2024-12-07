const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

async function generatePDF(data) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        // Read the HTML template
        const templatePath = path.join(__dirname, 'estimate_template.html');
        const templateHtml = fs.readFileSync(templatePath, 'utf8');
        
        // Compile template with Handlebars
        const template = Handlebars.compile(templateHtml);
        const html = template(data);
        
        // Set content and generate PDF
        await page.setContent(html);
        
        // Create output directory if it doesn't exist
        const outputDir = path.join(__dirname, '../output');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }
        
        const pdfPath = path.join(outputDir, `estimate-${Date.now()}.pdf`);
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
        console.error('PDF Generation Error:', error);
        throw error;
    }
}

module.exports = { generatePDF }; 