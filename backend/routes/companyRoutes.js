const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { getCompanyProfile, updateCompanyProfile } = require('../controllers/companyController');

router.use(protect);
router.use(authorizeRoles('Company'));

router.route('/profile')
    .get(getCompanyProfile)
    .put(updateCompanyProfile);

module.exports = router;