const ProfileTab = ({ profileForm, setProfileForm, onSubmit }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">
        Company Summary
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="company_name" className="block text-gray-600 text-sm font-medium mb-1">
              Company Legal Name
            </label>
            <input
              id="company_name"
              type="text"
              value={profileForm.company_name}
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 outline-none text-sm text-gray-500 cursor-not-allowed"
              disabled
            />
          </div>
          <div>
            <label htmlFor="website" className="block text-gray-600 text-sm font-medium mb-1">
              Company Website
            </label>
            <input
              id="website"
              type="url"
              value={profileForm.website}
              onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              placeholder="https://company.com"
              required
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-gray-600 text-sm font-medium mb-1">
              Headquarters Location
            </label>
            <input
              id="location"
              type="text"
              value={profileForm.location}
              onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              placeholder="e.g. Bangalore, KA"
              required
            />
          </div>
          <div>
            <label htmlFor="contact_email" className="block text-gray-600 text-sm font-medium mb-1">
              Recruitment Contact Email Address
            </label>
            <input
              id="contact_email"
              type="email"
              value={profileForm.contact_email}
              onChange={(e) => setProfileForm({ ...profileForm, contact_email: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              placeholder="hr@company.com"
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="description" className="block text-gray-600 text-sm font-medium mb-1">
            Company Profile Bio Description
          </label>
          <textarea
            id="description"
            rows="3"
            value={profileForm.description}
            onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none"
            placeholder="Write a brief overview about your company vision and milestones..."
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition text-sm"
          >
            Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileTab;