import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import { getCurrentUser } from '../services/api.js';
import Loader from '../components/Loader.jsx';
import { useNavigate } from 'react-router-dom';
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const BusinessAnalytics = () => {
    const navigate = useNavigate();
    const user = getCurrentUser();
    const [timeRange, setTimeRange] = useState('30d');
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState(null);
    const [recentActivity, setRecentActivity] = useState([]);
    const [showTargetModal, setShowTargetModal] = useState(false);
    const [editTarget, setEditTarget] = useState(200);
    const [savingTarget, setSavingTarget] = useState(false);
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };
    const handleSaveTarget = async () => {
        try {
            setSavingTarget(true);
            const res = await fetch(`${API_BASE}/business/profile`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ monthlyTarget: editTarget })
            });
            const data = await res.json();
            if (data.success) {
                setShowTargetModal(false);
                fetchAnalytics(); // Refresh analytics with new target
            }
        }
        catch (error) {
        }
        finally {
            setSavingTarget(false);
        }
    };
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    };
    useEffect(() => {
        fetchAnalytics();
        fetchRecentActivity();
    }, [timeRange]);
    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/business/analytics?period=${timeRange}`, {
                headers: getAuthHeaders()
            });
            const data = await res.json();
            if (data.success) {
                setAnalytics(data.data);
            }
        }
        catch (error) {
        }
        finally {
            setLoading(false);
        }
    };
    const fetchRecentActivity = async () => {
        try {
            const res = await fetch(`${API_BASE}/business/bookings?limit=5`, {
                headers: getAuthHeaders()
            });
            const data = await res.json();
            if (data.success) {
                const bookings = data.data?.bookings || [];
                const activities = bookings.map((b) => {
                    let action = 'Pickup Scheduled';
                    let icon = 'local_shipping';
                    let color = 'text-[#8b5cf6]';
                    if (b.status === 'completed') {
                        action = 'Disposal Completed';
                        icon = 'check_circle';
                        color = 'text-[#10b981]';
                    }
                    else if (b.status === 'confirmed') {
                        action = 'Pickup Confirmed';
                        icon = 'verified';
                        color = 'text-[#06b6d4]';
                    }
                    else if (b.status === 'in-progress') {
                        action = 'Pickup In Progress';
                        icon = 'sync';
                        color = 'text-amber-400';
                    }
                    else if (b.status === 'cancelled') {
                        action = 'Pickup Cancelled';
                        icon = 'cancel';
                        color = 'text-red-400';
                    }
                    const detail = `${b.totalWeight?.toFixed(1) || 0} kg • ${b.agencyId?.name || 'Agency'}`;
                    const time = getRelativeTime(b.createdAt);
                    return { action, detail, time, icon, color };
                });
                setRecentActivity(activities);
            }
        }
        catch (error) {
        }
    };
    const getRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);
        if (hours < 1)
            return 'Just now';
        if (hours < 24)
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (days < 7)
            return `${days} day${days > 1 ? 's' : ''} ago`;
        return date.toLocaleDateString();
    };
    const getMonthName = (monthStr) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthNum = parseInt(monthStr.split('-')[1]) - 1;
        return months[monthNum] || monthStr;
    };
    // Use API target or default
    const monthlyTarget = analytics?.summary?.monthlyTarget || 200;
    // Process monthly data from API
    const monthlyData = analytics?.monthlyTrends?.length ? analytics.monthlyTrends.map(t => ({
        month: getMonthName(t._id),
        disposed: Math.round(t.totalWeight),
        target: monthlyTarget
    })) : [];
    const categoryColors = {
        'IT Equipment': '#06b6d4',
        'Batteries': '#f59e0b',
        'Monitors': '#8b5cf6',
        'Cables': '#10b981',
        'Cables & Wiring': '#10b981',
        'Mobile Devices': '#ec4899',
        'Appliances': '#3b82f6',
        'Other': '#64748b'
    };
    const totalCategoryWeight = analytics?.wasteByCategory?.reduce((sum, c) => sum + c.totalWeight, 0) || 0;
    const categoryData = analytics?.wasteByCategory?.length ? analytics.wasteByCategory.map(c => ({
        name: c._id || 'Other',
        value: totalCategoryWeight > 0 ? Math.round((c.totalWeight / totalCategoryWeight) * 100) : 0,
        weight: c.totalWeight,
        count: c.count,
        color: categoryColors[c._id] || '#64748b'
    })) : [];
    // Include target in maxValue calculation so target line stays within chart bounds
    const maxValue = Math.max(...monthlyData.map(d => Math.max(d.disposed, d.target)), monthlyTarget, 100);
    // Use API data
    const totalDisposed = analytics?.summary?.totalWasteProcessed || 0;
    const co2Saved = analytics?.summary?.co2Saved || 0;
    const treesEquivalent = analytics?.summary?.treesEquivalent || 0;
    const totalBookings = analytics?.summary?.totalBookings || 0;
    const complianceScore = analytics?.summary?.complianceScore || 0;
    const costSavings = Math.round(totalDisposed * 15); // ₹15 per kg estimate
    const waterConserved = Math.round(totalDisposed * 8.7); // ~8.7L per kg e-waste
    const energySaved = Math.round(totalDisposed * 5.7); // ~5.7 kWh per kg
    // Default activity if none from API
    const displayActivity = recentActivity.length > 0 ? recentActivity : [
        { action: 'No recent activity', detail: 'Schedule a pickup to get started', time: '', icon: 'info', color: 'text-slate-400' }
    ];
    return (_jsx(Layout, { title: "", role: "Business", fullWidth: true, hideSidebar: true, children: _jsxs("div", { className: "bg-[#0B1116] font-sans text-gray-200 antialiased selection:bg-[#06b6d4] selection:text-white min-h-screen", children: [_jsxs("div", { className: "relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden", children: [_jsx("div", { className: "fixed top-0 left-0 w-full h-[500px] bg-amber-500/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" }), _jsx("div", { className: "fixed bottom-0 right-0 w-full h-[500px] bg-[#06b6d4]/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none" }), _jsxs("div", { className: "layout-container flex h-full grow flex-col relative z-10", children: [_jsxs("header", { className: "flex items-center justify-between whitespace-nowrap border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50", children: [_jsxs("div", { className: "flex items-center gap-3 text-white cursor-pointer", onClick: () => navigate('/'), children: [_jsx("div", { className: "p-2 bg-[#06b6d4]/10 rounded-lg", children: _jsx("svg", { className: "h-6 w-6 text-[#06b6d4]", fill: "currentColor", viewBox: "0 0 48 48", children: _jsx("path", { d: "M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" }) }) }), _jsxs("h2", { className: "text-xl font-bold tracking-tight text-white", children: ["EcoCycle ", _jsx("span", { className: "text-[#06b6d4]", children: "Business" })] })] }), _jsx("nav", { className: "hidden md:flex flex-1 justify-center gap-1" }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("button", { onClick: () => navigate('/profile'), className: "hidden sm:flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-[#151F26] border border-white/5 hover:bg-white/5 transition-colors group cursor-pointer", children: [_jsx("div", { className: "size-8 rounded-full bg-[#06b6d4] flex items-center justify-center ring-2 ring-white/10 group-hover:ring-[#06b6d4]/50 transition-all text-white font-bold text-sm", children: user?.name?.charAt(0) || 'B' }), _jsx("span", { className: "text-sm font-medium text-gray-200", children: user?.name || 'Business' })] }), _jsx("button", { onClick: handleLogout, className: "p-2.5 rounded-full bg-[#151F26] border border-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors", title: "Logout", children: _jsx("span", { className: "material-symbols-outlined text-[20px]", children: "logout" }) })] })] }), _jsx("main", { className: "flex flex-1 justify-center py-5 mt-24", children: _jsxs("div", { className: "layout-content-container flex flex-col w-full max-w-7xl px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-end gap-6 py-8", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("button", { onClick: () => navigate('/business'), className: "text-[#94a3b8] hover:text-white transition-colors", children: _jsx("span", { className: "material-symbols-outlined text-lg", children: "arrow_back" }) }), _jsx("p", { className: "text-amber-400 text-sm font-bold uppercase tracking-widest", children: "Analytics & Reports" })] }), _jsx("h1", { className: "text-white text-3xl sm:text-4xl font-black leading-tight tracking-tighter mb-2", children: "Business Analytics" }), _jsx("p", { className: "text-[#94a3b8] text-base", children: "Track your environmental impact and disposal metrics." })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("button", { onClick: () => {
                                                                    setEditTarget(monthlyTarget);
                                                                    setShowTargetModal(true);
                                                                }, className: "flex items-center gap-2 bg-[#151F26] border border-white/5 text-white text-sm rounded-xl px-4 py-2.5 hover:bg-white/5 transition-colors", children: [_jsx("span", { className: "material-symbols-outlined text-lg", children: "flag" }), _jsxs("span", { className: "hidden sm:inline", children: ["Target: ", monthlyTarget, " kg"] })] }), _jsxs("select", { value: timeRange, onChange: (e) => setTimeRange(e.target.value), className: "bg-[#151F26] border border-white/5 text-white text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none cursor-pointer", children: [_jsx("option", { value: "7d", children: "Last 7 Days" }), _jsx("option", { value: "30d", children: "Last 30 Days" }), _jsx("option", { value: "90d", children: "Last Quarter" }), _jsx("option", { value: "1y", children: "This Year" })] })] })] }), loading ? (_jsx("div", { className: "flex items-center justify-center py-20", children: _jsxs("div", { className: "text-center", children: [_jsx(Loader, { size: "md", color: "#06b6d4" }), _jsx("p", { className: "text-slate-400 mt-4", children: "Loading analytics..." })] }) })) : (_jsxs(_Fragment, { children: [analytics?.isDemo && (_jsxs("div", { className: "mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-3", children: [_jsx("span", { className: "material-symbols-outlined text-amber-400", children: "info" }), _jsxs("div", { children: [_jsx("p", { className: "text-amber-400 font-semibold text-sm", children: "Sample Data Preview" }), _jsx("p", { className: "text-slate-400 text-xs", children: "This is demo data. Complete your first pickup to see your real analytics." })] })] })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: [_jsxs("div", { className: "bg-[#151F26] rounded-2xl p-6 border border-white/5 relative overflow-hidden group hover:border-[#06b6d4]/20 transition-all", children: [_jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-[#06b6d4]/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" }), _jsxs("div", { className: "flex items-center justify-between mb-4 relative z-10", children: [_jsx("div", { className: "p-3 bg-[#06b6d4]/10 rounded-xl text-[#06b6d4]", children: _jsx("span", { className: "material-symbols-outlined", children: "scale" }) }), totalDisposed > 0 && (_jsxs("span", { className: "text-xs font-bold text-[#06b6d4] bg-[#06b6d4]/10 px-2 py-1 rounded-full flex items-center gap-1", children: [_jsx("span", { className: "material-symbols-outlined text-xs", children: "check" }), "Active"] }))] }), _jsxs("h3", { className: "text-3xl font-black text-white relative z-10", children: [totalDisposed.toLocaleString(), " ", _jsx("span", { className: "text-lg font-medium text-gray-500", children: "kg" })] }), _jsx("p", { className: "text-sm text-[#94a3b8] relative z-10", children: "Total Disposed" })] }), _jsxs("div", { className: "bg-[#151F26] rounded-2xl p-6 border border-white/5 relative overflow-hidden group hover:border-[#10b981]/20 transition-all", children: [_jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-[#10b981]/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" }), _jsxs("div", { className: "flex items-center justify-between mb-4 relative z-10", children: [_jsx("div", { className: "p-3 bg-[#10b981]/10 rounded-xl text-[#10b981]", children: _jsx("span", { className: "material-symbols-outlined", children: "forest" }) }), _jsx("span", { className: "text-xs font-bold text-[#10b981] bg-[#10b981]/10 px-2 py-1 rounded-full", children: "Offset" })] }), _jsxs("h3", { className: "text-3xl font-black text-white relative z-10", children: [Math.round(co2Saved).toLocaleString(), " ", _jsx("span", { className: "text-lg font-medium text-gray-500", children: "kg" })] }), _jsx("p", { className: "text-sm text-[#94a3b8] relative z-10", children: "CO\u2082 Saved" })] }), _jsxs("div", { className: "bg-[#151F26] rounded-2xl p-6 border border-white/5 relative overflow-hidden group hover:border-[#8b5cf6]/20 transition-all", children: [_jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-[#8b5cf6]/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" }), _jsxs("div", { className: "flex items-center justify-between mb-4 relative z-10", children: [_jsx("div", { className: "p-3 bg-[#8b5cf6]/10 rounded-xl text-[#8b5cf6]", children: _jsx("span", { className: "material-symbols-outlined", children: "recycling" }) }), _jsx("span", { className: "text-xs font-bold text-[#8b5cf6] bg-[#8b5cf6]/10 px-2 py-1 rounded-full", children: "Rate" })] }), _jsxs("h3", { className: "text-3xl font-black text-white relative z-10", children: [complianceScore.toFixed(1), " ", _jsx("span", { className: "text-lg font-medium text-gray-500", children: "%" })] }), _jsx("p", { className: "text-sm text-[#94a3b8] relative z-10", children: "Compliance Score" })] }), _jsxs("div", { className: "bg-[#151F26] rounded-2xl p-6 border border-white/5 relative overflow-hidden group hover:border-amber-500/20 transition-all", children: [_jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" }), _jsxs("div", { className: "flex items-center justify-between mb-4 relative z-10", children: [_jsx("div", { className: "p-3 bg-amber-500/10 rounded-xl text-amber-400", children: _jsx("span", { className: "material-symbols-outlined", children: "savings" }) }), _jsx("span", { className: "text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full", children: "Savings" })] }), _jsxs("h3", { className: "text-3xl font-black text-white relative z-10", children: ["\u20B9", costSavings.toLocaleString()] }), _jsx("p", { className: "text-sm text-[#94a3b8] relative z-10", children: "Cost Savings" })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8", children: [_jsxs("div", { className: "lg:col-span-2 bg-[#151F26] rounded-2xl p-6 border border-white/5", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-white", children: "Disposal Trends" }), _jsx("p", { className: "text-sm text-gray-500", children: "Monthly e-waste disposal vs target" })] }), _jsxs("div", { className: "flex items-center gap-4 text-xs", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 rounded-full bg-[#06b6d4]" }), _jsx("span", { className: "text-slate-400", children: "Disposed" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 rounded-full bg-gray-600 border-2 border-dashed border-gray-400" }), _jsx("span", { className: "text-slate-400", children: "Target" })] })] })] }), monthlyData.length > 0 ? (_jsx("div", { className: "h-64 flex items-end justify-between gap-4 px-4", children: monthlyData.map((data, idx) => (_jsxs("div", { className: "flex-1 flex flex-col items-center gap-2", children: [_jsxs("div", { className: "w-full relative", style: { height: '200px' }, children: [_jsx("div", { className: "absolute w-full border-t-2 border-dashed border-gray-600", style: { bottom: `${(data.target / maxValue) * 100}%` } }), _jsx("div", { className: "absolute bottom-0 w-full bg-gradient-to-t from-[#06b6d4] to-[#06b6d4]/50 rounded-t-lg transition-all hover:from-[#06b6d4] hover:to-[#06b6d4]/70", style: { height: `${(data.disposed / maxValue) * 100}%` }, children: _jsx("div", { className: "absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-white opacity-0 hover:opacity-100 transition-opacity", children: data.disposed }) })] }), _jsx("span", { className: "text-xs text-gray-500 font-medium", children: data.month })] }, idx))) })) : (_jsx("div", { className: "h-64 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("span", { className: "material-symbols-outlined text-4xl text-gray-600 mb-2", children: "bar_chart" }), _jsx("p", { className: "text-gray-500", children: "No disposal data yet" }), _jsx("p", { className: "text-gray-600 text-sm", children: "Complete pickups to see trends" })] }) }))] }), _jsxs("div", { className: "bg-[#151F26] rounded-2xl p-6 border border-white/5", children: [_jsx("h3", { className: "text-lg font-bold text-white mb-6", children: "By Category" }), categoryData.length > 0 ? (_jsx("div", { className: "space-y-4", children: categoryData.map((cat, idx) => (_jsxs("div", { className: "group", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-sm text-gray-200 group-hover:text-white transition-colors", children: cat.name }), _jsxs("span", { className: "text-sm font-bold text-white", children: [cat.value, "%"] })] }), _jsx("div", { className: "h-2 bg-gray-800 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full rounded-full transition-all group-hover:opacity-80", style: { width: `${cat.value}%`, backgroundColor: cat.color } }) })] }, idx))) })) : (_jsxs("div", { className: "text-center py-8", children: [_jsx("span", { className: "material-symbols-outlined text-3xl text-gray-600 mb-2", children: "pie_chart" }), _jsx("p", { className: "text-gray-500", children: "No category data" })] })), _jsxs("div", { className: "mt-6 pt-6 border-t border-white/5", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-slate-400 text-sm", children: "Total Disposed" }), _jsxs("span", { className: "text-2xl font-black text-white", children: [totalDisposed.toLocaleString(), " ", _jsx("span", { className: "text-sm font-medium text-gray-500", children: "kg" })] })] }), _jsxs("div", { className: "flex items-center justify-between mt-2", children: [_jsx("span", { className: "text-slate-400 text-sm", children: "Total Bookings" }), _jsx("span", { className: "text-lg font-bold text-[#06b6d4]", children: totalBookings })] })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [_jsxs("div", { className: "bg-[#151F26] rounded-2xl p-6 border border-white/5", children: [_jsxs("h3", { className: "text-lg font-bold text-white mb-6 flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-gray-500", children: "history" }), "Recent Activity"] }), _jsx("div", { className: "space-y-4", children: displayActivity.map((activity, idx) => (_jsxs("div", { className: "flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group", children: [_jsx("div", { className: `p-2 rounded-lg bg-white/5 ${activity.color} group-hover:scale-110 transition-transform`, children: _jsx("span", { className: "material-symbols-outlined text-xl", children: activity.icon }) }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-white font-medium", children: activity.action }), _jsx("p", { className: "text-gray-500 text-sm", children: activity.detail })] }), _jsx("span", { className: "text-gray-600 text-xs", children: activity.time })] }, idx))) })] }), _jsxs("div", { className: "bg-gradient-to-br from-[#151F26] to-[#0B1116] rounded-2xl p-6 border border-white/5 relative overflow-hidden", children: [_jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-[#10b981]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" }), _jsxs("h3", { className: "text-lg font-bold text-white mb-6 flex items-center gap-2 relative z-10", children: [_jsx("span", { className: "material-symbols-outlined text-[#10b981]", children: "eco" }), "Environmental Impact"] }), _jsxs("div", { className: "space-y-6 relative z-10", children: [_jsxs("div", { className: "flex items-center gap-4 p-4 bg-white/5 rounded-xl", children: [_jsx("div", { className: "p-3 bg-[#10b981]/10 rounded-xl", children: _jsx("span", { className: "material-symbols-outlined text-[#10b981] text-2xl", children: "forest" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-3xl font-black text-white", children: treesEquivalent.toLocaleString() }), _jsx("p", { className: "text-sm text-slate-400", children: "Trees Equivalent Saved" })] })] }), _jsxs("div", { className: "flex items-center gap-4 p-4 bg-white/5 rounded-xl", children: [_jsx("div", { className: "p-3 bg-[#06b6d4]/10 rounded-xl", children: _jsx("span", { className: "material-symbols-outlined text-[#06b6d4] text-2xl", children: "water_drop" }) }), _jsxs("div", { children: [_jsxs("p", { className: "text-3xl font-black text-white", children: [waterConserved.toLocaleString(), " ", _jsx("span", { className: "text-lg font-medium text-gray-500", children: "L" })] }), _jsx("p", { className: "text-sm text-slate-400", children: "Water Conserved" })] })] }), _jsxs("div", { className: "flex items-center gap-4 p-4 bg-white/5 rounded-xl", children: [_jsx("div", { className: "p-3 bg-amber-500/10 rounded-xl", children: _jsx("span", { className: "material-symbols-outlined text-amber-400 text-2xl", children: "bolt" }) }), _jsxs("div", { children: [_jsxs("p", { className: "text-3xl font-black text-white", children: [energySaved.toLocaleString(), " ", _jsx("span", { className: "text-lg font-medium text-gray-500", children: "kWh" })] }), _jsx("p", { className: "text-sm text-slate-400", children: "Energy Saved" })] })] })] })] })] })] }))] }) })] })] }), showTargetModal && (_jsx("div", { className: "fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4", onClick: () => setShowTargetModal(false), children: _jsxs("div", { className: "bg-[#151F26] rounded-2xl w-full max-w-md border border-white/5 overflow-hidden", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b border-white/5", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 rounded-lg bg-amber-500/10 text-amber-400", children: _jsx("span", { className: "material-symbols-outlined", children: "flag" }) }), _jsx("h3", { className: "text-white font-bold text-lg", children: "Set Monthly Target" })] }), _jsx("button", { onClick: () => setShowTargetModal(false), className: "p-2 rounded-lg hover:bg-white/5 transition-colors text-slate-400 hover:text-white", children: _jsx("span", { className: "material-symbols-outlined", children: "close" }) })] }), _jsxs("div", { className: "p-6", children: [_jsx("p", { className: "text-slate-400 text-sm mb-4", children: "Set your monthly e-waste disposal target in kilograms. This helps track your progress on the analytics chart." }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-sm font-medium text-gray-200 mb-2", children: "Monthly Target (kg)" }), _jsx("input", { type: "number", value: editTarget, onChange: (e) => setEditTarget(Math.max(0, parseInt(e.target.value) || 0)), className: "w-full bg-[#0B1116] border border-white/5 rounded-xl px-4 py-3 text-white text-lg font-bold focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none", min: "0", step: "50" })] }), _jsx("div", { className: "grid grid-cols-4 gap-2 mb-6", children: [100, 200, 500, 1000].map(val => (_jsxs("button", { onClick: () => setEditTarget(val), className: `px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${editTarget === val ? 'bg-amber-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/5'}`, children: [val, " kg"] }, val))) }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => setShowTargetModal(false), className: "flex-1 bg-white/10 text-white px-4 py-3 rounded-xl font-bold hover:bg-white/20 transition-colors", children: "Cancel" }), _jsx("button", { onClick: handleSaveTarget, disabled: savingTarget, className: "flex-1 bg-amber-500 text-white px-4 py-3 rounded-xl font-bold hover:bg-amber-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2", children: savingTarget ? (_jsxs(_Fragment, { children: [_jsx(Loader, { size: "sm", color: "white" }), "Saving..."] })) : (_jsxs(_Fragment, { children: [_jsx("span", { className: "material-symbols-outlined text-lg", children: "check" }), "Save Target"] })) })] })] })] }) }))] }) }));
};
export default BusinessAnalytics;
