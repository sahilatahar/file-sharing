const router = require('express').Router();
const File = require('../models/file.js');

router.post('/', async (req, res) => {
    const { uuid, emailTo, emailFrom } = req.body;
    // Validate request
    if (!uuid || !emailTo || !emailFrom) {
        return res.status(422).send({ error: "All fields are required" });
    }
    // Get data from database
    const file = await File.findOne({ uuid: uuid });
    if (file.sender) {
        return res.status(422).send({ error: "Email already sent" });
    }
    file.sender = emailFrom;
    file.receiver = emailTo;
    const response = await file.save();
    // Send email
    const sendMail = require('../services/emailService');
    const respond = sendMail({
        from: emailFrom,
        to: emailTo,
        subject: 'File sharing',
        text: `${emailFrom} shared a file with you.`,
        html: require('../services/emailTemplate.js')({
            emailFrom: emailFrom,
            downloadLink: `${process.env.APP_BASE_URL}/file/${file.uuid}`,
            size: parseInt(file.size / 1000) + ' KB',
            expires: '24 hours'
        })
    });
    return res.send(respond);
});

module.exports = router;