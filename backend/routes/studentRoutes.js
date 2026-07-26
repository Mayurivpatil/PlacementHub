const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { 
    getStudentProfile, 
    updateStudentProfile, 
    addSkill, 
    addCertification,
    deleteSkill,
    getStudentDashboardMetrics
} = require('../controllers/studentController');


// Import your new configuration components
const { upload } = require('../config/cloudinary');
const { uploadResume } = require('../controllers/resumeController');

router.use(protect);
router.use(authorizeRoles('Student'));

router.route('/profile')
    .get(getStudentProfile)
    .put(updateStudentProfile);

router.route('/skills')
    .post(addSkill)
    .delete(deleteSkill);

// This is not implemented yet, but in future, we can add a route for certifications
router.post('/certifications', addCertification);

router.post('/upload-resume', upload.single('resume'), uploadResume);


// Student accessible analytical metrics
// (Not implemented for students yet, but the route is ready for future use)
router.get('/metrics', getStudentDashboardMetrics);   // Returns statistics for the student dashboard.

module.exports = router;