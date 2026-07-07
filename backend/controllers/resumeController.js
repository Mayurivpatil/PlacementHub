const db = require('../config/db');
const { cloudinary } = require('../config/cloudinary');

// @desc    Upload Student Resume (PDF Only)
// @route   POST /api/student/upload-resume
// @access  Private (Student only)
exports.uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please provide a valid PDF file.' });
        }

        // 1. Find the student record mapped to the logged-in user
        const [student] = await db.query('SELECT id FROM students WHERE user_id = ?', [req.user.id]);
        if (student.length === 0) {
            return res.status(404).json({ message: 'Student profile not found.' });
        }
        const studentId = student[0].id;

        // 2. Initialize an upload stream targeting the image delivery container
        const uploadStream = () => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'placement_hub_resumes',
                        resource_type: 'auto', 
                        public_id: `student_${studentId}_resume_${Date.now()}` // Cloudinary will append the format automatically
                    },
                    (error, result) => {
                        if (result) resolve(result);
                        else reject(error);
                    }
                );
                // Pipe your raw multer storage memory buffer straight in
                stream.end(req.file.buffer);
            });
        };

        const cloudinaryResult = await uploadStream();
        const secureUrl = cloudinaryResult.secure_url;

        // 3. Save the resulting clean web URL back to the students table row
        await db.query('UPDATE students SET resume_url = ? WHERE id = ?', [secureUrl, studentId]);

        res.status(200).json({
            message: 'Resume uploaded and processed successfully!',
            resume_url: secureUrl
        });

    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        res.status(500).json({ message: 'Failed to process and host resume file upload.' });
    }
};