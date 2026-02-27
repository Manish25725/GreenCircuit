import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api.js';
import { useNavigate } from 'react-router-dom';
const NotificationBell = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, []);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);
    const fetchNotifications = async () => {
        try {
            const response = await api.getNotifications(false);
            const latest = (response.notifications || []).slice(0, 5);
            setNotifications(latest);
            setUnreadCount(response.unreadCount || 0);
        }
        catch (error) {
        }
    };
    const markAsRead = async (id) => {
        try {
            await api.markNotificationRead(id);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
        catch (error) {
        }
    };
    const getNotificationIcon = (type) => {
        const icons = {
            booking: 'event_available',
            reward: 'stars',
            system: 'info',
            agency: 'business',
            promotion: 'local_offer',
            admin: 'admin_panel_settings',
            account: 'account_circle',
            alert: 'warning',
            success: 'check_circle',
            info: 'info'
        };
        return icons[type] || 'notifications';
    };
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        if (minutes < 1)
            return 'Just now';
        if (minutes < 60)
            return `${minutes}m`;
        if (hours < 24)
            return `${hours}h`;
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };
    return (_jsxs("div", { className: "relative", ref: dropdownRef, children: [_jsxs("button", { onClick: () => setIsOpen(!isOpen), className: "relative flex items-center justify-center size-10 rounded-xl bg-white/5 border border-white/5 hover:bg-white/5 hover:border-[#34D399]/30 transition-all", children: [_jsx("span", { className: "material-symbols-outlined text-gray-300", children: "notifications" }), unreadCount > 0 && (_jsx("span", { className: "absolute -top-1 -right-1 size-5 rounded-full bg-gradient-to-br from-[#34D399] to-[#059669] flex items-center justify-center text-white text-[10px] font-bold shadow-lg shadow-[#34D399]/30 animate-pulse", children: unreadCount > 9 ? '9+' : unreadCount }))] }), isOpen && (_jsxs("div", { className: "absolute right-0 mt-2 w-96 bg-[#15202e] backdrop-blur-xl rounded-2xl border border-white/5 shadow-2xl shadow-black/50 z-50 overflow-hidden", children: [_jsx("div", { className: "p-4 border-b border-white/5 bg-gradient-to-r from-[#34D399]/5 to-[#059669]/5", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-white font-semibold text-lg", children: "Notifications" }), unreadCount > 0 && (_jsxs("span", { className: "px-2 py-1 rounded-lg bg-[#34D399]/10 border border-[#34D399]/30 text-[#34D399] text-xs font-medium", children: [unreadCount, " new"] }))] }) }), _jsx("div", { className: "max-h-96 overflow-y-auto", children: notifications.length === 0 ? (_jsxs("div", { className: "p-8 text-center", children: [_jsx("span", { className: "material-symbols-outlined text-5xl text-slate-600 mb-2 block", children: "notifications_off" }), _jsx("p", { className: "text-slate-400 text-sm", children: "No notifications yet" })] })) : (_jsx("div", { className: "divide-y divide-white/5", children: notifications.map((notification) => (_jsx("div", { onClick: () => {
                                    if (!notification.isRead)
                                        markAsRead(notification._id);
                                }, className: `
                      p-4 hover:bg-white/5 transition-colors cursor-pointer
                      ${!notification.isRead ? 'bg-[#34D399]/5' : ''}
                    `, children: _jsxs("div", { className: "flex gap-3", children: [_jsx("div", { className: `
                        flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
                        ${notification.isRead
                                                ? 'bg-slate-700/50'
                                                : 'bg-gradient-to-br from-[#34D399] to-[#059669]'}
                      `, children: _jsx("span", { className: `material-symbols-outlined text-lg ${notification.isRead ? 'text-slate-400' : 'text-white'}`, children: getNotificationIcon(notification.type) }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-start justify-between gap-2 mb-1", children: [_jsx("h4", { className: `font-medium text-sm leading-tight line-clamp-1 ${notification.isRead ? 'text-gray-200' : 'text-white'}`, children: notification.title }), !notification.isRead && (_jsx("div", { className: "w-2 h-2 rounded-full bg-[#34D399] flex-shrink-0 mt-1" }))] }), _jsx("p", { className: `text-xs leading-relaxed line-clamp-2 ${notification.isRead ? 'text-slate-500' : 'text-slate-400'}`, children: notification.message }), _jsxs("div", { className: "flex items-center gap-2 mt-1", children: [_jsx("span", { className: "text-xs text-slate-600", children: formatTime(notification.createdAt) }), notification.priority === 'high' && (_jsxs("span", { className: "inline-flex items-center gap-0.5 text-xs text-red-400", children: [_jsx("span", { className: "material-symbols-outlined text-sm", children: "priority_high" }), "High"] }))] })] })] }) }, notification._id))) })) }), notifications.length > 0 && (_jsx("div", { className: "p-3 border-t border-white/5 bg-[#0f1729]", children: _jsx("button", { onClick: () => {
                                setIsOpen(false);
                                navigate('/notifications');
                            }, className: "w-full py-2 text-center text-[#34D399] text-sm font-medium hover:text-[#6EE7B7] transition-colors", children: "View All Notifications" }) }))] }))] }));
};
export default NotificationBell;
