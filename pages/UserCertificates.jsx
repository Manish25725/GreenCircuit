import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import RolePageShell from '../components/RolePageShell.jsx';
import BackButton from '../components/BackButton.jsx';
import Loader from '../components/Loader.jsx';
import { api } from '../services/api.js';
import { useNavigate } from 'react-router-dom';
const UserCertificates = () => {
    const navigate = useNavigate();
    const [completedBookings, setCompletedBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    useEffect(() => {
        (async () => {
            try {
                const response = await api.getUserBookings();
                const bookings = response?.bookings || response || [];
                setCompletedBookings(bookings.filter((b) => b.status === 'completed'));
            }
            catch (error) {
            }
            finally {
                setLoading(false);
            }
        })();
    }, []);
    const getExpiryDate = (issueDate) => {
        const d = new Date(issueDate);
        d.setMonth(d.getMonth() + 6);
        return d;
    };
    const isExpired = (issueDate) => getExpiryDate(issueDate) <= new Date();
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const getFilteredBookings = () => {
        if (filter === 'all')
            return completedBookings;
        return completedBookings.filter((b) => {
            const d = b.completedAt || b.updatedAt || b.scheduledDate;
            return filter === 'active' ? !isExpired(d) : isExpired(d);
        });
    };
    const filteredBookings = getFilteredBookings();
    const getTotalWeight = (b) => b.items?.reduce((s, i) => s + (i.weight || 0), 0) || 0;
    const getWasteTypes = (b) => b.items?.map((i) => i.type).join(', ') || 'E-Waste';
    const handleDownloadCertificate = async (bookingId, certNumber) => {
        try {
            const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please login to download certificates');
                return;
            }
            const response = await fetch(`${API_BASE}/certificates/${bookingId}/download`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) {
                const err = await response.json().catch(() => ({ error: 'Failed to download certificate' }));
                throw new Error(err.error || err.message || 'Failed to download certificate');
            }
            const blob = await response.blob();
            if (blob.size === 0)
                throw new Error('Downloaded file is empty');
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `certificate-${certNumber}.pdf`;
            document.body.appendChild(link);
            link.click();
            setTimeout(() => { document.body.removeChild(link); window.URL.revokeObjectURL(url); }, 100);
        }
        catch (error) {
            alert(error.message || 'Failed to download certificate. Please try again.');
        }
    };
    return (_jsxs(RolePageShell, { role: "resident", children: [_jsx(BackButton, { label: "Back to Dashboard", color: "#10b981", hoverColor: "#059669" }), _jsx("div", { className: "mb-8", children: _jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "p-3 bg-[#10b981]/10 rounded-xl", children: _jsx("span", { className: "material-symbols-outlined text-[#10b981] text-[32px]", children: "workspace_premium" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-3xl sm:text-4xl font-bold text-white", children: "My Certificates" }), _jsx("p", { className: "text-slate-400 text-sm mt-1", children: "Appreciation certificates from agencies" })] })] }), _jsx("div", { className: "flex gap-2", children: ['all', 'active', 'expired'].map((f) => (_jsx("button", { onClick: () => setFilter(f), className: `px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f ? 'bg-[#10b981] text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`, children: f.charAt(0).toUpperCase() + f.slice(1) }, f))) })] }) }), loading ? (_jsx("div", { className: "flex items-center justify-center py-20", children: _jsxs("div", { className: "text-center", children: [_jsx(Loader, { size: "md", color: "#10b981", className: "mb-4" }), _jsx("p", { className: "text-slate-400", children: "Loading certificates..." })] }) })) : filteredBookings.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center py-20", children: [_jsx("div", { className: "w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4", children: _jsx("span", { className: "material-symbols-outlined text-gray-500 text-[48px]", children: "workspace_premium" }) }), _jsx("h3", { className: "text-xl font-semibold text-white mb-2", children: "No certificates yet" }), _jsx("p", { className: "text-slate-400 text-center max-w-md mb-6", children: "Complete e-waste pickups to receive appreciation certificates from agencies" }), _jsxs("button", { onClick: () => (navigate('/search')), className: "px-6 py-3 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-bold transition-colors flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined", children: "add" }), "Schedule a Pickup"] })] })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredBookings.map((booking) => {
                    const issueDate = booking.completedAt || booking.updatedAt || booking.scheduledDate;
                    const expiryDate = getExpiryDate(issueDate);
                    const agencyName = typeof booking.agencyId === 'object' ? booking.agencyId.name : 'Agency';
                    const totalWeight = getTotalWeight(booking);
                    const wasteTypes = getWasteTypes(booking);
                    return (_jsxs("div", { className: "bg-gradient-to-br from-[#151F26] to-[#0B1116] rounded-2xl p-6 border border-white/5 hover:border-[#10b981]/30 transition-all shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_25px_-5px_rgba(16,185,129,0.1)] relative overflow-hidden group cursor-pointer", onClick: () => (navigate(`/certificate?booking=${booking._id}`)), children: [_jsx("div", { className: "absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30", children: isExpired(issueDate) ? 'Expired' : 'Active' }), _jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("div", { className: "size-12 rounded-lg bg-[#10b981]/10 flex items-center justify-center", children: _jsx("span", { className: "material-symbols-outlined text-[#10b981]", children: "recycling" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm text-slate-400", children: "Certified by" }), _jsx("h3", { className: "font-semibold text-white", children: agencyName })] })] }), _jsxs("div", { className: "space-y-3 mb-4", children: [[
                                        ['Certificate No.', booking.bookingId || `#${booking._id?.slice(-6).toUpperCase()}`],
                                        ['Waste Items', wasteTypes.length > 20 ? wasteTypes.substring(0, 20) + '...' : wasteTypes],
                                        ['Total Weight', `${totalWeight.toFixed(1)} kg`],
                                    ].map(([lbl, val]) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-slate-400", children: lbl }), _jsx("span", { className: "text-sm font-medium text-white", children: val })] }, lbl))), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-slate-400", children: "EcoPoints" }), _jsxs("span", { className: "text-sm font-bold text-[#10b981]", children: ["+", booking.ecoPointsEarned || 0] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-slate-400", children: "Issue Date" }), _jsx("span", { className: "text-sm font-medium text-white", children: formatDate(issueDate) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-slate-400", children: "Expiry Date" }), _jsx("span", { className: isExpired(issueDate) ? 'text-sm font-medium text-red-400' : 'text-sm font-medium text-white', children: formatDate(expiryDate.toISOString()) })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: (e) => { e.stopPropagation(); navigate(`/certificate?booking=${booking._id}`); }, className: "flex-1 px-4 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors", children: [_jsx("span", { className: "material-symbols-outlined text-[18px]", children: "visibility" }), "View"] }), _jsx("button", { onClick: (e) => { e.stopPropagation(); handleDownloadCertificate(booking._id, booking.bookingId || booking._id.slice(-6)); }, className: "px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 font-medium text-sm flex items-center justify-center gap-2 transition-colors border border-white/5", children: _jsx("span", { className: "material-symbols-outlined text-[18px]", children: "download" }) })] }), _jsx("div", { className: "absolute -bottom-10 -right-10 w-32 h-32 bg-[#10b981]/5 rounded-full blur-2xl group-hover:bg-[#10b981]/10 transition-all" })] }, booking._id));
                }) }))] }));
};
export default UserCertificates;
