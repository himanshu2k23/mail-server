const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();
const cors = require('cors');


const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.post('/send-mail', (req, res) => {
    const { firstName, lastName, email, message } = req.body;

    if (!firstName || !lastName || !email || !message) {
        return res.status(400).send('All fields are required.');
    }
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Set up email data
    const mailOptions = {
        from: process.env.FROM,
        to: process.env.TO,
        subject: `Message from ${firstName} ${lastName}`,
        text: `You have a new message from ${firstName} ${lastName} (${email}):\n\n${message}`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send('Error sending email: ' + error.message);
        }
        res.status(200).send('Email sent: ' + info.response);
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
