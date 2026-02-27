import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import ProfileSettingsContent from '../components/ProfileSettingsContent.jsx';
const ResidentProfileSettings = () => (_jsx(ProfileSettingsContent, { role: "resident", settingsCards: [
        { id: 1, title: 'Edit Profile', description: 'Update your personal information and profile picture', icon: 'person', color: '#10b981', link: '/resident/profile' },
        { id: 2, title: 'Change Password', description: 'Update your password and secure your account', icon: 'lock', color: '#f59e0b', link: '/security' },
        { id: 3, title: 'Notifications', description: 'Manage notification preferences and alerts', icon: 'notifications', color: '#10b981', link: '/notifications' },
        { id: 4, title: 'Security & Privacy', description: 'Active sessions and security settings', icon: 'security', color: '#8b5cf6', link: '/security' },
        { id: 5, title: 'App Settings', description: 'Language, theme, and app preferences', icon: 'settings', color: '#10b981', link: '/settings' },
    ], stats: [
        { icon: 'stars', label: 'Eco Points', field: 'ecoPoints' },
        { icon: 'recycling', label: 'Waste Recycled', field: 'totalWasteRecycled', suffix: ' kg' },
        { icon: 'local_shipping', label: 'Total Pickups', field: 'totalPickups' },
    ] }));
export default ResidentProfileSettings;
