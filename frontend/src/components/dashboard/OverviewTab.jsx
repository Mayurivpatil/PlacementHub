const OverviewTab = ({ metrics, branchAnalytics }) => {
  if (!metrics) return null;

  return (
    <div className="space-y-6">
      {/* Visual Highlight Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex justify-between items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Students</span>
            <h4 className="text-2xl font-black text-slate-900 mt-1">{metrics.totalStudents}</h4>
          </div>
          <div className="text-2xl p-2 bg-blue-50 rounded-xl">🎓</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex justify-between items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Firms Registered</span>
            <h4 className="text-2xl font-black text-slate-900 mt-1">{metrics.totalCompanies}</h4>
          </div>
          <div className="text-2xl p-2 bg-indigo-50 rounded-xl">🏢</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex justify-between items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Job Drives</span>
            <h4 className="text-2xl font-black text-slate-900 mt-1">{metrics.activeDrives}</h4>
          </div>
          <div className="text-2xl p-2 bg-purple-50 rounded-xl">💼</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex justify-between items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Placed Candidates</span>
            <h4 className="text-2xl font-black text-slate-900 mt-1 text-emerald-600">{metrics.selectedStudents}</h4>
          </div>
          <div className="text-2xl p-2 bg-emerald-50 rounded-xl">✅</div>
        </div>
      </div>

      {/* Branch Matrix Telemetry */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 space-y-4">
        <div>
          <h3 className="text-lg font-black text-slate-900">Branch-Wise Placement Summary</h3>
          <p className="text-slate-400 text-xs font-medium">Live breakdown comparing gross registration size against selected job applicants.</p>
        </div>
        <div className="overflow-x-auto border border-slate-100 rounded-xl">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-5 py-3">Academic Department</th>
                <th className="px-5 py-3">Total Students</th>
                <th className="px-5 py-3">Placed Candidates</th>
                <th className="px-5 py-3">Success Ratio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {branchAnalytics.map((branchItem, idx) => {
                const percentage = branchItem.total_students > 0 
                  ? ((branchItem.placed_students / branchItem.total_students) * 100).toFixed(1) 
                  : '0.0';
                return (
                  <tr key={idx} className="hover:bg-slate-50/40">
                    <td className="px-5 py-3.5 font-bold text-slate-900">{branchItem.branch || "General"}</td>
                    <td className="px-5 py-3.5">{branchItem.total_students}</td>
                    <td className="px-5 py-3.5 text-emerald-600 font-bold">{branchItem.placed_students}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div className="bg-indigo-600 h-2" style={{ width: `${Math.min(parseFloat(percentage), 100)}%` }}></div>
                        </div>
                        <span className="text-xs text-slate-500 font-bold">{percentage}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;