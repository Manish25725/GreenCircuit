import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { api, getCurrentUser } from '../services/api';

const AgencyProfile = () => {
  const [user, setUser] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('company');
  const [formData, setFormData] = useState({
    companyName: 'EcoCycle Agency',
    registrationNumber: 'REG-882910-NY',
    description: 'Specializing in secure data destruction and environmentally friendly e-waste recycling for businesses and individuals.',
    email: 'admin@ecocycle.com',
    phone: '+1 (555) 123-4567',
    address: '123 Green Tech Blvd, Sustainability District',
    city: 'New York',
    zipCode: '10001'
  });
  const [regions, setRegions] = useState(['Manhattan', 'Brooklyn', 'Queens']);
  const [wasteTypes, setWasteTypes] = useState(['IT Equipment', 'Mobile Devices', 'Large Appliances']);
  const [certifications] = useState([
    { name: 'ISO 14001', type: 'Environmental Mgmt', icon: 'eco', color: 'text-green-400' },
    { name: 'R2 Certified', type: 'Responsible Recycling', icon: 'security', color: 'text-blue-400' }
  ]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Show success
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setSaving(false);
    }
  };

  const allWasteTypes = ['IT Equipment', 'Mobile Devices', 'Large Appliances', 'Batteries', 'Industrial Machinery', 'Solar Panels'];

  return (
    <Layout title="" role="Agency" fullWidth hideSidebar>
      <div className="min-h-screen bg-[#0a0a0a]">
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => window.location.hash = '#/agency'}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-white">arrow_back</span>
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-xl">badge</span>
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-white">Agency Profile</h1>
                    <p className="text-xs text-gray-400">EcoCycle Partner</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-gray-300 text-sm cursor-pointer">
                  <span className="material-symbols-outlined text-lg">visibility</span>
                  Preview
                </button>
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 transition-colors text-black font-bold text-sm cursor-pointer disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-lg">save</span>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - Profile Card */}
            <div className="flex flex-col gap-6">
              {/* Profile Picture Card */}
              <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl flex flex-col items-center text-center gap-4">
                <div className="relative group">
                  <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-amber-500/20 shadow-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-5xl text-amber-400">corporate_fare</span>
                  </div>
                  <button className="absolute -bottom-2 -right-2 bg-amber-500 text-black rounded-xl p-2 hover:bg-amber-400 transition shadow-lg cursor-pointer">
                    <span className="material-symbols-outlined text-lg">edit</span>
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{formData.companyName}</h3>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="material-symbols-outlined text-amber-400 text-sm">verified</span>
                    <p className="text-sm text-amber-400">Verified Partner</p>
                  </div>
                </div>
                <div className="w-full h-px bg-white/5 my-2"></div>
                <div className="flex flex-col w-full gap-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Member Since</span>
                    <span className="text-white">Oct 2022</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Rating</span>
                    <span className="text-amber-400 flex items-center gap-1">4.9 <span className="material-symbols-outlined text-sm fill">star</span></span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total Pickups</span>
                    <span className="text-white">1,245</span>
                  </div>
                </div>
              </div>

              {/* Certifications Card */}
              <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl flex flex-col gap-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-400">verified_user</span>
                  Certifications
                </h3>
                <div className="flex flex-col gap-3">
                  {certifications.map((cert, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <span className={`material-symbols-outlined ${cert.color}`}>{cert.icon}</span>
                        <div>
                          <p className="text-sm font-medium text-white">{cert.name}</p>
                          <p className="text-xs text-gray-400">{cert.type}</p>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-gray-500 cursor-pointer hover:text-white">more_vert</span>
                    </div>
                  ))}
                  <button className="w-full py-2.5 text-sm font-medium text-amber-400 border border-amber-500/30 rounded-xl hover:bg-amber-500/10 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                    <span className="material-symbols-outlined text-lg">add</span>
                    Add Certification
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl">
                <h3 className="text-base font-bold text-white mb-4">Performance</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Response Rate</span>
                      <span className="text-white">98%</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="w-[98%] h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Completion Rate</span>
                      <span className="text-white">95%</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="w-[95%] h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Customer Satisfaction</span>
                      <span className="text-white">97%</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="w-[97%] h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Forms */}
            <div className="flex flex-col gap-6 xl:col-span-2">
              {/* Tabs */}
              <div className="flex items-center gap-2 p-1 bg-white/[0.02] border border-white/10 rounded-2xl w-fit">
                {[
                  { key: 'company', label: 'Company Details', icon: 'business' },
                  { key: 'contact', label: 'Contact Info', icon: 'contact_mail' },
                  { key: 'services', label: 'Services', icon: 'settings' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                      activeTab === tab.key
                        ? 'bg-amber-500 text-black'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Company Details Tab */}
              {activeTab === 'company' && (
                <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl">
                  <h3 className="text-lg font-bold text-white mb-6">Company Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-400">Company Name</label>
                      <input 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-gray-600" 
                        type="text" 
                        value={formData.companyName}
                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-400">Registration Number</label>
                      <input 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-gray-600" 
                        type="text" 
                        value={formData.registrationNumber}
                        onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})}
                      />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-sm font-medium text-gray-400">Description of Services</label>
                      <textarea 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-gray-600 resize-none" 
                        rows={4} 
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                      />
                      <p className="text-xs text-gray-500 text-right">{formData.description.length}/500 characters</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Info Tab */}
              {activeTab === 'contact' && (
                <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl">
                  <h3 className="text-lg font-bold text-white mb-6">Contact & Location</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-400">Primary Email</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg">mail</span>
                        <input 
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-gray-600" 
                          type="email" 
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-400">Phone Number</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg">call</span>
                        <input 
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-gray-600" 
                          type="tel" 
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-sm font-medium text-gray-400">Address</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg">location_on</span>
                        <input 
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-gray-600" 
                          type="text" 
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-400">City</label>
                      <input 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-gray-600" 
                        type="text" 
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-400">Zip Code</label>
                      <input 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-gray-600" 
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
                  <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-white">Operating Regions</h3>
                      <button className="text-amber-400 text-sm font-medium hover:underline cursor-pointer bg-transparent border-none">
                        Manage Areas
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {regions.map((region, i) => (
                        <div key={i} className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
                          {region}
                          <button 
                            onClick={() => setRegions(regions.filter((_, idx) => idx !== i))}
                            className="hover:text-white cursor-pointer bg-transparent border-none flex items-center"
                          >
                            <span className="material-symbols-outlined text-base">close</span>
                          </button>
                        </div>
                      ))}
                      <button className="bg-white/5 border border-white/10 border-dashed hover:border-amber-500 hover:text-amber-400 text-gray-400 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 transition-colors cursor-pointer">
                        <span className="material-symbols-outlined text-base">add</span>
                        Add Region
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl">
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
                              className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-white/10 bg-white/5 transition-all checked:border-amber-500 checked:bg-amber-500 hover:border-amber-500/50" 
                              type="checkbox"
                            />
                            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-black opacity-0 peer-checked:opacity-100 material-symbols-outlined text-sm font-bold">check</span>
                          </div>
                          <span className="text-sm text-white group-hover:text-amber-400 transition-colors">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-4">Operating Hours</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['Monday - Friday', 'Saturday', 'Sunday'].map((day, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                          <span className="text-sm text-white">{day}</span>
                          <div className="flex items-center gap-2">
                            <input 
                              type="text" 
                              defaultValue={i === 2 ? 'Closed' : i === 1 ? '9:00 AM - 2:00 PM' : '8:00 AM - 6:00 PM'}
                              className="w-36 bg-transparent text-right text-sm text-gray-300 outline-none focus:text-amber-400"
                            />
                            <span className="material-symbols-outlined text-gray-500 text-lg">edit</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default AgencyProfile;
