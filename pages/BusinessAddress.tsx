import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { api, getCurrentUser, User } from '../services/api';

interface Business {
  _id?: string;
  companyName?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  logo?: string;
}

const BusinessAddress = () => {
  const [user, setUser] = useState<User | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    loadBusinessProfile();
  }, []);

  const loadBusinessProfile = async () => {
    try {
      setLoading(true);
      const response = await api.getBusinessProfile();
      const businessData = response.data || response;
      setBusiness(businessData);
      setFormData({
        address: businessData.address || '',
        city: businessData.city || '',
        state: businessData.state || '',
        zipCode: businessData.zipCode || '',
        country: businessData.country || ''
      });
    } catch (error) {
      console.error('Failed to load business profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.updateBusinessProfile(formData);
      alert('Business address updated successfully!');
    } catch (error) {
      console.error('Failed to update business address:', error);
      alert('Failed to update business address. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.hash = '#/login';
  };

  if (loading) {
    return (
      <Layout title="" role="Business" fullWidth hideSidebar>
        <div className="flex items-center justify-center min-h-screen bg-[#0B1116]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#06b6d4]"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="" role="Business" fullWidth hideSidebar>
      <div className="bg-[#0B1116] font-sans text-gray-200 antialiased selection:bg-[#06b6d4] selection:text-white min-h-screen">
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
          <div className="fixed top-0 left-0 w-full h-[500px] bg-[#f59e0b]/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
          <div className="fixed bottom-0 right-0 w-full h-[500px] bg-[#8b5cf6]/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none"></div>
          
          <div className="layout-container flex h-full grow flex-col relative z-10">
            {/* Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-md">
              <div className="flex items-center gap-3 text-white cursor-pointer" onClick={() => window.location.hash = '#/business'}>
                <div className="p-2 bg-[#f59e0b]/10 rounded-lg">
                  <svg className="h-6 w-6 text-[#f59e0b]" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"></path>
                  </svg>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white">EcoCycle <span className="text-[#f59e0b]">Business</span></h2>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center size-10 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-colors"
                >
                  <span className="material-symbols-outlined text-red-400">logout</span>
                </button>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex flex-1 justify-center py-5 px-4 sm:px-6 lg:px-10">
              <div className="layout-content-container flex flex-col w-full max-w-4xl">
                {/* Back Button */}
                <button 
                  onClick={() => window.history.back()}
                  className="flex items-center gap-2 text-[#f59e0b] hover:text-[#d97706] transition-colors mb-6 group"
                >
                  <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                  <span className="text-sm font-medium">Back to Settings</span>
                </button>

                {/* Page Header */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-[#f59e0b]/10 rounded-lg">
                      <span className="material-symbols-outlined text-[#f59e0b] text-[28px]">location_on</span>
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-white">Business Address</h1>
                      <p className="text-gray-400 text-sm">Manage your business location details</p>
                    </div>
                  </div>
                </div>

                {/* Address Form */}
                <form onSubmit={handleSubmit} className="bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5">
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-1 mb-2">
                      <h3 className="text-white text-lg font-bold leading-tight">Address Information</h3>
                      <p className="text-[#94a3b8] text-sm">Update your business address and location details</p>
                    </div>

                    <div className="flex flex-col gap-6">
                      {/* Street Address */}
                      <label className="flex flex-col w-full">
                        <span className="text-white text-sm font-medium leading-normal pb-2">Street Address</span>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#f59e0b] focus:border-[#f59e0b] transition-all resize-none"
                          placeholder="Enter your business street address"
                        />
                      </label>

                      {/* City and State */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="flex flex-col w-full">
                          <span className="text-white text-sm font-medium leading-normal pb-2">City</span>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#f59e0b] focus:border-[#f59e0b] transition-all"
                            placeholder="Enter city"
                          />
                        </label>
                        <label className="flex flex-col w-full">
                          <span className="text-white text-sm font-medium leading-normal pb-2">State/Province</span>
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#f59e0b] focus:border-[#f59e0b] transition-all"
                            placeholder="Enter state/province"
                          />
                        </label>
                      </div>

                      {/* Zip Code and Country */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="flex flex-col w-full">
                          <span className="text-white text-sm font-medium leading-normal pb-2">ZIP/Postal Code</span>
                          <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#f59e0b] focus:border-[#f59e0b] transition-all"
                            placeholder="Enter ZIP/postal code"
                          />
                        </label>
                        <label className="flex flex-col w-full">
                          <span className="text-white text-sm font-medium leading-normal pb-2">Country</span>
                          <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#f59e0b] focus:border-[#f59e0b] transition-all"
                            placeholder="Enter country"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
                      <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-[#0B1116] border border-white/10 text-gray-300 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-white/5 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-[#f59e0b] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#d97706] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BusinessAddress;
