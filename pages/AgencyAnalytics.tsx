import React from 'react';
import Layout from '../components/Layout';

const AgencyAnalytics = () => {
  return (
    <Layout title="" role="Agency">
      <div className="-mt-8">
        <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col gap-1">
                <h2 className="text-white text-3xl font-bold tracking-tight">Agency Overview</h2>
                <p className="text-slate-400">Here's a summary of your recycling operations today.</p>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-400 bg-[#1E293B] px-3 py-1.5 rounded-lg border border-white/5">
                    October 4, 2024
                 </span>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* KPI Card 1 */}
            <div className="bg-[#1E293B] border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-[#34D399]/30 transition-all duration-300 shadow-xl">
                <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <span className="material-symbols-outlined text-[100px] text-[#34D399]">calendar_today</span>
                </div>
                <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#34D399]/10 text-[#34D399]">
                            <span className="material-symbols-outlined">event_available</span>
                        </div>
                        <p className="text-sm font-medium text-slate-400">Slots Available Today</p>
                    </div>
                    <div>
                        <p className="text-4xl font-bold text-white">8</p>
                        <p className="text-sm text-slate-400 mt-1">
                            <span className="text-[#34D399] font-medium">3 booked</span> so far today
                        </p>
                    </div>
                </div>
            </div>

            {/* KPI Card 2 */}
            <div className="bg-[#1E293B] border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300 shadow-xl">
                <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <span className="material-symbols-outlined text-[100px] text-white">book_online</span>
                </div>
                <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                            <span className="material-symbols-outlined">book_online</span>
                        </div>
                        <p className="text-sm font-medium text-slate-400">Upcoming Bookings</p>
                    </div>
                    <div>
                        <p className="text-4xl font-bold text-white">24</p>
                        <p className="text-sm text-slate-400 mt-1">
                            Scheduled for next 7 days
                        </p>
                    </div>
                </div>
            </div>

            {/* KPI Card 3 */}
            <div className="bg-[#1E293B] border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-purple-500/30 transition-all duration-300 shadow-xl">
                <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <span className="material-symbols-outlined text-[100px] text-white">payments</span>
                </div>
                <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                            <span className="material-symbols-outlined">attach_money</span>
                        </div>
                        <p className="text-sm font-medium text-slate-400">Recent Earnings</p>
                    </div>
                    <div>
                        <p className="text-4xl font-bold text-white">$1,250</p>
                        <p className="text-sm text-slate-400 mt-1">
                            <span className="text-purple-400 font-medium flex items-center gap-1 inline-flex">
                                <span className="material-symbols-outlined text-sm">trending_up</span> +12%
                            </span> 
                            from last month
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <div className="lg:col-span-2 flex flex-col gap-6">
                <div className="bg-[#1E293B] border border-white/5 rounded-2xl flex flex-col shadow-xl">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white">Recent Activity</h3>
                        <button className="text-[#34D399] text-sm font-semibold hover:text-[#34D399]/80 transition-colors bg-transparent border-none cursor-pointer">View All</button>
                    </div>
                    <div className="p-6 flex flex-col gap-4">
                        <div className="flex items-center justify-between group cursor-pointer p-2 hover:bg-white/5 rounded-lg transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
                                    <span className="material-symbols-outlined text-xl">person</span>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-white font-medium text-sm">New booking from Sarah M.</p>
                                    <p className="text-slate-400 text-xs">Pickup scheduled for Oct 5, 10:00 AM</p>
                                </div>
                            </div>
                            <div className="text-slate-500 text-xs">2m ago</div>
                        </div>
                        <div className="h-px bg-white/5 w-full"></div>
                        <div className="flex items-center justify-between group cursor-pointer p-2 hover:bg-white/5 rounded-lg transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-full bg-[#34D399]/10 text-[#34D399] flex items-center justify-center shrink-0 border border-[#34D399]/20">
                                    <span className="material-symbols-outlined text-xl">check_circle</span>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-white font-medium text-sm">Pickup Completed</p>
                                    <p className="text-slate-400 text-xs">Order #4291 marked as fulfilled</p>
                                </div>
                            </div>
                            <div className="text-slate-500 text-xs">1h ago</div>
                        </div>
                        <div className="h-px bg-white/5 w-full"></div>
                        <div className="flex items-center justify-between group cursor-pointer p-2 hover:bg-white/5 rounded-lg transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-full bg-yellow-500/10 text-yellow-400 flex items-center justify-center shrink-0 border border-yellow-500/20">
                                    <span className="material-symbols-outlined text-xl">warning</span>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-white font-medium text-sm">Slot Capacity Alert</p>
                                    <p className="text-slate-400 text-xs">Only 2 slots remaining for Oct 6</p>
                                </div>
                            </div>
                            <div className="text-slate-500 text-xs">3h ago</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions & Eco Tip */}
            <div className="flex flex-col gap-6">
                <div className="bg-[#1E293B] border border-white/5 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={() => window.location.hash = '#/agency/slots'}
                            className="flex items-center w-full p-3 rounded-xl bg-[#0B1116] hover:bg-[#252f3f] border border-white/5 transition-all group cursor-pointer"
                        >
                            <div className="bg-[#34D399]/10 p-2 rounded-lg mr-3 text-[#34D399] group-hover:bg-[#34D399] group-hover:text-[#0B1120] transition-colors">
                                <span className="material-symbols-outlined text-xl">add</span>
                            </div>
                            <span className="text-slate-200 font-medium text-sm flex-1 text-left">Add New Slot</span>
                            <span className="material-symbols-outlined text-slate-500 text-sm">chevron_right</span>
                        </button>
                        <button 
                            onClick={() => window.location.hash = '#/agency/slots'}
                            className="flex items-center w-full p-3 rounded-xl bg-[#0B1116] hover:bg-[#252f3f] border border-white/5 transition-all group cursor-pointer"
                        >
                            <div className="bg-blue-500/10 p-2 rounded-lg mr-3 text-blue-400 group-hover:bg-blue-400 group-hover:text-[#0B1120] transition-colors">
                                <span className="material-symbols-outlined text-xl">calendar_month</span>
                            </div>
                            <span className="text-slate-200 font-medium text-sm flex-1 text-left">View Calendar</span>
                            <span className="material-symbols-outlined text-slate-500 text-sm">chevron_right</span>
                        </button>
                        <button className="flex items-center w-full p-3 rounded-xl bg-[#0B1116] hover:bg-[#252f3f] border border-white/5 transition-all group cursor-pointer">
                            <div className="bg-purple-500/10 p-2 rounded-lg mr-3 text-purple-400 group-hover:bg-purple-400 group-hover:text-[#0B1120] transition-colors">
                                <span className="material-symbols-outlined text-xl">analytics</span>
                            </div>
                            <span className="text-slate-200 font-medium text-sm flex-1 text-left">Analytics</span>
                            <span className="material-symbols-outlined text-slate-500 text-sm">chevron_right</span>
                        </button>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-[#34D399]/10 to-[#1E293B] border border-[#34D399]/20 rounded-2xl p-6 relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <span className="material-symbols-outlined text-6xl text-[#34D399]">eco</span>
                    </div>
                    <div className="flex items-start gap-4 relative z-10">
                        <span className="material-symbols-outlined text-[#34D399] text-3xl">eco</span>
                        <div>
                            <h4 className="text-white font-bold mb-1">Eco Tip</h4>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Optimizing your slot times can reduce vehicle idle time by 15%.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </Layout>
  );
};

export default AgencyAnalytics;