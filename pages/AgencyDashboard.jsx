import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import Loader from '../components/Loader.jsx';
import NotificationBell from '../components/NotificationBell.jsx';
import { api, getCurrentUser } from '../services/api.js';
import { useNavigate } from 'react-router-dom';
const AgencyDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(getCurrentUser());
    const [avatarKey, setAvatarKey] = useState(Date.now());
    const [activeBookings, setActiveBookings] = useState([]);
    const [allBookings, setAllBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAllBookings, setShowAllBookings] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);
    const [showActionModal, setShowActionModal] = useState(null);
    const [checkingStatus, setCheckingStatus] = useState(true);
    const [stats, setStats] = useState({
        totalPickups: 0,
        pendingPickups: 0,
        completedPickups: 0,
        totalWasteCollected: 0
    });
    useEffect(() => {
        checkAgencyStatus();
        // Listen for user updates
        const handleUserUpdate = () => {
            const updatedUser = getCurrentUser();
            setUser(updatedUser);
        };
        window.addEventListener('userUpdated', handleUserUpdate);
        return () => {
            window.removeEventListener('userUpdated', handleUserUpdate);
        };
    }, []);
    const checkAgencyStatus = async () => {
        try {
            setCheckingStatus(true);
            // First check if agency registration is approved
            const dashboardData = await api.get('/agencies/dashboard/me');
            const responseData = dashboardData.data?.data || dashboardData.data;
            const status = responseData?.status;
            // If pending or rejected, redirect to pending page
            if (status === 'pending' || status === 'rejected') {
                navigate('/partner/pending');
                return;
            }
            // If approved, load agency data
            if (status === 'approved') {
                setCheckingStatus(false);
                await loadAgencyData();
            }
            else {
                // Unknown status, redirect to pending
                navigate('/partner/pending');
            }
        }
        catch (error) {
            // If agency not found (404), redirect to registration form
            if (error.response?.status === 404) {
                navigate('/partner/register');
            }
            else if (error.response?.status === 401 || error.response?.status === 403) {
                // Not authenticated, redirect to login
                navigate('/login');
            }
            else {
                // For other errors (network issues, etc), also redirect to registration
                // User can start fresh if there's an unexpected error
                navigate('/partner/register');
            }
        }
    };
    const loadAgencyData = async () => {
        try {
            const userData = await api.getMe();
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            try {
                const bookingsData = await api.getAgencyBookings();
                const bookings = bookingsData.bookings || bookingsData || [];
                setAllBookings(bookings);
                const active = bookings.filter((b) => b.status === 'pending' || b.status === 'confirmed' || b.status === 'in-progress');
                setActiveBookings(active || []);
                const completed = bookings.filter((b) => b.status === 'completed');
                const totalWaste = completed.reduce((sum, b) => {
                    const items = b.items || [];
                    return sum + items.reduce((itemSum, item) => itemSum + (item.quantity || 0), 0);
                }, 0);
                setStats({
                    totalPickups: bookings.length,
                    pendingPickups: active.length,
                    completedPickups: completed.length,
                    totalWasteCollected: totalWaste
                });
            }
            catch (e) {
            }
        }
        catch (error) {
        }
        finally {
            setLoading(false);
        }
    };
    const handleUpdateStatus = async (bookingId, newStatus) => {
        setActionLoading(bookingId);
        try {
            await api.updateBookingStatus(bookingId, newStatus);
            await loadAgencyData();
            setShowActionModal(null);
        }
        catch (error) {
            alert('Failed to update booking. Please try again.');
        }
        finally {
            setActionLoading(null);
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
            case 'completed': return 'text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/20';
            case 'in-progress': return 'text-[#8b5cf6] bg-[#8b5cf6]/10 border-[#8b5cf6]/20';
            case 'confirmed': return 'text-[#3b82f6] bg-[#3b82f6]/10 border-[#3b82f6]/20';
            case 'pending': return 'text-[#94a3b8] bg-[#94a3b8]/10 border-[#94a3b8]/20';
            case 'cancelled': return 'text-red-400 bg-red-500/10 border-red-500/20';
            default: return 'text-[#94a3b8] bg-[#94a3b8]/10 border-[#94a3b8]/20';
        }
    };
    const getNextAction = (status) => {
        switch (status) {
            case 'pending': return { label: 'Confirm Pickup', newStatus: 'confirmed', icon: 'verified', color: 'bg-[#3b82f6]' };
            case 'confirmed': return { label: 'Start Pickup', newStatus: 'in-progress', icon: 'local_shipping', color: 'bg-[#8b5cf6]' };
            case 'in-progress': return { label: 'Complete Pickup', newStatus: 'completed', icon: 'check_circle', color: 'bg-[#f59e0b]' };
            default: return null;
        }
    };
    const getTrackingSteps = (booking) => {
        if (!booking)
            return [];
        const steps = [
            { key: 'pending', label: 'Request Received', icon: 'inbox', message: `Pickup request ${booking.bookingId || '#REQ'} received from customer.` },
            { key: 'confirmed', label: 'Confirmed', icon: 'verified', message: 'You confirmed this pickup request.' },
            { key: 'in-progress', label: 'Pickup Started', icon: 'local_shipping', message: 'Vehicle dispatched for collection.' },
            { key: 'completed', label: 'Completed', icon: 'task_alt', message: 'E-waste collected and processed successfully.' },
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
    // Show loading screen while checking status
    if (checkingStatus) {
        return (_jsx(Layout, { title: "", role: "Agency", fullWidth: true, hideSidebar: true, children: _jsx("div", { className: "min-h-screen bg-[#0B1116] flex items-center justify-center", children: _jsxs("div", { className: "flex flex-col items-center gap-4", children: [_jsx(Loader, { size: "lg", color: "#06b6d4" }), _jsx("p", { className: "text-slate-400", children: "Checking agency status..." })] }) }) }));
    }
    return (_jsxs(Layout, { title: "", role: "Agency", fullWidth: true, hideSidebar: true, children: [_jsx("div", { className: "bg-[#0B1116] font-sans text-gray-200 antialiased selection:bg-[#f59e0b] selection:text-white min-h-screen", children: _jsxs("div", { className: "relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden", children: [_jsx("div", { className: "fixed top-0 left-0 w-full h-[500px] bg-[#f59e0b]/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" }), _jsx("div", { className: "fixed bottom-0 right-0 w-full h-[500px] bg-[#8b5cf6]/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none" }), _jsxs("div", { className: "layout-container flex h-full grow flex-col relative z-10", children: [_jsxs("header", { className: "flex items-center justify-between whitespace-nowrap border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 transition-all duration-300", children: [_jsxs("div", { className: "flex items-center gap-3 text-white cursor-pointer", onClick: () => navigate('/'), children: [_jsx("div", { className: "p-2 bg-[#f59e0b]/10 rounded-lg", children: _jsx("svg", { className: "h-6 w-6 text-[#f59e0b]", fill: "currentColor", viewBox: "0 0 48 48", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" }) }) }), _jsxs("h2", { className: "text-xl font-bold tracking-tight text-white", children: ["EcoCycle ", _jsx("span", { className: "text-[#f59e0b]", children: "Partner" })] })] }), _jsx("nav", { className: "hidden md:flex flex-1 justify-center gap-1" }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx(NotificationBell, {}), _jsxs("div", { className: "relative group", children: [_jsxs("button", { onClick: () => navigate('/agency/profile'), className: "hidden sm:flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-[#151F26] border border-white/5 hover:bg-white/5 transition-colors cursor-pointer", children: [_jsx("div", { className: "size-8 rounded-full bg-cover bg-center ring-2 ring-white/10 group-hover:ring-[#f59e0b]/50 transition-all", style: { backgroundImage: `url("${(user?.logo || user?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || user?.companyName || 'Partner') + '&background=f59e0b&color=fff')}${(user?.logo || user?.avatar) ? '?t=' + avatarKey : ''}")` } }), _jsx("span", { className: "text-sm font-medium text-gray-200", children: user?.name || 'Agency' })] }), _jsx("div", { className: "absolute top-14 right-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100]", children: _jsx("div", { className: "bg-[#151F26] border border-white/5 rounded-2xl p-4 shadow-2xl", children: _jsx("div", { className: "size-32 rounded-xl bg-cover bg-center ring-4 ring-[#f59e0b]/30", style: { backgroundImage: `url("${(user?.logo || user?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || user?.companyName || 'Partner') + '&background=f59e0b&color=fff')}${(user?.logo || user?.avatar) ? '?t=' + avatarKey : ''}")` } }) }) })] }), _jsx("button", { onClick: handleLogout, className: "p-2.5 rounded-full bg-[#151F26] border border-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors", title: "Logout", children: _jsx("span", { className: "material-symbols-outlined text-[20px]", children: "logout" }) })] })] }), _jsx("main", { className: "flex flex-1 justify-center py-5 mt-24", children: _jsxs("div", { className: "layout-content-container flex flex-col w-full max-w-7xl px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "flex flex-col md:flex-row justify-between items-end gap-6 py-8", children: [_jsxs("div", { children: [_jsx("p", { className: "text-[#f59e0b] text-sm font-bold uppercase tracking-widest mb-2", children: "Partner Portal" }), _jsxs("h1", { className: "text-white text-4xl sm:text-5xl font-black leading-tight tracking-tighter mb-2 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent", children: ["Welcome, ", user?.name?.split(' ')[0] || 'Partner', "!"] }), _jsx("p", { className: "text-[#94a3b8] text-lg", children: "Manage your e-waste collection operations efficiently." })] }), _jsxs("div", { className: "flex items-center gap-3 bg-[#151F26]/50 p-1.5 pr-4 rounded-full border border-white/5 backdrop-blur-sm", children: [_jsx("div", { className: "bg-[#f59e0b]/20 p-2 rounded-full text-[#f59e0b]", children: _jsx("span", { className: "material-symbols-outlined text-lg", children: "calendar_today" }) }), _jsx("span", { className: "text-sm font-medium text-gray-200", children: formatDate() })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-8", children: [_jsxs("div", { className: "lg:col-span-8 flex flex-col gap-8", children: [_jsxs("section", { className: "flex flex-col gap-5", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h2", { className: "text-white text-2xl font-bold tracking-tight flex items-center gap-3", children: [_jsx("span", { className: "p-2 bg-[#8b5cf6]/10 rounded-lg text-[#8b5cf6]", children: _jsx("span", { className: "material-symbols-outlined", children: "local_shipping" }) }), activeBookings.length > 0 ? `Active Pickups (${activeBookings.length})` : 'Pickup Queue'] }), activeBookings.length > 0 && (_jsx("span", { className: "px-3 py-1 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] text-xs font-bold uppercase tracking-wider border border-[#f59e0b]/20 animate-pulse", children: "Action Required" }))] }), _jsxs("div", { className: "bg-[#151F26] rounded-2xl p-6 sm:p-10 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3),0_4px_6px_-4px_rgba(0,0,0,0.2),inset_0_1px_0_0_rgba(255,255,255,0.05)] border border-white/5 relative overflow-hidden group", children: [_jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-[#f59e0b]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" }), loading ? (_jsx("div", { className: "flex items-center justify-center py-12", children: _jsx(Loader, { size: "md", color: "#f59e0b" }) })) : activeBookings.length > 0 ? (_jsx("div", { className: "space-y-6", children: activeBookings.map((booking, bookingIndex) => (_jsxs("div", { className: `${bookingIndex > 0 ? 'pt-6 border-t border-white/5' : ''}`, children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 rounded-lg bg-[#f59e0b]/10", children: _jsx("span", { className: "material-symbols-outlined text-[#f59e0b]", children: "package_2" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-white font-bold", children: booking.bookingId || `#PKP-${booking._id?.slice(-6).toUpperCase()}` }), _jsxs("p", { className: "text-slate-400 text-sm", children: [formatDate(booking.scheduledDate), " \u2022 ", formatTime(booking.scheduledTime)] })] })] }), _jsx("span", { className: `text-[10px] font-bold uppercase px-3 py-1.5 rounded-full border ${getStatusColor(booking.status)}`, children: booking.status })] }), _jsxs("div", { className: "relative flex flex-col", children: [_jsx("div", { className: "absolute left-[23px] top-6 bottom-12 w-0.5 bg-gray-800 rounded-full" }), _jsx("div", { className: "absolute left-[23px] top-6 w-0.5 bg-gradient-to-b from-[#f59e0b] via-[#f59e0b] to-[#8b5cf6] rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]", style: { height: `${Math.min(getTrackingSteps(booking).filter(s => s.completed || s.current).length / getTrackingSteps(booking).length * 100, 75)}%` } }), getTrackingSteps(booking).map((step, index) => (_jsxs("div", { className: `relative flex gap-6 ${index < 3 ? 'pb-8' : ''} group/step ${step.pending ? 'opacity-50 hover:opacity-100 transition-opacity duration-300' : ''}`, children: [_jsxs("div", { className: `z-10 shrink-0 ${step.current ? 'relative' : ''}`, children: [step.current && (_jsx("div", { className: "absolute inset-0 -m-2 rounded-full border-2 border-[#f59e0b]/30 animate-pulse" })), _jsx("div", { className: `flex size-10 items-center justify-center rounded-full text-white ring-4 ring-[#151F26] transition-transform duration-500 group-hover/step:scale-110 ${step.completed ? 'bg-[#f59e0b] shadow-[0_0_15px_rgba(245,158,11,0.4)]' :
                                                                                                                        step.current ? 'bg-[#8b5cf6] shadow-[0_0_25px_rgba(139,92,246,0.6)]' :
                                                                                                                            'bg-[#151F26] border-2 border-dashed border-gray-600 text-gray-500'}`, children: _jsx("span", { className: `material-symbols-outlined text-lg ${step.current ? 'animate-bounce' : ''}`, children: step.icon }) })] }), _jsxs("div", { className: "flex-1 pt-1", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1", children: [_jsx("h3", { className: `text-base font-bold group-hover/step:text-[#f59e0b] transition-colors ${step.completed || step.current ? 'text-white' : 'text-gray-500'}`, children: step.label }), _jsx("span", { className: `w-fit text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${step.completed ? 'text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/20' :
                                                                                                                                step.current ? 'text-[#8b5cf6] bg-[#8b5cf6]/10 border-[#8b5cf6]/20' :
                                                                                                                                    'text-gray-500 bg-gray-800 border-gray-700'}`, children: step.completed ? 'Done' : step.current ? 'Current' : 'Pending' })] }), _jsx("p", { className: `text-sm ${step.completed || step.current ? 'text-[#94a3b8]' : 'text-gray-600'}`, children: step.message })] })] }, step.key)))] }), _jsxs("div", { className: "mt-4 p-3 bg-white/5 rounded-lg border border-white/5 flex items-center gap-3", children: [_jsx("div", { className: "size-10 rounded-full bg-gray-800 flex items-center justify-center shrink-0 border border-white/5", children: _jsx("span", { className: "material-symbols-outlined text-slate-400 text-sm", children: "person" }) }), _jsxs("div", { className: "overflow-hidden flex-1", children: [_jsx("p", { className: "text-xs text-slate-400 truncate", children: "Customer" }), _jsx("p", { className: "text-sm font-semibold text-white truncate", children: typeof booking.userId === 'object' ? booking.userId.name : 'Customer' })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-xs text-slate-400", children: "Items" }), _jsx("p", { className: "text-sm font-semibold text-white", children: booking.items?.length || 0 })] })] }), getNextAction(booking.status) && (_jsxs("button", { onClick: () => setShowActionModal({ booking, action: getNextAction(booking.status).newStatus }), className: `mt-4 w-full py-3 px-4 rounded-xl ${getNextAction(booking.status).color} text-white font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg`, children: [_jsx("span", { className: "material-symbols-outlined text-lg", children: getNextAction(booking.status).icon }), getNextAction(booking.status).label] }))] }, booking._id))) })) : (_jsxs("div", { className: "text-center py-8", children: [_jsx("div", { className: "p-4 bg-[#f59e0b]/10 rounded-full w-fit mx-auto mb-4", children: _jsx("span", { className: "material-symbols-outlined text-4xl text-[#f59e0b]", children: "check_circle" }) }), _jsx("h3", { className: "text-xl font-bold text-white mb-2", children: "All Caught Up!" }), _jsx("p", { className: "text-[#94a3b8] mb-6 max-w-md mx-auto", children: "No active pickup requests. Check your bookings or manage your slots." }), _jsxs("button", { onClick: () => navigate('/agency/bookings'), className: "bg-[#f59e0b] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#d97706] transition-colors inline-flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined", children: "book_online" }), "View All Bookings"] })] }))] })] }), allBookings.length > 0 && (_jsxs("section", { className: "flex flex-col gap-5", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h2", { className: "text-white text-2xl font-bold tracking-tight flex items-center gap-3", children: [_jsx("span", { className: "p-2 bg-purple-500/10 rounded-lg text-purple-400", children: _jsx("span", { className: "material-symbols-outlined", children: "history" }) }), "Booking History (", allBookings.length, ")"] }), _jsxs("button", { onClick: () => setShowAllBookings(!showAllBookings), className: "text-sm text-[#94a3b8] hover:text-white transition-colors flex items-center gap-1", children: [showAllBookings ? 'Show Less' : 'View All', _jsx("span", { className: "material-symbols-outlined text-lg", children: showAllBookings ? 'expand_less' : 'expand_more' })] })] }), _jsxs("div", { className: "bg-[#151F26] rounded-2xl p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] border border-white/5", children: [_jsx("div", { className: "space-y-3", children: (showAllBookings ? allBookings : allBookings.slice(0, 5)).map(booking => (_jsxs("div", { className: "flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/5 hover:border-white/5 transition-all group", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: `p-3 rounded-xl ${getStatusColor(booking.status)}`, children: _jsx("span", { className: "material-symbols-outlined", children: booking.status === 'completed' ? 'check_circle' :
                                                                                                            booking.status === 'cancelled' ? 'cancel' :
                                                                                                                booking.status === 'in-progress' ? 'local_shipping' :
                                                                                                                    booking.status === 'confirmed' ? 'verified' : 'pending' }) }), _jsxs("div", { children: [_jsx("p", { className: "text-white font-bold", children: booking.bookingId || `#PKP-${booking._id?.slice(-6).toUpperCase()}` }), _jsxs("div", { className: "flex items-center gap-2 text-[#94a3b8] text-sm", children: [_jsx("span", { children: formatDate(booking.scheduledDate) }), _jsx("span", { children: "\u2022" }), _jsx("span", { children: formatTime(booking.scheduledTime) })] }), _jsx("p", { className: "text-gray-500 text-xs mt-1", children: typeof booking.userId === 'object' ? booking.userId.name : 'Customer' })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: `text-xs font-bold uppercase px-3 py-1.5 rounded-full border ${getStatusColor(booking.status)}`, children: booking.status }), _jsx("span", { className: "material-symbols-outlined text-gray-500 group-hover:text-white transition-colors", children: "chevron_right" })] })] }, booking._id))) }), !showAllBookings && allBookings.length > 5 && (_jsxs("button", { onClick: () => setShowAllBookings(true), className: "w-full mt-4 py-3 text-center text-[#94a3b8] hover:text-white text-sm font-medium border border-white/5 rounded-xl hover:bg-white/5 transition-all", children: ["Show ", allBookings.length - 5, " more bookings"] }))] })] })), _jsxs("section", { className: "flex flex-col gap-5", children: [_jsxs("h2", { className: "text-white text-2xl font-bold tracking-tight flex items-center gap-3", children: [_jsx("span", { className: "p-2 bg-[#f59e0b]/10 rounded-lg text-[#f59e0b]", children: _jsx("span", { className: "material-symbols-outlined", children: "analytics" }) }), "Performance Overview"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-[#151F26] rounded-2xl p-6 shadow-[0_4px_12px_0_rgba(0,0,0,0.07)] flex flex-col justify-between border border-white/5 hover:border-white/5 transition-colors relative overflow-hidden group", children: [_jsx("div", { className: "absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity", children: _jsx("span", { className: "material-symbols-outlined text-8xl text-white", children: "local_shipping" }) }), _jsxs("div", { children: [_jsx("div", { className: "flex items-center gap-2 text-[#94a3b8] mb-3", children: _jsx("span", { className: "text-sm font-semibold uppercase tracking-wider", children: "Total Pickups" }) }), _jsx("p", { className: "text-white text-5xl font-black leading-none tracking-tight", children: stats.totalPickups })] }), _jsxs("div", { className: "mt-8", children: [_jsxs("div", { className: "flex justify-between text-xs font-medium text-slate-400 mb-2", children: [_jsx("span", { children: "Completion Rate" }), _jsxs("span", { children: [stats.totalPickups > 0 ? Math.round(stats.completedPickups / stats.totalPickups * 100) : 0, "%"] })] }), _jsx("div", { className: "w-full bg-gray-800 rounded-full h-3 overflow-hidden", children: _jsx("div", { className: "bg-gradient-to-r from-[#f59e0b]/50 to-[#f59e0b] h-3 rounded-full relative", style: { width: `${stats.totalPickups > 0 ? (stats.completedPickups / stats.totalPickups * 100) : 0}%` }, children: _jsx("div", { className: "absolute inset-0 bg-white/20 animate-pulse" }) }) })] })] }), _jsxs("div", { className: "bg-[#151F26] rounded-2xl p-6 shadow-[0_4px_12px_0_rgba(0,0,0,0.07)] flex flex-col justify-between border border-white/5 hover:border-white/5 transition-colors relative overflow-hidden group", children: [_jsx("div", { className: "absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity", children: _jsx("span", { className: "material-symbols-outlined text-8xl text-white", children: "scale" }) }), _jsxs("div", { children: [_jsx("div", { className: "flex items-center gap-2 text-[#94a3b8] mb-3", children: _jsx("span", { className: "text-sm font-semibold uppercase tracking-wider", children: "Items Collected" }) }), _jsx("p", { className: "text-white text-5xl font-black leading-none tracking-tight", children: stats.totalWasteCollected })] }), _jsxs("div", { className: "mt-8", children: [_jsxs("div", { className: "flex justify-between text-xs font-medium text-slate-400 mb-2", children: [_jsx("span", { children: "Monthly Target" }), _jsx("span", { className: "text-[#f59e0b]", children: "On Track" })] }), _jsx("div", { className: "w-full bg-gray-800 rounded-full h-3 overflow-hidden", children: _jsx("div", { className: "bg-gradient-to-r from-[#8b5cf6]/50 to-[#8b5cf6] h-3 rounded-full relative", style: { width: '72%' }, children: _jsx("div", { className: "absolute inset-0 bg-white/20 animate-pulse" }) }) })] })] })] })] })] }), _jsxs("div", { className: "lg:col-span-4 flex flex-col gap-8", children: [_jsxs("div", { className: "bg-gradient-to-b from-[#151F26] to-[#0B1116] rounded-2xl p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] flex flex-col items-center text-center border border-white/5 relative overflow-hidden", children: [_jsx("div", { className: "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#f59e0b] via-[#8b5cf6] to-[#f59e0b]" }), _jsx("div", { className: "absolute top-1/2 left-1/2 w-32 h-32 bg-[#f59e0b]/20 rounded-full blur-[60px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" }), _jsx("p", { className: "text-sm font-bold uppercase tracking-widest text-[#94a3b8] z-10", children: "Partner Rating" }), _jsxs("div", { className: "my-8 flex items-center justify-center relative z-10 group cursor-default", children: [_jsx("svg", { className: "h-14 w-14 text-[#f59e0b] drop-shadow-[0_0_15px_rgba(245,158,11,0.5)] group-hover:scale-110 transition-transform duration-300", fill: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M12 2L9.5 8.5H3L8 12.5L6 19L12 15L18 19L16 12.5L21 8.5H14.5L12 2Z" }) }), _jsx("span", { className: "text-7xl font-black text-white ml-2 drop-shadow-sm tracking-tighter", children: "4.9" })] }), _jsx("p", { className: "text-sm text-slate-400 max-w-[200px] z-10", children: "Excellent rating! Keep up the great service." }), _jsxs("button", { className: "mt-8 w-full group relative overflow-hidden rounded-xl bg-[#f59e0b] text-white font-bold h-12 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all z-10 cursor-pointer", onClick: () => navigate('/agency/profile'), children: [_jsx("div", { className: "absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" }), _jsxs("span", { className: "relative flex items-center justify-center gap-2", children: ["View Profile", _jsx("span", { className: "material-symbols-outlined text-lg", children: "arrow_forward" })] })] })] }), _jsxs("div", { className: "bg-[#151F26] rounded-2xl p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] border border-white/5", children: [_jsxs("h2", { className: "text-white text-lg font-bold tracking-tight pb-4 flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-slate-400", children: "bolt" }), "Quick Actions"] }), _jsxs("div", { className: "flex flex-col gap-3", children: [_jsxs("button", { onClick: () => navigate('/agency/slots'), className: "flex w-full group cursor-pointer items-center justify-between overflow-hidden rounded-xl h-14 px-4 bg-white/5 text-gray-200 border border-white/5 hover:bg-white/5 hover:border-white/5 transition-all", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "size-8 rounded-lg bg-[#f59e0b]/20 text-[#f59e0b] flex items-center justify-center", children: _jsx("span", { className: "material-symbols-outlined text-xl", children: "calendar_month" }) }), _jsx("span", { className: "font-medium", children: "Manage Slots" })] }), _jsx("span", { className: "material-symbols-outlined text-gray-500 group-hover:text-white transition-colors", children: "chevron_right" })] }), _jsxs("button", { onClick: () => navigate('/agency/bookings'), className: "flex w-full group cursor-pointer items-center justify-between overflow-hidden rounded-xl h-14 px-4 bg-white/5 text-gray-200 border border-white/5 hover:bg-white/5 hover:border-white/5 transition-all", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "size-8 rounded-lg bg-[#8b5cf6]/20 text-[#8b5cf6] flex items-center justify-center", children: _jsx("span", { className: "material-symbols-outlined text-xl", children: "book_online" }) }), _jsx("span", { className: "font-medium", children: "View Bookings" })] }), _jsx("span", { className: "material-symbols-outlined text-gray-500 group-hover:text-white transition-colors", children: "chevron_right" })] }), _jsxs("button", { onClick: () => navigate('/agency/profile'), className: "flex w-full group cursor-pointer items-center justify-between overflow-hidden rounded-xl h-14 px-4 bg-white/5 text-gray-200 border border-white/5 hover:bg-white/5 hover:border-white/5 transition-all", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "size-8 rounded-lg bg-[#3b82f6]/20 text-[#3b82f6] flex items-center justify-center", children: _jsx("span", { className: "material-symbols-outlined text-xl", children: "person" }) }), _jsx("span", { className: "font-medium", children: "Edit Profile" })] }), _jsx("span", { className: "material-symbols-outlined text-gray-500 group-hover:text-white transition-colors", children: "chevron_right" })] }), _jsxs("button", { onClick: () => navigate('/contact'), className: "flex w-full group cursor-pointer items-center justify-between overflow-hidden rounded-xl h-14 px-4 bg-white/5 text-gray-200 border border-white/5 hover:bg-white/5 hover:border-white/5 transition-all", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "size-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center", children: _jsx("span", { className: "material-symbols-outlined text-xl", children: "support_agent" }) }), _jsx("span", { className: "font-medium", children: "Contact Support" })] }), _jsx("span", { className: "material-symbols-outlined text-gray-500 group-hover:text-white transition-colors", children: "chevron_right" })] })] })] }), _jsxs("div", { className: "bg-gradient-to-br from-[#f59e0b]/10 to-[#151F26] border border-[#f59e0b]/20 rounded-2xl p-6 relative overflow-hidden shadow-xl", children: [_jsx("div", { className: "absolute top-0 right-0 p-4 opacity-10", children: _jsx("span", { className: "material-symbols-outlined text-6xl text-[#f59e0b]", children: "eco" }) }), _jsxs("div", { className: "flex items-start gap-4 relative z-10", children: [_jsx("span", { className: "material-symbols-outlined text-[#f59e0b] text-3xl", children: "tips_and_updates" }), _jsxs("div", { children: [_jsx("h4", { className: "text-white font-bold mb-1", children: "Pro Tip" }), _jsx("p", { className: "text-sm text-slate-400 leading-relaxed", children: "Optimizing your slot availability during peak hours can increase bookings by up to 25%." })] })] })] })] })] })] }) })] })] }) }), showActionModal && (_jsxs("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 bg-black/70 backdrop-blur-sm", onClick: () => !actionLoading && setShowActionModal(null) }), _jsxs("div", { className: "relative bg-[#151F26] rounded-2xl p-6 sm:p-8 max-w-md w-full border border-white/5 shadow-2xl", children: [_jsx("div", { className: `w-16 h-16 mx-auto mb-6 rounded-full ${getNextAction(showActionModal.booking.status)?.color || 'bg-[#f59e0b]'}/20 flex items-center justify-center`, children: _jsx("span", { className: `material-symbols-outlined text-4xl ${showActionModal.action === 'confirmed' ? 'text-[#3b82f6]' : showActionModal.action === 'in-progress' ? 'text-[#8b5cf6]' : 'text-[#f59e0b]'}`, children: getNextAction(showActionModal.booking.status)?.icon || 'check' }) }), _jsxs("h3", { className: "text-2xl font-bold text-white text-center mb-2", children: [getNextAction(showActionModal.booking.status)?.label, "?"] }), _jsxs("p", { className: "text-slate-400 text-center mb-4", children: ["Booking: ", _jsx("span", { className: "text-white font-medium", children: showActionModal.booking.bookingId || `#PKP-${showActionModal.booking._id?.slice(-6).toUpperCase()}` })] }), _jsx("p", { className: "text-gray-500 text-center text-sm mb-8", children: "This will update the booking status and notify the customer." }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [_jsx("button", { onClick: () => setShowActionModal(null), disabled: actionLoading !== null, className: "flex-1 py-3 px-6 rounded-xl bg-white/5 text-white font-medium border border-white/5 hover:bg-white/5 transition-all disabled:opacity-50", children: "Cancel" }), _jsx("button", { onClick: () => handleUpdateStatus(showActionModal.booking._id, showActionModal.action), disabled: actionLoading !== null, className: `flex-1 py-3 px-6 rounded-xl ${getNextAction(showActionModal.booking.status)?.color || 'bg-[#f59e0b]'} text-white font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50`, children: actionLoading === showActionModal.booking._id ? (_jsxs(_Fragment, { children: [_jsx(Loader, { size: "sm", color: "white" }), "Updating..."] })) : (_jsxs(_Fragment, { children: [_jsx("span", { className: "material-symbols-outlined text-lg", children: getNextAction(showActionModal.booking.status)?.icon }), "Confirm"] })) })] })] })] }))] }));
};
export default AgencyDashboard;
