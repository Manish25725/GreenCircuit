import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
import { api, getCurrentUser, User } from '../services/api';

interface Business {
  _id?: string;
  companyName?: string;
  contactPersonName?: string;
  contactPersonRole?: string;
  phone?: string;
  email?: string;
  logo?: string;
}

const BusinessContact = () => {
  const [user, setUser] = useState<User | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    contactPersonName: '',
    contactPersonRole: '',
    phone: '',
    email: ''
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
        contactPersonName: businessData.contactPersonName || '',
        contactPersonRole: businessData.contactPersonRole || '',
        phone: businessData.phone || '',
        email: businessData.email || ''
      });
    } catch (error) {
      console.error('Failed to load business profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      alert('Contact information updated successfully!');
    } catch (error) {
      console.error('Failed to update contact information:', error);
      alert('Failed to update contact information. Please try again.');
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
          <Loader size="md" color="#06b6d4" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="" role="Business" fullWidth hideSidebar>
      <div className="bg-[#0B1116] font-sans text-gray-200 antialiased selection:bg-[#06b6d4] selection:text-white min-h-screen">
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
          <div className="fixed top-0 left-0 w-full h-[500px] bg-[#06b6d4]/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
          <div className="fixed bottom-0 right-0 w-full h-[500px] bg-[#8b5cf6]/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none"></div>
          
          <div className="layout-container flex h-full grow flex-col relative z-10">
            {/* Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-md">
              <div className="flex items-center gap-3 text-white cursor-pointer" onClick={() => window.location.hash = '#/business'}>
                <div className="p-2 bg-[#06b6d4]/10 rounded-lg">
                  <svg className="h-6 w-6 text-[#06b6d4]" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"></path>
                  </svg>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white">EcoCycle <span className="text-[#06b6d4]">Business</span></h2>
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
                  className="flex items-center gap-2 text-[#06b6d4] hover:text-[#0891b2] transition-colors mb-6 group"
                >
                  <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                  <span className="text-sm font-medium">Back to Settings</span>
                </button>

                {/* Page Header */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-[#06b6d4]/10 rounded-lg">
                      <span className="material-symbols-outlined text-[#06b6d4] text-[28px]">contact_page</span>
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-white">Contact Information</h1>
                      <p className="text-slate-400 text-sm">Update contact person and communication details</p>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <form onSubmit={handleSubmit} className="bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5">
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-1 mb-2">
                      <h3 className="text-white text-lg font-bold leading-tight">Primary Contact Details</h3>
                      <p className="text-[#94a3b8] text-sm">Who should we contact regarding e-waste pickups and inquiries?</p>
                    </div>

                    <div className="flex flex-col gap-6">
                      {/* Contact Person Name and Role */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="flex flex-col w-full">
                          <span className="text-white text-sm font-medium leading-normal pb-2">Contact Person Name *</span>
                          <input
                            type="text"
                            name="contactPersonName"
                            value={formData.contactPersonName}
                            onChange={handleInputChange}
                            required
                            className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all"
                            placeholder="Enter contact person name"
                          />
                        </label>
                        <label className="flex flex-col w-full">
                          <span className="text-white text-sm font-medium leading-normal pb-2">Role/Position *</span>
                          <input
                            type="text"
                            name="contactPersonRole"
                            value={formData.contactPersonRole}
                            onChange={handleInputChange}
                            required
                            className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all"
                            placeholder="e.g., Facility Manager"
                          />
                        </label>
                      </div>

                      {/* Phone and Email */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="flex flex-col w-full">
                          <span className="text-white text-sm font-medium leading-normal pb-2">Phone Number *</span>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all"
                            placeholder="+1 (555) 000-0000"
                          />
                        </label>
                        <label className="flex flex-col w-full">
                          <span className="text-white text-sm font-medium leading-normal pb-2">Email Address *</span>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all"
                            placeholder="contact@company.com"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-[#06b6d4]/10 border border-[#06b6d4]/30 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-[#06b6d4] text-[20px] mt-0.5">info</span>
                        <div className="flex-1">
                          <p className="text-[#06b6d4] text-sm font-medium mb-1">Contact Information Usage</p>
                          <p className="text-slate-400 text-xs leading-relaxed">
                            This contact information will be used by our partner agencies to coordinate e-waste pickups and communicate important updates about your account.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
                      <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-[#0B1116] border border-white/5 text-gray-200 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-white/5 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-[#06b6d4] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#0891b2] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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

export default BusinessContact;
