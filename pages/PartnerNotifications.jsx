import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import RolePageShell from '../components/RolePageShell.jsx';
import BackButton from '../components/BackButton.jsx';
import PageHeader from '../components/PageHeader.jsx';
import NotificationPanel from '../components/NotificationPanel.jsx';
const PartnerNotifications = () => {
    return (_jsxs(RolePageShell, { role: "partner", children: [_jsx(BackButton, { label: "Back to Settings", color: "#8b5cf6", hoverColor: "#7c3aed" }), _jsx(PageHeader, { icon: "notifications", iconColor: "#8b5cf6", title: "Notifications", subtitle: "Manage your notification preferences and alerts" }), _jsx(NotificationPanel, {})] }));
};
export default PartnerNotifications;
