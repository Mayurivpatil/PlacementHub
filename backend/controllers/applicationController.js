const db = require('../config/db');

// @desc     Apply for a placement drive
// @route    POST /api/applications/apply/:driveId
// @access   Private (Student only)
exports.applyToDrive = async (req, res) => {
    const driveId = req.params.driveId;

    try {
        // 1. Fetch student information and academic details
        const [studentData] = await db.query('SELECT id, cgpa FROM students WHERE user_id = ?', [req.user.id]);
        if (studentData.length === 0) {
            return res.status(404).json({ message: 'Student details not found.' });
        }
        const studentId = studentData[0].id;
        const studentCgpa = parseFloat(studentData[0].cgpa || 0);

        // 2. Fetch job drive baseline rules
        const [driveData] = await db.query('SELECT eligibility_cgpa, last_date FROM placement_drives WHERE id = ?', [driveId]);
        if (driveData.length === 0) {
            return res.status(404).json({ message: 'Placement drive matching this record does not exist.' });
        }
        const { eligibility_cgpa, last_date } = driveData[0];

        // 3. Validation: Enforce clean deadline expirations (Auto-rejects starting the next day)
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Strip time variables to isolate current calendar date

        const deadline = new Date(last_date);
        deadline.setHours(0, 0, 0, 0); // Strip time variables to isolate target deadline date

        if (today > deadline) {
            return res.status(400).json({ 
                message: 'The application window for this job drive closed yesterday. You can no longer submit applications.' 
            });
        }

        // 4. Validation: Enforce minimal academic eligibility thresholds
        if (studentCgpa < parseFloat(eligibility_cgpa)) {
            return res.status(400).json({ 
                message: `Your CGPA (${studentCgpa}) does not meet the minimum eligibility requirement (${eligibility_cgpa}) for this drive.` 
            });
        }

        // 5. Check if application already exists to prevent duplicate rows
        const [existingApp] = await db.query(
            'SELECT id FROM applications WHERE student_id = ? AND drive_id = ?',
            [studentId, driveId]
        );
        if (existingApp.length > 0) {
            return res.status(400).json({ message: 'You have already applied for this placement drive.' });
        }

        // 6. Complete placement record insertion
        await db.query(
            'INSERT INTO applications (student_id, drive_id, status) VALUES (?, ?, ?)',
            [studentId, driveId, 'Applied']
        );

        res.status(201).json({ message: 'Application submitted successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error processing job drive application.' });
    }
};

// @desc     Get student's own submitted applications
// @route    GET /api/applications/my-applications
// @access   Private (Student only)
exports.getStudentApplications = async (req, res) => {
    try {
        const [student] = await db.query('SELECT id FROM students WHERE user_id = ?', [req.user.id]);
        if (student.length === 0) return res.status(404).json({ message: 'Profile mismatch error.' });

        const [apps] = await db.query(
            `SELECT a.id AS application_id, a.drive_id, a.status, a.applied_date, pd.job_role, pd.package, c.company_name 
             FROM applications a
             JOIN placement_drives pd ON a.drive_id = pd.id
             JOIN companies c ON pd.company_id = c.id
             WHERE a.student_id = ?`,
            [student[0].id]
        );

        res.status(200).json(apps);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving your current applications.' });
    }
};

// @desc     Get all applicants for a specific company's drive
// @route    GET /api/applications/drive/:driveId
// @access   Private (Company only)
exports.getDriveApplicants = async (req, res) => {
    const driveId = req.params.driveId;

    try {
        const [company] = await db.query('SELECT id FROM companies WHERE user_id = ?', [req.user.id]);
        if (company.length === 0) {
            return res.status(404).json({ message: 'Company profile details not found.' });
        }

        const [drive] = await db.query('SELECT company_id FROM placement_drives WHERE id = ?', [driveId]);
        if (drive.length === 0 || drive[0].company_id !== company[0].id) {
            return res.status(403).json({ message: 'Unauthorized access to view candidates for this posting.' });
        }

        // Left-joins the interviews table to fetch real scheduled data
        const [applicants] = await db.query(
            `SELECT 
                a.id AS id,                      
                a.id AS application_id,          
                a.status AS status,              
                a.applied_date AS applied_date,  
                u.name AS student_name,          
                u.email AS email, 
                s.phone AS phone,                
                s.branch AS branch, 
                s.cgpa AS cgpa, 
                s.resume_url AS resume_url,
                i.interview_date AS interview_date,
                i.interview_time AS interview_time,
                i.interview_mode AS interview_mode,
                i.meeting_link AS meeting_link,
                GROUP_CONCAT(sk.skill_name SEPARATOR ',') AS skills
             FROM applications a
             JOIN students s ON a.student_id = s.id
             JOIN users u ON s.user_id = u.id
             LEFT JOIN skills sk ON s.id = sk.student_id
             LEFT JOIN interviews i ON a.id = i.application_id
             WHERE a.drive_id = ?
             GROUP BY a.id, u.name, u.email, s.phone, s.branch, s.cgpa, s.resume_url, 
                      i.interview_date, i.interview_time, i.interview_mode, i.meeting_link`,
            [driveId]
        );

        res.status(200).json(applicants);
    } catch (error) {
        console.error("CRITICAL BACKEND ERROR DETECTED:", error.message);
        res.status(500).json({ message: 'Error fetching listing applicants.', error: error.message });
    }
};

// @desc     Update an applicant's status (Shortlist, Place, Reject)
// @route    PUT /api/applications/status/:id
// @access   Private (Company only)
exports.updateApplicationStatus = async (req, res) => {
    try {
        const id = req.params.id || req.body.id;
        const status = req.body.status;

        if (!id || !status) {
            return res.status(400).json({ message: 'Missing required status parameters.' });
        }

        let dbStatus = status;
        if (status === 'Shortlisted') dbStatus = 'Shortlisted';
        if (status === 'Selected' || status === 'Placed') dbStatus = 'Selected';
        if (status === 'Rejected') dbStatus = 'Rejected';

        await db.query('UPDATE applications SET status = ? WHERE id = ?', [dbStatus, id]);

        res.status(200).json({ success: true, message: 'Candidate status updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating candidate status.' });
    }
};