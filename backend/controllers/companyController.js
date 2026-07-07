const db = require('../config/db');

// @desc    Get company profile
// @route   GET /api/company/profile
// @access  Private (Company only)
exports.getCompanyProfile = async (req, res) => {
    try {
        const [company] = await db.query(
            'SELECT c.*, u.email FROM companies c JOIN users u ON c.user_id = u.id WHERE c.user_id = ?',
            [req.user.id]
        );
        if (company.length === 0) return res.status(404).json({ message: 'Company profile not found.' });
        
        res.status(200).json({ profile: company[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching company profile.' });
    }
};

// @desc    Update company profile
// @route   PUT /api/company/profile
// @access  Private (Company only)
exports.updateCompanyProfile = async (req, res) => {
    const { company_name, description, website } = req.body;
    try {
        await db.query(
            'UPDATE companies SET company_name = ?, description = ?, website = ? WHERE user_id = ?',
            [company_name, description, website, req.user.id]
        );
        res.status(200).json({ message: 'Company profile updated successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating company profile.' });
    }
};

// ==========================================
// NEW: ACTIVE RECRUITMENT DRIVES WITH INTERVIEWS
// ==========================================

// @desc    Get all active hiring drives with applicant rows and scheduled interviews
// @route   GET /api/company/active-drives
// @access  Private (Company only)
exports.getCompanyActiveDrives = async (req, res) => {
    try {
        // 1. Find the distinct company profile ID mapped to the currently authenticated user session
        const [company] = await db.query('SELECT id FROM companies WHERE user_id = ?', [req.user.id]);
        if (company.length === 0) {
            return res.status(404).json({ message: 'Company account record missing.' });
        }
        const companyId = company[0].id;

        // 2. Fetch job drives joined against student applications, metadata records, and conditional interview pipelines
        const query = `
            SELECT 
                pd.id AS drive_id, pd.job_role, pd.package, pd.eligibility_cgpa, pd.last_date,
                a.id AS application_id, a.status AS current_stage,
                s.id AS student_id, u.name AS student_name, s.branch, s.cgpa,
                i.interview_date, i.interview_time, i.interview_mode, i.meeting_link
            FROM placement_drives pd
            LEFT JOIN applications a ON pd.id = a.drive_id
            LEFT JOIN students s ON a.student_id = s.id
            LEFT JOIN users u ON s.user_id = u.id
            LEFT JOIN interviews i ON a.id = i.application_id
            WHERE pd.company_id = ?
            ORDER BY pd.id DESC, s.cgpa DESC
        `;

        const [rows] = await db.query(query, [companyId]);

        // 3. Structure flat relational table matches into cleaner hierarchical job card blocks
        const drivesMap = {};
        
        rows.forEach(row => {
            if (!drivesMap[row.drive_id]) {
                drivesMap[row.drive_id] = {
                    id: row.drive_id,
                    job_role: row.job_role,
                    package: row.package,
                    eligibility_cgpa: row.eligibility_cgpa,
                    last_date: row.last_date,
                    candidates: []
                };
            }

            // Append candidate entry if a student has registered an application for this drive row
            if (row.application_id) {
                drivesMap[row.drive_id].candidates.push({
                    application_id: row.application_id,
                    student_id: row.student_id,
                    student_name: row.student_name || "Unknown Applicant",
                    branch: row.branch || "Not Specified",
                    cgpa: row.cgpa,
                    current_stage: row.current_stage,
                    // If an interview record exists in the database, attach its schema object variables directly
                    interview: row.interview_date ? {
                        date: row.interview_date,
                        time: row.interview_time,
                        mode: row.interview_mode,
                        link: row.meeting_link
                    } : null
                });
            }
        });

        // Respond back to frontend with formatted array list blocks
        res.status(200).json(Object.values(drivesMap));
    } catch (error) {
        console.error('Error compiling company recruitment overview:', error);
        res.status(500).json({ message: 'Internal server query pipeline failure.' });
    }
};