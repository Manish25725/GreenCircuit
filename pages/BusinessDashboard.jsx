import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import Loader from '../components/Loader.jsx';
import { api, getCurrentUser } from '../services/api.js';
import NotificationBell from '../components/NotificationBell.jsx';
import { useNavigate } from 'react-router-dom';
const BusinessDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(getCurrentUser());
    const [avatarKey, setAvatarKey] = useState(Date.now());
    const [activeBookings, setActiveBookings] = useState([]);
    const [allBookings, setAllBookings] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAllBookings, setShowAllBookings] = useState(false);
    const [cancelling, setCancelling] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(null);
    const [showDebug, setShowDebug] = useState(false);
    const [debugInfo, setDebugInfo] = useState(null);
    const [stats, setStats] = useState({
        totalRecycled: 0,
        co2Offset: 0,
        costSavings: 0,
        totalBookings: 0
    });
    useEffect(() => {
        loadBusinessData();
        // Listen for user updates (avatar/logo changes)
        const handleUserUpdate = async () => {
            // Fetch fresh data from API instead of using localStorage
            try {
                const userData = await api.getMe();
                // Fetch business profile to get logo
                try {
                    const businessResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/business/profile`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    if (businessResponse.ok) {
                        const result = await businessResponse.json();
                        const businessData = result.data || result;
                        userData.logo = businessData.logo;
                    }
                }
                catch (err) {
                }
                setUser(userData);
                setAvatarKey(Date.now());
                localStorage.setItem('user', JSON.stringify(userData));
            }
            catch (error) {
            }
        };
        window.addEventListener('userUpdated', handleUserUpdate);
        return () => {
            window.removeEventListener('userUpdated', handleUserUpdate);
        };
    }, []);
    const loadBusinessData = async () => {
        try {
            // Try to get fresh user data from API
            const userData = await api.getMe();
            // Fetch business profile to get logo
            try {
                const businessResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/business/profile`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (businessResponse.ok) {
                    const result = await businessResponse.json();
                    const businessData = result.data || result;
                    // Merge business logo into user data
                    userData.logo = businessData.logo;
                }
            }
            catch (err) {
            }
            setUser(userData);
            setAvatarKey(Date.now());
            localStorage.setItem('user', JSON.stringify(userData));
            setStats({
                totalRecycled: userData.totalWasteRecycled || 0,
                co2Offset: (userData.totalWasteRecycled || 0) * 2.5,
                costSavings: (userData.totalWasteRecycled || 0) * 15, // Estimated cost savings
                totalBookings: userData.totalBookings || 0
            });
            // Get user bookings
            try {
                const bookingsData = await api.getUserBookings();
                const bookings = bookingsData.bookings || bookingsData || [];
                setAllBookings(bookings);
                // Find ALL active/in-progress bookings
                const active = bookings.filter((b) => b.status === 'pending' || b.status === 'confirmed' || b.status === 'in-progress');
                setActiveBookings(active || []);
            }
            catch (e) {
            }
            // Get recent certificates
            try {
                const certsData = await api.getBusinessCertificates({ page: 1, limit: 3 });
                // Store for debug panel
                setDebugInfo({
                    timestamp: new Date().toISOString(),
                    response: certsData,
                    user: { id: userData._id, email: userData.email, role: userData.role }
                });
                // Handle multiple response formats
                let certs = [];
                if (Array.isArray(certsData)) {
                    certs = certsData;
                }
                else if (certsData?.data?.certificates) {
                    certs = certsData.data.certificates;
                }
                else if (certsData?.certificates) {
                    certs = certsData.certificates;
                }
                else if (certsData?.data && Array.isArray(certsData.data)) {
                    certs = certsData.data;
                }
                setCertificates(certs);
            }
            catch (e) {
                setDebugInfo({
                    timestamp: new Date().toISOString(),
                    error: e.message,
                    errorResponse: e.response?.data,
                    user: { id: userData._id, email: userData.email, role: userData.role }
                });
            }
        }
        catch (error) {
        }
        finally {
            setLoading(false);
        }
    };
    const handleCancelBooking = async (bookingId) => {
        setCancelling(bookingId);
        try {
            await api.cancelBooking(bookingId);
            await loadBusinessData();
            setShowCancelModal(null);
        }
        catch (error) {
            alert('Failed to cancel booking. Please try again.');
        }
        finally {
            setCancelling(null);
        }
    };
    const handleLogout = () => {
        api.logout();
        navigate('/login');
    };
    const formatDate = (date) => {
        if (date) {
            return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        }
        return new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };
    const formatTime = (time) => {
        if (!time)
            return 'TBD';
        return time;
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'text-[#06b6d4] bg-[#06b6d4]/10 border-[#06b6d4]/20';
            case 'in-progress': return 'text-[#8b5cf6] bg-[#8b5cf6]/10 border-[#8b5cf6]/20';
            case 'confirmed': return 'text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/20';
            case 'pending': return 'text-[#94a3b8] bg-[#94a3b8]/10 border-[#94a3b8]/20';
            case 'cancelled': return 'text-red-400 bg-red-500/10 border-red-500/20';
            default: return 'text-[#94a3b8] bg-[#94a3b8]/10 border-[#94a3b8]/20';
        }
    };
    const getTrackingSteps = (booking) => {
        if (!booking)
            return [];
        const steps = [
            { key: 'pending', label: 'Request Submitted', icon: 'check', message: `Disposal request ${booking.bookingId || '#REQ'} was submitted.` },
            { key: 'confirmed', label: 'Agency Assigned', icon: 'verified', message: `${typeof booking.agencyId === 'object' ? booking.agencyId.name : 'Agency'} will handle your pickup.` },
            { key: 'in-progress', label: 'Collection Scheduled', icon: 'local_shipping', message: 'Collection vehicle dispatched to your facility.' },
            { key: 'completed', label: 'Disposal Completed', icon: 'task_alt', message: 'E-waste disposed with compliance certificate issued.' },
        ];
        const statusOrder = ['pending', 'confirmed', 'in-progress', 'completed'];
        const currentIndex = statusOrder.indexOf(booking.status);
        return steps.map((step, index) => ({
            ...step,
            completed: index < currentIndex,
            current: index === currentIndex,
            pending: index > currentIndex
        }));
    };
    return (_jsxs(Layout, { title: "", role: "Business", fullWidth: true, hideSidebar: true, children: [_jsx("div", { className: "bg-[#0B1116] font-sans text-gray-200 antialiased selection:bg-[#06b6d4] selection:text-white min-h-screen", children: _jsxs("div", { className: "relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden", children: [_jsx("div", { className: "fixed top-0 left-0 w-full h-[500px] bg-[#06b6d4]/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" }), _jsx("div", { className: "fixed bottom-0 right-0 w-full h-[500px] bg-[#8b5cf6]/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none" }), _jsxs("div", { className: "layout-container flex h-full grow flex-col relative z-10", children: [_jsxs("header", { className: "flex items-center justify-between whitespace-nowrap border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 transition-all duration-300", children: [_jsxs("div", { className: "flex items-center gap-3 text-white cursor-pointer", onClick: () => navigate('/'), children: [_jsx("div", { className: "p-2 bg-[#06b6d4]/10 rounded-lg", children: _jsx("svg", { className: "h-6 w-6 text-[#06b6d4]", fill: "currentColor", viewBox: "0 0 48 48", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" }) }) }), _jsxs("h2", { className: "text-xl font-bold tracking-tight text-white", children: ["EcoCycle ", _jsx("span", { className: "text-[#06b6d4]", children: "Business" })] })] }), _jsx("nav", { className: "hidden md:flex flex-1 justify-center gap-1" }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "relative group", children: [_jsxs("button", { onClick: () => navigate('/profile'), className: "hidden sm:flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-[#151F26] border border-white/5 hover:bg-white/5 transition-colors cursor-pointer", children: [_jsx("div", { className: "size-8 rounded-full ring-2 ring-white/10 group-hover:ring-[#06b6d4]/50 transition-all overflow-hidden bg-[#06b6d4] flex items-center justify-center", children: user?.logo || user?.avatar ? (_jsx("img", { src: `${user?.logo || user?.avatar}?t=${avatarKey}`, alt: "Profile", className: "w-full h-full object-cover", onError: (e) => {
                                                                            e.currentTarget.style.display = 'none';
                                                                            e.currentTarget.parentElement.innerHTML = `<span class="text-white text-xs font-bold">${(user?.name || user?.companyName || 'B').charAt(0).toUpperCase()}</span>`;
                                                                        } })) : (_jsx("span", { className: "text-white text-xs font-bold", children: (user?.name || user?.companyName || 'B').charAt(0).toUpperCase() })) }), _jsx("span", { className: "text-sm font-medium text-gray-200", children: user?.name || user?.companyName || 'Business' })] }), _jsx("div", { className: "absolute top-14 right-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100]", children: _jsx("div", { className: "bg-[#151F26] border border-white/5 rounded-2xl p-4 shadow-2xl", children: _jsx("div", { className: "size-32 rounded-xl ring-4 ring-[#06b6d4]/30 overflow-hidden bg-[#06b6d4] flex items-center justify-center", children: user?.logo || user?.avatar ? (_jsx("img", { src: `${user?.logo || user?.avatar}?t=${avatarKey}`, alt: "Profile", className: "w-full h-full object-cover" })) : (_jsx("span", { className: "text-white text-4xl font-bold", children: (user?.name || user?.companyName || 'B').charAt(0).toUpperCase() })) }) }) })] }), _jsx(NotificationBell, {}), _jsx("button", { onClick: handleLogout, className: "p-2.5 rounded-full bg-[#151F26] border border-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors", title: "Logout", children: _jsx("span", { className: "material-symbols-outlined text-[20px]", children: "logout" }) })] })] }), _jsx("main", { className: "flex flex-1 justify-center py-5 mt-24", children: _jsxs("div", { className: "layout-content-container flex flex-col w-full max-w-7xl px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "flex flex-col md:flex-row justify-between items-end gap-6 py-8", children: [_jsxs("div", { children: [_jsx("p", { className: "text-[#06b6d4] text-sm font-bold uppercase tracking-widest mb-2", children: "Business Portal" }), _jsxs("h1", { className: "text-white text-4xl sm:text-5xl font-black leading-tight tracking-tighter mb-2 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent", children: ["Welcome, ", user?.name?.split(' ')[0] || 'Business', "!"] }), _jsx("p", { className: "text-[#94a3b8] text-lg", children: "Manage your corporate e-waste disposal efficiently." })] }), _jsxs("div", { className: "flex items-center gap-3 bg-[#151F26]/50 p-1.5 pr-4 rounded-full border border-white/5 backdrop-blur-sm", children: [_jsx("div", { className: "bg-[#06b6d4]/20 p-2 rounded-full text-[#06b6d4]", children: _jsx("span", { className: "material-symbols-outlined text-lg", children: "calendar_today" }) }), _jsx("span", { className: "text-sm font-medium text-gray-200", children: formatDate() })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-8", children: [_jsxs("div", { className: "lg:col-span-8 flex flex-col gap-8", children: [_jsxs("section", { className: "flex flex-col gap-5", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h2", { className: "text-white text-2xl font-bold tracking-tight flex items-center gap-3", children: [_jsx("span", { className: "p-2 bg-[#8b5cf6]/10 rounded-lg text-[#8b5cf6]", children: _jsx("span", { className: "material-symbols-outlined", children: "local_shipping" }) }), activeBookings.length > 0 ? `Active Disposals (${activeBookings.length})` : 'Disposal Status'] }), activeBookings.length > 0 && (_jsx("span", { className: "px-3 py-1 rounded-full bg-[#8b5cf6]/10 text-[#8b5cf6] text-xs font-bold uppercase tracking-wider border border-[#8b5cf6]/20 animate-pulse", children: "Live" }))] }), _jsxs("div", { className: "bg-[#151F26] rounded-2xl p-6 sm:p-10 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3),0_4px_6px_-4px_rgba(0,0,0,0.2),inset_0_1px_0_0_rgba(255,255,255,0.05)] border border-white/5 relative overflow-hidden group", children: [_jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-[#8b5cf6]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" }), loading ? (_jsx("div", { className: "flex items-center justify-center py-12", children: _jsx(Loader, { size: "md", color: "#06b6d4" }) })) : activeBookings.length > 0 ? (_jsx("div", { className: "space-y-6", children: activeBookings.map((booking, bookingIndex) => (_jsxs("div", { className: `${bookingIndex > 0 ? 'pt-6 border-t border-white/5' : ''}`, children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 rounded-lg bg-[#8b5cf6]/10", children: _jsx("span", { className: "material-symbols-outlined text-[#8b5cf6]", children: "inventory_2" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-white font-bold", children: booking.bookingId || `#DSP-${booking._id?.slice(-6).toUpperCase()}` }), _jsxs("p", { className: "text-slate-400 text-sm", children: [formatDate(booking.scheduledDate), " \u2022 ", formatTime(booking.scheduledTime)] })] })] }), _jsx("span", { className: `text-[10px] font-bold uppercase px-3 py-1.5 rounded-full border ${getStatusColor(booking.status)}`, children: booking.status })] }), _jsxs("div", { className: "relative flex flex-col", children: [_jsx("div", { className: "absolute left-[23px] top-6 bottom-12 w-0.5 bg-gray-800 rounded-full" }), _jsx("div", { className: "absolute left-[23px] top-6 w-0.5 bg-gradient-to-b from-[#06b6d4] via-[#06b6d4] to-[#8b5cf6] rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]", style: { height: `${Math.min(getTrackingSteps(booking).filter(s => s.completed || s.current).length / getTrackingSteps(booking).length * 100, 75)}%` } }), getTrackingSteps(booking).map((step, index) => (_jsxs("div", { className: `relative flex gap-6 ${index < 3 ? 'pb-8' : ''} group/step ${step.pending ? 'opacity-50 hover:opacity-100 transition-opacity duration-300' : ''}`, children: [_jsxs("div", { className: `z-10 shrink-0 ${step.current ? 'relative' : ''}`, children: [step.current && (_jsx("div", { className: "absolute inset-0 -m-2 rounded-full border-2 border-[#8b5cf6]/30 animate-pulse" })), _jsx("div", { className: `flex size-10 items-center justify-center rounded-full text-white ring-4 ring-[#151F26] transition-transform duration-500 group-hover/step:scale-110 ${step.completed ? 'bg-[#06b6d4] shadow-[0_0_15px_rgba(6,182,212,0.4)]' :
                                                                                                                        step.current ? 'bg-[#8b5cf6] shadow-[0_0_25px_rgba(139,92,246,0.6)]' :
                                                                                                                            'bg-[#151F26] border-2 border-dashed border-gray-600 text-gray-500'}`, children: _jsx("span", { className: `material-symbols-outlined text-lg ${step.current ? 'animate-bounce' : ''}`, children: step.icon }) })] }), _jsxs("div", { className: "flex-1 pt-1", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1", children: [_jsx("h3", { className: `text-base font-bold group-hover/step:text-[#06b6d4] transition-colors ${step.completed || step.current ? 'text-white' : 'text-gray-500'}`, children: step.label }), _jsx("span", { className: `w-fit text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${step.completed ? 'text-[#06b6d4] bg-[#06b6d4]/10 border-[#06b6d4]/20' :
                                                                                                                                step.current ? 'text-[#8b5cf6] bg-[#8b5cf6]/10 border-[#8b5cf6]/20' :
                                                                                                                                    'text-gray-500 bg-gray-800 border-gray-700'}`, children: step.completed ? 'Completed' : step.current ? 'In Progress' : 'Pending' })] }), _jsx("p", { className: `text-sm ${step.completed || step.current ? 'text-[#94a3b8]' : 'text-gray-600'}`, children: step.message })] })] }, step.key)))] }), _jsxs("div", { className: "mt-4 p-3 bg-white/5 rounded-lg border border-white/5 flex items-center gap-3", children: [_jsx("div", { className: "size-10 rounded-full bg-gray-800 flex items-center justify-center shrink-0 border border-white/5", children: _jsx("span", { className: "material-symbols-outlined text-slate-400 text-sm", children: "business" }) }), _jsxs("div", { className: "overflow-hidden", children: [_jsx("p", { className: "text-xs text-slate-400 truncate", children: "Disposal Partner" }), _jsx("p", { className: "text-sm font-semibold text-white truncate", children: typeof booking.agencyId === 'object' ? booking.agencyId.name : 'Partner Assigned' })] })] }), (booking.status === 'pending' || booking.status === 'confirmed') && (_jsxs("button", { onClick: () => setShowCancelModal(booking._id), className: "mt-4 w-full py-3 px-4 rounded-xl bg-red-500/10 text-red-400 font-medium border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/30 transition-all flex items-center justify-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-lg", children: "cancel" }), "Cancel Request"] }))] }, booking._id))) })) : (
                                                                            /* No Active Booking - Show call to action */
                                                                            _jsxs("div", { className: "text-center py-8", children: [_jsx("div", { className: "p-4 bg-[#06b6d4]/10 rounded-full w-fit mx-auto mb-4", children: _jsx("span", { className: "material-symbols-outlined text-4xl text-[#06b6d4]", children: "delete_sweep" }) }), _jsx("h3", { className: "text-xl font-bold text-white mb-2", children: "No Active Disposals" }), _jsx("p", { className: "text-[#94a3b8] mb-6 max-w-md mx-auto", children: "Schedule a pickup to dispose of your corporate e-waste compliantly and get certificates." }), _jsxs("button", { onClick: () => navigate('/search'), className: "bg-[#06b6d4] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#0891b2] transition-colors inline-flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined", children: "add" }), "Schedule Disposal"] })] }))] })] }), allBookings.length > 0 && (_jsxs("section", { className: "flex flex-col gap-5", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h2", { className: "text-white text-2xl font-bold tracking-tight flex items-center gap-3", children: [_jsx("span", { className: "p-2 bg-amber-500/10 rounded-lg text-amber-400", children: _jsx("span", { className: "material-symbols-outlined", children: "history" }) }), "Disposal History (", allBookings.length, ")"] }), _jsxs("button", { onClick: () => setShowAllBookings(!showAllBookings), className: "text-sm text-[#94a3b8] hover:text-white transition-colors flex items-center gap-1", children: [showAllBookings ? 'Show Less' : 'View All', _jsx("span", { className: "material-symbols-outlined text-lg", children: showAllBookings ? 'expand_less' : 'expand_more' })] })] }), _jsxs("div", { className: "bg-[#151F26] rounded-2xl p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] border border-white/5", children: [_jsx("div", { className: "space-y-3", children: (showAllBookings ? allBookings : allBookings.slice(0, 5)).map(booking => (_jsxs("div", { className: "flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/5 hover:border-white/5 transition-all group", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: `p-3 rounded-xl ${getStatusColor(booking.status)}`, children: _jsx("span", { className: "material-symbols-outlined", children: booking.status === 'completed' ? 'check_circle' :
                                                                                                            booking.status === 'cancelled' ? 'cancel' :
                                                                                                                booking.status === 'in-progress' ? 'local_shipping' :
                                                                                                                    booking.status === 'confirmed' ? 'verified' : 'pending' }) }), _jsxs("div", { children: [_jsx("p", { className: "text-white font-bold", children: booking.bookingId || `#DSP-${booking._id?.slice(-6).toUpperCase()}` }), _jsxs("div", { className: "flex items-center gap-2 text-[#94a3b8] text-sm", children: [_jsx("span", { children: formatDate(booking.scheduledDate) }), _jsx("span", { children: "\u2022" }), _jsx("span", { children: formatTime(booking.scheduledTime) })] }), _jsx("p", { className: "text-gray-500 text-xs mt-1", children: typeof booking.agencyId === 'object' ? booking.agencyId.name : 'Partner Assigned' })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: `text-xs font-bold uppercase px-3 py-1.5 rounded-full border ${getStatusColor(booking.status)}`, children: booking.status }), _jsx("span", { className: "material-symbols-outlined text-gray-500 group-hover:text-white transition-colors", children: "chevron_right" })] })] }, booking._id))) }), !showAllBookings && allBookings.length > 5 && (_jsxs("button", { onClick: () => setShowAllBookings(true), className: "w-full mt-4 py-3 text-center text-[#94a3b8] hover:text-white text-sm font-medium border border-white/5 rounded-xl hover:bg-white/5 transition-all", children: ["Show ", allBookings.length - 5, " more records"] }))] })] })), _jsxs("section", { className: "flex flex-col gap-5", children: [_jsxs("h2", { className: "text-white text-2xl font-bold tracking-tight flex items-center gap-3", children: [_jsx("span", { className: "p-2 bg-[#06b6d4]/10 rounded-lg text-[#06b6d4]", children: _jsx("span", { className: "material-symbols-outlined", children: "analytics" }) }), "Business Impact"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-[#151F26] rounded-2xl p-6 shadow-[0_4px_12px_0_rgba(0,0,0,0.07)] flex flex-col justify-between border border-white/5 hover:border-white/5 transition-colors relative overflow-hidden group", children: [_jsx("div", { className: "absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity", children: _jsx("span", { className: "material-symbols-outlined text-8xl text-white", children: "scale" }) }), _jsxs("div", { children: [_jsx("div", { className: "flex items-center gap-2 text-[#94a3b8] mb-3", children: _jsx("span", { className: "text-sm font-semibold uppercase tracking-wider", children: "Total Disposed" }) }), _jsxs("p", { className: "text-white text-5xl font-black leading-none tracking-tight", children: [user?.totalWasteRecycled?.toFixed(1) || '0', " ", _jsx("span", { className: "text-2xl font-medium text-gray-500", children: "kg" })] })] }), _jsxs("div", { className: "mt-8", children: [_jsxs("div", { className: "flex justify-between text-xs font-medium text-slate-400 mb-2", children: [_jsx("span", { children: "Quarterly Target" }), _jsxs("span", { children: [Math.min(Math.round((user?.totalWasteRecycled || 0) / 500 * 100), 100), "% Complete"] })] }), _jsx("div", { className: "w-full bg-gray-800 rounded-full h-3 overflow-hidden", children: _jsx("div", { className: "bg-gradient-to-r from-[#06b6d4]/50 to-[#06b6d4] h-3 rounded-full relative", style: { width: `${Math.min((user?.totalWasteRecycled || 0) / 5, 100)}%` }, children: _jsx("div", { className: "absolute inset-0 bg-white/20 animate-pulse" }) }) })] })] }), _jsxs("div", { className: "bg-[#151F26] rounded-2xl p-6 shadow-[0_4px_12px_0_rgba(0,0,0,0.07)] flex flex-col justify-between border border-white/5 hover:border-white/5 transition-colors relative overflow-hidden group", children: [_jsx("div", { className: "absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity", children: _jsx("span", { className: "material-symbols-outlined text-8xl text-white", children: "savings" }) }), _jsxs("div", { children: [_jsx("div", { className: "flex items-center gap-2 text-[#94a3b8] mb-3", children: _jsx("span", { className: "text-sm font-semibold uppercase tracking-wider", children: "Cost Savings" }) }), _jsxs("p", { className: "text-white text-5xl font-black leading-none tracking-tight", children: ["\u20B9", stats.costSavings.toLocaleString(), " ", _jsx("span", { className: "text-2xl font-medium text-gray-500" })] })] }), _jsxs("div", { className: "mt-8", children: [_jsxs("div", { className: "flex justify-between text-xs font-medium text-slate-400 mb-2", children: [_jsx("span", { children: "vs Traditional Disposal" }), _jsx("span", { className: "text-[#06b6d4]", children: "+32% Saved" })] }), _jsx("div", { className: "w-full bg-gray-800 rounded-full h-3 overflow-hidden", children: _jsx("div", { className: "bg-gradient-to-r from-[#8b5cf6]/50 to-[#8b5cf6] h-3 rounded-full relative", style: { width: '68%' }, children: _jsx("div", { className: "absolute inset-0 bg-white/20 animate-pulse" }) }) })] })] })] })] })] }), _jsxs("div", { className: "lg:col-span-4 flex flex-col gap-8", children: [_jsxs("div", { className: "bg-gradient-to-b from-[#151F26] to-[#0B1116] rounded-2xl p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] flex flex-col items-center text-center border border-white/5 relative overflow-hidden", children: [_jsx("div", { className: "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#06b6d4] via-[#8b5cf6] to-[#06b6d4]" }), _jsx("div", { className: "absolute top-1/2 left-1/2 w-32 h-32 bg-[#06b6d4]/20 rounded-full blur-[60px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" }), _jsx("p", { className: "text-sm font-bold uppercase tracking-widest text-[#94a3b8] z-10", children: "Compliance Score" }), _jsxs("div", { className: "my-8 flex items-center justify-center relative z-10 group cursor-default", children: [_jsx("svg", { className: "h-16 w-16 text-[#06b6d4] drop-shadow-[0_0_15px_rgba(6,182,212,0.5)] group-hover:scale-110 transition-transform duration-300", fill: "none", stroke: "currentColor", strokeWidth: "1.5", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z", strokeLinecap: "round", strokeLinejoin: "round" }) }), _jsx("span", { className: "text-7xl font-black text-white ml-2 drop-shadow-sm tracking-tighter", children: "98%" })] }), _jsx("p", { className: "text-sm text-slate-400 max-w-[200px] z-10", children: "Excellent! Your e-waste disposal meets all regulatory requirements." }), _jsxs("button", { className: "mt-8 w-full group relative overflow-hidden rounded-xl bg-[#06b6d4] text-white font-bold h-12 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all z-10 cursor-pointer", onClick: () => navigate('/business/certificates'), children: [_jsx("div", { className: "absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" }), _jsxs("span", { className: "relative flex items-center justify-center gap-2", children: ["View Certificates", _jsx("span", { className: "material-symbols-outlined text-lg", children: "arrow_forward" })] })] })] }), _jsxs("div", { className: "bg-[#151F26] rounded-2xl p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] border border-white/5", children: [_jsxs("h2", { className: "text-white text-lg font-bold tracking-tight pb-4 flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-slate-400", children: "bolt" }), "Quick Actions"] }), _jsxs("div", { className: "flex flex-col gap-3", children: [_jsxs("button", { onClick: () => navigate('/search'), className: "flex w-full group cursor-pointer items-center justify-between overflow-hidden rounded-xl h-14 px-4 bg-white/5 text-gray-200 border border-white/5 hover:bg-white/5 hover:border-white/5 transition-all", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "size-8 rounded-lg bg-[#06b6d4]/20 text-[#06b6d4] flex items-center justify-center", children: _jsx("span", { className: "material-symbols-outlined text-xl", children: "add" }) }), _jsx("span", { className: "font-medium", children: "New Disposal Request" })] }), _jsx("span", { className: "material-symbols-outlined text-gray-500 group-hover:text-white transition-colors", children: "chevron_right" })] }), _jsxs("button", { onClick: () => navigate('/business/inventory'), className: "flex w-full group cursor-pointer items-center justify-between overflow-hidden rounded-xl h-14 px-4 bg-white/5 text-gray-200 border border-white/5 hover:bg-white/5 hover:border-white/5 transition-all", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "size-8 rounded-lg bg-[#8b5cf6]/20 text-[#8b5cf6] flex items-center justify-center", children: _jsx("span", { className: "material-symbols-outlined text-xl", children: "inventory_2" }) }), _jsx("span", { className: "font-medium", children: "Manage Inventory" })] }), _jsx("span", { className: "material-symbols-outlined text-gray-500 group-hover:text-white transition-colors", children: "chevron_right" })] }), _jsxs("button", { onClick: () => navigate('/business/analytics'), className: "flex w-full group cursor-pointer items-center justify-between overflow-hidden rounded-xl h-14 px-4 bg-white/5 text-gray-200 border border-white/5 hover:bg-white/5 hover:border-white/5 transition-all", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "size-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center", children: _jsx("span", { className: "material-symbols-outlined text-xl", children: "bar_chart" }) }), _jsx("span", { className: "font-medium", children: "View Analytics" })] }), _jsx("span", { className: "material-symbols-outlined text-gray-500 group-hover:text-white transition-colors", children: "chevron_right" })] }), _jsxs("button", { onClick: () => navigate('/contact'), className: "flex w-full group cursor-pointer items-center justify-between overflow-hidden rounded-xl h-14 px-4 bg-white/5 text-gray-200 border border-white/5 hover:bg-white/5 hover:border-white/5 transition-all", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "size-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center", children: _jsx("span", { className: "material-symbols-outlined text-xl", children: "support_agent" }) }), _jsx("span", { className: "font-medium", children: "Contact Support" })] }), _jsx("span", { className: "material-symbols-outlined text-gray-500 group-hover:text-white transition-colors", children: "chevron_right" })] })] })] })] })] })] }) })] })] }) }), showCancelModal && (_jsxs("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 bg-black/70 backdrop-blur-sm", onClick: () => !cancelling && setShowCancelModal(null) }), _jsxs("div", { className: "relative bg-[#151F26] rounded-2xl p-6 sm:p-8 max-w-md w-full border border-white/5 shadow-2xl", children: [_jsx("div", { className: "w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center", children: _jsx("span", { className: "material-symbols-outlined text-4xl text-red-400", children: "warning" }) }), _jsx("h3", { className: "text-2xl font-bold text-white text-center mb-2", children: "Cancel Request?" }), _jsx("p", { className: "text-slate-400 text-center mb-8", children: "Are you sure you want to cancel this disposal request? This action cannot be undone." }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [_jsx("button", { onClick: () => setShowCancelModal(null), disabled: cancelling !== null, className: "flex-1 py-3 px-6 rounded-xl bg-white/5 text-white font-medium border border-white/5 hover:bg-white/5 transition-all disabled:opacity-50", children: "Keep Request" }), _jsx("button", { onClick: () => handleCancelBooking(showCancelModal), disabled: cancelling !== null, className: "flex-1 py-3 px-6 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50", children: cancelling === showCancelModal ? (_jsxs(_Fragment, { children: [_jsx(Loader, { size: "sm", color: "white" }), "Cancelling..."] })) : (_jsxs(_Fragment, { children: [_jsx("span", { className: "material-symbols-outlined text-lg", children: "delete" }), "Yes, Cancel"] })) })] })] })] }))] }));
};
export default BusinessDashboard;
