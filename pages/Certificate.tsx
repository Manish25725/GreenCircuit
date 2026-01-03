import React, { useState, useEffect } from 'react';
import { api, getCurrentUser, Booking } from '../services/api';
import PickupCertificate from '../components/PickupCertificate';
import Loader from '../components/Loader';

const Certificate = () => {
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();

  useEffect(() => {
    loadCompletedBooking();
  }, []);

  const loadCompletedBooking = async () => {
    try {
      // Check if there's a specific booking ID in the URL
      const params = new URLSearchParams(window.location.hash.split('?')[1]);
      const bookingId = params.get('booking');

      if (bookingId) {
        // Load specific booking
        const booking = await api.getBookingById(bookingId);
        if (booking.status === 'completed') {
          setCompletedBooking(booking);
        }
      } else {
        // Load the most recent completed booking
        const response: any = await api.getUserBookings();
        const bookings = response?.bookings || response || [];
        const completed = bookings.filter((b: Booking) => b.status === 'completed');
        
        if (completed.length > 0) {
          // Sort by date and get the most recent
          const sorted = completed.sort((a: Booking, b: Booking) => 
            new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()
          );
          setCompletedBooking(sorted[0]);
        }
      }
    } catch (error) {
      console.error('Failed to load completed booking:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1116] flex items-center justify-center">
        <Loader size="lg" color="#10b981" />
      </div>
    );
  }

  if (!completedBooking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B1116] via-[#0f1419] to-[#0B1116] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-gray-500">verified</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">No Certificate Available</h2>
          <p className="text-slate-400 mb-8">
            You don't have any completed pickups yet. Complete a pickup to receive your e-waste collection certificate.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => window.location.hash = '#/search'}
              className="bg-[#10b981] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#059669] transition-colors"
            >
              Schedule a Pickup
            </button>
            <button
              onClick={() => window.location.hash = '#/history'}
              className="bg-white/5 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/5 transition-colors border border-white/5"
            >
              View Pickup History
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate total weight from items
  const totalWeight = completedBooking.items?.reduce((sum, item) => sum + (item.weight || 0), 0) || 0;
  
  // Extract waste types
  const wasteTypes = completedBooking.items?.map(item => item.type) || [];
  
  // Get agency name
  const agencyName = typeof completedBooking.agencyId === 'object' 
    ? completedBooking.agencyId.name 
    : 'Authorized Agency';

  // Calculate eco points (assuming 10 points per kg)
  const ecoPoints = completedBooking.ecoPointsEarned || Math.round(totalWeight * 10);

  return (
    <PickupCertificate
      userName={user?.name || 'Valued Customer'}
      agencyName={agencyName}
      pickupId={completedBooking.bookingId || completedBooking._id}
      wasteWeight={totalWeight}
      wasteTypes={wasteTypes}
      issueDate={completedBooking.completedAt || completedBooking.updatedAt || completedBooking.createdAt}
      ecoPoints={ecoPoints}
      bookingId={completedBooking._id}
    />
  );
};

export default Certificate;