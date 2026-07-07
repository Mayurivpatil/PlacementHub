const db = require('../config/db');
const { cloudinary } = require('../config/cloudinary');

// @desc    Get current student profile (including skills and certifications)
// @route   GET /api/student/profile
// @access  Private (Student only)
exports.getStudentProfile = async (req, res) => {
    try {
        // req.user.id comes from our auth middleware
        const [studentData] = await db.query(
            `SELECT s.*, u.name, u.email 
             FROM students s 
             JOIN users u ON s.user_id = u.id 
             WHERE s.user_id = ?`, 
            [req.user.id]
        );

        if (studentData.length === 0) {
            return res.status(404).json({ message: 'Student profile not found.' });
        }

        const student = studentData[0];

        // Fetch skills
        const [skills] = await db.query('SELECT id, skill_name FROM skills WHERE student_id = ?', [student.id]);
        
        // Fetch certifications
        const [certifications] = await db.query(
            'SELECT id, certificate_name, issuing_organization FROM certifications WHERE student_id = ?', 
            [student.id]
        );

        res.status(200).json({
            profile: student,
            skills,
            certifications
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving profile data.' });
    }
};

// @desc    Update basic student academic profile
// @route   PUT /api/student/profile
// @access  Private (Student only)
exports.updateStudentProfile = async (req, res) => {
    const { branch, cgpa, graduation_year, phone, address } = req.body;

    try {
        const [result] = await db.query(
            `UPDATE students 
             SET branch = ?, cgpa = ?, graduation_year = ?, phone = ?, address = ? 
             WHERE user_id = ?`,
            [branch, cgpa, graduation_year, phone, address, req.user.id]
        );

        res.status(200).json({ message: 'Profile updated successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating profile details.' });
    }
};

// @desc    Add a skill
// @route   POST /api/student/skills
// @access  Private (Student only)
exports.addSkill = async (req, res) => {
    const { skill_name } = req.body;
    if (!skill_name) return res.status(400).json({ message: 'Skill name is required.' });

    try {
        // Find internal student ID
        const [student] = await db.query('SELECT id FROM students WHERE user_id = ?', [req.user.id]);
        const studentId = student[0].id;

        await db.query('INSERT INTO skills (student_id, skill_name) VALUES (?, ?)', [studentId, skill_name]);
        res.status(201).json({ message: 'Skill added successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding skill.' });
    }
};


// (Keep It for Future Upgrades to add an "Achievements" or "Certifications" section to the student profile layout)
// @desc    Add a certification
// @route   POST /api/student/certifications
// @access  Private (Student only)
exports.addCertification = async (req, res) => {
    const { certificate_name, issuing_organization } = req.body;
    if (!certificate_name) return res.status(400).json({ message: 'Certificate name is required.' });

    try {
        const [student] = await db.query('SELECT id FROM students WHERE user_id = ?', [req.user.id]);
        const studentId = student[0].id;

        await db.query(
            'INSERT INTO certifications (student_id, certificate_name, issuing_organization) VALUES (?, ?, ?)', 
            [studentId, certificate_name, issuing_organization]
        );
        res.status(201).json({ message: 'Certification added successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding certification.' });
    }
};

// @desc    Upload / Update Student Resume Document via Cloudinary Memory Buffer
// @route   POST /api/student/upload-resume
// @access  Private (Student only)
exports.uploadResume = async (req, res) => {
    try {
        // 1. Verify a file buffer was actually intercepted by Multer
        if (!req.file) {
            return res.status(400).json({ message: 'No file asset selected for upload.' });
        }

        // 2. Fetch the internal student row id
        const [student] = await db.query('SELECT id FROM students WHERE user_id = ?', [req.user.id]);
        if (student.length === 0) {
            return res.status(404).json({ message: 'Student profile mismatch.' });
        }
        const studentId = student[0].id;

        // 3. Generate a distinct, clean filename containing an explicit extension template
        // This ensures Cloudinary writes metadata headers properly so it triggers a true download.
        const customPublicId = `student_${studentId}_resume_${Date.now()}`;

        // 4. Initialize Cloudinary's raw stream writer
        const cloudUploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'placement_resumes',
                resource_type: 'raw',     // Tells Cloudinary not to treat it as an image blob
                public_id: `${customPublicId}.pdf` // Enforces a rigid filename suffix extension
            },
            async (error, result) => {
                if (error) {
                    console.error('Cloudinary stream failure:', error);
                    return res.status(500).json({ message: 'Cloudinary asset streaming infrastructure failed.' });
                }

                // 5. Save the generated secure cloud link back into MySQL
                const secureResumeUrl = result.secure_url;
                await db.query(
                    'UPDATE students SET resume_url = ? WHERE id = ?',
                    [secureResumeUrl, studentId]
                );

                return res.status(200).json({
                    message: 'Resume asset synced and verified successfully!',
                    resume_url: secureResumeUrl
                });
            }
        );

        // 6. Pipe the existing memory buffer data cleanly straight out to the cloud stream
        cloudUploadStream.end(req.file.buffer);

    } catch (error) {
        console.error('Resume processing exception context:', error);
        res.status(500).json({ message: 'Server runtime fault executing document tracking sync.' });
    }
};

// @desc    Delete a skill
// @route   DELETE /api/student/skills
// @access  Private (Student only)
exports.deleteSkill = async (req, res) => {
    const { skill_name } = req.body;
    if (!skill_name) return res.status(400).json({ message: 'Skill name is required.' });

    try {
        // Find internal student ID matching current authenticated user
        const [student] = await db.query('SELECT id FROM students WHERE user_id = ?', [req.user.id]);
        if (student.length === 0) return res.status(404).json({ message: 'Student profile mismatch.' });
        const studentId = student[0].id;

        // Execute deletion matching both the student and the skill text string
        await db.query('DELETE FROM skills WHERE student_id = ? AND skill_name = ?', [studentId, skill_name]);
        
        res.status(200).json({ message: 'Skill removed successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting skill record.' });
    }
};