import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
import { api, getCurrentUser } from '../services/api';
import gsap from 'gsap';

// Helper to get user role
const getUserRole = (): 'User' | 'Business' | 'Agency' | 'Admin' => {
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const role = user.role?.toLowerCase();
      if (role === 'business') return 'Business';
      if (role === 'agency' || role === 'partner') return 'Agency';
      if (role === 'admin') return 'Admin';
    }
  } catch (e) {}
  return 'User';
};

// Helper to get dashboard path based on role
const getDashboardPath = (role: string): string => {
  switch (role) {
    case 'Business': return '#/business';
    case 'Agency': return '#/agency';
    case 'Admin': return '#/admin';
    default: return '#/dashboard';
  }
};

interface BookingDetails {
  _id: string;
  status: string;
  date: string;
  items: Array<{ type: string; quantity: number; description?: string }>;
  agency?: { name: string };
  pointsEarned?: number;
  slot?: { startTime: string; endTime: string };
}

const PickupConfirmation = () => {
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();
  const userRole = getUserRole();
  const dashboardPath = getDashboardPath(userRole);
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadBooking();
  }, []);

  useEffect(() => {
    if (!loading && booking) {
      // GSAP animations after content loads
      const ctx = gsap.context(() => {
        // Animate hero section
        gsap.fromTo('.hero-icon', 
          { scale: 0, rotation: -180 },
          { scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.7)' }
        );
        
        gsap.fromTo('.hero-title', 
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, delay: 0.3, ease: 'power3.out' }
        );
        
        gsap.fromTo('.hero-subtitle', 
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, delay: 0.5, ease: 'power3.out' }
        );

        // Animate cards
        gsap.fromTo('.animate-card', 
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, delay: 0.6, ease: 'power3.out' }
        );

        // Pulse animation for success icon
        gsap.to('.pulse-ring', {
          scale: 1.5,
          opacity: 0,
          duration: 1.5,
          repeat: -1,
          ease: 'power2.out'
        });

        // Floating animation
        gsap.to('.float-element', {
          y: -10,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      });

      return () => ctx.revert();
    }
  }, [loading, booking]);

  const loadBooking = async () => {
    try {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.split('?')[1] || '');
      const bookingId = params.get('booking');

      if (bookingId) {
        const response = await api.getBookingById(bookingId);
        setBooking(response);
      } else {
        const activeBooking = await api.getActiveBooking();
        if (activeBooking) {
          setBooking(activeBooking);
        }
      }
    } catch (error) {
      console.error('Failed to load booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'pending': return 25;
      case 'confirmed': return 50;
      case 'collected': return 75;
      case 'completed': return 100;
      default: return 25;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes || '00'} ${ampm}`;
  };

  if (loading) {
    return (
      <Layout title="" role={userRole} fullWidth hideSidebar>
        <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
          <Loader size="lg" color="#34D399" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="" role={userRole} fullWidth hideSidebar>
      <div className="relative flex min-h-screen w-full flex-col font-display bg-[#0B1120] text-slate-300 selection:bg-[#34D399] selection:text-slate-900 overflow-x-hidden">
        
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#34D399]/5 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#3B82F6]/5 rounded-full blur-[150px]"></div>
        </div>

        {/* Navbar - Matching Homepage */}
        <div className="w-full flex justify-center fixed top-0 left-0 right-0 z-50">
          <div className="absolute inset-0 bg-[#0B1120]/80 backdrop-blur-md border-b border-white/5"></div>
          <div className="w-full max-w-7xl px-4 sm:px-6 relative z-10">
            <header className="flex items-center justify-between h-16 sm:h-20">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.hash = '#/'}>
                <div className="size-8 sm:size-10 text-[#34D399] flex items-center justify-center">
                  <svg className="w-full h-full drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
                  </svg>
                </div>
                <span className="text-slate-50 text-xl sm:text-2xl font-black tracking-tight">EcoCycle <span className="text-[#10b981] font-semibold">Resident</span></span>
              </div>
              <nav className="hidden md:flex items-center gap-8">
              </nav>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => window.location.hash = '#/profile'}
                  className="hidden sm:flex h-10 px-5 items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/10 border border-white/10 text-sm font-bold transition-all duration-300 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] mr-2">person</span>
                  Profile
                </button>
                <button 
                  onClick={() => window.location.hash = '#/search'}
                  className="h-10 px-6 flex items-center justify-center rounded-full bg-[#34D399] text-slate-900 hover:bg-[#6EE7B7] shadow-[0_0_15px_rgba(52,211,153,0.3)] hover:shadow-[0_0_25px_rgba(52,211,153,0.5)] text-sm font-bold transition-all duration-300 transform hover:scale-105 cursor-pointer"
                >
                  New Pickup
                </button>
              </div>
            </header>
          </div>
        </div>

        {/* Main Content */}
        <main className="w-full flex flex-col items-center pt-32 pb-20 relative z-10">
          <div className="w-full max-w-4xl px-4 sm:px-6 flex flex-col gap-10">
            
            {/* Success Hero Section */}
            <div ref={heroRef} className="flex flex-col items-center gap-6 text-center">
              <div className="relative">
                <div className="hero-icon relative flex items-center justify-center size-28 rounded-full bg-gradient-to-br from-[#34D399]/20 to-[#34D399]/5 ring-1 ring-[#34D399]/30 shadow-[0_0_50px_rgba(52,211,153,0.2)]">
                  <span className="material-symbols-outlined text-[#34D399] text-6xl">check_circle</span>
                </div>
                <div className="pulse-ring absolute inset-0 rounded-full border-2 border-[#34D399]/50"></div>
              </div>
              <div className="flex flex-col items-center gap-3 max-w-xl">
                <h1 className="hero-title text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight">
                  {booking?.status === 'completed' ? (
                    <>Pickup <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#34D399] to-[#6EE7B7]">Complete!</span></>
                  ) : (
                    <>Booking <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#34D399] to-[#6EE7B7]">Confirmed!</span></>
                  )}
                </h1>
                <p className="hero-subtitle text-slate-400 text-lg sm:text-xl font-light leading-relaxed">
                  {booking?.status === 'completed' 
                    ? `${booking?.agency?.name || 'The agency'} has successfully collected your e-waste.`
                    : `Your pickup has been scheduled with ${booking?.agency?.name || 'the agency'}.`
                  }
                </p>
              </div>
            </div>

            {/* Points Earned Card */}
            <div ref={cardsRef} className="animate-card group relative rounded-[2rem] bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-white/5 p-8 overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(52,211,153,0.2)]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#34D399]/0 to-[#34D399]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 opacity-5">
                <span className="material-symbols-outlined text-[200px] text-[#34D399]">eco</span>
              </div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-col gap-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#34D399]/10 border border-[#34D399]/20 w-fit">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34D399] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34D399]"></span>
                    </span>
                    <span className="text-[#34D399] text-sm font-bold">+{booking?.pointsEarned || 50} Eco-Points Earned</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">
                    Pickup #{booking?._id?.slice(-6).toUpperCase() || 'XXXXXX'}
                  </h3>
                  <p className="text-slate-400 text-base">
                    {booking?.agency?.name ? (
                      <>Handled by <span className="text-[#34D399] font-semibold">{booking.agency.name}</span> (Verified Partner)</>
                    ) : (
                      'Pickup scheduled successfully'
                    )}
                  </p>
                </div>
                <div className="float-element size-32 rounded-2xl bg-gradient-to-br from-[#34D399]/20 to-[#34D399]/5 border border-[#34D399]/20 flex items-center justify-center shadow-[0_0_30px_rgba(52,211,153,0.15)]">
                  <span className="material-symbols-outlined text-[#34D399] text-6xl">recycling</span>
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="animate-card rounded-[2rem] bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-white/5 p-8">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Recycling Process Status</h3>
                    <p className="text-slate-500 text-sm capitalize">Current: {booking?.status || 'pending'}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#34D399] to-[#6EE7B7]">
                      {getProgressPercentage(booking?.status || 'pending')}%
                    </span>
                  </div>
                </div>
                
                <div className="relative w-full h-4 rounded-full bg-slate-800 overflow-hidden mt-2">
                  <div 
                    className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-[#34D399] to-[#6EE7B7] shadow-[0_0_20px_rgba(52,211,153,0.5)] transition-all duration-1000" 
                    style={{ width: `${getProgressPercentage(booking?.status || 'pending')}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-xs font-medium text-slate-500 mt-2">
                  <span className={booking?.status === 'pending' ? 'text-[#34D399]' : ''}>Booked</span>
                  <span className={booking?.status === 'confirmed' ? 'text-[#34D399]' : ''}>Confirmed</span>
                  <span className={booking?.status === 'collected' ? 'text-[#34D399]' : ''}>Collected</span>
                  <span className={booking?.status === 'completed' ? 'text-[#34D399]' : ''}>Complete</span>
                </div>
              </div>
            </div>

            {/* Detailed Info Grid */}
            <div className="animate-card grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Pickup ID */}
              <div className="group rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-white/5 p-6 hover:border-[#34D399]/20 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="size-10 rounded-xl bg-[#34D399]/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#34D399] text-xl">tag</span>
                  </div>
                  <span className="text-slate-400 text-sm font-medium">Pickup ID</span>
                </div>
                <p className="text-xl font-bold text-white">#{booking?._id?.slice(-6).toUpperCase() || 'XXXXXX'}</p>
              </div>

              {/* Date & Time */}
              <div className="group rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-white/5 p-6 hover:border-[#34D399]/20 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="size-10 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#3B82F6] text-xl">event</span>
                  </div>
                  <span className="text-slate-400 text-sm font-medium">Date & Time</span>
                </div>
                <p className="text-xl font-bold text-white">
                  {booking?.date ? formatDate(booking.date) : 'Pending'}
                  {booking?.slot ? <span className="text-slate-400 font-normal text-base ml-2">• {formatTime(booking.slot.startTime)}</span> : ''}
                </p>
              </div>

              {/* Items */}
              <div className="group rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-white/5 p-6 hover:border-[#34D399]/20 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="size-10 rounded-xl bg-[#A855F7]/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#A855F7] text-xl">inventory_2</span>
                  </div>
                  <span className="text-slate-400 text-sm font-medium">Items</span>
                </div>
                <p className="text-xl font-bold text-white">
                  {booking?.items?.length || 0} item(s)
                  <span className="text-slate-400 font-normal text-base ml-2">• {booking?.items?.map(i => i.type).join(', ') || 'N/A'}</span>
                </p>
              </div>

              {/* Status */}
              <div className="group rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-white/5 p-6 hover:border-[#34D399]/20 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="size-10 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#F59E0B] text-xl">pending_actions</span>
                  </div>
                  <span className="text-slate-400 text-sm font-medium">Status</span>
                </div>
                <p className="text-xl font-bold text-[#34D399] capitalize">{booking?.status || 'Pending'}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="animate-card flex flex-col sm:flex-row gap-4 pt-4">
              {(booking?.status === 'completed' || booking?.status === 'collected') ? (
                <button 
                  onClick={() => window.location.hash = userRole === 'User' ? `#/certificate?booking=${booking._id}` : dashboardPath}
                  className="relative group flex-1 h-14 rounded-full overflow-hidden cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#34D399] to-[#6EE7B7] transition-transform duration-300 group-hover:scale-105"></div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-[#6EE7B7] to-[#34D399]"></div>
                  <div className="relative z-10 flex items-center justify-center gap-2 h-full text-slate-900 font-bold">
                    <span className="material-symbols-outlined text-xl">{userRole === 'User' ? 'verified' : 'dashboard'}</span>
                    {userRole === 'User' ? 'View Digital Certificate' : 'Go to Dashboard'}
                  </div>
                </button>
              ) : (
                <button 
                  onClick={() => window.location.hash = dashboardPath}
                  className="relative group flex-1 h-14 rounded-full overflow-hidden cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#34D399] to-[#6EE7B7] transition-transform duration-300 group-hover:scale-105"></div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-[#6EE7B7] to-[#34D399]"></div>
                  <div className="relative z-10 flex items-center justify-center gap-2 h-full text-slate-900 font-bold">
                    <span className="material-symbols-outlined text-xl">dashboard</span>
                    Go to Dashboard
                  </div>
                </button>
              )}
              <button 
                onClick={() => window.location.hash = '#/search'}
                className="flex-1 h-14 rounded-full border border-white/10 bg-white/5 text-white font-bold hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">add_circle</span>
                Schedule Another Pickup
              </button>
            </div>

            {/* Social Share */}
            <div className="animate-card flex flex-col items-center gap-4 pt-8 pb-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-white/5">
                <span className="text-slate-500 text-xs font-semibold uppercase tracking-widest">Share Your Impact</span>
              </div>
              <div className="flex gap-3">
                <button className="size-12 rounded-full bg-slate-800/50 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:border-[#34D399]/30 hover:bg-[#34D399]/10 transition-all duration-300 cursor-pointer">
                  <span className="text-sm font-bold">X</span>
                </button>
                  <button className="size-12 rounded-full bg-slate-800/50 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:border-[#3B82F6]/30 hover:bg-[#3B82F6]/10 transition-all duration-300 cursor-pointer">
                  <span className="text-sm font-bold">in</span>
                </button>
                <button className="size-12 rounded-full bg-slate-800/50 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:border-[#A855F7]/30 hover:bg-[#A855F7]/10 transition-all duration-300 cursor-pointer">
                  <span className="material-symbols-outlined text-xl">share</span>
                </button>
              </div>
            </div>

          </div>
        </main>

        {/* Footer */}
        <footer className="mt-auto border-t border-white/5 py-8 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="size-8 text-[#34D399]">
                <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
                </svg>
              </div>
              <span className="text-slate-400 text-sm">© 2024 EcoCycle. Together for a cleaner future.</span>
            </div>
            <div className="flex items-center gap-6">
              <button onClick={() => window.location.hash = '#/about'} className="text-slate-500 hover:text-[#34D399] text-sm transition-colors cursor-pointer bg-transparent border-none">About</button>
              <button onClick={() => window.location.hash = '#/contact'} className="text-slate-500 hover:text-[#34D399] text-sm transition-colors cursor-pointer bg-transparent border-none">Contact</button>
              <button onClick={() => window.location.hash = '#/how-it-works'} className="text-slate-500 hover:text-[#34D399] text-sm transition-colors cursor-pointer bg-transparent border-none">Help</button>
            </div>
          </div>
        </footer>
      </div>
    </Layout>
  );
};

export default PickupConfirmation;