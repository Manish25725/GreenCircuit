import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { api, getCurrentUser } from '../services/api';
import NotificationBell from '../components/NotificationBell';

const AdminDashboard = () => {
  const [user, setUser] = useState(getCurrentUser());
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingPartners: 0,
    verifiedPartners: 0,
    totalBookings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      console.log('Dashboard response:', response.data);
      const data = response.data?.data || response.data;
      setStats({
        totalUsers: data?.users?.total || 0,
        pendingPartners: data?.agencies?.pending || 0,
        verifiedPartners: data?.agencies?.total || 0,
        totalBookings: data?.bookings?.total || 0
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    window.location.hash = '#/login';
  };

  return (
    <Layout title="" role="Admin" fullWidth hideSidebar>
      <div className="bg-gradient-to-br from-[#1a0b1e] via-[#0B1116] to-[#1a0b1e] font-sans text-gray-200 antialiased selection:bg-pink-500 selection:text-white min-h-screen">
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
          {/* Pink gradient effects */}
          <div className="fixed top-0 left-0 w-full h-[500px] bg-pink-500/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
          <div className="fixed bottom-0 right-0 w-full h-[500px] bg-purple-500/10 rounded-full blur-[120px] translate-y-1/2 pointer-events-none"></div>
          
          <div className="layout-container flex h-full grow flex-col relative z-10">
            {/* Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 transition-all duration-300">
              <div className="flex items-center gap-3 text-white cursor-pointer" onClick={() => window.location.hash = '#/'}>
                <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg shadow-lg">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"></path>
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-white">EcoCycle Admin</h2>
                  <p className="text-xs text-pink-400">Platform Management</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="hidden sm:block">
                  <NotificationBell />
                </div>
                
                <div className="hidden sm:flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-600/20 border border-pink-500/30 hover:border-pink-500/50 transition-colors group">
                  <div className="size-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center ring-2 ring-pink-500/50 group-hover:ring-pink-500 transition-all text-white font-bold text-sm">
                    A
                  </div>
                  <span className="text-sm font-medium text-white">Admin</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="hidden sm:flex items-center justify-center size-10 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-colors"
                >
                  <span className="material-symbols-outlined text-red-400">logout</span>
                </button>
              </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 px-4 sm:px-6 lg:px-10 pt-24 pb-10">
              <div className="max-w-7xl mx-auto space-y-8">
                {/* Welcome Section */}
                <div className="mb-8">
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                  <p className="text-gray-400 text-sm sm:text-base">Welcome back! Here's what's happening on your platform today.</p>
                </div>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {/* Total Users */}
                  <div className="group relative bg-gradient-to-br from-[#1E293B]/80 to-[#0B1116]/80 backdrop-blur-sm border border-pink-500/20 rounded-2xl p-6 hover:border-pink-500/40 transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-pink-500/10 transition-all"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-xl group-hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined text-pink-400">group</span>
                        </div>
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-1">{stats.totalUsers.toLocaleString()}</h3>
                      <p className="text-gray-400 text-sm font-medium">Total Users</p>
                    </div>
                  </div>

                  {/* Pending Partner Approvals */}
                  <div 
                    className="group relative bg-gradient-to-br from-[#1E293B]/80 to-[#0B1116]/80 backdrop-blur-sm border border-pink-500/30 rounded-2xl p-6 hover:border-pink-500/50 transition-all duration-300 cursor-pointer overflow-hidden"
                    onClick={() => window.location.hash = '#/admin/partners'}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-pink-500/20 transition-all"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-gradient-to-br from-pink-500/30 to-pink-600/30 rounded-xl group-hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined text-pink-300">verified_user</span>
                        </div>
                        {stats.pendingPartners > 0 && (
                          <span className="flex items-center text-xs font-bold text-[#0B1116] bg-pink-400 px-2 py-1 rounded-full animate-pulse">
                            ACTION
                          </span>
                        )}
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-1">{stats.pendingPartners}</h3>
                      <p className="text-pink-400 text-sm font-medium flex items-center gap-1">
                        Pending Partner Approvals <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </p>
                    </div>
                  </div>

                  {/* Verified Partners */}
                  <div className="group relative bg-gradient-to-br from-[#1E293B]/80 to-[#0B1116]/80 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-all duration-300 overflow-hidden cursor-pointer"
                    onClick={() => window.location.hash = '#/admin/agencies'}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-purple-500/10 transition-all"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-xl group-hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined text-purple-400">domain</span>
                        </div>
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-1">{stats.verifiedPartners}</h3>
                      <p className="text-gray-400 text-sm font-medium">Verified Partners</p>
                    </div>
                  </div>

                  {/* Total Bookings */}
                  <div className="group relative bg-gradient-to-br from-[#1E293B]/80 to-[#0B1116]/80 backdrop-blur-sm border border-pink-500/20 rounded-2xl p-6 hover:border-pink-500/40 transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-pink-500/10 transition-all"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-xl group-hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined text-pink-400">local_shipping</span>
                        </div>
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-1">{stats.totalBookings}</h3>
                      <p className="text-gray-400 text-sm font-medium">Total Bookings</p>
                    </div>
                  </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Quick Actions */}
                  <div className="bg-gradient-to-br from-[#1E293B]/60 to-[#0B1116]/60 backdrop-blur-sm border border-pink-500/20 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/20">
                        <span className="material-symbols-outlined text-pink-400">bolt</span>
                      </div>
                      <h3 className="text-lg font-bold text-white">Quick Actions</h3>
                    </div>
                    <div className="space-y-3">
                      <button 
                        onClick={() => window.location.hash = '#/admin/partners'}
                        className="w-full flex items-center justify-between gap-3 p-4 rounded-xl hover:bg-pink-500/10 text-gray-300 hover:text-white transition-all border border-white/5 hover:border-pink-500/30 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-pink-500/20 text-pink-400 p-2 rounded-lg group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-[20px]">verified_user</span>
                          </div>
                          <div className="text-left">
                            <span className="text-sm font-bold block">Review Partner Applications</span>
                            <span className="text-xs text-gray-500">{stats.pendingPartners} pending</span>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                      </button>
                      
                      <button 
                        onClick={() => window.location.hash = '#/admin/users'}
                        className="w-full flex items-center justify-between gap-3 p-4 rounded-xl hover:bg-purple-500/10 text-gray-300 hover:text-white transition-all border border-white/5 hover:border-purple-500/30 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-purple-500/20 text-purple-400 p-2 rounded-lg group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-[20px]">group</span>
                          </div>
                          <div className="text-left">
                            <span className="text-sm font-bold block">Manage Users</span>
                            <span className="text-xs text-gray-500">{stats.totalUsers} total users</span>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                      </button>
                      
                      <button 
                        onClick={() => window.location.hash = '#/admin/agencies'}
                        className="w-full flex items-center justify-between gap-3 p-4 rounded-xl hover:bg-pink-500/10 text-gray-300 hover:text-white transition-all border border-white/5 hover:border-pink-500/30 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-pink-500/20 text-pink-400 p-2 rounded-lg group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-[20px]">domain</span>
                          </div>
                          <div className="text-left">
                            <span className="text-sm font-bold block">View All Partners</span>
                            <span className="text-xs text-gray-500">{stats.verifiedPartners} verified</span>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                      </button>
                    </div>
                  </div>

                  {/* System Status */}
                  <div className="bg-gradient-to-br from-[#1E293B]/60 to-[#0B1116]/60 backdrop-blur-sm border border-pink-500/20 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/20">
                        <span className="material-symbols-outlined text-pink-400">dashboard</span>
                      </div>
                      <h3 className="text-lg font-bold text-white">System Overview</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                        <div className="flex items-center gap-3">
                          <div className="size-2 rounded-full bg-green-500 animate-pulse"></div>
                          <span className="text-sm font-medium text-white">Platform Status</span>
                        </div>
                        <span className="text-xs text-green-400 font-bold">Operational</span>
                      </div>
                      
                      <div className="p-3 rounded-lg border border-white/5">
                        <div className="flex justify-between mb-2">
                          <span className="text-xs text-gray-400">Active Sessions</span>
                          <span className="text-xs text-white font-medium">2,487</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-2">
                          <div className="bg-gradient-to-r from-pink-500 to-purple-400 h-2 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                      </div>
                      
                      <div className="p-3 rounded-lg border border-white/5">
                        <div className="flex justify-between mb-2">
                          <span className="text-xs text-gray-400">API Response Time</span>
                          <span className="text-xs text-white font-medium">142ms</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-2">
                          <div className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full" style={{ width: '20%' }}></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="p-3 rounded-lg border border-white/5 text-center">
                          <p className="text-2xl font-bold text-white">{stats.totalBookings}</p>
                          <p className="text-xs text-gray-400 mt-1">Total Bookings</p>
                        </div>
                        <div className="p-3 rounded-lg border border-white/5 text-center">
                          <p className="text-2xl font-bold text-pink-400">{stats.verifiedPartners}</p>
                          <p className="text-xs text-gray-400 mt-1">Active Partners</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;