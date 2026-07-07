
const CompanyDetailsModal = ({ company, onClose }) => {
  if (!company) return null;

  const displayName = company.company_name || company.name || "Unnamed Company";
  const displayEmail = company.contact_email || company.email || "N/A";

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-end z-50 animate-in fade-in duration-200">
      <div className="bg-white h-full w-full max-w-md p-6 shadow-2xl border-l border-slate-100 flex flex-col justify-between animate-in slide-in-from-right duration-300">
        <div className="space-y-6 overflow-y-auto pr-2">
          
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">{displayName}</h2>
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mt-0.5">
                Company Profile
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              ✕ Close
            </button>
          </div>

          {/* Body Content */}
          <div className="space-y-5">
            <div>
              <h4 className="text-xs font-bold text-black-400 tracking-wider uppercase mb-2">
                🏢 Company Overview
              </h4>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {company.description || company.bio || "No corporate bio or profile description provided yet."}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-black-400 tracking-wider uppercase mb-2">
                🌐 Digital & Contact Channels
              </h4>
              <div className="border border-slate-100 rounded-xl divide-y divide-slate-100 overflow-hidden">
                <div className="p-3.5 flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-medium">Website</span>
                  {company.website ? (
                    <a
                      href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 font-semibold hover:underline break-all max-w-[240px] text-right"
                    >
                      {company.website}
                    </a>
                  ) : (
                    <span className="text-slate-500 italic">Not Specified</span>
                  )}
                </div>

                <div className="p-3.5 flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-medium">HR Email Address</span>
                  <span className="text-slate-700 font-semibold break-all max-w-[240px] text-right">
                    {displayEmail}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CompanyDetailsModal;