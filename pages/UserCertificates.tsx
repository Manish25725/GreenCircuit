import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
import NotificationBell from '../components/NotificationBell';
import { api, getCurrentUser, Booking } from '../services/api';

const UserCertificates = () => {
  const [user, setUser] = useState<any>(null);
  const [completedBookings, setCompletedBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'expired'>('all');

  useEffect(() => {
    loadUserData();
    fetchCompletedBookings();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await api.getMe();
      setUser(userData);
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to load user data:', error);
      // Fallback to localStorage
      const currentUser = getCurrentUser();
      setUser(currentUser);
    }
  };

  const fetchCompletedBookings = async () => {
    try {
      setLoading(true);
      const response: any = await api.getUserBookings();
      const bookings = response?.bookings || response || [];
      const completed = bookings.filter((b: Booking) => b.status === 'completed');
      setCompletedBookings(completed);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.hash = '#/login';
  };

  const getExpiryDate = (issueDate: string) => {
    const date = new Date(issueDate);
    date.setMonth(date.getMonth() + 6);
    return date;
  };

  const getFilteredBookings = () => {
    if (filter === 'all') return completedBookings;
    if (filter === 'active') {
      return completedBookings.filter(booking => {
        const issueDate = booking.completedAt || booking.updatedAt || booking.scheduledDate;
        const expiryDate = getExpiryDate(issueDate);
        return expiryDate > new Date();
      });
    }
    if (filter === 'expired') {
      return completedBookings.filter(booking => {
        const issueDate = booking.completedAt || booking.updatedAt || booking.scheduledDate;
        const expiryDate = getExpiryDate(issueDate);
        return expiryDate <= new Date();
      });
    }
    return completedBookings;
  };

  const filteredBookings = getFilteredBookings();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const isExpired = (issueDate: string) => {
    const expiryDate = getExpiryDate(issueDate);
    return expiryDate <= new Date();
  };

  const getTotalWeight = (booking: Booking) => {
    return booking.items?.reduce((sum, item) => sum + (item.weight || 0), 0) || 0;
  };

  const getWasteTypes = (booking: Booking) => {
    return booking.items?.map(item => item.type).join(', ') || 'E-Waste';
  };

  return (
    <Layout title="" role="User" fullWidth hideSidebar>
      <div className="bg-[#0B1116] font-sans text-gray-200 antialiased selection:bg-[#10b981] selection:text-white min-h-screen flex flex-col relative overflow-hidden">
        
        {/* Background Ambient Blobs */}
        <div className="fixed top-0 left-0 w-full h-[500px] bg-[#10b981]/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
        <div className="fixed bottom-0 right-0 w-full h-[500px] bg-[#3b82f6]/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none"></div>

        {/* Standard Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 transition-all duration-300">
          <div className="flex items-center gap-3 text-white cursor-pointer" onClick={() => window.location.hash = '#/'}>
            <div className="p-2 bg-[#10b981]/10 rounded-lg">
              <svg className="h-6 w-6 text-[#10b981]" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">EcoCycle <span className="text-[#10b981] font-semibold">Resident</span></h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <button 
                onClick={() => window.location.hash = '#/profile'}
                className="hidden sm:flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-[#151F26] border border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div 
                  className="size-8 rounded-full bg-cover bg-center ring-2 ring-white/10 group-hover:ring-[#10b981]/50 transition-all" 
                  style={{ backgroundImage: `url("${user?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User') + '&background=10b981&color=fff'}")`}}
                ></div>
                <span className="text-sm font-medium text-gray-200">{user?.name || 'User'}</span>
              </button>
              {/* Hover Preview */}
              <div className="absolute top-14 right-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100]">
                <div className="bg-[#151F26] border border-white/10 rounded-2xl p-4 shadow-2xl">
                  <div 
                    className="size-32 rounded-xl bg-cover bg-center ring-4 ring-[#10b981]/30" 
                    style={{ backgroundImage: `url("${user?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User') + '&background=10b981&color=fff'}")`}}
                  ></div>
                </div>
              </div>
            </div>
            <NotificationBell />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 pt-20 relative z-10">
          <div className="layout-container flex h-full flex-col px-4 sm:px-6 lg:px-10 py-8">
            {/* Back Button */}
            <button 
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-[#10b981] hover:text-[#059669] transition-colors mb-6 group w-fit"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              <span className="text-sm font-medium">Back to Dashboard</span>
            </button>

            {/* Page Header */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#10b981]/10 rounded-xl">
                    <span className="material-symbols-outlined text-[#10b981] text-[32px]">workspace_premium</span>
                  </div>
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white">My Certificates</h1>
                    <p className="text-gray-400 text-sm mt-1">Appreciation certificates from agencies</p>
                  </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      filter === 'all'
                        ? 'bg-[#10b981] text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('active')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      filter === 'active'
                        ? 'bg-[#10b981] text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setFilter('expired')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      filter === 'expired'
                        ? 'bg-[#10b981] text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    Expired
                  </button>
                </div>
              </div>
            </div>

            {/* Certificates Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Loader size="md" color="#10b981" className="mb-4" />
                  <p className="text-gray-400">Loading certificates...</p>
                </div>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-gray-500 text-[48px]">workspace_premium</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No certificates yet</h3>
                <p className="text-gray-400 text-center max-w-md mb-6">
                  Complete e-waste pickups to receive appreciation certificates from agencies
                </p>
                <button
                  onClick={() => window.location.hash = '#/search'}
                  className="px-6 py-3 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-bold transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">add</span>
                  Schedule a Pickup
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBookings.map((booking) => {
                  const issueDate = booking.completedAt || booking.updatedAt || booking.scheduledDate;
                  const expiryDate = getExpiryDate(issueDate);
                  const agencyName = typeof booking.agencyId === 'object' ? booking.agencyId.name : 'Agency';
                  const totalWeight = getTotalWeight(booking);
                  const wasteTypes = getWasteTypes(booking);
                  
                  return (
                    <div
                      key={booking._id}
                      className="bg-gradient-to-br from-[#151F26] to-[#0B1116] rounded-2xl p-6 border border-white/5 hover:border-[#10b981]/30 transition-all shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_25px_-5px_rgba(16,185,129,0.1)] relative overflow-hidden group cursor-pointer"
                      onClick={() => window.location.hash = `#/certificate?booking=${booking._id}`}
                    >
                      {/* Certificate Badge */}
                      <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30">
                        {isExpired(issueDate) ? 'Expired' : 'Active'}
                      </div>

                      {/* Agency Info */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="size-12 rounded-lg bg-[#10b981]/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[#10b981]">recycling</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-400">Certified by</p>
                          <h3 className="font-semibold text-white">{agencyName}</h3>
                        </div>
                      </div>

                      {/* Certificate Details */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Certificate No.</span>
                          <span className="text-sm font-medium text-white">
                            {booking.bookingId || `#${booking._id.slice(-6).toUpperCase()}`}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Waste Items</span>
                          <span className="text-sm font-medium text-white truncate ml-2" title={wasteTypes}>
                            {wasteTypes.length > 20 ? wasteTypes.substring(0, 20) + '...' : wasteTypes}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Total Weight</span>
                          <span className="text-sm font-medium text-white">{totalWeight.toFixed(1)} kg</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">EcoPoints</span>
                          <span className="text-sm font-bold text-[#10b981]">+{booking.ecoPointsEarned || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Issue Date</span>
                          <span className="text-sm font-medium text-white">{formatDate(issueDate)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Expiry Date</span>
                          <span className={isExpired(issueDate) ? 'text-sm font-medium text-red-400' : 'text-sm font-medium text-white'}>
                            {formatDate(expiryDate.toISOString())}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.hash = `#/certificate?booking=${booking._id}`;
                          }}
                          className="flex-1 px-4 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                          View
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.hash = `#/certificate?booking=${booking._id}`;
                          }}
                          className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-medium text-sm flex items-center justify-center gap-2 transition-colors border border-white/5"
                        >
                          <span className="material-symbols-outlined text-[18px]">download</span>
                        </button>
                      </div>

                      {/* Decorative Elements */}
                      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#10b981]/5 rounded-full blur-2xl group-hover:bg-[#10b981]/10 transition-all"></div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default UserCertificates;
