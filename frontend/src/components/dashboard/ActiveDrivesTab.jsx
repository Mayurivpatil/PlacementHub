import React from "react";

const ActiveDrivesTab = ({
  myDrives,
  expandedDriveId,
  onFetchApplicants,
  selectedDriveApplicants,
  onStatusUpdate,
  onOpenScheduleModal,
  onOpenDetailsModal,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Your Active Hiring</h2>
      {myDrives.length === 0 ? (
        <div className="bg-white p-8 text-center rounded-xl border border-gray-100 text-gray-400">
          No live placement windows open yet. Click "Post New Job Drive" to
          configure one.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {myDrives.map((drive) => (
            <div
              key={drive.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div
                onClick={() => onFetchApplicants(drive.id)}
                className="p-6 flex justify-between items-start hover:bg-gray-50/50 transition cursor-pointer"
              >
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-gray-900">
                    {drive.job_role}
                  </h3>
                  <p className="text-sm text-indigo-600 font-semibold">
                    Package: {drive.package} LPA
                  </p>
                  <p className="text-sm text-gray-500">
                    {drive.job_description}
                  </p>
                  <div className="flex gap-4 pt-2 text-xs text-gray-400">
                    <span>
                      Criteria: ≥{" "}
                      {drive.eligibility_cgpa ||
                        drive.eligibility_criteria ||
                        "0"}{" "}
                      CGPA
                    </span>
                    <span>
                      Deadline:{" "}
                      {drive.last_date
                        ? new Date(drive.last_date).toLocaleDateString("en-IN")
                        : "N/A"}
                    </span>
                  </div>
                </div>
                <button className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs px-3 py-1.5 font-bold rounded-lg transition">
                  {expandedDriveId === drive.id
                    ? "Hide Candidates ▴"
                    : "Review Candidates ▾"}
                </button>
              </div>

              {expandedDriveId === drive.id && (
                <div className="border-t border-gray-100 bg-gray-50/50 p-6 space-y-3">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Applied Candidates
                  </h4>
                  {selectedDriveApplicants.length === 0 ? (
                    <p className="text-sm text-gray-400 italic py-1">
                      No Applied Candidates
                    </p>
                  ) : (
                    <div className="overflow-x-auto border rounded-xl bg-white shadow-sm">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="bg-gray-50 text-gray-600 font-semibold border-b text-xs">
                            <th className="px-4 py-3">Student Name</th>
                            <th className="px-4 py-3">Branch</th>
                            <th className="px-4 py-3">CGPA</th>
                            <th className="px-4 py-3 text-center">Profile</th>
                            <th className="px-4 py-3">Current Stage</th>
                            <th className="px-4 py-3 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y text-gray-700">
                          {selectedDriveApplicants.map((app) => {
                            const targetApplicationId =
                              app.id || app.application_id;
                            const isScheduled =
                              app.status === "Interview Scheduled" ||
                              app.application_status === "Interview Scheduled";

                            const rawDate =
                              app.interview_date ||
                              app.date ||
                              app.scheduled_date ||
                              app.interview?.date;
                            const time =
                              app.interview_time ||
                              app.time ||
                              app.scheduled_time ||
                              app.interview?.time;
                            const mode =
                              app.interview_mode ||
                              app.mode ||
                              app.interview?.mode ||
                              "Online";
                            const link =
                              app.meeting_link ||
                              app.interview_link ||
                              app.link ||
                              app.interview?.link ||
                              app.interview?.meeting_link;
                            const venue =
                              app.interview_venue ||
                              app.venue ||
                              app.interview?.venue;

                            return (
                              <React.Fragment
                                key={app.id || targetApplicationId}
                              >
                                {/* Standard Candidate Data Row */}
                                <tr className="hover:bg-gray-50/30 transition-colors">
                                  <td className="px-4 py-3 font-semibold text-gray-900">
                                    {app.student_name}
                                  </td>
                                  <td className="px-4 py-3 text-xs">
                                    {app.branch || "N/A"}
                                  </td>
                                  <td className="px-4 py-3 font-medium">
                                    {app.cgpa || "N/A"}
                                  </td>

                                  <td className="px-4 py-3 text-center">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        onOpenDetailsModal
                                          ? onOpenDetailsModal(app)
                                          : console.log(
                                              "Details application context:",
                                              app,
                                            )
                                      }
                                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold px-3 py-1.5 rounded-lg transition shadow-sm"
                                    >
                                      🔍 View Details
                                    </button>
                                  </td>

                                  <td className="px-4 py-3">
                                    <span
                                      className={`inline-block whitespace-nowrap text-center text-xs px-2.5 py-1 font-bold rounded-full border ${
                                        app.status === "Applied"
                                          ? "bg-blue-50 text-blue-700 border-blue-100"
                                          : app.status === "Shortlisted"
                                            ? "bg-amber-50 text-amber-700 border-amber-100"
                                            : app.status === "Interview Scheduled"
                                              ? "bg-indigo-50 text-indigo-700 border-indigo-100 animate-pulse"
                                              : app.status === "Selected" || app.status === "Placed"
                                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                                : "bg-rose-50 text-rose-700 border-rose-100"
                                      }`}
                                    >
                                      {app.status === "Selected" ? "Placed" : app.status}
                                    </span>
                                  </td>

                                  <td className="px-4 py-3 text-center">
                                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                      {app.status === "Applied" && (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            onStatusUpdate(
                                              targetApplicationId,
                                              "Shortlisted",
                                            )
                                          }
                                          className="bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1.5 rounded-lg transition"
                                        >
                                          Shortlist
                                        </button>
                                      )}

                                      <button
                                        type="button"
                                        onClick={() => onOpenScheduleModal(app)}
                                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1.5 rounded-lg transition"
                                      >
                                        Schedule 🗓️
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          onStatusUpdate(
                                            targetApplicationId,
                                            "Selected",
                                          )
                                        }
                                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1.5 rounded-lg transition"
                                      >
                                        Place
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          onStatusUpdate(
                                            targetApplicationId,
                                            "Rejected",
                                          )
                                        }
                                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold px-2.5 py-1.5 rounded-lg transition"
                                      >
                                        Reject
                                      </button>
                                    </div>
                                  </td>
                                </tr>

                                {/* Scheduled Interview Details Row */}
                                {isScheduled && (
                                  <tr className="bg-indigo-50/40">
                                    <td
                                      colSpan="6"
                                      className="px-6 py-3 border-l-4 border-indigo-500 text-xs"
                                    >
                                      <div className="flex flex-wrap items-center gap-6 text-gray-600 font-medium">
                                        <span className="text-indigo-900 font-bold flex items-center gap-1">
                                          ⏱️ Scheduled Interview Details:
                                        </span>
                                        <span>
                                          <strong className="text-gray-800">
                                            Date:
                                          </strong>{" "}
                                          {rawDate && rawDate !== "Pending"
                                            ? new Date(
                                                rawDate,
                                              ).toLocaleDateString("en-IN")
                                            : "Pending"}
                                        </span>
                                        <span>
                                          <strong className="text-gray-800">
                                            Time:
                                          </strong>{" "}
                                          {time || "Pending"}
                                        </span>
                                        <span>
                                          <strong className="text-gray-800">
                                            Type:
                                          </strong>{" "}
                                          {mode}
                                        </span>
                                        {link ? (
                                          <a
                                            href={
                                              link.startsWith("http")
                                                ? link
                                                : `https://${link}`
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white border border-emerald-200 rounded-xl shadow-sm transition-all duration-200 group active:scale-95"
                                          >
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse group-hover:bg-white"></span>
                                            Join Meeting
                                          </a>
                                        ) : venue ? (
                                          <span>
                                            <strong className="text-gray-800">
                                              Location:
                                            </strong>{" "}
                                            {venue}
                                          </span>
                                        ) : (
                                          <span className="text-gray-400 italic">
                                            No link or address provided
                                          </span>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveDrivesTab;