import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
import NotificationBell from '../components/NotificationBell';
import { api, getCurrentUser, User } from '../services/api';

interface UserProfile {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  avatar?: string;
  ecoPoints?: number;
  totalWasteRecycled?: number;
  totalPickups?: number;
  sustainabilityGoals?: string;
}

const EditResidentProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    sustainabilityGoals: ''
  });
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const currentUser = getCurrentUser();
      if (currentUser) {
        setProfile(currentUser);
        
        // Handle address - can be string or object
        let addressStr = '';
        let city = '';
        let state = '';
        let zipCode = '';
        let country = 'India';
        
        if (currentUser.address) {
          if (typeof currentUser.address === 'string') {
            addressStr = currentUser.address;
          } else if (typeof currentUser.address === 'object') {
            addressStr = currentUser.address.street || '';
            city = currentUser.address.city || '';
            state = currentUser.address.state || '';
            zipCode = currentUser.address.zipCode || '';
            country = currentUser.address.country || 'India';
          }
        }
        
        setFormData({
          name: currentUser.name || '',
          email: currentUser.email || '',
          phone: currentUser.phone || '',
          address: addressStr,
          city: city,
          state: state,
          zipCode: zipCode,
          country: country,
          sustainabilityGoals: (currentUser as any).sustainabilityGoals || ''
        });
        setAvatarPreview(currentUser.avatar || '');
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
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

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setUploadingAvatar(true);
      
      // Store the old avatar URL before uploading new one
      const oldAvatar = profile?.avatar || avatarPreview;
      
      // Preview the image locally first
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ecocycle_uploads');

      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      if (!cloudName) {
        throw new Error('Cloudinary cloud name not configured');
      }

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
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
        // Update the avatar preview with Cloudinary URL
        setAvatarPreview(data.secure_url);
        
        // Immediately save the avatar to profile
        // The backend will automatically delete the old avatar if it exists
        try {
          const updatedUser = await api.updateProfile({ avatar: data.secure_url });
          setProfile({ ...profile, avatar: data.secure_url });
          
          // Update localStorage
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            const newUserData = { ...userData, ...updatedUser };
            localStorage.setItem('user', JSON.stringify(newUserData));
          }
          
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        } catch (apiError) {
          console.error('Failed to save avatar to profile:', apiError);
          setErrorMessage('Avatar uploaded but failed to save to profile. Please try saving your profile.');
          setTimeout(() => setErrorMessage(''), 5000);
        }
      }
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      setErrorMessage('Failed to upload avatar. Please try again.');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      setSaving(true);
      const updateData: any = { ...formData };
      
      // Avatar is already uploaded via Cloudinary in handleAvatarChange
      // No need to include it here as it's saved immediately on upload
      
      const response = await api.updateProfile(updateData);
      console.log('Profile updated successfully:', response);
      
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
      await loadUserProfile();
    } catch (error: any) {
      console.error('Failed to update profile:', error);
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
      <Layout title="" role="User" fullWidth hideSidebar>
        <div className="flex items-center justify-center min-h-screen bg-[#0B1116]">
          <Loader size="md" color="#10b981" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="" role="User" fullWidth hideSidebar>
      <div className="bg-[#0B1116] font-sans text-gray-200 antialiased selection:bg-[#10b981] selection:text-white min-h-screen">
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
          <div className="fixed top-0 left-0 w-full h-[500px] bg-[#10b981]/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
          <div className="fixed bottom-0 right-0 w-full h-[500px] bg-[#3b82f6]/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none"></div>
          
          <div className="layout-container flex h-full grow flex-col relative z-10">
            {/* Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-md">
              <div className="flex items-center gap-3 text-white cursor-pointer" onClick={() => window.location.hash = '#/dashboard'}>
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
                      style={{ backgroundImage: `url("${profile?.avatar || user?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User') + '&background=10b981&color=fff'}")`}}
                    ></div>
                    <span className="text-sm font-medium text-gray-200">{user?.name || 'User'}</span>
                  </button>
                  {/* Hover Preview */}
                  <div className="absolute top-14 right-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100]">
                    <div className="bg-[#151F26] border border-white/10 rounded-2xl p-4 shadow-2xl">
                      <div 
                        className="size-32 rounded-xl bg-cover bg-center ring-4 ring-[#10b981]/30" 
                        style={{ backgroundImage: `url("${profile?.avatar || user?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User') + '&background=10b981&color=fff'}")`}}
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
                  className="flex items-center gap-2 text-[#10b981] hover:text-[#059669] transition-colors mb-6 group"
                >
                  <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                  <span className="text-sm font-medium">Back to Settings</span>
                </button>

                {/* Page Header */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-[#10b981]/10 rounded-lg">
                      <span className="material-symbols-outlined text-[#10b981] text-[28px]">person</span>
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-white">Edit Profile</h1>
                      <p className="text-gray-400 text-sm mt-1">Update your personal information and preferences</p>
                    </div>
                  </div>
                </div>

                {/* Profile Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Avatar Section */}
                  <div className="bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5">
                    <div className="flex flex-col gap-6">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#10b981]">account_circle</span>
                        <h3 className="text-white text-lg font-bold">Profile Picture</h3>
                      </div>
                      <div className="flex flex-col items-center gap-6 p-6 bg-[#0B1116] rounded-xl border border-white/5">
                        <div className="relative group">
                          <div 
                            className="size-40 rounded-2xl bg-gradient-to-br from-[#10b981] to-[#3b82f6] flex items-center justify-center ring-4 ring-[#10b981]/20 text-white font-bold text-5xl overflow-hidden shadow-lg shadow-[#10b981]/20 transition-all group-hover:ring-[#10b981]/40"
                            style={avatarPreview ? { backgroundImage: `url(${avatarPreview})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                          >
                            {!avatarPreview && (formData.name?.charAt(0)?.toUpperCase() || 'U')}
                          </div>
                          <label 
                            htmlFor="avatar" 
                            className="absolute bottom-2 right-2 size-12 rounded-xl bg-[#10b981] border-4 border-[#0B1116] flex items-center justify-center cursor-pointer hover:bg-[#059669] transition-all shadow-lg hover:scale-110 group"
                          >
                            {uploadingAvatar ? (
                              <Loader size="sm" color="white" />
                            ) : (
                              <span className="material-symbols-outlined text-white text-[24px]">photo_camera</span>
                            )}
                            <input
                              type="file"
                              id="avatar"
                              accept="image/*"
                              onChange={handleAvatarChange}
                              className="hidden"
                              disabled={uploadingAvatar}
                            />
                          </label>
                        </div>
                        <div className="text-center">
                          <p className="text-white text-sm font-medium mb-1">Upload Profile Picture</p>
                          <p className="text-gray-400 text-xs">
                            {uploadingAvatar ? 'Uploading to cloud...' : 'Click the camera icon • Square image • Min 256x256px'}
                          </p>
                          <div className="flex items-center justify-center gap-2 mt-3">
                            <span className="px-3 py-1 bg-[#10b981]/10 border border-[#10b981]/30 rounded-full text-[#10b981] text-xs font-medium">JPG</span>
                            <span className="px-3 py-1 bg-[#10b981]/10 border border-[#10b981]/30 rounded-full text-[#10b981] text-xs font-medium">PNG</span>
                            <span className="px-3 py-1 bg-[#10b981]/10 border border-[#10b981]/30 rounded-full text-[#10b981] text-xs font-medium">SVG</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5">
                    <div className="flex flex-col gap-6">
                      <h3 className="text-white text-lg font-bold">Personal Information</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="flex flex-col w-full">
                          <span className="text-white text-sm font-medium pb-2">Full Name *</span>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] transition-all"
                            placeholder="Enter your full name"
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
                            className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] transition-all"
                            placeholder="your@email.com"
                          />
                        </label>
                      </div>

                      <label className="flex flex-col w-full">
                        <span className="text-white text-sm font-medium pb-2">Phone Number</span>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] transition-all"
                          placeholder="+1 (555) 123-4567"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5">
                    <div className="flex flex-col gap-6">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#10b981]">location_on</span>
                        <h3 className="text-white text-lg font-bold">Address Information</h3>
                      </div>
                      
                      <label className="flex flex-col w-full">
                        <span className="text-white text-sm font-medium pb-2">Street Address</span>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] transition-all"
                          placeholder="123 Main Street, Apt 4B"
                        />
                      </label>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="flex flex-col w-full">
                          <span className="text-white text-sm font-medium pb-2">City</span>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] transition-all"
                            placeholder="San Francisco"
                          />
                        </label>
                        <label className="flex flex-col w-full">
                          <span className="text-white text-sm font-medium pb-2">State/Province</span>
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] transition-all"
                            placeholder="California"
                          />
                        </label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="flex flex-col w-full">
                          <span className="text-white text-sm font-medium pb-2">ZIP/Postal Code</span>
                          <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] transition-all"
                            placeholder="94102"
                          />
                        </label>
                        <label className="flex flex-col w-full">
                          <span className="text-white text-sm font-medium pb-2">Country</span>
                          <select
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] transition-all"
                          >
                            <option value="India">India</option>
                            <option value="USA">United States</option>
                            <option value="UK">United Kingdom</option>
                            <option value="Canada">Canada</option>
                            <option value="Australia">Australia</option>
                            <option value="Germany">Germany</option>
                            <option value="France">France</option>
                            <option value="Japan">Japan</option>
                            <option value="Other">Other</option>
                          </select>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Sustainability Goals */}
                  <div className="bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5">
                    <div className="flex flex-col gap-6">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#10b981]">eco</span>
                        <h3 className="text-white text-lg font-bold">Sustainability Goals</h3>
                      </div>
                      
                      <label className="flex flex-col w-full">
                        <span className="text-white text-sm font-medium pb-2">Your Environmental Goals</span>
                        <textarea
                          name="sustainabilityGoals"
                          value={formData.sustainabilityGoals}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] transition-all resize-none"
                          placeholder="Share your personal sustainability goals and how you're working towards reducing e-waste..."
                        />
                      </label>
                    </div>
                  </div>

                  {/* Stats Display (Read-only) */}
                  {profile && (
                    <div className="bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5">
                      <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#10b981]">bar_chart</span>
                          <h3 className="text-white text-lg font-bold">Your Impact</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-[#0B1116] p-4 rounded-xl border border-[#10b981]/20">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-[#10b981]/10 rounded-lg">
                                <span className="material-symbols-outlined text-[#10b981]">stars</span>
                              </div>
                              <div>
                                <p className="text-gray-400 text-xs">Eco Points</p>
                                <p className="text-white text-xl font-bold">{profile.ecoPoints || 0}</p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-[#0B1116] p-4 rounded-xl border border-[#10b981]/20">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-[#10b981]/10 rounded-lg">
                                <span className="material-symbols-outlined text-[#10b981]">recycling</span>
                              </div>
                              <div>
                                <p className="text-gray-400 text-xs">Waste Recycled</p>
                                <p className="text-white text-xl font-bold">{profile.totalWasteRecycled || 0} kg</p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-[#0B1116] p-4 rounded-xl border border-[#10b981]/20">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-[#10b981]/10 rounded-lg">
                                <span className="material-symbols-outlined text-[#10b981]">local_shipping</span>
                              </div>
                              <div>
                                <p className="text-gray-400 text-xs">Total Pickups</p>
                                <p className="text-white text-xl font-bold">{profile.totalPickups || 0}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 h-12 px-6 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#10b981]/20"
                    >
                      {saving ? (
                        <>
                          <Loader size="sm" color="white" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined">save</span>
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => window.history.back()}
                      className="h-12 px-6 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-all border border-white/10"
                    >
                      Cancel
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

export default EditResidentProfile;
