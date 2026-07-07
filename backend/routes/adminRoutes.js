const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { 
    getAdminStats, 
    getReportData, 
    getStudentDashboardMetrics,
    getPendingCompanies,
    approveCompany,
    getCompanyProfile 
} = require('../controllers/adminController');

router.use(protect);

// Admin exclusive routes
router.get('/dashboard-stats', authorizeRoles('Admin'), getAdminStats);
router.get('/reports/:type', authorizeRoles('Admin'), getReportData);

// Student accessible analytical metrics
router.get('/student-metrics', authorizeRoles('Student'), getStudentDashboardMetrics);

// Company approvals routing array
router.get('/pending-companies', authorizeRoles('Admin'), getPendingCompanies);
router.put('/approve-company/:id', authorizeRoles('Admin'), approveCompany);

// Fetch company metadata profiles 
router.get('/company-profile/:id', authorizeRoles('Admin'), getCompanyProfile);

module.exports = router;