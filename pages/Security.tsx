import React from 'react';
import Layout from '../components/Layout';
import ProfileHeader from '../components/ProfileHeader';
import ProfileSidebar from '../components/ProfileSidebar';

const Security = () => {
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
            <ProfileSidebar activePage="security" />
            <div className="flex-1">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-white text-2xl font-bold leading-tight tracking-[-0.033em]">Security & Privacy</h2>
                        <p className="text-[#94a3b8] text-base font-normal leading-normal">Manage your password, login security, and privacy settings.</p>
                    </div>

                    {/* Change Password */}
                    <div className="bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-white text-lg font-bold leading-tight">Change Password</h3>
                                <p className="text-[#94a3b8] text-sm">Ensure your account is using a long, random password to stay secure.</p>
                            </div>
                            <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <label className="flex flex-col w-full">
                                        <span className="text-white text-sm font-medium leading-normal pb-2">Current Password</span>
                                        <input className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] transition-all" placeholder="Enter current password" type="password"/>
                                    </label>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <label className="flex flex-col w-full">
                                        <span className="text-white text-sm font-medium leading-normal pb-2">New Password</span>
                                        <input className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] transition-all" placeholder="Enter new password" type="password"/>
                                    </label>
                                    <label className="flex flex-col w-full">
                                        <span className="text-white text-sm font-medium leading-normal pb-2">Confirm New Password</span>
                                        <input className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] transition-all" placeholder="Confirm new password" type="password"/>
                                    </label>
                                </div>
                                <div className="flex justify-end pt-2">
                                    <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#10b981] text-[#0B1116] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#059669] transition-opacity" type="submit">
                                        Update Password
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* 2FA */}
                    <div className="bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                            <div className="flex flex-col gap-1 max-w-2xl">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#10b981]">security</span>
                                    <h3 className="text-white text-lg font-bold leading-tight">Two-Factor Authentication</h3>
                                </div>
                                <p className="text-[#94a3b8] text-sm">Add an extra layer of security to your account by requiring more than just a password to log in.</p>
                            </div>
                            <button className="flex whitespace-nowrap min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#0B1116] text-[#10b981] border border-white/10 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#10b981]/10 transition-colors">
                                Enable 2FA
                            </button>
                        </div>
                    </div>

                    {/* Privacy Controls */}
                    <div className="bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-white text-lg font-bold leading-tight">Privacy Controls</h3>
                                <p className="text-[#94a3b8] text-sm">Manage how your data is shared and used within the EcoCycle network.</p>
                            </div>
                            <div className="flex flex-col gap-4 divide-y divide-white/5">
                                <div className="flex items-center justify-between py-2">
                                    <div className="flex flex-col pr-4">
                                        <span className="text-white text-sm font-medium">Profile Visibility</span>
                                        <span className="text-[#94a3b8] text-xs">Allow verified recycling agencies to see your profile stats.</span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input defaultChecked className="sr-only peer" type="checkbox"/>
                                        <div className="w-11 h-6 bg-[#0B1116] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10b981] border border-white/10"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between py-2 pt-4">
                                    <div className="flex flex-col pr-4">
                                        <span className="text-white text-sm font-medium">Data Sharing for Research</span>
                                        <span className="text-[#94a3b8] text-xs">Contribute anonymized e-waste data for environmental research.</span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input className="sr-only peer" type="checkbox"/>
                                        <div className="w-11 h-6 bg-[#0B1116] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10b981] border border-white/10"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Active Sessions */}
                    <div className="bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-white text-lg font-bold leading-tight">Active Sessions</h3>
                                <p className="text-[#94a3b8] text-sm">Manage devices where you're currently logged in.</p>
                            </div>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between p-4 rounded-lg bg-[#0B1116] border border-white/5">
                                    <div className="flex items-center gap-4">
                                        <span className="material-symbols-outlined text-[#94a3b8]">laptop_mac</span>
                                        <div className="flex flex-col">
                                            <span className="text-white text-sm font-medium">MacBook Pro 16"</span>
                                            <span className="text-[#94a3b8] text-xs">San Francisco, CA • Active now</span>
                                        </div>
                                    </div>
                                    <span className="text-[#10b981] text-xs font-bold px-2 py-1 rounded bg-[#10b981]/10 border border-[#10b981]/20">Current Device</span>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-lg bg-[#0B1116]/50 border border-white/5">
                                    <div className="flex items-center gap-4">
                                        <span className="material-symbols-outlined text-[#94a3b8]">smartphone</span>
                                        <div className="flex flex-col">
                                            <span className="text-white text-sm font-medium">iPhone 13 Pro</span>
                                            <span className="text-[#94a3b8] text-xs">San Francisco, CA • 2 hours ago</span>
                                        </div>
                                    </div>
                                    <button className="text-[#94a3b8] hover:text-red-500 text-sm font-medium transition-colors bg-transparent border-none cursor-pointer">Revoke</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-[#151F26] p-6 md:p-8 rounded-xl border border-red-900/30">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-red-500 text-lg font-bold leading-tight">Danger Zone</h3>
                                <p className="text-[#94a3b8] text-sm">Irreversible actions for your account data.</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-2">
                                <div className="flex flex-col gap-1">
                                    <span className="text-white text-sm font-medium">Export Data</span>
                                    <span className="text-[#94a3b8] text-xs">Download a copy of your personal data.</span>
                                </div>
                                <button className="flex min-w-[120px] items-center justify-center rounded-lg h-9 px-4 bg-[#0B1116] text-white border border-white/10 text-sm font-medium hover:bg-white/5 transition-colors cursor-pointer">
                                    Export Data
                                </button>
                            </div>
                            <div className="w-full h-px bg-white/5"></div>
                            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                                <div className="flex flex-col gap-1">
                                    <span className="text-white text-sm font-medium">Delete Account</span>
                                    <span className="text-[#94a3b8] text-xs">Permanently delete your account and all associated data.</span>
                                </div>
                                <button className="flex min-w-[120px] items-center justify-center rounded-lg h-9 px-4 bg-red-500/10 text-red-500 border border-red-500/20 text-sm font-medium hover:bg-red-500/20 transition-colors cursor-pointer">
                                    Delete Account
                                </button>
                            </div>
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

export default Security;