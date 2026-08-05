import { useMemo, useState } from 'react';

const ExploreJobsTab = ({ availableDrives, myApplications, profile, loading, handleApply }) => {
  // This stores which company's details are expanded.
  const [visibleCompanyInfo, setVisibleCompanyInfo] = useState({});
  
  // 🔍 Interactive Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [eligibilityFilter, setEligibilityFilter] = useState('all'); // 'all' or 'eligible'
  const [statusFilter, setStatusFilter] = useState('active'); // 'all', 'active', 'closed'

  // This opens and closes company information.
  const toggleCompanyProfile = (driveId) => {
    setVisibleCompanyInfo((prev) => ({
      ...prev,
      [driveId]: !prev[driveId],
    }));
  };

// ⚡ Process filtering and sorting efficiently using useMemo
// With useMemo - React remembers the previous result. (It recalculates only if the data changes)
  const processedDrives = useMemo(() => {
    const studentCgpa = parseFloat(profile?.cgpa || 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);  // This removes time.

    return [...availableDrives]
      // 1. Filter based on Search & Control options
      .filter((drive) => {
        // Search filter matching job role or company name
        const matchesSearch = 
          drive.job_role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          drive.company_name.toLowerCase().includes(searchQuery.toLowerCase());

        // Eligibility computation
        const requiredCgpa = parseFloat(drive.eligibility_cgpa || drive.eligibility_criteria || 0);
        const isEligible = studentCgpa >= requiredCgpa;
        const matchesEligibility = eligibilityFilter === 'all' || (eligibilityFilter === 'eligible' && isEligible);

        // Deadline Check
        const deadlineDate = new Date(drive.last_date);
        deadlineDate.setHours(0, 0, 0, 0);
        const isExpired = today > deadlineDate;
        
        // Check if student has progressed past standard application phase
        const userApp = myApplications[drive.id];
        const hasAdvancedStatus = userApp && ['shortlisted', 'interview scheduled', 'selected', 'placed'].includes(userApp.status?.toLowerCase());

        let matchesStatus = true;
        
        // Even if the deadline has passed, students who already reached later stages should still see that drive.
        if (statusFilter === 'active') {
          matchesStatus = !isExpired || hasAdvancedStatus;    // Show active drives or already shortlisted drives.
        }

        if (statusFilter === 'closed') {
          matchesStatus = isExpired && !hasAdvancedStatus;    // Deadline passed and not shortlisted/interviewed/placed
        }

        return matchesSearch && matchesEligibility && matchesStatus;
      })
      // 2. Keep the descending (DSC) order. Latest deadline first.
      .sort((a, b) => new Date(b.last_date) - new Date(a.last_date));

      // If any one changes react recalculates otherwise it returns the previous result.
  }, [availableDrives, searchQuery, eligibilityFilter, statusFilter, profile, myApplications]); 

  return (
    <div className="space-y-6">
      {/* Header Context */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Campus Placement Vacancies</h2>
          <p className="text-xs text-gray-400 font-medium">Explore live tracks, track deadlines, and apply instantly.</p>
        </div>
        <div className="text-xs bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-lg font-bold text-indigo-600">
          Your Profile CGPA: {profile?.cgpa || '0.00'}
        </div>
      </div>

      {/* 🛠️ Dynamic Search & Filter Control Bar Panel */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Real-time Text Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search role or company name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition text-gray-700 font-medium"
          />
        </div>

        {/* Eligibility Split Filter */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setEligibilityFilter('all')}
            className={`flex-1 text-center text-xs py-1.5 rounded-md font-bold transition cursor-pointer select-none ${
              eligibilityFilter === 'all' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            All Drives
          </button>
          <button
            onClick={() => setEligibilityFilter('eligible')}
            className={`flex-1 text-center text-xs py-1.5 rounded-md font-bold transition cursor-pointer select-none ${
              eligibilityFilter === 'eligible' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Matches My CGPA 🎓
          </button>
        </div>

        {/* Status Process Filter */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {['active', 'closed', 'all'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`flex-1 text-center text-xs py-1.5 rounded-md font-bold uppercase tracking-wider transition cursor-pointer select-none ${
                statusFilter === status ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {status === 'active' ? '🟢 Live' : status === 'closed' ? '🔒 Closed' : 'Show All'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Listing Grid */}
      {processedDrives.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-gray-100 text-gray-400 space-y-2">
          <div className="text-2xl">🔍</div>
          <p className="text-sm font-medium text-gray-500">No active vacancies match your current layout filters.</p>
          <button 
            onClick={() => { setSearchQuery(''); setEligibilityFilter('all'); setStatusFilter('all'); }}
            className="text-xs text-indigo-600 font-bold hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {processedDrives.map((drive) => {
            const userApp = myApplications[drive.id];
            const hasApplied = !!userApp;
            const applicationStatus = userApp?.status || "Applied";

            const studentCgpa = parseFloat(profile?.cgpa || 0);
            const requiredCgpa = parseFloat(drive.eligibility_cgpa || drive.eligibility_criteria || 0);
            const isEligible = studentCgpa >= requiredCgpa;

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const deadlineDate = new Date(drive.last_date);
            deadlineDate.setHours(0, 0, 0, 0);

            const isExpired = today > deadlineDate;
            const isCompanyOpen = !!visibleCompanyInfo[drive.id];

            return (
              <div
                key={drive.id}
                className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4 transition ${
                  (!isEligible || isExpired) && !hasApplied ? "opacity-75 bg-gray-50/50" : ""
                }`}
              >
                {/* Upper Header Row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1 grow">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-bold text-gray-900">{drive.job_role}</h3>
                      
                      {/* Interactive Corporate Badge Toggle */}
                      <button
                        type="button"
                        onClick={() => toggleCompanyProfile(drive.id)}
                        className="text-sm bg-gray-50 hover:bg-gray-100 text-slate-700 px-2.5 py-1 rounded font-medium transition flex items-center gap-1 cursor-pointer select-none border border-transparent shadow-sm"
                      >
                        @ {drive.company_name}
                        <span className="text-xs font-normal ml-1 text-gray-400 flex items-center gap-0.5">
                          <span className="text-gray-400 text-[10px]">{isCompanyOpen ? '▲' : '▼'}</span>
                          <span className="text-slate-400 font-medium">{isCompanyOpen ? 'Hide Info' : 'View Info'}</span>
                        </span>
                      </button>
                    </div>
                    <p className="text-sm text-indigo-600 font-semibold">
                      Package: {drive.package} LPA
                    </p>
                  </div>

                  {/* Action Buttons Block */}
                  <div className="w-full sm:w-auto flex sm:flex-col items-end gap-2 shrink-0">
                    {hasApplied ? (
                      (() => {
                        const currentStatus = (applicationStatus || "applied").toLowerCase();
                        
                        // 1. Purely Shortlisted (Recruiter shortlisted but hasn't picked an interview slot yet)
                        if (currentStatus === "shortlisted") {
                          return (
                            <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-3 py-2 rounded-lg font-bold text-center w-full sm:w-auto inline-flex items-center justify-center gap-1">
                              🎉 Shortlisted! Awaiting Slot
                            </span>
                          );
                        }
                        
                        // 2. Interview Explicitly Created
                        if (currentStatus === "interview scheduled") {
                          return (
                            <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs px-3 py-2 rounded-lg font-bold text-center w-full sm:w-auto">
                              Interview Scheduled ⏳
                            </span>
                          );
                        }
                        
                        if (currentStatus === "selected" || currentStatus === "placed") {
                          return (
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-3 py-2 rounded-lg font-bold text-center w-full sm:w-auto">
                              Selected & Placed ✓
                            </span>
                          );
                        }
                        if (currentStatus === "rejected") {
                          return (
                            <span className="bg-red-50 text-red-700 border border-red-200 text-xs px-3 py-2 rounded-lg font-bold text-center w-full sm:w-auto">
                              Rejected ❌
                            </span>
                          );
                        }
                        return (
                          <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs px-3 py-2 rounded-lg font-bold text-center w-full sm:w-auto">
                            Applied ✓
                          </span>
                        );
                      })()
                    ) : isExpired ? (
                      <div className="flex flex-col items-end gap-1 w-full sm:w-auto">
                        <span className="bg-gray-100 text-gray-500 border border-gray-200 text-xs px-4 py-2.5 rounded-lg font-bold text-center w-full sm:w-auto cursor-not-allowed select-none">
                          Deadline Passed 🔒
                        </span>
                      </div>
                    ) : !isEligible ? (
                      <div className="flex flex-col items-end gap-1 w-full sm:w-auto">
                        <span className="bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg font-medium text-center w-full border border-red-100">
                          Ineligible 🔒
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleApply(drive.id)}
                        disabled={loading}
                        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-5 py-2.5 rounded-lg font-bold transition shadow-sm disabled:bg-indigo-300"
                      >
                        {loading ? "Processing..." : "Apply Now"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Detailed Job Requirements Container */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2">
                  <h4 
                    style={{ color: 'oklch(51.8% 0.253 323.949)' }} 
                    className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    ⚙️ TECHNICAL SKILLS & JOB EXPECTATIONS
                  </h4>
                  <p className="text-sm font-medium text-gray-700 whitespace-pre-line leading-relaxed">
                    {drive.description || "No specific technical requirements documented by the recruiter."}
                  </p>
                </div>

                {/* 🏢 Corporate Profile Summary Dropdown */}
                {isCompanyOpen && (
                  <div className="bg-slate-50 rounded-xl p-5 border border-gray-200/60 space-y-4 transition-all">
                    <h4 className="text-xs font-bold text-black-500 uppercase tracking-wider flex items-center gap-1.5">
                      🏢 Company Profile Summary
                    </h4>
                    
                    <div className="space-y-3">
                      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                          Company Website
                        </span>
                        {drive.company_website ? (
                          <a 
                            href={drive.company_website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 font-semibold text-sm hover:underline inline-flex items-center gap-1"
                          >
                            {drive.company_website} <span className="text-xs font-normal">↗</span>
                          </a>
                        ) : (
                          <span className="text-gray-400 italic text-sm">Not Provided</span>
                        )}
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                          Company Bio Description
                        </span>
                        <p className="text-sm text-gray-600 leading-relaxed italic font-medium whitespace-pre-line">
                          "{drive.company_bio || "Our teams are leading change on every front."}"
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* eligibility & criteria badges */}
                <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-400 border-t pt-3">
                  <span className={`flex items-center gap-1 ${!isEligible ? "text-red-500 font-semibold" : ""}`}>
                    📋 Minimum Criteria: {drive.eligibility_cgpa || drive.eligibility_criteria || "0"} CGPA 
                    {!isEligible && ` (Your CGPA: ${profile?.cgpa || 0})`}
                  </span>
                  <span className={`${isExpired ? "text-red-500 font-semibold" : ""}`}>
                    📅 Deadline For Apply: {drive.last_date ? new Date(drive.last_date).toLocaleDateString("en-IN") : "N/A"}
                    {isExpired && " (Closed)"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExploreJobsTab;