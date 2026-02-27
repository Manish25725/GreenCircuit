import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import Layout from './Layout.jsx';
import { useNavigate } from 'react-router-dom';
/**
 * Role theme configuration.
 * Maps each user role to its accent color, hover color, Layout role string, and dashboard hash.
 */
const ROLE_THEMES = {
    resident: {
        accent: '#10b981',
        hover: '#059669',
        layoutRole: 'User',
        dashboardHash: '/dashboard',
        label: 'Resident',
    },
    partner: {
        accent: '#8b5cf6',
        hover: '#7c3aed',
        layoutRole: 'Agency',
        dashboardHash: '/agency/dashboard',
        label: 'Partner',
    },
    business: {
        accent: '#06b6d4',
        hover: '#0891b2',
        layoutRole: 'Business',
        dashboardHash: '/business',
        label: 'Business',
    },
    admin: {
        accent: '#ec4899',
        hover: '#db2777',
        layoutRole: 'Admin',
        dashboardHash: '/admin',
        label: 'Admin',
    },
};
export const getRoleTheme = (role) => ROLE_THEMES[role];
const RolePageShell = ({ role, children, maxWidth = 'max-w-6xl', headerRight, onLogout, }) => {
    const navigate = useNavigate();
    const theme = ROLE_THEMES[role];
    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        }
        else {
            localStorage.clear();
            navigate('/login');
        }
    };
    return (_jsx(Layout, { title: "", role: theme.layoutRole, fullWidth: true, hideSidebar: true, children: _jsx("div", { className: "bg-[#0B1116] font-sans text-gray-200 antialiased min-h-screen", style: { ['--accent']: theme.accent }, children: _jsxs("div", { className: "relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden", children: [_jsx("div", { className: "fixed top-0 left-0 w-full h-[500px] rounded-full blur-[120px] -translate-y-1/2 pointer-events-none", style: { backgroundColor: `${theme.accent}0d` } }), _jsx("div", { className: "fixed bottom-0 right-0 w-full h-[500px] bg-[#8b5cf6]/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none" }), _jsxs("div", { className: "layout-container flex h-full grow flex-col relative z-10", children: [_jsxs("header", { className: "flex items-center justify-between whitespace-nowrap border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-md", children: [_jsxs("div", { className: "flex items-center gap-3 text-white cursor-pointer", onClick: () => navigate(theme.dashboardHash), children: [_jsx("div", { className: "p-2 rounded-lg", style: { backgroundColor: `${theme.accent}1a` }, children: _jsx("svg", { className: "h-6 w-6", style: { color: theme.accent }, fill: "currentColor", viewBox: "0 0 48 48", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" }) }) }), _jsxs("h2", { className: "text-xl font-bold tracking-tight text-white", children: ["EcoCycle", ' ', _jsx("span", { className: "font-semibold", style: { color: theme.accent }, children: theme.label })] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [headerRight, _jsx("button", { onClick: handleLogout, className: "flex items-center justify-center size-10 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-colors", children: _jsx("span", { className: "material-symbols-outlined text-red-400", children: "logout" }) })] })] }), _jsx("main", { className: "flex flex-1 justify-center py-5 px-4 sm:px-6 lg:px-10", children: _jsx("div", { className: `layout-content-container flex flex-col w-full ${maxWidth}`, children: children }) })] })] }) }) }));
};
export default RolePageShell;
