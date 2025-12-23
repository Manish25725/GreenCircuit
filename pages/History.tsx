import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { api, getCurrentUser, Booking } from '../services/api';

const History = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const user = getCurrentUser();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response: any = await api.getUserBookings();
      const data = response?.bookings || response || [];
      setBookings(data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20';
      case 'in-progress': return 'text-[#3b82f6] bg-[#3b82f6]/10 border-[#3b82f6]/20';
      case 'confirmed': return 'text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/20';
      case 'pending': return 'text-[#94a3b8] bg-[#94a3b8]/10 border-[#94a3b8]/20';
      case 'cancelled': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-[#94a3b8] bg-[#94a3b8]/10 border-[#94a3b8]/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return 'check_circle';
      case 'in-progress': return 'local_shipping';
      case 'confirmed': return 'verified';
      case 'pending': return 'pending';
      case 'cancelled': return 'cancel';
      default: return 'help';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  const stats = {
    total: bookings.length,
    completed: bookings.filter(b => b.status === 'completed').length,
    pending: bookings.filter(b => b.status === 'pending' || b.status === 'confirmed' || b.status === 'in-progress').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length
  };

  return (
    <Layout title="" role="User" fullWidth hideSidebar>
      <div className="bg-[#0B1116] font-sans text-gray-200 antialiased selection:bg-[#10b981] selection:text-white min-h-screen">
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
          {/* Background Effects */}
          <div className="fixed top-0 left-0 w-full h-[500px] bg-[#10b981]/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
          <div className="fixed bottom-0 right-0 w-full h-[500px] bg-[#3b82f6]/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none"></div>
          
          <div className="layout-container flex h-full grow flex-col relative z-10">
            {/* Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50">
              <div className="flex items-center gap-3 text-white cursor-pointer" onClick={() => window.location.hash = '#/dashboard'}>
                <div className="p-2 bg-[#10b981]/10 rounded-lg">
                  <svg className="h-6 w-6 text-[#10b981]" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"></path>
                  </svg>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white">EcoCycle <span className="text-[#10b981]">Resident</span></h2>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => window.location.hash = '#/profile'}
                  className="hidden sm:flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-[#151F26] border border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"
                >
                  <div 
                    className="size-8 rounded-full bg-cover bg-center ring-2 ring-white/10 group-hover:ring-[#10b981]/50 transition-all" 
                    style={{ backgroundImage: `url("${user?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User') + '&background=10b981&color=fff'}")` }}
                  ></div>
                  <span className="text-sm font-medium text-gray-200">{user?.name || 'User'}</span>
                </button>
                <button 
                  onClick={() => window.location.hash = '#/notifications'}
                  className="relative p-2.5 rounded-full bg-[#151F26] border border-white/5 text-[#3b82f6] hover:text-[#3b82f6] hover:bg-[#3b82f6]/10 transition-colors"
                >
                  <span className="absolute top-2.5 right-3 size-2 bg-red-500 rounded-full border-2 border-[#151F26]"></span>
                  <span className="material-symbols-outlined text-[20px]">notifications</span>
                </button>
              </div>
            </header>

            <main className="flex flex-1 justify-center py-5 mt-24">
              <div className="layout-content-container flex flex-col w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button 
                  onClick={() => window.history.back()}
                  className="flex items-center gap-2 text-[#10b981] hover:text-[#059669] transition-colors mb-6 group w-fit"
                >
                  <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                  <span className="text-sm font-medium">Back to Dashboard</span>
                </button>
                
                {/* Page Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 py-8">
                  <div>
                    <h1 className="text-white text-4xl sm:text-5xl font-black leading-tight tracking-tighter mb-2 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                      Pickup History
                    </h1>
                    <p className="text-[#94a3b8] text-lg">Track all your e-waste recycling requests</p>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-[#151F26] rounded-xl p-4 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-[#10b981]/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#10b981]">recycling</span>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{stats.total}</p>
                        <p className="text-xs text-gray-400">Total Pickups</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#151F26] rounded-xl p-4 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-[#10b981]/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#10b981]">check_circle</span>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{stats.completed}</p>
                        <p className="text-xs text-gray-400">Completed</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#151F26] rounded-xl p-4 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-[#f59e0b]/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#f59e0b]">pending</span>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{stats.pending}</p>
                        <p className="text-xs text-gray-400">In Progress</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#151F26] rounded-xl p-4 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-red-400">cancel</span>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{stats.cancelled}</p>
                        <p className="text-xs text-gray-400">Cancelled</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                  {['all', 'pending', 'confirmed', 'in-progress', 'completed', 'cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilter(status)}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                        filter === status 
                          ? 'bg-[#10b981] text-white' 
                          : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                    </button>
                  ))}
                </div>

                {/* Bookings List */}
                <div className="bg-[#151F26] rounded-2xl border border-white/5 overflow-hidden">
                  {loading ? (
                    <div className="flex items-center justify-center py-20">
                      <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#10b981] border-t-transparent"></div>
                    </div>
                  ) : filteredBookings.length === 0 ? (
                    <div className="text-center py-20">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl text-gray-500">inbox</span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">No Pickups Found</h3>
                      <p className="text-gray-400 mb-6">
                        {filter === 'all' 
                          ? "You haven't scheduled any pickups yet."
                          : `No ${filter} pickups found.`}
                      </p>
                      {filter === 'all' && (
                        <button 
                          onClick={() => window.location.hash = '#/search'}
                          className="bg-[#10b981] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#059669] transition-colors inline-flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined">add</span>
                          Schedule Your First Pickup
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="divide-y divide-white/5">
                      {filteredBookings.map((booking) => (
                        <div 
                          key={booking._id} 
                          className="p-6 hover:bg-white/5 transition-colors cursor-pointer"
                          onClick={() => window.location.hash = `#/pickup-confirmation?booking=${booking._id}`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className={`p-3 rounded-xl ${getStatusColor(booking.status)}`}>
                                <span className="material-symbols-outlined">{getStatusIcon(booking.status)}</span>
                              </div>
                              <div>
                                <div className="flex items-center gap-3 mb-1">
                                  <h3 className="text-white font-bold">
                                    {booking.bookingId || `#REQ-${booking._id?.slice(-6).toUpperCase()}`}
                                  </h3>
                                  <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${getStatusColor(booking.status)}`}>
                                    {booking.status}
                                  </span>
                                </div>
                                <p className="text-gray-400 text-sm mb-2">
                                  {formatDate(booking.scheduledDate)} • {booking.scheduledTime || 'TBD'}
                                </p>
                                <p className="text-gray-500 text-sm">
                                  {typeof booking.agencyId === 'object' ? booking.agencyId.name : 'Agency Assigned'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-[#10b981] font-bold">+{booking.ecoPointsEarned || 0}</p>
                                <p className="text-xs text-gray-500">Eco Points</p>
                              </div>
                              <span className="material-symbols-outlined text-gray-500">chevron_right</span>
                            </div>
                          </div>
                          
                          {/* Items Preview */}
                          {booking.items && booking.items.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-white/5">
                              <div className="flex flex-wrap gap-2">
                                {booking.items.slice(0, 3).map((item, idx) => (
                                  <span key={idx} className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-300">
                                    {item.quantity}x {item.type}
                                  </span>
                                ))}
                                {booking.items.length > 3 && (
                                  <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-500">
                                    +{booking.items.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Action */}
                {!loading && filteredBookings.length > 0 && (
                  <div className="mt-8 text-center">
                    <button 
                      onClick={() => window.location.hash = '#/search'}
                      className="bg-[#10b981] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#059669] transition-colors inline-flex items-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                    >
                      <span className="material-symbols-outlined">add</span>
                      Schedule New Pickup
                    </button>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default History;
