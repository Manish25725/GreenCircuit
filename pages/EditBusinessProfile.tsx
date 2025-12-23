import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { api, getCurrentUser, User } from '../services/api';

interface Business {
  _id?: string;
  companyName?: string;
  description?: string;
  logo?: string;
  industry?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  contactPersonName?: string;
  contactPersonRole?: string;
  contactPersonEmail?: string;
  contactPersonPhone?: string;
  sustainabilityGoals?: string;
}

const EditBusinessProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [formData, setFormData] = useState({
    companyName: '',
    description: '',
    industry: 'Technology',
    email: '',
    phone: '',
    website: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    contactPersonName: '',
    contactPersonRole: '',
    contactPersonEmail: '',
    contactPersonPhone: '',
    sustainabilityGoals: ''
  });
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [uploadingLogo, setUploadingLogo] = useState(false);

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
        companyName: businessData.companyName || '',
        description: businessData.description || '',
        industry: businessData.industry || 'Technology',
        email: businessData.email || '',
        phone: businessData.phone || '',
        website: businessData.website || '',
        address: businessData.address || '',
        city: businessData.city || '',
        state: businessData.state || '',
        zipCode: businessData.zipCode || '',
        country: businessData.country || 'India',
        contactPersonName: businessData.contactPersonName || '',
        contactPersonRole: businessData.contactPersonRole || '',
        contactPersonEmail: businessData.contactPersonEmail || '',
        contactPersonPhone: businessData.contactPersonPhone || '',
        sustainabilityGoals: businessData.sustainabilityGoals || ''
      });
      setLogoPreview(businessData.logo || '');
    } catch (error) {
      console.error('Failed to load business profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select an image file');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size should be less than 5MB');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    try {
      setUploadingLogo(true);
      
      // Store the old logo URL before uploading new one
      const oldLogo = business?.logo || logoPreview;
      
      // Preview the image locally first
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ecocycle_uploads');

      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dideet7oz/image/upload',
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error('Cloudinary upload failed');
      }

      const data = await response.json();
      
      if (data.secure_url) {
        // Update the logo preview with Cloudinary URL
        setLogoPreview(data.secure_url);
        
        // Immediately save the logo to profile
        // The backend will automatically delete the old logo if it exists
        try {
          const updatedBusiness = await api.updateBusinessProfile({ logo: data.secure_url });
          
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
          
          // Reload profile data
          await loadBusinessProfile();
        } catch (apiError) {
          console.error('Failed to save logo to profile:', apiError);
          setErrorMessage('Logo uploaded but failed to save to profile. Please try saving your profile.');
          setTimeout(() => setErrorMessage(''), 5000);
        }
      }
    } catch (error) {
      console.error('Failed to upload logo:', error);
      setErrorMessage('Failed to upload logo. Please try again.');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      setSaving(true);
      const updateData = { ...formData };
      if (logoPreview && logoPreview !== business?.logo) {
        updateData.logo = logoPreview;
      }
      const response = await api.updateBusinessProfile(updateData);
      console.log('Profile updated successfully:', response);
      
      // Show success notification
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Reload profile data
      await loadBusinessProfile();
    } catch (error: any) {
      console.error('Failed to update business profile:', error);
      const message = error?.response?.data?.message || error?.message || 'Failed to update business profile. Please try again.';
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(''), 5000);
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
        {/* Success Toast */}
        {showSuccess && (
          <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg backdrop-blur-sm">
              <span className="material-symbols-outlined text-green-400">check_circle</span>
              <span className="text-green-400 font-medium">Profile updated successfully!</span>
            </div>
          </div>
        )}

        {/* Error Toast */}
        {errorMessage && (
          <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg backdrop-blur-sm max-w-md">
              <span className="material-symbols-outlined text-red-400">error</span>
              <span className="text-red-400 font-medium">{errorMessage}</span>
            </div>
          </div>
        )}

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
              <div className="layout-content-container flex flex-col w-full max-w-5xl">
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
                      <span className="material-symbols-outlined text-[#06b6d4] text-[28px]">business</span>
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-white">Edit Business Profile</h1>
                      <p className="text-gray-400 text-sm">Update your company information, address, and contact details</p>
                    </div>
                  </div>
                </div>

                {/* Profile Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  {/* Company Logo */}
                  <div className="bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5">
                    <div className="flex flex-col gap-6">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#06b6d4]">image</span>
                        <h3 className="text-white text-lg font-bold">Company Logo</h3>
                      </div>
                      <div className="flex flex-col items-center gap-6 p-6 bg-[#0B1116] rounded-xl border border-white/5">
                        <div className="relative group">
                          <div 
                            className="size-40 rounded-2xl bg-gradient-to-br from-[#06b6d4] to-[#3b82f6] flex items-center justify-center ring-4 ring-[#06b6d4]/20 text-white font-bold text-5xl overflow-hidden shadow-lg shadow-[#06b6d4]/20 transition-all group-hover:ring-[#06b6d4]/40"
                            style={logoPreview ? { backgroundImage: `url(${logoPreview})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                          >
                            {!logoPreview && (formData.companyName?.charAt(0) || 'B')}
                          </div>
                          <label 
                            htmlFor="logo" 
                            className="absolute bottom-2 right-2 size-12 rounded-xl bg-[#06b6d4] border-4 border-[#0B1116] flex items-center justify-center cursor-pointer hover:bg-[#0891b2] transition-all shadow-lg hover:scale-110 group"
                          >
                            <span className="material-symbols-outlined text-white text-[24px]">photo_camera</span>
                            <input
                              type="file"
                              id="logo"
                              accept="image/*"
                              onChange={handleLogoChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                        <div className="text-center">
                          <p className="text-white text-sm font-medium mb-1">Upload Company Logo</p>
                          <p className="text-gray-400 text-xs">Click the camera icon • Square image • Min 256x256px</p>
                          <div className="flex items-center justify-center gap-2 mt-3">
                            <span className="px-3 py-1 bg-[#06b6d4]/10 border border-[#06b6d4]/30 rounded-full text-[#06b6d4] text-xs font-medium">JPG</span>
                            <span className="px-3 py-1 bg-[#06b6d4]/10 border border-[#06b6d4]/30 rounded-full text-[#06b6d4] text-xs font-medium">PNG</span>
                            <span className="px-3 py-1 bg-[#06b6d4]/10 border border-[#06b6d4]/30 rounded-full text-[#06b6d4] text-xs font-medium">SVG</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Company Information */}
                  <div className="bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5">
                    <div className="flex flex-col gap-6">
                      <h3 className="text-white text-lg font-bold">Company Information</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="flex flex-col w-full">
                          <span className="text-white text-sm font-medium pb-2">Company Name *</span>
                          <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            required
                            className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all"
                            placeholder="Enter company name"
                          />
                        </label>
                        <label className="flex flex-col w-full">
                          <span className="text-white text-sm font-medium pb-2">Industry *</span>
                          <select
                            name="industry"
                            value={formData.industry}
                            onChange={handleInputChange}
                            required
                            className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all"
                          >
                            <option value="Technology">Technology</option>
                            <option value="Manufacturing">Manufacturing</option>
                            <option value="Healthcare">Healthcare</option>
                            <option value="Retail">Retail</option>
                            <option value="Education">Education</option>
                            <option value="Finance">Finance</option>
                            <option value="Other">Other</option>
                          </select>
                        </label>
                      </div>

                      <label className="flex flex-col w-full">
                        <span className="text-white text-sm font-medium pb-2">Description</span>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all resize-none"
                          placeholder="Brief description of your company"
                        />
                      </label>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="flex flex-col w-full">
                          <span className="text-white text-sm font-medium pb-2">Email *</span>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all"
                            placeholder="company@example.com"
                          />
                        </label>
                        <label className="flex flex-col w-full">
                          <span className="text-white text-sm font-medium pb-2">Phone *</span>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all"
                            placeholder="+1 (555) 000-0000"
                          />
                        </label>
                      </div>

                      <label className="flex flex-col w-full">
                        <span className="text-white text-sm font-medium pb-2">Website</span>
                        <input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all"
                          placeholder="https://www.yourcompany.com"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Business Address */}
                  <div className="bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5">
                    <div className="flex flex-col gap-6">
                      <h3 className="text-white text-lg font-bold">Business Address</h3>
                      
                      <label className="flex flex-col w-full">
                        <span className="text-white text-sm font-medium pb-2">Street Address *</span>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          rows={2}
                          required
                          className="w-full px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all resize-none"
                          placeholder="Enter street address"
                        />
                      </label>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="flex flex-col w-full">
                          <span className="text-white text-sm font-medium pb-2">City *</span>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                            className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all"
                            placeholder="City"
                          />
                        </label>
                        <label className="flex flex-col w-full">
                          <span className="text-white text-sm font-medium pb-2">State/Province *</span>
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            required
                            className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all"
                            placeholder="State/Province"
                          />
                        </label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="flex flex-col w-full">
                          <span className="text-white text-sm font-medium pb-2">ZIP/Postal Code *</span>
                          <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            required
                            className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all"
                            placeholder="ZIP/Postal Code"
                          />
                        </label>
                        <label className="flex flex-col w-full">
                          <span className="text-white text-sm font-medium pb-2">Country *</span>
                          <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            required
                            className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all"
                            placeholder="Country"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Contact Person */}
                  <div className="bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5">
                    <div className="flex flex-col gap-6">
                      <h3 className="text-white text-lg font-bold">Contact Person</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="flex flex-col w-full">
                          <span className="text-white text-sm font-medium pb-2">Full Name *</span>
                          <input
                            type="text"
                            name="contactPersonName"
                            value={formData.contactPersonName}
                            onChange={handleInputChange}
                            required
                            className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all"
                            placeholder="Contact person name"
                          />
                        </label>
                        <label className="flex flex-col w-full">
                          <span className="text-white text-sm font-medium pb-2">Role/Position *</span>
                          <input
                            type="text"
                            name="contactPersonRole"
                            value={formData.contactPersonRole}
                            onChange={handleInputChange}
                            required
                            className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all"
                            placeholder="e.g., Facility Manager"
                          />
                        </label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="flex flex-col w-full">
                          <span className="text-white text-sm font-medium pb-2">Email *</span>
                          <input
                            type="email"
                            name="contactPersonEmail"
                            value={formData.contactPersonEmail}
                            onChange={handleInputChange}
                            required
                            className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all"
                            placeholder="contact@example.com"
                          />
                        </label>
                        <label className="flex flex-col w-full">
                          <span className="text-white text-sm font-medium pb-2">Phone *</span>
                          <input
                            type="tel"
                            name="contactPersonPhone"
                            value={formData.contactPersonPhone}
                            onChange={handleInputChange}
                            required
                            className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all"
                            placeholder="+1 (555) 000-0000"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Sustainability Goals */}
                  <div className="bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5">
                    <div className="flex flex-col gap-6">
                      <h3 className="text-white text-lg font-bold">Sustainability Goals</h3>
                      
                      <label className="flex flex-col w-full">
                        <span className="text-white text-sm font-medium pb-2">Your Sustainability Objectives</span>
                        <textarea
                          name="sustainabilityGoals"
                          value={formData.sustainabilityGoals}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all resize-none"
                          placeholder="Describe your company's sustainability goals and e-waste management objectives..."
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
                      className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-[#06b6d4] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#0891b2] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
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

export default EditBusinessProfile;
