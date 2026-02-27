import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import RolePageShell from '../components/RolePageShell.jsx';
import BackButton from '../components/BackButton.jsx';
import PageHeader from '../components/PageHeader.jsx';
import SettingsSection from '../components/SettingsSection.jsx';
import ToggleRow from '../components/ToggleRow.jsx';
import ChangePasswordForm from '../components/ChangePasswordForm.jsx';
import ActionCard from '../components/ActionCard.jsx';
import { useNavigate } from 'react-router-dom';
const ACCENT = '#10b981';
const HOVER = '#059669';
const ResidentSecurity = () => {
    const navigate = useNavigate();
    return (_jsxs(RolePageShell, { role: "resident", children: [_jsx(BackButton, { label: "Back to Settings", color: ACCENT, hoverColor: HOVER }), _jsx(PageHeader, { icon: "lock", iconColor: "#8b5cf6", title: "Security & Privacy", subtitle: "Manage your password, login security, and privacy settings" }), _jsx(SettingsSection, { title: "Change Password", description: "Ensure your account is using a long, random password to stay secure.", children: _jsx(ChangePasswordForm, { accentColor: ACCENT, hoverColor: HOVER }) }), _jsx(ActionCard, { icon: "security", iconColor: ACCENT, title: "Two-Factor Authentication", description: "Add an extra layer of security to your account by requiring more than just a password to log in.", actionLabel: "Enable 2FA", accentColor: ACCENT, variant: "outline" }), _jsx(SettingsSection, { icon: "shield", iconColor: "#8b5cf6", title: "Privacy Settings", description: "Control how your data is used and shared.", className: "", children: _jsxs("div", { className: "flex flex-col gap-4", children: [_jsx(ToggleRow, { label: "Profile Visibility", description: "Control who can see your Resident profile", defaultChecked: true, color: ACCENT }), _jsx(ToggleRow, { label: "Activity Tracking", description: "Allow analytics to improve your experience", defaultChecked: true, color: ACCENT }), _jsx(ToggleRow, { label: "Data Sharing", description: "Share anonymized data with partners", color: ACCENT, showBorder: false })] }) }), _jsx(ActionCard, { icon: "devices", iconColor: ACCENT, title: "Active Sessions", description: "View and manage all devices currently logged into your account. Log out sessions you don't recognize.", actionLabel: "View Sessions", actionIcon: "devices", accentColor: ACCENT, hoverColor: HOVER, variant: "filled", onAction: () => (navigate('/resident/sessions')), className: "mt-6" })] }));
};
export default ResidentSecurity;
