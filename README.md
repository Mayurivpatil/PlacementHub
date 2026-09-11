# 🎓 PlacementHub

<p align="center">
  <strong>A role-based campus recruitment portal for administrators, recruiters, and students.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react&logoColor=white" alt="React and Vite" />
  <img src="https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=nodedotjs&logoColor=white" alt="Node.js and Express" />
  <img src="https://img.shields.io/badge/Database-MySQL-4479A1?logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white" alt="JWT authentication" />
</p>

---

PlacementHub brings campus placement workflows into one portal. It supports company approval, placement-drive creation, student applications, resume uploads, interview scheduling, and placement reporting through tailored dashboards for every user role.

## ✨ Highlights

| 👩‍💼 Administrator | 🏢 Company Recruiter | 🎓 Student |
|---|---|---|
| Approve company registrations | Create placement drives | Maintain academic profile |
| Review placement analytics | Manage applicants | Discover active drives |
| Generate placement reports | Schedule interviews | Apply and track progress |

## 🚀 Features

### 👩‍💼 Administrator dashboard

- Review pending company registrations and approve company access.
- View dashboard metrics and branch-wise placement analytics.
- Generate student placement and company hiring reports.

### 🏢 Company recruiter dashboard

- Maintain a company profile.
- Create placement drives with a role, package, location, minimum CGPA, dates, and description.
- Review applicants, access their profile and resume information, and update application statuses.
- Schedule or reschedule interviews for applications.

### 🎓 Student dashboard

- Maintain an academic profile with branch, CGPA, graduation year, contact details, and resume.
- Browse active placement drives and apply when the minimum-CGPA requirement is met.
- Track application status and upcoming interview schedules.

## 🧰 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, React Router, Vite, Tailwind CSS, Axios |
| **Backend** | Node.js, Express 5 |
| **Database** | MySQL with `mysql2` |
| **Authentication** | JSON Web Tokens (JWT) and role-based authorization |
| **File storage** | Cloudinary and Multer for resume uploads |

## 📁 Project Structure

```text
PlacementHub/
├── frontend/       # React and Vite client
├── backend/        # Express API and MySQL integration
└── README.md
```

## ⚙️ Prerequisites

Before you begin, install or create:

- Node.js 18 or later
- npm
- A MySQL server
- A Cloudinary account for resume uploads

## 🏁 Getting Started

### 1. Install dependencies

```bash
# From the repository root
cd frontend
npm install

cd ../backend
npm install
```

### 2. Configure environment variables

Copy `backend/.env.example` to `backend/.env`, then replace the placeholder values:

```env
PORT=5000
DB_HOST=localhost
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=placementhub
JWT_SECRET=generate_a_long_random_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> [!IMPORTANT]
> Configure the MySQL database named by `DB_NAME` before starting the API. A database schema or migration file is not currently included in this repository, so the required tables must be provisioned separately.

### 3. Run the application

Start the API from the `backend` directory:

```bash
npm run dev
```

The API starts at `http://localhost:5000`.

In a separate terminal, start the frontend:

```bash
cd frontend
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

## 📜 Available Commands

| Directory | Command | Description |
|---|---|---|
| `frontend` | `npm run dev` | Start the Vite development server |
| `frontend` | `npm run build` | Create a production frontend build |
| `frontend` | `npm run lint` | Run ESLint |
| `frontend` | `npm run preview` | Preview a production build |
| `backend` | `npm start` | Start the Express server |
| `backend` | `npm run dev` | Start the Express server with Nodemon |

## 🔌 API Configuration

The frontend calls the API at `http://localhost:5000/api`. The backend allows local frontend origins on ports `5173` and `3000`.

## 🔐 User Roles

| Role | Access |
|---|---|
| `Admin` | Company approvals, analytics, and reports |
| `Company` | Company profile, placement drives, and applicant workflows |
| `Student` | Profile, job discovery, applications, and interview schedules |
