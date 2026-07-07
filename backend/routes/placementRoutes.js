const express = require('express');
const router = express.Router();
const db = require('../config/db');


// 1. Company: Schedule an interview
router.post('/interviews/schedule', async (req, res) => {
    const { application_id, interview_date, interview_time, interview_mode, meeting_link } = req.body;

    try {
        // Start transaction to update application status and insert interview details
        await db.query('START TRANSACTION');

        // Insert into interviews table
        const [interviewResult] = await db.query(
            `INSERT INTO interviews (application_id, interview_date, interview_time, interview_mode, meeting_link) 
             VALUES (?, ?, ?, ?, ?)`,
            [application_id, interview_date, interview_time, interview_mode, meeting_link]
        );

        // Update application status to 'Interview Scheduled'
        await db.query(
            `UPDATE applications SET status = 'Interview Scheduled' WHERE id = ?`,
            [application_id]
        );

        await db.query('COMMIT');
        res.status(201).json({ message: 'Interview scheduled successfully!', interviewId: interviewResult.insertId });
    } catch (error) {
        await db.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ error: 'Failed to schedule interview.' });
    }
});

// 2. Student: Get scheduled interviews for a logged-in student
router.get('/student/:studentId/interviews', async (req, res) => {
    const { studentId } = req.params;
    try {
        const [rows] = await db.query(
            `SELECT i.*, pd.job_role, c.company_name 
             FROM interviews i
             JOIN applications a ON i.application_id = a.id
             JOIN placement_drives pd ON a.drive_id = pd.id
             JOIN companies c ON pd.company_id = c.id
             WHERE a.student_id = ?`,
            [studentId]
        );
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch interview schedule.' });
    }
});



module.exports = router;