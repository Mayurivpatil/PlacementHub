import { useEffect, useState } from "react";
import API from "../api"; // Axios instance
import AcademicProfileTab from "../components/dashboard/AcademicProfileTab";
import ExploreJobsTab from "../components/dashboard/ExploreJobsTab";
import InterviewSlotsTab from "../components/dashboard/InterviewSlotsTab";
import UploadResumeTab from "../components/dashboard/UploadResumeTab";

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [studentName, setStudentName] = useState("");
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [metrics, setMetrics] = useState({
    appliedCompanies: 0,
    upcomingInterviews: 0,
  });
  const [availableDrives, setAvailableDrives] = useState([]);
  const [myApplications, setMyApplications] = useState({});
  const [interviewSlots, setInterviewSlots] = useState([]);

  // Editing profile
  const [academicForm, setAcademicForm] = useState({
    branch: "",
    cgpa: "",
    graduation_year: "",
    phone: "",
    address: "",
  });
  const [newSkill, setNewSkill] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [message, setMessage] = useState({ text: "", isError: false });
  const [loading, setLoading] = useState(false);  // Used while applying.

  useEffect(() => {
    const cachedName = localStorage.getItem("name");
    if (cachedName) setStudentName(cachedName);

    fetchProfileData();
    fetchDashboardMetrics();
    fetchJobFeeds();
  }, []);

  // Reset toast message when switching tabs
  useEffect(() => {
    setMessage({ text: "", isError: false });
  }, [activeTab]);

  // calculate unique slot metric based on Company name + Job Role (This avoids duplicate interview count.)
  const calculateUniqueSlotsCount = (slots) => {
    if (!slots || slots.length === 0) return 0;
    const uniqueKeys = new Set();
    slots.forEach((slot) => {
      const compositeKey = `${slot.company_name}-${slot.job_role}`;
      uniqueKeys.add(compositeKey);
    });
    return uniqueKeys.size;
  };

  const fetchProfileData = async () => {
    try {
      const res = await API.get("/student/profile");
      setProfile(res.data.profile);
      setSkills(res.data.skills);
      if (res.data.profile) {
        setAcademicForm({
          branch: res.data.profile.branch || "",
          cgpa: res.data.profile.cgpa || "",
          graduation_year: res.data.profile.graduation_year || "",
          phone: res.data.profile.phone || "",
          address: res.data.profile.address || "",
        });
      }
    } catch (err) {
      console.error("Error fetching profile details", err);
    }
  };

  const fetchDashboardMetrics = async () => {
    try {
      const res = await API.get("/student/metrics");
      
      const slotsRes = await API.get("/interviews/my-schedule");
      setInterviewSlots(slotsRes.data);

      // Apply filtering logic here to prevent rescheduled slots from counting double
      const uniqueCount = calculateUniqueSlotsCount(slotsRes.data);

      setMetrics({
        appliedCompanies: res.data.appliedCompanies,
        upcomingInterviews: uniqueCount,
      });
    } catch (err) {
      console.error("Error gathering dynamic metrics", err);
    }
  };

const fetchJobFeeds = async () => {
  try {
    const drivesRes = await API.get("/drives");
    setAvailableDrives(drivesRes.data);

    const appsRes = await API.get("/applications/my-applications");
    // convert the applications array into an object.
    const appsMap = {};
    appsRes.data.forEach((app) => {
      // const id = app.drive_id || app.driveId || app.id;
      const id = app.drive_id;
      if (id) appsMap[id] = app;
    });

    setMyApplications(appsMap);

    // Update metric count directly based on returned applications length
    setMetrics((prev) => ({
      ...prev,
      appliedCompanies: appsRes.data.length,
    }));
  } catch (err) {
    console.error("Error setting up job feeds", err);
  }
};

  const fetchMyInterviewSchedule = async () => {
    try {
      const res = await API.get("/interviews/my-schedule");
      setInterviewSlots(res.data);

      const uniqueCount = calculateUniqueSlotsCount(res.data);
      setMetrics((prev) => ({ ...prev, upcomingInterviews: uniqueCount }));
    } catch (err) {
      console.error("Error fetching student interview lineup:", err);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage({ text: "", isError: false });
    try {
      await API.put("/student/profile", academicForm);
      setMessage({
        text: "Academic records saved successfully!",
        isError: false,
      });

      setTimeout(() => {
        setMessage((prev) =>
          prev.text === "Academic records saved successfully!"
            ? { text: "", isError: false }
            : prev,
        );
      }, 4000);

      fetchProfileData();
      fetchJobFeeds();
    } catch (err) {
      setMessage({
        text: "Failed to update academic milestones.",
        isError: true,
      });
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    try {
      await API.post("/student/skills", { skill_name: newSkill });
      setNewSkill("");
      fetchProfileData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveSkill = async (skillName) => {
    try {
      await API.delete("/student/skills", { 
        data: { skill_name: skillName } 
      });
      
      setSkills((prevSkills) => prevSkills.filter((skill) => skill.skill_name !== skillName));
      setMessage({ text: "Skill removed successfully!", isError: false });

      setTimeout(() => {
        setMessage((prev) => 
          prev.text === "Skill removed successfully!" ? { text: "", isError: false } : prev
        );
      }, 3000);
    } catch (err) {
      console.error("Error deleting target skill record:", err);
      setMessage({ text: "Failed to delete skill from profile.", isError: true });
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setMessage({
        text: "Invalid file format selected. Please upload a PDF file.",
        isError: true,
      });
      setResumeFile(null);
      e.target.value = "";
      return;
    }

    setMessage({ text: "", isError: false });
    setResumeFile(selectedFile);
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) return;

    const formData = new FormData();
    formData.append("resume", resumeFile);

    setMessage({ text: "Uploading resume ...", isError: false });
    try {
      await API.post("/student/upload-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage({ text: "Resume Uploaded successfully!", isError: false });
      setResumeFile(null);
      fetchProfileData();
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Upload rejected.",
        isError: true,
      });
    }
  };

  const handleApply = async (driveId) => {
    if (!driveId) return;
    setLoading(true);
    setMessage({ text: "", isError: false });

    try {
      await API.post(`/applications/apply/${driveId}`);
      setMessage({ text: "Application submitted cleanly!", isError: false });

      setTimeout(() => {
        setMessage((prev) =>
          prev.text === "Application submitted cleanly!"
            ? { text: "", isError: false }
            : prev,
        );
      }, 4000);

      setMyApplications((prev) => ({
        ...prev,
        [driveId]: { status: "Applied" },
      }));
      await fetchDashboardMetrics();
      await fetchJobFeeds();
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Application submission failed.",
        isError: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Strip */}
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">
          PlacementHub{" "}
          <span className="text-sm font-normal text-gray-500">
            | Student Portal
          </span>
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-700 font-medium">
            Welcome, {studentName || "Student"}
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-1.5 rounded-md text-sm font-semibold transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto p-6 grid grid-cols-1 md:grid-cols-4 gap-6 flex-grid">  
        {/* Sidebar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2 h-fit">
          <button
            onClick={() => setActiveTab("profile")}
            className={`text-left px-4 py-2.5 rounded-lg font-medium transition ${activeTab === "profile" ? "bg-indigo-600 font-semibold text-white" : "text-gray-600 hover:bg-gray-50"}`}
          >
            Academic Profile
          </button>
          <button
            onClick={() => setActiveTab("jobs")}
            className={`text-left px-4 py-2.5 rounded-lg font-medium transition ${activeTab === "jobs" ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
          >
            Explore Jobs
          </button>
          <button
            onClick={() => {
              setActiveTab("interviews-timeline");
              fetchMyInterviewSchedule();
            }}
            className={`text-left px-4 py-2.5 rounded-lg font-medium transition ${activeTab === "interviews-timeline" ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
          >
            Interview Slots
          </button>
          <button
            onClick={() => setActiveTab("resume")}
            className={`text-left px-4 py-2.5 rounded-lg font-medium transition ${activeTab === "resume" ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
          >
            Upload Resume
          </button>
        </div>

        {/* Dashboard Core Content Column */}
        <div className="md:col-span-3 space-y-6">
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setActiveTab("jobs")}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer hover:border-indigo-200 transition"
            >
              <div>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                  Applied Drives
                </p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">
                  {metrics.appliedCompanies}
                </h3>
              </div>
              <div className="bg-indigo-50 text-indigo-600 p-3 rounded-lg text-xl font-bold">
                💼
              </div>
            </div>

            <div
              onClick={() => {
                setActiveTab("interviews-timeline");
                fetchMyInterviewSchedule();
              }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer hover:border-indigo-200 transition"
            >
              <div>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                  Scheduled Slots
                </p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">
                  {metrics.upcomingInterviews}
                </h3>
              </div>
              <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg text-xl font-bold">
                📅
              </div>
            </div>
          </div>

          {/* Toast Notification Feed */}
          {message.text && (
            <div
              className={`p-4 rounded-lg text-sm font-medium border transition-all ${message.isError ? "bg-red-50 border-red-200 text-red-700" : "bg-emerald-50 border-emerald-200 text-emerald-700"}`}
            >
              {message.text}
            </div>
          )}

          {/* Dynamic Render Tabs */}
          {activeTab === "profile" && (
            <AcademicProfileTab
              profile={profile}
              skills={skills}
              academicForm={academicForm}
              setAcademicForm={setAcademicForm}
              handleProfileUpdate={handleProfileUpdate}
              handleAddSkill={handleAddSkill}
              handleRemoveSkill={handleRemoveSkill}
              newSkill={newSkill}
              setNewSkill={setNewSkill}
            />
          )}

          {activeTab === "jobs" && (
            <ExploreJobsTab
              availableDrives={availableDrives}
              myApplications={myApplications}
              profile={profile}
              loading={loading}
              handleApply={handleApply}
            />
          )}

          {activeTab === "interviews-timeline" && (
            <InterviewSlotsTab interviewSlots={interviewSlots} />
          )}

          {activeTab === "resume" && (
            <UploadResumeTab
              profile={profile}
              resumeFile={resumeFile}
              handleResumeUpload={handleResumeUpload}
              handleFileChange={handleFileChange}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;