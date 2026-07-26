/*
This file provides APIs for:
Student
Apply for a placement drive
View all applications
Company
View students who applied for a drive
Update application status (Selected, Rejected, Interview Scheduled, etc.) */

const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { 
    applyToDrive, 
    getStudentApplications, 
    getDriveApplicants,
    updateApplicationStatus 
} = require('../controllers/applicationController');

// Every API below requires login.
router.use(protect);

// Student actions
router.post('/apply/:driveId', authorizeRoles('Student'), applyToDrive);
router.get('/my-applications', authorizeRoles('Student'), getStudentApplications); // Return all jobs applied by the logged-in student.

// Company actions
router.get('/drive/:driveId', authorizeRoles('Company'), getDriveApplicants);
router.put('/status/:id', authorizeRoles('Company'), updateApplicationStatus); 

module.exports = router;