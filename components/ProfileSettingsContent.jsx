import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import RolePageShell, { getRoleTheme } from './RolePageShell.jsx';
import BackButton from './BackButton.jsx';
import SettingsNavCard from './SettingsNavCard.jsx';
import StatCard from './StatCard.jsx';
import { useNavigate } from 'react-router-dom';
const ProfileSettingsContent = ({ role, settingsCards, stats }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const theme = getRoleTheme(role);
    useEffect(() => {
        (async () => {
            try {
                const { api } = await import('../services/api.js');
                const userData = await api.getMe();
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
            }
            catch {
                const { getCurrentUser } = await import('../services/api.js');
                setUser(getCurrentUser());
            }
        })();
    }, []);
    const displayName = user?.companyName || user?.name || role.charAt(0).toUpperCase() + role.slice(1);
    const avatarSrc = user?.avatar || user?.logo;
    const avatarUrl = avatarSrc
        ? `${avatarSrc}?t=${Date.now()}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=${theme.accent.slice(1)}&color=fff`;
    const headerRight = (_jsxs("div", { className: "relative group", children: [_jsxs("button", { onClick: () => navigate('/profile'), className: "hidden sm:flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-[#151F26] border border-white/5 hover:bg-white/5 transition-colors cursor-pointer", children: [_jsx("div", { className: "size-8 rounded-full bg-cover bg-center ring-2 ring-white/10 transition-all", style: {
                            backgroundImage: `url("${avatarUrl}")`,
                            ['--tw-ring-color']: 'rgba(255,255,255,0.1)',
                        }, onMouseEnter: (e) => (e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.accent}80`), onMouseLeave: (e) => (e.currentTarget.style.boxShadow = '') }), _jsx("span", { className: "text-sm font-medium text-gray-200", children: displayName })] }), _jsx("div", { className: "absolute top-14 right-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100]", children: _jsx("div", { className: "bg-[#151F26] border border-white/5 rounded-2xl p-4 shadow-2xl", children: _jsx("div", { className: "size-32 rounded-xl bg-cover bg-center", style: {
                            backgroundImage: `url("${avatarUrl}")`,
                            boxShadow: `0 0 0 4px ${theme.accent}4D`,
                        } }) }) })] }));
    return (_jsxs(RolePageShell, { role: role, headerRight: headerRight, children: [_jsx(BackButton, { label: "Back to Dashboard", color: theme.accent, hoverColor: theme.hover }), _jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex items-center gap-4 mb-2", children: [_jsx("div", { className: "size-16 rounded-2xl bg-gradient-to-br from-[#3b82f6] flex items-center justify-center text-white font-bold text-2xl overflow-hidden shadow-lg", style: { backgroundImage: `linear-gradient(to bottom right, ${theme.accent}, #3b82f6)` }, children: avatarSrc ? (_jsx("img", { src: `${avatarSrc}?t=${Date.now()}`, alt: displayName, className: "w-full h-full object-cover" })) : (displayName.charAt(0).toUpperCase()) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl sm:text-3xl font-bold text-white", children: displayName }), _jsx("p", { className: "text-slate-400 text-sm mt-1", children: user?.email || '' })] })] }), _jsx("p", { className: "text-slate-400 text-sm", children: "Manage your profile, security, and preferences" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6", children: settingsCards.map((card) => (_jsx(SettingsNavCard, { icon: card.icon, color: card.color, title: card.title, description: card.description, link: card.link, hoverAccent: theme.accent }, card.id))) }), stats.length > 0 && (_jsxs("div", { className: "bg-[#151F26] p-6 rounded-xl border border-white/5 mb-6", children: [_jsx("h3", { className: "text-white font-semibold text-lg mb-4", children: "Your Impact" }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: stats.map((s, i) => (_jsx(StatCard, { icon: s.icon, iconColor: theme.accent, label: s.label, value: user?.[s.field] || 0, suffix: s.suffix, borderColor: theme.accent }, i))) })] })), _jsxs("button", { onClick: () => navigate(theme.dashboardHash), className: "w-full h-12 px-6 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2", style: { backgroundColor: theme.accent, boxShadow: `0 10px 15px -3px ${theme.accent}33` }, onMouseEnter: (e) => (e.currentTarget.style.backgroundColor = theme.hover), onMouseLeave: (e) => (e.currentTarget.style.backgroundColor = theme.accent), children: [_jsx("span", { className: "material-symbols-outlined", children: "dashboard" }), _jsx("span", { children: "Go to Dashboard" })] })] }));
};
export default ProfileSettingsContent;
