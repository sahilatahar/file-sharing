const nodemailer = require("nodemailer");

function sendMail({ from, to, subject, text, html }) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    let mailDetails = {
        from: from,
        to: to,
        subject: subject,
        text: text,
        html: html
    };

    transporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log(err)
            return { error: err, message: "Email not sent", success: false };
        } else {
            return { message: "Email sent successfully", success: true };
        }
    });
}

module.exports = sendMail;