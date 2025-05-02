const nodemailer = require('nodemailer');
const Email = require('../models/Email');


// Create a function to send email using Nodemailer
const sendEmail = async (req, res) => {

    const {text,language}  = req.body;

    // Create transporter using your email service credentials
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.USER,
          pass: process.env.APP_PASSWORD,
        },
    });

    const mailOptions = {
        from: {
            name: 'GTN COMPANY',
            address: process.env.USER
        },
        to: 'milindahashan50@gmail.com',
        subject: `Add New Translation`,
        text: `Key: ${text} \n Language: ${language}`,
    };

    try {
        //send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);

        //save the email details into mongodb
        const newEmail = new Email({
            to: mailOptions.to,
            subject: mailOptions.subject,
            body: mailOptions.text,
        });

        await newEmail.save();

        res.status(201).json({message: 'Email sent and saved successfully', data: info.response});

    } catch (error) {
        console.log('Error sending email: ',error);
        res.status(500).json({message: 'Error sending email', error: error.message});
    }
};

module.exports = { sendEmail };