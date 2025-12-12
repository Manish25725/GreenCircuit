import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getCurrentUser, api } from '../services/api';

interface CertificateItem {
  name: string;
  category: string;
  quantity: number;
  weight: number;
}

interface Certificate {
  _id: string;
  certificateId: string;
  type: string;
  title: string;
  items: CertificateItem[];
  totalWeight: number;
  totalItems: number;
  co2Saved: number;
  complianceStandards: string[];
  disposalMethod: string;
  issuedBy: {
    name: string;
    designation: string;
  };
  agencyId?: {
    _id: string;
    name: string;
    logo?: string;
  };
  status: 'issued' | 'revoked' | 'expired';
  validUntil: string;
  issuedAt: string;
  createdAt: string;
}

interface Stats {
  totalCertificates: number;
  totalWeight: number;
  totalCo2Saved: number;
}

const BusinessCertificates = () => {
  const user = getCurrentUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [stats, setStats] = useState<Stats>({ totalCertificates: 0, totalWeight: 0, totalCo2Saved: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response: any = await api.getBusinessCertificates();
      if (response) {
        setCertificates(response.certificates || []);
        setStats(response.stats || { totalCertificates: 0, totalWeight: 0, totalCo2Saved: 0 });
      }
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.hash = '#/login';
  };

  const handleDownloadCertificate = async (certId: string, certNumber: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/business/certificates/${certId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to download certificate');
      }
      
      // Get the PDF blob
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate-${certNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download certificate:', error);
      alert('Failed to download certificate. Please try again.');
    }
  };

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.certificateId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cert.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cert.agencyId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cert.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || cert.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getDisplayStatus = (cert: Certificate): 'verified' | 'expired' | 'revoked' => {
    // Check if certificate is expired
    if (cert.validUntil && new Date(cert.validUntil) < new Date()) {
      return 'expired';
    }
    if (cert.status === 'issued') return 'verified';
    if (cert.status === 'revoked') return 'revoked';
    return 'expired';
  };

  const displayStats = {
    total: stats.totalCertificates,
    verified: certificates.filter(c => c.status === 'issued' && (!c.validUntil || new Date(c.validUntil) >= new Date())).length,
    pending: 0, // No pending status in BusinessCertificate model
    totalWeight: Math.round(stats.totalWeight || 0)
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'verified': 
      case 'issued': return 'bg-[#10b981]/10 text-[#10b981]';
      case 'pending': return 'bg-amber-500/10 text-amber-400';
      case 'expired':
      case 'revoked': return 'bg-red-500/10 text-red-400';
      default: return 'bg-gray-500/10 text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'verified':
      case 'issued': return 'verified';
      case 'pending': return 'hourglass_empty';
      case 'expired':
      case 'revoked': return 'error';
      default: return 'help';
    }
  };

  const getTypeDisplay = (type: string) => {
    const types: Record<string, string> = {
      'recycling': 'Recycling',
      'destruction': 'Data Destruction',
      'donation': 'Donation',
      'refurbishment': 'Refurbishment'
    };
    return types[type] || type;
  };

  return (
    <Layout title="" role="Business" fullWidth hideSidebar>
      <div className="bg-[#0B1116] font-sans text-gray-200 antialiased selection:bg-[#06b6d4] selection:text-white min-h-screen">
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
          <div className="fixed top-0 left-0 w-full h-[500px] bg-[#10b981]/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
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
                      <p className="text-[#10b981] text-sm font-bold uppercase tracking-widest">Compliance & Documentation</p>
                    </div>
                    <h1 className="text-white text-3xl sm:text-4xl font-black leading-tight tracking-tighter mb-2">Disposal Certificates</h1>
                    <p className="text-[#94a3b8] text-base">View and download your verified disposal certificates.</p>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-[#151F26] rounded-2xl p-6 border border-white/5 relative overflow-hidden group hover:border-[#06b6d4]/20 transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#06b6d4]/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div className="p-3 bg-[#06b6d4]/10 rounded-xl text-[#06b6d4]">
                        <span className="material-symbols-outlined">description</span>
                      </div>
                    </div>
                    <h3 className="text-3xl font-black text-white relative z-10">{displayStats.total}</h3>
                    <p className="text-sm text-[#94a3b8] relative z-10">Total Certificates</p>
                  </div>
                  
                  <div className="bg-[#151F26] rounded-2xl p-6 border border-white/5 relative overflow-hidden group hover:border-[#10b981]/20 transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#10b981]/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div className="p-3 bg-[#10b981]/10 rounded-xl text-[#10b981]">
                        <span className="material-symbols-outlined">verified</span>
                      </div>
                    </div>
                    <h3 className="text-3xl font-black text-white relative z-10">{displayStats.verified}</h3>
                    <p className="text-sm text-[#94a3b8] relative z-10">Verified</p>
                  </div>
                  
                  <div className="bg-[#151F26] rounded-2xl p-6 border border-white/5 relative overflow-hidden group hover:border-[#8b5cf6]/20 transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#8b5cf6]/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div className="p-3 bg-[#8b5cf6]/10 rounded-xl text-[#8b5cf6]">
                        <span className="material-symbols-outlined">eco</span>
                      </div>
                    </div>
                    <h3 className="text-3xl font-black text-white relative z-10">{Math.round(stats.totalCo2Saved || 0)} <span className="text-lg font-medium text-gray-500">kg</span></h3>
                    <p className="text-sm text-[#94a3b8] relative z-10">CO₂ Saved</p>
                  </div>
                  
                  <div className="bg-[#151F26] rounded-2xl p-6 border border-white/5 relative overflow-hidden group hover:border-[#06b6d4]/20 transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#06b6d4]/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div className="p-3 bg-[#06b6d4]/10 rounded-xl text-[#06b6d4]">
                        <span className="material-symbols-outlined">scale</span>
                      </div>
                    </div>
                    <h3 className="text-3xl font-black text-white relative z-10">{displayStats.totalWeight} <span className="text-lg font-medium text-gray-500">kg</span></h3>
                    <p className="text-sm text-[#94a3b8] relative z-10">Certified Weight</p>
                  </div>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                  <div className="flex-1 relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">search</span>
                    <input
                      type="text"
                      placeholder="Search by certificate number, type, or agency..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#151F26] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none transition-all"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-[#151F26] border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="issued">Verified</option>
                    <option value="expired">Expired</option>
                    <option value="revoked">Revoked</option>
                  </select>
                </div>

                {/* Certificates List */}
                <div className="bg-[#151F26] rounded-2xl border border-white/5 overflow-hidden">
                  {/* Table Header */}
                  <div className="hidden md:grid grid-cols-6 gap-4 p-4 border-b border-white/5 text-sm font-medium text-gray-500">
                    <div>Certificate #</div>
                    <div>Date</div>
                    <div>Type</div>
                    <div>Weight</div>
                    <div>Agency</div>
                    <div className="text-center">Actions</div>
                  </div>
                  
                  {/* Loading State */}
                  {loading ? (
                    <div className="p-12 text-center">
                      <div className="animate-spin w-8 h-8 border-2 border-[#06b6d4] border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-gray-400">Loading certificates...</p>
                    </div>
                  ) : filteredCertificates.length === 0 ? (
                    <div className="p-12 text-center">
                      <span className="material-symbols-outlined text-5xl text-gray-600 mb-4">description</span>
                      <p className="text-gray-400 text-lg">No certificates found</p>
                      <p className="text-gray-600 text-sm mt-1">
                        {certificates.length === 0 
                          ? "Certificates are issued when your pickups are completed" 
                          : "Try adjusting your search or filters"}
                      </p>
                    </div>
                  ) : (
                    filteredCertificates.map((cert) => {
                      const displayStatus = getDisplayStatus(cert);
                      return (
                        <div key={cert._id} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors items-center">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${getStatusStyle(displayStatus)}`}>
                              <span className="material-symbols-outlined text-lg">{getStatusIcon(displayStatus)}</span>
                            </div>
                            <div>
                              <p className="text-white font-semibold">{cert.certificateId}</p>
                              <span className={`inline-block md:hidden text-xs px-2 py-0.5 rounded-full ${getStatusStyle(displayStatus)} mt-1`}>
                                {displayStatus === 'verified' ? 'Verified' : displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
                              </span>
                            </div>
                          </div>
                          <div className="text-gray-400">
                            <span className="md:hidden text-gray-600 text-sm mr-2">Date:</span>
                            {new Date(cert.issuedAt || cert.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </div>
                          <div className="text-white">
                            <span className="md:hidden text-gray-600 text-sm mr-2">Type:</span>
                            {getTypeDisplay(cert.type)}
                          </div>
                          <div className="text-white font-medium">
                            <span className="md:hidden text-gray-600 text-sm mr-2">Weight:</span>
                            {cert.totalWeight} kg
                          </div>
                          <div className="text-gray-400">
                            <span className="md:hidden text-gray-600 text-sm mr-2">Agency:</span>
                            {cert.agencyId?.name || cert.issuedBy?.name || 'N/A'}
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => setSelectedCertificate(cert)}
                              className="p-2 rounded-lg bg-[#06b6d4]/10 text-[#06b6d4] hover:bg-[#06b6d4]/20 transition-colors"
                              title="View Certificate"
                            >
                              <span className="material-symbols-outlined text-lg">visibility</span>
                            </button>
                            {displayStatus === 'verified' && (
                              <button 
                                onClick={() => handleDownloadCertificate(cert._id, cert.certificateId)}
                                className="p-2 rounded-lg bg-[#10b981]/10 text-[#10b981] hover:bg-[#10b981]/20 transition-colors"
                                title="Download PDF"
                              >
                                <span className="material-symbols-outlined text-lg">download</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Compliance Note */}
                <div className="mt-8 p-6 bg-gradient-to-r from-[#10b981]/10 to-[#06b6d4]/10 rounded-2xl border border-[#10b981]/20">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#10b981]/20 rounded-xl">
                      <span className="material-symbols-outlined text-[#10b981] text-2xl">security</span>
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg mb-1">Compliance Verified</h4>
                      <p className="text-gray-400 text-sm">All your verified certificates are digitally signed and meet regulatory compliance standards. These certificates can be used for environmental audits and sustainability reporting.</p>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>

        {/* Certificate Preview Modal */}
        {selectedCertificate && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedCertificate(null)}>
            <div className="bg-[#151F26] rounded-3xl w-full max-w-2xl border border-white/10 overflow-hidden max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-[#151F26]">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getStatusStyle(getDisplayStatus(selectedCertificate))}`}>
                    <span className="material-symbols-outlined">{getStatusIcon(getDisplayStatus(selectedCertificate))}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{selectedCertificate.certificateId}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusStyle(getDisplayStatus(selectedCertificate))}`}>
                      {getDisplayStatus(selectedCertificate) === 'verified' ? 'Verified' : getDisplayStatus(selectedCertificate).charAt(0).toUpperCase() + getDisplayStatus(selectedCertificate).slice(1)}
                    </span>
                  </div>
                </div>
                <button onClick={() => setSelectedCertificate(null)} className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              {/* Certificate Content */}
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="inline-block p-4 bg-[#10b981]/10 rounded-full mb-4">
                    <span className="material-symbols-outlined text-[#10b981] text-5xl">workspace_premium</span>
                  </div>
                  <h2 className="text-2xl font-black text-white mb-2">{selectedCertificate.title}</h2>
                  <p className="text-gray-500">{getTypeDisplay(selectedCertificate.type)} Certificate</p>
                </div>
                
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-gray-500 text-sm mb-1">Date Issued</p>
                    <p className="text-white font-semibold">
                      {new Date(selectedCertificate.issuedAt || selectedCertificate.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-gray-500 text-sm mb-1">Valid Until</p>
                    <p className="text-white font-semibold">
                      {selectedCertificate.validUntil 
                        ? new Date(selectedCertificate.validUntil).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-gray-500 text-sm mb-1">Total Weight</p>
                    <p className="text-white font-semibold">{selectedCertificate.totalWeight} kg</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-gray-500 text-sm mb-1">CO₂ Saved</p>
                    <p className="text-[#10b981] font-semibold">{Math.round(selectedCertificate.co2Saved || 0)} kg</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-gray-500 text-sm mb-1">Disposal Method</p>
                    <p className="text-white font-semibold">{selectedCertificate.disposalMethod || 'Certified Recycling'}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-gray-500 text-sm mb-1">Issued By</p>
                    <p className="text-white font-semibold">{selectedCertificate.agencyId?.name || selectedCertificate.issuedBy?.name}</p>
                    {selectedCertificate.issuedBy?.designation && (
                      <p className="text-gray-500 text-xs">{selectedCertificate.issuedBy.designation}</p>
                    )}
                  </div>
                </div>

                {/* Items List */}
                {selectedCertificate.items && selectedCertificate.items.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-white font-bold mb-3">Items Recycled</h4>
                    <div className="bg-white/5 rounded-xl overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-white/5">
                          <tr className="text-gray-500 text-sm">
                            <th className="text-left p-3">Item</th>
                            <th className="text-left p-3">Category</th>
                            <th className="text-right p-3">Qty</th>
                            <th className="text-right p-3">Weight</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedCertificate.items.map((item, idx) => (
                            <tr key={idx} className="border-t border-white/5">
                              <td className="p-3 text-white">{item.name}</td>
                              <td className="p-3 text-gray-400">{item.category}</td>
                              <td className="p-3 text-white text-right">{item.quantity}</td>
                              <td className="p-3 text-white text-right">{item.weight} kg</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Compliance Standards */}
                {selectedCertificate.complianceStandards && selectedCertificate.complianceStandards.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-white font-bold mb-3">Compliance Standards</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCertificate.complianceStandards.map((standard, idx) => (
                        <span key={idx} className="px-3 py-1 bg-[#06b6d4]/10 text-[#06b6d4] rounded-full text-sm">{standard}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-4">
                  {getDisplayStatus(selectedCertificate) === 'verified' && (
                    <button 
                      onClick={() => handleDownloadCertificate(selectedCertificate._id, selectedCertificate.certificateId)}
                      className="flex-1 bg-[#10b981] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#059669] transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined">download</span>
                      Download PDF
                    </button>
                  )}
                  <button 
                    onClick={() => setSelectedCertificate(null)}
                    className="flex-1 bg-white/10 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BusinessCertificates;
