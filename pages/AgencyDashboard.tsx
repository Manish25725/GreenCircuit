import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { api, getCurrentUser, User, Booking } from '../services/api';

const AgencyDashboard = () => {
  const [user, setUser] = useState<User | null>(getCurrentUser()); 
  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllBookings, setShowAllBookings] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showActionModal, setShowActionModal] = useState<{booking: Booking, action: string} | null>(null);
  const [stats, setStats] = useState({
    totalPickups: 0,
    pendingPickups: 0,
    completedPickups: 0,
    totalWasteCollected: 0
  });

  useEffect(() => {
    loadAgencyData();
  }, []);

  const loadAgencyData = async () => {
    try {
      const userData = await api.getMe();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      try {
        const bookingsData: any = await api.getAgencyBookings();
        const bookings = bookingsData.bookings || bookingsData || [];
        setAllBookings(bookings);
        
        const active = bookings.filter((b: Booking) => 
          b.status === 'pending' || b.status === 'confirmed' || b.status === 'in-progress'
        );
        setActiveBookings(active || []);
        
        const completed = bookings.filter((b: Booking) => b.status === 'completed');
        const totalWaste = completed.reduce((sum: number, b: Booking) => {
          const items = b.items || [];
          return sum + items.reduce((itemSum: number, item: any) => itemSum + (item.quantity || 0), 0);
        }, 0);
        
        setStats({
          totalPickups: bookings.length,
          pendingPickups: active.length,
          completedPickups: completed.length,
          totalWasteCollected: totalWaste
        });
      } catch (e) {
        console.log('No bookings found');
      }
    } catch (error) {
      console.error('Failed to load agency data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    setActionLoading(bookingId);
    try {
      await api.updateBookingStatus(bookingId, newStatus);
      await loadAgencyData();
      setShowActionModal(null);
    } catch (error) {
      console.error('Failed to update booking status:', error);
      alert('Failed to update booking. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = () => {
    api.logout();
    window.location.hash = '#/login';
  };

  const formatDate = (date?: string) => {
    if (date) {
      return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
    return new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (time?: string) => {
    if (!time) return 'TBD';
    return time;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/20';
      case 'in-progress': return 'text-[#8b5cf6] bg-[#8b5cf6]/10 border-[#8b5cf6]/20';
      case 'confirmed': return 'text-[#3b82f6] bg-[#3b82f6]/10 border-[#3b82f6]/20';
      case 'pending': return 'text-[#94a3b8] bg-[#94a3b8]/10 border-[#94a3b8]/20';
      case 'cancelled': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-[#94a3b8] bg-[#94a3b8]/10 border-[#94a3b8]/20';
    }
  };

  const getNextAction = (status: string) => {
    switch (status) {
      case 'pending': return { label: 'Confirm Pickup', newStatus: 'confirmed', icon: 'verified', color: 'bg-[#3b82f6]' };
      case 'confirmed': return { label: 'Start Pickup', newStatus: 'in-progress', icon: 'local_shipping', color: 'bg-[#8b5cf6]' };
      case 'in-progress': return { label: 'Complete Pickup', newStatus: 'completed', icon: 'check_circle', color: 'bg-[#f59e0b]' };
      default: return null;
    }
  };

  const getTrackingSteps = (booking: Booking) => {
    if (!booking) return [];
    
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

  return (
    <Layout title="" role="Agency" fullWidth hideSidebar>
      <div className="bg-[#0B1116] font-sans text-gray-200 antialiased selection:bg-[#f59e0b] selection:text-white min-h-screen">
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
          <div className="fixed top-0 left-0 w-full h-[500px] bg-[#f59e0b]/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
          <div className="fixed bottom-0 right-0 w-full h-[500px] bg-[#8b5cf6]/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none"></div>
          
          <div className="layout-container flex h-full grow flex-col relative z-10">
            {/* Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 transition-all duration-300">
              <div className="flex items-center gap-3 text-white cursor-pointer" onClick={() => window.location.hash = '#/'}>
                <div className="p-2 bg-[#f59e0b]/10 rounded-lg">
                  <svg className="h-6 w-6 text-[#f59e0b]" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"></path>
                  </svg>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white">EcoCycle <span className="text-[#f59e0b]">Partner</span></h2>
              </div>
              <nav className="hidden md:flex flex-1 justify-center gap-1">
              </nav>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => window.location.hash = '#/notifications'}
                  className="p-2.5 rounded-full bg-[#151F26] border border-white/5 text-gray-400 hover:text-[#f59e0b] hover:bg-[#f59e0b]/10 transition-colors relative"
                  title="Notifications"
                >
                  <span className="material-symbols-outlined text-[20px]">notifications</span>
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#f59e0b] rounded-full"></span>
                </button>
                <button 
                    onClick={() => window.location.hash = '#/agency/profile'}
                    className="hidden sm:flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-[#151F26] border border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"
                >
                  <div className="size-8 rounded-full bg-[#f59e0b] flex items-center justify-center ring-2 ring-white/10 group-hover:ring-[#f59e0b]/50 transition-all text-white font-bold text-sm">
                    {user?.name?.charAt(0) || 'A'}
                  </div>
                  <span className="text-sm font-medium text-gray-200">{user?.name || 'Agency'}</span>
                </button>
                <button 
                  onClick={handleLogout}
                  className="p-2.5 rounded-full bg-[#151F26] border border-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Logout"
                >
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                </button>
              </div>
            </header>

            <main className="flex flex-1 justify-center py-5 mt-24">
              <div className="layout-content-container flex flex-col w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 py-8">
                  <div>
                    <p className="text-[#f59e0b] text-sm font-bold uppercase tracking-widest mb-2">Partner Portal</p>
                    <h1 className="text-white text-4xl sm:text-5xl font-black leading-tight tracking-tighter mb-2 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">Welcome, {user?.name?.split(' ')[0] || 'Partner'}!</h1>
                    <p className="text-[#94a3b8] text-lg">Manage your e-waste collection operations efficiently.</p>
                  </div>
                  <div className="flex items-center gap-3 bg-[#151F26]/50 p-1.5 pr-4 rounded-full border border-white/10 backdrop-blur-sm">
                    <div className="bg-[#f59e0b]/20 p-2 rounded-full text-[#f59e0b]">
                      <span className="material-symbols-outlined text-lg">calendar_today</span>
                    </div>
                    <span className="text-sm font-medium text-gray-300">{formatDate()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column */}
                  <div className="lg:col-span-8 flex flex-col gap-8">
                    
                    {/* Active Pickups Section */}
                    <section className="flex flex-col gap-5">
                      <div className="flex items-center justify-between">
                        <h2 className="text-white text-2xl font-bold tracking-tight flex items-center gap-3">
                          <span className="p-2 bg-[#8b5cf6]/10 rounded-lg text-[#8b5cf6]">
                            <span className="material-symbols-outlined">local_shipping</span>
                          </span>
                          {activeBookings.length > 0 ? `Active Pickups (${activeBookings.length})` : 'Pickup Queue'}
                        </h2>
                        {activeBookings.length > 0 && (
                          <span className="px-3 py-1 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] text-xs font-bold uppercase tracking-wider border border-[#f59e0b]/20 animate-pulse">Action Required</span>
                        )}
                      </div>

                      <div className="bg-[#151F26] rounded-2xl p-6 sm:p-10 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3),0_4px_6px_-4px_rgba(0,0,0,0.2),inset_0_1px_0_0_rgba(255,255,255,0.05)] border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#f59e0b]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                        
                        {loading ? (
                          <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#f59e0b] border-t-transparent"></div>
                          </div>
                        ) : activeBookings.length > 0 ? (
                          <div className="space-y-6">
                            {activeBookings.map((booking, bookingIndex) => (
                              <div key={booking._id} className={`${bookingIndex > 0 ? 'pt-6 border-t border-white/10' : ''}`}>
                                {/* Booking Header */}
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-[#f59e0b]/10">
                                      <span className="material-symbols-outlined text-[#f59e0b]">package_2</span>
                                    </div>
                                    <div>
                                      <p className="text-white font-bold">{booking.bookingId || `#PKP-${booking._id?.slice(-6).toUpperCase()}`}</p>
                                      <p className="text-gray-400 text-sm">{formatDate(booking.scheduledDate)} • {formatTime(booking.scheduledTime)}</p>
                                    </div>
                                  </div>
                                  <span className={`text-[10px] font-bold uppercase px-3 py-1.5 rounded-full border ${getStatusColor(booking.status)}`}>
                                    {booking.status}
                                  </span>
                                </div>
                                
                                {/* Tracking Steps */}
                                <div className="relative flex flex-col">
                                  <div className="absolute left-[23px] top-6 bottom-12 w-0.5 bg-gray-800 rounded-full"></div>
                                  <div 
                                    className="absolute left-[23px] top-6 w-0.5 bg-gradient-to-b from-[#f59e0b] via-[#f59e0b] to-[#8b5cf6] rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                                    style={{ height: `${Math.min(getTrackingSteps(booking).filter(s => s.completed || s.current).length / getTrackingSteps(booking).length * 100, 75)}%` }}
                                  ></div>
                                  
                                  {getTrackingSteps(booking).map((step, index) => (
                                    <div key={step.key} className={`relative flex gap-6 ${index < 3 ? 'pb-8' : ''} group/step ${step.pending ? 'opacity-50 hover:opacity-100 transition-opacity duration-300' : ''}`}>
                                      <div className={`z-10 shrink-0 ${step.current ? 'relative' : ''}`}>
                                        {step.current && (
                                          <div className="absolute inset-0 -m-2 rounded-full border-2 border-[#f59e0b]/30 animate-pulse"></div>
                                        )}
                                        <div className={`flex size-10 items-center justify-center rounded-full text-white ring-4 ring-[#151F26] transition-transform duration-500 group-hover/step:scale-110 ${
                                          step.completed ? 'bg-[#f59e0b] shadow-[0_0_15px_rgba(245,158,11,0.4)]' :
                                          step.current ? 'bg-[#8b5cf6] shadow-[0_0_25px_rgba(139,92,246,0.6)]' :
                                          'bg-[#151F26] border-2 border-dashed border-gray-600 text-gray-500'
                                        }`}>
                                          <span className={`material-symbols-outlined text-lg ${step.current ? 'animate-bounce' : ''}`}>{step.icon}</span>
                                        </div>
                                      </div>
                                      
                                      <div className="flex-1 pt-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                                          <h3 className={`text-base font-bold group-hover/step:text-[#f59e0b] transition-colors ${step.completed || step.current ? 'text-white' : 'text-gray-500'}`}>{step.label}</h3>
                                          <span className={`w-fit text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${
                                            step.completed ? 'text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/20' : 
                                            step.current ? 'text-[#8b5cf6] bg-[#8b5cf6]/10 border-[#8b5cf6]/20' :
                                            'text-gray-500 bg-gray-800 border-gray-700'
                                          }`}>{step.completed ? 'Done' : step.current ? 'Current' : 'Pending'}</span>
                                        </div>
                                        <p className={`text-sm ${step.completed || step.current ? 'text-[#94a3b8]' : 'text-gray-600'}`}>{step.message}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                
                                {/* Customer Info */}
                                <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/5 flex items-center gap-3">
                                  <div className="size-10 rounded-full bg-gray-800 flex items-center justify-center shrink-0 border border-white/5">
                                    <span className="material-symbols-outlined text-gray-400 text-sm">person</span>
                                  </div>
                                  <div className="overflow-hidden flex-1">
                                    <p className="text-xs text-gray-400 truncate">Customer</p>
                                    <p className="text-sm font-semibold text-white truncate">
                                      {typeof booking.userId === 'object' ? booking.userId.name : 'Customer'}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-xs text-gray-400">Items</p>
                                    <p className="text-sm font-semibold text-white">{booking.items?.length || 0}</p>
                                  </div>
                                </div>

                                {/* Action Button */}
                                {getNextAction(booking.status) && (
                                  <button
                                    onClick={() => setShowActionModal({ booking, action: getNextAction(booking.status)!.newStatus })}
                                    className={`mt-4 w-full py-3 px-4 rounded-xl ${getNextAction(booking.status)!.color} text-white font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg`}
                                  >
                                    <span className="material-symbols-outlined text-lg">{getNextAction(booking.status)!.icon}</span>
                                    {getNextAction(booking.status)!.label}
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <div className="p-4 bg-[#f59e0b]/10 rounded-full w-fit mx-auto mb-4">
                              <span className="material-symbols-outlined text-4xl text-[#f59e0b]">check_circle</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">All Caught Up!</h3>
                            <p className="text-[#94a3b8] mb-6 max-w-md mx-auto">
                              No active pickup requests. Check your bookings or manage your slots.
                            </p>
                            <button 
                              onClick={() => window.location.hash = '#/agency/bookings'}
                              className="bg-[#f59e0b] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#d97706] transition-colors inline-flex items-center gap-2"
                            >
                              <span className="material-symbols-outlined">book_online</span>
                              View All Bookings
                            </button>
                          </div>
                        )}
                      </div>
                    </section>

                    {/* All Bookings Section */}
                    {allBookings.length > 0 && (
                      <section className="flex flex-col gap-5">
                        <div className="flex items-center justify-between">
                          <h2 className="text-white text-2xl font-bold tracking-tight flex items-center gap-3">
                            <span className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                              <span className="material-symbols-outlined">history</span>
                            </span>
                            Booking History ({allBookings.length})
                          </h2>
                          <button 
                            onClick={() => setShowAllBookings(!showAllBookings)}
                            className="text-sm text-[#94a3b8] hover:text-white transition-colors flex items-center gap-1"
                          >
                            {showAllBookings ? 'Show Less' : 'View All'}
                            <span className="material-symbols-outlined text-lg">{showAllBookings ? 'expand_less' : 'expand_more'}</span>
                          </button>
                        </div>
                        
                        <div className="bg-[#151F26] rounded-2xl p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] border border-white/5">
                          <div className="space-y-3">
                            {(showAllBookings ? allBookings : allBookings.slice(0, 5)).map(booking => (
                              <div key={booking._id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group">
                                <div className="flex items-center gap-4">
                                  <div className={`p-3 rounded-xl ${getStatusColor(booking.status)}`}>
                                    <span className="material-symbols-outlined">
                                      {booking.status === 'completed' ? 'check_circle' : 
                                       booking.status === 'cancelled' ? 'cancel' : 
                                       booking.status === 'in-progress' ? 'local_shipping' :
                                       booking.status === 'confirmed' ? 'verified' : 'pending'}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="text-white font-bold">
                                      {booking.bookingId || `#PKP-${booking._id?.slice(-6).toUpperCase()}`}
                                    </p>
                                    <div className="flex items-center gap-2 text-[#94a3b8] text-sm">
                                      <span>{formatDate(booking.scheduledDate)}</span>
                                      <span>•</span>
                                      <span>{formatTime(booking.scheduledTime)}</span>
                                    </div>
                                    <p className="text-gray-500 text-xs mt-1">
                                      {typeof booking.userId === 'object' ? booking.userId.name : 'Customer'}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className={`text-xs font-bold uppercase px-3 py-1.5 rounded-full border ${getStatusColor(booking.status)}`}>
                                    {booking.status}
                                  </span>
                                  <span className="material-symbols-outlined text-gray-500 group-hover:text-white transition-colors">chevron_right</span>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {!showAllBookings && allBookings.length > 5 && (
                            <button 
                              onClick={() => setShowAllBookings(true)}
                              className="w-full mt-4 py-3 text-center text-[#94a3b8] hover:text-white text-sm font-medium border border-white/5 rounded-xl hover:bg-white/5 transition-all"
                            >
                              Show {allBookings.length - 5} more bookings
                            </button>
                          )}
                        </div>
                      </section>
                    )}

                    {/* Stats Section */}
                    <section className="flex flex-col gap-5">
                      <h2 className="text-white text-2xl font-bold tracking-tight flex items-center gap-3">
                        <span className="p-2 bg-[#f59e0b]/10 rounded-lg text-[#f59e0b]">
                          <span className="material-symbols-outlined">analytics</span>
                        </span>
                        Performance Overview
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#151F26] rounded-2xl p-6 shadow-[0_4px_12px_0_rgba(0,0,0,0.07)] flex flex-col justify-between border border-white/5 hover:border-white/10 transition-colors relative overflow-hidden group">
                          <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-8xl text-white">local_shipping</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 text-[#94a3b8] mb-3">
                              <span className="text-sm font-semibold uppercase tracking-wider">Total Pickups</span>
                            </div>
                            <p className="text-white text-5xl font-black leading-none tracking-tight">{stats.totalPickups}</p>
                          </div>
                          <div className="mt-8">
                            <div className="flex justify-between text-xs font-medium text-gray-400 mb-2">
                              <span>Completion Rate</span>
                              <span>{stats.totalPickups > 0 ? Math.round(stats.completedPickups / stats.totalPickups * 100) : 0}%</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                              <div className="bg-gradient-to-r from-[#f59e0b]/50 to-[#f59e0b] h-3 rounded-full relative" style={{ width: `${stats.totalPickups > 0 ? (stats.completedPickups / stats.totalPickups * 100) : 0}%` }}>
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-[#151F26] rounded-2xl p-6 shadow-[0_4px_12px_0_rgba(0,0,0,0.07)] flex flex-col justify-between border border-white/5 hover:border-white/10 transition-colors relative overflow-hidden group">
                          <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-8xl text-white">scale</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 text-[#94a3b8] mb-3">
                              <span className="text-sm font-semibold uppercase tracking-wider">Items Collected</span>
                            </div>
                            <p className="text-white text-5xl font-black leading-none tracking-tight">{stats.totalWasteCollected}</p>
                          </div>
                          <div className="mt-8">
                            <div className="flex justify-between text-xs font-medium text-gray-400 mb-2">
                              <span>Monthly Target</span>
                              <span className="text-[#f59e0b]">On Track</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                              <div className="bg-gradient-to-r from-[#8b5cf6]/50 to-[#8b5cf6] h-3 rounded-full relative" style={{ width: '72%' }}>
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>

                  {/* Right Column */}
                  <div className="lg:col-span-4 flex flex-col gap-8">
                    <div className="bg-gradient-to-b from-[#151F26] to-[#0B1116] rounded-2xl p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] flex flex-col items-center text-center border border-white/5 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#f59e0b] via-[#8b5cf6] to-[#f59e0b]"></div>
                      <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-[#f59e0b]/20 rounded-full blur-[60px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                      <p className="text-sm font-bold uppercase tracking-widest text-[#94a3b8] z-10">Partner Rating</p>
                      <div className="my-8 flex items-center justify-center relative z-10 group cursor-default">
                        <svg className="h-14 w-14 text-[#f59e0b] drop-shadow-[0_0_15px_rgba(245,158,11,0.5)] group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2L9.5 8.5H3L8 12.5L6 19L12 15L18 19L16 12.5L21 8.5H14.5L12 2Z"></path>
                        </svg>
                        <span className="text-7xl font-black text-white ml-2 drop-shadow-sm tracking-tighter">4.9</span>
                      </div>
                      <p className="text-sm text-gray-400 max-w-[200px] z-10">
                        Excellent rating! Keep up the great service.
                      </p>
                      <button className="mt-8 w-full group relative overflow-hidden rounded-xl bg-[#f59e0b] text-white font-bold h-12 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all z-10 cursor-pointer" onClick={() => window.location.hash = '#/agency/profile'}>
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                        <span className="relative flex items-center justify-center gap-2">
                          View Profile
                          <span className="material-symbols-outlined text-lg">arrow_forward</span>
                        </span>
                      </button>
                    </div>

                    <div className="bg-[#151F26] rounded-2xl p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] border border-white/5">
                      <h2 className="text-white text-lg font-bold tracking-tight pb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-gray-400">bolt</span>
                        Quick Actions
                      </h2>
                      <div className="flex flex-col gap-3">
                        <button onClick={() => window.location.hash = '#/agency/slots'} className="flex w-full group cursor-pointer items-center justify-between overflow-hidden rounded-xl h-14 px-4 bg-white/5 text-gray-200 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-lg bg-[#f59e0b]/20 text-[#f59e0b] flex items-center justify-center">
                              <span className="material-symbols-outlined text-xl">calendar_month</span>
                            </div>
                            <span className="font-medium">Manage Slots</span>
                          </div>
                          <span className="material-symbols-outlined text-gray-500 group-hover:text-white transition-colors">chevron_right</span>
                        </button>
                        <button onClick={() => window.location.hash = '#/agency/bookings'} className="flex w-full group cursor-pointer items-center justify-between overflow-hidden rounded-xl h-14 px-4 bg-white/5 text-gray-200 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-lg bg-[#8b5cf6]/20 text-[#8b5cf6] flex items-center justify-center">
                              <span className="material-symbols-outlined text-xl">book_online</span>
                            </div>
                            <span className="font-medium">View Bookings</span>
                          </div>
                          <span className="material-symbols-outlined text-gray-500 group-hover:text-white transition-colors">chevron_right</span>
                        </button>
                        <button onClick={() => window.location.hash = '#/agency/profile'} className="flex w-full group cursor-pointer items-center justify-between overflow-hidden rounded-xl h-14 px-4 bg-white/5 text-gray-200 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-lg bg-[#3b82f6]/20 text-[#3b82f6] flex items-center justify-center">
                              <span className="material-symbols-outlined text-xl">person</span>
                            </div>
                            <span className="font-medium">Edit Profile</span>
                          </div>
                          <span className="material-symbols-outlined text-gray-500 group-hover:text-white transition-colors">chevron_right</span>
                        </button>
                        <button onClick={() => window.location.hash = '#/contact'} className="flex w-full group cursor-pointer items-center justify-between overflow-hidden rounded-xl h-14 px-4 bg-white/5 text-gray-200 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center">
                              <span className="material-symbols-outlined text-xl">support_agent</span>
                            </div>
                            <span className="font-medium">Contact Support</span>
                          </div>
                          <span className="material-symbols-outlined text-gray-500 group-hover:text-white transition-colors">chevron_right</span>
                        </button>
                      </div>
                    </div>

                    {/* Eco Tip Card */}
                    <div className="bg-gradient-to-br from-[#f59e0b]/10 to-[#151F26] border border-[#f59e0b]/20 rounded-2xl p-6 relative overflow-hidden shadow-xl">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <span className="material-symbols-outlined text-6xl text-[#f59e0b]">eco</span>
                      </div>
                      <div className="flex items-start gap-4 relative z-10">
                        <span className="material-symbols-outlined text-[#f59e0b] text-3xl">tips_and_updates</span>
                        <div>
                          <h4 className="text-white font-bold mb-1">Pro Tip</h4>
                          <p className="text-sm text-slate-400 leading-relaxed">
                            Optimizing your slot availability during peak hours can increase bookings by up to 25%.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Action Confirmation Modal */}
      {showActionModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => !actionLoading && setShowActionModal(null)}
          ></div>
          
          <div className="relative bg-[#151F26] rounded-2xl p-6 sm:p-8 max-w-md w-full border border-white/10 shadow-2xl">
            <div className={`w-16 h-16 mx-auto mb-6 rounded-full ${getNextAction(showActionModal.booking.status)?.color || 'bg-[#f59e0b]'}/20 flex items-center justify-center`}>
              <span className={`material-symbols-outlined text-4xl ${showActionModal.action === 'confirmed' ? 'text-[#3b82f6]' : showActionModal.action === 'in-progress' ? 'text-[#8b5cf6]' : 'text-[#f59e0b]'}`}>
                {getNextAction(showActionModal.booking.status)?.icon || 'check'}
              </span>
            </div>
            
            <h3 className="text-2xl font-bold text-white text-center mb-2">
              {getNextAction(showActionModal.booking.status)?.label}?
            </h3>
            <p className="text-gray-400 text-center mb-4">
              Booking: <span className="text-white font-medium">{showActionModal.booking.bookingId || `#PKP-${showActionModal.booking._id?.slice(-6).toUpperCase()}`}</span>
            </p>
            <p className="text-gray-500 text-center text-sm mb-8">
              This will update the booking status and notify the customer.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowActionModal(null)}
                disabled={actionLoading !== null}
                className="flex-1 py-3 px-6 rounded-xl bg-white/5 text-white font-medium border border-white/10 hover:bg-white/10 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateStatus(showActionModal.booking._id, showActionModal.action)}
                disabled={actionLoading !== null}
                className={`flex-1 py-3 px-6 rounded-xl ${getNextAction(showActionModal.booking.status)?.color || 'bg-[#f59e0b]'} text-white font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50`}
              >
                {actionLoading === showActionModal.booking._id ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">{getNextAction(showActionModal.booking.status)?.icon}</span>
                    Confirm
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AgencyDashboard;
