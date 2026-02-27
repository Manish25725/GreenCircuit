import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState } from 'react';
import axios from 'axios';
const ChangePasswordForm = ({ accentColor = '#10b981', hoverColor = '#059669', }) => {
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordMessage({ type: '', text: '' });
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'Please fill in all password fields' });
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }
        if (passwordData.newPassword.length < 6) {
            setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }
        try {
            setPasswordLoading(true);
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:3001/api/auth/security/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            }, { headers: { Authorization: `Bearer ${token}` } });
            setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        }
        catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Failed to change password. Please try again.';
            setPasswordMessage({ type: 'error', text: errorMsg });
        }
        finally {
            setPasswordLoading(false);
        }
    };
    return (_jsxs(_Fragment, { children: [passwordMessage.text && (_jsx("div", { className: `p-4 rounded-lg border ${passwordMessage.type === 'success'
                    ? 'bg-green-500/10 border-green-500/30 text-green-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'}`, style: passwordMessage.type === 'success'
                    ? { backgroundColor: `${accentColor}1a`, borderColor: `${accentColor}4d`, color: accentColor }
                    : undefined, children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("span", { className: "material-symbols-outlined text-[20px] mt-0.5", children: passwordMessage.type === 'success' ? 'check_circle' : 'error' }), _jsx("p", { className: "text-sm font-medium", children: passwordMessage.text })] }) })), _jsxs("form", { className: "flex flex-col gap-4", onSubmit: handlePasswordChange, children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: _jsxs("label", { className: "flex flex-col w-full", children: [_jsx("span", { className: "text-white text-sm font-medium leading-normal pb-2", children: "Current Password" }), _jsx("input", { className: "w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 transition-all", style: { ['--tw-ring-color']: accentColor }, placeholder: "Enter current password", type: "password", value: passwordData.currentPassword, onChange: (e) => setPasswordData({ ...passwordData, currentPassword: e.target.value }) })] }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("label", { className: "flex flex-col w-full", children: [_jsx("span", { className: "text-white text-sm font-medium leading-normal pb-2", children: "New Password" }), _jsx("input", { className: "w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 transition-all", style: { ['--tw-ring-color']: accentColor }, placeholder: "Enter new password", type: "password", value: passwordData.newPassword, onChange: (e) => setPasswordData({ ...passwordData, newPassword: e.target.value }) })] }), _jsxs("label", { className: "flex flex-col w-full", children: [_jsx("span", { className: "text-white text-sm font-medium leading-normal pb-2", children: "Confirm New Password" }), _jsx("input", { className: "w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 transition-all", style: { ['--tw-ring-color']: accentColor }, placeholder: "Confirm new password", type: "password", value: passwordData.confirmPassword, onChange: (e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value }) })] })] }), _jsx("div", { className: "flex justify-end pt-2", children: _jsx("button", { className: "flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 text-white text-sm font-bold leading-normal tracking-[0.015em] transition-all disabled:opacity-50", style: { backgroundColor: accentColor }, onMouseEnter: (e) => (e.currentTarget.style.backgroundColor = hoverColor), onMouseLeave: (e) => (e.currentTarget.style.backgroundColor = accentColor), type: "submit", disabled: passwordLoading, children: passwordLoading ? 'Updating...' : 'Update Password' }) })] })] }));
};
export default ChangePasswordForm;
