const db = require('../config/db');

// @desc    Update application status (e.g., Shortlist or Reject)
// @route   PUT /api/interviews/status/:applicationId
// @access  Private (Company or Admin)
exports.updateApplicationStatus = async (req, res) => {
    const { status } = req.body;
    const { applicationId } = req.params;

    if (!['Applied', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value provided.' });
    }

    try {
        const [app] = await db.query('SELECT id FROM applications WHERE id = ?', [applicationId]);
        if (app.length === 0) {
            return res.status(404).json({ message: 'Application record not found.' });
        }

        await db.query('UPDATE applications SET status = ? WHERE id = ?', [status, applicationId]);
        res.status(200).json({ message: `Application status updated to '${status}' successfully!` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while updating application status.' });
    }
};

// @desc    Schedule or Reschedule an interview
// @route   POST /api/interviews/schedule
// @access  Private (Company or Admin)
exports.scheduleInterview = async (req, res) => {
    const { application_id, interview_date, interview_time, interview_mode, meeting_link, venue } = req.body;

    if (!application_id || !interview_date || !interview_time || !interview_mode) {
        return res.status(400).json({ message: 'Please provide all required interview details.' });
    }

    try {
        const [app] = await db.query('SELECT id, status FROM applications WHERE id = ?', [application_id]);
        if (app.length === 0) {
            return res.status(404).json({ message: 'Application record not found.' });
        }

        await db.query('START TRANSACTION');

        const [existing] = await db.query(
            'SELECT interview_date, interview_time, interview_mode, meeting_link FROM interviews WHERE application_id = ?',
            [application_id]
        );

        if (existing.length > 0) {
            const old = existing[0];
            if (old.interview_date !== interview_date || old.interview_time !== interview_time) {
                await db.query(
                    `INSERT INTO interview_history (application_id, old_date, old_time, old_mode, old_meeting_link)
                     VALUES (?, ?, ?, ?, ?)`,
                    [application_id, old.interview_date, old.interview_time, old.interview_mode, old.meeting_link]
                );
            }
        }

        await db.query(
            `INSERT INTO interviews (application_id, interview_date, interview_time, interview_mode, meeting_link, venue) 
             VALUES (?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
                interview_date = VALUES(interview_date),
                interview_time = VALUES(interview_time),
                interview_mode = VALUES(interview_mode),
                meeting_link   = VALUES(meeting_link),
                venue          = VALUES(venue)`,
            [
                application_id, 
                interview_date, 
                interview_time, 
                interview_mode, 
                meeting_link || null,
                venue || null
            ]
        );

        await db.query("UPDATE applications SET status = 'Interview Scheduled' WHERE id = ?", [application_id]);
        await db.query('COMMIT');

        res.status(200).json({ message: 'Interview slot processed and changes archived successfully!' });
    } catch (error) {
        await db.query('ROLLBACK');
        console.error('Error in scheduleInterview transaction:', error);
        res.status(500).json({ message: 'Server error while scheduling interview.' });
    }
};

// @desc    Get upcoming interviews for logged-in student (With structural venue visibility mapping)
// @route   GET /api/interviews/my-schedule
// @access  Private (Student only)
exports.getStudentSchedule = async (req, res) => {
    try {
        const [student] = await db.query('SELECT id FROM students WHERE user_id = ?', [req.user.id]);
        if (student.length === 0) {
            return res.status(404).json({ message: 'Student profile mismatch.' });
        }

        // Selected i.venue option column back out to feed client dashboard
        const [schedule] = await db.query(
            `SELECT i.id AS interview_id, i.interview_date, i.interview_time, i.interview_mode, i.meeting_link, i.venue,
                    pd.job_role, c.company_name
             FROM interviews i
             JOIN applications a ON i.application_id = a.id
             JOIN placement_drives pd ON a.drive_id = pd.id
             JOIN companies c ON pd.company_id = c.id
             WHERE a.student_id = ?
               AND i.interview_date >= CURDATE()
             ORDER BY i.interview_date ASC, i.interview_time ASC`,
            [student[0].id]
        );

        res.status(200).json(schedule);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving your interview schedule.' });
    }
};

// // @desc    Get rescheduled timeline history logs for active student context
// // @route   GET /api/interviews/my-history
// // @access  Private (Student only)
exports.getStudentHistoryLogs = async (req, res) => {
    try {
        const [student] = await db.query('SELECT id FROM students WHERE user_id = ?', [req.user.id]);
        if (student.length === 0) {
            return res.status(404).json({ message: 'Student profile mismatch.' });
        }

        const [historyLogs] = await db.query(
            `SELECT h.id, h.old_date, h.old_time, h.old_mode, h.rescheduled_at,
                    pd.job_role, c.company_name
             FROM interview_history h
             JOIN applications a ON h.application_id = a.id
             JOIN placement_drives pd ON a.drive_id = pd.id
             JOIN companies c ON pd.company_id = c.id
             WHERE a.student_id = ?
             ORDER BY h.rescheduled_at DESC`,
            [student[0].id]
        );

        res.status(200).json(historyLogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving your timeline log history.' });
    }
};