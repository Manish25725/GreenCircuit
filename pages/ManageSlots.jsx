import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import Loader from '../components/Loader.jsx';
import { api, getCurrentUser } from '../services/api.js';
import { useNavigate } from 'react-router-dom';
const ManageSlots = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(getCurrentUser());
    const [selectedDate, setSelectedDate] = useState(new Date().getDate());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    // State for API data
    const [loading, setLoading] = useState(true);
    const [slots, setSlots] = useState([]);
    const [indicators, setIndicators] = useState({});
    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newSlot, setNewSlot] = useState({ startTime: '09:00', endTime: '11:00', capacity: 5 });
    const [editingSlot, setEditingSlot] = useState(null);
    const [editSlotData, setEditSlotData] = useState({ startTime: '09:00', endTime: '11:00', capacity: 5 });
    const [addingSlot, setAddingSlot] = useState(false);
    const [updatingSlot, setUpdatingSlot] = useState(false);
    const [deletingSlot, setDeletingSlot] = useState(null);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    // Calculate days in month
    const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();
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
                setSlots(Array.isArray(slotsData) ? slotsData : []);
                setIndicators(indicatorsData || {});
            }
            catch (error) {
                // Clear data on error to prevent showing stale/mock data
                setSlots([]);
                setIndicators({});
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedDate, currentMonth]);
    const handleEditSlot = (slot) => {
        setEditingSlot(slot);
        setEditSlotData({
            startTime: slot.startTime,
            endTime: slot.endTime,
            capacity: slot.capacity || 5
        });
        setShowEditModal(true);
    };
    const handleUpdateSlot = async () => {
        if (!editingSlot)
            return;
        setUpdatingSlot(true);
        try {
            await api.updateSlot(String(editingSlot.id), editSlotData);
            // Close modal and reset form
            setShowEditModal(false);
            setEditingSlot(null);
            setEditSlotData({ startTime: '09:00', endTime: '11:00', capacity: 5 });
            // Refresh slots
            const slotsData = await api.getSlots(selectedDate);
            setSlots(slotsData);
            alert('Slot updated successfully!');
        }
        catch (error) {
            alert(`Failed to update slot: ${error.response?.data?.message || error.message || 'Unknown error'}`);
        }
        finally {
            setUpdatingSlot(false);
        }
    };
    const handleDelete = async (id) => {
        setDeletingSlot(id);
        try {
            await api.deleteSlot(String(id));
            setSlots(prev => prev.filter(s => s.id !== id));
            // Refresh indicators after deletion
            const indicatorsData = await api.getSlotIndicators();
            setIndicators(indicatorsData);
        }
        catch (error) {
            alert(error.response?.data?.message || 'Failed to delete slot');
        }
        finally {
            setDeletingSlot(null);
        }
    };
    const handleAddSlot = async () => {
        setAddingSlot(true);
        try {
            // Create slot with proper data structure
            const result = await api.addSlot({
                date: selectedDate,
                startTime: newSlot.startTime,
                endTime: newSlot.endTime,
                capacity: newSlot.capacity,
                status: 'Available'
            });
            // Close modal and reset form
            setShowAddModal(false);
            setNewSlot({ startTime: '09:00', endTime: '11:00', capacity: 5 });
            // Refresh slots and indicators
            const [slotsData, indicatorsData] = await Promise.all([
                api.getSlots(selectedDate),
                api.getSlotIndicators()
            ]);
            setSlots(slotsData);
            setIndicators(indicatorsData);
            alert('Slot added successfully!');
        }
        catch (error) {
            alert(`Failed to add slot: ${error.response?.data?.message || error.message || 'Unknown error'}`);
        }
        finally {
            setAddingSlot(false);
        }
    };
    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        }
        else {
            setCurrentMonth(currentMonth - 1);
        }
    };
    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        }
        else {
            setCurrentMonth(currentMonth + 1);
        }
    };
    const handleLogout = () => {
        api.logout();
        navigate('/login');
    };
    const formatSelectedDate = () => {
        return `${monthNames[currentMonth].slice(0, 3)} ${selectedDate}, ${currentYear}`;
    };
    return (_jsxs(Layout, { title: "", role: "Agency", fullWidth: true, hideSidebar: true, children: [_jsx("div", { className: "bg-[#0B1116] font-sans text-gray-200 antialiased selection:bg-[#f59e0b] selection:text-white min-h-screen", children: _jsxs("div", { className: "relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden", children: [_jsx("div", { className: "fixed top-0 left-0 w-full h-[500px] bg-[#f59e0b]/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" }), _jsx("div", { className: "fixed bottom-0 right-0 w-full h-[500px] bg-[#8b5cf6]/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none" }), _jsxs("div", { className: "layout-container flex h-full grow flex-col relative z-10", children: [_jsxs("header", { className: "flex items-center justify-between whitespace-nowrap border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 transition-all duration-300", children: [_jsxs("div", { className: "flex items-center gap-3 text-white cursor-pointer", onClick: () => navigate('/'), children: [_jsx("div", { className: "p-2 bg-[#f59e0b]/10 rounded-lg", children: _jsx("svg", { className: "h-6 w-6 text-[#f59e0b]", fill: "currentColor", viewBox: "0 0 48 48", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" }) }) }), _jsxs("h2", { className: "text-xl font-bold tracking-tight text-white", children: ["EcoCycle ", _jsx("span", { className: "text-[#f59e0b]", children: "Partner" })] })] }), _jsx("nav", { className: "hidden md:flex flex-1 justify-center gap-1" }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("button", { onClick: () => navigate('/agency/profile'), className: "hidden sm:flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-[#151F26] border border-white/5 hover:bg-white/5 transition-colors group cursor-pointer", children: [_jsx("div", { className: "size-8 rounded-full bg-[#f59e0b] flex items-center justify-center ring-2 ring-white/10 group-hover:ring-[#f59e0b]/50 transition-all text-white font-bold text-sm", children: user?.name?.charAt(0) || 'A' }), _jsx("span", { className: "text-sm font-medium text-gray-200", children: user?.name || 'Agency' })] }), _jsx("button", { onClick: handleLogout, className: "p-2.5 rounded-full bg-[#151F26] border border-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors", title: "Logout", children: _jsx("span", { className: "material-symbols-outlined text-[20px]", children: "logout" }) })] })] }), _jsx("main", { className: "flex flex-1 justify-center py-5 mt-24", children: _jsxs("div", { className: "layout-content-container flex flex-col w-full max-w-7xl px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-end gap-6 py-8", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("button", { onClick: () => navigate('/agency'), className: "p-2 rounded-lg border transition-colors bg-[#f59e0b]/10 border-[#f59e0b]/20 text-[#f59e0b] hover:bg-[#f59e0b]/20", title: "Back to Dashboard", children: _jsx("span", { className: "material-symbols-outlined text-xl", children: "arrow_back" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-[#f59e0b] text-sm font-bold uppercase tracking-widest mb-2", children: "Slot Management" }), _jsx("h1", { className: "text-white text-4xl sm:text-5xl font-black leading-tight tracking-tighter mb-2", children: "Manage Slots" }), _jsx("p", { className: "text-[#94a3b8] text-lg", children: "Select a date to view and manage pickup time slots." })] })] }), _jsxs("button", { onClick: () => setShowAddModal(true), className: "flex items-center justify-center h-12 px-6 text-base font-bold leading-normal transition-all bg-[#f59e0b] text-white rounded-xl hover:bg-[#d97706] hover:scale-105 shadow-[0_0_20px_rgba(245,158,11,0.3)]", children: [_jsx("span", { className: "material-symbols-outlined mr-2", children: "add" }), _jsx("span", { className: "truncate", children: "Add New Slot" })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-8", children: [_jsxs("div", { className: "lg:col-span-8 flex flex-col gap-6", children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4", children: [_jsx("div", { className: "flex h-10 items-center justify-center rounded-xl bg-[#151F26] border border-white/5 p-1", children: _jsxs("div", { className: "flex cursor-default h-full items-center justify-center overflow-hidden rounded-lg px-4 text-sm font-medium leading-normal bg-[#f59e0b] text-white shadow-sm", children: [_jsx("span", { className: "material-symbols-outlined mr-2 text-lg", children: "calendar_month" }), _jsx("span", { className: "truncate", children: "Month View" })] }) }), _jsxs("button", { onClick: () => {
                                                                            const today = new Date();
                                                                            setSelectedDate(today.getDate());
                                                                            setCurrentMonth(today.getMonth());
                                                                            setCurrentYear(today.getFullYear());
                                                                        }, className: "flex items-center justify-center h-10 px-4 text-sm font-medium leading-normal transition-colors bg-[#8b5cf6] text-white rounded-xl hover:bg-[#7c3aed]", children: [_jsx("span", { className: "material-symbols-outlined mr-2 text-lg", children: "today" }), _jsx("span", { className: "truncate", children: "Jump to Today" })] })] }), _jsxs("div", { className: "bg-[#151F26] rounded-2xl p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] border border-white/5", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("button", { onClick: handlePrevMonth, className: "flex items-center justify-center text-gray-200 size-10 rounded-full hover:bg-white/5 hover:text-[#f59e0b] transition-colors", children: _jsx("span", { className: "material-symbols-outlined", children: "chevron_left" }) }), _jsxs("p", { className: "text-white text-xl font-bold leading-tight", children: [monthNames[currentMonth], " ", currentYear] }), _jsx("button", { onClick: handleNextMonth, className: "flex items-center justify-center text-gray-200 size-10 rounded-full hover:bg-white/5 hover:text-[#f59e0b] transition-colors", children: _jsx("span", { className: "material-symbols-outlined", children: "chevron_right" }) })] }), _jsx("div", { className: "grid grid-cols-7 gap-2 mb-2", children: weekDays.map(d => (_jsx("p", { className: "flex items-center justify-center h-10 text-xs font-bold tracking-wider text-slate-500", children: d }, d))) }), _jsxs("div", { className: "grid grid-cols-7 gap-2", children: [Array.from({ length: firstDayOfMonth }).map((_, i) => (_jsx("div", { className: "h-16" }, `empty-${i}`))), days.map((day) => {
                                                                                const selected = selectedDate === day;
                                                                                const isToday = day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();
                                                                                const indicator = indicators[day];
                                                                                return (_jsxs("button", { onClick: () => setSelectedDate(day), className: `relative flex flex-col justify-start items-center h-16 text-sm font-medium leading-normal rounded-xl p-2 transition-all duration-200
                                ${selected
                                                                                        ? 'bg-[#f59e0b]/20 text-white border-2 border-[#f59e0b] shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                                                                                        : isToday
                                                                                            ? 'bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 text-white'
                                                                                            : 'bg-[#0B1116] border border-white/5 text-gray-200 hover:bg-white/5 hover:border-white/5'}
                              `, children: [_jsx("span", { className: `font-bold ${selected ? 'text-[#f59e0b]' : isToday ? 'text-[#8b5cf6]' : ''}`, children: day }), _jsxs("div", { className: "flex gap-1 mt-1", children: [indicator?.hasAvailable && (_jsx("div", { className: "w-1.5 h-1.5 bg-[#f59e0b] rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]", title: "Slots Available" })), indicator?.hasBooked && (_jsx("div", { className: "w-1.5 h-1.5 bg-[#8b5cf6] rounded-full shadow-[0_0_8px_rgba(139,92,246,0.5)]", title: "Has Bookings" }))] })] }, day));
                                                                            })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-6 mt-6 pt-4 border-t border-white/5", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 bg-[#f59e0b] rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]" }), _jsx("span", { className: "text-xs text-slate-400", children: "Available Slots" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 bg-[#8b5cf6] rounded-full shadow-[0_0_8px_rgba(139,92,246,0.5)]" }), _jsx("span", { className: "text-xs text-slate-400", children: "Has Bookings" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 rounded-full border-2 border-[#8b5cf6]" }), _jsx("span", { className: "text-xs text-slate-400", children: "Today" })] })] })] })] }), _jsxs("div", { className: "lg:col-span-4 flex flex-col gap-6", children: [_jsxs("div", { className: "bg-[#151F26] rounded-2xl p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] border border-white/5 lg:sticky lg:top-28", children: [_jsxs("div", { className: "flex items-center justify-between pb-4 border-b border-white/5 mb-4", children: [_jsxs("h2", { className: "text-white text-xl font-bold leading-tight", children: ["Schedule for ", formatSelectedDate()] }), _jsxs("span", { className: "px-2 py-1 rounded-lg bg-[#f59e0b]/10 text-[#f59e0b] text-xs font-bold", children: [slots.length, " slots"] })] }), _jsx("div", { className: "flex flex-col gap-3 max-h-[500px] overflow-y-auto", children: loading ? (_jsxs("div", { className: "flex flex-col items-center justify-center py-12 gap-3 text-slate-500", children: [_jsx(Loader, { size: "md", color: "#f59e0b" }), _jsx("p", { children: "Loading slots..." })] })) : slots.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center py-12 gap-3 text-slate-500 border-2 border-dashed border-white/5 rounded-xl", children: [_jsx("span", { className: "material-symbols-outlined text-4xl opacity-50", children: "event_busy" }), _jsx("p", { className: "text-center", children: "No slots configured for this date." }), _jsx("button", { onClick: () => setShowAddModal(true), className: "mt-2 px-4 py-2 bg-[#f59e0b] text-white rounded-lg text-sm font-bold hover:bg-[#d97706] transition-colors", children: "Add Slot" })] })) : (slots.map(slot => (_jsxs("div", { className: `flex items-center justify-between p-4 rounded-xl border transition-all group
                                ${slot.status === 'Available' ? 'bg-[#f59e0b]/5 border-[#f59e0b]/20 hover:border-[#f59e0b]/40' : ''}
                                ${slot.status === 'Booked' ? 'bg-[#8b5cf6]/5 border-[#8b5cf6]/20 hover:border-[#8b5cf6]/40' : ''}
                                ${slot.status === 'Unavailable' ? 'bg-[#0B1116]/50 border-white/5' : ''}
                              `, children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: `w-1 h-12 rounded-full
                                  ${slot.status === 'Available' ? 'bg-[#f59e0b]' : ''}
                                  ${slot.status === 'Booked' ? 'bg-[#8b5cf6]' : ''}
                                  ${slot.status === 'Unavailable' ? 'bg-slate-700' : ''}
                                ` }), _jsxs("div", { className: "flex flex-col", children: [_jsxs("p", { className: "text-base font-bold text-white", children: [slot.startTime, " - ", slot.endTime] }), _jsx("p", { className: `text-sm font-medium
                                    ${slot.status === 'Available' ? 'text-[#f59e0b]' : ''}
                                    ${slot.status === 'Booked' ? 'text-[#8b5cf6]' : ''}
                                    ${slot.status === 'Unavailable' ? 'text-slate-500' : ''}
                                  `, children: slot.status === 'Booked' ? `Booked - ${slot.bookedBy}` : slot.status })] })] }), _jsx("div", { className: "flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity", children: slot.status === 'Booked' ? (_jsx("button", { className: "p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors", children: _jsx("span", { className: "material-symbols-outlined text-xl", children: "visibility" }) })) : (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => handleEditSlot(slot), className: "p-2 rounded-lg text-slate-400 hover:text-[#f59e0b] hover:bg-[#f59e0b]/10 transition-colors", children: _jsx("span", { className: "material-symbols-outlined text-xl", children: "edit" }) }), _jsx("button", { onClick: () => handleDelete(slot.id), disabled: deletingSlot === slot.id, className: "p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50", children: deletingSlot === slot.id ? (_jsx(Loader, { size: "sm", color: "#ef4444" })) : (_jsx("span", { className: "material-symbols-outlined text-xl", children: "delete" })) })] })) })] }, slot.id)))) })] }), _jsxs("div", { className: "bg-[#151F26] rounded-2xl p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] border border-white/5", children: [_jsxs("h3", { className: "text-white text-lg font-bold mb-4 flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-slate-400", children: "bolt" }), "Quick Actions"] }), _jsxs("div", { className: "flex flex-col gap-3", children: [_jsxs("button", { onClick: () => navigate('/agency'), className: "flex w-full group cursor-pointer items-center justify-between overflow-hidden rounded-xl h-12 px-4 bg-white/5 text-gray-200 border border-white/5 hover:bg-white/5 hover:border-white/5 transition-all", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "size-7 rounded-lg bg-[#f59e0b]/20 text-[#f59e0b] flex items-center justify-center", children: _jsx("span", { className: "material-symbols-outlined text-lg", children: "dashboard" }) }), _jsx("span", { className: "font-medium text-sm", children: "Back to Dashboard" })] }), _jsx("span", { className: "material-symbols-outlined text-gray-500 group-hover:text-white transition-colors text-lg", children: "chevron_right" })] }), _jsxs("button", { onClick: () => navigate('/agency/bookings'), className: "flex w-full group cursor-pointer items-center justify-between overflow-hidden rounded-xl h-12 px-4 bg-white/5 text-gray-200 border border-white/5 hover:bg-white/5 hover:border-white/5 transition-all", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "size-7 rounded-lg bg-[#8b5cf6]/20 text-[#8b5cf6] flex items-center justify-center", children: _jsx("span", { className: "material-symbols-outlined text-lg", children: "book_online" }) }), _jsx("span", { className: "font-medium text-sm", children: "View Bookings" })] }), _jsx("span", { className: "material-symbols-outlined text-gray-500 group-hover:text-white transition-colors text-lg", children: "chevron_right" })] })] })] })] })] })] }) })] })] }) }), showAddModal && (_jsxs("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 bg-black/70 backdrop-blur-sm", onClick: () => !addingSlot && setShowAddModal(false) }), _jsxs("div", { className: "relative bg-[#151F26] rounded-2xl p-6 sm:p-8 max-w-md w-full border border-white/5 shadow-2xl", children: [_jsx("div", { className: "w-16 h-16 mx-auto mb-6 rounded-full bg-[#f59e0b]/20 flex items-center justify-center", children: _jsx("span", { className: "material-symbols-outlined text-4xl text-[#f59e0b]", children: "schedule" }) }), _jsx("h3", { className: "text-2xl font-bold text-white text-center mb-2", children: "Add New Slot" }), _jsxs("p", { className: "text-slate-400 text-center mb-6", children: ["Create a pickup slot for ", formatSelectedDate()] }), _jsxs("div", { className: "space-y-4 mb-6", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("label", { className: "text-sm font-medium text-slate-400", children: "Start Time" }), _jsx("input", { type: "time", value: newSlot.startTime, onChange: (e) => setNewSlot({ ...newSlot, startTime: e.target.value }), className: "w-full bg-[#0B1116] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#f59e0b] focus:border-[#f59e0b] outline-none transition-all" })] }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("label", { className: "text-sm font-medium text-slate-400", children: "End Time" }), _jsx("input", { type: "time", value: newSlot.endTime, onChange: (e) => setNewSlot({ ...newSlot, endTime: e.target.value }), className: "w-full bg-[#0B1116] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#f59e0b] focus:border-[#f59e0b] outline-none transition-all" })] })] }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("label", { className: "text-sm font-medium text-slate-400", children: "Capacity (pickups per slot)" }), _jsx("input", { type: "number", min: "1", max: "20", value: newSlot.capacity, onChange: (e) => setNewSlot({ ...newSlot, capacity: parseInt(e.target.value) || 1 }), className: "w-full bg-[#0B1116] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#f59e0b] focus:border-[#f59e0b] outline-none transition-all" })] })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [_jsx("button", { onClick: () => setShowAddModal(false), disabled: addingSlot, className: "flex-1 py-3 px-6 rounded-xl bg-white/5 text-white font-medium border border-white/5 hover:bg-white/5 transition-all disabled:opacity-50", children: "Cancel" }), _jsx("button", { onClick: handleAddSlot, disabled: addingSlot, className: "flex-1 py-3 px-6 rounded-xl bg-[#f59e0b] text-white font-bold hover:bg-[#d97706] transition-all flex items-center justify-center gap-2 disabled:opacity-50", children: addingSlot ? (_jsxs(_Fragment, { children: [_jsx(Loader, { size: "sm", color: "white" }), "Adding..."] })) : (_jsxs(_Fragment, { children: [_jsx("span", { className: "material-symbols-outlined text-lg", children: "add" }), "Add Slot"] })) })] })] })] })), showEditModal && editingSlot && (_jsxs("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 bg-black/70 backdrop-blur-sm", onClick: () => !updatingSlot && setShowEditModal(false) }), _jsxs("div", { className: "relative bg-[#151F26] rounded-2xl p-6 sm:p-8 max-w-md w-full border border-white/5 shadow-2xl", children: [_jsx("div", { className: "w-16 h-16 mx-auto mb-6 rounded-full bg-[#f59e0b]/20 flex items-center justify-center", children: _jsx("span", { className: "material-symbols-outlined text-4xl text-[#f59e0b]", children: "edit_calendar" }) }), _jsx("h3", { className: "text-2xl font-bold text-white text-center mb-2", children: "Edit Slot" }), _jsxs("p", { className: "text-slate-400 text-center mb-6", children: ["Modify the pickup slot for ", formatSelectedDate()] }), _jsxs("div", { className: "space-y-4 mb-6", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("label", { className: "text-sm font-medium text-slate-400", children: "Start Time" }), _jsx("input", { type: "time", value: editSlotData.startTime, onChange: (e) => setEditSlotData({ ...editSlotData, startTime: e.target.value }), className: "w-full bg-[#0B1116] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#f59e0b] focus:border-[#f59e0b] outline-none transition-all" })] }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("label", { className: "text-sm font-medium text-slate-400", children: "End Time" }), _jsx("input", { type: "time", value: editSlotData.endTime, onChange: (e) => setEditSlotData({ ...editSlotData, endTime: e.target.value }), className: "w-full bg-[#0B1116] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#f59e0b] focus:border-[#f59e0b] outline-none transition-all" })] })] }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("label", { className: "text-sm font-medium text-slate-400", children: "Capacity (pickups per slot)" }), _jsx("input", { type: "number", min: "1", max: "20", value: editSlotData.capacity, onChange: (e) => setEditSlotData({ ...editSlotData, capacity: parseInt(e.target.value) || 1 }), className: "w-full bg-[#0B1116] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#f59e0b] focus:border-[#f59e0b] outline-none transition-all" })] })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [_jsx("button", { onClick: () => {
                                            setShowEditModal(false);
                                            setEditingSlot(null);
                                        }, disabled: updatingSlot, className: "flex-1 py-3 px-6 rounded-xl bg-white/5 text-white font-medium border border-white/5 hover:bg-white/5 transition-all disabled:opacity-50", children: "Cancel" }), _jsx("button", { onClick: handleUpdateSlot, disabled: updatingSlot, className: "flex-1 py-3 px-6 rounded-xl bg-[#f59e0b] text-white font-bold hover:bg-[#d97706] transition-all flex items-center justify-center gap-2 disabled:opacity-50", children: updatingSlot ? (_jsxs(_Fragment, { children: [_jsx(Loader, { size: "sm", color: "white" }), "Updating..."] })) : (_jsxs(_Fragment, { children: [_jsx("span", { className: "material-symbols-outlined text-lg", children: "save" }), "Update Slot"] })) })] })] })] }))] }));
};
export default ManageSlots;
