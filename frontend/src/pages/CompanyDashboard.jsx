import { useEffect, useState } from "react";
import API from "../api";
import ActiveDrivesTab from "../components/dashboard/ActiveDrivesTab";
import PostDriveTab from "../components/dashboard/PostDriveTab";
import ProfileTab from "../components/dashboard/ProfileTab";
import ScheduleModal from "../components/dashboard/ScheduleModal";
import StudentDetailsModal from "../components/dashboard/StudentDetailsModal";

const CompanyDashboard = () => {
  const [activeTab, setActiveTab] = useState("drives");
  const [companyProfile, setCompanyProfile] = useState(null);
  const [myDrives, setMyDrives] = useState([]);
  const [selectedDriveApplicants, setSelectedDriveApplicants] = useState([]);
  const [expandedDriveId, setExpandedDriveId] = useState(null);

  // Scheduling Modal State
  const [schedulingApplicant, setSchedulingApplicant] = useState(null);
  const [interviewForm, setInterviewForm] = useState({
    interview_date: "",
    interview_time: "",
    interview_mode: "Online",
    meeting_link: "",
    venue: "", 
  });
  const [modalLoading, setModalLoading] = useState(false);

  // Student Profile View Sheet State
  const [viewingStudentDetails, setViewingStudentDetails] = useState(null);

  // Form States
  const [profileForm, setProfileForm] = useState({
    company_name: "",
    website: "",
    location: "",
    contact_email: "",
    description: "",
  });

  const [driveForm, setDriveForm] = useState({
    job_role: "",
    salaryPackage: "",
    eligibility_cgpa: "",
    location: "",
    last_date: "",
    drive_date: "",
    description: "",
  });

  const [message, setMessage] = useState({ text: "", isError: false });

  useEffect(() => {
    fetchCompanyProfile();
    fetchOurDrives();
  }, []);

  const triggerNotification = (text, isError = false) => {
    setMessage({ text, isError });
    setTimeout(() => {
      setMessage({ text: "", isError: false });
    }, 4000);
  };

  const fetchCompanyProfile = async () => {
    try {
      const res = await API.get("/company/profile");
      if (res.data.profile) {
        setCompanyProfile(res.data.profile);
        setProfileForm({
          company_name: res.data.profile.company_name || "",
          website: res.data.profile.website || "",
          location: res.data.profile.location || "",
          contact_email: res.data.profile.contact_email || "",
          description: res.data.profile.description || "",
        });
      }
    } catch (err) {
      console.error("Profile fetch error", err);
    }
  };

  const fetchOurDrives = async () => {
    try {
      const res = await API.get("/drives");
      setMyDrives(res.data);
    } catch (err) {
      console.error("Drives fetch error", err);
    }
  };

  const fetchApplicantsForDrive = async (driveId) => {
    try {
      if (expandedDriveId === driveId) {
        setExpandedDriveId(null);
        setSelectedDriveApplicants([]);
        return;
      }
      const res = await API.get(`/applications/drive/${driveId}`);
      setSelectedDriveApplicants(res.data);
      setExpandedDriveId(driveId);
    } catch (err) {
      console.error("Error fetching applicants", err);
      setSelectedDriveApplicants([]);
    }
  };

  const handleStatusUpdate = async (applicationId, nextStatus) => {
    try {
      //  Ensure this path targets applications instead of interviews:
      await API.put(`/applications/status/${applicationId}`, {
        status: nextStatus,
      });

      triggerNotification(
        `Applicant stage updated successfully to "${nextStatus}"!`,
        false,
      );

      setSelectedDriveApplicants((prev) =>
        prev.map((app) =>
          app.id === applicationId || app.application_id === applicationId
            ? {
                ...app,
                status: nextStatus === "Selected" ? "Placed" : nextStatus,
              }
            : app,
        ),
      );
    } catch (err) {
      console.error(
        "Status update error trace:",
        err.response?.data || err.message,
      );
      triggerNotification(
        "Failed to update candidate status.",
        true,
      );
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    const appId =
      schedulingApplicant?.application_id || schedulingApplicant?.id;

    if (!interviewForm.interview_date || !interviewForm.interview_time) {
      triggerNotification(
        "Please fill out complete appointment slot.",
        true,
      );
      return;
    }

    setModalLoading(true);
    try {
      await API.post("/interviews/schedule", {
        application_id: appId,
        interview_date: interviewForm.interview_date,
        interview_time: interviewForm.interview_time,
        interview_mode: interviewForm.interview_mode,
        meeting_link:
          interviewForm.interview_mode === "Online"
            ? interviewForm.meeting_link
            : null,
        venue:
          interviewForm.interview_mode === "Offline"
            ? interviewForm.venue
            : null,
      });

      triggerNotification(
        `Interview slotted successfully for ${schedulingApplicant.student_name}!`,
        false,
      );

      setSelectedDriveApplicants((prev) =>
        prev.map((app) =>
          app.application_id === appId || app.id === appId
            ? {
                ...app,
                status: "Interview Scheduled",
                application_status: "Interview Scheduled",
              }
            : app,
        ),
      );
      setSchedulingApplicant(null);
      
      // Reset the venue back to an empty string cleanly upon modal exit
      setInterviewForm({
        interview_date: "",
        interview_time: "",
        interview_mode: "Online",
        meeting_link: "",
        venue: "",
      });
    } catch (err) {
      console.error(err);
      triggerNotification(
        err.response?.data?.message ||
          "Failed to commit interview allocation details.",
        true,
      );
    } finally {
      setModalLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put("/company/profile", profileForm);
      triggerNotification(
        "Recruiter profile updated successfully!",
        false,
      );
      fetchCompanyProfile();
    } catch (err) {
      triggerNotification(
        "Failed to record corporate identity.",
        true,
      );
    }
  };

  const handleCreateDrive = async (e) => {
    e.preventDefault();
    const payload = {
      job_role: driveForm.job_role,
      salaryPackage: driveForm.salaryPackage, 
      location: driveForm.location || companyProfile?.location || "Remote",
      eligibility_cgpa: parseFloat(driveForm.eligibility_cgpa) || 0,
      last_date: driveForm.last_date,
      drive_date: driveForm.drive_date || driveForm.last_date,
      description: driveForm.description || driveForm.job_description,
    };

    if (
      !payload.job_role ||
      !payload.salaryPackage ||
      !payload.description ||
      payload.eligibility_cgpa <= 0 ||
      !payload.last_date
    ) {
      triggerNotification(
        "❌ Validation Error: Please fill in all required fields accurately.",
        true,
      );
      return;
    }

    try {
      await API.post("/drives", payload);
      triggerNotification(
        "🎉 New recruitment drive published live to student feeds!",
        false,
      );
      // Reset form state cleanly
      setDriveForm({
        job_role: "",
        salaryPackage: "",
        eligibility_cgpa: "",
        location: "",
        last_date: "",
        drive_date: "",
        description: "",
      });
      fetchOurDrives();
      setActiveTab("drives");
    } catch (err) {
      const backendErrorMessage =
        err.response?.data?.message || err.response?.data?.error;
      triggerNotification(
        backendErrorMessage ||
          "Server validation rejected the submission format.",
        true,
      );
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Header Section */}
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">
          PlacementHub{" "}
          <span className="text-sm font-normal text-gray-500">
            | Recruiter Portal
          </span>
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-700 font-medium">
            Recruiter: {localStorage.getItem("name")}
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-1.5 rounded-md text-sm font-semibold transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="max-w-7xl w-full mx-auto p-6 grid grid-cols-1 md:grid-cols-4 gap-6 grow">
        {/* Navigation Sidebar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2 h-fit">
          <button
            onClick={() => setActiveTab("drives")}
            className={`text-left px-4 py-2.5 rounded-lg font-medium transition ${activeTab === "drives" ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
          >
            Active Drives ({myDrives.length})
          </button>
          <button
            onClick={() => setActiveTab("new-drive")}
            className={`text-left px-4 py-2.5 rounded-lg font-medium transition ${activeTab === "new-drive" ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
          >
            Post New Job Drive
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`text-left px-4 py-2.5 rounded-lg font-medium transition ${activeTab === "profile" ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
          >
            Company Profile
          </button>
        </div>

        {/* Dynamic Content Frame */}
        <div className="md:col-span-3 space-y-6">
          {message.text && (
            <div
              className={`p-4 rounded-lg text-sm font-medium border ${message.isError ? "bg-red-50 border-red-200 text-red-700" : "bg-emerald-50 border-emerald-200 text-emerald-700"}`}
            >
              {message.text}
            </div>
          )}

          {activeTab === "drives" && (
            <ActiveDrivesTab
              myDrives={myDrives}
              expandedDriveId={expandedDriveId}
              onFetchApplicants={fetchApplicantsForDrive}
              selectedDriveApplicants={selectedDriveApplicants}
              onStatusUpdate={handleStatusUpdate}
              onOpenScheduleModal={setSchedulingApplicant}
              onOpenDetailsModal={setViewingStudentDetails}
            />
          )}

          {activeTab === "new-drive" && (
            <PostDriveTab
              driveForm={driveForm}
              setDriveForm={setDriveForm}
              onSubmit={handleCreateDrive}
            />
          )}

          {activeTab === "profile" && (
            <ProfileTab
              profileForm={profileForm}
              setProfileForm={setProfileForm}
              onSubmit={handleProfileSubmit}
            />
          )}
        </div>
      </main>

      {/* Modal Overlay Management */}
      <ScheduleModal
        schedulingApplicant={schedulingApplicant}
        interviewForm={interviewForm}
        setInterviewForm={setInterviewForm}
        modalLoading={modalLoading}
        onClose={() => setSchedulingApplicant(null)}
        onSubmit={handleScheduleSubmit}
      />

      {/* Renders when a row's "View Details" action fires */}
      <StudentDetailsModal
        student={viewingStudentDetails}
        onClose={() => setViewingStudentDetails(null)}
      />
    </div>
  );
};

export default CompanyDashboard;