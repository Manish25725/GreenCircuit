import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import Layout from '../components/Layout.jsx';
import Loader from '../components/Loader.jsx';
import { useNavigate } from 'react-router-dom';
const AdminUserDetail = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [showSuspendModal, setShowSuspendModal] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [suspendReason, setSuspendReason] = useState('');
    const [messageTitle, setMessageTitle] = useState('');
    const [messageContent, setMessageContent] = useState('');
    const [messagePriority, setMessagePriority] = useState('normal');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    useEffect(() => {
        const userId = window.location.pathname.split('/').pop();
        if (userId)
            fetchUserDetails(userId);
    }, []);
    const fetchUserDetails = async (userId) => {
        try {
            setLoading(true);
            const response = await api.get(`/admin/users/${userId}`);
            setUser(response.data?.data?.user || response.data?.user);
        }
        catch (error) {
            setErrorMessage('Failed to load user details');
        }
        finally {
            setLoading(false);
        }
    };
    const handleSuspend = async () => {
        if (!user || !suspendReason.trim()) {
            setErrorMessage('Please provide a reason for suspension');
            return;
        }
        try {
            setActionLoading(true);
            await api.post(`/admin/users/${user._id}/suspend`, { reason: suspendReason });
            setSuccessMessage('User suspended successfully');
            setShowSuspendModal(false);
            setSuspendReason('');
            // Refresh user data
            fetchUserDetails(user._id);
        }
        catch (error) {
            setErrorMessage(error.response?.data?.message || 'Failed to suspend user');
        }
        finally {
            setActionLoading(false);
        }
    };
    const handleUnsuspend = async () => {
        if (!user)
            return;
        try {
            setActionLoading(true);
            await api.post(`/admin/users/${user._id}/unsuspend`);
            setSuccessMessage('User account restored successfully');
            fetchUserDetails(user._id);
        }
        catch (error) {
            setErrorMessage(error.response?.data?.message || 'Failed to unsuspend user');
        }
        finally {
            setActionLoading(false);
        }
    };
    const handleSendMessage = async () => {
        if (!user || !messageTitle.trim() || !messageContent.trim()) {
            setErrorMessage('Please fill in all message fields');
            return;
        }
        try {
            setActionLoading(true);
            await api.post(`/admin/users/${user._id}/message`, {
                title: messageTitle,
                message: messageContent,
                priority: messagePriority
            });
            setSuccessMessage('Message sent successfully');
            setShowMessageModal(false);
            setMessageTitle('');
            setMessageContent('');
            setMessagePriority('normal');
        }
        catch (error) {
            setErrorMessage(error.response?.data?.message || 'Failed to send message');
        }
        finally {
            setActionLoading(false);
        }
    };
    const getRoleBadge = (role) => {
        const styles = {
            user: 'bg-green-500/20 text-green-400 border-green-500/30',
            business: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            agency: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
            admin: 'bg-pink-500/20 text-pink-400 border-pink-500/30'
        };
        return styles[role] || styles.user;
    };
    if (loading) {
        return (_jsx(Layout, { title: "", role: "Admin", fullWidth: true, hideSidebar: true, children: _jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsx(Loader, { size: "lg", color: "#ec4899" }) }) }));
    }
    if (!user) {
        return (_jsx(Layout, { title: "", role: "Admin", fullWidth: true, hideSidebar: true, children: _jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsxs("div", { className: "text-center", children: [_jsx("span", { className: "material-symbols-outlined text-6xl text-gray-600 mb-4 block", children: "person_off" }), _jsx("p", { className: "text-slate-400", children: "User not found" })] }) }) }));
    }
    return (_jsx(Layout, { title: "", role: "Admin", fullWidth: true, hideSidebar: true, children: _jsxs("div", { className: "bg-gradient-to-br from-[#1a0b1e] via-[#0B1116] to-[#1a0b1e] min-h-screen", children: [_jsx("div", { className: "fixed top-0 left-0 w-full h-[500px] bg-pink-500/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" }), successMessage && (_jsxs("div", { className: "fixed top-4 right-4 z-50 bg-green-500/20 border border-green-500/30 text-green-400 px-6 py-3 rounded-xl backdrop-blur-xl flex items-center gap-2 animate-fade-in", children: [_jsx("span", { className: "material-symbols-outlined", children: "check_circle" }), successMessage, _jsx("button", { onClick: () => setSuccessMessage(''), className: "ml-2", children: _jsx("span", { className: "material-symbols-outlined", children: "close" }) })] })), errorMessage && (_jsxs("div", { className: "fixed top-4 right-4 z-50 bg-red-500/20 border border-red-500/30 text-red-400 px-6 py-3 rounded-xl backdrop-blur-xl flex items-center gap-2 animate-fade-in", children: [_jsx("span", { className: "material-symbols-outlined", children: "error" }), errorMessage, _jsx("button", { onClick: () => setErrorMessage(''), className: "ml-2", children: _jsx("span", { className: "material-symbols-outlined", children: "close" }) })] })), _jsxs("div", { className: "relative z-10 max-w-7xl mx-auto p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-8", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("button", { onClick: () => navigate('/admin/users'), className: "p-2 hover:bg-white/5 rounded-lg transition-colors", children: _jsx("span", { className: "material-symbols-outlined text-pink-400", children: "arrow_back" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-white", children: "User Details" }), _jsx("p", { className: "text-slate-400 mt-1", children: "View and manage user account" })] })] }), _jsxs("div", { className: "flex gap-3", children: [_jsxs("button", { onClick: () => setShowMessageModal(true), className: "px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-all flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined", children: "mail" }), "Send Message"] }), user.suspended ? (_jsxs("button", { onClick: handleUnsuspend, disabled: actionLoading, className: "px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-all flex items-center gap-2 disabled:opacity-50", children: [_jsx("span", { className: "material-symbols-outlined", children: "check_circle" }), "Restore Account"] })) : (_jsxs("button", { onClick: () => setShowSuspendModal(true), className: "px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined", children: "block" }), "Suspend User"] }))] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6", children: [_jsx("div", { className: "lg:col-span-1 bg-[#15202e]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4", children: user.name.charAt(0).toUpperCase() }), _jsx("h2", { className: "text-2xl font-bold text-white mb-1", children: user.name }), _jsx("p", { className: "text-slate-400 text-sm mb-3", children: user.email }), _jsx("span", { className: `inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium border ${getRoleBadge(user.role)}`, children: user.role.toUpperCase() }), user.suspended && (_jsxs("div", { className: "mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30", children: [_jsxs("div", { className: "flex items-center gap-2 text-red-400 text-sm font-medium mb-1", children: [_jsx("span", { className: "material-symbols-outlined text-lg", children: "block" }), "Account Suspended"] }), user.suspendedReason && (_jsx("p", { className: "text-xs text-slate-400 mt-1", children: user.suspendedReason }))] }))] }) }), _jsxs("div", { className: "lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4", children: [_jsxs("div", { className: "bg-[#15202e]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5", children: [_jsx("span", { className: "material-symbols-outlined text-3xl text-green-400 mb-2 block", children: "eco" }), _jsx("p", { className: "text-2xl font-bold text-white", children: user.ecoPoints || 0 }), _jsx("p", { className: "text-sm text-slate-400", children: "Eco Points" })] }), _jsxs("div", { className: "bg-[#15202e]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5", children: [_jsx("span", { className: "material-symbols-outlined text-3xl text-blue-400 mb-2 block", children: "recycling" }), _jsxs("p", { className: "text-2xl font-bold text-white", children: [user.totalWasteRecycled || 0, " kg"] }), _jsx("p", { className: "text-sm text-slate-400", children: "Waste Recycled" })] }), _jsxs("div", { className: "bg-[#15202e]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5", children: [_jsx("span", { className: "material-symbols-outlined text-3xl text-purple-400 mb-2 block", children: "local_shipping" }), _jsx("p", { className: "text-2xl font-bold text-white", children: user.totalPickups || 0 }), _jsx("p", { className: "text-sm text-slate-400", children: "Total Pickups" })] })] })] }), _jsxs("div", { className: "bg-[#15202e]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5", children: [_jsxs("h3", { className: "text-xl font-bold text-white mb-4 flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-pink-400", children: "info" }), "Account Information"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm text-slate-400 block mb-1", children: "User ID" }), _jsx("p", { className: "text-white font-mono text-sm", children: user._id })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm text-slate-400 block mb-1", children: "Member Since" }), _jsx("p", { className: "text-white", children: new Date(user.createdAt).toLocaleDateString() })] }), user.phone && (_jsxs("div", { children: [_jsx("label", { className: "text-sm text-slate-400 block mb-1", children: "Phone" }), _jsx("p", { className: "text-white", children: user.phone })] })), _jsxs("div", { children: [_jsx("label", { className: "text-sm text-slate-400 block mb-1", children: "Verification Status" }), _jsx("span", { className: `inline-flex items-center gap-1 px-2 py-1 rounded-lg text-sm ${user.isVerified ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`, children: user.isVerified ? 'Verified' : 'Unverified' })] })] })] })] }), showSuspendModal && (_jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-[#15202e] rounded-2xl p-6 border border-white/5 max-w-md w-full", children: [_jsxs("h3", { className: "text-xl font-bold text-white mb-4 flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-red-400", children: "block" }), "Suspend User Account"] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "text-sm text-slate-400 block mb-2", children: "Reason for Suspension *" }), _jsx("textarea", { value: suspendReason, onChange: (e) => setSuspendReason(e.target.value), placeholder: "Enter the reason for suspending this account...", className: "w-full px-4 py-3 bg-[#0f1729] border border-white/5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 resize-none", rows: 4 })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => setShowSuspendModal(false), className: "flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-white hover:bg-white/5 transition-all", children: "Cancel" }), _jsx("button", { onClick: handleSuspend, disabled: actionLoading || !suspendReason.trim(), className: "flex-1 px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all disabled:opacity-50", children: actionLoading ? 'Suspending...' : 'Suspend User' })] })] }) })), showMessageModal && (_jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-[#15202e] rounded-2xl p-6 border border-white/5 max-w-md w-full", children: [_jsxs("h3", { className: "text-xl font-bold text-white mb-4 flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-blue-400", children: "mail" }), "Send Message to User"] }), _jsxs("div", { className: "space-y-4 mb-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm text-slate-400 block mb-2", children: "Message Title *" }), _jsx("input", { type: "text", value: messageTitle, onChange: (e) => setMessageTitle(e.target.value), placeholder: "Enter message title...", className: "w-full px-4 py-2 bg-[#0f1729] border border-white/5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm text-slate-400 block mb-2", children: "Message Content *" }), _jsx("textarea", { value: messageContent, onChange: (e) => setMessageContent(e.target.value), placeholder: "Enter your message...", className: "w-full px-4 py-3 bg-[#0f1729] border border-white/5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 resize-none", rows: 4 })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm text-slate-400 block mb-2", children: "Priority" }), _jsxs("select", { value: messagePriority, onChange: (e) => setMessagePriority(e.target.value), className: "w-full px-4 py-2 bg-[#0f1729] border border-white/5 rounded-xl text-white focus:outline-none focus:border-blue-500/50", children: [_jsx("option", { value: "normal", children: "Normal" }), _jsx("option", { value: "high", children: "High Priority" })] })] })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => setShowMessageModal(false), className: "flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-white hover:bg-white/5 transition-all", children: "Cancel" }), _jsx("button", { onClick: handleSendMessage, disabled: actionLoading || !messageTitle.trim() || !messageContent.trim(), className: "flex-1 px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition-all disabled:opacity-50", children: actionLoading ? 'Sending...' : 'Send Message' })] })] }) }))] }) }));
};
export default AdminUserDetail;
