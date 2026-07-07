const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { 
    getStudentProfile, 
    updateStudentProfile, 
    addSkill, 
    addCertification,
    deleteSkill
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
router.post('/certifications', addCertification);

router.post('/upload-resume', upload.single('resume'), uploadResume);

module.exports = router;