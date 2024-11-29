const nodemailer = require("nodemailer");
const { generatePDF } = require("../admin/generate-pdf");

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { name, email, phone, service, message } = req.body;

    try {
        // Generate PDF
        const pdfPath = await generatePDF('estimation_template', {
            name,
            email,
            phone,
            service,
            message
        });

        // Configure Nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Email options with PDF attachment
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: "wei.ye@eliterenovationworks.ca",
            subject: `New Quote Request from ${name}`,
            text: `New quote request received. Please see attached PDF.`,
            attachments: [{
                filename: 'estimation.pdf',
                path: pdfPath
            }]
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Quote request sent successfully!" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to process request" });
    }
} 