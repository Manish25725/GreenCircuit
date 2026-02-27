import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import ProfileHeader from '../components/ProfileHeader.jsx';
import ProfileSidebar from '../components/ProfileSidebar.jsx';
import NotificationPanel from '../components/NotificationPanel.jsx';
import { getCurrentUser } from '../services/api.js';
const Notifications = () => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const currentUser = getCurrentUser();
        setUser(currentUser);
    }, []);
    // Default User/Resident Layout
    // Note: This is a fallback. Role-specific pages (ResidentNotifications, BusinessNotifications) 
    // should be used via routing in App.tsx
    return (_jsx(Layout, { title: "", role: "User", fullWidth: true, hideSidebar: true, children: _jsxs("div", { className: "bg-[#0B1116] font-sans text-gray-200 antialiased selection:bg-[#10b981] selection:text-white min-h-screen flex flex-col relative overflow-hidden", children: [_jsx("div", { className: "fixed top-0 left-0 w-full h-[500px] bg-[#10b981]/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" }), _jsx("div", { className: "fixed bottom-0 right-0 w-full h-[500px] bg-[#3b82f6]/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none" }), _jsx(ProfileHeader, {}), _jsx("main", { className: "flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-10 mt-20 relative z-10", children: _jsxs("div", { className: "flex flex-col md:flex-row gap-8", children: [_jsx(ProfileSidebar, { activePage: "notifications" }), _jsx("div", { className: "flex-1", children: _jsx(NotificationPanel, {}) })] }) })] }) }));
};
export default Notifications;
