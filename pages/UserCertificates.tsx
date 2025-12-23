import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { api, getCurrentUser } from '../services/api';

interface Certificate {
  _id: string;
  certificateNumber: string;
  issueDate: string;
  expiryDate?: string;
  wasteType: string;
  quantity: number;
  agency: {
    _id: string;
    companyName: string;
    logo?: string;
  };
  certificateUrl?: string;
  status: string;
}

const UserCertificates = () => {
  const [user, setUser] = useState<any>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'expired'>('all');

  useEffect(() => {
    loadUserData();
    fetchCertificates();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await api.getMe();
      setUser(userData);
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to load user data:', error);
      // Fallback to localStorage
      const currentUser = getCurrentUser();
      setUser(currentUser);
    }
  };

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response: any = await api.getUserCertificates();
      setCertificates(response.certificates || []);
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.hash = '#/login';
  };

  const getFilteredCertificates = () => {
    if (filter === 'all') return certificates;
    if (filter === 'active') {
      return certificates.filter(cert => {
        if (!cert.expiryDate) return true;
        return new Date(cert.expiryDate) > new Date();
      });
    }
    if (filter === 'expired') {
      return certificates.filter(cert => {
        if (!cert.expiryDate) return false;
        return new Date(cert.expiryDate) <= new Date();
      });
    }
    return certificates;
  };

  const filteredCertificates = getFilteredCertificates();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) <= new Date();
  };

  return (
    <Layout title="" role="User" fullWidth hideSidebar>
      <div className="bg-[#0B1116] font-sans text-gray-200 antialiased selection:bg-[#10b981] selection:text-white min-h-screen flex flex-col relative overflow-hidden">
        
        {/* Background Ambient Blobs */}
        <div className="fixed top-0 left-0 w-full h-[500px] bg-[#10b981]/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
        <div className="fixed bottom-0 right-0 w-full h-[500px] bg-[#3b82f6]/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none"></div>

        {/* Standard Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 transition-all duration-300">
          <div className="flex items-center gap-3 text-white cursor-pointer" onClick={() => window.location.hash = '#/'}>
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
        <main className="flex-1 pt-20 relative z-10">
          <div className="layout-container flex h-full flex-col px-4 sm:px-6 lg:px-10 py-8">
            {/* Back Button */}
            <button 
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-[#10b981] hover:text-[#059669] transition-colors mb-6 group w-fit"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              <span className="text-sm font-medium">Back to Dashboard</span>
            </button>

            {/* Page Header */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#10b981]/10 rounded-xl">
                    <span className="material-symbols-outlined text-[#10b981] text-[32px]">workspace_premium</span>
                  </div>
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white">My Certificates</h1>
                    <p className="text-gray-400 text-sm mt-1">Appreciation certificates from agencies</p>
                  </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      filter === 'all'
                        ? 'bg-[#10b981] text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('active')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      filter === 'active'
                        ? 'bg-[#10b981] text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setFilter('expired')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      filter === 'expired'
                        ? 'bg-[#10b981] text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    Expired
                  </button>
                </div>
              </div>
            </div>

            {/* Certificates Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-[#10b981] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading certificates...</p>
                </div>
              </div>
            ) : filteredCertificates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-gray-500 text-[48px]">workspace_premium</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No certificates yet</h3>
                <p className="text-gray-400 text-center max-w-md">
                  Complete e-waste pickups to receive appreciation certificates from agencies
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCertificates.map((certificate) => (
                  <div
                    key={certificate._id}
                    className="bg-gradient-to-br from-[#151F26] to-[#0B1116] rounded-2xl p-6 border border-white/5 hover:border-[#10b981]/30 transition-all shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_25px_-5px_rgba(16,185,129,0.1)] relative overflow-hidden group"
                  >
                    {/* Certificate Badge */}
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30">
                      {isExpired(certificate.expiryDate) ? 'Expired' : 'Active'}
                    </div>

                    {/* Agency Logo */}
                    <div className="flex items-center gap-3 mb-4">
                      <div 
                        className="size-12 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden"
                        style={
                          certificate.agency.logo
                            ? { backgroundImage: `url(${certificate.agency.logo})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                            : {}
                        }
                      >
                        {!certificate.agency.logo && (
                          <span className="material-symbols-outlined text-gray-500">business</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-400">Issued by</p>
                        <h3 className="font-semibold text-white">{certificate.agency.companyName}</h3>
                      </div>
                    </div>

                    {/* Certificate Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Certificate No.</span>
                        <span className="text-sm font-medium text-white">{certificate.certificateNumber}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Waste Type</span>
                        <span className="text-sm font-medium text-white">{certificate.wasteType}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Quantity</span>
                        <span className="text-sm font-medium text-white">{certificate.quantity} kg</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Issue Date</span>
                        <span className="text-sm font-medium text-white">{formatDate(certificate.issueDate)}</span>
                      </div>
                      {certificate.expiryDate && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Expiry Date</span>
                          <span className={`text-sm font-medium ${isExpired(certificate.expiryDate) ? 'text-red-400' : 'text-white'}`}>
                            {formatDate(certificate.expiryDate)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {certificate.certificateUrl ? (
                        <a
                          href={certificate.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-4 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">download</span>
                          Download
                        </a>
                      ) : (
                        <button
                          disabled
                          className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 text-gray-500 font-medium text-sm flex items-center justify-center gap-2 cursor-not-allowed"
                        >
                          <span className="material-symbols-outlined text-[18px]">hourglass_empty</span>
                          Processing
                        </button>
                      )}
                      <button
                        className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-medium text-sm flex items-center justify-center gap-2 transition-colors border border-white/5"
                      >
                        <span className="material-symbols-outlined text-[18px]">share</span>
                      </button>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#10b981]/5 rounded-full blur-2xl group-hover:bg-[#10b981]/10 transition-all"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default UserCertificates;
