# 🎓 Full-Stack Campus Recruitment & Placement Portal

A robust, enterprise-grade placement management platform engineered to automate, secure, and streamline interactions between university placement cells, corporate hiring managers, and students. Built with a clean separation of concerns, the system leverages role-based security to deliver distinct, tailored analytical workflows for all three ecosystem participants.


---

## 💻 Portal Dashboards Breakdown

### 🛠️ 1. Central Admin Dashboard
The command center for university placement officers, focused on strict platform governance, data verification, and institutional analytics.
* **Corporate Auditing Pipeline:** A dedicated interface (`VerificationTab`) to review incoming company registrations and verify credentials via a slide-over modal before granting platform access.
* **Branch-Wise Telemetry:** Live statistical tracking (`OverviewTab`) comparing enrollment figures against active placements across different academic departments, complete with dynamic success-ratio metrics.
* **Targeted Query Reports:** On-demand filtering engine (`ReportsTab`) that compiles instantaneous reports on student placement statuses or company-wide hiring trends.
  
  

### 🏢 2. Company Recruiter Dashboard
A comprehensive hub tailored for corporate HR representatives to manage institutional outreach, candidate pipelines, and hiring drives.
* **Job Postings Manager:** Interface to create, modify, and archive job profiles, complete with criteria selection (minimum CGPA, eligible branches, package parameters).
* **Application Tracking System (ATS):** A centralized pipeline to view student profiles, download resumes, and progress applicants through recruitment stages (Shortlisted, Interviewing, Selected, or Rejected).
  
  

### 🎓 3. Student Profile & Application Dashboard
A personalized portal empowering candidates to manage their professional profiles and discover career opportunities.
* **Academic & Profile Vault:** A standardized profile manager where students maintain up-to-date resumes, CGPA scores, backlogs, and branch details.
* **Job Board Discovery:** A clean, filtered interface display of active job openings corresponding strictly to the student's eligibility criteria.
* **Real-Time Application Status:** Tracking history that monitors submitted applications, keeping students informed of their real-time interview progression and final selection offers.

  

---

## 🛠️ Technical Stack & Architecture

* **Frontend:** React.js, Tailwind CSS (Utility-first UI), JavaScript (ES6+), React Context API
* **Backend:** Node.js, Express.js (RESTful API Design)
* **Authentication:** JSON Web Tokens (JWT) implemented with Secure Role-Based Access Control (RBAC) middleware
* **Database:** Relational Database Schema / SQL queries optimized for nested aggregations
