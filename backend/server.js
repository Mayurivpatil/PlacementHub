const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');

// Import Route Files
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const companyRoutes = require('./routes/companyRoutes');
const driveRoutes = require('./routes/driveRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();
const app = express();

// Configure CORS cleanly
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));

app.use(express.json());

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/drives', driveRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.send('PlacementHub API is running perfectly!');
});

db.query('SELECT 1')
    .then(() => {
        console.log('✅ Connected to MySQL Database.');
        const PORT = process.env.PORT || 5000;
        
        // 👈 Added '0.0.0.0' to force binding across all network adapters (IPv4 + IPv6)
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server running on http://127.0.0.1:${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err.message);
    });