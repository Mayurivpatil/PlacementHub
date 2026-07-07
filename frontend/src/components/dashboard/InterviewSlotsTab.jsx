import { useMemo } from 'react';

const InterviewSlotsTab = ({ interviewSlots }) => {
  
  // ⚡ Filter out older schedules: group by company + job role, and keep the absolute latest entry
  const latestInterviewSlots = useMemo(() => {
    if (!interviewSlots || interviewSlots.length === 0) return [];

    const uniqueSlotsMap = {};

    interviewSlots.forEach((slot) => {
      const uniqueKey = `${slot.company_name}-${slot.job_role}`;
      const existingSlot = uniqueSlotsMap[uniqueKey];

      if (!existingSlot) {
        uniqueSlotsMap[uniqueKey] = slot;
      } else {
        // Compare by primary key ID or date timestamp to guarantee the newest row wins
        const currentId = Number(slot.interview_id || slot.id);
        const existingId = Number(existingSlot.interview_id || existingSlot.id);

        if (currentId > existingId) {
          uniqueSlotsMap[uniqueKey] = slot;
        }
      }
    });

    return Object.values(uniqueSlotsMap);
  }, [interviewSlots]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
      <h2 className="text-xl font-bold text-gray-800 border-b pb-3">Your Upcoming Interview Schedules</h2>
      
      {latestInterviewSlots.length === 0 ? (
        <div className="text-center py-8 border border-dashed rounded-xl bg-gray-50 text-sm text-gray-400">
          No interview calls scheduled at this time.
        </div>
      ) : (
        <div className="space-y-4">
          {latestInterviewSlots.map((slot) => {
            const currentMode = slot.interview_mode || "";
            const isOffline = currentMode.toLowerCase().includes('offline') || 
                              currentMode.toLowerCase().includes('person');

            return (
              <div 
                key={slot.interview_id || slot.id} 
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 border border-gray-100 rounded-xl bg-gradient-to-r from-gray-50/50 to-white hover:border-indigo-100 transition-all shadow-sm"
              >
                <div className="space-y-1.5 w-full sm:w-auto">
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                    {slot.company_name}
                  </span>
                  <h4 className="text-base font-bold text-gray-800 pt-1">{slot.job_role} Interview Schedule</h4>
                  
                  <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-500 pt-1 items-center">
                    <span>📅 Date: {slot.interview_date ? new Date(slot.interview_date).toLocaleDateString("en-IN") : "N/A"}</span>
                    <span>⏰ Time: {slot.interview_time}</span>
                    <span>📍 Mode: <strong className="text-gray-700">{currentMode || "Online"}</strong></span>
                  </div>

                  {/* 🏢 Dynamic Physical Venue Display Banner */}
                  {isOffline && (
                    <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl max-w-md animate-in fade-in duration-200">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                        Assigned Location
                      </span>
                      <div className="flex items-start gap-1.5 text-slate-700 font-semibold text-xs">
                        <span className="mt-0.5">🏢</span>
                        <p>{slot.venue ? slot.venue : "Main Placement Cell / Auditorium Room"}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 🔗 Virtual Meeting Link Display Action button */}
                {slot.meeting_link && !isOffline && (
                  <a 
                    href={slot.meeting_link} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="mt-3 sm:mt-0 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-md transition whitespace-nowrap cursor-pointer"
                  >
                    Join Meeting 🚀
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InterviewSlotsTab;