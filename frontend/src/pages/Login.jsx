import { useState } from 'react';
// Link is used for navigation between pages. (/login, /register)
// useNavigate is used when you want to navigate programmatically using JavaScript. (/student-dashboard)
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();  // This creates the navigate function.

    // e means event object. When the user types into an input, the browser generates an event.
    const handleChange = (e) => {
        // ...fromData is a spread operator that copies the existing values first.
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await API.post('/auth/login', formData);
            
            // Save state to localStorage
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.user.role);
            localStorage.setItem('name', res.data.user.name);

            // Redirect dynamically based on User Role
            if (res.data.user.role === 'Admin') navigate('/admin-dashboard');
            else if (res.data.user.role === 'Company') navigate('/company-dashboard');
            else navigate('/student-dashboard');
            
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid login credentials. Please try again.');
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-12 bg-slate-50 antialiased font-sans">
            
            {/* Left Decorative/Branding Panel (Hidden on small mobile viewports) */}
            <div className="hidden md:flex md:col-span-5 lg:col-span-7 bg-linear-to-br from-indigo-900 via-indigo-800 to-slate-900 p-12 flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-150 h-150 rounded-full bg-indigo-400 blur-3xl"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-100 h-100 rounded-full bg-emerald-400 blur-3xl"></div>
                </div>
                
                <div className="relative z-10">
                    <span className="text-white font-extrabold text-2xl tracking-wider uppercase bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                        🚀 PlacementHub
                    </span>
                </div>

                <div className="relative z-10 max-w-xl space-y-4">
                    <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight">
                        Your portal to career milestones starts right here.
                    </h1>
                    <p className="text-indigo-200 text-lg font-medium leading-relaxed">
                        Connect with top-tier corporate recruitment windows, monitor real-time application process, and lock down your next professional milestone.
                    </p>
                </div>

                <div className="relative z-10 text-xs font-medium text-indigo-300/60 tracking-wide">
                    &copy; 2026 PlacementHub Eco-system. All Rights Reserved.
                </div>
            </div>

            {/* Right Authentication Form Panel */}
            <div className="col-span-1 md:col-span-7 lg:col-span-5 flex items-center justify-center p-6 sm:p-12 md:p-16 lg:p-24 bg-white">
                <div className="w-full max-w-md space-y-8">
                    
                    {/* Header Block */}
                    <div className="space-y-2">
                        <div className="md:hidden block">
                            <span className="text-indigo-600 font-extrabold text-xl tracking-wider uppercase mb-4 block">
                                PlacementHub
                            </span>
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                            Welcome Back
                        </h2>
                        <p className="text-slate-500 font-medium text-sm">
                            Sign in to access your account
                        </p>
                    </div>

                    {/* Dynamic Error Messaging Alert */}
                    {error && (
                        <div className="bg-rose-50 border-l-4 border-rose-500 text-rose-800 p-4 rounded-xl flex items-start gap-3 transition-all duration-300 shadow-sm animate-fade-in">
                            <span className="text-lg mt-0.5">⚠️</span>
                            <div className="text-xs font-semibold leading-relaxed">{error}</div>
                        </div>
                    )}

                    {/* Authentication Form Box */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                                Email Address
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">✉️</span>
                                <input 
                                    type="email" 
                                    name="email" 
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 shadow-inner transition-all duration-200"
                                    placeholder="you@college.edu" 
                                    value={formData.email} 
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                                    Password
                                </label>
                            </div>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔒</span>
                                <input 
                                    type="password" 
                                    name="password" 
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 shadow-inner transition-all duration-200"
                                    placeholder="••••••••" 
                                    value={formData.password} 
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all duration-200 transform active:scale-[0.99] tracking-wide text-sm"
                        >
                            Sign In to Dashboard
                        </button>
                    </form>
                    
                    {/* Alternate Access Routing */}
                    <div className="pt-4 border-t border-slate-100 text-center">
                        <p className="text-sm text-slate-500 font-medium">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-bold transition-colors underline underline-offset-4 decoration-2 decoration-indigo-600/20 hover:decoration-indigo-600">
                                Register here
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;