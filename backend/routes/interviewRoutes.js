/*
This file defines four APIs:
Company/Admin
Schedule an interview
Student
View upcoming interview schedule
View interview history */

const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const {
    scheduleInterview, 
    getStudentSchedule,
    getStudentHistoryLogs
} = require('../controllers/interviewController');

// All interview routes require the user to be logged in
router.use(protect);

// Company & Admin Routes (For setting up interviews)
router.post('/schedule', authorizeRoles('Company', 'Admin'), scheduleInterview);

// Student Routes
router.get('/my-schedule', authorizeRoles('Student'), getStudentSchedule);    // Upcoming interviews
router.get('/my-history', authorizeRoles('Student'), getStudentHistoryLogs);  // Shows completed interview history. (selected, rejected)

module.exports = router;