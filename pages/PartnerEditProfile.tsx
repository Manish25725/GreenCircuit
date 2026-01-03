import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
import NotificationBell from '../components/NotificationBell';
import { api, getCurrentUser, User } from '../services/api';

interface PartnerProfile {
  _id?: string;
  name?: string;
  email?: string;
  companyName?: string;
  registrationNumber?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  logo?: string;
  description?: string;
  services?: string;
}

const PartnerEditProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<PartnerProfile | null>(null);
  const [avatarKey, setAvatarKey] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    companyName: '',
    registrationNumber: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    description: '',
    services: ''
  });
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    loadPartnerProfile();
    
    // Listen for user updates (logo/avatar changes)
    const handleUserUpdate = () => {
      const updatedUser = getCurrentUser();
      setUser(updatedUser);
      setAvatarKey(Date.now());
      loadPartnerProfile();
    };
    
    window.addEventListener('userUpdated', handleUserUpdate);
    window.addEventListener('storage', handleUserUpdate);
    
    return () => {
      window.removeEventListener('userUpdated', handleUserUpdate);
      window.removeEventListener('storage', handleUserUpdate);
    };
  }, []);

  const loadPartnerProfile = async () => {
    try {
      setLoading(true);
      const response = await api.getAgencyProfile() as any;
      const profileData = response.data || response;
      
      setProfile(profileData);
      
      // Handle address - can be string or object
      let addressStr = '';
      let city = '';
      let state = '';
      let zipCode = '';
      let country = 'India';
      
      if (profileData.address) {
        if (typeof profileData.address === 'string') {
          addressStr = profileData.address;
        } else if (typeof profileData.address === 'object') {
          addressStr = profileData.address.street || '';
          city = profileData.address.city || '';
          state = profileData.address.state || '';
          zipCode = profileData.address.zipCode || '';
          country = profileData.address.country || 'India';
        }
      }
      
      setFormData({
        name: profileData.name || '',
        email: profileData.email || '',
        companyName: profileData.companyName || '',
        registrationNumber: profileData.registrationNumber || '',
        phone: profileData.phone || '',
        address: addressStr,
        city: city,
        state: state,
        zipCode: zipCode,
        country: country,
        description: profileData.description || '',
        services: profileData.services || ''
      });
      // Set logo preview with cache busting if URL exists
      const logoUrl = profileData.logo ? `${profileData.logo}?t=${Date.now()}` : '';
      setLogoPreview(logoUrl);
    } catch (error) {
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
      
      // Preview the image locally first
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('upload_preset', 'ecocycle_uploads');

      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      if (!cloudName) {
        throw new Error('Cloudinary cloud name not configured');
      }

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: uploadFormData
        }
      );

      if (!response.ok) {
        throw new Error('Cloudinary upload failed');
      }

      const data = await response.json();
      
      if (data.secure_url) {
        // Update logo in backend immediately
        await api.updateAgencyProfile({ logo: data.secure_url });
        
        // Update local storage with both avatar and logo
        const currentUser = getCurrentUser();
        if (currentUser) {
          (currentUser as any).avatar = data.secure_url;
          (currentUser as any).logo = data.secure_url;
          localStorage.setItem('user', JSON.stringify(currentUser));
        }
        
        // Trigger reload by dispatching custom event
        window.dispatchEvent(new Event('userUpdated'));
        window.dispatchEvent(new Event('storage'));
        
        // Refresh avatar key
        setAvatarKey(Date.now());
        setLogoPreview(data.secure_url);
        
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      setErrorMessage('Failed to upload logo. Please try again.');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.companyName || !formData.email || !formData.phone) {
      setErrorMessage('Please fill in all required fields');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    try {
      setSaving(true);
      
      const updateData = {
        name: formData.name,
        companyName: formData.companyName,
        registrationNumber: formData.registrationNumber,
        phone: formData.phone,
        address: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        description: formData.description,
        services: formData.services
      };

      const response = await api.updateAgencyProfile(updateData);
      
      // Update localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        const updatedUser = { ...userData, ...response };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      // Show success notification
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Reload profile data
      await loadPartnerProfile();
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Failed to update profile. Please try again.';
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
      <Layout title="" role="Partner" fullWidth hideSidebar>
        <div className="flex items-center justify-center min-h-screen bg-[#0B1116]">
          <Loader size="md" color="#8b5cf6" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="" role="Partner" fullWidth hideSidebar>
      <div className="bg-[#0B1116] font-sans text-gray-200 antialiased selection:bg-[#8b5cf6] selection:text-white min-h-screen">
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
          <div className="fixed top-0 left-0 w-full h-[500px] bg-[#8b5cf6]/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
          <div className="fixed bottom-0 right-0 w-full h-[500px] bg-[#3b82f6]/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none"></div>
          
          <div className="layout-container flex h-full grow flex-col relative z-10">
            {/* Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-md">
              <div className="flex items-center gap-3 text-white cursor-pointer" onClick={() => window.location.hash = '#/agency/dashboard'}>
                <div className="p-2 bg-[#8b5cf6]/10 rounded-lg">
                  <svg className="h-6 w-6 text-[#8b5cf6]" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"></path>
                  </svg>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white">EcoCycle <span className="text-[#8b5cf6] font-semibold">Partner</span></h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <button 
                    onClick={() => window.location.hash = '#/profile'}
                    className="hidden sm:flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-[#151F26] border border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <div 
                      className="size-8 rounded-full bg-cover bg-center ring-2 ring-white/10 group-hover:ring-[#8b5cf6]/50 transition-all" 
                      style={{ backgroundImage: `url("${profile?.logo || user?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'Partner') + '&background=8b5cf6&color=fff'}${(profile?.logo || user?.avatar) ? '?t=' + avatarKey : ''}")`}}
                    ></div>
                    <span className="text-sm font-medium text-gray-200">{formData.companyName || user?.name || 'Partner'}</span>
                  </button>
                  {/* Hover Preview */}
                  <div className="absolute top-14 right-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100]">
                    <div className="bg-[#151F26] border border-white/5 rounded-2xl p-4 shadow-2xl">
                      <div 
                        className="size-32 rounded-xl bg-cover bg-center ring-4 ring-[#8b5cf6]/30" 
                        style={{ backgroundImage: `url("${profile?.logo || user?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'Partner') + '&background=8b5cf6&color=fff'}${(profile?.logo || user?.avatar) ? '?t=' + avatarKey : ''}")`}}
                      ></div>
                    </div>
                  </div>
                </div>
                <NotificationBell />
              </div>
            </header>

            {/* Main Content */}
            <main className="flex flex-1 justify-center py-5 px-4 sm:px-6 lg:px-10">
              <div className="layout-content-container flex flex-col w-full max-w-5xl">
                {/* Back Button */}
                <button 
                  onClick={() => window.history.back()}
                  className="flex items-center gap-2 text-[#8b5cf6] hover:text-[#7c3aed] transition-colors mb-6 group"
                >
                  <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                  <span className="text-sm font-medium">Back to Settings</span>
                </button>

                {/* Page Header */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-[#8b5cf6]/10 rounded-lg">
                      <span className="material-symbols-outlined text-[#8b5cf6] text-[28px]">business</span>
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-white">Edit Company Profile</h1>
                      <p className="text-slate-400 text-sm mt-1">Update your company information and details</p>
                    </div>
                  </div>
                </div>

                {/* Profile Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Logo Section */}
                  <div className="bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5">
                    <div className="flex flex-col gap-6">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#8b5cf6]">business_center</span>
                        <h3 className="text-white text-lg font-bold">Company Logo</h3>
                      </div>
                      <div className="flex flex-col items-center gap-6 p-6 bg-[#0B1116] rounded-xl border border-white/5">
                        <div className="relative group">
                          <div 
                            className="size-40 rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] flex items-center justify-center ring-4 ring-[#8b5cf6]/20 text-white font-bold text-5xl overflow-hidden shadow-lg shadow-[#8b5cf6]/20 transition-all group-hover:ring-[#8b5cf6]/40"
                            style={logoPreview ? { backgroundImage: `url(${logoPreview})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                          >
                            {!logoPreview && (formData.companyName?.charAt(0)?.toUpperCase() || 'P')}
                          </div>
                          <label 
                            htmlFor="logo" 
                            className="absolute bottom-2 right-2 size-12 rounded-xl bg-[#8b5cf6] border-4 border-[#0B1116] flex items-center justify-center cursor-pointer hover:bg-[#7c3aed] transition-all shadow-lg hover:scale-110 group"
                          >
                            {uploadingLogo ? (
                              <Loader size="sm" color="white" />
                            ) : (
                              <span className="material-symbols-outlined text-white text-[24px]">photo_camera</span>
                            )}
                            <input
                              type="file"
                              id="logo"
                              accept="image/*"
                              onChange={handleLogoChange}
                              className="hidden"
                              disabled={uploadingLogo}
                            />
                          </label>
                        </div>
                        <div className="text-center">
                          <p className="text-white text-sm font-medium mb-1">Upload Company Logo</p>
                          <p className="text-slate-400 text-xs">
                            {uploadingLogo ? 'Uploading to cloud...' : 'Click the camera icon • Square image • Min 256x256px'}
                          </p>
                          <div className="flex items-center justify-center gap-2 mt-3">
                            <span className="px-3 py-1 bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 rounded-full text-[#8b5cf6] text-xs font-medium">JPG</span>
                            <span className="px-3 py-1 bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 rounded-full text-[#8b5cf6] text-xs font-medium">PNG</span>
                            <span className="px-3 py-1 bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 rounded-full text-[#8b5cf6] text-xs font-medium">SVG</span>
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
                            className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] transition-all"
                            placeholder="Enter company name"
                          />
                        </label>
                        <label className="flex flex-col w-full">
                          <span className="text-white text-sm font-medium pb-2">Registration Number</span>
                          <input
                            type="text"
                            name="registrationNumber"
                            value={formData.registrationNumber}
                            onChange={handleInputChange}
                            className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] transition-all"
                            placeholder="Business registration number"
                          />
                        </label>
                        <label className="flex flex-col w-full">
                          <span className="text-white text-sm font-medium pb-2">Contact Person</span>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] transition-all"
                            placeholder="Contact person name"
                          />
                        </label>
                        <label className="flex flex-col w-full">
                          <span className="text-white text-sm font-medium pb-2">Email *</span>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            disabled
                            className="w-full h-12 px-3 py-2 bg-[#0B1116]/50 border rounded-xl border-white/5 text-slate-400 cursor-not-allowed"
                            placeholder="Email address"
                          />
                        </label>
                        <label className="flex flex-col w-full md:col-span-2">
                          <span className="text-white text-sm font-medium pb-2">Phone Number *</span>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] transition-all"
                            placeholder="Contact phone number"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5">
                    <div className="flex flex-col gap-6">
                      <h3 className="text-white text-lg font-bold">Address</h3>
                      
                      <div className="grid grid-cols-1 gap-6">
                        <label className="flex flex-col w-full">
                          <span className="text-white text-sm font-medium pb-2">Street Address</span>
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] transition-all"
                            placeholder="Street address"
                          />
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <label className="flex flex-col w-full">
                            <span className="text-white text-sm font-medium pb-2">City</span>
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] transition-all"
                              placeholder="City"
                            />
                          </label>
                          <label className="flex flex-col w-full">
                            <span className="text-white text-sm font-medium pb-2">State</span>
                            <input
                              type="text"
                              name="state"
                              value={formData.state}
                              onChange={handleInputChange}
                              className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] transition-all"
                              placeholder="State"
                            />
                          </label>
                          <label className="flex flex-col w-full">
                            <span className="text-white text-sm font-medium pb-2">ZIP Code</span>
                            <input
                              type="text"
                              name="zipCode"
                              value={formData.zipCode}
                              onChange={handleInputChange}
                              className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] transition-all"
                              placeholder="ZIP code"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* About Company */}
                  <div className="bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5">
                    <div className="flex flex-col gap-6">
                      <h3 className="text-white text-lg font-bold">About Company</h3>
                      
                      <label className="flex flex-col w-full">
                        <span className="text-white text-sm font-medium pb-2">Company Description</span>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] transition-all resize-none"
                          placeholder="Tell us about your recycling company..."
                        />
                      </label>

                      <label className="flex flex-col w-full">
                        <span className="text-white text-sm font-medium pb-2">Services Offered</span>
                        <textarea
                          name="services"
                          value={formData.services}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] transition-all resize-none"
                          placeholder="List the services you provide (e.g., E-waste collection, Electronics recycling...)"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => window.history.back()}
                      className="h-12 px-6 rounded-xl bg-[#151F26] border border-white/5 text-white font-semibold hover:bg-white/5 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="h-12 px-8 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-semibold transition-all shadow-lg shadow-[#8b5cf6]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <Loader size="sm" color="white" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[20px]">save</span>
                          <span>Save Changes</span>
                        </>
                      )}
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

export default PartnerEditProfile;
