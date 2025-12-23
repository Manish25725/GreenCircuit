import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { api, getCurrentUser, User } from '../services/api';

const BusinessEditProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    profilePicture: ''
  });
  const [previewImage, setPreviewImage] = useState<string>('');

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setFormData({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        phone: currentUser?.phone || '',
        profilePicture: currentUser?.profilePicture || ''
      });
      setPreviewImage(currentUser?.profilePicture || '');
    } catch (error) {
      console.error('Failed to load user profile:', error);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setFormData({
          ...formData,
          profilePicture: result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.updateProfile(formData);
      
      // Update local storage
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser as User);
      
      alert('User profile updated successfully!');
    } catch (error) {
      console.error('Failed to update user profile:', error);
      alert('Failed to update user profile. Please try again.');
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#10b981]"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="" role="Business" fullWidth hideSidebar>
      <div className="bg-[#0B1116] font-sans text-gray-200 antialiased selection:bg-[#10b981] selection:text-white min-h-screen">
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
          <div className="fixed top-0 left-0 w-full h-[500px] bg-[#10b981]/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
          <div className="fixed bottom-0 right-0 w-full h-[500px] bg-[#8b5cf6]/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none"></div>
          
          <div className="layout-container flex h-full grow flex-col relative z-10">
            {/* Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-md">
              <div className="flex items-center gap-3 text-white cursor-pointer" onClick={() => window.location.hash = '#/business'}>
                <div className="p-2 bg-[#10b981]/10 rounded-lg">
                  <svg className="h-6 w-6 text-[#10b981]" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"></path>
                  </svg>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white">EcoCycle <span className="text-[#10b981]">Business</span></h2>
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
                  className="flex items-center gap-2 text-[#10b981] hover:text-[#059669] transition-colors mb-6 group"
                >
                  <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                  <span className="text-sm font-medium">Back to Settings</span>
                </button>

                {/* Page Header */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-[#10b981]/10 rounded-lg">
                      <span className="material-symbols-outlined text-[#10b981] text-[28px]">account_circle</span>
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-white">Edit User Profile</h1>
                      <p className="text-gray-400 text-sm">Update your personal account information</p>
                    </div>
                  </div>
                </div>

                {/* Profile Form */}
                <form onSubmit={handleSubmit} className="bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5">
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-1 mb-2">
                      <h3 className="text-white text-lg font-bold leading-tight">Personal Information</h3>
                      <p className="text-[#94a3b8] text-sm">Update your account details and profile picture</p>
                    </div>

                    {/* Profile Picture */}
                    <div className="flex flex-col items-center gap-4 p-6 bg-[#0B1116] rounded-xl border border-white/5">
                      <div className="relative">
                        <div 
                          className="size-32 rounded-full bg-[#10b981] flex items-center justify-center ring-4 ring-white/10 text-white font-bold text-4xl overflow-hidden"
                          style={previewImage ? { backgroundImage: `url(${previewImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                        >
                          {!previewImage && (user?.name?.charAt(0) || 'U')}
                        </div>
                        <label 
                          htmlFor="profilePicture" 
                          className="absolute bottom-0 right-0 size-10 rounded-full bg-[#10b981] border-4 border-[#0B1116] flex items-center justify-center cursor-pointer hover:bg-[#059669] transition-colors"
                        >
                          <span className="material-symbols-outlined text-white text-[20px]">photo_camera</span>
                          <input
                            type="file"
                            id="profilePicture"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <div className="text-center">
                        <p className="text-white text-sm font-medium mb-1">Profile Picture</p>
                        <p className="text-gray-400 text-xs">Click the camera icon to upload a new photo</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-6">
                      {/* Full Name */}
                      <label className="flex flex-col w-full">
                        <span className="text-white text-sm font-medium leading-normal pb-2">Full Name *</span>
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

                      {/* Email and Phone */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="flex flex-col w-full">
                          <span className="text-white text-sm font-medium leading-normal pb-2">Email Address *</span>
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
                        <label className="flex flex-col w-full">
                          <span className="text-white text-sm font-medium leading-normal pb-2">Phone Number</span>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] transition-all"
                            placeholder="+1 (555) 000-0000"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-[#10b981]/10 border border-[#10b981]/30 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-[#10b981] text-[20px] mt-0.5">info</span>
                        <div className="flex-1">
                          <p className="text-[#10b981] text-sm font-medium mb-1">Account Information</p>
                          <p className="text-gray-400 text-xs leading-relaxed">
                            This is your personal user account information. To update business details like company name or address, please use the business profile section.
                          </p>
                        </div>
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
                        className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-[#10b981] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#059669] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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

export default BusinessEditProfile;
