import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import Layout from '../components/Layout';
import Loader from '../components/Loader';

interface Agency {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    city: string;
    state: string;
  };
  services: string[];
  rating?: number;
  totalBookings?: number;
  isVerified: boolean;
  verificationStatus: string;
  createdAt: string;
}

const AdminAgencies: React.FC = () => {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchAgencies();
  }, [statusFilter]);

  const fetchAgencies = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      
      const response = await api.get('/admin/agencies', { params });
      console.log('Agencies response:', response.data);
      const agencyList = response.data?.data?.agencies || response.data?.agencies || [];
      setAgencies(agencyList);
    } catch (error) {
      console.error('Failed to fetch agencies:', error);
      setAgencies([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredAgencies = agencies.filter(agency =>
    agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string, isVerified: boolean) => {
    if (isVerified) {
      return 'bg-green-500/10 text-green-400 border-green-500/20';
    } else if (status === 'pending') {
      return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    } else {
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    }
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
                  <h1 className="text-2xl font-bold text-white">Partner Agencies</h1>
                  <p className="text-sm text-gray-400">View all verified partner agencies</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-[20px]">search</span>
                  <input
                    type="text"
                    placeholder="Search agencies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 w-64"
                  />
                </div>
              </div>
            </div>

            {/* Status Filters */}
            <div className="flex gap-2 mt-4">
              {['all', 'approved', 'pending', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    statusFilter === status
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
            ) : (
              <>
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-[#1E293B]/60 backdrop-blur-sm border border-green-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <span className="material-symbols-outlined text-green-400">verified</span>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{agencies.filter(a => a.isVerified).length}</p>
                        <p className="text-sm text-gray-400">Active Partners</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#1E293B]/60 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-500/20 rounded-lg">
                        <span className="material-symbols-outlined text-yellow-400">pending</span>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{agencies.filter(a => a.verificationStatus === 'pending').length}</p>
                        <p className="text-sm text-gray-400">Pending</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#1E293B]/60 backdrop-blur-sm border border-pink-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-pink-500/20 rounded-lg">
                        <span className="material-symbols-outlined text-pink-400">local_shipping</span>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">
                          {agencies.reduce((sum, a) => sum + (a.totalBookings || 0), 0)}
                        </p>
                        <p className="text-sm text-gray-400">Total Bookings</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#1E293B]/60 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <span className="material-symbols-outlined text-purple-400">star</span>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">
                          {(agencies.filter(a => a.rating).reduce((sum, a) => sum + (a.rating || 0), 0) / agencies.filter(a => a.rating).length || 0).toFixed(1)}
                        </p>
                        <p className="text-sm text-gray-400">Avg Rating</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Agencies Grid */}
                {filteredAgencies.length === 0 ? (
                  <div className="text-center py-20">
                    <span className="material-symbols-outlined text-6xl text-gray-600 mb-4">business</span>
                    <p className="text-gray-400">No agencies found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAgencies.map((agency) => (
                      <div
                        key={agency._id}
                        className="bg-[#1E293B]/60 backdrop-blur-sm border border-pink-500/20 rounded-2xl p-6 hover:border-pink-500/40 transition-all cursor-pointer"
                        onClick={() => window.location.hash = `#/admin/agencies/${agency._id}`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-1">{agency.name}</h3>
                            <p className="text-sm text-gray-400">{agency.email}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(agency.verificationStatus, agency.isVerified)}`}>
                            {agency.isVerified ? 'Active' : agency.verificationStatus}
                          </span>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <span className="material-symbols-outlined text-[18px] text-pink-400">location_on</span>
                            <span>{agency.address.city}, {agency.address.state}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <span className="material-symbols-outlined text-[18px] text-pink-400">phone</span>
                            <span>{agency.phone}</span>
                          </div>
                          {agency.rating && (
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                              <span className="material-symbols-outlined text-[18px] text-yellow-400">star</span>
                              <span>{agency.rating.toFixed(1)} Rating</span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {agency.services.slice(0, 3).map((service, idx) => (
                            <span key={idx} className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded text-xs border border-purple-500/20">
                              {service}
                            </span>
                          ))}
                          {agency.services.length > 3 && (
                            <span className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded text-xs border border-purple-500/20">
                              +{agency.services.length - 3} more
                            </span>
                          )}
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-white/10">
                          <span className="text-xs text-gray-500">
                            {agency.totalBookings || 0} bookings
                          </span>
                          <span className="text-xs text-gray-500">
                            Joined {new Date(agency.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminAgencies;
