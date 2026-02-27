import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import NotificationBell from '../components/NotificationBell.jsx';
import { useNavigate } from 'react-router-dom';
const PartnerProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    useEffect(() => {
        loadUserData();
        // Listen for user updates
        const handleUserUpdate = () => {
            loadUserData();
        };
        window.addEventListener('userUpdated', handleUserUpdate);
        return () => {
            window.removeEventListener('userUpdated', handleUserUpdate);
        };
    }, []);
    const loadUserData = async () => {
        try {
            const { api } = await import('../services/api.js');
            // Force fresh data from API
            const userData = await api.getMe();
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        }
        catch (error) {
            const { getCurrentUser } = await import('../services/api.js');
            const currentUser = getCurrentUser();
            setUser(currentUser);
        }
    };
    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };
    const settingsCards = [
        {
            id: 1,
            title: 'Edit Profile',
            description: 'Update your company information and logo',
            icon: 'business',
            color: '#8b5cf6',
            link: '/partner/edit-profile'
        },
        {
            id: 2,
            title: 'Change Password',
            description: 'Update your password and secure your account',
            icon: 'lock',
            color: '#f59e0b',
            link: '/partner/security'
        },
        {
            id: 3,
            title: 'Notifications',
            description: 'Manage notification preferences and alerts',
            icon: 'notifications',
            color: '#8b5cf6',
            link: '/partner/notifications'
        },
        {
            id: 4,
            title: 'Security & Privacy',
            description: 'Active sessions and security settings',
            icon: 'security',
            color: '#8b5cf6',
            link: '/partner/security'
        },
        {
            id: 5,
            title: 'App Settings',
            description: 'Language, theme, and app preferences',
            icon: 'settings',
            color: '#8b5cf6',
            link: '/partner/settings'
        }
    ];
    return (_jsx(Layout, { title: "", role: "Agency", fullWidth: true, hideSidebar: true, children: _jsx("div", { className: "bg-[#0B1116] font-sans text-gray-200 antialiased selection:bg-[#8b5cf6] selection:text-white min-h-screen", children: _jsxs("div", { className: "relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden", children: [_jsx("div", { className: "fixed top-0 left-0 w-full h-[500px] bg-[#8b5cf6]/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" }), _jsx("div", { className: "fixed bottom-0 right-0 w-full h-[500px] bg-[#3b82f6]/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none" }), _jsxs("div", { className: "layout-container flex h-full grow flex-col relative z-10", children: [_jsxs("header", { className: "flex items-center justify-between whitespace-nowrap border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-md", children: [_jsxs("div", { className: "flex items-center gap-3 text-white cursor-pointer", onClick: () => navigate('/agency/dashboard'), children: [_jsx("div", { className: "p-2 bg-[#8b5cf6]/10 rounded-lg", children: _jsx("svg", { className: "h-6 w-6 text-[#8b5cf6]", fill: "currentColor", viewBox: "0 0 48 48", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" }) }) }), _jsxs("h2", { className: "text-xl font-bold tracking-tight text-white", children: ["EcoCycle ", _jsx("span", { className: "text-[#8b5cf6] font-semibold", children: "Partner" })] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "relative group", children: [_jsxs("button", { onClick: () => navigate('/profile'), className: "hidden sm:flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-[#151F26] border border-white/5 hover:bg-white/5 transition-colors cursor-pointer", children: [_jsx("div", { className: "size-8 rounded-full bg-cover bg-center ring-2 ring-white/10 group-hover:ring-[#8b5cf6]/50 transition-all", style: { backgroundImage: `url("${(user?.avatar || user?.logo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || user?.companyName || 'Partner') + '&background=8b5cf6&color=fff')}${(user?.avatar || user?.logo) ? '?t=' + new Date().getTime() : ''}")` } }), _jsx("span", { className: "text-sm font-medium text-gray-200", children: user?.companyName || user?.name || 'Partner' })] }), _jsx("div", { className: "absolute top-14 right-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100]", children: _jsx("div", { className: "bg-[#151F26] border border-white/5 rounded-2xl p-4 shadow-2xl", children: _jsx("div", { className: "size-32 rounded-xl bg-cover bg-center ring-4 ring-[#8b5cf6]/30", style: { backgroundImage: `url("${(user?.avatar || user?.logo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || user?.companyName || 'Partner') + '&background=8b5cf6&color=fff')}${(user?.avatar || user?.logo) ? '?t=' + new Date().getTime() : ''}")` } }) }) })] }), _jsx(NotificationBell, {})] })] }), _jsx("main", { className: "flex flex-1 justify-center py-5 px-4 sm:px-6 lg:px-10", children: _jsxs("div", { className: "layout-content-container flex flex-col w-full max-w-5xl", children: [_jsxs("button", { onClick: () => navigate('/agency/dashboard'), className: "flex items-center gap-2 text-[#8b5cf6] hover:text-[#7c3aed] transition-colors mb-6 group", children: [_jsx("span", { className: "material-symbols-outlined text-[20px]", children: "arrow_back" }), _jsx("span", { className: "text-sm font-medium", children: "Back to Dashboard" })] }), _jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex items-center gap-4 mb-2", children: [_jsx("div", { className: "size-16 rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] flex items-center justify-center text-white font-bold text-2xl overflow-hidden shadow-lg", children: user?.logo || user?.avatar ? (_jsx("img", { src: `${user.logo || user.avatar}?t=${new Date().getTime()}`, alt: user.companyName || user.name, className: "w-full h-full object-cover" })) : ((user?.companyName || user?.name)?.charAt(0)?.toUpperCase() || 'P') }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl sm:text-3xl font-bold text-white", children: user?.companyName || user?.name || 'Partner' }), _jsx("p", { className: "text-slate-400 text-sm mt-1", children: user?.email || '' })] })] }), _jsx("p", { className: "text-slate-400 text-sm", children: "Manage your profile, security, and preferences" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6", children: settingsCards.map((card) => (_jsx("div", { onClick: () => navigate(card.link), className: "bg-[#151F26] hover:bg-[#1a2730] p-6 rounded-xl border border-white/5 hover:border-white/5 transition-all cursor-pointer group", children: _jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "p-3 rounded-xl transition-all group-hover:scale-110", style: { backgroundColor: `${card.color}15` }, children: _jsx("span", { className: "material-symbols-outlined text-[28px]", style: { color: card.color }, children: card.icon }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-white font-semibold text-lg mb-1 group-hover:text-[#8b5cf6] transition-colors", children: card.title }), _jsx("p", { className: "text-slate-400 text-sm", children: card.description })] }), _jsx("span", { className: "material-symbols-outlined text-gray-500 group-hover:text-[#8b5cf6] transition-colors", children: "arrow_forward" })] }) }, card.id))) }), _jsxs("div", { className: "bg-[#151F26] p-6 rounded-xl border border-white/5 mb-6", children: [_jsx("h3", { className: "text-white font-semibold text-lg mb-4", children: "Your Impact" }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [_jsx("div", { className: "bg-[#0B1116] p-4 rounded-xl border border-[#8b5cf6]/20", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-[#8b5cf6]/10 rounded-lg", children: _jsx("span", { className: "material-symbols-outlined text-[#8b5cf6]", children: "event_available" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-slate-400 text-xs", children: "Total Pickups" }), _jsx("p", { className: "text-white text-2xl font-bold", children: user?.totalPickups || 0 })] })] }) }), _jsx("div", { className: "bg-[#0B1116] p-4 rounded-xl border border-[#8b5cf6]/20", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-[#8b5cf6]/10 rounded-lg", children: _jsx("span", { className: "material-symbols-outlined text-[#8b5cf6]", children: "recycling" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-slate-400 text-xs", children: "Waste Collected" }), _jsxs("p", { className: "text-white text-2xl font-bold", children: [user?.totalWasteCollected || 0, " kg"] })] })] }) }), _jsx("div", { className: "bg-[#0B1116] p-4 rounded-xl border border-[#8b5cf6]/20", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-[#8b5cf6]/10 rounded-lg", children: _jsx("span", { className: "material-symbols-outlined text-[#8b5cf6]", children: "schedule" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-slate-400 text-xs", children: "Active Slots" }), _jsx("p", { className: "text-white text-2xl font-bold", children: user?.activeSlots || 0 })] })] }) })] })] }), _jsxs("button", { onClick: () => navigate('/agency/dashboard'), className: "w-full h-12 px-6 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-semibold transition-all shadow-lg shadow-[#8b5cf6]/20 flex items-center justify-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined", children: "dashboard" }), _jsx("span", { children: "Go to Dashboard" })] })] }) })] })] }) }) }));
};
export default PartnerProfile;
