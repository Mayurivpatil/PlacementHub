const UploadResumeTab = ({ profile, resumeFile, handleResumeUpload, handleFileChange }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
      <h2 className="text-xl font-bold text-gray-800 border-b pb-3">Resume Document Portal</h2>
      {profile?.resume_url ? (
        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h4 className="font-semibold text-indigo-900">Your Resume</h4>
          {/* If the student's profile has a resume URL, show the resume information. */}
          <a href={profile.resume_url} target="_blank" rel="noreferrer" className="bg-indigo-600 hover:bg-indigo-700 text-white text-center px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm">
            View Document 📄
          </a>
        </div>
      ) : (
        <p className="text-amber-600 font-medium bg-amber-50 border border-amber-200 p-4 rounded-xl text-sm">
          ⚠️ You haven't uploaded a professional resume yet.
        </p>
      )}
      <form onSubmit={handleResumeUpload} className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50 max-w-xl mx-auto space-y-4">
        <div className="text-4xl">📤</div>
        <label htmlFor="resume-file-input" className="block text-gray-700 font-semibold mb-1 cursor-pointer hover:text-indigo-600 transition">
          Click to select your file
          <input id="resume-file-input" type="file" accept=".pdf" required className="hidden" onChange={handleFileChange} />
        </label>
        {resumeFile && (
          <div className="text-sm font-semibold text-indigo-600 bg-white border inline-block px-4 py-1.5 rounded-full shadow-sm">
            📎 {resumeFile.name}
          </div>
        )}
        <div>
          <button type="submit" disabled={!resumeFile} className={`w-full sm:w-auto px-6 py-2 rounded-lg font-semibold shadow transition ${resumeFile ? "bg-gray-900 text-white hover:bg-gray-800" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
            Upload Document
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadResumeTab;