const PostDriveTab = ({ driveForm, setDriveForm, onSubmit }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">
        Publish Hiring Application Form
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="job_role"
              className="block text-gray-600 text-sm font-medium mb-1"
            >
              Target Job Designation Role
            </label>
            <input
              id="job_role"
              type="text"
              value={driveForm.job_role || ""}
              onChange={(e) =>
                setDriveForm({ ...driveForm, job_role: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              placeholder="e.g. Associate Software Engineer"
              required
            />
          </div>
          <div>
            <label
              htmlFor="salaryPackage"
              className="block text-gray-600 text-sm font-medium mb-1"
            >
              Annual Package (Salary Details)
            </label>
            <input
              id="salaryPackage"
              type="text"
              value={driveForm.salaryPackage || ""}
              onChange={(e) =>
                setDriveForm({ ...driveForm, salaryPackage: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              placeholder="e.g. 12 LPA"
              required
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="eligibility_cgpa"
            className="block text-gray-600 text-sm font-medium mb-1"
          >
            Academic Cut-off Eligibility Criteria (Minimum CGPA)
          </label>
          <input
            id="eligibility_cgpa"
            type="number"
            step="0.01"
            min="0"
            max="10"
            value={driveForm.eligibility_cgpa || ""}
            onChange={(e) =>
              setDriveForm({
                ...driveForm,
                eligibility_cgpa: e.target.value, // Changed from eligibility_criteria
              })
            }
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            placeholder="e.g. 7.50"
            required
          />
        </div>
        <div>
          <label
            htmlFor="last_date"
            className="block text-gray-600 text-sm font-medium mb-1"
          >
            Application Submission Deadline Date
          </label>
          <input
            id="last_date"
            type="date"
            value={driveForm.last_date || ""}
            onChange={(e) =>
              setDriveForm({
                ...driveForm,
                last_date: e.target.value, // Changed from application_deadline
              })
            }
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            required
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-gray-600 text-sm font-medium mb-1"
          >
            Detailed Job Description
          </label>
          <textarea
            id="description"
            rows="4"
            value={driveForm.description || ""}
            onChange={(e) =>
              setDriveForm({ ...driveForm, description: e.target.value }) // Changed from job_description
            }
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none"
            placeholder="Detail daily roles, core technical expectations, stack metrics..."
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition text-sm"
          >
            Launch Placement Drive
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostDriveTab;