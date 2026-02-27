import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import Layout from '../components/Layout.jsx';
import Loader from '../components/Loader.jsx';
import { useNavigate } from 'react-router-dom';
const AdminPartnerApproval = () => {
    const navigate = useNavigate();
    const [agencies, setAgencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');
    const [selectedAgency, setSelectedAgency] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [approvalNotes, setApprovalNotes] = useState('');
    useEffect(() => {
        fetchAgencies();
    }, [filter]);
    const fetchAgencies = async () => {
        try {
            setLoading(true);
            const params = filter !== 'all' ? { status: filter } : {};
            const response = await api.get('/admin/agencies', { params });
            // Handle both response structures: response.data.data.agencies or response.data.agencies
            const agencyList = response.data?.data?.agencies || response.data?.agencies || [];
            setAgencies(agencyList);
        }
        catch (error) {
            setAgencies([]);
        }
        finally {
            setLoading(false);
        }
    };
    const handleViewDetails = (agency) => {
        setSelectedAgency(agency);
        setShowModal(true);
        setRejectionReason('');
        setApprovalNotes('');
    };
    const handleApprove = async () => {
        if (!selectedAgency)
            return;
        try {
            setActionLoading(true);
            await api.post(`/admin/agencies/${selectedAgency._id}/approve`, {
                notes: approvalNotes
            });
            setShowModal(false);
            setSelectedAgency(null);
            fetchAgencies();
            alert('Partner approved successfully!');
        }
        catch (error) {
            alert(error.response?.data?.message || 'Failed to approve partner');
        }
        finally {
            setActionLoading(false);
        }
    };
    const handleReject = async () => {
        if (!selectedAgency || !rejectionReason.trim()) {
            alert('Please provide a reason for rejection');
            return;
        }
        try {
            setActionLoading(true);
            await api.post(`/admin/agencies/${selectedAgency._id}/reject`, {
                reason: rejectionReason
            });
            setShowModal(false);
            setSelectedAgency(null);
            fetchAgencies();
            alert('Partner rejected');
        }
        catch (error) {
            alert(error.response?.data?.message || 'Failed to reject partner');
        }
        finally {
            setActionLoading(false);
        }
    };
    const getStatusBadge = (status) => {
        const statusStyles = {
            pending: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
            approved: 'bg-green-500/10 text-green-400 border border-green-500/20',
            rejected: 'bg-red-500/10 text-red-400 border border-red-500/20'
        };
        return (_jsx("span", { className: `px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[status]}`, children: status.charAt(0).toUpperCase() + status.slice(1) }));
    };
    return (_jsx(Layout, { title: "", role: "Admin", fullWidth: true, hideSidebar: true, children: _jsxs("div", { className: "bg-gradient-to-br from-[#1a0b1e] via-[#0B1116] to-[#1a0b1e] min-h-screen", children: [_jsx("div", { className: "fixed top-0 left-0 w-full h-[500px] bg-pink-500/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" }), _jsx("div", { className: "fixed bottom-0 right-0 w-full h-[500px] bg-purple-500/10 rounded-full blur-[120px] translate-y-1/2 pointer-events-none" }), _jsxs("div", { className: "relative z-10", children: [_jsxs("header", { className: "border-b border-white/5 bg-[#0B1116]/80 backdrop-blur-md px-6 py-4", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("button", { onClick: () => navigate('/admin'), className: "p-2 hover:bg-white/5 rounded-lg transition-colors", children: _jsx("span", { className: "material-symbols-outlined text-pink-400", children: "arrow_back" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: "Partner Applications" }), _jsx("p", { className: "text-sm text-slate-400", children: "Review and approve partner registrations" })] })] }) }), _jsx("div", { className: "flex gap-2 mt-4", children: ['all', 'pending', 'approved', 'rejected'].map((status) => (_jsx("button", { onClick: () => setFilter(status), className: `px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === status
                                            ? 'bg-pink-500 text-white'
                                            : 'bg-white/5 text-slate-400 hover:bg-white/5'}`, children: status.charAt(0).toUpperCase() + status.slice(1) }, status))) })] }), _jsx("div", { className: "p-6", children: loading ? (_jsx("div", { className: "flex items-center justify-center py-20", children: _jsx(Loader, { size: "md", color: "#ec4899" }) })) : agencies.length === 0 ? (_jsxs("div", { className: "text-center py-20", children: [_jsx("span", { className: "material-symbols-outlined text-6xl text-gray-600 mb-4", children: "inbox" }), _jsx("p", { className: "text-slate-400", children: "No partner applications found" })] })) : (_jsx("div", { className: "grid gap-4", children: agencies.map((agency) => (_jsx("div", { className: "bg-[#1E293B]/60 backdrop-blur-sm border border-pink-500/20 rounded-2xl p-6 hover:border-pink-500/40 transition-all", children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center space-x-3 mb-2", children: [_jsx("h3", { className: "text-xl font-semibold text-white", children: agency.name }), getStatusBadge(agency.verificationStatus)] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 text-sm", children: [_jsxs("div", { children: [_jsx("span", { className: "text-slate-400", children: "Head Name:" }), _jsx("p", { className: "font-medium text-white", children: agency.headName || 'N/A' })] }), _jsxs("div", { children: [_jsx("span", { className: "text-slate-400", children: "Email:" }), _jsx("p", { className: "font-medium text-white", children: agency.email })] }), _jsxs("div", { children: [_jsx("span", { className: "text-slate-400", children: "Phone:" }), _jsx("p", { className: "font-medium text-white", children: agency.phone })] }), _jsxs("div", { children: [_jsx("span", { className: "text-slate-400", children: "GST Number:" }), _jsx("p", { className: "font-medium text-white", children: agency.gstNumber || 'N/A' })] }), _jsxs("div", { children: [_jsx("span", { className: "text-slate-400", children: "Location:" }), _jsxs("p", { className: "font-medium text-white", children: [agency.address.city, ", ", agency.address.state] })] }), _jsxs("div", { children: [_jsx("span", { className: "text-slate-400", children: "Submitted:" }), _jsx("p", { className: "font-medium text-white", children: new Date(agency.createdAt).toLocaleDateString() })] })] })] }), _jsx("button", { onClick: () => handleViewDetails(agency), className: "ml-4 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all font-medium", children: "View Details" })] }) }, agency._id))) })) })] }), showModal && selectedAgency && (_jsx("div", { className: "fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50", children: _jsxs("div", { className: "bg-[#1E293B] border border-pink-500/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "sticky top-0 bg-[#1E293B] border-b border-white/5 px-6 py-4 flex justify-between items-center", children: [_jsx("h2", { className: "text-2xl font-bold text-white", children: "Partner Details" }), _jsx("button", { onClick: () => setShowModal(false), className: "text-slate-400 hover:text-white", children: _jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }), _jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("span", { className: "text-gray-200 font-medium", children: "Status:" }), getStatusBadge(selectedAgency.verificationStatus)] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-white mb-3", children: "Business Information" }), _jsxs("div", { className: "grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-lg", children: [_jsxs("div", { children: [_jsx("span", { className: "text-sm text-slate-400", children: "Agency Name:" }), _jsx("p", { className: "font-medium text-white", children: selectedAgency.name })] }), _jsxs("div", { children: [_jsx("span", { className: "text-sm text-slate-400", children: "Head/Owner Name:" }), _jsx("p", { className: "font-medium text-white", children: selectedAgency.headName || 'N/A' })] }), _jsxs("div", { children: [_jsx("span", { className: "text-sm text-slate-400", children: "GST Number:" }), _jsx("p", { className: "font-medium text-white", children: selectedAgency.gstNumber || 'N/A' })] }), _jsxs("div", { children: [_jsx("span", { className: "text-sm text-slate-400", children: "Udyam Certificate:" }), _jsx("p", { className: "font-medium text-white", children: selectedAgency.udyamCertificate || 'N/A' })] }), _jsxs("div", { children: [_jsx("span", { className: "text-sm text-slate-400", children: "Business Type:" }), _jsx("p", { className: "font-medium text-white", children: selectedAgency.businessType || 'N/A' })] }), _jsxs("div", { children: [_jsx("span", { className: "text-sm text-slate-400", children: "Established Year:" }), _jsx("p", { className: "font-medium text-white", children: selectedAgency.establishedYear || 'N/A' })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-white mb-3", children: "Contact Information" }), _jsxs("div", { className: "grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-lg", children: [_jsxs("div", { children: [_jsx("span", { className: "text-sm text-slate-400", children: "Email:" }), _jsx("p", { className: "font-medium text-white", children: selectedAgency.email })] }), _jsxs("div", { children: [_jsx("span", { className: "text-sm text-slate-400", children: "Phone:" }), _jsx("p", { className: "font-medium text-white", children: selectedAgency.phone })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-white mb-3", children: "Address" }), _jsx("div", { className: "bg-white/5 p-4 rounded-lg", children: _jsxs("p", { className: "font-medium text-white", children: [selectedAgency.address.street, _jsx("br", {}), selectedAgency.address.city, ", ", selectedAgency.address.state, " ", selectedAgency.address.zipCode || selectedAgency.address.postalCode, _jsx("br", {}), selectedAgency.address.country || 'India'] }) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-white mb-3", children: "Services Offered" }), _jsx("div", { className: "flex flex-wrap gap-2", children: selectedAgency.services.map((service, index) => (_jsx("span", { className: "px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm border border-purple-500/20", children: service }, index))) })] }), selectedAgency.description && (_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-white mb-3", children: "Description" }), _jsx("div", { className: "bg-white/5 p-4 rounded-lg", children: _jsx("p", { className: "text-gray-200", children: selectedAgency.description }) })] })), selectedAgency.verificationStatus === 'pending' && (_jsxs("div", { className: "space-y-4 border-t border-white/5 pt-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-200 mb-2", children: "Approval Notes (Optional)" }), _jsx("textarea", { value: approvalNotes, onChange: (e) => setApprovalNotes(e.target.value), rows: 3, className: "w-full px-4 py-2 bg-white/5 border border-white/5 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:outline-none", placeholder: "Add any notes for the partner..." })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-200 mb-2", children: "Rejection Reason (Required if rejecting)" }), _jsx("textarea", { value: rejectionReason, onChange: (e) => setRejectionReason(e.target.value), rows: 3, className: "w-full px-4 py-2 bg-white/5 border border-white/5 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:outline-none", placeholder: "Explain why this application is being rejected..." })] }), _jsxs("div", { className: "flex space-x-4", children: [_jsx("button", { onClick: handleApprove, disabled: actionLoading, className: "flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-colors disabled:opacity-50 font-bold", children: actionLoading ? 'Processing...' : 'Approve Partner' }), _jsx("button", { onClick: handleReject, disabled: actionLoading || !rejectionReason.trim(), className: "flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-colors disabled:opacity-50 font-bold", children: actionLoading ? 'Processing...' : 'Reject' })] })] }))] })] }) }))] }) }));
};
export default AdminPartnerApproval;
