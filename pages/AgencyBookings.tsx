import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
import { api, getCurrentUser, User } from '../services/api';

interface Booking {
  id: number;
  userName: string;
  userEmail: string;
  date: string;
  timeSlot: string;
  wasteType: string;
  status: string;
  address?: string;
}

const AgencyBookings = () => {
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [actionModal, setActionModal] = useState<{ type: string; booking: Booking } | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.getAgencyBookings() as any;
        const bookingsData = response.data || response || [];
        // Ensure bookingsData is an array
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
        setBookings([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (bookingId: number, newStatus: string) => {
    setProcessing(true);
    try {
      await api.updateBookingStatus(String(bookingId), newStatus);
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status: newStatus } : b
      ));
      setActionModal(null);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setProcessing(false);
    }
  };

  const filteredBookings = Array.isArray(bookings) ? bookings.filter(booking => {
    const matchesFilter = activeFilter === 'all' || 
      (activeFilter === 'upcoming' && booking.status === 'confirmed') ||
      (activeFilter === 'in-progress' && booking.status === 'in-progress') ||
      (activeFilter === 'completed' && booking.status === 'completed') ||
      (activeFilter === 'cancelled' && booking.status === 'cancelled');
    
    const matchesSearch = searchQuery === '' || 
      booking.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toString().includes(searchQuery);
    
    return matchesFilter && matchesSearch;
  }) : [];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; text: string; border: string }> = {
      'pending': { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20' },
      'confirmed': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
      'in-progress': { bg: 'bg-[#f59e0b]/10', text: 'text-[#f59e0b]', border: 'border-[#f59e0b]/20' },
      'completed': { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
      'cancelled': { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' }
    };
    return styles[status] || styles['pending'];
  };

  const getNextAction = (status: string) => {
    switch (status) {
      case 'pending': return { label: 'Confirm', nextStatus: 'confirmed', icon: 'check_circle' };
      case 'confirmed': return { label: 'Start Pickup', nextStatus: 'in-progress', icon: 'local_shipping' };
      case 'in-progress': return { label: 'Complete', nextStatus: 'completed', icon: 'task_alt' };
      default: return null;
    }
  };

  const stats = {
    total: bookings.length,
    upcoming: bookings.filter(b => b.status === 'confirmed').length,
    inProgress: bookings.filter(b => b.status === 'in-progress').length,
    completed: bookings.filter(b => b.status === 'completed').length
  };

  const handleLogout = () => {
    api.logout();
    window.location.hash = '#/login';
  };

  const handleExportCSV = () => {
    const headers = ['Booking ID', 'Client Name', 'Email', 'Date', 'Time Slot', 'Waste Type', 'Status'];
    const csvData = filteredBookings.map(b => [
      b.id,
      b.userName || 'N/A',
      b.userEmail || 'N/A',
      b.date,
      b.timeSlot,
      b.wasteType || 'E-Waste',
      b.status
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bookings_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                  className="p-2.5 rounded-full bg-[#151F26] border border-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Logout"
                >
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                </button>
              </div>
            </header>

            <main className="flex flex-1 justify-center py-5 mt-24">
              <div className="layout-content-container flex flex-col w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 py-8">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => window.location.hash = '#/agency'}
                      className="p-2 rounded-lg border transition-colors bg-[#f59e0b]/10 border-[#f59e0b]/20 text-[#f59e0b] hover:bg-[#f59e0b]/20"
                      title="Back to Dashboard"
                    >
                      <span className="material-symbols-outlined text-xl">arrow_back</span>
                    </button>
                    <div>
                      <p className="text-[#f59e0b] text-sm font-bold uppercase tracking-widest mb-2">Booking Management</p>
                      <h1 className="text-white text-4xl sm:text-5xl font-black leading-tight tracking-tighter mb-2">View Bookings</h1>
                      <p className="text-[#94a3b8] text-lg">Manage and track all your pickup bookings.</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleExportCSV}
                    disabled={filteredBookings.length === 0}
                    className="flex items-center justify-center h-12 px-6 text-base font-bold leading-normal transition-all bg-white/5 text-gray-200 rounded-xl hover:bg-white/5 border border-white/5 hover:border-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined mr-2">download</span>
                    <span className="truncate">Export CSV</span>
                  </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="bg-[#151F26] rounded-2xl p-5 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] border border-white/5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="size-10 rounded-xl bg-[#f59e0b]/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#f59e0b]">calendar_today</span>
                      </div>
                    </div>
                    <p className="text-3xl font-black text-white">{stats.total}</p>
                    <p className="text-sm text-slate-400">Total Bookings</p>
                  </div>
                  <div className="bg-[#151F26] rounded-2xl p-5 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] border border-white/5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-blue-400">schedule</span>
                      </div>
                    </div>
                    <p className="text-3xl font-black text-white">{stats.upcoming}</p>
                    <p className="text-sm text-slate-400">Upcoming</p>
                  </div>
                  <div className="bg-[#151F26] rounded-2xl p-5 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] border border-white/5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="size-10 rounded-xl bg-[#f59e0b]/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#f59e0b]">local_shipping</span>
                      </div>
                    </div>
                    <p className="text-3xl font-black text-white">{stats.inProgress}</p>
                    <p className="text-sm text-slate-400">In Progress</p>
                  </div>
                  <div className="bg-[#151F26] rounded-2xl p-5 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] border border-white/5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="size-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-green-400">check_circle</span>
                      </div>
                    </div>
                    <p className="text-3xl font-black text-white">{stats.completed}</p>
                    <p className="text-sm text-slate-400">Completed</p>
                  </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-[#151F26] rounded-2xl p-4 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] border border-white/5 mb-6">
                  <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    <div className="flex h-10 items-center justify-center rounded-xl bg-[#0B1116] border border-white/5 p-1 overflow-x-auto">
                      {[
                        { key: 'all', label: 'All Bookings' },
                        { key: 'upcoming', label: 'Upcoming' },
                        { key: 'in-progress', label: 'In Progress' },
                        { key: 'completed', label: 'Completed' },
                        { key: 'cancelled', label: 'Cancelled' }
                      ].map(filter => (
                        <label 
                          key={filter.key} 
                          className={`flex cursor-pointer h-full items-center justify-center overflow-hidden rounded-lg px-4 text-sm font-medium leading-normal transition-all whitespace-nowrap ${
                            activeFilter === filter.key 
                              ? 'bg-[#f59e0b] text-white shadow-sm' 
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <span className="truncate">{filter.label}</span>
                          <input 
                            type="radio" 
                            name="filter-toggle" 
                            value={filter.key} 
                            checked={activeFilter === filter.key} 
                            onChange={() => setActiveFilter(filter.key)} 
                            className="invisible w-0 absolute"
                          />
                        </label>
                      ))}
                    </div>
                    <div className="relative w-full lg:w-64">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">search</span>
                      <input
                        type="text"
                        placeholder="Search by name or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#0B1116] border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-[#f59e0b]/50 focus:ring-1 focus:ring-[#f59e0b]/50 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Bookings Table */}
                <div className="bg-[#151F26] rounded-2xl shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] border border-white/5 overflow-hidden">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-500">
                      <Loader size="md" color="#f59e0b" />
                      <p>Loading bookings...</p>
                    </div>
                  ) : filteredBookings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-500 border-2 border-dashed border-white/5 rounded-xl m-4">
                      <span className="material-symbols-outlined text-4xl opacity-50">inbox</span>
                      <p className="text-center">No bookings found.</p>
                      <p className="text-sm text-slate-600">Try adjusting your filters or search query</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-[#0B1116]/50 border-b border-white/5 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                            <th className="px-6 py-4">Booking ID</th>
                            <th className="px-6 py-4">Client</th>
                            <th className="px-6 py-4">Date & Time</th>
                            <th className="px-6 py-4">Waste Type</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                          {filteredBookings.map((booking) => {
                            const nextAction = getNextAction(booking.status);
                            const statusStyle = getStatusBadge(booking.status);
                            return (
                              <tr key={booking.id} className="group hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-4 font-bold text-white">#{booking.id}</td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="size-9 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] flex items-center justify-center font-bold text-xs border border-[#f59e0b]/20">
                                      {booking.userName?.substring(0, 2).toUpperCase() || 'NA'}
                                    </div>
                                    <div>
                                      <p className="text-white font-medium">{booking.userName || 'N/A'}</p>
                                      <p className="text-slate-500 text-xs">{booking.userEmail || 'N/A'}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-slate-400">
                                  <div className="flex flex-col">
                                    <span className="text-white font-medium">{booking.date}</span>
                                    <span className="text-xs">{booking.timeSlot}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-slate-400">{booking.wasteType || 'E-Waste'}</td>
                                <td className="px-6 py-4">
                                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).replace('-', ' ')}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    {nextAction && (
                                      <button
                                        onClick={() => setActionModal({ type: nextAction.nextStatus, booking })}
                                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#f59e0b] text-white hover:bg-[#d97706] cursor-pointer transition-colors shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                                      >
                                        {nextAction.label}
                                      </button>
                                    )}
                                    <button
                                      onClick={() => setSelectedBooking(booking)}
                                      className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer transition-colors"
                                      title="View Details"
                                    >
                                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            </main>
          </div>
        </div>

        {/* Action Confirmation Modal */}
        {actionModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-[#151F26] border border-white/5 rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="size-12 rounded-xl bg-[#f59e0b]/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#f59e0b] text-2xl">
                    {actionModal.type === 'confirmed' ? 'check_circle' : 
                     actionModal.type === 'in-progress' ? 'local_shipping' : 'task_alt'}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Confirm Action</h3>
                  <p className="text-sm text-slate-400">Booking #{actionModal.booking.id}</p>
                </div>
              </div>
              <p className="text-gray-200 mb-6">
                Are you sure you want to {actionModal.type === 'confirmed' ? 'confirm' : 
                actionModal.type === 'in-progress' ? 'start pickup for' : 'complete'} this booking?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setActionModal(null)}
                  className="flex-1 py-2.5 rounded-xl border border-white/5 text-gray-200 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleStatusUpdate(actionModal.booking.id, actionModal.type)}
                  disabled={processing}
                  className="flex-1 py-2.5 rounded-xl bg-[#f59e0b] text-white font-bold hover:bg-[#d97706] transition-colors cursor-pointer disabled:opacity-50 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                >
                  {processing ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Booking Details Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-[#151F26] border border-white/5 rounded-2xl p-6 max-w-lg w-full shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Booking Details</h3>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-slate-400">close</span>
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-[#0B1116] rounded-xl border border-white/5">
                  <div className="size-12 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] flex items-center justify-center font-bold border border-[#f59e0b]/20">
                    {selectedBooking.userName?.substring(0, 2).toUpperCase() || 'NA'}
                  </div>
                  <div>
                    <p className="text-white font-medium">{selectedBooking.userName || 'N/A'}</p>
                    <p className="text-slate-400 text-sm">{selectedBooking.userEmail || 'N/A'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#0B1116] rounded-xl border border-white/5">
                    <p className="text-xs text-slate-500 mb-1">Booking ID</p>
                    <p className="text-white font-bold">#{selectedBooking.id}</p>
                  </div>
                  <div className="p-4 bg-[#0B1116] rounded-xl border border-white/5">
                    <p className="text-xs text-slate-500 mb-1">Status</p>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(selectedBooking.status).bg} ${getStatusBadge(selectedBooking.status).text} ${getStatusBadge(selectedBooking.status).border}`}>
                      {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                    </span>
                  </div>
                  <div className="p-4 bg-[#0B1116] rounded-xl border border-white/5">
                    <p className="text-xs text-slate-500 mb-1">Date</p>
                    <p className="text-white font-medium">{selectedBooking.date}</p>
                  </div>
                  <div className="p-4 bg-[#0B1116] rounded-xl border border-white/5">
                    <p className="text-xs text-slate-500 mb-1">Time</p>
                    <p className="text-white font-medium">{selectedBooking.timeSlot}</p>
                  </div>
                </div>
                <div className="p-4 bg-[#0B1116] rounded-xl border border-white/5">
                  <p className="text-xs text-slate-500 mb-1">Waste Type</p>
                  <p className="text-white font-medium">{selectedBooking.wasteType || 'E-Waste'}</p>
                </div>
                {selectedBooking.address && (
                  <div className="p-4 bg-[#0B1116] rounded-xl border border-white/5">
                    <p className="text-xs text-slate-500 mb-1">Pickup Address</p>
                    <p className="text-white font-medium">{selectedBooking.address}</p>
                  </div>
                )}
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-full mt-6 py-3 rounded-xl bg-white/5 text-white hover:bg-white/5 transition-colors cursor-pointer border border-white/5"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AgencyBookings;
