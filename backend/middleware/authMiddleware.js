// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// Verify standard user token
exports.protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, token missing.' });
    }

    try {
        // Decode and verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attaches { id, role } to the request object
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized, invalid token.' });
    }
};

// Restrict access based on roles
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Role (${req.user.role}) is not allowed to access this resource.` 
            });
        }
        next();
    };
};