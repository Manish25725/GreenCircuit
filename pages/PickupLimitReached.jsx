import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import Loader from '../components/Loader.jsx';
import { api, getCurrentUser } from '../services/api.js';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';
const PickupLimitReached = () => {
    const navigate = useNavigate();
    const [activeBooking, setActiveBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const user = getCurrentUser();
    useEffect(() => {
        loadActiveBooking();
    }, []);
    useEffect(() => {
        if (!loading && activeBooking) {
            const ctx = gsap.context(() => {
                gsap.fromTo('.limit-icon', { scale: 0, rotation: -180 }, { scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.7)' });
                gsap.fromTo('.limit-title', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: 0.3, ease: 'power3.out' });
                gsap.fromTo('.limit-subtitle', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: 0.5, ease: 'power3.out' });
                gsap.fromTo('.limit-card', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, delay: 0.6, ease: 'power3.out' });
                gsap.to('.pulse-ring-limit', {
                    scale: 1.5,
                    opacity: 0,
                    duration: 1.5,
                    repeat: -1,
                    ease: 'power2.out'
                });
            });
            return () => ctx.revert();
        }
    }, [loading, activeBooking]);
    const loadActiveBooking = async () => {
        try {
            const response = await api.getUserBookings();
            const bookingsData = response;
            const bookings = bookingsData?.bookings || bookingsData || [];
            const active = bookings.find((b) => b.status === 'pending' || b.status === 'confirmed' || b.status === 'in-progress');
            if (active) {
                setActiveBooking(active);
            }
        }
        catch (error) {
        }
        finally {
            setLoading(false);
        }
    };
    if (loading) {
        return (_jsx(Layout, { title: "", role: "User", fullWidth: true, hideSidebar: true, children: _jsx("div", { className: "min-h-screen bg-[#0B1116] flex items-center justify-center", children: _jsx(Loader, { size: "lg", color: "#f59e0b" }) }) }));
    }
    return (_jsx(Layout, { title: "", role: "User", fullWidth: true, hideSidebar: true, children: _jsxs("div", { className: "relative flex min-h-screen w-full flex-col font-display bg-[#0B1116] text-gray-200 selection:bg-[#f59e0b] selection:text-slate-900 overflow-x-hidden", children: [_jsxs("div", { className: "fixed inset-0 pointer-events-none", children: [_jsx("div", { className: "absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#f59e0b]/5 rounded-full blur-[150px]" }), _jsx("div", { className: "absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#ef4444]/5 rounded-full blur-[150px]" })] }), _jsx("div", { className: "w-full flex justify-center fixed top-0 left-0 right-0 z-50", children: _jsx("header", { className: "flex items-center justify-between w-full max-w-7xl px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-xl border-b border-white/5", children: _jsxs("div", { className: "flex items-center gap-3 cursor-pointer", onClick: () => navigate('/'), children: [_jsx("div", { className: "p-2 bg-[#10b981]/10 rounded-xl", children: _jsx("svg", { className: "h-6 w-6 text-[#10b981]", fill: "currentColor", viewBox: "0 0 48 48", children: _jsx("path", { d: "M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" }) }) }), _jsxs("span", { className: "text-xl font-bold text-white tracking-tight", children: ["EcoCycle ", _jsx("span", { className: "text-[#10b981] font-semibold", children: "Resident" })] })] }) }) }), _jsx("main", { className: "flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-12 relative z-10", children: _jsxs("div", { className: "w-full max-w-2xl mx-auto text-center", children: [_jsxs("div", { className: "relative mb-8 limit-icon", children: [_jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: _jsx("div", { className: "w-32 h-32 rounded-full bg-[#f59e0b]/20 pulse-ring-limit" }) }), _jsx("div", { className: "relative w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-[#f59e0b] to-[#ef4444] flex items-center justify-center shadow-[0_0_60px_rgba(245,158,11,0.4)]", children: _jsx("span", { className: "material-symbols-outlined text-5xl text-white", children: "hourglass_top" }) })] }), _jsx("h1", { className: "text-4xl sm:text-5xl font-black text-white mb-4 limit-title tracking-tight", children: "Pickup In Progress" }), _jsx("p", { className: "text-lg text-slate-400 mb-10 max-w-lg mx-auto limit-subtitle", children: "You already have an active pickup request. Please wait for it to be completed before scheduling a new one." }), activeBooking && (_jsxs("div", { className: "limit-card bg-[#151F32]/80 backdrop-blur-sm rounded-2xl p-6 border border-white/5 shadow-xl mb-8", children: [_jsxs("div", { className: "flex items-center gap-4 mb-6", children: [_jsx("div", { className: "w-14 h-14 rounded-xl bg-[#f59e0b]/10 flex items-center justify-center", children: _jsx("span", { className: "material-symbols-outlined text-2xl text-[#f59e0b]", children: "local_shipping" }) }), _jsxs("div", { className: "text-left", children: [_jsx("h3", { className: "text-xl font-bold text-white", children: activeBooking.bookingId || `#REQ-${activeBooking._id?.slice(-6).toUpperCase()}` }), _jsx("p", { className: "text-slate-400 text-sm", children: "Current Active Pickup" })] }), _jsx("div", { className: "ml-auto", children: _jsx("span", { className: `px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider ${activeBooking.status === 'pending' ? 'bg-[#94a3b8]/10 text-[#94a3b8] border border-[#94a3b8]/20' :
                                                        activeBooking.status === 'confirmed' ? 'bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20' :
                                                            'bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20'}`, children: activeBooking.status }) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4 text-left", children: [_jsxs("div", { className: "bg-white/5 rounded-xl p-4", children: [_jsx("p", { className: "text-slate-500 text-xs uppercase tracking-wider mb-1", children: "Scheduled Date" }), _jsx("p", { className: "text-white font-semibold", children: activeBooking.scheduledDate ? new Date(activeBooking.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD' })] }), _jsxs("div", { className: "bg-white/5 rounded-xl p-4", children: [_jsx("p", { className: "text-slate-500 text-xs uppercase tracking-wider mb-1", children: "Time Slot" }), _jsx("p", { className: "text-white font-semibold", children: activeBooking.scheduledTime || 'TBD' })] }), _jsxs("div", { className: "bg-white/5 rounded-xl p-4 col-span-2", children: [_jsx("p", { className: "text-slate-500 text-xs uppercase tracking-wider mb-1", children: "Agency" }), _jsx("p", { className: "text-white font-semibold", children: typeof activeBooking.agencyId === 'object' ? activeBooking.agencyId.name : 'Assigned Agency' })] })] }), _jsxs("div", { className: "mt-6", children: [_jsxs("div", { className: "flex justify-between text-xs text-slate-500 mb-2", children: [_jsx("span", { children: "Progress" }), _jsx("span", { className: "text-[#f59e0b]", children: activeBooking.status === 'pending' ? '25%' :
                                                            activeBooking.status === 'confirmed' ? '50%' : '75%' })] }), _jsx("div", { className: "h-2 bg-white/5 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-gradient-to-r from-[#f59e0b] to-[#ef4444] rounded-full transition-all duration-500", style: {
                                                        width: activeBooking.status === 'pending' ? '25%' :
                                                            activeBooking.status === 'confirmed' ? '50%' : '75%'
                                                    } }) })] })] })), !activeBooking && (_jsxs("div", { className: "limit-card bg-[#151F32]/80 backdrop-blur-sm rounded-2xl p-8 border border-white/5 shadow-xl mb-8 text-center", children: [_jsx("div", { className: "w-16 h-16 mx-auto mb-4 rounded-full bg-[#10b981]/10 flex items-center justify-center", children: _jsx("span", { className: "material-symbols-outlined text-3xl text-[#10b981]", children: "check_circle" }) }), _jsx("h3", { className: "text-xl font-bold text-white mb-2", children: "No Active Pickups" }), _jsx("p", { className: "text-slate-400", children: "You can schedule a new pickup now!" })] })), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center limit-card", children: [_jsxs("button", { onClick: () => navigate('/dashboard'), className: "group relative overflow-hidden px-8 py-4 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#ef4444] text-white font-bold shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_50px_rgba(245,158,11,0.5)] transition-all", children: [_jsx("div", { className: "absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" }), _jsxs("span", { className: "relative flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined", children: "dashboard" }), "Track Your Pickup"] })] }), _jsx("button", { onClick: () => navigate('/'), className: "px-8 py-4 rounded-xl bg-white/5 text-white font-bold border border-white/5 hover:bg-white/5 hover:border-white/20 transition-all", children: _jsxs("span", { className: "flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined", children: "home" }), "Back to Home"] }) })] }), _jsx("div", { className: "limit-card mt-10 p-6 bg-[#f59e0b]/5 border border-[#f59e0b]/20 rounded-2xl text-left", children: _jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-[#f59e0b]/10 flex items-center justify-center shrink-0", children: _jsx("span", { className: "material-symbols-outlined text-[#f59e0b]", children: "info" }) }), _jsxs("div", { children: [_jsx("h4", { className: "text-white font-bold mb-1", children: "Why the limit?" }), _jsx("p", { className: "text-slate-400 text-sm leading-relaxed", children: "To ensure the best service quality and timely pickups, we allow one active pickup request at a time. Once your current pickup is completed, you'll be able to schedule a new one immediately." })] })] }) })] }) })] }) }));
};
export default PickupLimitReached;
