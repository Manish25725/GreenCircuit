import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import { api, getCurrentUser, isAuthenticated } from '../services/api';
import gsap from 'gsap';
import Loader from '../components/Loader';
import NotificationBell from '../components/NotificationBell';

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

interface Item {
  id: string;
  type: string;
  quantity: number;
  description: string;
  estimatedWeight: number;
}

interface Slot {
  _id: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

const SchedulePickup = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState({ type: '', quantity: 1, description: '', estimatedWeight: 0 });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [agencyId, setAgencyId] = useState<string>('');
  const [agencyName, setAgencyName] = useState<string>('');
  const [agencyDetails, setAgencyDetails] = useState<any>(null);
  const [loadingAgency, setLoadingAgency] = useState(true);
  const [checkingLimit, setCheckingLimit] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [limitExceeded, setLimitExceeded] = useState(false);
  const [activeBooking, setActiveBooking] = useState<any>(null);
  const limitPageRef = useRef<HTMLDivElement>(null);
  const user = getCurrentUser();
  const userRole = getUserRole();
  const dashboardPath = getDashboardPath(userRole);

  // Business-specific theme colors
  const isBusiness = userRole === 'Business';
  const primaryColor = isBusiness ? '#3b82f6' : '#10b981';
  const primaryColorLight = isBusiness ? 'blue-500' : '[#10b981]';
  const brandName = isBusiness ? 'EcoCycle Business' : 'EcoCycle Resident';

  useEffect(() => {
    // Check if user is logged in
    if (!isAuthenticated()) {
      alert('Please log in to schedule a pickup');
      window.location.hash = '#/login';
      return;
    }

    // Check for active bookings
    checkActiveBookings();

    // Get agency ID from URL params and fetch from MongoDB
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.split('?')[1] || '');
    const agency = params.get('agency');
    
    if (agency) {
      setAgencyId(agency);
      fetchAgencyDetails(agency);
    } else {
      setLoadingAgency(false);
      // Redirect back to search if no agency selected
      window.location.hash = '#/search';
    }
  }, []);

  const fetchAgencyDetails = async (id: string) => {
    try {
      setLoadingAgency(true);
      const agency = await api.getAgencyById(id);
      if (agency) {
        setAgencyDetails(agency);
        setAgencyName(agency.name || 'Selected Agency');
      }
    } catch (error) {
      console.error('Failed to fetch agency details:', error);
      // Redirect back to search if agency not found
      window.location.hash = '#/search';
    } finally {
      setLoadingAgency(false);
    }
  };

  const checkActiveBookings = async () => {
    try {
      const bookingsData = await api.getUserBookings();
      const bookings = bookingsData.bookings || bookingsData || [];
      const active = bookings.find((b: any) => 
        b.status === 'pending' || b.status === 'confirmed' || b.status === 'in-progress'
      );
      if (active) {
        setLimitExceeded(true);
        setActiveBooking(active);
        // Don't redirect, show limit page inline
        return;
      }
    } catch (e) {
      console.log('Could not check active bookings');
    } finally {
      setCheckingLimit(false);
    }
  };

  // GSAP animation for limit exceeded page
  useEffect(() => {
    if (limitExceeded) {
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
  }, [limitExceeded]);

  useEffect(() => {
    if (agencyId) {
      loadSlots();
    }
  }, [agencyId, selectedDate]);

  const loadSlots = async () => {
    try {
      setLoadingSlots(true);
      const dateNum = selectedDate.getDate();
      const response = await api.getSlots(dateNum, agencyId);
      if (response && Array.isArray(response)) {
        // Transform to expected format
        const formattedSlots = response.map((slot: any) => ({
          _id: slot._id || slot.id || String(Math.random()),
          startTime: slot.startTime || slot.time?.split(' - ')[0] || '09:00',
          endTime: slot.endTime || slot.time?.split(' - ')[1] || '10:00',
          available: slot.available !== false && slot.status !== 'booked'
        }));
        setSlots(formattedSlots);
      } else {
        // Generate default slots if API returns empty
        const defaultSlots = [
          { _id: '1', startTime: '09:00', endTime: '10:00', available: true },
          { _id: '2', startTime: '10:00', endTime: '11:00', available: true },
          { _id: '3', startTime: '11:00', endTime: '12:00', available: true },
          { _id: '4', startTime: '13:00', endTime: '14:00', available: true },
          { _id: '5', startTime: '14:00', endTime: '15:00', available: true },
          { _id: '6', startTime: '15:00', endTime: '16:00', available: true },
          { _id: '7', startTime: '16:00', endTime: '17:00', available: true },
        ];
        setSlots(defaultSlots);
      }
    } catch (error) {
      console.error('Failed to load slots:', error);
      // Generate default slots if API fails
      const defaultSlots = [
        { _id: '1', startTime: '09:00', endTime: '10:00', available: true },
        { _id: '2', startTime: '10:00', endTime: '11:00', available: true },
        { _id: '3', startTime: '11:00', endTime: '12:00', available: true },
        { _id: '4', startTime: '13:00', endTime: '14:00', available: true },
        { _id: '5', startTime: '14:00', endTime: '15:00', available: true },
        { _id: '6', startTime: '15:00', endTime: '16:00', available: true },
        { _id: '7', startTime: '16:00', endTime: '17:00', available: true },
      ];
      setSlots(defaultSlots);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleAddItem = () => {
    if (newItem.type && newItem.quantity > 0) {
      const typeLabel = newItem.type === 'large-appliance' ? 'Large Appliances' :
                        newItem.type === 'small-appliance' ? 'Small Appliances' :
                        newItem.type === 'electronics' ? 'Consumer Electronics' :
                        newItem.type === 'batteries' ? 'Batteries & Power Supplies' :
                        newItem.type === 'accessories' ? 'Cables & Accessories' : newItem.type;
      
      setItems([...items, { ...newItem, id: Date.now().toString(), type: typeLabel }]);
      setNewItem({ type: '', quantity: 1, description: '', estimatedWeight: 0 });
    }
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot || items.length === 0) {
      alert('Please add items and select a time slot');
      return;
    }

    // First check if user already has active booking - redirect to limit page
    try {
      const bookingsData = await api.getUserBookings();
      const bookings = bookingsData.bookings || bookingsData || [];
      const active = bookings.find((b: any) => 
        b.status === 'pending' || b.status === 'confirmed' || b.status === 'in-progress'
      );
      if (active) {
        // Redirect to the limit reached page instead of showing UI here
        window.location.hash = '#/pickup-limit';
        return;
      }
    } catch (e) {
      // Continue if check fails
    }

    // Check authentication before attempting booking
    if (!isAuthenticated()) {
      window.location.hash = '#/login';
      return;
    }

    try {
      setSubmitting(true);
      const bookingData = {
        agencyId,
        slotId: selectedSlot._id,
        scheduledDate: selectedDate.toISOString(),
        scheduledTime: `${selectedSlot.startTime} - ${selectedSlot.endTime}`,
        items: items.map(item => ({
          type: item.type,
          quantity: item.quantity,
          description: item.description
        })),
        pickupAddress: user?.address || {
          street: 'Not provided',
          city: 'Not provided',
          state: 'Not provided',
          zipCode: '000000'
        },
        notes: ''
      };

      const response = await api.createBooking(bookingData);
      if (response && response._id) {
        // Navigate to confirmation page with booking ID
        window.location.hash = `#/pickup-confirmation?booking=${response._id}`;
      } else {
        // Fallback - still navigate to confirmation
        window.location.hash = `#/pickup-confirmation`;
      }
    } catch (error: any) {
      console.error('Failed to create booking:', error);
      const errorMsg = (error.message || '').toLowerCase();
      
      if (errorMsg.includes('unauthorized') || errorMsg.includes('user not found') || errorMsg.includes('token expired')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.hash = '#/login';
        return;
      }
      
      // For ANY booking error, redirect to limit page - this handles all limit-related errors
      window.location.hash = '#/pickup-limit';
    } finally {
      setSubmitting(false);
    }
  };

  const formatSlotTime = (slot: Slot) => {
    const formatTime = (time: string) => {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes || '00'} ${ampm}`;
    };
    return `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`;
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];

  const navigateMonth = (direction: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1));
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (newDate >= new Date(new Date().setHours(0, 0, 0, 0))) {
      setSelectedDate(newDate);
      setSelectedSlot(null);
    }
  };

  return (
    <Layout title="" role={userRole} fullWidth hideSidebar>
      {/* Limit Exceeded UI */}
      {limitExceeded ? (
        <div ref={limitPageRef} className="relative flex min-h-screen w-full flex-col font-display bg-[#0B1120] text-slate-300 selection:bg-[#f59e0b] selection:text-slate-900 overflow-x-hidden">
          
          {/* Background Effects */}
          <div className="fixed inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#f59e0b]/5 rounded-full blur-[150px]"></div>
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#ef4444]/5 rounded-full blur-[150px]"></div>
          </div>

          {/* Navbar */}
          <div className="w-full flex justify-center fixed top-0 left-0 right-0 z-50">
            <header className="flex items-center justify-between w-full max-w-7xl px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1120]/80 backdrop-blur-xl border-b border-white/5">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.hash = '#/'}>
                <div className={`p-2 rounded-xl ${isBusiness ? 'bg-blue-500/10' : 'bg-[#10b981]/10'}`}>
                  <svg className={`h-6 w-6 ${isBusiness ? 'text-blue-500' : 'text-[#10b981]'}`} fill="currentColor" viewBox="0 0 48 48">
                    <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"></path>
                  </svg>
                </div>
                <span className="text-xl font-bold text-white tracking-tight">
                  EcoCycle <span className={`font-semibold ${isBusiness ? 'text-blue-500' : 'text-[#10b981]'}`}>
                    {isBusiness ? 'Business' : 'Resident'}
                  </span>
                </span>
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

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center limit-card">
                <button 
                  onClick={() => window.location.hash = dashboardPath}
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
      ) : (checkingLimit || loadingAgency) ? (
        <div className="bg-[#0B1116] min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader size="md" color="#10b981" />
            <p className="text-[#94a3b8] mt-4">{checkingLimit ? 'Checking availability...' : 'Loading agency details...'}</p>
          </div>
        </div>
      ) : (
      <div className={`bg-[#0B1116] font-sans text-gray-200 min-h-screen flex flex-col relative overflow-x-hidden selection:text-white ${isBusiness ? 'selection:bg-blue-500' : 'selection:bg-[#10b981]'}`}>
        
        {/* Background Ambient Blobs */}
        <div className={`fixed top-0 left-0 w-full h-[500px] rounded-full blur-[120px] -translate-y-1/2 pointer-events-none ${isBusiness ? 'bg-blue-500/5' : 'bg-[#10b981]/5'}`}></div>
        <div className="fixed bottom-0 right-0 w-full h-[500px] bg-[#3b82f6]/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none"></div>

        {/* Standard User Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 transition-all duration-300">
            <div className="flex items-center gap-3 text-white cursor-pointer" onClick={() => window.location.hash = '#/'}>
                <div className={`p-2 rounded-lg ${isBusiness ? 'bg-blue-500/10' : 'bg-[#10b981]/10'}`}>
                    <svg className={`h-6 w-6 ${isBusiness ? 'text-blue-500' : 'text-[#10b981]'}`} fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"></path>
                    </svg>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white">
                  EcoCycle <span className={`font-semibold ${isBusiness ? 'text-blue-500' : 'text-[#10b981]'}`}>
                    {isBusiness ? 'Business' : 'Resident'}
                  </span>
                </h2>
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
                      className="size-8 rounded-full bg-cover bg-center ring-2 ring-white/10 group-hover:ring-[#10b981]/50 transition-all" 
                      style={{ backgroundImage: `url("${user?.avatar ? user.avatar + '?t=' + Date.now() : 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User') + '&background=10b981&color=fff'}")` }}
                    ></div>
                    <span className="text-sm font-medium text-gray-200">{user?.name || 'User'}</span>
                  </button>
                  {/* Hover Preview */}
                  <div className="absolute top-14 right-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100]">
                    <div className="bg-[#151F26] border border-white/10 rounded-2xl p-4 shadow-2xl">
                      <div 
                        className="size-32 rounded-xl bg-cover bg-center ring-4 ring-[#10b981]/30" 
                        style={{ backgroundImage: `url("${user?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User') + '&background=10b981&color=fff'}")` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <NotificationBell />
            </div>
        </header>

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 mt-20 relative z-10">
          <div className="flex flex-col gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <button 
                  onClick={() => window.location.hash = dashboardPath}
                  className={`p-2 rounded-lg border transition-colors ${isBusiness ? 'bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20' : 'bg-[#10b981]/10 border-[#10b981]/20 text-[#10b981] hover:bg-[#10b981]/20'}`}
                  title="Back to Dashboard"
                >
                  <span className="material-symbols-outlined text-xl">arrow_back</span>
                </button>
                <div className="flex flex-wrap gap-2 items-center text-sm">
                  <a className="text-[#94a3b8] font-medium hover:text-white cursor-pointer transition-colors" onClick={() => window.location.hash = '#/search'}>Agency Selection</a>
                  <span className="text-[#94a3b8] font-medium">/</span>
                  <span className="text-white font-medium">Schedule Pickup</span>
                  <span className="text-[#94a3b8] font-medium">/</span>
                  <span className="text-[#94a3b8] font-medium">Confirmation</span>
                </div>
              </div>
              <div className="flex min-w-72 flex-col gap-2">
                <p className="text-white text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em]">Schedule Your Pickup</p>
                <p className="text-[#94a3b8] text-base font-normal leading-normal">Provide item details and select a date for your e-waste collection.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
              <div className="lg:col-span-3 space-y-8">
                
                {/* Item List */}
                <div className="p-4 sm:p-6 bg-[#151F26] rounded-2xl border border-white/5 shadow-lg">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold leading-tight text-white mb-1">Item Information</h3>
                    <p className="text-sm text-[#94a3b8]">List all the e-waste items you want to recycle. You can add multiple items.</p>
                  </div>
                  
                  <div className="mb-8 space-y-3">
                    {items.map(item => (
                        <div key={item.id} className="flex items-start gap-4 p-3 rounded-xl bg-[#0B1116] border border-white/5 group hover:border-white/10 transition-colors">
                            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#151F26] shadow-inner border border-white/5 ${isBusiness ? 'text-blue-500' : 'text-[#10b981]'}`}>
                                <span className="material-symbols-outlined">
                                    {item.type.includes('Appliance') ? 'kitchen' : 
                                     item.type.includes('Electronics') ? 'laptop_mac' : 
                                     item.type.includes('Batteries') ? 'battery_full' : 'devices'}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0 py-1">
                                <div className="flex justify-between items-start mb-1">
                                    <p className="text-sm font-bold text-white truncate">{item.type}</p>
                                    <div className="flex gap-2">
                                      <span className={`text-xs font-bold px-2 py-0.5 rounded border ${isBusiness ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20'}`}>Qty: {item.quantity}</span>
                                      {item.estimatedWeight > 0 && (
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded border ${isBusiness ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>{item.estimatedWeight} kg</span>
                                      )}
                                    </div>
                                </div>
                                <p className="text-xs text-[#94a3b8] line-clamp-1">{item.description}</p>
                            </div>
                            <button 
                                onClick={() => handleRemoveItem(item.id)}
                                className="flex items-center justify-center size-8 rounded-lg text-[#94a3b8] hover:bg-red-500/10 hover:text-red-500 transition-colors cursor-pointer self-center" 
                                title="Remove Item"
                            >
                                <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                        </div>
                    ))}
                  </div>

                  {/* Add New Item Form */}
                  <div className="pt-6 border-t border-white/5">
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`material-symbols-outlined text-xl ${isBusiness ? 'text-blue-500' : 'text-[#10b981]'}`}>add_circle</span>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">Add New Item</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      <div className="space-y-2 md:col-span-8">
                        <label className="text-sm font-medium text-gray-300" htmlFor="material-type">Type of Material</label>
                        <div className="relative group">
                          <select 
                            value={newItem.type}
                            onChange={(e) => setNewItem({...newItem, type: e.target.value})}
                            className={`w-full h-11 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 transition-all appearance-none cursor-pointer placeholder-gray-500 ${isBusiness ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-[#10b981] focus:border-[#10b981]'}`} 
                            id="material-type"
                          >
                            <option value="" disabled>Select category</option>
                            <option value="large-appliance">Large Appliances (Fridge, Washing Machine)</option>
                            <option value="small-appliance">Small Appliances (Toaster, Vacuum)</option>
                            <option value="electronics">Consumer Electronics (TV, Computer, Phone)</option>
                            <option value="batteries">Batteries & Power Supplies</option>
                            <option value="accessories">Cables & Accessories</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none group-hover:text-white transition-colors">expand_more</span>
                        </div>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-300" htmlFor="item-count">Quantity</label>
                        <div className="relative">
                          <input 
                            value={newItem.quantity}
                            onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 0})}
                            className={`w-full h-11 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 transition-all ${isBusiness ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-[#10b981] focus:border-[#10b981]'}`} 
                            id="item-count" 
                            min="1" 
                            placeholder="1" 
                            type="number"
                          />
                        </div>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-300" htmlFor="item-weight">Weight (kg)</label>
                        <div className="relative">
                          <input 
                            value={newItem.estimatedWeight || ''}
                            onChange={(e) => setNewItem({...newItem, estimatedWeight: parseFloat(e.target.value) || 0})}
                            className={`w-full h-11 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 transition-all ${isBusiness ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-[#10b981] focus:border-[#10b981]'}`} 
                            id="item-weight" 
                            min="0" 
                            step="0.1"
                            placeholder="0" 
                            type="number"
                          />
                        </div>
                      </div>
                      <div className="space-y-2 md:col-span-12">
                        <label className="text-sm font-medium text-gray-300" htmlFor="item-details">Item Details / Description</label>
                        <textarea 
                            value={newItem.description}
                            onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                            className={`w-full px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 resize-none transition-all placeholder:text-gray-600 ${isBusiness ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-[#10b981] focus:border-[#10b981]'}`} 
                            id="item-details" 
                            placeholder="Please describe the condition and specifics (e.g., 'Broken screen on laptop', 'Old CRT Monitor')" 
                            rows={2}
                        ></textarea>
                      </div>
                      <div className="md:col-span-12 flex justify-end">
                        <button 
                            onClick={handleAddItem}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0B1116] border font-bold text-sm shadow-lg transition-all duration-200 cursor-pointer ${isBusiness ? 'border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-[#0B1116] shadow-blue-500/10' : 'border-[#10b981] text-[#10b981] hover:bg-[#10b981] hover:text-[#0B1116] shadow-[#10b981]/10'}`}
                        >
                            Add Item
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calendar */}
                <div className="p-4 sm:p-6 bg-[#151F26] rounded-2xl border border-white/5 shadow-lg">
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <button 
                        onClick={() => navigateMonth(-1)}
                        className="flex items-center justify-center size-10 rounded-full hover:bg-white/5 transition-colors cursor-pointer text-[#94a3b8] hover:text-white"
                      >
                        <span className="material-symbols-outlined">chevron_left</span>
                      </button>
                      <p className="text-lg font-bold leading-tight flex-1 text-center text-white">
                        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                      </p>
                      <button 
                        onClick={() => navigateMonth(1)}
                        className="flex items-center justify-center size-10 rounded-full hover:bg-white/5 transition-colors cursor-pointer text-[#94a3b8] hover:text-white"
                      >
                        <span className="material-symbols-outlined">chevron_right</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-7 gap-y-1 mb-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-xs font-bold uppercase tracking-wider text-[#94a3b8] py-2">{day}</div>
                      ))}
                      
                      {/* Empty start days */}
                      {Array.from({ length: getFirstDayOfMonth(currentMonth) }, (_, i) => (
                        <div key={`empty-${i}`}></div>
                      ))}

                      {/* Days */}
                      {Array.from({ length: getDaysInMonth(currentMonth) }, (_, i) => i + 1).map(day => {
                        const dayDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                        const isSelected = selectedDate.toDateString() === dayDate.toDateString();
                        const isPast = dayDate < new Date(new Date().setHours(0, 0, 0, 0));
                        const isToday = dayDate.toDateString() === new Date().toDateString();
                        
                        return (
                          <button 
                            key={day}
                            onClick={() => handleDateSelect(day)}
                            disabled={isPast}
                            className={`relative h-12 w-full text-sm font-medium leading-normal transition-all group rounded-lg
                                ${isSelected 
                                    ? (isBusiness ? 'bg-blue-500 text-white font-bold shadow-lg shadow-blue-500/20' : 'bg-[#10b981] text-[#0B1116] font-bold shadow-lg shadow-[#10b981]/20')
                                    : isPast
                                    ? 'text-gray-600 cursor-not-allowed'
                                    : 'text-gray-300 hover:bg-white/5 hover:text-white cursor-pointer'
                                }
                            `}
                          >
                            <div className="flex size-full items-center justify-center">{day}</div>
                            {isToday && !isSelected && (
                                <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 size-1.5 rounded-full ${isBusiness ? 'bg-blue-500' : 'bg-[#10b981]'}`}></div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-4 flex items-center justify-center gap-6 pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <div className={`size-2 rounded-full ${isBusiness ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`}></div>
                        <span className="text-xs text-[#94a3b8]">Available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-gray-600"></div>
                        <span className="text-xs text-[#94a3b8]">Unavailable</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Slot Selection */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                <div className="flex flex-col gap-1 mb-2">
                    <h2 className="text-white text-lg sm:text-[22px] font-bold leading-tight tracking-[-0.015em]">
                        Available Slots
                    </h2>
                    <p className="text-[#94a3b8] text-sm">
                      For {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                </div>
                
                <div className="p-4 sm:p-6 bg-[#151F26] rounded-2xl border border-white/5 shadow-lg flex-1 flex flex-col">
                    {loadingSlots ? (
                        <div className="grid grid-cols-1 gap-3">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-14 w-full rounded-xl bg-white/5 animate-pulse"></div>
                            ))}
                        </div>
                    ) : slots.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center text-center">
                            <div>
                                <span className="material-symbols-outlined text-4xl text-[#94a3b8] mb-2">event_busy</span>
                                <p className="text-[#94a3b8]">No slots available for this date</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3">
                            {slots.filter(slot => slot.available !== false).map((slot) => (
                                <button
                                    key={slot._id}
                                    onClick={() => setSelectedSlot(slot)}
                                    className={`h-14 w-full rounded-xl border text-sm font-medium transition-all cursor-pointer flex items-center px-4 justify-between group
                                        ${selectedSlot?._id === slot._id 
                                            ? (isBusiness ? 'bg-blue-500/20 border-blue-500 text-blue-500' : 'bg-[#10b981]/20 border-[#10b981] text-[#10b981]')
                                            : 'bg-[#0B1116] border-white/5 text-gray-300 hover:border-white/20 hover:bg-white/5'
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-xl">schedule</span>
                                        <span>{formatSlotTime(slot)}</span>
                                    </div>
                                    {selectedSlot?._id === slot._id && (
                                        <span className="material-symbols-outlined text-xl">check_circle</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                
                <div className="w-full pt-4 sticky bottom-0 z-10">
                    <button 
                        onClick={handleConfirmBooking}
                        disabled={!selectedSlot || items.length === 0 || submitting}
                        className={`w-full flex min-w-[84px] items-center justify-center overflow-hidden rounded-xl h-14 px-8 text-white text-base font-bold leading-normal tracking-[0.015em] transition-all
                            ${selectedSlot && items.length > 0 && !submitting
                                ? (isBusiness ? 'bg-blue-500 hover:bg-blue-600 cursor-pointer shadow-lg shadow-blue-500/30 transform hover:-translate-y-1' : 'bg-[#10b981] hover:bg-[#059669] cursor-pointer shadow-lg shadow-[#10b981]/30 transform hover:-translate-y-1')
                                : (isBusiness ? 'bg-blue-500/50 opacity-50 cursor-not-allowed' : 'bg-[#10b981]/50 opacity-50 cursor-not-allowed')
                            }
                        `}
                    >
                        <span className="truncate">{submitting ? 'Booking...' : 'Confirm Pickup Slot'}</span>
                        {!submitting && <span className="material-symbols-outlined ml-2">arrow_forward</span>}
                    </button>
                    {items.length === 0 && (
                        <p className="text-center text-[#94a3b8] text-sm mt-2">Please add at least one item</p>
                    )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      )}
    </Layout>
  );
};

export default SchedulePickup;