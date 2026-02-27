import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { api } from '../services/api.js';
import { useNavigate } from 'react-router-dom';
const Login = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState('Login');
    const [role, setRole] = useState('resident');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // Map frontend role to backend role
            const roleMap = {
                'resident': 'user',
                'business': 'business',
                'partner': 'agency',
                'admin': 'admin'
            };
            const backendRole = roleMap[role] || 'user';
            let user;
            if (mode === 'Login') {
                user = await api.login(email, password);
                // Navigate based on user role from response
                if (user.role === 'agency') {
                    // Check if agency is approved before redirecting to dashboard
                    try {
                        const agencyStatus = await api.get('/agencies/dashboard/me');
                        const responseData = agencyStatus.data?.data || agencyStatus.data;
                        const status = responseData?.status;
                        if (status === 'approved') {
                            navigate('/agency');
                        }
                        else {
                            // pending, rejected, or any other status - show tracker
                            navigate('/partner/pending');
                        }
                    }
                    catch (error) {
                        // No agency found or error, redirect to registration
                        navigate('/partner/register');
                    }
                }
                else if (user.role === 'business') {
                    navigate('/business');
                }
                else if (user.role === 'admin') {
                    navigate('/admin');
                }
                else {
                    navigate('/dashboard');
                }
            }
            else {
                // Sign up
                user = await api.register(name, email, password, backendRole);
                // For new partner signup, redirect to registration form
                if (user.role === 'agency') {
                    navigate('/partner/register');
                }
                else if (user.role === 'business') {
                    navigate('/business');
                }
                else if (user.role === 'admin') {
                    navigate('/admin');
                }
                else {
                    navigate('/dashboard');
                }
            }
        }
        catch (err) {
            setError(err.message || 'Authentication failed. Please try again.');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "relative flex min-h-screen w-full flex-col items-center justify-center bg-[#0B1116] font-sans text-gray-200 overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-hero-pattern opacity-20 pointer-events-none" }), _jsx("div", { className: "absolute top-[-10%] left-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#34D399]/10 rounded-full blur-[120px] pointer-events-none" }), _jsx("div", { className: "absolute bottom-[-10%] right-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#3B82F6]/5 rounded-full blur-[120px] pointer-events-none" }), _jsx("header", { className: "absolute top-0 left-0 w-full p-4 sm:p-6 z-20", children: _jsxs("div", { className: "max-w-7xl mx-auto flex justify-between items-center", children: [_jsxs("div", { className: "flex items-center gap-2 sm:gap-3 cursor-pointer", onClick: () => navigate('/'), children: [_jsx("div", { className: "size-8 sm:size-10 text-[#34D399] flex items-center justify-center", children: _jsx("svg", { className: "w-full h-full drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]", fill: "none", viewBox: "0 0 48 48", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "3" }) }) }), _jsx("span", { className: "text-white text-xl sm:text-2xl font-black tracking-tight", children: "EcoCycle" })] }), _jsxs("button", { onClick: () => navigate('/'), className: "text-xs sm:text-sm font-bold text-slate-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer", children: [_jsx("span", { className: "hidden sm:inline", children: "Back to Home" }), _jsx("span", { className: "sm:hidden", children: "Back" })] })] }) }), _jsx("main", { className: "relative z-10 w-full max-w-md mx-4 sm:mx-0 p-4 sm:p-6 animate-fade-in-up", children: _jsxs("div", { className: "bg-[#151F26] backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl", children: [_jsxs("div", { className: "text-center mb-6 sm:mb-8", children: [_jsxs("h1", { className: "text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight", children: [mode, " to EcoCycle"] }), _jsx("p", { className: "text-sm sm:text-base text-slate-400", children: "Welcome back! Please select your role to continue." })] }), _jsx("div", { className: "bg-[#151F26] p-1 rounded-xl flex mb-6", children: ['Login', 'Sign Up'].map((m) => (_jsx("button", { onClick: () => setMode(m), className: `flex-1 py-2.5 text-sm font-bold rounded-lg transition-all cursor-pointer border-none ${mode === m
                                    ? 'bg-[#34D399] text-white shadow-lg'
                                    : 'bg-transparent text-slate-400 hover:text-white'}`, children: m }, m))) }), _jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-5", children: [_jsx("div", { className: "grid grid-cols-3 gap-3", children: [
                                        { id: 'resident', label: 'Resident', icon: 'person' },
                                        { id: 'business', label: 'Business', icon: 'apartment' },
                                        { id: 'partner', label: 'Partner', icon: 'recycling' }
                                    ].map((item) => (_jsxs("div", { onClick: () => setRole(item.id), className: `cursor-pointer rounded-xl border p-3 flex flex-col items-center gap-2 transition-all ${role === item.id
                                            ? 'bg-[#34D399]/10 border-[#34D399] text-[#34D399]'
                                            : 'bg-[#151F26] border-white/5 text-slate-400 hover:border-white/5 hover:bg-white/5'}`, children: [_jsx("span", { className: "material-symbols-outlined text-2xl", children: item.icon }), _jsx("span", { className: "text-xs font-bold", children: item.label })] }, item.id))) }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { className: "text-xs font-bold text-slate-400 uppercase tracking-wider ml-1", children: "Email Address" }), _jsxs("div", { className: "relative group", children: [_jsx("span", { className: "material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#34D399] transition-colors text-[20px]", children: "mail" }), _jsx("input", { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "w-full bg-[#151F26] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-gray-200 focus:outline-none focus:border-[#34D399] focus:ring-1 focus:ring-[#34D399] transition-all", placeholder: "name@example.com" })] })] }), mode === 'Sign Up' && (_jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { className: "text-xs font-bold text-slate-400 uppercase tracking-wider ml-1", children: "Full Name" }), _jsxs("div", { className: "relative group", children: [_jsx("span", { className: "material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#34D399] transition-colors text-[20px]", children: "person" }), _jsx("input", { type: "text", required: true, value: name, onChange: (e) => setName(e.target.value), className: "w-full bg-[#151F26] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-gray-200 focus:outline-none focus:border-[#34D399] focus:ring-1 focus:ring-[#34D399] transition-all", placeholder: "John Doe" })] })] })), _jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { className: "text-xs font-bold text-slate-400 uppercase tracking-wider ml-1", children: "Password" }), _jsxs("div", { className: "relative group", children: [_jsx("span", { className: "material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#34D399] transition-colors text-[20px]", children: "lock" }), _jsx("input", { type: "password", required: true, value: password, onChange: (e) => setPassword(e.target.value), className: "w-full bg-[#151F26] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-gray-200 focus:outline-none focus:border-[#34D399] focus:ring-1 focus:ring-[#34D399] transition-all", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" })] })] })] }), error && (_jsx("div", { className: "bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg text-sm", children: error })), _jsxs("div", { className: "flex items-center justify-between text-xs", children: [_jsxs("label", { className: "flex items-center gap-2 cursor-pointer group", children: [_jsx("input", { type: "checkbox", className: "rounded border-white/5 bg-[#151F26] text-[#34D399] focus:ring-[#34D399] focus:ring-offset-0" }), _jsx("span", { className: "text-slate-400 group-hover:text-white transition-colors", children: "Remember me" })] }), _jsx("a", { href: "#", className: "text-[#34D399] hover:text-[#6EE7B7] font-medium transition-colors", children: "Forgot password?" })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full py-3.5 rounded-xl bg-[#34D399] text-white font-bold text-base shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_25px_rgba(52,211,153,0.5)] hover:bg-[#6EE7B7] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed", children: loading ? 'Please wait...' : (mode === 'Login' ? 'Sign In' : 'Create Account') }), _jsxs("div", { className: "mt-2 flex items-center justify-center gap-2 border-t border-white/5 pt-6", children: [_jsx("span", { className: "material-symbols-outlined text-slate-400 text-[18px]", children: "admin_panel_settings" }), _jsxs("p", { className: "text-xs text-slate-400", children: ["Are you an Administrator?", _jsx("a", { className: "font-medium text-[#34D399] hover:underline hover:text-[#34D399]/80 ml-1 cursor-pointer", onClick: () => navigate('/admin-login'), children: "Click here" })] })] })] })] }) })] }));
};
export default Login;
