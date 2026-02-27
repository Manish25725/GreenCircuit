import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import RolePageShell from '../components/RolePageShell.jsx';
import BackButton from '../components/BackButton.jsx';
import PageHeader from '../components/PageHeader.jsx';
import NotificationPanel from '../components/NotificationPanel.jsx';
const BusinessNotifications = () => {
    return (_jsxs(RolePageShell, { role: "business", children: [_jsx(BackButton, { label: "Back to Settings", color: "#06b6d4", hoverColor: "#0891b2" }), _jsx(PageHeader, { icon: "notifications", iconColor: "#06b6d4", title: "Notifications", subtitle: "Manage your notification preferences and alerts" }), _jsx(NotificationPanel, {})] }));
};
export default BusinessNotifications;
