
const ReportsTab = ({ reportType, reportData, onReportTypeChange }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-black text-slate-900">Targeted Reports</h3>
          <p className="text-slate-400 text-xs font-medium">Filter and extract specific placement records instantly from system.</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Report Focus:</label>
          <select
            value={reportType}
            onChange={(e) => onReportTypeChange(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 font-bold text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 text-slate-700"
          >
            <option value="student-placement">Student Placement Status </option>
            <option value="company-wise">Company-wise Intake & Drive Summary </option>
          </select>
        </div>
      </div>

      {/* Conditional Sub-Table Engine for Custom Reports */}
      <div className="overflow-x-auto border border-slate-100 rounded-xl">
        {reportData.length === 0 ? (
          <div className="text-center py-10 text-sm text-slate-400 italic">No historical records available matching this dataset request category.</div>
        ) : reportType === 'student-placement' ? (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Branch</th>
                <th className="px-4 py-3">CGPA</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Acquired Firm</th>
                <th className="px-4 py-3">Package Offered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {reportData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/30">
                  <td className="px-4 py-3 font-bold text-slate-900">{row.name}</td>
                  <td className="px-4 py-3">{row.branch}</td>
                  <td className="px-4 py-3 font-bold text-slate-800">{row.cgpa}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded font-bold ${row.placement_status === 'Selected' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                      {row.placement_status === 'Selected' ? 'Placed' : 'Not Placed'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-900 font-semibold">{row.company_name || '—'}</td>
                  <td className="px-4 py-3 text-indigo-600 font-bold">{row.package ? `${row.package} LPA` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="px-5 py-3">Corporate Identity Name</th>
                <th className="px-5 py-3">Corporate Domain</th>
                <th className="px-5 py-3">Total Drives Hosted</th>
                <th className="px-5 py-3">Successful Placements Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {reportData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/30">
                  <td className="px-5 py-3 font-bold text-slate-900">{row.company_name}</td>
                  <td className="px-5 py-3 text-indigo-600 font-medium">{row.website || 'N/A'}</td>
                  <td className="px-5 py-3 font-bold text-slate-800">{row.total_drives}</td>
                  <td className="px-5 py-3 text-emerald-600 font-black">{row.total_hires} selections</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ReportsTab;