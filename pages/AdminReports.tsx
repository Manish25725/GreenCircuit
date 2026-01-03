import React from 'react';
import Layout from '../components/Layout';

const AdminReports = () => {
  return (
    <Layout title="" role="Admin" fullWidth>
      <div className="flex flex-col h-screen overflow-hidden bg-[#0B1116] font-sans text-white">
        
        {/* Header */}
        <header className="flex items-center justify-between border-b border-white/5 bg-[#0B1116]/95 backdrop-blur px-8 py-4 z-10 shrink-0 sticky top-0">
            <div className="flex items-center gap-4">
                <h2 className="text-white text-xl font-bold tracking-tight">Platform Analytics</h2>
            </div>
            <div className="flex items-center gap-6">
                <div className="relative hidden md:block w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-500 text-[20px]">search</span>
                    </div>
                    <input className="block w-full pl-10 pr-3 py-2 border-none rounded-lg leading-5 bg-[#1E293B] text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#34D399] sm:text-sm transition-all" placeholder="Search reports..." type="text"/>
                </div>
                <div className="flex items-center gap-4">
                    <button className="relative text-slate-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#0B1120]"></span>
                    </button>
                    <button className="text-slate-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer">
                        <span className="material-symbols-outlined">settings</span>
                    </button>
                    <button className="text-slate-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer">
                        <span className="material-symbols-outlined">help</span>
                    </button>
                </div>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
            {/* Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-[#1E293B] border border-white/5 rounded-lg p-1">
                        <button className="px-3 py-1.5 text-xs font-medium bg-[#0B1116] text-white rounded shadow-sm cursor-pointer border-none">Last 7 Days</button>
                        <button className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer">Last 30 Days</button>
                        <button className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer">Month</button>
                        <button className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer">Year</button>
                    </div>
                    <div className="h-8 w-px bg-white/5"></div>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white border border-white/5 bg-[#1E293B] rounded-lg transition-colors cursor-pointer">
                        <span className="material-symbols-outlined text-[18px]">calendar_today</span> Oct 18 - Oct 25
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#1E293B] hover:bg-[#0B1116] text-white text-sm font-medium border border-white/5 rounded-lg transition-colors cursor-pointer">
                        <span className="material-symbols-outlined text-[18px]">filter_list</span> Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#34D399] hover:bg-[#6EE7B7] text-[#0B1120] text-sm font-bold rounded-lg shadow-[0_0_15px_rgba(52,211,153,0.3)] transition-colors cursor-pointer border-none">
                        <span className="material-symbols-outlined text-[18px]">download</span> Export Report
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#1E293B] border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-white/5 transition-all shadow-xl">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-symbols-outlined text-6xl text-[#34D399]">recycling</span>
                    </div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total E-Waste Collected</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-white">24.5<span className="text-lg text-slate-500 font-medium"> tons</span></h3>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                        <span className="bg-[#34D399]/20 text-[#34D399] text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">trending_up</span> +12.5%
                        </span>
                        <span className="text-slate-500 text-xs">vs last period</span>
                    </div>
                </div>
                <div className="bg-[#1E293B] border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-white/5 transition-all shadow-xl">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-symbols-outlined text-6xl text-blue-400">cloud_queue</span>
                    </div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">CO2 Emissions Saved</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-white">8,940<span className="text-lg text-slate-500 font-medium"> kg</span></h3>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                        <span className="bg-[#34D399]/20 text-[#34D399] text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">trending_up</span> +8.2%
                        </span>
                        <span className="text-slate-500 text-xs">vs last period</span>
                    </div>
                </div>
                <div className="bg-[#1E293B] border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-white/5 transition-all shadow-xl">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-symbols-outlined text-6xl text-yellow-400">group_add</span>
                    </div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">New Registrations</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-white">482</h3>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                        <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">trending_down</span> -2.4%
                        </span>
                        <span className="text-slate-500 text-xs">vs last period</span>
                    </div>
                </div>
                <div className="bg-[#1E293B] border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-white/5 transition-all shadow-xl">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-symbols-outlined text-6xl text-purple-400">domain</span>
                    </div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Active Agencies</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-white">64</h3>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                        <span className="bg-[#34D399]/20 text-[#34D399] text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">add</span> 3 new
                        </span>
                        <span className="text-slate-500 text-xs">this week</span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Trends Chart */}
                <div className="lg:col-span-2 bg-[#1E293B] border border-white/5 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-white font-semibold text-lg">Collection Trends</h3>
                            <p className="text-slate-400 text-xs">Daily waste collection volume across all zones</p>
                        </div>
                        <button className="text-[#34D399] text-sm font-medium hover:underline flex items-center gap-1 bg-transparent border-none cursor-pointer">
                            View Detailed Report <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </button>
                    </div>
                    <div className="h-64 w-full relative pt-4">
                        <div className="absolute left-0 top-0 bottom-8 w-8 flex flex-col justify-between text-xs text-slate-500 text-right pr-2">
                            <span>4k</span>
                            <span>3k</span>
                            <span>2k</span>
                            <span>1k</span>
                            <span>0</span>
                        </div>
                        <div className="absolute left-10 top-0 bottom-8 right-0 border-l border-b border-white/5" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                                <defs>
                                    <linearGradient id="gradient" x1="0%" x2="0%" y1="0%" y2="100%">
                                        <stop offset="0%" style={{ stopColor: '#34D399', stopOpacity: 0.2 }}></stop>
                                        <stop offset="100%" style={{ stopColor: '#34D399', stopOpacity: 0 }}></stop>
                                    </linearGradient>
                                </defs>
                                <path d="M0,80 C10,75 20,60 30,65 C40,70 50,40 60,35 C70,30 80,45 90,20 L100,10 L100,100 L0,100 Z" fill="url(#gradient)"></path>
                                <path d="M0,80 C10,75 20,60 30,65 C40,70 50,40 60,35 C70,30 80,45 90,20 L100,10" fill="none" stroke="#34D399" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                                <circle cx="30" cy="65" fill="#0B1120" r="1.5" stroke="#34D399" strokeWidth="1" vectorEffect="non-scaling-stroke"></circle>
                                <circle cx="60" cy="35" fill="#0B1120" r="1.5" stroke="#34D399" strokeWidth="1" vectorEffect="non-scaling-stroke"></circle>
                                <circle cx="90" cy="20" fill="#0B1120" r="1.5" stroke="#34D399" strokeWidth="1" vectorEffect="non-scaling-stroke"></circle>
                            </svg>
                            <div className="absolute top-[20%] right-[10%] bg-[#0B1116] border border-white/5 px-3 py-1.5 rounded-lg shadow-xl">
                                <p className="text-xs text-slate-400 mb-0.5">Oct 24</p>
                                <p className="text-sm font-bold text-white">3,240 kg</p>
                            </div>
                        </div>
                        <div className="absolute left-10 bottom-0 right-0 h-6 flex justify-between text-xs text-slate-500 pt-2">
                            <span>Mon</span>
                            <span>Tue</span>
                            <span>Wed</span>
                            <span>Thu</span>
                            <span>Fri</span>
                            <span>Sat</span>
                            <span>Sun</span>
                        </div>
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="bg-[#1E293B] border border-white/5 rounded-2xl p-6 flex flex-col shadow-xl">
                    <h3 className="text-white font-semibold text-lg mb-1">Waste Composition</h3>
                    <p className="text-slate-400 text-xs mb-6">Distribution by category</p>
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="relative size-48 rounded-full mb-6" style={{ background: 'conic-gradient(#34D399 0% 45%, #3b82f6 45% 75%, #eab308 75% 90%, #ef4444 90% 100%)' }}>
                            <div className="absolute inset-4 bg-[#1E293B] rounded-full flex flex-col items-center justify-center">
                                <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">Total</span>
                                <span className="text-2xl font-bold text-white">100%</span>
                            </div>
                        </div>
                        <div className="w-full space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="size-3 rounded-full bg-[#34D399]"></span>
                                    <span className="text-white">Electronics</span>
                                </div>
                                <span className="text-slate-400 font-medium">45%</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="size-3 rounded-full bg-blue-500"></span>
                                    <span className="text-white">Large Appliances</span>
                                </div>
                                <span className="text-slate-400 font-medium">30%</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="size-3 rounded-full bg-yellow-500"></span>
                                    <span className="text-white">Batteries</span>
                                </div>
                                <span className="text-slate-400 font-medium">15%</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="size-3 rounded-full bg-red-500"></span>
                                    <span className="text-white">Hazardous</span>
                                </div>
                                <span className="text-slate-400 font-medium">10%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminReports;