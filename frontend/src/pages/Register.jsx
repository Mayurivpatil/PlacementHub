import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Student' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            await API.post('/auth/register', formData);
            setMessage('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2500);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Try again.');
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-12 bg-slate-50 antialiased font-sans">
            
            {/* Left Decorative/Branding Panel - Identical to Login to preserve flow theme */}
            <div className="hidden md:flex md:col-span-5 lg:col-span-7 bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 p-12 flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-400 blur-3xl"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-emerald-400 blur-3xl"></div>
                </div>
                
                <div className="relative z-10">
                    <span className="text-white font-extrabold text-2xl tracking-wider uppercase bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                        🚀 PlacementHub
                    </span>
                </div>

                <div className="relative z-10 max-w-xl space-y-4">
                    <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight">
                        Forge your pathway to industry leaders.
                    </h1>
                    <p className="text-indigo-200 text-lg font-medium leading-relaxed">
                        Create your system profile to instantly map out your skills against active institutional job listings, manage ongoing recruitment stages, and deploy directly to leading ecosystems.
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
                            Create Account
                        </h2>
                        <p className="text-slate-500 font-medium text-sm">
                            Join the secure placement ecosystem portal today.
                        </p>
                    </div>

                    {/* Dynamic Status Alerts */}
                    {message && (
                        <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 p-4 rounded-xl flex items-start gap-3 transition-all duration-300 shadow-sm animate-fade-in">
                            <span className="text-lg mt-0.5">✅</span>
                            <div className="text-xs font-semibold leading-relaxed">{message}</div>
                        </div>
                    )}
                    
                    {error && (
                        <div className="bg-rose-50 border-l-4 border-rose-500 text-rose-800 p-4 rounded-xl flex items-start gap-3 transition-all duration-300 shadow-sm animate-fade-in">
                            <span className="text-lg mt-0.5">⚠️</span>
                            <div className="text-xs font-semibold leading-relaxed">{error}</div>
                        </div>
                    )}

                    {/* Registration Form Box */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        {/* Name Input */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                                Full Name / Company Name
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">👤</span>
                                <input 
                                    type="text" 
                                    name="name" 
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 shadow-inner transition-all duration-200"
                                    placeholder="Mayuri Patil or Google LLC" 
                                    value={formData.name} 
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Email Input */}
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
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 shadow-inner transition-all duration-200"
                                    placeholder="abc@gmail.com" 
                                    value={formData.email} 
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                                Password
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔒</span>
                                <input 
                                    type="password" 
                                    name="password" 
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 shadow-inner transition-all duration-200"
                                    placeholder="Minimum 6 characters" 
                                    value={formData.password} 
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Dropdown Selection Input */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                                Register As
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">💼</span>
                                <select 
                                    name="role" 
                                    value={formData.role} 
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 shadow-inner appearance-none transition-all duration-200"
                                >
                                    <option value="Student">Student</option>
                                    <option value="Company">Company Recruiter</option>
                                </select>
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">▼</span>
                            </div>
                        </div>

                        {/* Action Call Button */}
                        <button 
                            type="submit" 
                            className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all duration-200 transform active:scale-[0.99] tracking-wide text-sm"
                        >
                            Sign Up
                        </button>
                    </form>
                    
                    {/* Alternate Access Routing */}
                    <div className="pt-4 border-t border-slate-100 text-center">
                        <p className="text-sm text-slate-500 font-medium">
                            Already registered?{" "}
                            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-bold transition-colors underline underline-offset-4 decoration-2 decoration-indigo-600/20 hover:decoration-indigo-600">
                                Login here
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Register;