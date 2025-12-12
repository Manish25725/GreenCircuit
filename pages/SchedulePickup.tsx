import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { api, getCurrentUser } from '../services/api';

interface Item {
  id: string;
  type: string;
  quantity: number;
  description: string;
}

interface Slot {
  _id: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

const SchedulePickup = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState({ type: '', quantity: 1, description: '' });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [agencyId, setAgencyId] = useState<string>('');
  const [agencyName, setAgencyName] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const user = getCurrentUser();

  useEffect(() => {
    // Get agency ID from URL params
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.split('?')[1] || '');
    const agency = params.get('agency');
    const name = params.get('name');
    
    if (agency) {
      setAgencyId(agency);
      setAgencyName(name || 'Selected Agency');
    } else {
      // Fallback to localStorage
      const storedAgency = localStorage.getItem('selectedAgency');
      if (storedAgency) {
        try {
          const agencyData = JSON.parse(storedAgency);
          setAgencyId(agencyData._id);
          setAgencyName(agencyData.name || 'Selected Agency');
        } catch (e) {
          console.error('Failed to parse stored agency');
        }
      }
    }
  }, []);

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
      setNewItem({ type: '', quantity: 1, description: '' });
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

    try {
      setSubmitting(true);
      const bookingData = {
        agencyId,
        slotId: selectedSlot._id,
        date: selectedDate.toISOString(),
        items: items.map(item => ({
          type: item.type,
          quantity: item.quantity,
          description: item.description
        })),
        address: user?.address || '',
        notes: ''
      };

      const response = await api.createBooking(bookingData);
      if (response.data) {
        // Navigate to confirmation page with booking ID
        window.location.hash = `#/pickup-confirmation?booking=${response.data._id}`;
      }
    } catch (error) {
      console.error('Failed to create booking:', error);
      alert('Failed to create booking. Please try again.');
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
    <Layout title="" role="User" fullWidth hideSidebar>
      <div className="bg-[#0B1116] font-sans text-gray-200 min-h-screen flex flex-col relative overflow-x-hidden selection:bg-[#10b981] selection:text-white">
        
        {/* Background Ambient Blobs */}
        <div className="fixed top-0 left-0 w-full h-[500px] bg-[#10b981]/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
        <div className="fixed bottom-0 right-0 w-full h-[500px] bg-[#3b82f6]/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none"></div>

        {/* Standard User Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 transition-all duration-300">
            <div className="flex items-center gap-3 text-white cursor-pointer" onClick={() => window.location.hash = '#/'}>
                <div className="p-2 bg-[#10b981]/10 rounded-lg">
                    <svg className="h-6 w-6 text-[#10b981]" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"></path>
                    </svg>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white">EcoCycle</h2>
            </div>
            <nav className="hidden md:flex flex-1 justify-center gap-1">
                <a className="text-sm font-medium px-5 py-2.5 rounded-full text-[#94a3b8] hover:text-white hover:bg-white/5 transition-all cursor-pointer" onClick={() => window.location.hash = '#/dashboard'}>Dashboard</a>
                <a className="text-sm font-semibold px-5 py-2.5 rounded-full text-white bg-white/10 shadow-inner border border-white/5 cursor-pointer" onClick={() => window.location.hash = '#/search'}>New Request</a>
                <a className="text-sm font-medium px-5 py-2.5 rounded-full text-[#94a3b8] hover:text-white hover:bg-white/5 transition-all cursor-pointer" onClick={() => window.location.hash = '#/rewards'}>Rewards</a>
                <a className="text-sm font-medium px-5 py-2.5 rounded-full text-[#94a3b8] hover:text-white hover:bg-white/5 transition-all cursor-pointer" onClick={() => window.location.hash = '#/certificate'}>Certificate</a>
            </nav>
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => window.location.hash = '#/profile'}
                    className="hidden sm:flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-[#151F26] border border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"
                >
                    <div className="size-8 rounded-full bg-cover bg-center ring-2 ring-white/10 group-hover:ring-[#10b981]/50 transition-all" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAreboopkKSy4YYDs4PFvd-l4xnboU1-dCb6q7kuogZsIpVK9icd7CNdE17iE4uQKdoqiJuI30CTaWxw7GK3QrR7H_FstEqPZBbUqkey_74QXoP8uhTfR9RY780_K4O8UAQpRMWJiKbRdh5-SdE7JAIX5lG3yPPg3Wisf3RGrXHACYJxJFU0vYynDCqaru_FI7DW3EV-buSFuzGK8Z7LP7p7c25u8kqkBUXlt5pQG5d-4WVmAzmNX9U0trABs1cC--zDVlgdRcgww")' }}></div>
                    <span className="text-sm font-medium text-gray-200">Alex Morgan</span>
                </button>
                <button className="relative p-2.5 rounded-full bg-[#151F26] border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                    <span className="absolute top-2.5 right-3 size-2 bg-red-500 rounded-full border-2 border-[#151F26]"></span>
                    <span className="material-symbols-outlined text-[20px]">notifications</span>
                </button>
            </div>
        </header>

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 mt-20 relative z-10">
          <div className="flex flex-col gap-8">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 items-center text-sm">
                <a className="text-[#94a3b8] font-medium hover:text-white cursor-pointer transition-colors" onClick={() => window.location.hash = '#/search'}>Agency Selection</a>
                <span className="text-[#94a3b8] font-medium">/</span>
                <span className="text-white font-medium">Schedule Pickup</span>
                <span className="text-[#94a3b8] font-medium">/</span>
                <span className="text-[#94a3b8] font-medium">Confirmation</span>
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
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#151F26] text-[#10b981] shadow-inner border border-white/5">
                                <span className="material-symbols-outlined">
                                    {item.type.includes('Appliance') ? 'kitchen' : 
                                     item.type.includes('Electronics') ? 'laptop_mac' : 
                                     item.type.includes('Batteries') ? 'battery_full' : 'devices'}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0 py-1">
                                <div className="flex justify-between items-start mb-1">
                                    <p className="text-sm font-bold text-white truncate">{item.type}</p>
                                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20">Qty: {item.quantity}</span>
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
                      <span className="material-symbols-outlined text-[#10b981] text-xl">add_circle</span>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">Add New Item</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      <div className="space-y-2 md:col-span-8">
                        <label className="text-sm font-medium text-gray-300" htmlFor="material-type">Type of Material</label>
                        <div className="relative group">
                          <select 
                            value={newItem.type}
                            onChange={(e) => setNewItem({...newItem, type: e.target.value})}
                            className="w-full h-11 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] transition-all appearance-none cursor-pointer placeholder-gray-500" 
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
                      <div className="space-y-2 md:col-span-4">
                        <label className="text-sm font-medium text-gray-300" htmlFor="item-count">Quantity</label>
                        <div className="relative">
                          <input 
                            value={newItem.quantity}
                            onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 0})}
                            className="w-full h-11 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] transition-all" 
                            id="item-count" 
                            min="1" 
                            placeholder="1" 
                            type="number"
                          />
                        </div>
                      </div>
                      <div className="space-y-2 md:col-span-12">
                        <label className="text-sm font-medium text-gray-300" htmlFor="item-details">Item Details / Description</label>
                        <textarea 
                            value={newItem.description}
                            onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                            className="w-full px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] resize-none transition-all placeholder:text-gray-600" 
                            id="item-details" 
                            placeholder="Please describe the condition and specifics (e.g., 'Broken screen on laptop', 'Old CRT Monitor')" 
                            rows={2}
                        ></textarea>
                      </div>
                      <div className="md:col-span-12 flex justify-end">
                        <button 
                            onClick={handleAddItem}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0B1116] border border-[#10b981] text-[#10b981] hover:bg-[#10b981] hover:text-[#0B1116] transition-all duration-200 font-bold text-sm shadow-lg shadow-[#10b981]/10 cursor-pointer"
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
                                    ? 'bg-[#10b981] text-[#0B1116] font-bold shadow-lg shadow-[#10b981]/20' 
                                    : isPast
                                    ? 'text-gray-600 cursor-not-allowed'
                                    : 'text-gray-300 hover:bg-white/5 hover:text-white cursor-pointer'
                                }
                            `}
                          >
                            <div className="flex size-full items-center justify-center">{day}</div>
                            {isToday && !isSelected && (
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 size-1.5 rounded-full bg-[#10b981]"></div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-4 flex items-center justify-center gap-6 pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
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
                                            ? 'bg-[#10b981]/20 border-[#10b981] text-[#10b981]' 
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
                        className={`w-full flex min-w-[84px] items-center justify-center overflow-hidden rounded-xl h-14 px-8 text-[#0B1116] text-base font-bold leading-normal tracking-[0.015em] transition-all
                            ${selectedSlot && items.length > 0 && !submitting
                                ? 'bg-[#10b981] hover:bg-[#059669] cursor-pointer shadow-lg shadow-[#10b981]/30 transform hover:-translate-y-1' 
                                : 'bg-[#10b981]/50 opacity-50 cursor-not-allowed'
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
    </Layout>
  );
};

export default SchedulePickup;