import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import Layout from '../components/Layout';
import Loader from '../components/Loader';

interface Agency {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  licenseNumber?: string;
  servicesOffered?: string[];
  operatingHours?: string;
  isVerified: boolean;
  isApproved: boolean;
  suspended?: boolean;
  suspendedAt?: string;
  suspendedReason?: string;
  createdAt: string;
  totalPickups?: number;
  totalWasteProcessed?: number;
  rating?: number;
  completedBookings?: number;
}

const AdminAgencyDetail = () => {
  const [agency, setAgency] = useState<Agency | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [messageTitle, setMessageTitle] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [messagePriority, setMessagePriority] = useState<'normal' | 'high'>('normal');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const agencyId = window.location.hash.split('/').pop();
    if (agencyId) fetchAgencyDetails(agencyId);
  }, []);

  const fetchAgencyDetails = async (agencyId: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/agencies/${agencyId}`);
      setAgency(response.data?.data?.agency || response.data?.agency);
    } catch (error) {
      console.error('Failed to fetch agency details:', error);
      setErrorMessage('Failed to load agency details');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!agency) return;

    try {
      setActionLoading(true);
      await api.post(`/admin/agencies/${agency._id}/approve`);
      setSuccessMessage('Agency approved successfully');
      fetchAgencyDetails(agency._id);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Failed to approve agency');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!agency || !rejectReason.trim()) {
      setErrorMessage('Please provide a reason for rejection');
      return;
    }

    try {
      setActionLoading(true);
      await api.post(`/admin/agencies/${agency._id}/reject`, { reason: rejectReason });
      setSuccessMessage('Agency rejected');
      setShowRejectModal(false);
      setRejectReason('');
      fetchAgencyDetails(agency._id);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Failed to reject agency');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspend = async () => {
    if (!agency || !suspendReason.trim()) {
      setErrorMessage('Please provide a reason for suspension');
      return;
    }

    try {
      setActionLoading(true);
      await api.post(`/admin/agencies/${agency._id}/suspend`, { reason: suspendReason });
      setSuccessMessage('Agency suspended successfully');
      setShowSuspendModal(false);
      setSuspendReason('');
      fetchAgencyDetails(agency._id);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Failed to suspend agency');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnsuspend = async () => {
    if (!agency) return;

    try {
      setActionLoading(true);
      await api.post(`/admin/agencies/${agency._id}/unsuspend`);
      setSuccessMessage('Agency account restored successfully');
      fetchAgencyDetails(agency._id);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Failed to unsuspend agency');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!agency || !messageTitle.trim() || !messageContent.trim()) {
      setErrorMessage('Please fill in all message fields');
      return;
    }

    try {
      setActionLoading(true);
      await api.post(`/admin/agencies/${agency._id}/message`, {
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

  const getStatusBadge = () => {
    if (!agency) return null;
    
    if (agency.suspended) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium border bg-red-500/20 text-red-400 border-red-500/30">
          <span className="material-symbols-outlined text-base">block</span>
          Suspended
        </span>
      );
    }
    
    if (!agency.isApproved) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium border bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
          <span className="material-symbols-outlined text-base">pending</span>
          Pending Approval
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium border bg-green-500/20 text-green-400 border-green-500/30">
        <span className="material-symbols-outlined text-base">verified</span>
        Approved
      </span>
    );
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

  if (!agency) {
    return (
      <Layout title="" role="Admin" fullWidth hideSidebar>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <span className="material-symbols-outlined text-6xl text-gray-600 mb-4 block">business_center</span>
            <p className="text-gray-400">Agency not found</p>
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
                onClick={() => window.location.hash = '#/admin/agencies'}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-pink-400">arrow_back</span>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white">Agency Details</h1>
                <p className="text-gray-400 mt-1">View and manage agency account</p>
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
              
              {!agency.isApproved && !agency.suspended && (
                <>
                  <button
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined">check_circle</span>
                    Approve
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20 transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined">cancel</span>
                    Reject
                  </button>
                </>
              )}
              
              {agency.suspended ? (
                <button
                  onClick={handleUnsuspend}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">check_circle</span>
                  Restore Account
                </button>
              ) : agency.isApproved && (
                <button
                  onClick={() => setShowSuspendModal(true)}
                  className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">block</span>
                  Suspend Agency
                </button>
              )}
            </div>
          </div>

          {/* Agency Info Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Profile Card */}
            <div className="lg:col-span-1 bg-[#15202e]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                  {agency.name.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">{agency.name}</h2>
                <p className="text-gray-400 text-sm mb-2">{agency.email}</p>
                {agency.phone && (
                  <p className="text-gray-400 text-sm mb-3 flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-sm">call</span>
                    {agency.phone}
                  </p>
                )}
                
                <div className="mt-3">
                  {getStatusBadge()}
                </div>
                
                {agency.suspended && agency.suspendedReason && (
                  <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                    <p className="text-xs text-gray-400">{agency.suspendedReason}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Card */}
            <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-[#15202e]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5">
                <span className="material-symbols-outlined text-3xl text-purple-400 mb-2 block">local_shipping</span>
                <p className="text-2xl font-bold text-white">{agency.completedBookings || 0}</p>
                <p className="text-sm text-gray-400">Completed</p>
              </div>
              
              <div className="bg-[#15202e]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5">
                <span className="material-symbols-outlined text-3xl text-blue-400 mb-2 block">recycling</span>
                <p className="text-2xl font-bold text-white">{agency.totalWasteProcessed || 0} kg</p>
                <p className="text-sm text-gray-400">Waste Processed</p>
              </div>
              
              <div className="bg-[#15202e]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5">
                <span className="material-symbols-outlined text-3xl text-yellow-400 mb-2 block">star</span>
                <p className="text-2xl font-bold text-white">{agency.rating?.toFixed(1) || 'N/A'}</p>
                <p className="text-sm text-gray-400">Rating</p>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Business Information */}
            <div className="bg-[#15202e]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-pink-400">business</span>
                Business Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Agency ID</label>
                  <p className="text-white font-mono text-sm">{agency._id}</p>
                </div>
                
                <div>
                  <label className="text-sm text-gray-400 block mb-1">License Number</label>
                  <p className="text-white">{agency.licenseNumber || 'Not provided'}</p>
                </div>
                
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Member Since</label>
                  <p className="text-white">{new Date(agency.createdAt).toLocaleDateString()}</p>
                </div>
                
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Operating Hours</label>
                  <p className="text-white">{agency.operatingHours || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* Location & Services */}
            <div className="bg-[#15202e]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-pink-400">location_on</span>
                Location & Services
              </h3>
              
              <div className="space-y-4">
                {agency.address && (
                  <div>
                    <label className="text-sm text-gray-400 block mb-1">Address</label>
                    <p className="text-white">
                      {agency.address.street && `${agency.address.street}, `}
                      {agency.address.city && `${agency.address.city}, `}
                      {agency.address.state && `${agency.address.state} `}
                      {agency.address.zipCode}
                    </p>
                  </div>
                )}
                
                {agency.servicesOffered && agency.servicesOffered.length > 0 && (
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">Services Offered</label>
                    <div className="flex flex-wrap gap-2">
                      {agency.servicesOffered.map((service, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-lg bg-purple-500/10 text-purple-400 text-sm border border-purple-500/30"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Suspend Modal */}
        {showSuspendModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#15202e] rounded-2xl p-6 border border-white/10 max-w-md w-full">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-red-400">block</span>
                Suspend Agency Account
              </h3>
              
              <div className="mb-4">
                <label className="text-sm text-gray-400 block mb-2">Reason for Suspension *</label>
                <textarea
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  placeholder="Enter the reason for suspending this agency..."
                  className="w-full px-4 py-3 bg-[#0f1729] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 resize-none"
                  rows={4}
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSuspendModal(false)}
                  className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSuspend}
                  disabled={actionLoading || !suspendReason.trim()}
                  className="flex-1 px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all disabled:opacity-50"
                >
                  {actionLoading ? 'Suspending...' : 'Suspend Agency'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#15202e] rounded-2xl p-6 border border-white/10 max-w-md w-full">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-orange-400">cancel</span>
                Reject Agency Application
              </h3>
              
              <div className="mb-4">
                <label className="text-sm text-gray-400 block mb-2">Reason for Rejection *</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Enter the reason for rejecting this application..."
                  className="w-full px-4 py-3 bg-[#0f1729] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 resize-none"
                  rows={4}
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={actionLoading || !rejectReason.trim()}
                  className="flex-1 px-4 py-2 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-400 hover:bg-orange-500/30 transition-all disabled:opacity-50"
                >
                  {actionLoading ? 'Rejecting...' : 'Reject Agency'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Message Modal */}
        {showMessageModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#15202e] rounded-2xl p-6 border border-white/10 max-w-md w-full">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-400">mail</span>
                Send Message to Agency
              </h3>
              
              <div className="space-y-4 mb-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Message Title *</label>
                  <input
                    type="text"
                    value={messageTitle}
                    onChange={(e) => setMessageTitle(e.target.value)}
                    placeholder="Enter message title..."
                    className="w-full px-4 py-2 bg-[#0f1729] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Message Content *</label>
                  <textarea
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Enter your message..."
                    className="w-full px-4 py-3 bg-[#0f1729] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 resize-none"
                    rows={4}
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Priority</label>
                  <select
                    value={messagePriority}
                    onChange={(e) => setMessagePriority(e.target.value as 'normal' | 'high')}
                    className="w-full px-4 py-2 bg-[#0f1729] border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
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

export default AdminAgencyDetail;
