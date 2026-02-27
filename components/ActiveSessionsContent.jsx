import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import RolePageShell, { getRoleTheme } from './RolePageShell.jsx';
import BackButton from './BackButton.jsx';
import AlertBanner from './AlertBanner.jsx';
import { useNavigate } from 'react-router-dom';
const getDeviceInfo = () => {
    const ua = navigator.userAgent;
    let browser = 'Unknown Browser';
    let os = 'Unknown OS';
    if (ua.includes('Windows'))
        os = 'Windows PC';
    else if (ua.includes('Mac'))
        os = 'MacBook';
    else if (ua.includes('Linux'))
        os = 'Linux';
    else if (ua.includes('iPhone'))
        os = 'iPhone';
    else if (ua.includes('iPad'))
        os = 'iPad';
    else if (ua.includes('Android'))
        os = 'Android';
    if (ua.includes('Chrome') && !ua.includes('Edg'))
        browser = 'Chrome';
    else if (ua.includes('Safari') && !ua.includes('Chrome'))
        browser = 'Safari';
    else if (ua.includes('Firefox'))
        browser = 'Firefox';
    else if (ua.includes('Edg'))
        browser = 'Edge';
    return `${os} - ${browser}`;
};
const ActiveSessionsContent = ({ role, initialSessions }) => {
    const navigate = useNavigate();
    const theme = getRoleTheme(role);
    const [sessions, setSessions] = useState(initialSessions || [{ id: '1', device: getDeviceInfo(), location: 'Current Location', ip: 'Your IP Address', lastActive: 'Active now', current: true }]);
    const handleLogoutSession = (sessionId) => {
        if (confirm('Are you sure you want to log out this session?')) {
        }
    };
    const handleLogoutAll = () => {
        if (confirm('Are you sure you want to log out all other sessions? You will remain logged in on this device.')) {
        }
    };
    return (_jsxs(RolePageShell, { role: role, onLogout: () => { localStorage.clear(); navigate('/login'); }, children: [_jsx(BackButton, { label: "Back to Settings", color: theme.accent, hoverColor: theme.hover }), _jsx("div", { className: "mb-8", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 rounded-lg", style: { backgroundColor: `${theme.accent}15` }, children: _jsx("span", { className: "material-symbols-outlined text-[28px]", style: { color: theme.accent }, children: "devices" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl sm:text-3xl font-bold text-white", children: "Active Sessions" }), _jsx("p", { className: "text-slate-400 text-sm", children: "View and manage your active login sessions" })] })] }), _jsxs("button", { onClick: handleLogoutAll, className: "hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 transition-colors font-medium", children: [_jsx("span", { className: "material-symbols-outlined text-[18px]", children: "logout" }), _jsx("span", { className: "text-sm", children: "Logout All Others" })] })] }) }), _jsx(AlertBanner, { type: "info", icon: "info", title: "Session Security", message: "These are the devices currently logged into your account. If you see any suspicious activity, log out the session and change your password immediately.", color: theme.accent, className: "mb-6" }), _jsx("div", { className: "flex flex-col gap-4", children: sessions.map((session) => (_jsx("div", { className: "bg-[#151F26] border border-white/5 rounded-xl p-6 transition-all", style: { ['--hover-border']: `${theme.accent}4D` }, onMouseEnter: (e) => (e.currentTarget.style.borderColor = `${theme.accent}4D`), onMouseLeave: (e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'), children: _jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [_jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "p-3 rounded-lg", style: { backgroundColor: `${theme.accent}15` }, children: _jsx("span", { className: "material-symbols-outlined text-[24px]", style: { color: theme.accent }, children: session.device.includes('iPhone') || session.device.includes('Android') ? 'smartphone' : 'computer' }) }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("h3", { className: "text-white font-bold", children: session.device }), session.current && (_jsx("span", { className: "px-2 py-0.5 bg-[#10b981]/10 border border-[#10b981]/30 rounded text-[#10b981] text-xs font-medium", children: "Current" }))] }), _jsxs("div", { className: "flex flex-col gap-1 text-sm text-slate-400", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-[16px]", children: "location_on" }), _jsx("span", { children: session.location })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-[16px]", children: "router" }), _jsx("span", { children: session.ip })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-[16px]", children: "schedule" }), _jsx("span", { children: session.lastActive })] })] })] })] }), !session.current && (_jsxs("button", { onClick: () => handleLogoutSession(session.id), className: "flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 transition-colors font-medium whitespace-nowrap", children: [_jsx("span", { className: "material-symbols-outlined text-[18px]", children: "logout" }), _jsx("span", { className: "text-sm", children: "Log Out" })] }))] }) }, session.id))) }), _jsxs("button", { onClick: handleLogoutAll, className: "flex sm:hidden items-center justify-center gap-2 px-6 py-3 rounded-lg bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 transition-colors font-medium mt-6 w-full", children: [_jsx("span", { className: "material-symbols-outlined text-[20px]", children: "logout" }), _jsx("span", { children: "Logout All Other Sessions" })] })] }));
};
export default ActiveSessionsContent;
