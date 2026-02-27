import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import Layout from '../components/Layout.jsx';
import Loader from '../components/Loader.jsx';
import { useNavigate } from 'react-router-dom';
const AdminAgencies = () => {
    const navigate = useNavigate();
    const [agencies, setAgencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    useEffect(() => {
        fetchAgencies();
    }, [statusFilter]);
    const fetchAgencies = async () => {
        try {
            setLoading(true);
            const params = {};
            if (statusFilter !== 'all')
                params.status = statusFilter;
            const response = await api.get('/admin/agencies', { params });
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
    const filteredAgencies = agencies.filter(agency => agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agency.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const getStatusBadge = (status, isVerified) => {
        if (isVerified) {
            return 'bg-green-500/10 text-green-400 border-green-500/20';
        }
        else if (status === 'pending') {
            return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
        }
        else {
            return 'bg-red-500/10 text-red-400 border-red-500/20';
        }
    };
    return (_jsx(Layout, { title: "", role: "Admin", fullWidth: true, hideSidebar: true, children: _jsxs("div", { className: "bg-gradient-to-br from-[#1a0b1e] via-[#0B1116] to-[#1a0b1e] min-h-screen", children: [_jsx("div", { className: "fixed top-0 left-0 w-full h-[500px] bg-pink-500/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" }), _jsx("div", { className: "fixed bottom-0 right-0 w-full h-[500px] bg-purple-500/10 rounded-full blur-[120px] translate-y-1/2 pointer-events-none" }), _jsxs("div", { className: "relative z-10", children: [_jsxs("header", { className: "border-b border-white/5 bg-[#0B1116]/80 backdrop-blur-md px-6 py-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("button", { onClick: () => navigate('/admin'), className: "p-2 hover:bg-white/5 rounded-lg transition-colors", children: _jsx("span", { className: "material-symbols-outlined text-pink-400", children: "arrow_back" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: "Partner Agencies" }), _jsx("p", { className: "text-sm text-slate-400", children: "View all verified partner agencies" })] })] }), _jsx("div", { className: "flex items-center gap-3", children: _jsxs("div", { className: "relative", children: [_jsx("span", { className: "material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-[20px]", children: "search" }), _jsx("input", { type: "text", placeholder: "Search agencies...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "pl-10 pr-4 py-2 bg-white/5 border border-white/5 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 w-64" })] }) })] }), _jsx("div", { className: "flex gap-2 mt-4", children: ['all', 'approved', 'pending', 'rejected'].map((status) => (_jsx("button", { onClick: () => setStatusFilter(status), className: `px-4 py-2 rounded-lg text-sm font-medium transition-all ${statusFilter === status
                                            ? 'bg-pink-500 text-white'
                                            : 'bg-white/5 text-slate-400 hover:bg-white/5'}`, children: status.charAt(0).toUpperCase() + status.slice(1) }, status))) })] }), _jsx("div", { className: "p-6", children: loading ? (_jsx("div", { className: "flex items-center justify-center py-20", children: _jsx(Loader, { size: "md", color: "#ec4899" }) })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6", children: [_jsx("div", { className: "bg-[#1E293B]/60 backdrop-blur-sm border border-green-500/20 rounded-xl p-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-green-500/20 rounded-lg", children: _jsx("span", { className: "material-symbols-outlined text-green-400", children: "verified" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold text-white", children: agencies.filter(a => a.isVerified).length }), _jsx("p", { className: "text-sm text-slate-400", children: "Active Partners" })] })] }) }), _jsx("div", { className: "bg-[#1E293B]/60 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-yellow-500/20 rounded-lg", children: _jsx("span", { className: "material-symbols-outlined text-yellow-400", children: "pending" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold text-white", children: agencies.filter(a => a.verificationStatus === 'pending').length }), _jsx("p", { className: "text-sm text-slate-400", children: "Pending" })] })] }) }), _jsx("div", { className: "bg-[#1E293B]/60 backdrop-blur-sm border border-pink-500/20 rounded-xl p-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-pink-500/20 rounded-lg", children: _jsx("span", { className: "material-symbols-outlined text-pink-400", children: "local_shipping" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold text-white", children: agencies.reduce((sum, a) => sum + (a.totalBookings || 0), 0) }), _jsx("p", { className: "text-sm text-slate-400", children: "Total Bookings" })] })] }) }), _jsx("div", { className: "bg-[#1E293B]/60 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-purple-500/20 rounded-lg", children: _jsx("span", { className: "material-symbols-outlined text-purple-400", children: "star" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold text-white", children: (agencies.filter(a => a.rating).reduce((sum, a) => sum + (a.rating || 0), 0) / agencies.filter(a => a.rating).length || 0).toFixed(1) }), _jsx("p", { className: "text-sm text-slate-400", children: "Avg Rating" })] })] }) })] }), filteredAgencies.length === 0 ? (_jsxs("div", { className: "text-center py-20", children: [_jsx("span", { className: "material-symbols-outlined text-6xl text-gray-600 mb-4", children: "business" }), _jsx("p", { className: "text-slate-400", children: "No agencies found" })] })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredAgencies.map((agency) => (_jsxs("div", { className: "bg-[#1E293B]/60 backdrop-blur-sm border border-pink-500/20 rounded-2xl p-6 hover:border-pink-500/40 transition-all cursor-pointer", onClick: () => navigate(`/admin/agencies/${agency._id}`), children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-lg font-bold text-white mb-1", children: agency.name }), _jsx("p", { className: "text-sm text-slate-400", children: agency.email })] }), _jsx("span", { className: `px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(agency.verificationStatus, agency.isVerified)}`, children: agency.isVerified ? 'Active' : agency.verificationStatus })] }), _jsxs("div", { className: "space-y-2 mb-4", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-200", children: [_jsx("span", { className: "material-symbols-outlined text-[18px] text-pink-400", children: "location_on" }), _jsxs("span", { children: [agency.address.city, ", ", agency.address.state] })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-200", children: [_jsx("span", { className: "material-symbols-outlined text-[18px] text-pink-400", children: "phone" }), _jsx("span", { children: agency.phone })] }), agency.rating && (_jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-200", children: [_jsx("span", { className: "material-symbols-outlined text-[18px] text-yellow-400", children: "star" }), _jsxs("span", { children: [agency.rating.toFixed(1), " Rating"] })] }))] }), _jsxs("div", { className: "flex flex-wrap gap-2 mb-4", children: [agency.services.slice(0, 3).map((service, idx) => (_jsx("span", { className: "px-2 py-1 bg-purple-500/10 text-purple-400 rounded text-xs border border-purple-500/20", children: service }, idx))), agency.services.length > 3 && (_jsxs("span", { className: "px-2 py-1 bg-purple-500/10 text-purple-400 rounded text-xs border border-purple-500/20", children: ["+", agency.services.length - 3, " more"] }))] }), _jsxs("div", { className: "flex justify-between items-center pt-4 border-t border-white/5", children: [_jsxs("span", { className: "text-xs text-gray-500", children: [agency.totalBookings || 0, " bookings"] }), _jsxs("span", { className: "text-xs text-gray-500", children: ["Joined ", new Date(agency.createdAt).toLocaleDateString()] })] })] }, agency._id))) }))] })) })] })] }) }));
};
export default AdminAgencies;
