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
router.get('/dashboard-stats', authorizeRoles('Admin'), getAdminStats);  // Returns dashboard statistics.
router.get('/reports/:type', authorizeRoles('Admin'), getReportData);   // Generates different reports depending on - req.params.type

// Company approvals routing array
router.get('/pending-companies', authorizeRoles('Admin'), getPendingCompanies);    // Returns companies waiting for approval.
router.put('/approve-company/:id', authorizeRoles('Admin'), approveCompany);       // Approves a registered company.

// Fetch company metadata profiles 
router.get('/company-profile/:id', authorizeRoles('Admin'), getCompanyProfile);    // Allows Admin to inspect any company's profile.

module.exports = router;