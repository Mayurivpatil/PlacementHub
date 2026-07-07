const VerificationTab = ({ pendingCompanies, onOpenDetails, onApprove }) => {
  if (pendingCompanies.length === 0) {
    return (
      <div className="text-center py-16 bg-white border border-slate-200/60 rounded-2xl shadow-sm max-w-xl mx-auto p-6 space-y-3">
        <div className="text-4xl">🎉</div>
        <h3 className="text-lg font-bold text-slate-900">All clear!</h3>
        <p className="text-sm text-slate-400 max-w-xs mx-auto font-medium">
          There are no pending company profile verifications at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Company Name</th>
              <th className="px-6 py-4">HR Email</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Profile</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {pendingCompanies.map((company) => (
              <tr key={company.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-800">
                  {company.name || company.company_name || "Unnamed Company"}
                </td>
                <td className="px-6 py-4 text-slate-500 font-medium">
                  {company.email || company.contact_email}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold tracking-wide border bg-amber-50 text-amber-700 border-amber-200">
                    ⏳ Pending
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    type="button"
                    onClick={() => onOpenDetails(company)}
                    className="px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    View Details
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => onApprove(company.id)} 
                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    Approve & Verify
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VerificationTab;