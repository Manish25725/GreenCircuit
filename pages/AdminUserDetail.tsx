import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import Layout from '../components/Layout';
import Loader from '../components/Loader';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  ecoPoints?: number;
  totalWasteRecycled?: number;
  totalPickups?: number;
  createdAt: string;
  isVerified?: boolean;
  suspended?: boolean;
  suspendedAt?: string;
  suspendedReason?: string;
  phone?: string;
  address?: any;
}

const AdminUserDetail = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');
  const [messageTitle, setMessageTitle] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [messagePriority, setMessagePriority] = useState<'normal' | 'high'>('normal');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const userId = window.location.hash.split('/').pop();
    if (userId) fetchUserDetails(userId);
  }, []);

  const fetchUserDetails = async (userId: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/users/${userId}`);
      setUser(response.data?.data?.user || response.data?.user);
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      setErrorMessage('Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async () => {
    if (!user || !suspendReason.trim()) {
      setErrorMessage('Please provide a reason for suspension');
      return;
    }

    try {
      setActionLoading(true);
      await api.post(`/admin/users/${user._id}/suspend`, { reason: suspendReason });
      setSuccessMessage('User suspended successfully');
      setShowSuspendModal(false);
      setSuspendReason('');
      // Refresh user data
      fetchUserDetails(user._id);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Failed to suspend user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnsuspend = async () => {
    if (!user) return;

    try {
      setActionLoading(true);
      await api.post(`/admin/users/${user._id}/unsuspend`);
      setSuccessMessage('User account restored successfully');
      fetchUserDetails(user._id);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Failed to unsuspend user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!user || !messageTitle.trim() || !messageContent.trim()) {
      setErrorMessage('Please fill in all message fields');
      return;
    }

    try {
      setActionLoading(true);
      await api.post(`/admin/users/${user._id}/message`, {
        title: messageTitle,
        message: messageContent,
        priority: messagePriority
      });
      setSuccessMessage('Message sent successfully');
      setShowMessageModal(false);
      setMessageTitle('');
      setMessageContent('');
      setMessagePriority('normal');
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Failed to send message');
    } finally {
      setActionLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      user: 'bg-green-500/20 text-green-400 border-green-500/30',
      business: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      agency: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      admin: 'bg-pink-500/20 text-pink-400 border-pink-500/30'
    };
    return styles[role as keyof typeof styles] || styles.user;
  };

  if (loading) {
    return (
      <Layout title="" role="Admin" fullWidth hideSidebar>
        <div className="flex items-center justify-center min-h-screen">
          <Loader size="lg" color="#ec4899" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout title="" role="Admin" fullWidth hideSidebar>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <span className="material-symbols-outlined text-6xl text-gray-600 mb-4 block">person_off</span>
            <p className="text-slate-400">User not found</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="" role="Admin" fullWidth hideSidebar>
      <div className="bg-gradient-to-br from-[#1a0b1e] via-[#0B1116] to-[#1a0b1e] min-h-screen">
        <div className="fixed top-0 left-0 w-full h-[500px] bg-pink-500/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
        
        {/* Success/Error Messages */}
        {successMessage && (
          <div className="fixed top-4 right-4 z-50 bg-green-500/20 border border-green-500/30 text-green-400 px-6 py-3 rounded-xl backdrop-blur-xl flex items-center gap-2 animate-fade-in">
            <span className="material-symbols-outlined">check_circle</span>
            {successMessage}
            <button onClick={() => setSuccessMessage('')} className="ml-2">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        )}
        
        {errorMessage && (
          <div className="fixed top-4 right-4 z-50 bg-red-500/20 border border-red-500/30 text-red-400 px-6 py-3 rounded-xl backdrop-blur-xl flex items-center gap-2 animate-fade-in">
            <span className="material-symbols-outlined">error</span>
            {errorMessage}
            <button onClick={() => setErrorMessage('')} className="ml-2">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => window.location.hash = '#/admin/users'}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-pink-400">arrow_back</span>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white">User Details</h1>
                <p className="text-slate-400 mt-1">View and manage user account</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowMessageModal(true)}
                className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined">mail</span>
                Send Message
              </button>
              
              {user.suspended ? (
                <button
                  onClick={handleUnsuspend}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">check_circle</span>
                  Restore Account
                </button>
              ) : (
                <button
                  onClick={() => setShowSuspendModal(true)}
                  className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">block</span>
                  Suspend User
                </button>
              )}
            </div>
          </div>

          {/* User Info Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Profile Card */}
            <div className="lg:col-span-1 bg-[#15202e]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
                <p className="text-slate-400 text-sm mb-3">{user.email}</p>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium border ${getRoleBadge(user.role)}`}>
                  {user.role.toUpperCase()}
                </span>
                
                {user.suspended && (
                  <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                    <div className="flex items-center gap-2 text-red-400 text-sm font-medium mb-1">
                      <span className="material-symbols-outlined text-lg">block</span>
                      Account Suspended
                    </div>
                    {user.suspendedReason && (
                      <p className="text-xs text-slate-400 mt-1">{user.suspendedReason}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Stats Card */}
            <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-[#15202e]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5">
                <span className="material-symbols-outlined text-3xl text-green-400 mb-2 block">eco</span>
                <p className="text-2xl font-bold text-white">{user.ecoPoints || 0}</p>
                <p className="text-sm text-slate-400">Eco Points</p>
              </div>
              
              <div className="bg-[#15202e]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5">
                <span className="material-symbols-outlined text-3xl text-blue-400 mb-2 block">recycling</span>
                <p className="text-2xl font-bold text-white">{user.totalWasteRecycled || 0} kg</p>
                <p className="text-sm text-slate-400">Waste Recycled</p>
              </div>
              
              <div className="bg-[#15202e]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5">
                <span className="material-symbols-outlined text-3xl text-purple-400 mb-2 block">local_shipping</span>
                <p className="text-2xl font-bold text-white">{user.totalPickups || 0}</p>
                <p className="text-sm text-slate-400">Total Pickups</p>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="bg-[#15202e]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-pink-400">info</span>
              Account Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-slate-400 block mb-1">User ID</label>
                <p className="text-white font-mono text-sm">{user._id}</p>
              </div>
              
              <div>
                <label className="text-sm text-slate-400 block mb-1">Member Since</label>
                <p className="text-white">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
              
              {user.phone && (
                <div>
                  <label className="text-sm text-slate-400 block mb-1">Phone</label>
                  <p className="text-white">{user.phone}</p>
                </div>
              )}
              
              <div>
                <label className="text-sm text-slate-400 block mb-1">Verification Status</label>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-sm ${user.isVerified ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                  {user.isVerified ? 'Verified' : 'Unverified'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Suspend Modal */}
        {showSuspendModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#15202e] rounded-2xl p-6 border border-white/5 max-w-md w-full">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-red-400">block</span>
                Suspend User Account
              </h3>
              
              <div className="mb-4">
                <label className="text-sm text-slate-400 block mb-2">Reason for Suspension *</label>
                <textarea
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  placeholder="Enter the reason for suspending this account..."
                  className="w-full px-4 py-3 bg-[#0f1729] border border-white/5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 resize-none"
                  rows={4}
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSuspendModal(false)}
                  className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-white hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSuspend}
                  disabled={actionLoading || !suspendReason.trim()}
                  className="flex-1 px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all disabled:opacity-50"
                >
                  {actionLoading ? 'Suspending...' : 'Suspend User'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Message Modal */}
        {showMessageModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#15202e] rounded-2xl p-6 border border-white/5 max-w-md w-full">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-400">mail</span>
                Send Message to User
              </h3>
              
              <div className="space-y-4 mb-4">
                <div>
                  <label className="text-sm text-slate-400 block mb-2">Message Title *</label>
                  <input
                    type="text"
                    value={messageTitle}
                    onChange={(e) => setMessageTitle(e.target.value)}
                    placeholder="Enter message title..."
                    className="w-full px-4 py-2 bg-[#0f1729] border border-white/5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-slate-400 block mb-2">Message Content *</label>
                  <textarea
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Enter your message..."
                    className="w-full px-4 py-3 bg-[#0f1729] border border-white/5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 resize-none"
                    rows={4}
                  />
                </div>
                
                <div>
                  <label className="text-sm text-slate-400 block mb-2">Priority</label>
                  <select
                    value={messagePriority}
                    onChange={(e) => setMessagePriority(e.target.value as 'normal' | 'high')}
                    className="w-full px-4 py-2 bg-[#0f1729] border border-white/5 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-white hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={actionLoading || !messageTitle.trim() || !messageContent.trim()}
                  className="flex-1 px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition-all disabled:opacity-50"
                >
                  {actionLoading ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminUserDetail;
