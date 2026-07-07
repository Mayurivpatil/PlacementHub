const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { 
    applyToDrive, 
    getStudentApplications, 
    getDriveApplicants,
    updateApplicationStatus 
} = require('../controllers/applicationController');

// All routes inside this file require a logged-in user
router.use(protect);

// Student actions
router.post('/apply/:driveId', authorizeRoles('Student'), applyToDrive);
router.get('/my-applications', authorizeRoles('Student'), getStudentApplications);

// Company actions
router.get('/drive/:driveId', authorizeRoles('Company'), getDriveApplicants);
router.put('/status/:id', authorizeRoles('Company'), updateApplicationStatus); 

module.exports = router;