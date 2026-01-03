import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  priority?: string;
}

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
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

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center size-10 rounded-xl bg-white/5 border border-white/5 hover:bg-white/5 hover:border-[#34D399]/30 transition-all"
      >
        <span className="material-symbols-outlined text-gray-300">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 size-5 rounded-full bg-gradient-to-br from-[#34D399] to-[#059669] flex items-center justify-center text-white text-[10px] font-bold shadow-lg shadow-[#34D399]/30 animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-[#15202e] backdrop-blur-xl rounded-2xl border border-white/5 shadow-2xl shadow-black/50 z-50 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-white/5 bg-gradient-to-r from-[#34D399]/5 to-[#059669]/5">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold text-lg">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="px-2 py-1 rounded-lg bg-[#34D399]/10 border border-[#34D399]/30 text-[#34D399] text-xs font-medium">
                  {unreadCount} new
                </span>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <span className="material-symbols-outlined text-5xl text-slate-600 mb-2 block">notifications_off</span>
                <p className="text-slate-400 text-sm">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => {
                      if (!notification.isRead) markAsRead(notification._id);
                    }}
                    className={`
                      p-4 hover:bg-white/5 transition-colors cursor-pointer
                      ${!notification.isRead ? 'bg-[#34D399]/5' : ''}
                    `}
                  >
                    <div className="flex gap-3">
                      <div className={`
                        flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
                        ${notification.isRead 
                          ? 'bg-slate-700/50' 
                          : 'bg-gradient-to-br from-[#34D399] to-[#059669]'
                        }
                      `}>
                        <span className={`material-symbols-outlined text-lg ${notification.isRead ? 'text-slate-400' : 'text-white'}`}>
                          {getNotificationIcon(notification.type)}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className={`font-medium text-sm leading-tight line-clamp-1 ${notification.isRead ? 'text-gray-200' : 'text-white'}`}>
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <div className="w-2 h-2 rounded-full bg-[#34D399] flex-shrink-0 mt-1"></div>
                          )}
                        </div>
                        <p className={`text-xs leading-relaxed line-clamp-2 ${notification.isRead ? 'text-slate-500' : 'text-slate-400'}`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-600">
                            {formatTime(notification.createdAt)}
                          </span>
                          {notification.priority === 'high' && (
                            <span className="inline-flex items-center gap-0.5 text-xs text-red-400">
                              <span className="material-symbols-outlined text-sm">priority_high</span>
                              High
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-white/5 bg-[#0f1729]">
              <button
                onClick={() => {
                  setIsOpen(false);
                  window.location.hash = '#/notifications';
                }}
                className="w-full py-2 text-center text-[#34D399] text-sm font-medium hover:text-[#6EE7B7] transition-colors"
              >
                View All Notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
