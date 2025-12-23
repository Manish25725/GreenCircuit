import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
import { api, getCurrentUser } from '../services/api';
import gsap from 'gsap';

const PickupLimitReached = () => {
  const [activeBooking, setActiveBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();

  useEffect(() => {
    loadActiveBooking();
  }, []);

  useEffect(() => {
    if (!loading && activeBooking) {
      const ctx = gsap.context(() => {
        gsap.fromTo('.limit-icon', 
          { scale: 0, rotation: -180 },
          { scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.7)' }
        );
        
        gsap.fromTo('.limit-title', 
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, delay: 0.3, ease: 'power3.out' }
        );
        
        gsap.fromTo('.limit-subtitle', 
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, delay: 0.5, ease: 'power3.out' }
        );

        gsap.fromTo('.limit-card', 
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, delay: 0.6, ease: 'power3.out' }
        );

        gsap.to('.pulse-ring-limit', {
          scale: 1.5,
          opacity: 0,
          duration: 1.5,
          repeat: -1,
          ease: 'power2.out'
        });
      });

      return () => ctx.revert();
    }
  }, [loading, activeBooking]);

  const loadActiveBooking = async () => {
    try {
      const response = await api.getUserBookings();
      const bookingsData = response as any;
      const bookings = bookingsData?.bookings || bookingsData || [];
      const active = bookings.find((b: any) => 
        b.status === 'pending' || b.status === 'confirmed' || b.status === 'in-progress'
      );
      if (active) {
        setActiveBooking(active);
      }
    } catch (error) {
      console.error('Failed to load booking:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout title="" role="User" fullWidth hideSidebar>
        <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
          <Loader size="lg" color="#f59e0b" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="" role="User" fullWidth hideSidebar>
      <div className="relative flex min-h-screen w-full flex-col font-display bg-[#0B1120] text-slate-300 selection:bg-[#f59e0b] selection:text-slate-900 overflow-x-hidden">
        
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#f59e0b]/5 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#ef4444]/5 rounded-full blur-[150px]"></div>
        </div>

        {/* Navbar */}
        <div className="w-full flex justify-center fixed top-0 left-0 right-0 z-50">
          <header className="flex items-center justify-between w-full max-w-7xl px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1120]/80 backdrop-blur-xl border-b border-white/5">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.hash = '#/'}>
              <div className="p-2 bg-[#10b981]/10 rounded-xl">
                <svg className="h-6 w-6 text-[#10b981]" fill="currentColor" viewBox="0 0 48 48">
                  <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"></path>
                </svg>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">EcoCycle <span className="text-[#10b981] font-semibold">Resident</span></span>
            </div>
          </header>
        </div>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-12 relative z-10">
          <div className="w-full max-w-2xl mx-auto text-center">
            
            {/* Warning Icon */}
            <div className="relative mb-8 limit-icon">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-[#f59e0b]/20 pulse-ring-limit"></div>
              </div>
              <div className="relative w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-[#f59e0b] to-[#ef4444] flex items-center justify-center shadow-[0_0_60px_rgba(245,158,11,0.4)]">
                <span className="material-symbols-outlined text-5xl text-white">hourglass_top</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 limit-title tracking-tight">
              Pickup In Progress
            </h1>
            <p className="text-lg text-slate-400 mb-10 max-w-lg mx-auto limit-subtitle">
              You already have an active pickup request. Please wait for it to be completed before scheduling a new one.
            </p>

            {/* Active Booking Card */}
            {activeBooking && (
              <div className="limit-card bg-[#151F32]/80 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-[#f59e0b]/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl text-[#f59e0b]">local_shipping</span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-white">
                      {activeBooking.bookingId || `#REQ-${activeBooking._id?.slice(-6).toUpperCase()}`}
                    </h3>
                    <p className="text-slate-400 text-sm">Current Active Pickup</p>
                  </div>
                  <div className="ml-auto">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider ${
                      activeBooking.status === 'pending' ? 'bg-[#94a3b8]/10 text-[#94a3b8] border border-[#94a3b8]/20' :
                      activeBooking.status === 'confirmed' ? 'bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20' :
                      'bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20'
                    }`}>
                      {activeBooking.status}
                    </span>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Scheduled Date</p>
                    <p className="text-white font-semibold">
                      {activeBooking.scheduledDate ? new Date(activeBooking.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD'}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Time Slot</p>
                    <p className="text-white font-semibold">{activeBooking.scheduledTime || 'TBD'}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 col-span-2">
                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Agency</p>
                    <p className="text-white font-semibold">
                      {typeof activeBooking.agencyId === 'object' ? activeBooking.agencyId.name : 'Assigned Agency'}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex justify-between text-xs text-slate-500 mb-2">
                    <span>Progress</span>
                    <span className="text-[#f59e0b]">
                      {activeBooking.status === 'pending' ? '25%' : 
                       activeBooking.status === 'confirmed' ? '50%' : '75%'}
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#f59e0b] to-[#ef4444] rounded-full transition-all duration-500"
                      style={{ 
                        width: activeBooking.status === 'pending' ? '25%' : 
                               activeBooking.status === 'confirmed' ? '50%' : '75%' 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* No Active Booking Message */}
            {!activeBooking && (
              <div className="limit-card bg-[#151F32]/80 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl mb-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#10b981]/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-[#10b981]">check_circle</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Active Pickups</h3>
                <p className="text-slate-400">You can schedule a new pickup now!</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center limit-card">
              <button 
                onClick={() => window.location.hash = '#/dashboard'}
                className="group relative overflow-hidden px-8 py-4 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#ef4444] text-white font-bold shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_50px_rgba(245,158,11,0.5)] transition-all"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                <span className="relative flex items-center gap-2">
                  <span className="material-symbols-outlined">dashboard</span>
                  Track Your Pickup
                </span>
              </button>
              <button 
                onClick={() => window.location.hash = '#/'}
                className="px-8 py-4 rounded-xl bg-white/5 text-white font-bold border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined">home</span>
                  Back to Home
                </span>
              </button>
            </div>

            {/* Info Box */}
            <div className="limit-card mt-10 p-6 bg-[#f59e0b]/5 border border-[#f59e0b]/20 rounded-2xl text-left">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#f59e0b]/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#f59e0b]">info</span>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Why the limit?</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    To ensure the best service quality and timely pickups, we allow one active pickup request at a time. 
                    Once your current pickup is completed, you'll be able to schedule a new one immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default PickupLimitReached;
