import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import { api, getCurrentUser } from '../services/api';

const PartnerRegistration: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const currentUser = getCurrentUser();
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    headName: '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    gstNumber: '',
    udyamCertificate: '',
    businessType: '',
    establishedYear: new Date().getFullYear(),
    description: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
      coordinates: {
        lat: 0,
        lng: 0
      }
    },
    services: [] as string[],
    verificationDocuments: [] as string[]
  });
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [locationError, setLocationError] = useState('');

  const serviceOptions = [
    'E-Waste Collection',
    'Recycling',
    'Data Destruction',
    'Pickup Service',
    'Bulk Collection',
    'Corporate Services'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleGetLocation = () => {
    setLocationStatus('loading');
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setLocationStatus('error');
      return;
    }

    console.log('Requesting browser geolocation...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Location obtained:', position.coords);
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({
          ...prev,
          address: {
            ...prev.address,
            coordinates: {
              lat: latitude,
              lng: longitude
            }
          }
        }));
        setLocationStatus('success');
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationError('Could not get location. This is optional - you can proceed without it.');
        setLocationStatus('error');
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 600000
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.name || !formData.headName || !formData.email || !formData.phone || !formData.gstNumber) {
        throw new Error('Please fill all required fields');
      }

      if (!formData.address.street || !formData.address.city || !formData.address.state || !formData.address.zipCode) {
        throw new Error('Please complete the address details');
      }

      // Require location coordinates
      if (!formData.address.coordinates?.lat || formData.address.coordinates?.lat === 0) {
        throw new Error('Please share your location to help users find your agency on the map');
      }

      await api.post('/agencies', formData);
      
      // Redirect to pending status page
      window.location.hash = '#/partner/pending';
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to submit registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1116] via-[#0f1419] to-[#0B1116] font-sans text-gray-100 antialiased selection:bg-cyan-500 selection:text-white py-12 px-4">
      {/* Blue gradient effects */}
      <div className="fixed top-0 left-0 w-full h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-full h-[500px] bg-blue-500/10 rounded-full blur-[120px] translate-y-1/2 pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-6 cursor-pointer" onClick={() => window.location.hash = '#/'}>
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-lg">
              <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"></path>
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Partner Registration</h1>
          <p className="text-gray-200 text-lg">
            Join our network of verified e-waste recycling partners. Please provide accurate information for verification.
          </p>
        </div>

        <div className="bg-[#1a2332]/90 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-400/50 rounded-lg">
              <p className="text-red-300 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Business Information */}
            <div className="border-b border-cyan-500/20 pb-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-cyan-400">business</span>
                Business Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Agency Name <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-[#0f1823] border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400 transition-all"
                    placeholder={currentUser?.name ? '' : 'Enter agency name'}
                    required
                  />
                  {currentUser?.name && (
                    <p className="text-xs text-slate-400 mt-1">From your account: {currentUser.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Head/Owner Name <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="headName"
                    value={formData.headName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-[#0f1823] border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    GST Number <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., 22AAAAA0000A1Z5"
                    className="w-full px-4 py-2.5 bg-[#0f1823] border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Udyam Certificate Number
                  </label>
                  <input
                    type="text"
                    name="udyamCertificate"
                    value={formData.udyamCertificate}
                    onChange={handleInputChange}
                    placeholder="e.g., UDYAM-XX-00-0000000"
                    className="w-full px-4 py-2.5 bg-[#0f1823] border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Business Type
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-[#0f1823] border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white transition-all"
                  >
                    <option value="" className="bg-[#0f1823]">Select Type</option>
                    <option value="Private Limited" className="bg-[#0f1823]">Private Limited</option>
                    <option value="Partnership" className="bg-[#0f1823]">Partnership</option>
                    <option value="Proprietorship" className="bg-[#0f1823]">Proprietorship</option>
                    <option value="LLP" className="bg-[#0f1823]">LLP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Established Year
                  </label>
                  <input
                    type="number"
                    name="establishedYear"
                    value={formData.establishedYear}
                    onChange={handleInputChange}
                    min="1900"
                    max={new Date().getFullYear()}
                    className="w-full px-4 py-2.5 bg-[#0f1823] border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white transition-all"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-[#0f1823] border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400 transition-all"
                  placeholder="Brief description of your services and capabilities"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-b border-cyan-500/20 pb-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-400">contact_mail</span>
                Contact Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Email <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    className="w-full px-4 py-2.5 bg-[#151F26] border border-cyan-500/20 rounded-lg text-gray-200 cursor-not-allowed"
                    required
                  />
                  <p className="text-xs text-slate-400 mt-1">📧 From your account (cannot be changed)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Phone <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-[#0f1823] border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="border-b border-cyan-500/20 pb-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-cyan-400">location_on</span>
                Address Details
              </h2>

              {/* Location Picker */}
              <div className="mb-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-cyan-400 text-[28px]">my_location</span>
                  <div className="flex-1">
                    <h3 className="text-white font-medium mb-1">Share Your Location <span className="text-cyan-400">*</span></h3>
                    <p className="text-sm text-gray-200 mb-3">Required so users can find your agency on the map</p>
                    
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      disabled={locationStatus === 'loading'}
                      className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-500/50 text-white rounded-lg transition-all"
                    >
                      {locationStatus === 'loading' ? (
                        <>
                          <Loader size="sm" color="white" />
                          <span>Detecting...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[20px]">gps_fixed</span>
                          <span>Share My Location</span>
                        </>
                      )}
                    </button>

                    {locationStatus === 'success' && formData.address.coordinates.lat !== 0 && (
                      <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-green-400 mb-1">
                          <span className="material-symbols-outlined text-[20px]">check_circle</span>
                          <span className="font-medium">Location captured successfully!</span>
                        </div>
                        <div className="text-xs text-gray-200 ml-7">
                          Coordinates: {formData.address.coordinates.lat.toFixed(6)}, {formData.address.coordinates.lng.toFixed(6)}
                        </div>
                      </div>
                    )}

                    {locationError && (
                      <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <div className="flex items-start gap-2 text-sm text-red-400 mb-2">
                          <span className="material-symbols-outlined text-[20px]">error</span>
                          <span>{locationError}</span>
                        </div>
                        <p className="text-xs text-slate-400">
                          Please allow location access in your browser settings and try again. This is required for users to find you on the map.
                        </p>
                      </div>
                    )}

                    {!locationError && locationStatus === 'idle' && (
                      <p className="mt-2 text-xs text-slate-400">
                        💡 Click the button and allow location access when your browser asks
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Street Address <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.address.street}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2.5 bg-[#0f1823] border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400 transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      City <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.address.city}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2.5 bg-[#0f1823] border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      State <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.address.state}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2.5 bg-[#0f1823] border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      ZIP Code <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.address.zipCode}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2.5 bg-[#0f1823] border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="pb-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-400">build</span>
                Services Offered
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {serviceOptions.map(service => (
                  <label
                    key={service}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                      formData.services.includes(service)
                        ? 'bg-cyan-500/20 border-cyan-500/50 text-white'
                        : 'bg-[#0f1823] border-cyan-500/20 text-gray-200 hover:bg-cyan-500/10 hover:border-cyan-500/40'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.services.includes(service)}
                      onChange={() => handleServiceToggle(service)}
                      className="mr-2 w-4 h-4 text-cyan-600 rounded focus:ring-cyan-500 bg-[#0f1823] border-cyan-500/30"
                    />
                    <span className="text-sm font-medium">{service}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-6 py-2.5 border border-cyan-500/30 rounded-lg text-gray-200 hover:bg-cyan-500/10 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg shadow-cyan-500/20"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader size="sm" color="white" />
                    Submitting...
                  </span>
                ) : (
                  'Submit Registration'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
            <h3 className="font-semibold text-cyan-400 mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">info</span>
              Important Information
            </h3>
            <ul className="text-sm text-gray-200 space-y-1 list-disc list-inside ml-1">
              <li>Your registration will be reviewed by our admin team</li>
              <li>Verification typically takes 2-3 business days</li>
              <li>You'll receive an email notification once approved</li>
              <li>Ensure all documents and information are accurate</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerRegistration;
