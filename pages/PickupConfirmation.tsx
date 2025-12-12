import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { api, getCurrentUser } from '../services/api';

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

  useEffect(() => {
    loadBooking();
  }, []);

  const loadBooking = async () => {
    try {
      // Get booking ID from URL params
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.split('?')[1] || '');
      const bookingId = params.get('booking');

      if (bookingId) {
        const response = await api.getBookingById(bookingId);
        setBooking(response);
      } else {
        // Try to get the active booking
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
      <Layout title="" role="User" fullWidth hideSidebar>
        <div className="min-h-screen bg-[#102216] flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#2bee6c] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading booking details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="" role="User" fullWidth hideSidebar>
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-[#f6f8f6] dark:bg-[#102216] text-slate-900 dark:text-white font-sans">
        {/* TopNavBar */}
        <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-[#28392e] bg-[#f6f8f6]/95 dark:bg-[#102216]/95 backdrop-blur-md px-4 sm:px-10 py-3">
          <div className="flex items-center gap-4 text-slate-900 dark:text-white cursor-pointer" onClick={() => window.location.hash = '#/'}>
            <div className="size-8 text-[#2bee6c]">
              <span className="material-symbols-outlined text-[32px]">recycling</span>
            </div>
            <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">EcoCycle</h2>
          </div>
          <div className="hidden md:flex flex-1 justify-end gap-8">
            <nav className="flex items-center gap-9">
              <a className="text-sm font-medium leading-normal hover:text-[#2bee6c] transition-colors cursor-pointer" onClick={() => window.location.hash = '#/dashboard'}>Dashboard</a>
              <a className="text-sm font-medium leading-normal hover:text-[#2bee6c] transition-colors cursor-pointer" onClick={() => window.location.hash = '#/search'}>Book Pickup</a>
              <a className="text-sm font-medium leading-normal hover:text-[#2bee6c] transition-colors cursor-pointer" onClick={() => window.location.hash = '#/certificate'}>Certificates</a>
              <a className="text-sm font-medium leading-normal hover:text-[#2bee6c] transition-colors cursor-pointer" onClick={() => window.location.hash = '#/profile'}>Profile</a>
            </nav>
            <div className="flex items-center gap-4">
              <button className="flex items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-gray-200 dark:bg-[#28392e] text-slate-900 dark:text-white hover:bg-gray-300 dark:hover:bg-opacity-80 transition-colors">
                <span className="material-symbols-outlined text-[20px]">notifications</span>
              </button>
              <div 
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-[#2bee6c]/20 cursor-pointer" 
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuANn32gvr-fc9z2IHxhBX_sCZK5DZQMjOFKRZRjNdc6PaIkzdVUHN3ySRzmJNT45peL-frDuE8kRDeMZn6DUcCfk9tSRNZ2GxydtrU17QCYByjQnxsbI95sT8lZfPvLqs2oyzwCHMz_PrDlakBSOjnnkYLwqVrB5eNHAVkZ1ye8Y7Fmt1CnYYakDoWeZ7dXrCI14wDqopSp8DcbPCG5iDZnz3Myq4mAv6fI22J4wcvud2XnioBRkfp2HMOAafYlRmyQ3n8WATYkvmo")' }}
                onClick={() => window.location.hash = '#/profile'}
              ></div>
            </div>
          </div>
          {/* Mobile Menu Icon */}
          <button className="md:hidden flex items-center justify-center text-slate-900 dark:text-white">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </header>

        <main className="flex h-full grow flex-col items-center">
          <div className="px-4 sm:px-10 md:px-40 flex flex-1 justify-center py-8 w-full">
            <div className="flex flex-col max-w-[800px] flex-1 gap-8">
              
              {/* Success Hero Section */}
              <section className="flex flex-col items-center gap-6 text-center animate-fade-in-up">
                <div className="relative flex items-center justify-center size-24 rounded-full bg-[#2bee6c]/10 ring-1 ring-[#2bee6c]/30">
                  <span className="material-symbols-outlined text-[#2bee6c] text-[48px]">check_circle</span>
                  <div className="absolute inset-0 rounded-full border border-[#2bee6c]/20 animate-ping opacity-20"></div>
                </div>
                <div className="flex flex-col items-center gap-3 max-w-[560px]">
                  <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white">
                    {booking?.status === 'completed' ? 'Pickup Complete!' : 'Booking Confirmed!'}
                  </h1>
                  <p className="text-slate-600 dark:text-[#9db9a6] text-base sm:text-lg font-normal leading-relaxed">
                    {booking?.status === 'completed' 
                      ? `${booking?.agency?.name || 'The agency'} has successfully collected your e-waste.`
                      : `Your pickup has been scheduled with ${booking?.agency?.name || 'the agency'}.`
                    }
                  </p>
                </div>
              </section>

              {/* Status Card with Points */}
              <section className="w-full">
                <div className="flex flex-col md:flex-row items-stretch justify-between gap-6 rounded-xl bg-white dark:bg-[#1c271f] p-6 shadow-sm border border-gray-200 dark:border-[#28392e]">
                  <div className="flex flex-col justify-center gap-2 flex-[2_2_0px]">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2bee6c]/10 w-fit">
                      <span className="material-symbols-outlined text-[#2bee6c] text-[18px]">eco</span>
                      <p className="text-[#2bee6c] text-sm font-bold leading-normal">+{booking?.pointsEarned || 50} Eco-Points Earned</p>
                    </div>
                    <h3 className="text-xl font-bold leading-tight mt-2 text-slate-900 dark:text-white">
                      Pickup #{booking?._id?.slice(-6).toUpperCase() || 'XXXXXX'} Summary
                    </h3>
                    <p className="text-slate-500 dark:text-[#9db9a6] text-sm font-normal leading-normal">
                      {booking?.agency?.name ? (
                        <>Handled by <span className="text-slate-900 dark:text-white font-medium">{booking.agency.name}</span> (Verified Partner)</>
                      ) : (
                        'Pickup scheduled successfully'
                      )}
                    </p>
                  </div>
                  <div className="w-full md:w-48 h-32 md:h-auto bg-center bg-no-repeat bg-cover rounded-lg flex-none relative overflow-hidden group bg-gradient-to-br from-[#2bee6c]/20 to-[#2bee6c]/5 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#2bee6c] text-6xl">recycling</span>
                  </div>
                </div>
              </section>

              {/* Progress Bar */}
              <section className="w-full flex flex-col gap-3">
                <div className="flex gap-6 justify-between items-end">
                  <div>
                    <p className="text-base font-bold leading-normal text-slate-900 dark:text-white">Recycling Process Status</p>
                    <p className="text-slate-500 dark:text-[#9db9a6] text-xs">Status: {booking?.status || 'pending'}</p>
                  </div>
                  <p className="text-[#2bee6c] text-sm font-bold leading-normal">{getProgressPercentage(booking?.status || 'pending')}%</p>
                </div>
                <div className="relative w-full h-3 rounded-full bg-gray-200 dark:bg-[#28392e] overflow-hidden">
                  <div className="absolute left-0 top-0 h-full rounded-full bg-[#2bee6c] shadow-[0_0_10px_rgba(43,238,108,0.5)] transition-all duration-500" style={{ width: `${getProgressPercentage(booking?.status || 'pending')}%` }}></div>
                </div>
                <div className="flex justify-between text-xs font-medium text-slate-400 dark:text-[#9db9a6] mt-1">
                  <span>Booked</span>
                  <span>Collected</span>
                  <span className="text-[#2bee6c]">Processing</span>
                  <span>Certificate</span>
                </div>
              </section>

              {/* Detailed Info Grid */}
              <section className="rounded-xl border border-solid border-gray-200 dark:border-[#28392e] bg-transparent overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2">
                  <div className="flex flex-col gap-1 border-b sm:border-b-0 sm:border-r border-solid border-gray-200 dark:border-[#28392e] p-5 hover:bg-white/5 transition-colors">
                    <p className="text-slate-500 dark:text-[#9db9a6] text-sm font-normal leading-normal mb-1 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">tag</span> Pickup ID
                    </p>
                    <p className="text-base font-semibold text-slate-900 dark:text-white">#{booking?._id?.slice(-6).toUpperCase() || 'XXXXXX'}</p>
                  </div>
                  <div className="flex flex-col gap-1 border-b border-solid border-gray-200 dark:border-[#28392e] p-5 hover:bg-white/5 transition-colors">
                    <p className="text-slate-500 dark:text-[#9db9a6] text-sm font-normal leading-normal mb-1 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">event</span> Date & Time
                    </p>
                    <p className="text-base font-semibold text-slate-900 dark:text-white">
                      {booking?.date ? formatDate(booking.date) : 'Pending'} 
                      {booking?.slot ? ` • ${formatTime(booking.slot.startTime)}` : ''}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 border-b sm:border-b-0 sm:border-r border-solid border-gray-200 dark:border-[#28392e] p-5 hover:bg-white/5 transition-colors">
                    <p className="text-slate-500 dark:text-[#9db9a6] text-sm font-normal leading-normal mb-1 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">inventory_2</span> Items
                    </p>
                    <p className="text-base font-semibold text-slate-900 dark:text-white">
                      {booking?.items?.length || 0} item(s): {booking?.items?.map(i => i.type).join(', ') || 'N/A'}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 p-5 hover:bg-white/5 transition-colors">
                    <p className="text-slate-500 dark:text-[#9db9a6] text-sm font-normal leading-normal mb-1 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">next_plan</span> Status
                    </p>
                    <p className="text-base font-semibold text-[#2bee6c] capitalize">{booking?.status || 'Pending'}</p>
                  </div>
                </div>
              </section>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                    onClick={() => window.location.hash = '#/certificate'}
                    className="flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-[#2bee6c] hover:bg-[#2bee6c]/90 text-[#102216] gap-2 text-base font-bold leading-normal tracking-[0.015em] px-6 transition-all transform active:scale-95 shadow-[0_0_15px_rgba(43,238,108,0.2)]"
                >
                  <span className="material-symbols-outlined text-[20px]">verified</span>
                  View Digital Certificate
                </button>
                <button 
                    onClick={() => window.location.hash = '#/dashboard'}
                    className="flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 border border-gray-300 dark:border-[#28392e] bg-transparent hover:bg-gray-100 dark:hover:bg-[#28392e] text-slate-900 dark:text-white gap-2 text-base font-medium leading-normal tracking-[0.015em] px-6 transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>

              {/* Social Share Micro-interaction */}
              <div className="flex justify-center items-center gap-4 pt-4">
                <p className="text-xs text-slate-500 dark:text-[#9db9a6] font-medium uppercase tracking-wider">Share your impact</p>
                <div className="flex gap-2">
                  <button className="size-8 rounded-full bg-[#1c271f] border border-[#28392e] flex items-center justify-center text-white hover:border-[#2bee6c] hover:text-[#2bee6c] transition-colors cursor-pointer">
                    <span className="text-xs font-bold">X</span>
                  </button>
                  <button className="size-8 rounded-full bg-[#1c271f] border border-[#28392e] flex items-center justify-center text-white hover:border-[#2bee6c] hover:text-[#2bee6c] transition-colors cursor-pointer">
                    <span className="text-xs font-bold">in</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </main>

        <footer className="mt-auto border-t border-gray-200 dark:border-[#28392e] py-6 bg-[#f6f8f6] dark:bg-[#102216]">
          <div className="px-4 sm:px-10 md:px-40 text-center">
            <p className="text-slate-500 dark:text-[#9db9a6] text-sm">© 2023 EcoCycle Inc. Together for a cleaner future.</p>
          </div>
        </footer>
      </div>
    </Layout>
  );
};

export default PickupConfirmation;