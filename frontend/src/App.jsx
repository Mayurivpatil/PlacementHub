import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
<<<<<<< HEAD
import AdminDashboard from './pages/AdminDashboard'; 
=======
import AdminDashboard from './pages/AdminDashboard';
>>>>>>> 16e67d8 (Changes)
import CompanyDashboard from './pages/CompanyDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/company-dashboard" element={<CompanyDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
