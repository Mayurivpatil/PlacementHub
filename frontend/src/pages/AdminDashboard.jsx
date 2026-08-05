import { useEffect, useState } from 'react';
import CompanyDetailsModal from '../components/dashboard/CompanyDetailsModal';
import OverviewTab from '../components/dashboard/OverviewTab';
import ReportsTab from '../components/dashboard/ReportsTab';
import VerificationTab from '../components/dashboard/VerificationTab';

const AdminDashboard = () => {
  // Stores current selected tab.
  const [activeTab, setActiveTab] = useState('verification');
  const [pendingCompanies, setPendingCompanies] = useState([]);  // Stores all companies waiting for approval.
  const [loading, setLoading] = useState(true);      // Shows loading spinner.
  const [message, setMessage] = useState('');
  
  const [viewingCompanyDetails, setViewingCompanyDetails] = useState(null);
  const [metrics, setMetrics] = useState(null);    // Stores dashboard statistics.
  const [branchAnalytics, setBranchAnalytics] = useState([]);    // Stores department-wise statistics.

  const [reportType, setReportType] = useState('student-placement');    // Stores selected report (company-wise or student-wise or branch-wise).
  const [reportData, setReportData] = useState([]);          // Stores generated report.

  useEffect(() => {
    fetchPendingCompanies();
  }, []);


  const fetchPendingCompanies = async () => {
    setLoading(true);
    try {
      // Retrieve the JWT token from local storage for authentication
      const token = localStorage.getItem('token');    
      if (!token) {
        setMessage("No login token found. Please log in again.");
        return;
      }

      const response = await fetch('http://localhost:5000/api/admin/pending-companies', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Include the JWT token in the Authorization header (JWT token is sent.)
          'Authorization': `Bearer ${token}` 
        }
      });

      const data = await response.json();
      if (response.ok) {
        setPendingCompanies(data);
      } else {
        setMessage(data.message || 'Failed to load companies.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage('Server error connecting to backend.');
    } finally {
      setLoading(false);
    }
  };

  const fetchGlobalMetrics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/dashboard-stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        setMetrics(data.metrics);
        setBranchAnalytics(data.branchAnalytics);
      } else {
        setMessage(data.message || 'Could not compile campus statistics.');
      }
    } catch (error) {
      console.error('Metrics loading error:', error);
      setMessage('Error loading metric endpoints.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomReport = async (type) => {
    setLoading(true);
    setReportData([]);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/reports/${type}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        setReportData(data);
      } else {
        setMessage(data.message || 'Failed generating selected report dataset.');
      }
    } catch (error) {
      console.error('Report aggregation error:', error);
      setMessage('Error parsing report arrays.');
    } finally {
      setLoading(false);
    }
  };

  // EVENT HANDLERS

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setMessage('');
    if (tabName === 'verification') fetchPendingCompanies();
    if (tabName === 'overview') fetchGlobalMetrics();
    if (tabName === 'reports') fetchCustomReport(reportType);
  };

  const handleReportTypeChange = (newType) => {
    setReportType(newType);
    fetchCustomReport(newType);
  };

  const handleApprove = async (companyId) => {
    try {
      const token = localStorage.getItem('token'); 
      const response = await fetch(`http://localhost:5000/api/admin/approve-company/${companyId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        }
      });

      const data = await response.json();
      if (response.ok) {
        // Remove the approved company from the pending list
        setPendingCompanies(pendingCompanies.filter(company => company.id !== companyId));
        alert('Company verified successfully!');
      } else {
        alert(data.message || 'Verification failed.');
      }
    } catch (error) {
      console.error('Error verifying company:', error);
      alert('Error updating status.');
    }
  };

  const handleOpenDetails = async (company) => {
    try {
      const currentName = company.name || company.company_name || "Unnamed Company";
      const token = localStorage.getItem('token');

      if (company.description || company.website) {
        setViewingCompanyDetails({
          ...company,
          company_name: currentName
        });
        return;
      }

      const response = await fetch(`http://localhost:5000/api/admin/company-profile/${company.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const backendData = data.profile || data;
        
        setViewingCompanyDetails({
          ...company,
          ...backendData,
          company_name: currentName || backendData.company_name || backendData.name
        });
      } else {
        setViewingCompanyDetails({
          ...company,
          company_name: currentName
        });
      }
    } catch (error) {
      console.error('Profile metadata lookup failed:', error);
      setViewingCompanyDetails({
        ...company,
        company_name: company.name || company.company_name || "Unnamed Company"
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    window.location.href = '/login';   
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 sm:p-10 font-sans">
      
      {/* Header Context Section */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">Admin Control Center</h2>
          </div>
          <p className="text-sm text-slate-500 font-medium">
            Manage and verify platform registration requests
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 hover:text-red-600 text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm border border-slate-200 transition-all cursor-pointer group"
        >
          <svg className="w-4 h-4 text-slate-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Log Out
        </button>
      </div>

      {/* VIEW CONTROLLER TAB SEGMENTATION BAR */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex border-b border-slate-200 gap-1 sm:gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => handleTabChange('verification')}
            className={`pb-3 px-4 font-bold text-xs sm:text-sm whitespace-nowrap border-b-2 transition-all ${
              activeTab === 'verification' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            🏢 Pending Verifications ({pendingCompanies.length})
          </button>
          <button
            onClick={() => handleTabChange('overview')}
            className={`pb-3 px-4 font-bold text-xs sm:text-sm whitespace-nowrap border-b-2 transition-all ${
              activeTab === 'overview' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            📈 Platform Metrics Overview
          </button>
          <button
            onClick={() => handleTabChange('reports')}
            className={`pb-3 px-4 font-bold text-xs sm:text-sm whitespace-nowrap border-b-2 transition-all ${
              activeTab === 'reports' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            📊 Placement Reports
          </button>
        </div>
      </div>

      {/* MAIN LAYOUT WRAPPER */}
      <div className="max-w-7xl mx-auto space-y-6">
        {message && (
          <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm font-medium shadow-sm flex items-center gap-2">
            <span>⚠️</span> {message}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-slate-500 font-medium animate-pulse">
              Syncing secure endpoints data records...
            </p>
          </div>
        ) : (
          <>
            {activeTab === 'verification' && (
              <VerificationTab 
                pendingCompanies={pendingCompanies}
                onOpenDetails={handleOpenDetails}
                onApprove={handleApprove}
              />
            )}

            {activeTab === 'overview' && (
              <OverviewTab 
                metrics={metrics}
                branchAnalytics={branchAnalytics}
              />
            )}

            {activeTab === 'reports' && (
              <ReportsTab 
                reportType={reportType}
                reportData={reportData}
                onReportTypeChange={handleReportTypeChange}
              />
            )}
          </>
        )}
      </div>

      <CompanyDetailsModal
        company={viewingCompanyDetails}
        onClose={() => setViewingCompanyDetails(null)}
      />
    </div>
  );
};

export default AdminDashboard;