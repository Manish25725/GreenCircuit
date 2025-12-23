import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { api, getCurrentUser, Reward } from '../services/api';

const Rewards = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All Rewards');
  const [user, setUser] = useState(getCurrentUser());
  const categories = ['All Rewards', 'Gift Cards', 'Donations', 'Lifestyle', 'Electronics'];

  useEffect(() => {
    loadRewards();
    loadUserData();
  }, [selectedCategory]);

  const loadRewards = async () => {
    setLoading(true);
    try {
      const result = await api.getRewards(selectedCategory === 'All Rewards' ? undefined : selectedCategory);
      setRewards(result.rewards || []);
    } catch (error) {
      console.error('Failed to load rewards:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async () => {
    try {
      const userData = await api.getMe();
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user data');
    }
  };

  const handleRedeem = async (rewardId: string, pointsCost: number) => {
    if ((user?.ecoPoints || 0) < pointsCost) {
      alert('Not enough points!');
      return;
    }
    try {
      await api.redeemReward(rewardId);
      alert('Reward redeemed successfully!');
      loadUserData();
      loadRewards();
    } catch (error: any) {
      alert(error.message || 'Failed to redeem reward');
    }
  };

  const iconMap: Record<string, string> = {
    'Gift Cards': 'card_giftcard',
    'Donations': 'volunteer_activism',
    'Lifestyle': 'spa',
    'Electronics': 'devices',
    'Other': 'redeem'
  };

  const colorMap: Record<string, string> = {
    'Gift Cards': 'bg-orange-500',
    'Donations': 'bg-green-600',
    'Lifestyle': 'bg-purple-500',
    'Electronics': 'bg-blue-500',
    'Other': 'bg-gray-500'
  };

  return (
    <Layout title="" role="User" fullWidth hideSidebar>
      <div className="bg-[#0B1116] font-sans text-gray-200 antialiased selection:bg-[#10b981] selection:text-white min-h-screen flex flex-col relative overflow-hidden">
        
        {/* Background Ambient Blobs */}
        <div className="fixed top-0 left-0 w-full h-[500px] bg-[#10b981]/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
        <div className="fixed bottom-0 right-0 w-full h-[500px] bg-[#3b82f6]/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none"></div>

        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 transition-all duration-300">
            <div className="flex items-center gap-3 text-white cursor-pointer" onClick={() => window.location.hash = '#/dashboard'}>
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
                <button 
                  onClick={() => window.location.hash = '#/notifications'}
                  className="relative p-2.5 rounded-full bg-[#151F26] border border-white/5 text-[#3b82f6] hover:text-[#3b82f6] hover:bg-[#3b82f6]/10 transition-colors"
                >
                    <span className="absolute top-2.5 right-3 size-2 bg-red-500 rounded-full border-2 border-[#151F26]"></span>
                    <span className="material-symbols-outlined text-[20px]">notifications</span>
                </button>
            </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-10 mt-20 relative z-10">
          {/* Back Button */}
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-[#10b981] hover:text-[#059669] transition-colors mb-6 group w-fit"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>

          <div className="mb-8">
             <h1 className="text-3xl font-bold text-white mb-2">Rewards Marketplace</h1>
             <p className="text-[#94a3b8]">Redeem your Eco Points for exciting rewards.</p>
          </div>

          {/* Balance Card */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-700 rounded-2xl p-8 mb-8 text-white flex flex-col md:flex-row justify-between items-center shadow-lg shadow-green-900/20">
            <div>
              <h2 className="text-sm font-medium opacity-90 mb-1">Available Balance</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black tracking-tight">{(user?.ecoPoints || 0).toLocaleString()}</span>
                <span className="text-xl font-medium">Points</span>
              </div>
            </div>
            <div className="mt-6 md:mt-0 flex gap-4">
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-xl font-bold transition-all border border-white/10 cursor-pointer">
                 History
              </button>
              <button onClick={() => window.location.hash = '#/search'} className="bg-white text-green-800 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-gray-100 transition-all cursor-pointer">
                 Earn More
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat 
                    ? 'bg-[#10b981] text-white' 
                    : 'bg-[#151F26] border border-white/10 text-[#94a3b8] hover:text-white hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
             {loading ? (
               <div className="col-span-4 flex items-center justify-center py-12">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#10b981]"></div>
               </div>
             ) : rewards.length === 0 ? (
               <div className="col-span-4 text-center py-12 text-gray-500">
                 <span className="material-symbols-outlined text-4xl mb-2">redeem</span>
                 <p>No rewards available</p>
               </div>
             ) : (
               rewards.map((reward) => (
                 <div key={reward._id} className="bg-[#151F26] border border-white/5 rounded-xl overflow-hidden hover:border-[#10b981]/50 transition-colors group flex flex-col">
                    <div className={`h-32 ${reward.color || colorMap[reward.category] || 'bg-gray-500'} flex items-center justify-center text-white/90`}>
                       <span className="material-symbols-outlined text-6xl group-hover:scale-110 transition-transform">
                         {reward.icon || iconMap[reward.category] || 'redeem'}
                       </span>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                       <h3 className="font-bold text-white text-lg mb-1">{reward.title}</h3>
                       <p className="text-gray-400 text-sm mb-2 line-clamp-2">{reward.description}</p>
                       <p className="text-[#10b981] font-bold text-sm mb-4">{reward.pointsCost.toLocaleString()} Points</p>
                       <button 
                         onClick={() => handleRedeem(reward._id, reward.pointsCost)}
                         disabled={(user?.ecoPoints || 0) < reward.pointsCost}
                         className={`w-full mt-auto py-2 rounded-lg font-medium transition-colors border cursor-pointer ${
                           (user?.ecoPoints || 0) >= reward.pointsCost
                             ? 'bg-white/5 text-white hover:bg-[#10b981] hover:text-white border-white/10 hover:border-transparent'
                             : 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed'
                         }`}
                       >
                          {(user?.ecoPoints || 0) >= reward.pointsCost ? 'Redeem' : 'Not enough points'}
                       </button>
                    </div>
                 </div>
               ))
             )}
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default Rewards;