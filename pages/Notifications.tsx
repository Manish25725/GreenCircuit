import React from 'react';
import Layout from '../components/Layout';
import ProfileHeader from '../components/ProfileHeader';
import ProfileSidebar from '../components/ProfileSidebar';

const Notifications = () => {
  return (
    <Layout title="" role="User" fullWidth hideSidebar>
      <div className="bg-[#0B1116] font-sans text-gray-200 antialiased selection:bg-[#10b981] selection:text-white min-h-screen flex flex-col relative overflow-hidden">
        
        {/* Background Ambient Blobs */}
        <div className="fixed top-0 left-0 w-full h-[500px] bg-[#10b981]/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
        <div className="fixed bottom-0 right-0 w-full h-[500px] bg-[#3b82f6]/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none"></div>

        <ProfileHeader />

        {/* Main Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-10 mt-20 relative z-10">
            <div className="flex flex-col md:flex-row gap-8">
            <ProfileSidebar activePage="notifications" />
            <div className="flex-1">
                <div className="flex flex-col gap-8">
                <div className="bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5">
                    <div className="flex flex-col gap-8">
                    <div className="flex flex-wrap justify-between gap-3">
                        <div className="flex flex-col gap-1">
                        <p className="text-white text-2xl font-bold leading-tight tracking-[-0.033em]">Notification Preferences</p>
                        <p className="text-[#94a3b8] text-base font-normal leading-normal">Choose which notifications you want to receive and how you get them.</p>
                        </div>
                    </div>
                    <form className="flex flex-col gap-10" onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <h3 className="text-white text-lg font-semibold leading-normal pb-4 border-b border-white/10 mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#10b981]">local_shipping</span>
                                Booking & Pickups
                            </h3>
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-row items-center justify-between gap-4">
                                    <div className="flex flex-col gap-1 pr-4">
                                        <p className="text-white text-base font-medium leading-normal">Pickup Reminders</p>
                                        <p className="text-[#94a3b8] text-sm font-normal leading-normal">Receive alerts 1 hour before your scheduled e-waste collection.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                                        <input defaultChecked className="sr-only peer" type="checkbox" />
                                        <div className="w-11 h-6 bg-[#0B1116] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10b981] border border-white/10"></div>
                                    </label>
                                </div>
                                <div className="flex flex-row items-center justify-between gap-4">
                                    <div className="flex flex-col gap-1 pr-4">
                                        <p className="text-white text-base font-medium leading-normal">Status Updates</p>
                                        <p className="text-[#94a3b8] text-sm font-normal leading-normal">Get real-time updates when your items are processed or recycled.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                                        <input defaultChecked className="sr-only peer" type="checkbox" />
                                        <div className="w-11 h-6 bg-[#0B1116] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10b981] border border-white/10"></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-white text-lg font-semibold leading-normal pb-4 border-b border-white/10 mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#10b981]">savings</span>
                                Rewards & Offers
                            </h3>
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-row items-center justify-between gap-4">
                                    <div className="flex flex-col gap-1 pr-4">
                                        <p className="text-white text-base font-medium leading-normal">Reward Points Earned</p>
                                        <p className="text-[#94a3b8] text-sm font-normal leading-normal">Instant notification when EcoPoints are added to your wallet.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                                        <input defaultChecked className="sr-only peer" type="checkbox" />
                                        <div className="w-11 h-6 bg-[#0B1116] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10b981] border border-white/10"></div>
                                    </label>
                                </div>
                                <div className="flex flex-row items-center justify-between gap-4">
                                    <div className="flex flex-col gap-1 pr-4">
                                        <p className="text-white text-base font-medium leading-normal">New Offers & Promotions</p>
                                        <p className="text-[#94a3b8] text-sm font-normal leading-normal">Be the first to know about partner deals and seasonal recycling events.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                                        <input className="sr-only peer" type="checkbox" />
                                        <div className="w-11 h-6 bg-[#0B1116] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10b981] border border-white/10"></div>
                                    </label>
                                </div>
                                <div className="flex flex-row items-center justify-between gap-4">
                                    <div className="flex flex-col gap-1 pr-4">
                                        <p className="text-white text-base font-medium leading-normal">Sustainability Newsletter</p>
                                        <p className="text-[#94a3b8] text-sm font-normal leading-normal">Weekly tips on reducing e-waste and environmental impact reports.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                                        <input className="sr-only peer" type="checkbox" />
                                        <div className="w-11 h-6 bg-[#0B1116] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10b981] border border-white/10"></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-white/10">
                            <button className="text-[#94a3b8] text-sm font-medium hover:text-white transition-colors bg-transparent border-none cursor-pointer" type="button">
                                Reset to Defaults
                            </button>
                            <div className="flex gap-4">
                                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#0B1116] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-white/5 transition-colors border border-white/10" type="button">
                                    <span className="truncate">Cancel</span>
                                </button>
                                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#10b981] text-[#0B1116] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#059669] transition-opacity" type="submit">
                                    <span className="truncate">Save Changes</span>
                                </button>
                            </div>
                        </div>
                    </form>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </main>
      </div>
    </Layout>
  );
};

export default Notifications;