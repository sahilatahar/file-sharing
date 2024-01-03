const router = require('express').Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const File = require('../models/file');
const sendRoute = require('./send');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './uploads/'),
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 * 10 }
}).single('file');


router.use('/send', sendRoute);

router.post('/upload', (req, res) => {
    // Store file
    upload(req, res, async (err) => {
        // Validate request
        if (!req.file) {
            return res.status(400).json({ error: "All fields are required" });
        }

        if (err) {
            return res.status(500).send({ error: err.message });
        }
        // Store into database
        const file = new File({
            filename: req.file.filename,
            uuid: uuidv4(),
            path: req.file.path,
            size: req.file.size
        });

        const response = await file.save();
        // Response -> link
        return res.json({ shareLink: `${process.env.APP_BASE_URL}/file/${response.uuid}` });
    });
});



module.exports = router;