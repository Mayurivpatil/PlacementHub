const db = require('../config/db');

// @desc     Create a new placement drive
// @route    POST /api/drives
// @access   Private (Company only)
exports.createDrive = async (req, res) => {
    const { job_role, package, location, eligibility_cgpa, last_date, drive_date, description } = req.body;

    // Validation
    if (!job_role || !package || !eligibility_cgpa || !last_date || !drive_date) {
        return res.status(400).json({ message: 'Please fill in all required eligibility and job fields.' });
    }

    try {
        // Find internal company ID using logged-in user's ID
        const [company] = await db.query('SELECT id, is_verified FROM companies WHERE user_id = ?', [req.user.id]);
        
        if (company.length === 0) {
            return res.status(404).json({ message: 'Company profile not found.' });
        }

        //  Ensure the admin has verified this company before allowing drive creation
        if (!company[0].is_verified) {
            return res.status(403).json({ message: 'Your company profile is pending Admin verification. You cannot create drives yet.' });
        }

        const companyId = company[0].id;

        // Insert drive data
        await db.query(
            `INSERT INTO placement_drives 
            (company_id, job_role, package, location, eligibility_cgpa, last_date, drive_date, description) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)` ,
            [companyId, job_role, package, location, eligibility_cgpa, last_date, drive_date, description]
        );

        res.status(201).json({ message: 'Placement drive created successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while creating placement drive.' });
    }
};

// @desc     Get all placement drives (Filtered strictly for companies, global for students/admins)
// @route    GET /api/drives
// @access   Private
exports.getAllDrives = async (req, res) => {
    try {
        // Safe check: Normalize the string to lowercase to handle both 'Company' and 'company'
        const currentRole = req.user && req.user.role ? req.user.role.toLowerCase() : '';

        if (currentRole === 'company') {
            // Find this specific recruiter's company profile ID matching user_id boundary keys
            const [company] = await db.query('SELECT id FROM companies WHERE user_id = ?', [req.user.id]);
            
            if (company.length > 0) {
                const companyId = company[0].id;

                // Only fetch drives belonging strictly to THIS company profile
                const [myDrives] = await db.query(
                    `SELECT pd.*, c.company_name, c.website 
                     FROM placement_drives pd
                     JOIN companies c ON pd.company_id = c.id
                     WHERE pd.company_id = ?
                     ORDER BY pd.last_date ASC`,
                    [companyId]
                );
                return res.status(200).json(myDrives);
            } else {
                // If they have a Company role but no profile created yet, return an empty array
                return res.status(200).json([]);
            }
        }

        // 2. For Student/Admin accounts, fetch all drives globally with company metadata
        const [allDrives] = await db.query(
            `SELECT pd.*, 
                    c.company_name, 
                    c.website AS company_website, 
                    pd.location AS company_location, 
                    c.description AS company_bio 
             FROM placement_drives pd
             JOIN companies c ON pd.company_id = c.id
             ORDER BY pd.last_date ASC`
        );
        return res.status(200).json(allDrives);

    } catch (error) {
        console.error("CRITICAL SQL ERROR LOGGED:", error.message);
        res.status(500).json({ message: 'Error fetching placement drives.', error: error.message });
    }
};

// @desc     Get single drive details
// @route    GET /api/drives/:id
// @access   Private

// ( Not used yet but kept for future upgrades to allow students to view drive details before applying )
exports.getDriveById = async (req, res) => {
    try {
        const [drive] = await db.query(
            `SELECT pd.*, c.company_name, c.bio AS company_bio, c.location AS company_location, c.website AS company_website 
             FROM placement_drives pd
             JOIN companies c ON pd.company_id = c.id
             WHERE pd.id = ?`,
            [req.params.id]
        );

        if (drive.length === 0) {
            return res.status(404).json({ message: 'Placement drive not found.' });
        }

        res.status(200).json(drive[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving drive configuration details.' });
    }
};