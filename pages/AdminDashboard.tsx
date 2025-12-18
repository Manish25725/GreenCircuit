import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { api, getCurrentUser } from '../services/api';

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
      setStats({
        totalUsers: response.data.data.users.total,
        pendingPartners: response.data.data.agencies.pending,
        verifiedPartners: response.data.data.agencies.total,
        totalBookings: response.data.data.bookings.total
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
                <button 
                  onClick={() => window.location.hash = '#/notifications'}
                  className="hidden sm:flex items-center justify-center size-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors relative"
                >
                  <span className="material-symbols-outlined text-gray-300">notifications</span>
                  <span className="absolute top-2 right-2 size-2 rounded-full bg-pink-500 ring-2 ring-[#0B1116]"></span>
                </button>
                
                <button 
                  onClick={() => window.location.hash = '#/profile'}
                  className="hidden sm:flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-600/20 border border-pink-500/30 hover:border-pink-500/50 transition-colors group cursor-pointer"
                >
                  <div className="size-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center ring-2 ring-pink-500/50 group-hover:ring-pink-500 transition-all text-white font-bold text-sm">
                    {user?.name?.charAt(0) || 'A'}
                  </div>
                  <span className="text-sm font-medium text-white">{user?.name || 'Admin'}</span>
                </button>

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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Recent Activity */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Recent Activity Card */}
                    <div className="bg-gradient-to-br from-[#1E293B]/60 to-[#0B1116]/60 backdrop-blur-sm border border-pink-500/20 rounded-2xl overflow-hidden">
                      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-pink-500/5 to-purple-500/5">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/20">
                            <span className="material-symbols-outlined text-pink-400 text-sm">history</span>
                          </div>
                          <h3 className="text-lg font-bold text-white">Recent Activity</h3>
                        </div>
                        <button className="text-xs text-pink-400 hover:text-pink-300 font-medium transition-colors">View All</button>
                      </div>
                      
                      <div className="divide-y divide-white/5">
                        {/* Activity Item 1 */}
                        <div className="p-4 hover:bg-white/5 transition-colors flex items-start gap-4">
                          <div className="mt-1 relative">
                            <div className="size-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center border border-pink-500/30 text-white font-bold">
                              GE
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-0.5 border-2 border-[#1E293B]">
                              <span className="material-symbols-outlined text-[10px] text-black font-bold">priority_high</span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <p className="text-sm text-white font-medium">GreenEarth Recyclers <span className="font-normal text-gray-400">submitted a new</span> Verification Request</p>
                              <span className="text-xs text-gray-500 whitespace-nowrap ml-4">2 hrs ago</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Application for full e-waste processing license pending review.</p>
                            <div className="mt-3">
                              <button 
                                onClick={() => window.location.hash = '#/admin/vetting'}
                                className="text-xs bg-pink-500/10 text-pink-400 px-3 py-1.5 rounded-lg border border-pink-500/20 hover:bg-pink-500 hover:text-white transition-all font-semibold"
                              >
                                Review Application
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Activity Item 2 */}
                        <div className="p-4 hover:bg-white/5 transition-colors flex items-start gap-4">
                          <div className="mt-1 relative">
                            <div className="size-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center border border-purple-500/30 text-white font-bold">
                              UM
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5 border-2 border-[#1E293B]">
                              <span className="material-symbols-outlined text-[10px] text-white font-bold">edit</span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <p className="text-sm text-white font-medium">Urban Miners Co. <span className="font-normal text-gray-400">updated their</span> Pickup Slots</p>
                              <span className="text-xs text-gray-500 whitespace-nowrap ml-4">5 hrs ago</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Added 50 new slots for Zone B - Downtown District.</p>
                          </div>
                        </div>

                        {/* Activity Item 3 */}
                        <div className="p-4 hover:bg-white/5 transition-colors flex items-start gap-4">
                          <div className="mt-1 relative">
                            <div className="size-10 rounded-full bg-[#0B1116] flex items-center justify-center border border-pink-500/20">
                              <span className="material-symbols-outlined text-pink-400">person_add</span>
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 border-2 border-[#1E293B]">
                              <span className="material-symbols-outlined text-[10px] text-black font-bold">add</span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <p className="text-sm text-white font-medium">New User Registration</p>
                              <span className="text-xs text-gray-500 whitespace-nowrap ml-4">8 hrs ago</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Welcome <span className="text-pink-400 font-medium">Sarah Jenkins</span> to EcoCycle.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Collection Trends Chart */}
                    <div className="bg-gradient-to-br from-[#1E293B]/60 to-[#0B1116]/60 backdrop-blur-sm border border-pink-500/20 rounded-2xl p-6">
                      <h3 className="text-lg font-bold text-white mb-6">Weekly Collection Trends</h3>
                      <div className="h-48 flex items-end justify-between gap-2">
                        {[
                          { day: 'Mon', height: '40%', value: '120T' },
                          { day: 'Tue', height: '65%', value: '195T' },
                          { day: 'Wed', height: '85%', value: '255T', active: true },
                          { day: 'Thu', height: '55%', value: '165T' },
                          { day: 'Fri', height: '45%', value: '135T' },
                          { day: 'Sat', height: '30%', value: '90T' },
                          { day: 'Sun', height: '25%', value: '75T' }
                        ].map((bar, i) => (
                          <div key={i} className="w-full h-full flex flex-col justify-end group">
                            <div 
                              className={`w-full rounded-t-lg relative transition-all duration-300 ${
                                bar.active 
                                  ? 'bg-gradient-to-t from-pink-600 to-pink-400 shadow-lg shadow-pink-500/50' 
                                  : 'bg-gradient-to-t from-purple-900/40 to-purple-700/40 hover:from-pink-500/40 hover:to-pink-400/40'
                              }`}
                              style={{ height: bar.height }}
                            >
                              <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-pink-500/90 backdrop-blur text-white text-xs py-1 px-2 rounded-lg border border-pink-400/30 transition-opacity whitespace-nowrap pointer-events-none">
                                {bar.value}
                              </div>
                            </div>
                            <span className={`text-[10px] text-center mt-2 transition-colors ${bar.active ? 'text-pink-400 font-bold' : 'text-gray-500'}`}>
                              {bar.day}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Quick Actions & Info */}
                  <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-gradient-to-br from-[#1E293B]/60 to-[#0B1116]/60 backdrop-blur-sm border border-pink-500/20 rounded-2xl p-6">
                      <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                      <div className="space-y-2">
                        <button 
                          onClick={() => window.location.hash = '#/admin/partners'}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-pink-500/10 text-gray-400 hover:text-white transition-all border border-transparent hover:border-pink-500/20"
                        >
                          <div className="bg-pink-500/20 text-pink-400 p-2 rounded-lg">
                            <span className="material-symbols-outlined text-[20px]">add_business</span>
                          </div>
                          <span className="text-sm font-medium">Review Partners</span>
                        </button>
                        <button 
                          onClick={() => window.location.hash = '#/admin/users'}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-purple-500/10 text-gray-400 hover:text-white transition-all border border-transparent hover:border-purple-500/20"
                        >
                          <div className="bg-purple-500/20 text-purple-400 p-2 rounded-lg">
                            <span className="material-symbols-outlined text-[20px]">group</span>
                          </div>
                          <span className="text-sm font-medium">Manage Users</span>
                        </button>
                        <button 
                          onClick={() => window.location.hash = '#/admin/reports'}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-pink-500/10 text-gray-400 hover:text-white transition-all border border-transparent hover:border-pink-500/20"
                        >
                          <div className="bg-pink-500/20 text-pink-400 p-2 rounded-lg">
                            <span className="material-symbols-outlined text-[20px]">summarize</span>
                          </div>
                          <span className="text-sm font-medium">Generate Reports</span>
                        </button>
                      </div>
                    </div>

                    {/* Platform Health */}
                    <div className="bg-gradient-to-br from-[#1E293B]/60 to-[#0B1116]/60 backdrop-blur-sm border border-pink-500/20 rounded-2xl p-6">
                      <h3 className="text-lg font-bold text-white mb-4">Platform Health</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-xs text-gray-400">Server Load</span>
                            <span className="text-xs text-white font-medium">32%</span>
                          </div>
                          <div className="w-full bg-white/5 rounded-full h-2">
                            <div className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all" style={{ width: '32%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-xs text-gray-400">Storage Usage</span>
                            <span className="text-xs text-white font-medium">68%</span>
                          </div>
                          <div className="w-full bg-white/5 rounded-full h-2">
                            <div className="bg-gradient-to-r from-yellow-500 to-orange-400 h-2 rounded-full transition-all" style={{ width: '68%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-xs text-gray-400">API Response</span>
                            <span className="text-xs text-white font-medium">124ms</span>
                          </div>
                          <div className="w-full bg-white/5 rounded-full h-2">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all" style={{ width: '15%' }}></div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-3">
                        <div className="size-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xs text-white font-medium">All systems operational</span>
                      </div>
                    </div>

                    {/* Support Queue */}
                    <div className="relative bg-gradient-to-br from-pink-500/10 to-purple-600/10 border border-pink-500/30 rounded-2xl p-6 overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <span className="material-symbols-outlined text-6xl text-pink-400">support_agent</span>
                      </div>
                      <h3 className="text-white font-bold mb-1 relative z-10">Support Queue</h3>
                      <p className="text-xs text-gray-400 mb-4 relative z-10">12 unread tickets</p>
                      <div className="flex -space-x-2 mb-4 relative z-10">
                        <div className="size-8 rounded-full border-2 border-[#1E293B] bg-gradient-to-br from-pink-500 to-purple-600"></div>
                        <div className="size-8 rounded-full border-2 border-[#1E293B] bg-gradient-to-br from-purple-500 to-pink-600"></div>
                        <div className="size-8 rounded-full border-2 border-[#1E293B] bg-gradient-to-br from-pink-600 to-purple-500"></div>
                        <div className="size-8 rounded-full border-2 border-[#1E293B] bg-[#0B1116] flex items-center justify-center text-[10px] text-pink-400 font-bold">+9</div>
                      </div>
                      <button className="w-full py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-lg text-xs font-bold text-white transition-all relative z-10 shadow-lg">
                        Go to Support Portal
                      </button>
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