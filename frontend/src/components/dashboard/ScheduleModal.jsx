const ScheduleModal = ({ schedulingApplicant, interviewForm, setInterviewForm, modalLoading, onClose, onSubmit }) => {
  if (!schedulingApplicant) return null;

  // Handle mode change to clear opposite fields and keep object state clean
  const handleModeChange = (newMode) => {
    setInterviewForm({
      ...interviewForm,
      interview_mode: newMode,
      // Clear meeting link if changing to offline, clear venue if changing to online
      meeting_link: newMode === "Online" ? interviewForm.meeting_link : "",
      venue: newMode === "Offline" ? interviewForm.venue : ""
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 animate-in fade-in zoom-in duration-200">
        <h3 className="text-lg font-bold text-slate-800 mb-1">Schedule Interview Slot</h3>
        <p className="text-xs text-slate-500 mb-4">
          Setting up interview round for{" "}
          <span className="font-semibold text-indigo-600">{schedulingApplicant.student_name}</span>
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Interview Date</label>
            <input
              type="date" required
              value={interviewForm.interview_date}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-indigo-500"
              onChange={(e) => setInterviewForm({ ...interviewForm, interview_date: e.target.value })}
            />
          </div>

          {/* Time Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Interview Time</label>
            <input
              type="time" required
              value={interviewForm.interview_time}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-indigo-500"
              onChange={(e) => setInterviewForm({ ...interviewForm, interview_time: e.target.value })}
            />
          </div>

          {/* Mode Dropdown Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Mode</label>
            <select
              value={interviewForm.interview_mode}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-indigo-500 bg-white"
              onChange={(e) => handleModeChange(e.target.value)}
            >
              <option value="Online">Online Video Call</option>
              <option value="Offline">In-Person / Offline</option>
            </select>
          </div>

          {/* 🔗 Dynamic Field A: Online Meeting Link */}
          {interviewForm.interview_mode === "Online" && (
            <div className="animate-in fade-in slide-in-from-top-1 duration-200">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Meeting Link (Google Meet / Zoom)</label>
              <input
                type="url" required placeholder="https://meet.google.com/abc-xyz"
                value={interviewForm.meeting_link || ""}
                className="w-full px-3 py-2 border rounded-lg text-sm text-indigo-600 outline-none focus:border-indigo-500"
                onChange={(e) => setInterviewForm({ ...interviewForm, meeting_link: e.target.value })}
              />
            </div>
          )}

          {/* 🏢 Dynamic Field B: Physical Room / Venue Location */}
          {interviewForm.interview_mode === "Offline" && (
            <div className="animate-in fade-in slide-in-from-top-1 duration-200">
              <label className="block text-xs font-semibold text-indigo-600 mb-1">Physical Interview Venue Room</label>
              <input
                type="text" required placeholder="e.g., Seminar Hall B, 3rd Floor, Main Block"
                value={interviewForm.venue || ""}
                className="w-full px-3 py-2 border border-indigo-100 bg-indigo-50/10 rounded-lg text-sm text-slate-700 outline-none focus:border-indigo-500 placeholder-slate-400"
                onChange={(e) => setInterviewForm({ ...interviewForm, venue: e.target.value })}
              />
            </div>
          )}

          {/* Action Button Controls */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={modalLoading}
              className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {modalLoading ? "Saving Slot..." : "Confirm & Notify"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModal;