const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { 
    updateApplicationStatus, 
    scheduleInterview, 
    getStudentSchedule,
    getStudentHistoryLogs
} = require('../controllers/interviewController');

// All interview routes require the user to be logged in
router.use(protect);

// Company & Admin Routes (For updating stage status or setting up interviews)
router.put('/status/:applicationId', authorizeRoles('Company', 'Admin'), updateApplicationStatus);
router.post('/schedule', authorizeRoles('Company', 'Admin'), scheduleInterview);

// Student Routes (For pulling down personalized upcoming slots)
router.get('/my-schedule', authorizeRoles('Student'), getStudentSchedule);
router.get('/my-history', authorizeRoles('Student'), getStudentHistoryLogs);

module.exports = router;