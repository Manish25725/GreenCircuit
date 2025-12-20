import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import Loader from './Loader';

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  priority?: string;
}

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.getNotifications(filter === 'unread');
      setNotifications(response.notifications || []);
      setUnreadCount(response.unreadCount || 0);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, string> = {
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

  const getNotificationColor = (type: string, priority?: string) => {
    if (priority === 'high') return 'from-red-500/20 to-orange-500/20 border-red-500/30';
    
    const colors: Record<string, string> = {
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

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader size="md" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="material-symbols-outlined text-4xl text-[#34D399]">notifications</span>
            Notifications
          </h1>
          <p className="text-slate-400 mt-1">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}
            className="px-4 py-2 rounded-xl bg-[#0f1729] border border-white/10 hover:border-[#34D399]/50 text-white text-sm font-medium transition-all"
          >
            {filter === 'all' ? 'Show Unread' : 'Show All'}
          </button>
          
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 rounded-xl bg-[#34D399]/10 border border-[#34D399]/30 hover:bg-[#34D399]/20 text-[#34D399] text-sm font-medium transition-all"
            >
              Mark All Read
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="bg-[#15202e]/80 backdrop-blur-xl rounded-2xl p-12 border border-white/5 text-center">
          <span className="material-symbols-outlined text-6xl text-slate-600 mb-4 block">notifications_off</span>
          <h3 className="text-xl font-semibold text-white mb-2">No notifications</h3>
          <p className="text-slate-400">
            {filter === 'unread' ? "You're all caught up!" : "You haven't received any notifications yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              onClick={() => !notification.isRead && markAsRead(notification._id)}
              className={`
                relative bg-[#15202e]/80 backdrop-blur-xl rounded-2xl p-5 border transition-all cursor-pointer
                ${notification.isRead 
                  ? 'border-white/5 hover:border-white/10' 
                  : `bg-gradient-to-r ${getNotificationColor(notification.type, notification.priority)} border hover:scale-[1.01]`
                }
                group
              `}
            >
              {/* Unread indicator */}
              {!notification.isRead && (
                <div className="absolute top-5 right-5">
                  <div className="w-3 h-3 rounded-full bg-[#34D399] animate-pulse ring-4 ring-[#34D399]/20"></div>
                </div>
              )}

              <div className="flex gap-4">
                {/* Icon */}
                <div className={`
                  flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center
                  ${notification.isRead 
                    ? 'bg-slate-700/50' 
                    : 'bg-gradient-to-br from-[#34D399] to-[#059669] shadow-lg shadow-[#34D399]/20'
                  }
                `}>
                  <span className={`material-symbols-outlined text-2xl ${notification.isRead ? 'text-slate-400' : 'text-white'}`}>
                    {getNotificationIcon(notification.type)}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h3 className={`font-semibold text-base leading-tight ${notification.isRead ? 'text-slate-300' : 'text-white'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-slate-500 whitespace-nowrap">
                      {formatTimestamp(notification.createdAt)}
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed ${notification.isRead ? 'text-slate-400' : 'text-slate-300'}`}>
                    {notification.message}
                  </p>

                  {/* Type badge */}
                  <div className="flex items-center gap-2 mt-3">
                    <span className={`
                      inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium
                      ${notification.isRead 
                        ? 'bg-slate-700/50 text-slate-400' 
                        : 'bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/20'
                      }
                    `}>
                      {notification.type}
                    </span>
                    {notification.priority === 'high' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                        <span className="material-symbols-outlined text-sm">priority_high</span>
                        High Priority
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Hover effect */}
              {!notification.isRead && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#34D399]/5 to-[#059669]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
