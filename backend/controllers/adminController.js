const db = require('../config/db');

// @desc     Get global statistics for Admin Dashboard
// @route    GET /api/admin/dashboard-stats
// @access   Private (Admin only)
exports.getAdminStats = async (req, res) => {
    try {
        // Run aggregation queries in parallel with Promise.all for All queries execute simultaneously, making the dashboard load faster.
        const [
            [studentsCount],
            [companiesCount],
            [drivesCount],
            [selectedCount],
            [branchStats]
        ] = await Promise.all([
            db.query('SELECT COUNT(*) AS total FROM students'),
            db.query('SELECT COUNT(*) AS total FROM companies where is_verified = TRUE'),
            db.query('SELECT COUNT(*) AS total FROM placement_drives'),
            db.query("SELECT COUNT(*) AS total FROM applications WHERE status = 'Selected'"),  // Counts students whose status is 'Selected'.
            db.query(`
                SELECT s.branch, 
                       COUNT(DISTINCT s.id) AS total_students,
                       SUM(CASE WHEN a.status = 'Selected' THEN 1 ELSE 0 END) AS placed_students
                FROM students s
                LEFT JOIN applications a ON s.id = a.student_id
                GROUP BY s.branch
            `)
        ]);

        res.status(200).json({
            metrics: {
                totalStudents: studentsCount[0].total,
                totalCompanies: companiesCount[0].total,
                activeDrives: drivesCount[0].total,
                selectedStudents: selectedCount[0].total
            },
            branchAnalytics: branchStats
        });
    } catch (error) {
        console.error('Error fetching admin global stats:', error);
        res.status(500).json({ message: 'Error compiling administrative metrics.' });
    }
};

// @desc     Get custom reports data
// @route    GET /api/admin/reports/:type
// @access   Private (Admin only)
exports.getReportData = async (req, res) => {
    const { type } = req.params; // types can be: 'student-placement', 'company-wise', 'branch-wise'

    try {
        let query = '';
        
        if (type === 'student-placement') {
            query = `
                SELECT u.name, u.email, s.branch, s.cgpa, s.graduation_year, a.status AS placement_status, pd.job_role, c.company_name, pd.package
                FROM students s
                JOIN users u ON s.user_id = u.id
                LEFT JOIN applications a ON s.id = a.student_id AND a.status = 'Selected'
                LEFT JOIN placement_drives pd ON a.drive_id = pd.id
                LEFT JOIN companies c ON pd.company_id = c.id
                ORDER BY s.branch, s.cgpa DESC`;
        } else if (type === 'company-wise') {
            query = `
                SELECT c.company_name, c.website, COUNT(pd.id) AS total_drives,
                       SUM(CASE WHEN a.status = 'Selected' THEN 1 ELSE 0 END) AS total_hires
                FROM companies c
                LEFT JOIN placement_drives pd ON c.id = pd.company_id
                LEFT JOIN applications a ON pd.id = a.drive_id
                GROUP BY c.id
                ORDER BY total_hires DESC`;
        } else {
            return res.status(400).json({ message: 'Invalid report filter parameter.' });
        }

        const [reportRows] = await db.query(query);
        res.status(200).json(reportRows);
    } catch (error) {
        console.error(`Error compiling report dataset for type [${type}]:`, error);
        res.status(500).json({ message: 'Error compiling the requested report dataset.' });
    }
};


// ==========================================
// NEW COMPANY VERIFICATION OPERATIONS
// ==========================================

// @desc     Get all companies pending admin verification
// @route    GET /api/admin/pending-companies
// @access   Private (Admin only)
exports.getPendingCompanies = async (req, res) => {
    try {
        const query = `
            SELECT c.id, c.company_name AS name, u.email, 'pending' AS status 
            FROM companies c
            INNER JOIN users u ON c.user_id = u.id 
            WHERE c.is_verified = FALSE
        `;
        
        const [pendingRows] = await db.query(query);
        res.status(200).json(pendingRows);
    } catch (error) {
        console.error('Error fetching pending companies:', error);
        res.status(500).json({ message: 'Error retrieving pending company list.' });
    }
};

// @desc     Approve and verify a company profile
// @route    PUT /api/admin/approve-company/:id
// @access   Private (Admin only)
exports.approveCompany = async (req, res) => {
    const companyId = req.params.id;
    try {
        const query = "UPDATE companies SET is_verified = TRUE WHERE id = ?";
        const [result] = await db.query(query, [companyId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Company profile not found.' });
        }

        res.status(200).json({ message: 'Company profile verified successfully!' });
    } catch (error) {
        console.error('Error approving company profile:', error);
        res.status(500).json({ message: 'Error updating company status in database.' });
    }
};

// @desc     Shows company details.
// @route    GET /api/admin/company-profile/:id
// @access   Private (Admin only)
exports.getCompanyProfile = async (req, res) => {
    const companyId = req.params.id;
    try {
        const query = `
            SELECT c.id, c.company_name AS name, u.email, c.website, c.description
            FROM companies c
            INNER JOIN users u ON c.user_id = u.id
            WHERE c.id = ?
        `;

        const [rows] = await db.query(query, [companyId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Company profile record not found.' });
        }

        // Return profile directly as an object mapping matching frontend payload expectations
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error(`Error resolving profile for company ID [${companyId}]:`, error);
        res.status(500).json({ message: 'Error compiling requested company profile details.' });
    }
};