import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import Loader from './Loader.jsx';
const NotificationPanel = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    useEffect(() => {
        fetchNotifications();
    }, [filter]);
    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await api.getNotifications(filter === 'unread');
            setNotifications(response.notifications || []);
            setUnreadCount(response.unreadCount || 0);
        }
        catch (error) {
        }
        finally {
            setLoading(false);
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
    const markAllAsRead = async () => {
        try {
            await api.markAllNotificationsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
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
    const getNotificationColor = (type, priority) => {
        if (priority === 'high')
            return 'from-red-500/20 to-orange-500/20 border-red-500/30';
        const colors = {
            booking: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
            reward: 'from-amber-500/20 to-yellow-500/20 border-amber-500/30',
            system: 'from-gray-500/20 to-slate-500/20 border-gray-500/30',
            agency: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
            promotion: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
            admin: 'from-red-500/20 to-pink-500/20 border-red-500/30',
            account: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30',
            alert: 'from-red-500/20 to-orange-500/20 border-red-500/30',
            success: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
            info: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30'
        };
        return colors[type] || 'from-gray-500/20 to-slate-500/20 border-gray-500/30';
    };
    const formatTimestamp = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        if (minutes < 1)
            return 'Just now';
        if (minutes < 60)
            return `${minutes}m ago`;
        if (hours < 24)
            return `${hours}h ago`;
        if (days < 7)
            return `${days}d ago`;
        return date.toLocaleDateString();
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center py-20", children: _jsx(Loader, { size: "md" }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4", children: [_jsx("div", { children: _jsx("p", { className: "text-slate-400", children: unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!' }) }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => setFilter(filter === 'all' ? 'unread' : 'all'), className: "px-4 py-2 rounded-xl bg-[#0f1729] border border-white/5 hover:border-[#34D399]/50 text-white text-sm font-medium transition-all", children: filter === 'all' ? 'Show Unread' : 'Show All' }), unreadCount > 0 && (_jsx("button", { onClick: markAllAsRead, className: "px-4 py-2 rounded-xl bg-[#34D399]/10 border border-[#34D399]/30 hover:bg-[#34D399]/20 text-[#34D399] text-sm font-medium transition-all", children: "Mark All Read" }))] })] }), notifications.length === 0 ? (_jsxs("div", { className: "bg-[#15202e]/80 backdrop-blur-xl rounded-2xl p-12 border border-white/5 text-center", children: [_jsx("span", { className: "material-symbols-outlined text-6xl text-slate-600 mb-4 block", children: "notifications_off" }), _jsx("h3", { className: "text-xl font-semibold text-white mb-2", children: "No notifications" }), _jsx("p", { className: "text-slate-400", children: filter === 'unread' ? "You're all caught up!" : "You haven't received any notifications yet." })] })) : (_jsx("div", { className: "space-y-3", children: notifications.map((notification) => (_jsxs("div", { onClick: () => !notification.isRead && markAsRead(notification._id), className: `
                relative bg-[#15202e]/80 backdrop-blur-xl rounded-2xl p-5 border transition-all cursor-pointer
                ${notification.isRead
                        ? 'border-white/5 hover:border-white/5'
                        : `bg-gradient-to-r ${getNotificationColor(notification.type, notification.priority)} border hover:scale-[1.01]`}
                group
              `, children: [!notification.isRead && (_jsx("div", { className: "absolute top-5 right-5", children: _jsx("div", { className: "w-3 h-3 rounded-full bg-[#34D399] animate-pulse ring-4 ring-[#34D399]/20" }) })), _jsxs("div", { className: "flex gap-4", children: [_jsx("div", { className: `
                  flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center
                  ${notification.isRead
                                        ? 'bg-slate-700/50'
                                        : 'bg-gradient-to-br from-[#34D399] to-[#059669] shadow-lg shadow-[#34D399]/20'}
                `, children: _jsx("span", { className: `material-symbols-outlined text-2xl ${notification.isRead ? 'text-slate-400' : 'text-white'}`, children: getNotificationIcon(notification.type) }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-start justify-between gap-3 mb-1", children: [_jsx("h3", { className: `font-semibold text-base leading-tight ${notification.isRead ? 'text-gray-200' : 'text-white'}`, children: notification.title }), _jsx("span", { className: "text-xs text-slate-500 whitespace-nowrap", children: formatTimestamp(notification.createdAt) })] }), _jsx("p", { className: `text-sm leading-relaxed ${notification.isRead ? 'text-slate-400' : 'text-gray-200'}`, children: notification.message }), _jsxs("div", { className: "flex items-center gap-2 mt-3", children: [_jsx("span", { className: `
                      inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium
                      ${notification.isRead
                                                        ? 'bg-slate-700/50 text-slate-400'
                                                        : 'bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/20'}
                    `, children: notification.type }), notification.priority === 'high' && (_jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20", children: [_jsx("span", { className: "material-symbols-outlined text-sm", children: "priority_high" }), "High Priority"] }))] })] })] }), !notification.isRead && (_jsx("div", { className: "absolute inset-0 rounded-2xl bg-gradient-to-r from-[#34D399]/5 to-[#059669]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" }))] }, notification._id))) }))] }));
};
export default NotificationPanel;
