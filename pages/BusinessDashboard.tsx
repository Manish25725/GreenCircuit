import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
import { api, getCurrentUser, User, Booking } from '../services/api';

const BusinessDashboard = () => {
  const [user, setUser] = useState<User | null>(getCurrentUser()); 
  const [avatarKey, setAvatarKey] = useState(Date.now());
  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllBookings, setShowAllBookings] = useState(false);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [stats, setStats] = useState({
    totalRecycled: 0,
    co2Offset: 0,
    costSavings: 0,
    totalBookings: 0
  });

  useEffect(() => {
    loadBusinessData();
    
    // Listen for user updates (avatar/logo changes)
    const handleUserUpdate = () => {
      setUser(getCurrentUser());
      setAvatarKey(Date.now());
    };
    
    window.addEventListener('userUpdated', handleUserUpdate);
    window.addEventListener('storage', handleUserUpdate);
    
    return () => {
      window.removeEventListener('userUpdated', handleUserUpdate);
      window.removeEventListener('storage', handleUserUpdate);
    };
  }, []);

  const loadBusinessData = async () => {
    try {
      // Try to get fresh user data from API
      const userData = await api.getMe();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setStats({
        totalRecycled: userData.totalWasteRecycled || 0,
        co2Offset: (userData.totalWasteRecycled || 0) * 2.5,
        costSavings: (userData.totalWasteRecycled || 0) * 15, // Estimated cost savings
        totalBookings: userData.totalBookings || 0
      });
      
      // Get user bookings
      try {
        const bookingsData = await api.getUserBookings();
        const bookings = bookingsData.bookings || bookingsData || [];
        setAllBookings(bookings);
        
        // Find ALL active/in-progress bookings
        const active = bookings.filter((b: Booking) => 
          b.status === 'pending' || b.status === 'confirmed' || b.status === 'in-progress'
        );
        setActiveBookings(active || []);
      } catch (e) {
        console.log('No bookings found');
      }

      // Get recent certificates
      try {
        console.log('Fetching certificates for business user...');
        const certsData = await api.getBusinessCertificates({ page: 1, limit: 3 });
        console.log('Certificates API response:', certsData);
        console.log('Response type:', typeof certsData);
        console.log('Response keys:', certsData ? Object.keys(certsData) : 'null');
        
        // Store for debug panel
        setDebugInfo({
          timestamp: new Date().toISOString(),
          response: certsData,
          user: { id: userData._id, email: userData.email, role: userData.role }
        });
        
        // Handle multiple response formats
        let certs = [];
        if (Array.isArray(certsData)) {
          certs = certsData;
        } else if (certsData?.data?.certificates) {
          certs = certsData.data.certificates;
        } else if (certsData?.certificates) {
          certs = certsData.certificates;
        } else if (certsData?.data && Array.isArray(certsData.data)) {
          certs = certsData.data;
        }
        
        setCertificates(certs);
        console.log('Loaded certificates count:', certs.length);
        if (certs.length > 0) {
          console.log('First certificate:', JSON.stringify(certs[0], null, 2));
        }
      } catch (e: any) {
        console.error('Error loading certificates:', e);
        console.error('Error details:', e.message);
        console.error('Error response:', e.response?.data);
        setDebugInfo({
          timestamp: new Date().toISOString(),
          error: e.message,
          errorResponse: e.response?.data,
          user: { id: userData._id, email: userData.email, role: userData.role }
        });
      }
    } catch (error) {
      console.error('Failed to load business data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    setCancelling(bookingId);
    try {
      await api.cancelBooking(bookingId);
      await loadBusinessData();
      setShowCancelModal(null);
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      alert('Failed to cancel booking. Please try again.');
    } finally {
      setCancelling(null);
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
      case 'completed': return 'text-[#06b6d4] bg-[#06b6d4]/10 border-[#06b6d4]/20';
      case 'in-progress': return 'text-[#8b5cf6] bg-[#8b5cf6]/10 border-[#8b5cf6]/20';
      case 'confirmed': return 'text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/20';
      case 'pending': return 'text-[#94a3b8] bg-[#94a3b8]/10 border-[#94a3b8]/20';
      case 'cancelled': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-[#94a3b8] bg-[#94a3b8]/10 border-[#94a3b8]/20';
    }
  };

  const getTrackingSteps = (booking: Booking) => {
    if (!booking) return [];
    
    const steps = [
      { key: 'pending', label: 'Request Submitted', icon: 'check', message: `Disposal request ${booking.bookingId || '#REQ'} was submitted.` },
      { key: 'confirmed', label: 'Agency Assigned', icon: 'verified', message: `${typeof booking.agencyId === 'object' ? booking.agencyId.name : 'Agency'} will handle your pickup.` },
      { key: 'in-progress', label: 'Collection Scheduled', icon: 'local_shipping', message: 'Collection vehicle dispatched to your facility.' },
      { key: 'completed', label: 'Disposal Completed', icon: 'task_alt', message: 'E-waste disposed with compliance certificate issued.' },
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
    <Layout title="" role="Business" fullWidth hideSidebar>
      <div className="bg-[#0B1116] font-sans text-gray-200 antialiased selection:bg-[#06b6d4] selection:text-white min-h-screen">
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
          <div className="fixed top-0 left-0 w-full h-[500px] bg-[#06b6d4]/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
          <div className="fixed bottom-0 right-0 w-full h-[500px] bg-[#8b5cf6]/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none"></div>
          
          <div className="layout-container flex h-full grow flex-col relative z-10">
            {/* Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 transition-all duration-300">
              <div className="flex items-center gap-3 text-white cursor-pointer" onClick={() => window.location.hash = '#/'}>
                <div className="p-2 bg-[#06b6d4]/10 rounded-lg">
                  <svg className="h-6 w-6 text-[#06b6d4]" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"></path>
                  </svg>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white">EcoCycle <span className="text-[#06b6d4]">Business</span></h2>
              </div>
              <nav className="hidden md:flex flex-1 justify-center gap-1">
              </nav>
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <button 
                      onClick={() => window.location.hash = '#/profile'}
                      className="hidden sm:flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-[#151F26] border border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <div 
                      className="size-8 rounded-full bg-cover bg-center ring-2 ring-white/10 group-hover:ring-[#06b6d4]/50 transition-all" 
                      style={{ backgroundImage: `url("${(user?.logo || user?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || user?.companyName || 'Business') + '&background=06b6d4&color=fff')}${(user?.logo || user?.avatar) ? '?t=' + avatarKey : ''}")` }}
                    ></div>
                    <span className="text-sm font-medium text-gray-200">{user?.name || 'Business'}</span>
                  </button>
                  {/* Hover Preview */}
                  <div className="absolute top-14 right-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100]">
                    <div className="bg-[#151F26] border border-white/10 rounded-2xl p-4 shadow-2xl">
                      <div 
                        className="size-32 rounded-xl bg-cover bg-center ring-4 ring-[#06b6d4]/30" 
                        style={{ backgroundImage: `url("${(user?.logo || user?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || user?.companyName || 'Business') + '&background=06b6d4&color=fff')}${(user?.logo || user?.avatar) ? '?t=' + avatarKey : ''}")` }}
                      ></div>
                    </div>
                  </div>
                </div>
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
                    <p className="text-[#06b6d4] text-sm font-bold uppercase tracking-widest mb-2">Business Portal</p>
                    <h1 className="text-white text-4xl sm:text-5xl font-black leading-tight tracking-tighter mb-2 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">Welcome, {user?.name?.split(' ')[0] || 'Business'}!</h1>
                    <p className="text-[#94a3b8] text-lg">Manage your corporate e-waste disposal efficiently.</p>
                  </div>
                  <div className="flex items-center gap-3 bg-[#151F26]/50 p-1.5 pr-4 rounded-full border border-white/10 backdrop-blur-sm">
                    <div className="bg-[#06b6d4]/20 p-2 rounded-full text-[#06b6d4]">
                      <span className="material-symbols-outlined text-lg">calendar_today</span>
                    </div>
                    <span className="text-sm font-medium text-gray-300">{formatDate()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column (Tracking & Impact) */}
                  <div className="lg:col-span-8 flex flex-col gap-8">
                    
                    {/* Live Tracking Section */}
                    <section className="flex flex-col gap-5">
                      <div className="flex items-center justify-between">
                        <h2 className="text-white text-2xl font-bold tracking-tight flex items-center gap-3">
                          <span className="p-2 bg-[#8b5cf6]/10 rounded-lg text-[#8b5cf6]">
                            <span className="material-symbols-outlined">local_shipping</span>
                          </span>
                          {activeBookings.length > 0 ? `Active Disposals (${activeBookings.length})` : 'Disposal Status'}
                        </h2>
                        {activeBookings.length > 0 && (
                          <span className="px-3 py-1 rounded-full bg-[#8b5cf6]/10 text-[#8b5cf6] text-xs font-bold uppercase tracking-wider border border-[#8b5cf6]/20 animate-pulse">Live</span>
                        )}
                      </div>

                      <div className="bg-[#151F26] rounded-2xl p-6 sm:p-10 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3),0_4px_6px_-4px_rgba(0,0,0,0.2),inset_0_1px_0_0_rgba(255,255,255,0.05)] border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#8b5cf6]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                        
                        {loading ? (
                          <div className="flex items-center justify-center py-12">
                            <Loader size="md" color="#06b6d4" />
                          </div>
                        ) : activeBookings.length > 0 ? (
                          <div className="space-y-6">
                            {activeBookings.map((booking, bookingIndex) => (
                              <div key={booking._id} className={`${bookingIndex > 0 ? 'pt-6 border-t border-white/10' : ''}`}>
                                {/* Booking Header */}
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-[#8b5cf6]/10">
                                      <span className="material-symbols-outlined text-[#8b5cf6]">inventory_2</span>
                                    </div>
                                    <div>
                                      <p className="text-white font-bold">{booking.bookingId || `#DSP-${booking._id?.slice(-6).toUpperCase()}`}</p>
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
                                    className="absolute left-[23px] top-6 w-0.5 bg-gradient-to-b from-[#06b6d4] via-[#06b6d4] to-[#8b5cf6] rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                                    style={{ height: `${Math.min(getTrackingSteps(booking).filter(s => s.completed || s.current).length / getTrackingSteps(booking).length * 100, 75)}%` }}
                                  ></div>
                                  
                                  {getTrackingSteps(booking).map((step, index) => (
                                    <div key={step.key} className={`relative flex gap-6 ${index < 3 ? 'pb-8' : ''} group/step ${step.pending ? 'opacity-50 hover:opacity-100 transition-opacity duration-300' : ''}`}>
                                      <div className={`z-10 shrink-0 ${step.current ? 'relative' : ''}`}>
                                        {step.current && (
                                          <div className="absolute inset-0 -m-2 rounded-full border-2 border-[#8b5cf6]/30 animate-pulse"></div>
                                        )}
                                        <div className={`flex size-10 items-center justify-center rounded-full text-white ring-4 ring-[#151F26] transition-transform duration-500 group-hover/step:scale-110 ${
                                          step.completed ? 'bg-[#06b6d4] shadow-[0_0_15px_rgba(6,182,212,0.4)]' :
                                          step.current ? 'bg-[#8b5cf6] shadow-[0_0_25px_rgba(139,92,246,0.6)]' :
                                          'bg-[#151F26] border-2 border-dashed border-gray-600 text-gray-500'
                                        }`}>
                                          <span className={`material-symbols-outlined text-lg ${step.current ? 'animate-bounce' : ''}`}>{step.icon}</span>
                                        </div>
                                      </div>
                                      
                                      <div className="flex-1 pt-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                                          <h3 className={`text-base font-bold group-hover/step:text-[#06b6d4] transition-colors ${step.completed || step.current ? 'text-white' : 'text-gray-500'}`}>{step.label}</h3>
                                          <span className={`w-fit text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${
                                            step.completed ? 'text-[#06b6d4] bg-[#06b6d4]/10 border-[#06b6d4]/20' : 
                                            step.current ? 'text-[#8b5cf6] bg-[#8b5cf6]/10 border-[#8b5cf6]/20' :
                                            'text-gray-500 bg-gray-800 border-gray-700'
                                          }`}>{step.completed ? 'Completed' : step.current ? 'In Progress' : 'Pending'}</span>
                                        </div>
                                        <p className={`text-sm ${step.completed || step.current ? 'text-[#94a3b8]' : 'text-gray-600'}`}>{step.message}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                
                                {/* Agency Info */}
                                <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/5 flex items-center gap-3">
                                  <div className="size-10 rounded-full bg-gray-800 flex items-center justify-center shrink-0 border border-white/5">
                                    <span className="material-symbols-outlined text-gray-400 text-sm">business</span>
                                  </div>
                                  <div className="overflow-hidden">
                                    <p className="text-xs text-gray-400 truncate">Disposal Partner</p>
                                    <p className="text-sm font-semibold text-white truncate">
                                      {typeof booking.agencyId === 'object' ? booking.agencyId.name : 'Partner Assigned'}
                                    </p>
                                  </div>
                                </div>

                                {/* Cancel Button */}
                                {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                  <button
                                    onClick={() => setShowCancelModal(booking._id)}
                                    className="mt-4 w-full py-3 px-4 rounded-xl bg-red-500/10 text-red-400 font-medium border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/30 transition-all flex items-center justify-center gap-2"
                                  >
                                    <span className="material-symbols-outlined text-lg">cancel</span>
                                    Cancel Request
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          /* No Active Booking - Show call to action */
                          <div className="text-center py-8">
                            <div className="p-4 bg-[#06b6d4]/10 rounded-full w-fit mx-auto mb-4">
                              <span className="material-symbols-outlined text-4xl text-[#06b6d4]">delete_sweep</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No Active Disposals</h3>
                            <p className="text-[#94a3b8] mb-6 max-w-md mx-auto">
                              Schedule a pickup to dispose of your corporate e-waste compliantly and get certificates.
                            </p>
                            <button 
                              onClick={() => window.location.hash = '#/search'}
                              className="bg-[#06b6d4] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#0891b2] transition-colors inline-flex items-center gap-2"
                            >
                              <span className="material-symbols-outlined">add</span>
                              Schedule Disposal
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
                            <span className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                              <span className="material-symbols-outlined">history</span>
                            </span>
                            Disposal History ({allBookings.length})
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
                                      {booking.bookingId || `#DSP-${booking._id?.slice(-6).toUpperCase()}`}
                                    </p>
                                    <div className="flex items-center gap-2 text-[#94a3b8] text-sm">
                                      <span>{formatDate(booking.scheduledDate)}</span>
                                      <span>•</span>
                                      <span>{formatTime(booking.scheduledTime)}</span>
                                    </div>
                                    <p className="text-gray-500 text-xs mt-1">
                                      {typeof booking.agencyId === 'object' ? booking.agencyId.name : 'Partner Assigned'}
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
                              Show {allBookings.length - 5} more records
                            </button>
                          )}
                        </div>
                      </section>
                    )}

                    {/* Impact Section */}
                    <section className="flex flex-col gap-5">
                      <h2 className="text-white text-2xl font-bold tracking-tight flex items-center gap-3">
                        <span className="p-2 bg-[#06b6d4]/10 rounded-lg text-[#06b6d4]">
                          <span className="material-symbols-outlined">analytics</span>
                        </span>
                        Business Impact
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#151F26] rounded-2xl p-6 shadow-[0_4px_12px_0_rgba(0,0,0,0.07)] flex flex-col justify-between border border-white/5 hover:border-white/10 transition-colors relative overflow-hidden group">
                          <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-8xl text-white">scale</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 text-[#94a3b8] mb-3">
                              <span className="text-sm font-semibold uppercase tracking-wider">Total Disposed</span>
                            </div>
                            <p className="text-white text-5xl font-black leading-none tracking-tight">{user?.totalWasteRecycled?.toFixed(1) || '0'} <span className="text-2xl font-medium text-gray-500">kg</span></p>
                          </div>
                          <div className="mt-8">
                            <div className="flex justify-between text-xs font-medium text-gray-400 mb-2">
                              <span>Quarterly Target</span>
                              <span>{Math.min(Math.round((user?.totalWasteRecycled || 0) / 500 * 100), 100)}% Complete</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                              <div className="bg-gradient-to-r from-[#06b6d4]/50 to-[#06b6d4] h-3 rounded-full relative" style={{ width: `${Math.min((user?.totalWasteRecycled || 0) / 5, 100)}%` }}>
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-[#151F26] rounded-2xl p-6 shadow-[0_4px_12px_0_rgba(0,0,0,0.07)] flex flex-col justify-between border border-white/5 hover:border-white/10 transition-colors relative overflow-hidden group">
                          <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-8xl text-white">savings</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 text-[#94a3b8] mb-3">
                              <span className="text-sm font-semibold uppercase tracking-wider">Cost Savings</span>
                            </div>
                            <p className="text-white text-5xl font-black leading-none tracking-tight">₹{stats.costSavings.toLocaleString()} <span className="text-2xl font-medium text-gray-500"></span></p>
                          </div>
                          <div className="mt-8">
                            <div className="flex justify-between text-xs font-medium text-gray-400 mb-2">
                              <span>vs Traditional Disposal</span>
                              <span className="text-[#06b6d4]">+32% Saved</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                              <div className="bg-gradient-to-r from-[#8b5cf6]/50 to-[#8b5cf6] h-3 rounded-full relative" style={{ width: '68%' }}>
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Recent Certificates Section */}
                    <section className="flex flex-col gap-5">
                      <div className="flex items-center justify-between">
                        <h2 className="text-white text-2xl font-bold tracking-tight flex items-center gap-3">
                          <span className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                            <span className="material-symbols-outlined">verified_user</span>
                          </span>
                          Compliance Certificates
                        </h2>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setShowDebug(!showDebug)}
                            className="text-gray-500 hover:text-gray-300 text-sm font-medium flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
                            title="Show debug info"
                          >
                            <span className="material-symbols-outlined text-sm">bug_report</span>
                          </button>
                          <button 
                            onClick={() => loadBusinessData()}
                            className="text-gray-400 hover:text-white text-sm font-medium flex items-center gap-1 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
                            title="Refresh certificates"
                          >
                            <span className="material-symbols-outlined text-sm">refresh</span>
                            Refresh
                          </button>
                          <button 
                            onClick={() => window.location.hash = '#/business/certificates'}
                            className="text-[#06b6d4] hover:text-[#0891b2] text-sm font-medium flex items-center gap-1 transition-colors"
                          >
                            View All
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                          </button>
                        </div>
                      </div>

                      {/* Debug Panel */}
                      {showDebug && debugInfo && (
                        <div className="bg-black/50 rounded-xl p-4 border border-amber-500/30 font-mono text-xs">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-amber-400 font-bold">Debug Info</span>
                            <button onClick={() => setShowDebug(false)} className="text-gray-400 hover:text-white">
                              <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                          </div>
                          <pre className="text-gray-300 overflow-auto max-h-60 whitespace-pre-wrap break-words">
                            {JSON.stringify(debugInfo, null, 2)}
                          </pre>
                        </div>
                      )}

                      {loading ? (
                        <div className="bg-[#151F26] rounded-2xl p-8 text-center border border-white/5">
                          <Loader size="md" color="#f59e0b" className="mb-4" />
                          <p className="text-gray-400">Loading certificates...</p>
                        </div>
                      ) : certificates.length === 0 ? (
                        <div className="bg-[#151F26] rounded-2xl p-8 text-center border border-white/5">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl text-amber-400">verified_user</span>
                          </div>
                          <h3 className="text-white text-lg font-bold mb-2">No Certificates Yet</h3>
                          <p className="text-gray-400 text-sm mb-4">
                            Complete your first pickup to receive a compliance certificate. Certificates are automatically generated when pickups are marked as completed by the agency.
                          </p>
                          <button 
                            onClick={() => window.location.hash = '#/search'}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#06b6d4] text-white rounded-lg font-medium hover:bg-[#0891b2] transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">add</span>
                            Schedule Pickup
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-4">
                          {certificates.slice(0, 3).map((cert) => (
                            <div 
                              key={cert._id}
                              className="bg-[#151F26] rounded-xl p-5 border border-white/5 hover:border-amber-500/30 transition-all cursor-pointer group"
                              onClick={() => window.location.hash = `#/business/certificates`}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 rounded-lg bg-amber-500/10">
                                    <span className="material-symbols-outlined text-amber-400 text-xl">verified_user</span>
                                  </div>
                                  <div>
                                    <h4 className="text-white font-bold text-sm group-hover:text-[#06b6d4] transition-colors">{cert.certificateId}</h4>
                                    <p className="text-gray-500 text-xs">
                                      {new Date(cert.issuedAt || cert.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </p>
                                  </div>
                                </div>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-amber-500/10 text-amber-400 border-amber-500/30">
                                  <span className="material-symbols-outlined text-sm">verified_user</span>
                                  Compliance
                                </span>
                              </div>
                              <div className="grid grid-cols-3 gap-3 mt-3">
                                <div className="bg-white/5 rounded-lg p-2">
                                  <p className="text-gray-500 text-xs mb-0.5">Weight</p>
                                  <p className="text-white font-semibold text-sm">{cert.totalWeight} kg</p>
                                </div>
                                <div className="bg-white/5 rounded-lg p-2">
                                  <p className="text-gray-500 text-xs mb-0.5">CO₂ Saved</p>
                                  <p className="text-[#10b981] font-semibold text-sm">{Math.round(cert.co2Saved || 0)} kg</p>
                                </div>
                                <div className="bg-white/5 rounded-lg p-2">
                                  <p className="text-gray-500 text-xs mb-0.5">Status</p>
                                  <p className="text-[#10b981] font-semibold text-sm flex items-center gap-1">
                                    <span className="material-symbols-outlined text-xs">verified</span>
                                    {cert.status === 'issued' ? 'Verified' : cert.status}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </section>
                  </div>

                  {/* Right Column (Stats & Actions) */}
                  <div className="lg:col-span-4 flex flex-col gap-8">
                    <div className="bg-gradient-to-b from-[#151F26] to-[#0B1116] rounded-2xl p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] flex flex-col items-center text-center border border-white/5 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#06b6d4] via-[#8b5cf6] to-[#06b6d4]"></div>
                      <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-[#06b6d4]/20 rounded-full blur-[60px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                      <p className="text-sm font-bold uppercase tracking-widest text-[#94a3b8] z-10">Compliance Score</p>
                      <div className="my-8 flex items-center justify-center relative z-10 group cursor-default">
                        <svg className="h-16 w-16 text-[#06b6d4] drop-shadow-[0_0_15px_rgba(6,182,212,0.5)] group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                        <span className="text-7xl font-black text-white ml-2 drop-shadow-sm tracking-tighter">98%</span>
                      </div>
                      <p className="text-sm text-gray-400 max-w-[200px] z-10">
                        Excellent! Your e-waste disposal meets all regulatory requirements.
                      </p>
                      <button className="mt-8 w-full group relative overflow-hidden rounded-xl bg-[#06b6d4] text-white font-bold h-12 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all z-10 cursor-pointer" onClick={() => window.location.hash = '#/business/certificates'}>
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                        <span className="relative flex items-center justify-center gap-2">
                          View Certificates
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
                        <button onClick={() => window.location.hash = '#/search'} className="flex w-full group cursor-pointer items-center justify-between overflow-hidden rounded-xl h-14 px-4 bg-white/5 text-gray-200 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-lg bg-[#06b6d4]/20 text-[#06b6d4] flex items-center justify-center">
                              <span className="material-symbols-outlined text-xl">add</span>
                            </div>
                            <span className="font-medium">New Disposal Request</span>
                          </div>
                          <span className="material-symbols-outlined text-gray-500 group-hover:text-white transition-colors">chevron_right</span>
                        </button>
                        <button onClick={() => window.location.hash = '#/business/inventory'} className="flex w-full group cursor-pointer items-center justify-between overflow-hidden rounded-xl h-14 px-4 bg-white/5 text-gray-200 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-lg bg-[#8b5cf6]/20 text-[#8b5cf6] flex items-center justify-center">
                              <span className="material-symbols-outlined text-xl">inventory_2</span>
                            </div>
                            <span className="font-medium">Manage Inventory</span>
                          </div>
                          <span className="material-symbols-outlined text-gray-500 group-hover:text-white transition-colors">chevron_right</span>
                        </button>
                        <button onClick={() => window.location.hash = '#/business/analytics'} className="flex w-full group cursor-pointer items-center justify-between overflow-hidden rounded-xl h-14 px-4 bg-white/5 text-gray-200 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                              <span className="material-symbols-outlined text-xl">bar_chart</span>
                            </div>
                            <span className="font-medium">View Analytics</span>
                          </div>
                          <span className="material-symbols-outlined text-gray-500 group-hover:text-white transition-colors">chevron_right</span>
                        </button>
                        {/* Certifications quick action removed as requested */}
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
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => !cancelling && setShowCancelModal(null)}
          ></div>
          
          {/* Modal */}
          <div className="relative bg-[#151F26] rounded-2xl p-6 sm:p-8 max-w-md w-full border border-white/10 shadow-2xl">
            {/* Warning Icon */}
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-red-400">warning</span>
            </div>
            
            <h3 className="text-2xl font-bold text-white text-center mb-2">Cancel Request?</h3>
            <p className="text-gray-400 text-center mb-8">
              Are you sure you want to cancel this disposal request? This action cannot be undone.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowCancelModal(null)}
                disabled={cancelling !== null}
                className="flex-1 py-3 px-6 rounded-xl bg-white/5 text-white font-medium border border-white/10 hover:bg-white/10 transition-all disabled:opacity-50"
              >
                Keep Request
              </button>
              <button
                onClick={() => handleCancelBooking(showCancelModal)}
                disabled={cancelling !== null}
                className="flex-1 py-3 px-6 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {cancelling === showCancelModal ? (
                  <>
                    <Loader size="sm" color="white" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">delete</span>
                    Yes, Cancel
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

export default BusinessDashboard;
