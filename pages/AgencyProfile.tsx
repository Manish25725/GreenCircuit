import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { api, getCurrentUser, User } from '../services/api';

const AgencyProfile = () => {
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('company');
  const [formData, setFormData] = useState({
    companyName: '',
    registrationNumber: '',
    description: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });
  const [regions, setRegions] = useState<string[]>([]);
  const [wasteTypes, setWasteTypes] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [agencyData, setAgencyData] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.getAgencyProfile() as any;
        const agency = response.data || response;
        
        setAgencyData(agency);
        setFormData({
          companyName: agency.name || '',
          registrationNumber: agency.registrationNumber || '',
          description: agency.description || '',
          email: agency.email || '',
          phone: agency.phone || '',
          address: agency.address?.street || '',
          city: agency.address?.city || '',
          zipCode: agency.address?.zipCode || ''
        });
        setRegions(agency.address?.city ? [agency.address.city] : []);
        setWasteTypes(agency.services || []);
        
        // Parse certifications if stored as JSON strings
        const parsedCerts = agency.certifications?.map((cert: string) => {
          try {
            return JSON.parse(cert);
          } catch {
            return { name: cert, type: 'Certification', icon: 'verified', color: 'text-green-400' };
          }
        }) || [];
        setCertifications(parsedCerts);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateAgencyProfile({
        name: formData.companyName,
        registrationNumber: formData.registrationNumber,
        description: formData.description,
        email: formData.email,
        phone: formData.phone,
        address: {
          street: formData.address,
          city: formData.city,
          state: 'NY',
          zipCode: formData.zipCode
        },
        services: wasteTypes,
        certifications: certifications.map(cert => JSON.stringify(cert))
      });
      // Show success notification
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    window.location.hash = '#/login';
  };

  const allWasteTypes = ['IT Equipment', 'Mobile Devices', 'Large Appliances', 'Batteries', 'Industrial Machinery', 'Solar Panels'];

  return (
    <Layout title="" role="Agency" fullWidth hideSidebar>
      <div className="bg-[#0B1116] font-sans text-gray-200 antialiased selection:bg-[#f59e0b] selection:text-white min-h-screen">
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
          <div className="fixed top-0 left-0 w-full h-[500px] bg-[#f59e0b]/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
          <div className="fixed bottom-0 right-0 w-full h-[500px] bg-[#8b5cf6]/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none"></div>
          
          <div className="layout-container flex h-full grow flex-col relative z-10">
            {/* Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 transition-all duration-300">
              <div className="flex items-center gap-3 text-white cursor-pointer" onClick={() => window.location.hash = '#/'}>
                <div className="p-2 bg-[#f59e0b]/10 rounded-lg">
                  <svg className="h-6 w-6 text-[#f59e0b]" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"></path>
                  </svg>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white">EcoCycle <span className="text-[#f59e0b]">Partner</span></h2>
              </div>
              <nav className="hidden md:flex flex-1 justify-center gap-1">
              </nav>
              <div className="flex items-center gap-4">
                <button 
                    onClick={() => window.location.hash = '#/agency/profile'}
                    className="hidden sm:flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-[#151F26] border border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"
                >
                  <div className="size-8 rounded-full bg-[#f59e0b] flex items-center justify-center ring-2 ring-white/10 group-hover:ring-[#f59e0b]/50 transition-all text-white font-bold text-sm">
                    {user?.name?.charAt(0) || 'A'}
                  </div>
                  <span className="text-sm font-medium text-gray-200">{user?.name || 'Agency'}</span>
                </button>
                <button 
                  onClick={handleLogout}
                  className="p-2.5 rounded-full bg-[#151F26] border border-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Logout"
                >
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                </button>
              </div>
            </header>

            <main className="flex flex-1 justify-center py-5 mt-24">
              <div className="layout-content-container flex flex-col w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 py-8">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => window.location.hash = '#/agency'}
                      className="p-2 rounded-lg border transition-colors bg-[#f59e0b]/10 border-[#f59e0b]/20 text-[#f59e0b] hover:bg-[#f59e0b]/20"
                      title="Back to Dashboard"
                    >
                      <span className="material-symbols-outlined text-xl">arrow_back</span>
                    </button>
                    <div>
                      <p className="text-[#f59e0b] text-sm font-bold uppercase tracking-widest mb-2">Profile Settings</p>
                      <h1 className="text-white text-4xl sm:text-5xl font-black leading-tight tracking-tighter mb-2">Agency Profile</h1>
                      <p className="text-[#94a3b8] text-lg">Manage your company information and settings.</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center justify-center h-12 px-6 text-base font-bold leading-normal transition-all bg-[#f59e0b] text-white rounded-xl hover:bg-[#d97706] hover:scale-105 shadow-[0_0_20px_rgba(245,158,11,0.3)] disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined mr-2">save</span>
                    <span className="truncate">{saving ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column - Profile Card */}
                  <div className="lg:col-span-4 flex flex-col gap-6">
                    {/* Profile Picture Card */}
                    <div className="bg-[#151F26] rounded-2xl p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] border border-white/5">
                      <div className="flex flex-col items-center text-center gap-4">
                        <div className="relative group">
                          <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-[#f59e0b]/20 shadow-xl bg-gradient-to-br from-[#f59e0b]/20 to-orange-600/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-6xl text-[#f59e0b]">corporate_fare</span>
                          </div>
                          <button className="absolute -bottom-2 -right-2 bg-[#f59e0b] text-white rounded-xl p-2.5 hover:bg-[#d97706] transition shadow-[0_0_15px_rgba(245,158,11,0.5)] cursor-pointer">
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </button>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{formData.companyName || 'Agency Name'}</h3>
                          <div className="flex items-center justify-center gap-2 mt-1">
                            <span className="material-symbols-outlined text-[#f59e0b] text-sm">verified</span>
                            <p className="text-sm text-[#f59e0b]">{agencyData?.isVerified ? 'Verified Partner' : 'Pending Verification'}</p>
                          </div>
                        </div>
                        <div className="w-full h-px bg-white/5 my-2"></div>
                        <div className="flex flex-col w-full gap-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Member Since</span>
                            <span className="text-white font-medium">
                              {agencyData?.createdAt ? new Date(agencyData.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Rating</span>
                            <span className="text-[#f59e0b] flex items-center gap-1 font-medium">
                              {agencyData?.rating?.toFixed(1) || '0.0'} <span className="material-symbols-outlined text-sm fill">star</span>
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Total Pickups</span>
                            <span className="text-white font-medium">{agencyData?.totalBookings || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Certifications Card */}
                    <div className="bg-[#151F26] rounded-2xl p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] border border-white/5">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-[#f59e0b]">verified_user</span>
                        Certifications
                      </h3>
                      <div className="flex flex-col gap-3">
                        {certifications.map((cert, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-[#0B1116] rounded-xl border border-white/5 hover:border-white/10 transition-colors group">
                            <div className="flex items-center gap-3">
                              <span className={`material-symbols-outlined ${cert.color}`}>{cert.icon}</span>
                              <div>
                                <p className="text-sm font-medium text-white">{cert.name}</p>
                                <p className="text-xs text-slate-500">{cert.type}</p>
                              </div>
                            </div>
                            <span className="material-symbols-outlined text-slate-600 group-hover:text-slate-400 cursor-pointer transition-colors">more_vert</span>
                          </div>
                        ))}
                        <button className="w-full py-3 text-sm font-medium text-[#f59e0b] border border-[#f59e0b]/30 rounded-xl hover:bg-[#f59e0b]/10 transition-all flex items-center justify-center gap-2 cursor-pointer">
                          <span className="material-symbols-outlined text-lg">add</span>
                          Add Certification
                        </button>
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="bg-[#151F26] rounded-2xl p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] border border-white/5">
                      <h3 className="text-lg font-bold text-white mb-4">Performance</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-400">Response Rate</span>
                            <span className="text-white font-bold">98%</span>
                          </div>
                          <div className="w-full h-2 bg-[#0B1116] rounded-full overflow-hidden">
                            <div className="w-[98%] h-full bg-gradient-to-r from-[#f59e0b] to-orange-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-400">Completion Rate</span>
                            <span className="text-white font-bold">95%</span>
                          </div>
                          <div className="w-full h-2 bg-[#0B1116] rounded-full overflow-hidden">
                            <div className="w-[95%] h-full bg-gradient-to-r from-[#f59e0b] to-orange-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-400">Satisfaction</span>
                            <span className="text-white font-bold">97%</span>
                          </div>
                          <div className="w-full h-2 bg-[#0B1116] rounded-full overflow-hidden">
                            <div className="w-[97%] h-full bg-gradient-to-r from-[#f59e0b] to-orange-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Forms */}
                  <div className="lg:col-span-8 flex flex-col gap-6">
                    {/* Tabs */}
                    <div className="flex h-10 items-center justify-center rounded-xl bg-[#151F26] border border-white/5 p-1 w-fit">
                      {[
                        { key: 'company', label: 'Company Details', icon: 'business' },
                        { key: 'contact', label: 'Contact Info', icon: 'contact_mail' },
                        { key: 'services', label: 'Services', icon: 'settings' }
                      ].map(tab => (
                        <label 
                          key={tab.key} 
                          className={`flex cursor-pointer h-full items-center justify-center overflow-hidden rounded-lg px-4 text-sm font-medium leading-normal transition-all gap-2 ${
                            activeTab === tab.key 
                              ? 'bg-[#f59e0b] text-white shadow-sm' 
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                          <span className="truncate">{tab.label}</span>
                          <input 
                            type="radio" 
                            name="tab-toggle" 
                            value={tab.key} 
                            checked={activeTab === tab.key} 
                            onChange={() => setActiveTab(tab.key)} 
                            className="invisible w-0 absolute"
                          />
                        </label>
                      ))}
                    </div>

                    {/* Company Details Tab */}
                    {activeTab === 'company' && (
                      <div className="bg-[#151F26] rounded-2xl p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] border border-white/5">
                        <h3 className="text-lg font-bold text-white mb-6">Company Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-400">Company Name</label>
                            <input 
                              className="w-full bg-[#0B1116] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#f59e0b]/50 focus:border-[#f59e0b] outline-none transition-all placeholder-slate-600" 
                              type="text" 
                              value={formData.companyName}
                              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-400">Registration Number</label>
                            <input 
                              className="w-full bg-[#0B1116] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#f59e0b]/50 focus:border-[#f59e0b] outline-none transition-all placeholder-slate-600" 
                              type="text" 
                              value={formData.registrationNumber}
                              onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})}
                            />
                          </div>
                          <div className="flex flex-col gap-2 md:col-span-2">
                            <label className="text-sm font-medium text-slate-400">Description of Services</label>
                            <textarea 
                              className="w-full bg-[#0B1116] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#f59e0b]/50 focus:border-[#f59e0b] outline-none transition-all placeholder-slate-600 resize-none" 
                              rows={4} 
                              value={formData.description}
                              onChange={(e) => setFormData({...formData, description: e.target.value})}
                            />
                            <p className="text-xs text-slate-600 text-right">{formData.description.length}/500 characters</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Contact Info Tab */}
                    {activeTab === 'contact' && (
                      <div className="bg-[#151F26] rounded-2xl p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] border border-white/5">
                        <h3 className="text-lg font-bold text-white mb-6">Contact & Location</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-400">Primary Email</label>
                            <div className="relative">
                              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-lg">mail</span>
                              <input 
                                className="w-full bg-[#0B1116] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-[#f59e0b]/50 focus:border-[#f59e0b] outline-none transition-all placeholder-slate-600" 
                                type="email" 
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-400">Phone Number</label>
                            <div className="relative">
                              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-lg">call</span>
                              <input 
                                className="w-full bg-[#0B1116] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-[#f59e0b]/50 focus:border-[#f59e0b] outline-none transition-all placeholder-slate-600" 
                                type="tel" 
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 md:col-span-2">
                            <label className="text-sm font-medium text-slate-400">Address</label>
                            <div className="relative">
                              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-lg">location_on</span>
                              <input 
                                className="w-full bg-[#0B1116] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-[#f59e0b]/50 focus:border-[#f59e0b] outline-none transition-all placeholder-slate-600" 
                                type="text" 
                                value={formData.address}
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-400">City</label>
                            <input 
                              className="w-full bg-[#0B1116] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#f59e0b]/50 focus:border-[#f59e0b] outline-none transition-all placeholder-slate-600" 
                              type="text" 
                              value={formData.city}
                              onChange={(e) => setFormData({...formData, city: e.target.value})}
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-400">Zip Code</label>
                            <input 
                              className="w-full bg-[#0B1116] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#f59e0b]/50 focus:border-[#f59e0b] outline-none transition-all placeholder-slate-600" 
                              type="text" 
                              value={formData.zipCode}
                              onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Services Tab */}
                    {activeTab === 'services' && (
                      <>
                        <div className="bg-[#151F26] rounded-2xl p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] border border-white/5">
                          <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white">Operating Regions</h3>
                            <button className="text-[#f59e0b] text-sm font-medium hover:text-[#d97706] transition-colors cursor-pointer bg-transparent border-none">
                              Manage Areas
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {regions.map((region, i) => (
                              <div key={i} className="bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/30 px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-[#f59e0b]/20 transition-colors">
                                {region}
                                <button 
                                  onClick={() => setRegions(regions.filter((_, idx) => idx !== i))}
                                  className="hover:text-white cursor-pointer bg-transparent border-none flex items-center"
                                >
                                  <span className="material-symbols-outlined text-base">close</span>
                                </button>
                              </div>
                            ))}
                            <button className="bg-[#0B1116] border-2 border-dashed border-white/10 hover:border-[#f59e0b]/50 hover:text-[#f59e0b] text-slate-500 px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all cursor-pointer">
                              <span className="material-symbols-outlined text-base">add</span>
                              Add Region
                            </button>
                          </div>
                        </div>

                        <div className="bg-[#151F26] rounded-2xl p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] border border-white/5">
                          <h3 className="text-lg font-bold text-white mb-6">Accepted E-Waste Types</h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {allWasteTypes.map((type, i) => (
                              <label key={i} className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center">
                                  <input 
                                    checked={wasteTypes.includes(type)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setWasteTypes([...wasteTypes, type]);
                                      } else {
                                        setWasteTypes(wasteTypes.filter(t => t !== type));
                                      }
                                    }}
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-white/10 bg-[#0B1116] transition-all checked:border-[#f59e0b] checked:bg-[#f59e0b] hover:border-[#f59e0b]/50" 
                                    type="checkbox"
                                  />
                                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 material-symbols-outlined text-sm font-bold">check</span>
                                </div>
                                <span className="text-sm text-white group-hover:text-[#f59e0b] transition-colors">{type}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="bg-[#151F26] rounded-2xl p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] border border-white/5">
                          <h3 className="text-lg font-bold text-white mb-4">Operating Hours</h3>
                          <div className="grid grid-cols-1 gap-3">
                            {[
                              { day: 'Monday - Friday', time: '8:00 AM - 6:00 PM' },
                              { day: 'Saturday', time: '9:00 AM - 2:00 PM' },
                              { day: 'Sunday', time: 'Closed' }
                            ].map((schedule, i) => (
                              <div key={i} className="flex items-center justify-between p-4 bg-[#0B1116] rounded-xl border border-white/5 hover:border-white/10 transition-colors group">
                                <span className="text-sm text-white font-medium">{schedule.day}</span>
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="text" 
                                    defaultValue={schedule.time}
                                    className="w-40 bg-transparent text-right text-sm text-slate-400 outline-none group-hover:text-white transition-colors focus:text-[#f59e0b]"
                                  />
                                  <span className="material-symbols-outlined text-slate-600 group-hover:text-slate-400 text-lg cursor-pointer">edit</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

              </div>
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AgencyProfile;
