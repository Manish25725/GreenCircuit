import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { api, getCurrentUser, User, Booking } from '../services/api';

const UserDashboard = () => {
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Try to get fresh user data from API
      const userData = await api.getMe();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Get active booking
      const booking = await api.getActiveBooking();
      setActiveBooking(booking);
    } catch (error) {
      console.error('Failed to load user data:', error);
      // If API fails, use cached user data
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    window.location.hash = '#/login';
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <Layout title="" role="User" fullWidth hideSidebar>
      <div className="bg-[#0B1116] font-sans text-gray-200 antialiased selection:bg-[#10b981] selection:text-white min-h-screen">
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
          <div className="fixed top-0 left-0 w-full h-[500px] bg-[#10b981]/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
          <div className="fixed bottom-0 right-0 w-full h-[500px] bg-[#3b82f6]/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none"></div>
          
          <div className="layout-container flex h-full grow flex-col relative z-10">
            {/* Header */}
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
                <a className="text-sm font-semibold px-5 py-2.5 rounded-full text-white bg-white/10 shadow-inner border border-white/5 cursor-pointer" onClick={() => window.location.hash = '#/dashboard'}>Dashboard</a>
                <a className="text-sm font-medium px-5 py-2.5 rounded-full text-[#94a3b8] hover:text-white hover:bg-white/5 transition-all cursor-pointer" onClick={() => window.location.hash = '#/search'}>New Request</a>
                <a className="text-sm font-medium px-5 py-2.5 rounded-full text-[#94a3b8] hover:text-white hover:bg-white/5 transition-all cursor-pointer" onClick={() => window.location.hash = '#/rewards'}>Rewards</a>
                <a className="text-sm font-medium px-5 py-2.5 rounded-full text-[#94a3b8] hover:text-white hover:bg-white/5 transition-all cursor-pointer" onClick={() => window.location.hash = '#/certificate'}>Certificate</a>
              </nav>
              <div className="flex items-center gap-4">
                <button 
                    onClick={() => window.location.hash = '#/profile'}
                    className="hidden sm:flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-[#151F26] border border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"
                >
                  <div className="size-8 rounded-full bg-[#10b981] flex items-center justify-center ring-2 ring-white/10 group-hover:ring-[#10b981]/50 transition-all text-white font-bold text-sm">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-medium text-gray-200">{user?.name || 'User'}</span>
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
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 py-8">
                  <div>
                    <h1 className="text-white text-4xl sm:text-5xl font-black leading-tight tracking-tighter mb-2 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">Hello, {user?.name?.split(' ')[0] || 'User'}!</h1>
                    <p className="text-[#94a3b8] text-lg">Here's your environmental impact update.</p>
                  </div>
                  <div className="flex items-center gap-3 bg-[#151F26]/50 p-1.5 pr-4 rounded-full border border-white/10 backdrop-blur-sm">
                    <div className="bg-[#10b981]/20 p-2 rounded-full text-[#10b981]">
                      <span className="material-symbols-outlined text-lg">calendar_today</span>
                    </div>
                    <span className="text-sm font-medium text-gray-300">{formatDate()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column (Tracking & Impact) */}
                  <div className="lg:col-span-8 flex flex-col gap-8">
                    
                    {/* Live Tracking Section */}
                    <section className="flex flex-col gap-5">
                      <div className="flex items-center justify-between">
                        <h2 className="text-white text-2xl font-bold tracking-tight flex items-center gap-3">
                          <span className="p-2 bg-[#3b82f6]/10 rounded-lg text-[#3b82f6]">
                            <span className="material-symbols-outlined">local_shipping</span>
                          </span>
                          Live Tracking
                        </h2>
                        <span className="px-3 py-1 rounded-full bg-[#3b82f6]/10 text-[#3b82f6] text-xs font-bold uppercase tracking-wider border border-[#3b82f6]/20 animate-pulse">Live Update</span>
                      </div>

                      <div className="bg-[#151F26] rounded-2xl p-6 sm:p-10 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3),0_4px_6px_-4px_rgba(0,0,0,0.2),inset_0_1px_0_0_rgba(255,255,255,0.05)] border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#3b82f6]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                        <div className="relative flex flex-col">
                          <div className="absolute left-[23px] top-6 bottom-12 w-0.5 bg-gray-800 rounded-full"></div>
                          <div className="absolute left-[23px] top-6 h-[48%] w-0.5 bg-gradient-to-b from-[#10b981] via-[#10b981] to-[#3b82f6] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                          
                          <div className="relative flex gap-6 pb-12 group/step">
                            <div className="z-10 shrink-0">
                              <div className="flex size-12 items-center justify-center rounded-full bg-[#10b981] text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] ring-4 ring-[#151F26] transition-transform duration-500 group-hover/step:scale-110">
                                <span className="material-symbols-outlined">check</span>
                              </div>
                            </div>
                            <div className="flex-1 pt-1">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                                <h3 className="text-lg font-bold text-white group-hover/step:text-[#10b981] transition-colors">Request Placed</h3>
                                <span className="w-fit text-[10px] font-bold uppercase tracking-wider text-[#10b981] bg-[#10b981]/10 px-2 py-1 rounded border border-[#10b981]/20">Completed</span>
                              </div>
                              <p className="text-sm text-[#94a3b8]">Your recycling request #REQ-2024-89 was received.</p>
                              <p className="text-xs text-gray-500 mt-2 font-mono">June 10, 09:30 AM</p>
                            </div>
                          </div>

                          <div className="relative flex gap-6 pb-12 group/step">
                            <div className="z-10 shrink-0">
                              <div className="flex size-12 items-center justify-center rounded-full bg-[#10b981] text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] ring-4 ring-[#151F26] transition-transform duration-500 group-hover/step:scale-110">
                                <span className="material-symbols-outlined">verified</span>
                              </div>
                            </div>
                            <div className="flex-1 pt-1">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                                <h3 className="text-lg font-bold text-white group-hover/step:text-[#10b981] transition-colors">Agency Accepted</h3>
                                <span className="w-fit text-[10px] font-bold uppercase tracking-wider text-[#10b981] bg-[#10b981]/10 px-2 py-1 rounded border border-[#10b981]/20">Completed</span>
                              </div>
                              <p className="text-sm text-[#94a3b8]">GreenTech Recyclers confirmed your request.</p>
                              <p className="text-xs text-gray-500 mt-2 font-mono">June 10, 02:15 PM</p>
                            </div>
                          </div>

                          <div className="relative flex gap-6 pb-12 group/step">
                            <div className="z-10 shrink-0 relative">
                              <div className="absolute inset-0 -m-2 rounded-full border-2 border-[#3b82f6]/30 animate-pulse"></div>
                              <div className="flex size-12 items-center justify-center rounded-full bg-[#3b82f6] text-white shadow-[0_0_25px_rgba(59,130,246,0.6)] ring-4 ring-[#151F26] transition-transform duration-500 group-hover/step:scale-110 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-blue-400"></div>
                                <span className="material-symbols-outlined relative z-10 animate-bounce">local_shipping</span>
                              </div>
                            </div>
                            <div className="flex-1 -mt-2">
                              <div className="bg-gradient-to-br from-[#3b82f6]/10 to-transparent p-5 rounded-xl border border-[#3b82f6]/30 shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-all duration-300 hover:border-[#3b82f6]/50 group/card relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-[#3b82f6]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                                <div className="flex flex-wrap justify-between items-start gap-2 mb-3 relative z-10">
                                  <div>
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                      Pickup Scheduled
                                      <span className="flex size-2 rounded-full bg-[#3b82f6] shadow-[0_0_10px_#3b82f6] animate-pulse"></span>
                                    </h3>
                                    <p className="text-[#3b82f6] text-sm font-medium mt-0.5">Vehicle on the way</p>
                                  </div>
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#3b82f6] bg-[#3b82f6]/10 px-3 py-1.5 rounded-full border border-[#3b82f6]/20 shadow-sm">In Progress</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 relative z-10">
                                  <div className="bg-[#151F26]/80 p-3 rounded-lg border border-white/5 flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-gray-800 flex items-center justify-center shrink-0 border border-white/5">
                                      <span className="material-symbols-outlined text-gray-400 text-sm">badge</span>
                                    </div>
                                    <div className="overflow-hidden">
                                      <p className="text-xs text-gray-400 truncate">Agency</p>
                                      <p className="text-sm font-semibold text-white truncate">GreenTech Recyclers</p>
                                    </div>
                                  </div>
                                  <div className="bg-[#151F26]/80 p-3 rounded-lg border border-white/5 flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-gray-800 flex items-center justify-center shrink-0 border border-white/5">
                                      <span className="material-symbols-outlined text-gray-400 text-sm">schedule</span>
                                    </div>
                                    <div className="overflow-hidden">
                                      <p className="text-xs text-gray-400 truncate">Est. Time</p>
                                      <p className="text-sm font-semibold text-white truncate">1:00 PM - 3:00 PM</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                                  <p className="text-xs text-gray-400 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">event</span> June 12, 2024
                                  </p>
                                  <button className="text-xs font-semibold text-[#3b82f6] hover:text-white transition-colors flex items-center gap-1 group/btn">
                                    Track on Map <span className="material-symbols-outlined text-[14px] group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="relative flex gap-6 group/step opacity-50 hover:opacity-100 transition-opacity duration-300">
                            <div className="z-10 shrink-0">
                              <div className="flex size-12 items-center justify-center rounded-full bg-[#151F26] border-2 border-dashed border-gray-600 text-gray-500 ring-4 ring-[#151F26]">
                                <span className="material-symbols-outlined">recycling</span>
                              </div>
                            </div>
                            <div className="flex-1 pt-1">
                              <h3 className="text-lg font-bold text-gray-500">Recycling Completed</h3>
                              <p className="text-sm text-gray-600">Pending final processing and verification.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Impact Section */}
                    <section className="flex flex-col gap-5">
                      <h2 className="text-white text-2xl font-bold tracking-tight flex items-center gap-3">
                        <span className="p-2 bg-[#10b981]/10 rounded-lg text-[#10b981]">
                          <span className="material-symbols-outlined">eco</span>
                        </span>
                        Your Impact
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#151F26] rounded-2xl p-6 shadow-[0_4px_12px_0_rgba(0,0,0,0.07)] flex flex-col justify-between border border-white/5 hover:border-white/10 transition-colors relative overflow-hidden group">
                          <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-8xl text-white">scale</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 text-[#94a3b8] mb-3">
                              <span className="text-sm font-semibold uppercase tracking-wider">Total Recycled</span>
                            </div>
                            <p className="text-white text-5xl font-black leading-none tracking-tight">{user?.totalWasteRecycled?.toFixed(1) || '0'} <span className="text-2xl font-medium text-gray-500">kg</span></p>
                          </div>
                          <div className="mt-8">
                            <div className="flex justify-between text-xs font-medium text-gray-400 mb-2">
                              <span>Progress</span>
                              <span>{Math.min(Math.round((user?.totalWasteRecycled || 0) / 100 * 100), 100)}% to Goal</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                              <div className="bg-gradient-to-r from-[#10b981]/50 to-[#10b981] h-3 rounded-full relative" style={{ width: `${Math.min((user?.totalWasteRecycled || 0), 100)}%` }}>
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-[#151F26] rounded-2xl p-6 shadow-[0_4px_12px_0_rgba(0,0,0,0.07)] flex flex-col justify-between border border-white/5 hover:border-white/10 transition-colors relative overflow-hidden group">
                          <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-8xl text-white">cloud</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 text-[#94a3b8] mb-3">
                              <span className="text-sm font-semibold uppercase tracking-wider">CO₂ Offset</span>
                            </div>
                            <p className="text-white text-5xl font-black leading-none tracking-tight">30.5 <span className="text-2xl font-medium text-gray-500">kg</span></p>
                          </div>
                          <div className="mt-8">
                            <div className="flex justify-between text-xs font-medium text-gray-400 mb-2">
                              <span>Progress</span>
                              <span>80% to Goal</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                              <div className="bg-gradient-to-r from-[#3b82f6]/50 to-[#3b82f6] h-3 rounded-full relative" style={{ width: '80%' }}>
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>

                  {/* Right Column (Points & Actions) */}
                  <div className="lg:col-span-4 flex flex-col gap-8">
                    <div className="bg-gradient-to-b from-[#151F26] to-[#0B1116] rounded-2xl p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] flex flex-col items-center text-center border border-white/5 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#10b981] via-[#3b82f6] to-[#10b981]"></div>
                      <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-[#10b981]/20 rounded-full blur-[60px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                      <p className="text-sm font-bold uppercase tracking-widest text-[#94a3b8] z-10">Your Eco Points</p>
                      <div className="my-8 flex items-center justify-center relative z-10 group cursor-default">
                        <svg className="h-16 w-16 text-[#10b981] drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2L9.5 8.5H3L8 12.5L6 19L12 15L18 19L16 12.5L21 8.5H14.5L12 2Z" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                        <span className="text-7xl font-black text-white ml-2 drop-shadow-sm tracking-tighter">{(user?.ecoPoints || 0).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-400 max-w-[200px] z-10">
                        {(user?.ecoPoints || 0) >= 500 
                          ? 'You have enough points for rewards!' 
                          : `You're ${500 - (user?.ecoPoints || 0)} points away from your first reward!`}
                      </p>
                      <button className="mt-8 w-full group relative overflow-hidden rounded-xl bg-[#10b981] text-white font-bold h-12 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all z-10 cursor-pointer" onClick={() => window.location.hash = '#/rewards'}>
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                        <span className="relative flex items-center justify-center gap-2">
                          Redeem Rewards
                          <span className="material-symbols-outlined text-lg">arrow_forward</span>
                        </span>
                      </button>
                    </div>

                    <div className="bg-[#151F26] rounded-2xl p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] border border-white/5">
                      <h2 className="text-white text-lg font-bold tracking-tight pb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-gray-400">bolt</span>
                        Quick Actions
                      </h2>
                      <div className="flex flex-col gap-3">
                        <button onClick={() => window.location.hash = '#/search'} className="flex w-full group cursor-pointer items-center justify-between overflow-hidden rounded-xl h-14 px-4 bg-white/5 text-gray-200 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-lg bg-[#10b981]/20 text-[#10b981] flex items-center justify-center">
                              <span className="material-symbols-outlined text-xl">add</span>
                            </div>
                            <span className="font-medium">New Request</span>
                          </div>
                          <span className="material-symbols-outlined text-gray-500 group-hover:text-white transition-colors">chevron_right</span>
                        </button>
                        <button className="flex w-full group cursor-pointer items-center justify-between overflow-hidden rounded-xl h-14 px-4 bg-white/5 text-gray-200 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-lg bg-[#3b82f6]/20 text-[#3b82f6] flex items-center justify-center">
                              <span className="material-symbols-outlined text-xl">history</span>
                            </div>
                            <span className="font-medium">History</span>
                          </div>
                          <span className="material-symbols-outlined text-gray-500 group-hover:text-white transition-colors">chevron_right</span>
                        </button>
                        <button onClick={() => window.location.hash = '#/contact'} className="flex w-full group cursor-pointer items-center justify-between overflow-hidden rounded-xl h-14 px-4 bg-white/5 text-gray-200 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                              <span className="material-symbols-outlined text-xl">support_agent</span>
                            </div>
                            <span className="font-medium">Support</span>
                          </div>
                          <span className="material-symbols-outlined text-gray-500 group-hover:text-white transition-colors">chevron_right</span>
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
    </Layout>
  );
};

export default UserDashboard;