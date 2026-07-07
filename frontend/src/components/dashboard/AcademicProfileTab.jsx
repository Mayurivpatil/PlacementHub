const AcademicProfileTab = ({
  profile,
  skills,
  academicForm,
  setAcademicForm,
  handleProfileUpdate,
  handleAddSkill,
  handleRemoveSkill, 
  newSkill,
  setNewSkill,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
      <h2 className="text-xl font-bold text-gray-800 border-b pb-3">
        Academic & Contact Information
      </h2>
      <form
        onSubmit={handleProfileUpdate}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <div>
          <label className="block text-gray-600 text-sm font-medium mb-1">
            Course Branch
          </label>
          <input
            type="text"
            value={academicForm.branch}
            onChange={(e) =>
              setAcademicForm({ ...academicForm, branch: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            placeholder="e.g. Computer Engineering"
            required
          />
        </div>
        <div>
          <label className="block text-gray-600 text-sm font-medium mb-1">
            CGPA
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="10"
            value={academicForm.cgpa}
            onChange={(e) =>
              setAcademicForm({ ...academicForm, cgpa: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            placeholder="e.g. 8.75"
            required
          />
        </div>
        <div>
          <label className="block text-gray-600 text-sm font-medium mb-1">
            Graduation Passing Year
          </label>
          <input
            type="number"
            value={academicForm.graduation_year}
            onChange={(e) =>
              setAcademicForm({
                ...academicForm,
                graduation_year: e.target.value,
              })
            }
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            placeholder="e.g. 2027"
            required
          />
        </div>
        <div>
          <label className="block text-gray-600 text-sm font-medium mb-1">
            Contact Phone Number
          </label>
          <input
            type="text"
            value={academicForm.phone}
            onChange={(e) =>
              setAcademicForm({ ...academicForm, phone: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            placeholder="e.g. 9876543210"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-gray-600 text-sm font-medium mb-1">
            Permanent Residential Address
          </label>
          <textarea
            rows="2"
            value={academicForm.address}
            onChange={(e) =>
              setAcademicForm({ ...academicForm, address: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none"
            placeholder="Enter full location details..."
          />
        </div>
        <div className="sm:col-span-2 flex justify-end">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition text-sm"
          >
            Save Profile Changes
          </button>
        </div>
      </form>

      {/* Skills Tags */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3">
          Core Technical Skills
        </h3>
        <form onSubmit={handleAddSkill} className="flex gap-2 max-w-md mb-4">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="flex-grow px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            placeholder="Add skill tag (e.g. React, Python)"
          />
          <button
            type="submit"
            className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
          >
            Add
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          {skills.length === 0 ? (
            <p className="text-gray-400 text-sm italic">
              Skills not added yet.
            </p>
          ) : (
            skills.map((s) => (
              <span
                key={s.id || s.skill_name}
                className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs px-3 py-1.5 font-semibold rounded-full border border-indigo-100"
              >
                {s.skill_name}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(s.skill_name)} // <-- CHANGED BACK TO s.skill_name
                  className="hover:bg-indigo-200 hover:text-indigo-900 text-indigo-400 rounded-full w-4 h-4 inline-flex items-center justify-center transition-colors font-bold text-xs ml-0.5"
                  title={`Remove ${s.skill_name}`}
                >
                  &times;
                </button>
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AcademicProfileTab;
