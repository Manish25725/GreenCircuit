import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import Layout from '../components/Layout';
import Loader from '../components/Loader';

interface Agency {
  _id: string;
  name: string;
  headName?: string;
  email: string;
  phone: string;
  gstNumber?: string;
  udyamCertificate?: string;
  businessType?: string;
  establishedYear?: number;
  description?: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode?: string;
    zipCode?: string;
    country?: string;
  };
  services: string[];
  verificationStatus: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
}

const AdminPartnerApproval: React.FC = () => {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [approvalNotes, setApprovalNotes] = useState('');

  useEffect(() => {
    fetchAgencies();
  }, [filter]);

  const fetchAgencies = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await api.get('/admin/agencies', { params });
      console.log('Admin agencies response:', response.data);
      // Handle both response structures: response.data.data.agencies or response.data.agencies
      const agencyList = response.data?.data?.agencies || response.data?.agencies || [];
      console.log('Agency list:', agencyList);
      setAgencies(agencyList);
    } catch (error) {
      console.error('Failed to fetch agencies:', error);
      setAgencies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (agency: Agency) => {
    setSelectedAgency(agency);
    setShowModal(true);
    setRejectionReason('');
    setApprovalNotes('');
  };

  const handleApprove = async () => {
    if (!selectedAgency) return;

    try {
      setActionLoading(true);
      await api.post(`/admin/agencies/${selectedAgency._id}/approve`, {
        notes: approvalNotes
      });
      
      setShowModal(false);
      setSelectedAgency(null);
      fetchAgencies();
      alert('Partner approved successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to approve partner');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedAgency || !rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      setActionLoading(true);
      await api.post(`/admin/agencies/${selectedAgency._id}/reject`, {
        reason: rejectionReason
      });
      
      setShowModal(false);
      setSelectedAgency(null);
      fetchAgencies();
      alert('Partner rejected');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to reject partner');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      pending: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
      approved: 'bg-green-500/10 text-green-400 border border-green-500/20',
      rejected: 'bg-red-500/10 text-red-400 border border-red-500/20'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[status as keyof typeof statusStyles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <Layout title="" role="Admin" fullWidth hideSidebar>
      <div className="bg-gradient-to-br from-[#1a0b1e] via-[#0B1116] to-[#1a0b1e] min-h-screen">
        {/* Pink gradient effects */}
        <div className="fixed top-0 left-0 w-full h-[500px] bg-pink-500/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
        <div className="fixed bottom-0 right-0 w-full h-[500px] bg-purple-500/10 rounded-full blur-[120px] translate-y-1/2 pointer-events-none"></div>

        <div className="relative z-10">
          {/* Header */}
          <header className="border-b border-white/5 bg-[#0B1116]/80 backdrop-blur-md px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => window.location.hash = '#/admin'}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-pink-400">arrow_back</span>
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-white">Partner Applications</h1>
                  <p className="text-sm text-gray-400">Review and approve partner registrations</p>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mt-4">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === status
                      ? 'bg-pink-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </header>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader size="md" color="#ec4899" />
              </div>
            ) : agencies.length === 0 ? (
              <div className="text-center py-20">
                <span className="material-symbols-outlined text-6xl text-gray-600 mb-4">inbox</span>
                <p className="text-gray-400">No partner applications found</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {agencies.map((agency) => (
                  <div key={agency._id} className="bg-[#1E293B]/60 backdrop-blur-sm border border-pink-500/20 rounded-2xl p-6 hover:border-pink-500/40 transition-all">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-white">{agency.name}</h3>
                          {getStatusBadge(agency.verificationStatus)}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 text-sm">
                          <div>
                            <span className="text-gray-400">Head Name:</span>
                            <p className="font-medium text-white">{agency.headName || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Email:</span>
                            <p className="font-medium text-white">{agency.email}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Phone:</span>
                            <p className="font-medium text-white">{agency.phone}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">GST Number:</span>
                            <p className="font-medium text-white">{agency.gstNumber || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Location:</span>
                            <p className="font-medium text-white">{agency.address.city}, {agency.address.state}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Submitted:</span>
                            <p className="font-medium text-white">{new Date(agency.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleViewDetails(agency)}
                        className="ml-4 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all font-medium"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Details Modal */}
        {showModal && selectedAgency && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#1E293B] border border-pink-500/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-[#1E293B] border-b border-white/10 px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Partner Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Status */}
                <div className="flex items-center space-x-3">
                  <span className="text-gray-300 font-medium">Status:</span>
                  {getStatusBadge(selectedAgency.verificationStatus)}
                </div>

                {/* Business Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Business Information</h3>
                  <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-lg">
                    <div>
                      <span className="text-sm text-gray-400">Agency Name:</span>
                      <p className="font-medium text-white">{selectedAgency.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-400">Head/Owner Name:</span>
                      <p className="font-medium text-white">{selectedAgency.headName || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-400">GST Number:</span>
                      <p className="font-medium text-white">{selectedAgency.gstNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-400">Udyam Certificate:</span>
                      <p className="font-medium text-white">{selectedAgency.udyamCertificate || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-400">Business Type:</span>
                      <p className="font-medium text-white">{selectedAgency.businessType || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-400">Established Year:</span>
                      <p className="font-medium text-white">{selectedAgency.establishedYear || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Contact Information</h3>
                  <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-lg">
                    <div>
                      <span className="text-sm text-gray-400">Email:</span>
                      <p className="font-medium text-white">{selectedAgency.email}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-400">Phone:</span>
                      <p className="font-medium text-white">{selectedAgency.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Address</h3>
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p className="font-medium text-white">
                      {selectedAgency.address.street}<br />
                      {selectedAgency.address.city}, {selectedAgency.address.state} {selectedAgency.address.zipCode || selectedAgency.address.postalCode}<br />
                      {selectedAgency.address.country || 'India'}
                    </p>
                  </div>
                </div>

                {/* Services */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Services Offered</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAgency.services.map((service, index) => (
                      <span key={index} className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm border border-purple-500/20">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                {selectedAgency.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                    <div className="bg-white/5 p-4 rounded-lg">
                      <p className="text-gray-300">{selectedAgency.description}</p>
                    </div>
                  </div>
                )}

                {/* Action Section */}
                {selectedAgency.verificationStatus === 'pending' && (
                  <div className="space-y-4 border-t border-white/10 pt-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Approval Notes (Optional)
                      </label>
                      <textarea
                        value={approvalNotes}
                        onChange={(e) => setApprovalNotes(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:outline-none"
                        placeholder="Add any notes for the partner..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Rejection Reason (Required if rejecting)
                      </label>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
                        placeholder="Explain why this application is being rejected..."
                      />
                    </div>

                    <div className="flex space-x-4">
                      <button
                        onClick={handleApprove}
                        disabled={actionLoading}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-colors disabled:opacity-50 font-bold"
                      >
                        {actionLoading ? 'Processing...' : 'Approve Partner'}
                      </button>
                      <button
                        onClick={handleReject}
                        disabled={actionLoading || !rejectionReason.trim()}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-colors disabled:opacity-50 font-bold"
                      >
                        {actionLoading ? 'Processing...' : 'Reject'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminPartnerApproval;
