const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// It defines the authentication API endpoints (URLs)
// Public routes
router.post('/register', register);
router.post('/login', login);

// Example profile verification route (test whether the JWT token is valid.)
router.get('/me', protect, (req, res) => {
    res.status(200).json({ message: "Token is verified!", user: req.user });
});

module.exports = router;