import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import RolePageShell, { getRoleTheme } from '../components/RolePageShell.jsx';
import SettingsNavCard from '../components/SettingsNavCard.jsx';
import Loader from '../components/Loader.jsx';
import { getCurrentUser } from '../services/api.js';
import { useNavigate } from 'react-router-dom';
const THEME = getRoleTheme('business');
const settingsCards = [
    { id: 1, title: 'Edit Profile', description: 'Update company information and logo', icon: 'business', color: '#06b6d4', link: '/business/profile' },
    { id: 3, title: 'Security & Privacy', description: 'Password, 2FA, and privacy settings', icon: 'lock', color: '#8b5cf6', link: '/security' },
    { id: 4, title: 'App Settings', description: 'Language, theme, and app preferences', icon: 'settings', color: '#10b981', link: '/settings' },
];
const BusinessProfileSettings = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const user = getCurrentUser();
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 400);
        return () => clearTimeout(timer);
    }, []);
    if (loading) {
        return (_jsx(RolePageShell, { role: "business", children: _jsx("div", { className: "flex items-center justify-center py-32", children: _jsxs("div", { className: "text-center", children: [_jsx(Loader, { size: "md", color: "#3b82f6", className: "mb-4" }), _jsx("p", { className: "text-slate-400", children: "Loading profile..." })] }) }) }));
    }
    return (_jsxs(RolePageShell, { role: "business", children: [_jsx("div", { className: "mb-8", children: _jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("div", { className: "p-2 bg-[#06b6d4]/10 rounded-lg", children: _jsx("span", { className: "material-symbols-outlined text-[#06b6d4] text-[28px]", children: "settings" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl sm:text-3xl font-bold text-white", children: "Profile Settings" }), _jsx("p", { className: "text-slate-400 text-sm", children: "Manage your account preferences and settings" })] })] }) }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: settingsCards.map((card) => (_jsx(SettingsNavCard, { icon: card.icon, color: card.color, title: card.title, description: card.description, link: card.link, hoverAccent: THEME.accent }, card.id))) }), _jsx("div", { className: "mt-8 flex justify-center", children: _jsxs("button", { onClick: () => (navigate('/business')), className: "flex items-center gap-3 px-8 py-4 rounded-xl text-white font-semibold transition-all", style: { backgroundColor: THEME.accent, boxShadow: `0 10px 15px -3px ${THEME.accent}33` }, onMouseEnter: (e) => (e.currentTarget.style.backgroundColor = THEME.hover), onMouseLeave: (e) => (e.currentTarget.style.backgroundColor = THEME.accent), children: [_jsx("span", { className: "material-symbols-outlined text-[24px]", children: "dashboard" }), _jsx("span", { children: "Go to Dashboard" })] }) })] }));
};
export default BusinessProfileSettings;
