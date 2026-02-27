import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import RolePageShell from '../components/RolePageShell.jsx';
import BackButton from '../components/BackButton.jsx';
import StatCard from '../components/StatCard.jsx';
import Loader from '../components/Loader.jsx';
import { api } from '../services/api.js';
import { getStatusColor, getStatusIcon } from '../utils/status.js';
import { useNavigate } from 'react-router-dom';
const History = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    useEffect(() => {
        (async () => {
            try {
                const response = await api.getUserBookings();
                setBookings(response?.bookings || response || []);
            }
            catch (error) {
            }
            finally {
                setLoading(false);
            }
        })();
    }, []);
    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const filteredBookings = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);
    const stats = {
        total: bookings.length,
        completed: bookings.filter(b => b.status === 'completed').length,
        pending: bookings.filter(b => b.status === 'pending' || b.status === 'confirmed' || b.status === 'in-progress').length,
        cancelled: bookings.filter(b => b.status === 'cancelled').length,
    };
    return (_jsxs(RolePageShell, { role: "resident", maxWidth: "max-w-6xl", children: [_jsx(BackButton, { label: "Back to Dashboard", color: "#10b981", hoverColor: "#059669" }), _jsx("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-end gap-6 py-8", children: _jsxs("div", { children: [_jsx("h1", { className: "text-white text-4xl sm:text-5xl font-black leading-tight tracking-tighter mb-2 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent", children: "Pickup History" }), _jsx("p", { className: "text-[#94a3b8] text-lg", children: "Track all your e-waste recycling requests" })] }) }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-8", children: [_jsx(StatCard, { icon: "recycling", iconColor: "#10b981", label: "Total Pickups", value: stats.total, variant: "card" }), _jsx(StatCard, { icon: "check_circle", iconColor: "#10b981", label: "Completed", value: stats.completed, variant: "card" }), _jsx(StatCard, { icon: "pending", iconColor: "#f59e0b", label: "In Progress", value: stats.pending, variant: "card" }), _jsx(StatCard, { icon: "cancel", iconColor: "#ef4444", label: "Cancelled", value: stats.cancelled, variant: "card" })] }), _jsx("div", { className: "flex gap-2 mb-6 overflow-x-auto pb-2", children: ['all', 'pending', 'confirmed', 'in-progress', 'completed', 'cancelled'].map((status) => (_jsx("button", { onClick: () => setFilter(status), className: `px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${filter === status
                        ? 'bg-[#10b981] text-white'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`, children: status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ') }, status))) }), _jsx("div", { className: "bg-[#151F26] rounded-2xl border border-white/5 overflow-hidden", children: loading ? (_jsx("div", { className: "flex items-center justify-center py-20", children: _jsx(Loader, { size: "md", color: "#10b981" }) })) : filteredBookings.length === 0 ? (_jsxs("div", { className: "text-center py-20", children: [_jsx("div", { className: "w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center", children: _jsx("span", { className: "material-symbols-outlined text-3xl text-gray-500", children: "inbox" }) }), _jsx("h3", { className: "text-lg font-bold text-white mb-2", children: "No Pickups Found" }), _jsx("p", { className: "text-slate-400 mb-6", children: filter === 'all' ? "You haven't scheduled any pickups yet." : `No ${filter} pickups found.` }), filter === 'all' && (_jsxs("button", { onClick: () => (navigate('/search')), className: "bg-[#10b981] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#059669] transition-colors inline-flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined", children: "add" }), "Schedule Your First Pickup"] }))] })) : (_jsx("div", { className: "divide-y divide-white/5", children: filteredBookings.map((booking) => (_jsxs("div", { className: "p-6 hover:bg-white/5 transition-colors", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [_jsxs("div", { className: "flex items-start gap-4 flex-1 cursor-pointer", onClick: () => (navigate(`/pickup-confirmation?booking=${booking._id}`)), children: [_jsx("div", { className: `p-3 rounded-xl ${getStatusColor(booking.status)}`, children: _jsx("span", { className: "material-symbols-outlined", children: getStatusIcon(booking.status) }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3 mb-1", children: [_jsx("h3", { className: "text-white font-bold", children: booking.bookingId || `#REQ-${booking._id?.slice(-6).toUpperCase()}` }), _jsx("span", { className: `text-[10px] font-bold uppercase px-2 py-1 rounded border ${getStatusColor(booking.status)}`, children: booking.status })] }), _jsxs("p", { className: "text-slate-400 text-sm mb-2", children: [formatDate(booking.scheduledDate), " \u2022 ", booking.scheduledTime || 'TBD'] }), _jsx("p", { className: "text-gray-500 text-sm", children: typeof booking.agencyId === 'object' ? booking.agencyId.name : 'Agency Assigned' })] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [booking.status === 'completed' && (_jsxs("button", { onClick: (e) => {
                                                    e.stopPropagation();
                                                    navigate(`/certificate?booking=${booking._id}`);
                                                }, className: "flex items-center gap-2 px-4 py-2 bg-[#10b981]/10 hover:bg-[#10b981]/20 text-[#10b981] rounded-lg transition-colors border border-[#10b981]/20", children: [_jsx("span", { className: "material-symbols-outlined text-sm", children: "verified" }), _jsx("span", { className: "text-sm font-bold", children: "Certificate" })] })), _jsxs("div", { className: "text-right", children: [_jsxs("p", { className: "text-[#10b981] font-bold", children: ["+", booking.ecoPointsEarned || 0] }), _jsx("p", { className: "text-xs text-gray-500", children: "Eco Points" })] }), _jsx("span", { className: "material-symbols-outlined text-gray-500 cursor-pointer", onClick: () => (navigate(`/pickup-confirmation?booking=${booking._id}`)), children: "chevron_right" })] })] }), booking.items && booking.items.length > 0 && (_jsx("div", { className: "mt-4 pt-4 border-t border-white/5", children: _jsxs("div", { className: "flex flex-wrap gap-2", children: [booking.items.slice(0, 3).map((item, idx) => (_jsxs("span", { className: "px-3 py-1 bg-white/5 rounded-full text-xs text-gray-200", children: [item.quantity, "x ", item.type] }, idx))), booking.items.length > 3 && (_jsxs("span", { className: "px-3 py-1 bg-white/5 rounded-full text-xs text-gray-500", children: ["+", booking.items.length - 3, " more"] }))] }) }))] }, booking._id))) })) }), !loading && filteredBookings.length > 0 && (_jsx("div", { className: "mt-8 text-center", children: _jsxs("button", { onClick: () => (navigate('/search')), className: "bg-[#10b981] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#059669] transition-colors inline-flex items-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.3)]", children: [_jsx("span", { className: "material-symbols-outlined", children: "add" }), "Schedule New Pickup"] }) }))] }));
};
export default History;
