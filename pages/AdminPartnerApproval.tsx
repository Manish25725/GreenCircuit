import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import Layout from '../components/Layout';

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
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  };
  services: string[];
  verificationStatus: 'pending' | 'approved' | 'rejected';
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
      setAgencies(response.data.data.agencies || []);
    } catch (error) {
      console.error('Failed to fetch agencies:', error);
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
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[status as keyof typeof statusStyles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Partner Registration Approvals</h1>
          <p className="text-gray-600">Review and approve partner registration requests</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex space-x-2">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Agencies List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading...</p>
          </div>
        ) : agencies.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600">No agencies found</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {agencies.map((agency) => (
              <div key={agency._id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{agency.name}</h3>
                      {getStatusBadge(agency.verificationStatus)}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 text-sm">
                      <div>
                        <span className="text-gray-600">Head Name:</span>
                        <p className="font-medium">{agency.headName || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <p className="font-medium">{agency.email}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Phone:</span>
                        <p className="font-medium">{agency.phone}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">GST Number:</span>
                        <p className="font-medium">{agency.gstNumber || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Location:</span>
                        <p className="font-medium">{agency.address.city}, {agency.address.state}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Submitted:</span>
                        <p className="font-medium">{new Date(agency.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleViewDetails(agency)}
                    className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Details Modal */}
        {showModal && selectedAgency && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Partner Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Status */}
                <div className="flex items-center space-x-3">
                  <span className="text-gray-700 font-medium">Status:</span>
                  {getStatusBadge(selectedAgency.verificationStatus)}
                </div>

                {/* Business Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Business Information</h3>
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <span className="text-sm text-gray-600">Agency Name:</span>
                      <p className="font-medium">{selectedAgency.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Head/Owner Name:</span>
                      <p className="font-medium">{selectedAgency.headName || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">GST Number:</span>
                      <p className="font-medium">{selectedAgency.gstNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Udyam Certificate:</span>
                      <p className="font-medium">{selectedAgency.udyamCertificate || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Business Type:</span>
                      <p className="font-medium">{selectedAgency.businessType || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Established Year:</span>
                      <p className="font-medium">{selectedAgency.establishedYear || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <span className="text-sm text-gray-600">Email:</span>
                      <p className="font-medium">{selectedAgency.email}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Phone:</span>
                      <p className="font-medium">{selectedAgency.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Address</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium">
                      {selectedAgency.address.street}<br />
                      {selectedAgency.address.city}, {selectedAgency.address.state} {selectedAgency.address.zipCode}<br />
                      {selectedAgency.address.country || 'India'}
                    </p>
                  </div>
                </div>

                {/* Services */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Services Offered</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAgency.services.map((service, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                {selectedAgency.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700">{selectedAgency.description}</p>
                    </div>
                  </div>
                )}

                {/* Action Section */}
                {selectedAgency.verificationStatus === 'pending' && (
                  <div className="space-y-4 border-t pt-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Approval Notes (Optional)
                      </label>
                      <textarea
                        value={approvalNotes}
                        onChange={(e) => setApprovalNotes(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="Add any notes for the partner..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rejection Reason (Required if rejecting)
                      </label>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                        placeholder="Explain why this application is being rejected..."
                      />
                    </div>

                    <div className="flex space-x-4">
                      <button
                        onClick={handleApprove}
                        disabled={actionLoading}
                        className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
                      >
                        {actionLoading ? 'Processing...' : 'Approve Partner'}
                      </button>
                      <button
                        onClick={handleReject}
                        disabled={actionLoading || !rejectionReason.trim()}
                        className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400"
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
