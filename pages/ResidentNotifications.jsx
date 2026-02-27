import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import RolePageShell from '../components/RolePageShell.jsx';
import BackButton from '../components/BackButton.jsx';
import PageHeader from '../components/PageHeader.jsx';
import NotificationPanel from '../components/NotificationPanel.jsx';
const ResidentNotifications = () => {
    return (_jsxs(RolePageShell, { role: "resident", children: [_jsx(BackButton, { label: "Back to Settings", color: "#10b981", hoverColor: "#059669" }), _jsx(PageHeader, { icon: "notifications", iconColor: "#10b981", title: "Notifications", subtitle: "Manage your notification preferences and alerts" }), _jsx(NotificationPanel, {})] }));
};
export default ResidentNotifications;
