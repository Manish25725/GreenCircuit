import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout.jsx';
import Loader from '../components/Loader.jsx';
import { api, getCurrentUser } from '../services/api.js';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';
// Helper to get user role
const getUserRole = () => {
    try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            const role = user.role?.toLowerCase();
            if (role === 'business')
                return 'Business';
            if (role === 'agency' || role === 'partner')
                return 'Agency';
            if (role === 'admin')
                return 'Admin';
        }
    }
    catch (e) { }
    return 'User';
};
// Helper to get dashboard path based on role
const getDashboardPath = (role) => {
    switch (role) {
        case 'Business': return '/business';
        case 'Agency': return '/agency';
        case 'Admin': return '/admin';
        default: return '/dashboard';
    }
};
const PickupConfirmation = () => {
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const user = getCurrentUser();
    const userRole = getUserRole();
    const dashboardPath = getDashboardPath(userRole);
    const heroRef = useRef(null);
    const cardsRef = useRef(null);
    // Business-specific theme colors
    const isBusiness = userRole === 'Business';
    const primaryColor = isBusiness ? '#3b82f6' : '#34D399';
    const primaryColorLight = isBusiness ? '#60a5fa' : '#6EE7B7';
    const primaryColorDark = isBusiness ? '#2563eb' : '#10b981';
    const brandName = isBusiness ? 'Business' : 'Resident';
    useEffect(() => {
        loadBooking();
    }, []);
    useEffect(() => {
        if (!loading && booking) {
            // GSAP animations after content loads
            const ctx = gsap.context(() => {
                // Animate hero section
                gsap.fromTo('.hero-icon', { scale: 0, rotation: -180 }, { scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.7)' });
                gsap.fromTo('.hero-title', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: 0.3, ease: 'power3.out' });
                gsap.fromTo('.hero-subtitle', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: 0.5, ease: 'power3.out' });
                // Animate cards
                gsap.fromTo('.animate-card', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, delay: 0.6, ease: 'power3.out' });
                // Pulse animation for success icon
                gsap.to('.pulse-ring', {
                    scale: 1.5,
                    opacity: 0,
                    duration: 1.5,
                    repeat: -1,
                    ease: 'power2.out'
                });
                // Floating animation
                gsap.to('.float-element', {
                    y: -10,
                    duration: 2,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut'
                });
            });
            return () => ctx.revert();
        }
    }, [loading, booking]);
    const loadBooking = async () => {
        try {
            const hash = window.location.pathname + window.location.search;
            const params = new URLSearchParams(hash.split('?')[1] || '');
            const bookingId = params.get('booking');
            if (bookingId) {
                const response = await api.getBookingById(bookingId);
                setBooking(response);
            }
            else {
                const activeBooking = await api.getActiveBooking();
                if (activeBooking) {
                    setBooking(activeBooking);
                }
            }
        }
        catch (error) {
        }
        finally {
            setLoading(false);
        }
    };
    const getProgressPercentage = (status) => {
        switch (status) {
            case 'pending': return 25;
            case 'confirmed': return 50;
            case 'collected': return 75;
            case 'completed': return 100;
            default: return 25;
        }
    };
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };
    const formatTime = (time) => {
        if (!time)
            return '';
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes || '00'} ${ampm}`;
    };
    if (loading) {
        return (_jsx(Layout, { title: "", role: userRole, fullWidth: true, hideSidebar: true, children: _jsx("div", { className: "min-h-screen bg-[#0B1116] flex items-center justify-center", children: _jsx(Loader, { size: "lg", color: primaryColor }) }) }));
    }
    return (_jsx(Layout, { title: "", role: userRole, fullWidth: true, hideSidebar: true, children: _jsxs("div", { className: "relative flex min-h-screen w-full flex-col font-display bg-[#0B1116] text-gray-200 selection:bg-[#34D399] selection:text-slate-900 overflow-x-hidden", children: [_jsxs("div", { className: "fixed inset-0 pointer-events-none", children: [_jsx("div", { className: "absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[150px]", style: { backgroundColor: `${primaryColor}10` } }), _jsx("div", { className: "absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[150px]", style: { backgroundColor: isBusiness ? '#8b5cf610' : '#3B82F610' } })] }), _jsxs("div", { className: "w-full flex justify-center fixed top-0 left-0 right-0 z-50", children: [_jsx("div", { className: "absolute inset-0 bg-[#0B1116]/80 backdrop-blur-md border-b border-white/5" }), _jsx("div", { className: "w-full max-w-7xl px-4 sm:px-6 relative z-10", children: _jsxs("header", { className: "flex items-center justify-between h-16 sm:h-20", children: [_jsxs("div", { className: "flex items-center gap-3 cursor-pointer", onClick: () => navigate('/'), children: [_jsx("div", { className: "size-8 sm:size-10 flex items-center justify-center", style: { color: primaryColor }, children: _jsx("svg", { className: "w-full h-full drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]", fill: "none", viewBox: "0 0 48 48", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "3" }) }) }), _jsxs("span", { className: "text-slate-50 text-xl sm:text-2xl font-black tracking-tight", children: ["EcoCycle ", _jsx("span", { className: "font-semibold", style: { color: primaryColor }, children: brandName })] })] }), _jsx("nav", { className: "hidden md:flex items-center gap-8" }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("button", { onClick: () => navigate(dashboardPath), className: "hidden sm:flex h-10 px-5 items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/5 border border-white/5 text-sm font-bold transition-all duration-300 cursor-pointer", children: [_jsx("span", { className: "material-symbols-outlined text-[18px] mr-2", children: "person" }), "Profile"] }), _jsx("button", { onClick: () => navigate('/search'), className: "h-10 px-6 flex items-center justify-center rounded-full text-slate-900 text-sm font-bold transition-all duration-300 transform hover:scale-105 cursor-pointer", style: {
                                                    backgroundColor: primaryColor,
                                                    boxShadow: `0 0 15px ${primaryColor}50`,
                                                }, onMouseEnter: (e) => {
                                                    e.currentTarget.style.backgroundColor = primaryColorLight;
                                                    e.currentTarget.style.boxShadow = `0 0 25px ${primaryColor}80`;
                                                }, onMouseLeave: (e) => {
                                                    e.currentTarget.style.backgroundColor = primaryColor;
                                                    e.currentTarget.style.boxShadow = `0 0 15px ${primaryColor}50`;
                                                }, children: "New Pickup" })] })] }) })] }), _jsx("main", { className: "w-full flex flex-col items-center pt-32 pb-20 relative z-10", children: _jsxs("div", { className: "w-full max-w-4xl px-4 sm:px-6 flex flex-col gap-10", children: [_jsxs("div", { ref: heroRef, className: "flex flex-col items-center gap-6 text-center", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "hero-icon relative flex items-center justify-center size-28 rounded-full bg-gradient-to-br ring-1 transition-all", style: {
                                                    backgroundColor: `${primaryColor}10`,
                                                    boxShadow: `0 0 50px ${primaryColor}30`,
                                                    borderColor: `${primaryColor}30`
                                                }, children: _jsx("span", { className: "material-symbols-outlined text-6xl", style: { color: primaryColor }, children: "check_circle" }) }), _jsx("div", { className: "pulse-ring absolute inset-0 rounded-full border-2", style: { borderColor: `${primaryColor}80` } })] }), _jsxs("div", { className: "flex flex-col items-center gap-3 max-w-xl", children: [_jsx("h1", { className: "hero-title text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight", children: booking?.status === 'completed' ? (_jsxs(_Fragment, { children: ["Pickup ", _jsx("span", { className: "text-transparent bg-clip-text bg-gradient-to-r", style: { backgroundImage: `linear-gradient(to right, ${primaryColor}, ${primaryColorLight})` }, children: "Complete!" })] })) : (_jsxs(_Fragment, { children: ["Booking ", _jsx("span", { className: "text-transparent bg-clip-text bg-gradient-to-r", style: { backgroundImage: `linear-gradient(to right, ${primaryColor}, ${primaryColorLight})` }, children: "Confirmed!" })] })) }), _jsx("p", { className: "hero-subtitle text-slate-400 text-lg sm:text-xl font-light leading-relaxed", children: booking?.status === 'completed'
                                                    ? `${booking?.agency?.name || 'The agency'} has successfully collected your e-waste.`
                                                    : `Your pickup has been scheduled with ${booking?.agency?.name || 'the agency'}.` })] })] }), _jsxs("div", { ref: cardsRef, className: "animate-card group relative rounded-[2rem] bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-white/5 p-8 overflow-hidden transition-all duration-500", style: { boxShadow: `0 20px 40px -15px ${primaryColor}30` }, onMouseEnter: (e) => e.currentTarget.style.boxShadow = `0 20px 40px -15px ${primaryColor}40`, onMouseLeave: (e) => e.currentTarget.style.boxShadow = `0 20px 40px -15px ${primaryColor}30`, children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", style: { backgroundImage: `linear-gradient(to bottom right, ${primaryColor}00, ${primaryColor}10)` } }), _jsx("div", { className: "absolute top-0 right-0 opacity-5", children: _jsx("span", { className: "material-symbols-outlined text-[200px]", style: { color: primaryColor }, children: "eco" }) }), _jsxs("div", { className: "relative z-10 flex flex-col md:flex-row items-center justify-between gap-6", children: [_jsxs("div", { className: "flex flex-col gap-4", children: [_jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-2 rounded-full border w-fit", style: { backgroundColor: `${primaryColor}10`, borderColor: `${primaryColor}20` }, children: [_jsxs("span", { className: "relative flex h-2 w-2", children: [_jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", style: { backgroundColor: primaryColor } }), _jsx("span", { className: "relative inline-flex rounded-full h-2 w-2", style: { backgroundColor: primaryColor } })] }), _jsxs("span", { className: "text-sm font-bold", style: { color: primaryColor }, children: ["+", booking?.pointsEarned || 50, " Eco-Points Earned"] })] }), _jsxs("h3", { className: "text-2xl sm:text-3xl font-bold text-white", children: ["Pickup #", booking?._id?.slice(-6).toUpperCase() || 'XXXXXX'] }), _jsx("p", { className: "text-slate-400 text-base", children: booking?.agency?.name ? (_jsxs(_Fragment, { children: ["Handled by ", _jsx("span", { className: "font-semibold", style: { color: primaryColor }, children: booking.agency.name }), " (Verified Partner)"] })) : ('Pickup scheduled successfully') })] }), _jsx("div", { className: "float-element size-32 rounded-2xl bg-gradient-to-br border flex items-center justify-center", style: {
                                                    backgroundColor: `${primaryColor}05`,
                                                    borderColor: `${primaryColor}20`,
                                                    boxShadow: `0 0 30px ${primaryColor}15`
                                                }, children: _jsx("span", { className: "material-symbols-outlined text-6xl", style: { color: primaryColor }, children: "recycling" }) })] })] }), _jsx("div", { className: "animate-card rounded-[2rem] bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-white/5 p-8", children: _jsxs("div", { className: "flex flex-col gap-4", children: [_jsxs("div", { className: "flex justify-between items-end", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-xl font-bold text-white mb-1", children: "Recycling Process Status" }), _jsxs("p", { className: "text-slate-500 text-sm capitalize", children: ["Current: ", booking?.status || 'pending'] })] }), _jsx("div", { className: "text-right", children: _jsxs("span", { className: "text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r", style: { backgroundImage: `linear-gradient(to right, ${primaryColor}, ${primaryColorLight})` }, children: [getProgressPercentage(booking?.status || 'pending'), "%"] }) })] }), _jsx("div", { className: "relative w-full h-4 rounded-full bg-slate-800 overflow-hidden mt-2", children: _jsx("div", { className: "absolute left-0 top-0 h-full rounded-full bg-gradient-to-r transition-all duration-1000", style: {
                                                    width: `${getProgressPercentage(booking?.status || 'pending')}%`,
                                                    backgroundImage: `linear-gradient(to right, ${primaryColor}, ${primaryColorLight})`,
                                                    boxShadow: `0 0 20px ${primaryColor}50`
                                                } }) }), _jsxs("div", { className: "flex justify-between text-xs font-medium text-slate-500 mt-2", children: [_jsx("span", { style: booking?.status === 'pending' ? { color: primaryColor } : {}, children: "Booked" }), _jsx("span", { style: booking?.status === 'confirmed' ? { color: primaryColor } : {}, children: "Confirmed" }), _jsx("span", { style: booking?.status === 'collected' ? { color: primaryColor } : {}, children: "Collected" }), _jsx("span", { style: booking?.status === 'completed' ? { color: primaryColor } : {}, children: "Complete" })] })] }) }), _jsxs("div", { className: "animate-card grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { className: "group rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-white/5 p-6 transition-all duration-300", onMouseEnter: (e) => e.currentTarget.style.borderColor = `${primaryColor}20`, onMouseLeave: (e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)', children: [_jsxs("div", { className: "flex items-center gap-3 mb-3", children: [_jsx("div", { className: "size-10 rounded-xl flex items-center justify-center", style: { backgroundColor: `${primaryColor}10` }, children: _jsx("span", { className: "material-symbols-outlined text-xl", style: { color: primaryColor }, children: "tag" }) }), _jsx("span", { className: "text-slate-400 text-sm font-medium", children: "Pickup ID" })] }), _jsxs("p", { className: "text-xl font-bold text-white", children: ["#", booking?._id?.slice(-6).toUpperCase() || 'XXXXXX'] })] }), _jsxs("div", { className: "group rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-white/5 p-6 hover:border-[#34D399]/20 transition-all duration-300", children: [_jsxs("div", { className: "flex items-center gap-3 mb-3", children: [_jsx("div", { className: "size-10 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center", children: _jsx("span", { className: "material-symbols-outlined text-[#3B82F6] text-xl", children: "event" }) }), _jsx("span", { className: "text-slate-400 text-sm font-medium", children: "Date & Time" })] }), _jsxs("p", { className: "text-xl font-bold text-white", children: [booking?.date ? formatDate(booking.date) : 'Pending', booking?.slot ? _jsxs("span", { className: "text-slate-400 font-normal text-base ml-2", children: ["\u2022 ", formatTime(booking.slot.startTime)] }) : ''] })] }), _jsxs("div", { className: "group rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-white/5 p-6 transition-all duration-300", onMouseEnter: (e) => e.currentTarget.style.borderColor = `${primaryColor}20`, onMouseLeave: (e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)', children: [_jsxs("div", { className: "flex items-center gap-3 mb-3", children: [_jsx("div", { className: "size-10 rounded-xl bg-[#A855F7]/10 flex items-center justify-center", children: _jsx("span", { className: "material-symbols-outlined text-[#A855F7] text-xl", children: "inventory_2" }) }), _jsx("span", { className: "text-slate-400 text-sm font-medium", children: "Items" })] }), _jsxs("p", { className: "text-xl font-bold text-white", children: [booking?.items?.length || 0, " item(s)", _jsxs("span", { className: "text-slate-400 font-normal text-base ml-2", children: ["\u2022 ", booking?.items?.map(i => i.type).join(', ') || 'N/A'] })] })] }), _jsxs("div", { className: "group rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-white/5 p-6 transition-all duration-300", onMouseEnter: (e) => e.currentTarget.style.borderColor = `${primaryColor}20`, onMouseLeave: (e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)', children: [_jsxs("div", { className: "flex items-center gap-3 mb-3", children: [_jsx("div", { className: "size-10 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center", children: _jsx("span", { className: "material-symbols-outlined text-[#F59E0B] text-xl", children: "pending_actions" }) }), _jsx("span", { className: "text-slate-400 text-sm font-medium", children: "Status" })] }), _jsx("p", { className: "text-xl font-bold capitalize", style: { color: primaryColor }, children: booking?.status || 'Pending' })] })] }), _jsxs("div", { className: "animate-card flex flex-col sm:flex-row gap-4 pt-4", children: [(booking?.status === 'completed' || booking?.status === 'collected') ? (_jsxs("button", { onClick: () => navigate(userRole === 'User' ? `/certificate?booking=${booking._id}` : dashboardPath), className: "relative group flex-1 h-14 rounded-full overflow-hidden cursor-pointer", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r transition-transform duration-300 group-hover:scale-105", style: { backgroundImage: `linear-gradient(to right, ${primaryColor}, ${primaryColorLight})` } }), _jsx("div", { className: "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r", style: { backgroundImage: `linear-gradient(to right, ${primaryColorLight}, ${primaryColor})` } }), _jsxs("div", { className: "relative z-10 flex items-center justify-center gap-2 h-full text-slate-900 font-bold", children: [_jsx("span", { className: "material-symbols-outlined text-xl", children: userRole === 'User' ? 'verified' : 'dashboard' }), userRole === 'User' ? 'View Digital Certificate' : 'Go to Dashboard'] })] })) : (_jsxs("button", { onClick: () => navigate(dashboardPath), className: "relative group flex-1 h-14 rounded-full overflow-hidden cursor-pointer", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r transition-transform duration-300 group-hover:scale-105", style: { backgroundImage: `linear-gradient(to right, ${primaryColor}, ${primaryColorLight})` } }), _jsx("div", { className: "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r", style: { backgroundImage: `linear-gradient(to right, ${primaryColorLight}, ${primaryColor})` } }), _jsxs("div", { className: "relative z-10 flex items-center justify-center gap-2 h-full text-slate-900 font-bold", children: [_jsx("span", { className: "material-symbols-outlined text-xl", children: "dashboard" }), "Go to Dashboard"] })] })), _jsxs("button", { onClick: () => navigate('/search'), className: "flex-1 h-14 rounded-full border border-white/5 bg-white/5 text-white font-bold hover:bg-white/5 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer", children: [_jsx("span", { className: "material-symbols-outlined text-xl", children: "add_circle" }), "Schedule Another Pickup"] })] }), _jsxs("div", { className: "animate-card flex flex-col items-center gap-4 pt-8 pb-4", children: [_jsx("div", { className: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-white/5", children: _jsx("span", { className: "text-slate-500 text-xs font-semibold uppercase tracking-widest", children: "Share Your Impact" }) }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { className: "size-12 rounded-full bg-slate-800/50 border border-white/5 flex items-center justify-center text-slate-400 transition-all duration-300 cursor-pointer", onMouseEnter: (e) => {
                                                    e.currentTarget.style.color = 'white';
                                                    e.currentTarget.style.borderColor = `${primaryColor}30`;
                                                    e.currentTarget.style.backgroundColor = `${primaryColor}10`;
                                                }, onMouseLeave: (e) => {
                                                    e.currentTarget.style.color = 'rgb(148, 163, 184)';
                                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                                                    e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.5)';
                                                }, children: _jsx("span", { className: "text-sm font-bold", children: "X" }) }), _jsx("button", { className: "size-12 rounded-full bg-slate-800/50 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:border-[#3B82F6]/30 hover:bg-[#3B82F6]/10 transition-all duration-300 cursor-pointer", children: _jsx("span", { className: "text-sm font-bold", children: "in" }) }), _jsx("button", { className: "size-12 rounded-full bg-slate-800/50 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:border-[#A855F7]/30 hover:bg-[#A855F7]/10 transition-all duration-300 cursor-pointer", children: _jsx("span", { className: "material-symbols-outlined text-xl", children: "share" }) })] })] })] }) }), _jsx("footer", { className: "mt-auto border-t border-white/5 py-8 relative z-10", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "size-8 text-[#34D399]", children: _jsx("svg", { className: "w-full h-full", fill: "none", viewBox: "0 0 48 48", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "3" }) }) }), _jsx("span", { className: "text-slate-400 text-sm", children: "\u00A9 2024 EcoCycle. Together for a cleaner future." })] }), _jsxs("div", { className: "flex items-center gap-6", children: [_jsx("button", { onClick: () => navigate('/about'), className: "text-slate-500 hover:text-[#34D399] text-sm transition-colors cursor-pointer bg-transparent border-none", children: "About" }), _jsx("button", { onClick: () => navigate('/contact'), className: "text-slate-500 hover:text-[#34D399] text-sm transition-colors cursor-pointer bg-transparent border-none", children: "Contact" }), _jsx("button", { onClick: () => navigate('/how-it-works'), className: "text-slate-500 hover:text-[#34D399] text-sm transition-colors cursor-pointer bg-transparent border-none", children: "Help" })] })] }) })] }) }));
};
export default PickupConfirmation;
