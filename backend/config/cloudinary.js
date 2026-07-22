/* This file performs two main tasks:
1) Configures Cloudinary so application can upload files to your Cloudinary account.
2) Configures Multer to receive PDF files from the frontend before sending them to Cloudinary.*/

const cloudinary = require('cloudinary').v2; // Cloudinary provides Version 2 of its API.
const multer = require('multer'); // for uploading PDF files.
const dotenv = require('dotenv');

dotenv.config();

// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Use Multer's memory storage.
const storage = multer.memoryStorage();

// File filter to enforce PDF-only uploads
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        // cb means callback function. The first argument is an error (null means no error), 
        // and the second argument is a boolean indicating whether to accept the file.
        cb(null, true); 
    } else {
        cb(new Error('Invalid file type. Only PDF uploads are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB Limit
});

module.exports = { cloudinary, upload };