const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
});

async function sendMail({ to, subject, html }) {
    await transporter.sendMail({
        from: `"Translation Inventory Tool" <no-reply@translation-inventory-tool.com>`,
        to,
        subject,
        html,
    });
};
module.exports = { sendMail };