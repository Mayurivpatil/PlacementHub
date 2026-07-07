const StudentDetailsModal = ({ student, onClose }) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-end z-50 transition-opacity">
      <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col p-6 overflow-y-auto">
        
        {/* Header Block */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{student.student_name}</h3>
            <p className="text-xs font-semibold text-indigo-600 tracking-wide uppercase mt-0.5">
              {student.branch || "General Branch"} Applicant
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-lg transition text-sm font-bold"
          >
            ✕ Close
          </button>
        </div>

        {/* Content Section */}
        <div className="space-y-6 flex-grow">
          
          {/* Section 1: Academic Overview */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-black-400 uppercase tracking-wider">🎓 Academic Performance</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="text-xs text-gray-400 block font-medium">Cumulative CGPA</span>
                <span className="text-lg font-bold text-indigo-600">{student.cgpa || "N/A"}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="text-xs text-gray-400 block font-medium">Current Status</span>
                <span className="text-sm font-bold text-gray-700 capitalize block mt-1">
                  {student.status === "Selected" ? "🎉 Placed" : student.status}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Technical Skills */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-black-400 uppercase tracking-wider">⚙️ Technical Skills</h4>
            <div className="bg-indigo-50/40 border border-indigo-100 p-4 rounded-xl">
              {student.skills ? (
                <div className="flex flex-wrap gap-1.5">
                  {String(student.skills).split(',').map((skill, index) => (
                    <span 
                      key={index} 
                      className="bg-white text-indigo-700 border border-indigo-200/60 text-xs px-2.5 py-1 rounded font-medium shadow-sm"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No technical skills on profile. 
                </p>
              )}
            </div>
          </div>

          {/* Section 3: Contact Channels */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-black-400 uppercase tracking-wider">📞 Contact Information</h4>
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 space-y-3 text-sm text-gray-700">
              <div className="flex justify-between items-center border-b border-gray-200/60 pb-2">
                <span className="text-gray-400 font-medium">Email Address</span>
                {student.email ? (
                  <a href={`mailto:${student.email}`} className="text-indigo-600 font-semibold hover:underline">
                    {student.email}
                  </a>
                ) : (
                  <span className="text-gray-400 italic">Not Available </span>
                )}
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-gray-400 font-medium">Phone Number</span>
                <span className="font-semibold text-gray-800">
                  {student.phone || "Not Available"}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions Context */}
        {student.resume_url && (
          <div className="border-t pt-4 mt-6">
            <a
              href={student.resume_url}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center text-xs py-3 rounded-xl font-bold block transition shadow-sm"
            >
              Open Attached PDF Resume 📄
            </a>
          </div>
        )}

      </div>
    </div>
  );
};

export default StudentDetailsModal;