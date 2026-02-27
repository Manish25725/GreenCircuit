import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import Layout from '../components/Layout.jsx';
import Loader from '../components/Loader.jsx';
import { useNavigate } from 'react-router-dom';
const AdminAgencyDetail = () => {
    const navigate = useNavigate();
    const [agency, setAgency] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [showSuspendModal, setShowSuspendModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [suspendReason, setSuspendReason] = useState('');
    const [rejectReason, setRejectReason] = useState('');
    const [messageTitle, setMessageTitle] = useState('');
    const [messageContent, setMessageContent] = useState('');
    const [messagePriority, setMessagePriority] = useState('normal');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    useEffect(() => {
        const agencyId = window.location.pathname.split('/').pop();
        if (agencyId)
            fetchAgencyDetails(agencyId);
    }, []);
    const fetchAgencyDetails = async (agencyId) => {
        try {
            setLoading(true);
            const response = await api.get(`/admin/agencies/${agencyId}`);
            setAgency(response.data?.data?.agency || response.data?.agency);
        }
        catch (error) {
            setErrorMessage('Failed to load agency details');
        }
        finally {
            setLoading(false);
        }
    };
    const handleApprove = async () => {
        if (!agency)
            return;
        try {
            setActionLoading(true);
            await api.post(`/admin/agencies/${agency._id}/approve`);
            setSuccessMessage('Agency approved successfully');
            fetchAgencyDetails(agency._id);
        }
        catch (error) {
            setErrorMessage(error.response?.data?.message || 'Failed to approve agency');
        }
        finally {
            setActionLoading(false);
        }
    };
    const handleReject = async () => {
        if (!agency || !rejectReason.trim()) {
            setErrorMessage('Please provide a reason for rejection');
            return;
        }
        try {
            setActionLoading(true);
            await api.post(`/admin/agencies/${agency._id}/reject`, { reason: rejectReason });
            setSuccessMessage('Agency rejected');
            setShowRejectModal(false);
            setRejectReason('');
            fetchAgencyDetails(agency._id);
        }
        catch (error) {
            setErrorMessage(error.response?.data?.message || 'Failed to reject agency');
        }
        finally {
            setActionLoading(false);
        }
    };
    const handleSuspend = async () => {
        if (!agency || !suspendReason.trim()) {
            setErrorMessage('Please provide a reason for suspension');
            return;
        }
        try {
            setActionLoading(true);
            await api.post(`/admin/agencies/${agency._id}/suspend`, { reason: suspendReason });
            setSuccessMessage('Agency suspended successfully');
            setShowSuspendModal(false);
            setSuspendReason('');
            fetchAgencyDetails(agency._id);
        }
        catch (error) {
            setErrorMessage(error.response?.data?.message || 'Failed to suspend agency');
        }
        finally {
            setActionLoading(false);
        }
    };
    const handleUnsuspend = async () => {
        if (!agency)
            return;
        try {
            setActionLoading(true);
            await api.post(`/admin/agencies/${agency._id}/unsuspend`);
            setSuccessMessage('Agency account restored successfully');
            fetchAgencyDetails(agency._id);
        }
        catch (error) {
            setErrorMessage(error.response?.data?.message || 'Failed to unsuspend agency');
        }
        finally {
            setActionLoading(false);
        }
    };
    const handleSendMessage = async () => {
        if (!agency || !messageTitle.trim() || !messageContent.trim()) {
            setErrorMessage('Please fill in all message fields');
            return;
        }
        try {
            setActionLoading(true);
            await api.post(`/admin/agencies/${agency._id}/message`, {
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
    const getStatusBadge = () => {
        if (!agency)
            return null;
        if (agency.suspended) {
            return (_jsxs("span", { className: "inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium border bg-red-500/20 text-red-400 border-red-500/30", children: [_jsx("span", { className: "material-symbols-outlined text-base", children: "block" }), "Suspended"] }));
        }
        if (!agency.isApproved) {
            return (_jsxs("span", { className: "inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium border bg-yellow-500/20 text-yellow-400 border-yellow-500/30", children: [_jsx("span", { className: "material-symbols-outlined text-base", children: "pending" }), "Pending Approval"] }));
        }
        return (_jsxs("span", { className: "inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium border bg-green-500/20 text-green-400 border-green-500/30", children: [_jsx("span", { className: "material-symbols-outlined text-base", children: "verified" }), "Approved"] }));
    };
    if (loading) {
        return (_jsx(Layout, { title: "", role: "Admin", fullWidth: true, hideSidebar: true, children: _jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsx(Loader, { size: "lg", color: "#ec4899" }) }) }));
    }
    if (!agency) {
        return (_jsx(Layout, { title: "", role: "Admin", fullWidth: true, hideSidebar: true, children: _jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsxs("div", { className: "text-center", children: [_jsx("span", { className: "material-symbols-outlined text-6xl text-gray-600 mb-4 block", children: "business_center" }), _jsx("p", { className: "text-slate-400", children: "Agency not found" })] }) }) }));
    }
    return (_jsx(Layout, { title: "", role: "Admin", fullWidth: true, hideSidebar: true, children: _jsxs("div", { className: "bg-gradient-to-br from-[#1a0b1e] via-[#0B1116] to-[#1a0b1e] min-h-screen", children: [_jsx("div", { className: "fixed top-0 left-0 w-full h-[500px] bg-pink-500/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" }), successMessage && (_jsxs("div", { className: "fixed top-4 right-4 z-50 bg-green-500/20 border border-green-500/30 text-green-400 px-6 py-3 rounded-xl backdrop-blur-xl flex items-center gap-2 animate-fade-in", children: [_jsx("span", { className: "material-symbols-outlined", children: "check_circle" }), successMessage, _jsx("button", { onClick: () => setSuccessMessage(''), className: "ml-2", children: _jsx("span", { className: "material-symbols-outlined", children: "close" }) })] })), errorMessage && (_jsxs("div", { className: "fixed top-4 right-4 z-50 bg-red-500/20 border border-red-500/30 text-red-400 px-6 py-3 rounded-xl backdrop-blur-xl flex items-center gap-2 animate-fade-in", children: [_jsx("span", { className: "material-symbols-outlined", children: "error" }), errorMessage, _jsx("button", { onClick: () => setErrorMessage(''), className: "ml-2", children: _jsx("span", { className: "material-symbols-outlined", children: "close" }) })] })), _jsxs("div", { className: "relative z-10 max-w-7xl mx-auto p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-8", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("button", { onClick: () => navigate('/admin/agencies'), className: "p-2 hover:bg-white/5 rounded-lg transition-colors", children: _jsx("span", { className: "material-symbols-outlined text-pink-400", children: "arrow_back" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-white", children: "Agency Details" }), _jsx("p", { className: "text-slate-400 mt-1", children: "View and manage agency account" })] })] }), _jsxs("div", { className: "flex gap-3", children: [_jsxs("button", { onClick: () => setShowMessageModal(true), className: "px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-all flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined", children: "mail" }), "Send Message"] }), !agency.isApproved && !agency.suspended && (_jsxs(_Fragment, { children: [_jsxs("button", { onClick: handleApprove, disabled: actionLoading, className: "px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-all flex items-center gap-2 disabled:opacity-50", children: [_jsx("span", { className: "material-symbols-outlined", children: "check_circle" }), "Approve"] }), _jsxs("button", { onClick: () => setShowRejectModal(true), className: "px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20 transition-all flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined", children: "cancel" }), "Reject"] })] })), agency.suspended ? (_jsxs("button", { onClick: handleUnsuspend, disabled: actionLoading, className: "px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-all flex items-center gap-2 disabled:opacity-50", children: [_jsx("span", { className: "material-symbols-outlined", children: "check_circle" }), "Restore Account"] })) : agency.isApproved && (_jsxs("button", { onClick: () => setShowSuspendModal(true), className: "px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined", children: "block" }), "Suspend Agency"] }))] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6", children: [_jsx("div", { className: "lg:col-span-1 bg-[#15202e]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4", children: agency.name.charAt(0).toUpperCase() }), _jsx("h2", { className: "text-2xl font-bold text-white mb-1", children: agency.name }), _jsx("p", { className: "text-slate-400 text-sm mb-2", children: agency.email }), agency.phone && (_jsxs("p", { className: "text-slate-400 text-sm mb-3 flex items-center justify-center gap-1", children: [_jsx("span", { className: "material-symbols-outlined text-sm", children: "call" }), agency.phone] })), _jsx("div", { className: "mt-3", children: getStatusBadge() }), agency.suspended && agency.suspendedReason && (_jsx("div", { className: "mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30", children: _jsx("p", { className: "text-xs text-slate-400", children: agency.suspendedReason }) }))] }) }), _jsxs("div", { className: "lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4", children: [_jsxs("div", { className: "bg-[#15202e]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5", children: [_jsx("span", { className: "material-symbols-outlined text-3xl text-purple-400 mb-2 block", children: "local_shipping" }), _jsx("p", { className: "text-2xl font-bold text-white", children: agency.completedBookings || 0 }), _jsx("p", { className: "text-sm text-slate-400", children: "Completed" })] }), _jsxs("div", { className: "bg-[#15202e]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5", children: [_jsx("span", { className: "material-symbols-outlined text-3xl text-blue-400 mb-2 block", children: "recycling" }), _jsxs("p", { className: "text-2xl font-bold text-white", children: [agency.totalWasteProcessed || 0, " kg"] }), _jsx("p", { className: "text-sm text-slate-400", children: "Waste Processed" })] }), _jsxs("div", { className: "bg-[#15202e]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5", children: [_jsx("span", { className: "material-symbols-outlined text-3xl text-yellow-400 mb-2 block", children: "star" }), _jsx("p", { className: "text-2xl font-bold text-white", children: agency.rating?.toFixed(1) || 'N/A' }), _jsx("p", { className: "text-sm text-slate-400", children: "Rating" })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-[#15202e]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5", children: [_jsxs("h3", { className: "text-xl font-bold text-white mb-4 flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-pink-400", children: "business" }), "Business Information"] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm text-slate-400 block mb-1", children: "Agency ID" }), _jsx("p", { className: "text-white font-mono text-sm", children: agency._id })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm text-slate-400 block mb-1", children: "License Number" }), _jsx("p", { className: "text-white", children: agency.licenseNumber || 'Not provided' })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm text-slate-400 block mb-1", children: "Member Since" }), _jsx("p", { className: "text-white", children: new Date(agency.createdAt).toLocaleDateString() })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm text-slate-400 block mb-1", children: "Operating Hours" }), _jsx("p", { className: "text-white", children: agency.operatingHours || 'Not specified' })] })] })] }), _jsxs("div", { className: "bg-[#15202e]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5", children: [_jsxs("h3", { className: "text-xl font-bold text-white mb-4 flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-pink-400", children: "location_on" }), "Location & Services"] }), _jsxs("div", { className: "space-y-4", children: [agency.address && (_jsxs("div", { children: [_jsx("label", { className: "text-sm text-slate-400 block mb-1", children: "Address" }), _jsxs("p", { className: "text-white", children: [agency.address.street && `${agency.address.street}, `, agency.address.city && `${agency.address.city}, `, agency.address.state && `${agency.address.state} `, agency.address.zipCode] })] })), agency.servicesOffered && agency.servicesOffered.length > 0 && (_jsxs("div", { children: [_jsx("label", { className: "text-sm text-slate-400 block mb-2", children: "Services Offered" }), _jsx("div", { className: "flex flex-wrap gap-2", children: agency.servicesOffered.map((service, index) => (_jsx("span", { className: "px-3 py-1 rounded-lg bg-purple-500/10 text-purple-400 text-sm border border-purple-500/30", children: service }, index))) })] }))] })] })] })] }), showSuspendModal && (_jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-[#15202e] rounded-2xl p-6 border border-white/5 max-w-md w-full", children: [_jsxs("h3", { className: "text-xl font-bold text-white mb-4 flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-red-400", children: "block" }), "Suspend Agency Account"] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "text-sm text-slate-400 block mb-2", children: "Reason for Suspension *" }), _jsx("textarea", { value: suspendReason, onChange: (e) => setSuspendReason(e.target.value), placeholder: "Enter the reason for suspending this agency...", className: "w-full px-4 py-3 bg-[#0f1729] border border-white/5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 resize-none", rows: 4 })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => setShowSuspendModal(false), className: "flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-white hover:bg-white/5 transition-all", children: "Cancel" }), _jsx("button", { onClick: handleSuspend, disabled: actionLoading || !suspendReason.trim(), className: "flex-1 px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all disabled:opacity-50", children: actionLoading ? 'Suspending...' : 'Suspend Agency' })] })] }) })), showRejectModal && (_jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-[#15202e] rounded-2xl p-6 border border-white/5 max-w-md w-full", children: [_jsxs("h3", { className: "text-xl font-bold text-white mb-4 flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-orange-400", children: "cancel" }), "Reject Agency Application"] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "text-sm text-slate-400 block mb-2", children: "Reason for Rejection *" }), _jsx("textarea", { value: rejectReason, onChange: (e) => setRejectReason(e.target.value), placeholder: "Enter the reason for rejecting this application...", className: "w-full px-4 py-3 bg-[#0f1729] border border-white/5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 resize-none", rows: 4 })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => setShowRejectModal(false), className: "flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-white hover:bg-white/5 transition-all", children: "Cancel" }), _jsx("button", { onClick: handleReject, disabled: actionLoading || !rejectReason.trim(), className: "flex-1 px-4 py-2 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-400 hover:bg-orange-500/30 transition-all disabled:opacity-50", children: actionLoading ? 'Rejecting...' : 'Reject Agency' })] })] }) })), showMessageModal && (_jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-[#15202e] rounded-2xl p-6 border border-white/5 max-w-md w-full", children: [_jsxs("h3", { className: "text-xl font-bold text-white mb-4 flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-blue-400", children: "mail" }), "Send Message to Agency"] }), _jsxs("div", { className: "space-y-4 mb-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm text-slate-400 block mb-2", children: "Message Title *" }), _jsx("input", { type: "text", value: messageTitle, onChange: (e) => setMessageTitle(e.target.value), placeholder: "Enter message title...", className: "w-full px-4 py-2 bg-[#0f1729] border border-white/5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm text-slate-400 block mb-2", children: "Message Content *" }), _jsx("textarea", { value: messageContent, onChange: (e) => setMessageContent(e.target.value), placeholder: "Enter your message...", className: "w-full px-4 py-3 bg-[#0f1729] border border-white/5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 resize-none", rows: 4 })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm text-slate-400 block mb-2", children: "Priority" }), _jsxs("select", { value: messagePriority, onChange: (e) => setMessagePriority(e.target.value), className: "w-full px-4 py-2 bg-[#0f1729] border border-white/5 rounded-xl text-white focus:outline-none focus:border-blue-500/50", children: [_jsx("option", { value: "normal", children: "Normal" }), _jsx("option", { value: "high", children: "High Priority" })] })] })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => setShowMessageModal(false), className: "flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-white hover:bg-white/5 transition-all", children: "Cancel" }), _jsx("button", { onClick: handleSendMessage, disabled: actionLoading || !messageTitle.trim() || !messageContent.trim(), className: "flex-1 px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition-all disabled:opacity-50", children: actionLoading ? 'Sending...' : 'Send Message' })] })] }) }))] }) }));
};
export default AdminAgencyDetail;
