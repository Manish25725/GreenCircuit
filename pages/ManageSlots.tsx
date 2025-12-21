import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { api, Slot, getCurrentUser, User } from '../services/api';

const ManageSlots = () => {
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [view, setView] = useState('Month');
  
  // State for API data
  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [indicators, setIndicators] = useState<Record<number, { hasAvailable: boolean; hasBooked: boolean }>>({});
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newSlot, setNewSlot] = useState({ startTime: '09:00', endTime: '11:00', capacity: 5 });
  const [editingSlot, setEditingSlot] = useState<Slot | null>(null);
  const [editSlotData, setEditSlotData] = useState({ startTime: '09:00', endTime: '11:00', capacity: 5 });
  const [addingSlot, setAddingSlot] = useState(false);
  const [updatingSlot, setUpdatingSlot] = useState(false);
  const [deletingSlot, setDeletingSlot] = useState<number | null>(null);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  
  // Calculate days in month
  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();
  
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Fetch data on mount and date change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [slotsData, indicatorsData] = await Promise.all([
          api.getSlots(selectedDate),
          api.getSlotIndicators()
        ]);
        setSlots(slotsData);
        setIndicators(indicatorsData as any);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedDate, currentMonth]);

  const handleEditSlot = (slot: Slot) => {
    setEditingSlot(slot);
    setEditSlotData({
      startTime: slot.startTime,
      endTime: slot.endTime,
      capacity: slot.capacity || 5
    });
    setShowEditModal(true);
  };

  const handleUpdateSlot = async () => {
    if (!editingSlot) return;
    
    setUpdatingSlot(true);
    try {
      console.log('Updating slot with data:', {
        id: editingSlot.id,
        ...editSlotData
      });
      
      await api.updateSlot(String(editingSlot.id), editSlotData);
      
      console.log('Slot updated successfully');
      
      // Close modal and reset form
      setShowEditModal(false);
      setEditingSlot(null);
      setEditSlotData({ startTime: '09:00', endTime: '11:00', capacity: 5 });
      
      // Refresh slots
      const slotsData = await api.getSlots(selectedDate);
      setSlots(slotsData);
      
      alert('Slot updated successfully!');
    } catch (error: any) {
      console.error('Failed to update slot:', error);
      console.error('Error details:', error.response || error.message);
      alert(`Failed to update slot: ${error.response?.data?.message || error.message || 'Unknown error'}`);
    } finally {
      setUpdatingSlot(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingSlot(id);
    try {
      await api.deleteSlot(String(id));
      setSlots(prev => prev.filter(s => s.id !== id));
      
      // Refresh indicators after deletion
      const indicatorsData = await api.getSlotIndicators();
      setIndicators(indicatorsData as any);
    } catch (error: any) {
      console.error('Failed to delete slot:', error);
      alert(error.response?.data?.message || 'Failed to delete slot');
    } finally {
      setDeletingSlot(null);
    }
  };

  const handleAddSlot = async () => {
    setAddingSlot(true);
    try {
      console.log('Adding slot with data:', {
        date: selectedDate,
        startTime: newSlot.startTime,
        endTime: newSlot.endTime,
        capacity: newSlot.capacity,
        status: 'Available'
      });
      
      // Create slot with proper data structure
      const result = await api.addSlot({
        date: selectedDate,
        startTime: newSlot.startTime,
        endTime: newSlot.endTime,
        capacity: newSlot.capacity,
        status: 'Available'
      });
      
      console.log('Slot added successfully:', result);
      
      // Close modal and reset form
      setShowAddModal(false);
      setNewSlot({ startTime: '09:00', endTime: '11:00', capacity: 5 });
      
      // Refresh slots and indicators
      const [slotsData, indicatorsData] = await Promise.all([
        api.getSlots(selectedDate),
        api.getSlotIndicators()
      ]);
      setSlots(slotsData);
      setIndicators(indicatorsData as any);
      
      alert('Slot added successfully!');
    } catch (error: any) {
      console.error('Failed to add slot:', error);
      console.error('Error details:', error.response || error.message);
      alert(`Failed to add slot: ${error.response?.data?.message || error.message || 'Unknown error'}`);
    } finally {
      setAddingSlot(false);
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleLogout = () => {
    api.logout();
    window.location.hash = '#/login';
  };

  const formatSelectedDate = () => {
    return `${monthNames[currentMonth].slice(0, 3)} ${selectedDate}, ${currentYear}`;
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
                  className="p-2.5 rounded-full bg-[#151F26] border border-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
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
                      <p className="text-[#f59e0b] text-sm font-bold uppercase tracking-widest mb-2">Slot Management</p>
                      <h1 className="text-white text-4xl sm:text-5xl font-black leading-tight tracking-tighter mb-2">Manage Slots</h1>
                      <p className="text-[#94a3b8] text-lg">Select a date to view and manage pickup time slots.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center justify-center h-12 px-6 text-base font-bold leading-normal transition-all bg-[#f59e0b] text-white rounded-xl hover:bg-[#d97706] hover:scale-105 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                  >
                    <span className="material-symbols-outlined mr-2">add</span>
                    <span className="truncate">Add New Slot</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Calendar Area */}
                  <div className="lg:col-span-8 flex flex-col gap-6">
                    {/* View Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex h-10 items-center justify-center rounded-xl bg-[#151F26] border border-white/5 p-1">
                        {['Month', 'Week', 'Day'].map((v) => (
                          <label key={v} className={`flex cursor-pointer h-full items-center justify-center overflow-hidden rounded-lg px-4 text-sm font-medium leading-normal transition-all ${view === v ? 'bg-[#f59e0b] text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>
                            <span className="truncate">{v}</span>
                            <input 
                              type="radio" 
                              name="view-toggle" 
                              value={v} 
                              checked={view === v} 
                              onChange={() => setView(v)} 
                              className="invisible w-0 absolute"
                            />
                          </label>
                        ))}
                      </div>
                      <button 
                        onClick={() => {
                          const today = new Date();
                          setSelectedDate(today.getDate());
                          setCurrentMonth(today.getMonth());
                          setCurrentYear(today.getFullYear());
                        }}
                        className="flex items-center justify-center h-10 px-4 text-sm font-medium leading-normal transition-colors bg-[#8b5cf6] text-white rounded-xl hover:bg-[#7c3aed]"
                      >
                        <span className="material-symbols-outlined mr-2 text-lg">today</span>
                        <span className="truncate">Today's Slots</span>
                      </button>
                    </div>

                    {/* Calendar Grid */}
                    <div className="bg-[#151F26] rounded-2xl p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] border border-white/5">
                      {/* Calendar Nav */}
                      <div className="flex items-center justify-between mb-6">
                        <button 
                          onClick={handlePrevMonth}
                          className="flex items-center justify-center text-slate-300 size-10 rounded-full hover:bg-white/5 hover:text-[#f59e0b] transition-colors"
                        >
                          <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        <p className="text-white text-xl font-bold leading-tight">{monthNames[currentMonth]} {currentYear}</p>
                        <button 
                          onClick={handleNextMonth}
                          className="flex items-center justify-center text-slate-300 size-10 rounded-full hover:bg-white/5 hover:text-[#f59e0b] transition-colors"
                        >
                          <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                      </div>

                      {/* Days Header */}
                      <div className="grid grid-cols-7 gap-2 mb-2">
                        {weekDays.map(d => (
                          <p key={d} className="flex items-center justify-center h-10 text-xs font-bold tracking-wider text-slate-500">{d}</p>
                        ))}
                      </div>

                      {/* Date Cells */}
                      <div className="grid grid-cols-7 gap-2">
                        {/* Empty cells for first day offset */}
                        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                          <div key={`empty-${i}`} className="h-16"></div>
                        ))}
                        
                        {days.map((day) => {
                          const selected = selectedDate === day;
                          const isToday = day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();
                          const indicator = indicators[day];
                          
                          return (
                            <button 
                              key={day}
                              onClick={() => setSelectedDate(day)}
                              className={`relative flex flex-col justify-start items-center h-16 text-sm font-medium leading-normal rounded-xl p-2 transition-all duration-200
                                ${selected 
                                  ? 'bg-[#f59e0b]/20 text-white border-2 border-[#f59e0b] shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                                  : isToday
                                    ? 'bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 text-white'
                                    : 'bg-[#0B1116] border border-white/5 text-slate-300 hover:bg-white/5 hover:border-white/10'
                                }
                              `}
                            >
                              <span className={`font-bold ${selected ? 'text-[#f59e0b]' : isToday ? 'text-[#8b5cf6]' : ''}`}>{day}</span>
                              {/* Indicators */}
                              <div className="flex gap-1 mt-1">
                                {indicator?.hasAvailable && (
                                  <div className="w-1.5 h-1.5 bg-[#f59e0b] rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]" title="Slots Available"></div>
                                )}
                                {indicator?.hasBooked && (
                                  <div className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full shadow-[0_0_8px_rgba(139,92,246,0.5)]" title="Has Bookings"></div>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Legend */}
                      <div className="flex flex-wrap items-center gap-6 mt-6 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-[#f59e0b] rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                          <span className="text-xs text-slate-400">Available Slots</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-[#8b5cf6] rounded-full shadow-[0_0_8px_rgba(139,92,246,0.5)]"></div>
                          <span className="text-xs text-slate-400">Has Bookings</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full border-2 border-[#8b5cf6]"></div>
                          <span className="text-xs text-slate-400">Today</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Schedule Panel */}
                  <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-[#151F26] rounded-2xl p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] border border-white/5 lg:sticky lg:top-28">
                      <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
                        <h2 className="text-white text-xl font-bold leading-tight">
                          Schedule for {formatSelectedDate()}
                        </h2>
                        <span className="px-2 py-1 rounded-lg bg-[#f59e0b]/10 text-[#f59e0b] text-xs font-bold">
                          {slots.length} slots
                        </span>
                      </div>
                      
                      <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto">
                        {loading ? (
                          <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-500">
                            <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#f59e0b] border-t-transparent"></div>
                            <p>Loading slots...</p>
                          </div>
                        ) : slots.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-500 border-2 border-dashed border-white/10 rounded-xl">
                            <span className="material-symbols-outlined text-4xl opacity-50">event_busy</span>
                            <p className="text-center">No slots configured for this date.</p>
                            <button 
                              onClick={() => setShowAddModal(true)}
                              className="mt-2 px-4 py-2 bg-[#f59e0b] text-white rounded-lg text-sm font-bold hover:bg-[#d97706] transition-colors"
                            >
                              Add Slot
                            </button>
                          </div>
                        ) : (
                          slots.map(slot => (
                            <div 
                              key={slot.id} 
                              className={`flex items-center justify-between p-4 rounded-xl border transition-all group
                                ${slot.status === 'Available' ? 'bg-[#f59e0b]/5 border-[#f59e0b]/20 hover:border-[#f59e0b]/40' : ''}
                                ${slot.status === 'Booked' ? 'bg-[#8b5cf6]/5 border-[#8b5cf6]/20 hover:border-[#8b5cf6]/40' : ''}
                                ${slot.status === 'Unavailable' ? 'bg-[#0B1120]/50 border-white/5' : ''}
                              `}
                            >
                              <div className="flex items-center gap-4">
                                <div className={`w-1 h-12 rounded-full
                                  ${slot.status === 'Available' ? 'bg-[#f59e0b]' : ''}
                                  ${slot.status === 'Booked' ? 'bg-[#8b5cf6]' : ''}
                                  ${slot.status === 'Unavailable' ? 'bg-slate-700' : ''}
                                `}></div>
                                <div className="flex flex-col">
                                  <p className="text-base font-bold text-white">{slot.startTime} - {slot.endTime}</p>
                                  <p className={`text-sm font-medium
                                    ${slot.status === 'Available' ? 'text-[#f59e0b]' : ''}
                                    ${slot.status === 'Booked' ? 'text-[#8b5cf6]' : ''}
                                    ${slot.status === 'Unavailable' ? 'text-slate-500' : ''}
                                  `}>
                                    {slot.status === 'Booked' ? `Booked - ${slot.bookedBy}` : slot.status}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {slot.status === 'Booked' ? (
                                  <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                                    <span className="material-symbols-outlined text-xl">visibility</span>
                                  </button>
                                ) : (
                                  <>
                                    <button 
                                      onClick={() => handleEditSlot(slot)}
                                      className="p-2 rounded-lg text-slate-400 hover:text-[#f59e0b] hover:bg-[#f59e0b]/10 transition-colors"
                                    >
                                      <span className="material-symbols-outlined text-xl">edit</span>
                                    </button>
                                    <button 
                                      onClick={() => handleDelete(slot.id)}
                                      disabled={deletingSlot === slot.id}
                                      className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                                    >
                                      {deletingSlot === slot.id ? (
                                        <div className="w-5 h-5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin"></div>
                                      ) : (
                                        <span className="material-symbols-outlined text-xl">delete</span>
                                      )}
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-[#151F26] rounded-2xl p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] border border-white/5">
                      <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-gray-400">bolt</span>
                        Quick Actions
                      </h3>
                      <div className="flex flex-col gap-3">
                        <button 
                          onClick={() => window.location.hash = '#/agency'}
                          className="flex w-full group cursor-pointer items-center justify-between overflow-hidden rounded-xl h-12 px-4 bg-white/5 text-gray-200 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="size-7 rounded-lg bg-[#f59e0b]/20 text-[#f59e0b] flex items-center justify-center">
                              <span className="material-symbols-outlined text-lg">dashboard</span>
                            </div>
                            <span className="font-medium text-sm">Back to Dashboard</span>
                          </div>
                          <span className="material-symbols-outlined text-gray-500 group-hover:text-white transition-colors text-lg">chevron_right</span>
                        </button>
                        <button 
                          onClick={() => window.location.hash = '#/agency/bookings'}
                          className="flex w-full group cursor-pointer items-center justify-between overflow-hidden rounded-xl h-12 px-4 bg-white/5 text-gray-200 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="size-7 rounded-lg bg-[#8b5cf6]/20 text-[#8b5cf6] flex items-center justify-center">
                              <span className="material-symbols-outlined text-lg">book_online</span>
                            </div>
                            <span className="font-medium text-sm">View Bookings</span>
                          </div>
                          <span className="material-symbols-outlined text-gray-500 group-hover:text-white transition-colors text-lg">chevron_right</span>
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

      {/* Add Slot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => !addingSlot && setShowAddModal(false)}
          ></div>
          
          <div className="relative bg-[#151F26] rounded-2xl p-6 sm:p-8 max-w-md w-full border border-white/10 shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#f59e0b]/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-[#f59e0b]">schedule</span>
            </div>
            
            <h3 className="text-2xl font-bold text-white text-center mb-2">Add New Slot</h3>
            <p className="text-gray-400 text-center mb-6">
              Create a pickup slot for {formatSelectedDate()}
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-400">Start Time</label>
                  <input 
                    type="time" 
                    value={newSlot.startTime}
                    onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                    className="w-full bg-[#0B1116] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#f59e0b] focus:border-[#f59e0b] outline-none transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-400">End Time</label>
                  <input 
                    type="time" 
                    value={newSlot.endTime}
                    onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                    className="w-full bg-[#0B1116] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#f59e0b] focus:border-[#f59e0b] outline-none transition-all"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-400">Capacity (pickups per slot)</label>
                <input 
                  type="number" 
                  min="1"
                  max="20"
                  value={newSlot.capacity}
                  onChange={(e) => setNewSlot({ ...newSlot, capacity: parseInt(e.target.value) || 1 })}
                  className="w-full bg-[#0B1116] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#f59e0b] focus:border-[#f59e0b] outline-none transition-all"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                disabled={addingSlot}
                className="flex-1 py-3 px-6 rounded-xl bg-white/5 text-white font-medium border border-white/10 hover:bg-white/10 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSlot}
                disabled={addingSlot}
                className="flex-1 py-3 px-6 rounded-xl bg-[#f59e0b] text-white font-bold hover:bg-[#d97706] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {addingSlot ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">add</span>
                    Add Slot
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Slot Modal */}
      {showEditModal && editingSlot && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => !updatingSlot && setShowEditModal(false)}
          ></div>
          
          <div className="relative bg-[#151F26] rounded-2xl p-6 sm:p-8 max-w-md w-full border border-white/10 shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#f59e0b]/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-[#f59e0b]">edit_calendar</span>
            </div>
            
            <h3 className="text-2xl font-bold text-white text-center mb-2">Edit Slot</h3>
            <p className="text-gray-400 text-center mb-6">
              Modify the pickup slot for {formatSelectedDate()}
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-400">Start Time</label>
                  <input 
                    type="time" 
                    value={editSlotData.startTime}
                    onChange={(e) => setEditSlotData({ ...editSlotData, startTime: e.target.value })}
                    className="w-full bg-[#0B1116] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#f59e0b] focus:border-[#f59e0b] outline-none transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-400">End Time</label>
                  <input 
                    type="time" 
                    value={editSlotData.endTime}
                    onChange={(e) => setEditSlotData({ ...editSlotData, endTime: e.target.value })}
                    className="w-full bg-[#0B1116] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#f59e0b] focus:border-[#f59e0b] outline-none transition-all"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-400">Capacity (pickups per slot)</label>
                <input 
                  type="number" 
                  min="1"
                  max="20"
                  value={editSlotData.capacity}
                  onChange={(e) => setEditSlotData({ ...editSlotData, capacity: parseInt(e.target.value) || 1 })}
                  className="w-full bg-[#0B1116] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#f59e0b] focus:border-[#f59e0b] outline-none transition-all"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingSlot(null);
                }}
                disabled={updatingSlot}
                className="flex-1 py-3 px-6 rounded-xl bg-white/5 text-white font-medium border border-white/10 hover:bg-white/10 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSlot}
                disabled={updatingSlot}
                className="flex-1 py-3 px-6 rounded-xl bg-[#f59e0b] text-white font-bold hover:bg-[#d97706] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {updatingSlot ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">save</span>
                    Update Slot
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

export default ManageSlots;
