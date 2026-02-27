import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../services/api.js';
import NotificationBell from './NotificationBell.jsx';
import { useNavigate } from 'react-router-dom';
const ProfileHeader = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(getCurrentUser());
    const [avatarKey, setAvatarKey] = useState(Date.now());
    // Add cache busting to avatar URL
    const avatarUrl = user?.avatar
        ? `${user.avatar}?t=${avatarKey}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=10b981&color=fff`;
    useEffect(() => {
        // Listen for user updates
        const handleUserUpdate = () => {
            setUser(getCurrentUser());
            setAvatarKey(Date.now()); // Force refresh avatar
        };
        window.addEventListener('userUpdated', handleUserUpdate);
        window.addEventListener('storage', handleUserUpdate);
        return () => {
            window.removeEventListener('userUpdated', handleUserUpdate);
            window.removeEventListener('storage', handleUserUpdate);
        };
    }, []);
    return (_jsxs("header", { className: "flex items-center justify-between whitespace-nowrap border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 transition-all duration-300", children: [_jsxs("div", { className: "flex items-center gap-3 text-white cursor-pointer", onClick: () => navigate('/'), children: [_jsx("div", { className: "p-2 bg-[#10b981]/10 rounded-lg", children: _jsx("svg", { className: "h-6 w-6 text-[#10b981]", fill: "none", viewBox: "0 0 48 48", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "3" }) }) }), _jsx("h2", { className: "text-xl font-bold tracking-tight text-white", children: "EcoCycle" })] }), _jsxs("nav", { className: "hidden md:flex flex-1 justify-center gap-1", children: [_jsx("a", { className: "text-sm font-medium px-5 py-2.5 rounded-full text-[#94a3b8] hover:text-white hover:bg-white/5 transition-all cursor-pointer", onClick: () => navigate('/dashboard'), children: "Dashboard" }), _jsx("a", { className: "text-sm font-medium px-5 py-2.5 rounded-full text-[#94a3b8] hover:text-white hover:bg-white/5 transition-all cursor-pointer", onClick: () => navigate('/search'), children: "New Request" }), _jsx("a", { className: "text-sm font-medium px-5 py-2.5 rounded-full text-[#94a3b8] hover:text-white hover:bg-white/5 transition-all cursor-pointer", onClick: () => navigate('/rewards'), children: "Rewards" }), _jsx("a", { className: "text-sm font-medium px-5 py-2.5 rounded-full text-[#94a3b8] hover:text-white hover:bg-white/5 transition-all cursor-pointer", onClick: () => navigate('/certificate'), children: "Certificate" })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("button", { onClick: () => navigate('/profile'), className: "hidden sm:flex h-10 px-5 items-center justify-center gap-2 rounded-full bg-white/5 text-white hover:bg-white/5 border border-white/5 text-sm font-bold transition-all duration-300 cursor-pointer", children: [_jsx("span", { className: "material-symbols-outlined text-[18px]", children: "person" }), "Profile"] }), _jsx(NotificationBell, {})] })] }));
};
export default ProfileHeader;
