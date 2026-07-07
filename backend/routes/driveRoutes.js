const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { createDrive, getAllDrives, getDriveById } = require('../controllers/driveController');

// All endpoints in this ecosystem require user validation
router.use(protect);

// Enforce identity verification on both endpoints securely
router.route('/')
    .get(getAllDrives) 
    .post(authorizeRoles('Company'), createDrive); // Keep your exact middleware check string

router.get('/:id', getDriveById);

module.exports = router;