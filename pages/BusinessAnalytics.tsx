import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getCurrentUser } from '../services/api';

interface AnalyticsData {
  summary: {
    totalWasteProcessed: number;
    co2Saved: number;
    treesEquivalent: number;
    totalBookings: number;
    complianceScore: number;
  };
  wasteByCategory: Array<{ _id: string; totalWeight: number; count: number }>;
  monthlyTrends: Array<{ _id: string; totalWeight: number; bookings: number; co2Saved: number }>;
  topAgencies: Array<{ _id: string; bookings: number; totalWeight: number; agency: { name: string; logo?: string; rating?: number } }>;
  recentBookings?: Array<any>;
}

const API_BASE = 'http://localhost:3001/api';

const BusinessAnalytics = () => {
  const user = getCurrentUser();
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.hash = '#/login';
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  useEffect(() => {
    fetchAnalytics();
    fetchRecentActivity();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/business/analytics?period=${timeRange}`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const res = await fetch(`${API_BASE}/business/bookings?limit=5`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success) {
        const bookings = data.data?.bookings || [];
        const activities = bookings.map((b: any) => {
          let action = 'Pickup Scheduled';
          let icon = 'local_shipping';
          let color = 'text-[#8b5cf6]';
          
          if (b.status === 'completed') {
            action = 'Disposal Completed';
            icon = 'check_circle';
            color = 'text-[#10b981]';
          } else if (b.status === 'confirmed') {
            action = 'Pickup Confirmed';
            icon = 'verified';
            color = 'text-[#06b6d4]';
          } else if (b.status === 'in-progress') {
            action = 'Pickup In Progress';
            icon = 'sync';
            color = 'text-amber-400';
          } else if (b.status === 'cancelled') {
            action = 'Pickup Cancelled';
            icon = 'cancel';
            color = 'text-red-400';
          }
          
          const detail = `${b.totalWeight?.toFixed(1) || 0} kg • ${b.agencyId?.name || 'Agency'}`;
          const time = getRelativeTime(b.createdAt);
          
          return { action, detail, time, icon, color };
        });
        setRecentActivity(activities);
      }
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const getMonthName = (monthStr: string) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthNum = parseInt(monthStr.split('-')[1]) - 1;
    return months[monthNum] || monthStr;
  };

  // Process monthly data from API
  const monthlyData = analytics?.monthlyTrends?.length ? analytics.monthlyTrends.map(t => ({
    month: getMonthName(t._id),
    disposed: Math.round(t.totalWeight),
    target: 200
  })) : [];

  const categoryColors: Record<string, string> = {
    'IT Equipment': '#06b6d4',
    'Batteries': '#f59e0b',
    'Monitors': '#8b5cf6',
    'Cables': '#10b981',
    'Cables & Wiring': '#10b981',
    'Mobile Devices': '#ec4899',
    'Appliances': '#3b82f6',
    'Other': '#64748b'
  };

  const totalCategoryWeight = analytics?.wasteByCategory?.reduce((sum, c) => sum + c.totalWeight, 0) || 0;
  const categoryData = analytics?.wasteByCategory?.length ? analytics.wasteByCategory.map(c => ({
    name: c._id || 'Other',
    value: totalCategoryWeight > 0 ? Math.round((c.totalWeight / totalCategoryWeight) * 100) : 0,
    weight: c.totalWeight,
    count: c.count,
    color: categoryColors[c._id] || '#64748b'
  })) : [];

  const maxValue = Math.max(...monthlyData.map(d => d.disposed), 200);
  
  // Use API data
  const totalDisposed = analytics?.summary?.totalWasteProcessed || 0;
  const co2Saved = analytics?.summary?.co2Saved || 0;
  const treesEquivalent = analytics?.summary?.treesEquivalent || 0;
  const totalBookings = analytics?.summary?.totalBookings || 0;
  const complianceScore = analytics?.summary?.complianceScore || 0;
  const costSavings = Math.round(totalDisposed * 15); // ₹15 per kg estimate
  const waterConserved = Math.round(totalDisposed * 8.7); // ~8.7L per kg e-waste
  const energySaved = Math.round(totalDisposed * 5.7); // ~5.7 kWh per kg

  // Default activity if none from API
  const displayActivity = recentActivity.length > 0 ? recentActivity : [
    { action: 'No recent activity', detail: 'Schedule a pickup to get started', time: '', icon: 'info', color: 'text-gray-400' }
  ];

  return (
    <Layout title="" role="Business" fullWidth hideSidebar>
      <div className="bg-[#0B1116] font-sans text-gray-200 antialiased selection:bg-[#06b6d4] selection:text-white min-h-screen">
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
          <div className="fixed top-0 left-0 w-full h-[500px] bg-amber-500/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
          <div className="fixed bottom-0 right-0 w-full h-[500px] bg-[#06b6d4]/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none"></div>
          
          <div className="layout-container flex h-full grow flex-col relative z-10">
            {/* Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50">
              <div className="flex items-center gap-3 text-white cursor-pointer" onClick={() => window.location.hash = '#/'}>
                <div className="p-2 bg-[#06b6d4]/10 rounded-lg">
                  <svg className="h-6 w-6 text-[#06b6d4]" fill="currentColor" viewBox="0 0 48 48">
                    <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"></path>
                  </svg>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white">EcoCycle <span className="text-[#06b6d4]">Business</span></h2>
              </div>
              <nav className="hidden md:flex flex-1 justify-center gap-1">
              </nav>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => window.location.hash = '#/profile'}
                  className="hidden sm:flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-[#151F26] border border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"
                >
                  <div className="size-8 rounded-full bg-[#06b6d4] flex items-center justify-center ring-2 ring-white/10 group-hover:ring-[#06b6d4]/50 transition-all text-white font-bold text-sm">
                    {user?.name?.charAt(0) || 'B'}
                  </div>
                  <span className="text-sm font-medium text-gray-200">{user?.name || 'Business'}</span>
                </button>
                <button onClick={handleLogout} className="p-2.5 rounded-full bg-[#151F26] border border-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Logout">
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                </button>
              </div>
            </header>

            <main className="flex flex-1 justify-center py-5 mt-24">
              <div className="layout-content-container flex flex-col w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                
                {/* Page Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 py-8">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <button onClick={() => window.location.hash = '#/business'} className="text-[#94a3b8] hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                      </button>
                      <p className="text-amber-400 text-sm font-bold uppercase tracking-widest">Analytics & Reports</p>
                    </div>
                    <h1 className="text-white text-3xl sm:text-4xl font-black leading-tight tracking-tighter mb-2">Business Analytics</h1>
                    <p className="text-[#94a3b8] text-base">Track your environmental impact and disposal metrics.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <select 
                      value={timeRange}
                      onChange={(e) => setTimeRange(e.target.value)}
                      className="bg-[#151F26] border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none cursor-pointer"
                    >
                      <option value="7d">Last 7 Days</option>
                      <option value="30d">Last 30 Days</option>
                      <option value="90d">Last Quarter</option>
                      <option value="1y">This Year</option>
                    </select>
                    <button 
                      onClick={() => window.open(`${API_BASE}/business/reports/export?period=${timeRange}`, '_blank')}
                      className="bg-[#06b6d4] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#0891b2] transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-lg">download</span>
                      Export
                    </button>
                  </div>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                      <div className="animate-spin w-12 h-12 border-4 border-[#06b6d4] border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-gray-400">Loading analytics...</p>
                    </div>
                  </div>
                ) : (
                  <>
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-[#151F26] rounded-2xl p-6 border border-white/5 relative overflow-hidden group hover:border-[#06b6d4]/20 transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#06b6d4]/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div className="p-3 bg-[#06b6d4]/10 rounded-xl text-[#06b6d4]">
                        <span className="material-symbols-outlined">scale</span>
                      </div>
                      {totalDisposed > 0 && (
                      <span className="text-xs font-bold text-[#06b6d4] bg-[#06b6d4]/10 px-2 py-1 rounded-full flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">check</span>
                        Active
                      </span>
                      )}
                    </div>
                    <h3 className="text-3xl font-black text-white relative z-10">{totalDisposed.toLocaleString()} <span className="text-lg font-medium text-gray-500">kg</span></h3>
                    <p className="text-sm text-[#94a3b8] relative z-10">Total Disposed</p>
                  </div>
                  
                  <div className="bg-[#151F26] rounded-2xl p-6 border border-white/5 relative overflow-hidden group hover:border-[#10b981]/20 transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#10b981]/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div className="p-3 bg-[#10b981]/10 rounded-xl text-[#10b981]">
                        <span className="material-symbols-outlined">forest</span>
                      </div>
                      <span className="text-xs font-bold text-[#10b981] bg-[#10b981]/10 px-2 py-1 rounded-full">Offset</span>
                    </div>
                    <h3 className="text-3xl font-black text-white relative z-10">{Math.round(co2Saved).toLocaleString()} <span className="text-lg font-medium text-gray-500">kg</span></h3>
                    <p className="text-sm text-[#94a3b8] relative z-10">CO₂ Saved</p>
                  </div>
                  
                  <div className="bg-[#151F26] rounded-2xl p-6 border border-white/5 relative overflow-hidden group hover:border-[#8b5cf6]/20 transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#8b5cf6]/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div className="p-3 bg-[#8b5cf6]/10 rounded-xl text-[#8b5cf6]">
                        <span className="material-symbols-outlined">recycling</span>
                      </div>
                      <span className="text-xs font-bold text-[#8b5cf6] bg-[#8b5cf6]/10 px-2 py-1 rounded-full">Rate</span>
                    </div>
                    <h3 className="text-3xl font-black text-white relative z-10">{complianceScore.toFixed(1)} <span className="text-lg font-medium text-gray-500">%</span></h3>
                    <p className="text-sm text-[#94a3b8] relative z-10">Compliance Score</p>
                  </div>
                  
                  <div className="bg-[#151F26] rounded-2xl p-6 border border-white/5 relative overflow-hidden group hover:border-amber-500/20 transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
                        <span className="material-symbols-outlined">savings</span>
                      </div>
                      <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full">Savings</span>
                    </div>
                    <h3 className="text-3xl font-black text-white relative z-10">₹{costSavings.toLocaleString()}</h3>
                    <p className="text-sm text-[#94a3b8] relative z-10">Cost Savings</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                  {/* Disposal Trends Chart */}
                  <div className="lg:col-span-2 bg-[#151F26] rounded-2xl p-6 border border-white/5">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-bold text-white">Disposal Trends</h3>
                        <p className="text-sm text-gray-500">Monthly e-waste disposal vs target</p>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-[#06b6d4]"></div>
                          <span className="text-gray-400">Disposed</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-gray-600 border-2 border-dashed border-gray-400"></div>
                          <span className="text-gray-400">Target</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Simple Bar Chart */}
                    {monthlyData.length > 0 ? (
                      <div className="h-64 flex items-end justify-between gap-4 px-4">
                        {monthlyData.map((data, idx) => (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full relative" style={{ height: '200px' }}>
                              {/* Target line */}
                              <div 
                                className="absolute w-full border-t-2 border-dashed border-gray-600"
                                style={{ bottom: `${(data.target / maxValue) * 100}%` }}
                              ></div>
                              {/* Bar */}
                              <div 
                                className="absolute bottom-0 w-full bg-gradient-to-t from-[#06b6d4] to-[#06b6d4]/50 rounded-t-lg transition-all hover:from-[#06b6d4] hover:to-[#06b6d4]/70"
                                style={{ height: `${(data.disposed / maxValue) * 100}%` }}
                              >
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-white opacity-0 hover:opacity-100 transition-opacity">
                                  {data.disposed}
                                </div>
                              </div>
                            </div>
                            <span className="text-xs text-gray-500 font-medium">{data.month}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-64 flex items-center justify-center">
                        <div className="text-center">
                          <span className="material-symbols-outlined text-4xl text-gray-600 mb-2">bar_chart</span>
                          <p className="text-gray-500">No disposal data yet</p>
                          <p className="text-gray-600 text-sm">Complete pickups to see trends</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Category Breakdown */}
                  <div className="bg-[#151F26] rounded-2xl p-6 border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-6">By Category</h3>
                    {categoryData.length > 0 ? (
                      <div className="space-y-4">
                        {categoryData.map((cat, idx) => (
                          <div key={idx} className="group">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{cat.name}</span>
                              <span className="text-sm font-bold text-white">{cat.value}%</span>
                            </div>
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full transition-all group-hover:opacity-80"
                                style={{ width: `${cat.value}%`, backgroundColor: cat.color }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <span className="material-symbols-outlined text-3xl text-gray-600 mb-2">pie_chart</span>
                        <p className="text-gray-500">No category data</p>
                      </div>
                    )}
                    
                    {/* Total */}
                    <div className="mt-6 pt-6 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">Total Disposed</span>
                        <span className="text-2xl font-black text-white">{totalDisposed.toLocaleString()} <span className="text-sm font-medium text-gray-500">kg</span></span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-gray-400 text-sm">Total Bookings</span>
                        <span className="text-lg font-bold text-[#06b6d4]">{totalBookings}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity & Environmental Impact */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent Activity */}
                  <div className="bg-[#151F26] rounded-2xl p-6 border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                      <span className="material-symbols-outlined text-gray-500">history</span>
                      Recent Activity
                    </h3>
                    <div className="space-y-4">
                      {displayActivity.map((activity, idx) => (
                        <div key={idx} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                          <div className={`p-2 rounded-lg bg-white/5 ${activity.color} group-hover:scale-110 transition-transform`}>
                            <span className="material-symbols-outlined text-xl">{activity.icon}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-medium">{activity.action}</p>
                            <p className="text-gray-500 text-sm">{activity.detail}</p>
                          </div>
                          <span className="text-gray-600 text-xs">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Environmental Impact Card */}
                  <div className="bg-gradient-to-br from-[#151F26] to-[#0B1116] rounded-2xl p-6 border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#10b981]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                    
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                      <span className="material-symbols-outlined text-[#10b981]">eco</span>
                      Environmental Impact
                    </h3>
                    
                    <div className="space-y-6 relative z-10">
                      <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                        <div className="p-3 bg-[#10b981]/10 rounded-xl">
                          <span className="material-symbols-outlined text-[#10b981] text-2xl">forest</span>
                        </div>
                        <div>
                          <p className="text-3xl font-black text-white">{treesEquivalent.toLocaleString()}</p>
                          <p className="text-sm text-gray-400">Trees Equivalent Saved</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                        <div className="p-3 bg-[#06b6d4]/10 rounded-xl">
                          <span className="material-symbols-outlined text-[#06b6d4] text-2xl">water_drop</span>
                        </div>
                        <div>
                          <p className="text-3xl font-black text-white">{waterConserved.toLocaleString()} <span className="text-lg font-medium text-gray-500">L</span></p>
                          <p className="text-sm text-gray-400">Water Conserved</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                        <div className="p-3 bg-amber-500/10 rounded-xl">
                          <span className="material-symbols-outlined text-amber-400 text-2xl">bolt</span>
                        </div>
                        <div>
                          <p className="text-3xl font-black text-white">{energySaved.toLocaleString()} <span className="text-lg font-medium text-gray-500">kWh</span></p>
                          <p className="text-sm text-gray-400">Energy Saved</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                  </>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BusinessAnalytics;
