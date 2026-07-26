const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { createDrive, getAllDrives, getDriveById } = require('../controllers/driveController');

// Apply Authentication
router.use(protect);

// router.route('/') represents /api/drives
router.route('/')
    .get(getAllDrives) 
    .post(authorizeRoles('Company'), createDrive); // Should only be done by companies.

router.get('/:id', getDriveById);  // Get a specific drive by ID. This can be accessed by both students and companies.

module.exports = router;