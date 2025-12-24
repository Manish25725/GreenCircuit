import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import { api, Agency, getCurrentUser, isAuthenticated } from '../services/api';

// Declare Leaflet types
declare const L: any;

// Helper to get user role
const getUserRole = (): 'User' | 'Business' | 'Agency' | 'Admin' => {
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const role = user.role?.toLowerCase();
      if (role === 'business') return 'Business';
      if (role === 'agency' || role === 'partner') return 'Agency';
      if (role === 'admin') return 'Admin';
    }
  } catch (e) {}
  return 'User';
};

// Helper to get dashboard path based on role
const getDashboardPath = (role: string): string => {
  switch (role) {
    case 'Business': return '#/business';
    case 'Agency': return '#/agency';
    case 'Admin': return '#/admin';
    default: return '#/dashboard';
  }
};

// Worldwide city coordinates
const worldCities: Record<string, { coords: [number, number]; country: string }> = {
  // India
  'Delhi': { coords: [28.6139, 77.2090], country: 'India' },
  'New Delhi': { coords: [28.6139, 77.2090], country: 'India' },
  'Mumbai': { coords: [19.0760, 72.8777], country: 'India' },
  'Bangalore': { coords: [12.9716, 77.5946], country: 'India' },
  'Chennai': { coords: [13.0827, 80.2707], country: 'India' },
  'Hyderabad': { coords: [17.3850, 78.4867], country: 'India' },
  'Kolkata': { coords: [22.5726, 88.3639], country: 'India' },
  'Pune': { coords: [18.5204, 73.8567], country: 'India' },
  'Noida': { coords: [28.5355, 77.3910], country: 'India' },
  // USA
  'New York': { coords: [40.7128, -74.0060], country: 'USA' },
  'Los Angeles': { coords: [34.0522, -118.2437], country: 'USA' },
  'Chicago': { coords: [41.8781, -87.6298], country: 'USA' },
  'Houston': { coords: [29.7604, -95.3698], country: 'USA' },
  'San Francisco': { coords: [37.7749, -122.4194], country: 'USA' },
  'Seattle': { coords: [47.6062, -122.3321], country: 'USA' },
  'Miami': { coords: [25.7617, -80.1918], country: 'USA' },
  // Europe
  'London': { coords: [51.5074, -0.1278], country: 'UK' },
  'Paris': { coords: [48.8566, 2.3522], country: 'France' },
  'Berlin': { coords: [52.5200, 13.4050], country: 'Germany' },
  'Amsterdam': { coords: [52.3676, 4.9041], country: 'Netherlands' },
  'Madrid': { coords: [40.4168, -3.7038], country: 'Spain' },
  'Rome': { coords: [41.9028, 12.4964], country: 'Italy' },
  // Asia Pacific
  'Singapore': { coords: [1.3521, 103.8198], country: 'Singapore' },
  'Tokyo': { coords: [35.6762, 139.6503], country: 'Japan' },
  'Sydney': { coords: [-33.8688, 151.2093], country: 'Australia' },
  'Dubai': { coords: [25.2048, 55.2708], country: 'UAE' },
  'Hong Kong': { coords: [22.3193, 114.1694], country: 'Hong Kong' },
  'Shanghai': { coords: [31.2304, 121.4737], country: 'China' },
  // Others
  'Toronto': { coords: [43.6532, -79.3832], country: 'Canada' },
  'São Paulo': { coords: [-23.5505, -46.6333], country: 'Brazil' },
  'Cape Town': { coords: [-33.9249, 18.4241], country: 'South Africa' },
};

const regions = [
  { name: 'All', icon: '🌍' },
  { name: 'India', icon: '🇮🇳' },
  { name: 'USA', icon: '🇺🇸' },
  { name: 'Europe', icon: '🇪🇺' },
  { name: 'Asia Pacific', icon: '🌏' },
];

const SearchAgencies = () => {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [activeRegion, setActiveRegion] = useState<string>('All');
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const user = getCurrentUser();
  const [avatarKey, setAvatarKey] = useState(Date.now());
  const userRole = getUserRole();
  const dashboardPath = getDashboardPath(userRole);

  // Business-specific theme colors
  const isBusiness = userRole === 'Business';
  const primaryColor = isBusiness ? '#3b82f6' : '#10b981';
  const primaryColorRgb = isBusiness ? '59, 130, 246' : '16, 185, 129';
  const brandName = isBusiness ? 'EcoCycle Business' : 'EcoCycle Resident';

  useEffect(() => {
    loadAgencies();
  }, []);

  // Initialize map
  useEffect(() => {
    // Wait for DOM to be ready
    const initMap = () => {
      if (mapRef.current && !mapInstanceRef.current && typeof L !== 'undefined') {
        try {
          // Create map centered on India
          mapInstanceRef.current = L.map(mapRef.current, {
            center: [22.5937, 78.9629], // Center of India
            zoom: 5,
            zoomControl: false,
            attributionControl: false,
          });

          // Use Stadia Maps dark theme (shows correct boundaries)
          L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
            maxZoom: 20,
            attribution: ''
          }).addTo(mapInstanceRef.current);

          // Add custom zoom control
          L.control.zoom({ position: 'bottomright' }).addTo(mapInstanceRef.current);
          
          // Force map to recalculate size
          setTimeout(() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.invalidateSize();
            }
          }, 100);
          
          setMapReady(true);
        } catch (error) {
          console.error('Error initializing map:', error);
        }
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initMap, 100);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when agencies change
  useEffect(() => {
    if (!mapInstanceRef.current || !mapReady) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    // Dynamic colors based on user role
    const markerColor = isBusiness ? '#3b82f6' : '#10b981';
    const markerColorDark = isBusiness ? '#2563eb' : '#059669';
    const markerColorDarker = isBusiness ? '#1d4ed8' : '#047857';
    const markerColorRgb = isBusiness ? '59, 130, 246' : '16, 185, 129';

    // Add markers for each agency
    agencies.forEach(agency => {
      let coords: [number, number] | null = null;
      let coordSource = '';
      
      // First try to use exact coordinates from agency
      if (agency.address?.coordinates?.lat && agency.address?.coordinates?.lng) {
        coords = [agency.address.coordinates.lat, agency.address.coordinates.lng];
        coordSource = 'GPS coordinates';
        console.log(`${agency.name}: Using GPS coordinates [${coords[0]}, ${coords[1]}] - Lat: ${agency.address.coordinates.lat}, Lng: ${agency.address.coordinates.lng}`);
        console.log(`  City: ${agency.address?.city}, State: ${agency.address?.state}, Country: ${agency.address?.country}`);
      } else {
        // Fallback to city lookup
        const city = agency.address?.city || '';
        const cityData = Object.entries(worldCities).find(
          ([key]) => key.toLowerCase() === city.toLowerCase()
        );
        if (cityData) {
          coords = cityData[1].coords;
          coordSource = `City lookup (${city})`;
          console.log(`${agency.name}: Using city coordinates [${coords[0]}, ${coords[1]}] for ${city}`);
        } else {
          console.warn(`${agency.name}: No coordinates or city match found. City: ${city}`);
        }
      }

      if (coords) {
        const isSelected = selectedAgency?._id === agency._id;
        const country = agency.address?.country || 'India';
        
        // Beautiful animated marker with pulse effect
        const customIcon = L.divIcon({
          className: 'custom-marker-wrapper',
          html: `
            <div class="marker-container ${isSelected ? 'selected' : ''}" data-color="${markerColor}" data-color-dark="${markerColorDark}" data-color-darker="${markerColorDarker}" data-color-rgb="${markerColorRgb}">
              <div class="marker-pulse" style="background: rgba(${markerColorRgb}, 0.3);"></div>
              <div class="marker-pin" style="background: linear-gradient(135deg, ${markerColor} 0%, ${markerColorDark} 100%); box-shadow: 0 4px 15px rgba(${markerColorRgb}, 0.4), 0 0 0 3px rgba(255,255,255,0.2);">
                <div class="marker-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
              </div>
              <div class="marker-shadow"></div>
            </div>
          `,
          iconSize: [48, 56],
          iconAnchor: [24, 56],
          popupAnchor: [0, -56],
        });

        const marker = L.marker(coords, { icon: customIcon })
          .addTo(mapInstanceRef.current)
          .on('click', () => {
            setSelectedAgency(agency);
            mapInstanceRef.current.flyTo(coords, 12, { 
              duration: 1.5,
              easeLinearity: 0.25
            });
          });

        // Beautiful popup with gradient
        marker.bindPopup(`
          <div class="agency-popup">
            <div class="popup-header">
              <div class="popup-icon" style="background: rgba(${markerColorRgb}, 0.15);">♻️</div>
              <div class="popup-title">
                <h3>${agency.name}</h3>
                <span class="popup-location">${agency.address?.city || ''}, ${country || ''}</span>
              </div>
            </div>
            <div class="popup-stats">
              <div class="stat">
                <span class="stat-icon">⭐</span>
                <span class="stat-value">${agency.rating?.toFixed(1) || '4.5'}</span>
              </div>
              <div class="stat">
                <span class="stat-icon">📦</span>
                <span class="stat-value">${agency.totalBookings || '100'}+ pickups</span>
              </div>
            </div>
            <div class="popup-services">
              ${(agency.services || ['Electronics', 'Batteries']).slice(0, 3).map(s => 
                `<span class="service-tag" style="background: rgba(${markerColorRgb}, 0.1); color: ${markerColor};">${s}</span>`
              ).join('')}
            </div>
          </div>
        `, { 
          className: 'custom-popup',
          closeButton: true,
          maxWidth: 280,
          minWidth: 240
        });

        markersRef.current.push(marker);
      }
    });

    console.log(`Total markers added: ${markersRef.current.length}`);

    // Fit bounds with animation to show all markers
    if (markersRef.current.length > 0) {
      setTimeout(() => {
        if (mapInstanceRef.current && markersRef.current.length > 0) {
          const group = L.featureGroup(markersRef.current);
          const bounds = group.getBounds();
          
          if (markersRef.current.length === 1) {
            // Single marker - center and zoom to it
            const marker = markersRef.current[0];
            const latlng = marker.getLatLng();
            mapInstanceRef.current.setView([latlng.lat, latlng.lng], 12, { animate: true });
            console.log(`Centered map on single marker at [${latlng.lat}, ${latlng.lng}]`);
          } else {
            // Multiple markers - fit all in view
            mapInstanceRef.current.fitBounds(bounds.pad(0.1), { 
              maxZoom: 12,
              animate: true,
              duration: 1
            });
            console.log(`Fitted map to ${markersRef.current.length} markers`);
          }
        }
      }, 100);
    }
  }, [agencies, mapReady, selectedAgency, isBusiness]);

  const loadAgencies = async () => {
    setLoading(true);
    try {
      const result = await api.getAgencies();
      console.log('Loaded agencies:', result.agencies?.length || 0, 'agencies');
      console.log('Agencies data:', result.agencies);
      setAgencies(result.agencies || []);
    } catch (error) {
      console.error('Failed to load agencies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchLocation.trim()) {
      loadAgencies();
      setActiveRegion('All');
      return;
    }
    setLoading(true);
    try {
      const result = await api.getAgencies({ city: searchLocation });
      setAgencies(result.agencies || []);
      
      // Pan map to searched city
      const cityData = Object.entries(worldCities).find(
        ([key]) => key.toLowerCase() === searchLocation.toLowerCase()
      );
      if (cityData && mapInstanceRef.current) {
        mapInstanceRef.current.flyTo(cityData[1].coords, 10, { duration: 1.5 });
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegionFilter = async (region: string) => {
    setActiveRegion(region);
    setLoading(true);
    
    try {
      const result = await api.getAgencies();
      let filtered = result.agencies || [];
      
      if (region !== 'All') {
        // Filter by region/country
        const regionCountries: Record<string, string[]> = {
          'India': ['India'],
          'USA': ['USA', 'United States'],
          'Europe': ['UK', 'France', 'Germany', 'Netherlands', 'Spain', 'Italy'],
          'Asia Pacific': ['Singapore', 'Japan', 'Australia', 'UAE', 'Hong Kong', 'China'],
        };
        
        const countries = regionCountries[region] || [];
        filtered = filtered.filter(a => {
          const city = a.address?.city || '';
          const cityData = Object.entries(worldCities).find(
            ([key]) => key.toLowerCase() === city.toLowerCase()
          );
          return cityData && countries.includes(cityData[1].country);
        });
      }
      
      setAgencies(filtered);
      
      // Pan to region
      if (mapInstanceRef.current) {
        const regionCenters: Record<string, { center: [number, number]; zoom: number }> = {
          'All': { center: [20, 0], zoom: 2 },
          'India': { center: [20.5937, 78.9629], zoom: 5 },
          'USA': { center: [39.8283, -98.5795], zoom: 4 },
          'Europe': { center: [50.0, 10.0], zoom: 4 },
          'Asia Pacific': { center: [15.0, 115.0], zoom: 3 },
        };
        const { center, zoom } = regionCenters[region] || regionCenters['All'];
        mapInstanceRef.current.flyTo(center, zoom, { duration: 1 });
      }
    } catch (error) {
      console.error('Filter failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAgencyClick = (agency: Agency) => {
    setSelectedAgency(selectedAgency?._id === agency._id ? null : agency);
    
    // Pan map to agency location
    if (mapInstanceRef.current) {
      const city = agency.address?.city || '';
      const cityData = Object.entries(worldCities).find(
        ([key]) => key.toLowerCase() === city.toLowerCase()
      );
      if (cityData) {
        mapInstanceRef.current.flyTo(cityData[1].coords, 12, { duration: 1 });
      }
    }
  };

  const handleBookPickup = (agency: Agency) => {
    // Check if user is logged in before booking
    if (!isAuthenticated()) {
      alert('Please log in to schedule a pickup');
      window.location.hash = '#/login';
      return;
    }
    // Navigate to schedule page with agency ID - data will be fetched from MongoDB
    window.location.hash = `#/schedule?agency=${agency._id}`;
  };

  const getCountryFlag = (country: string) => {
    const flags: Record<string, string> = {
      'India': '🇮🇳',
      'USA': '🇺🇸',
      'UK': '🇬🇧',
      'France': '🇫🇷',
      'Germany': '🇩🇪',
      'Japan': '🇯🇵',
      'Australia': '🇦🇺',
      'Singapore': '🇸🇬',
      'UAE': '🇦🇪',
      'Canada': '🇨🇦',
      'Brazil': '🇧🇷',
      'South Africa': '🇿🇦',
      'Netherlands': '🇳🇱',
      'Spain': '🇪🇸',
      'Italy': '🇮🇹',
      'China': '🇨🇳',
      'Hong Kong': '🇭🇰',
    };
    return flags[country] || '🌍';
  };

  return (
    <Layout title="" role={userRole} fullWidth hideSidebar>
      <div className="flex flex-col h-screen bg-[#0B1116] text-white font-sans overflow-hidden">
        
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50">
            <div className="flex items-center gap-3 text-white cursor-pointer" onClick={() => window.location.hash = '#/'}>
                <div className={`p-2 rounded-lg ${isBusiness ? 'bg-blue-500/10' : 'bg-[#10b981]/10'}`}>
                    <svg className={`h-6 w-6 ${isBusiness ? 'text-blue-500' : 'text-[#10b981]'}`} fill="currentColor" viewBox="0 0 48 48">
                    <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"></path>
                    </svg>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white">
                  EcoCycle <span className={`font-semibold ${isBusiness ? 'text-blue-500' : 'text-[#10b981]'}`}>
                    {isBusiness ? 'Business' : 'Resident'}
                  </span>
                </h2>
            </div>
            <nav className="hidden md:flex flex-1 justify-center gap-1">
            </nav>
            <div className="flex items-center gap-4">
                <div className="relative group">
                  <button 
                      onClick={() => window.location.hash = dashboardPath}
                      className="hidden sm:flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-[#151F26] border border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <div className="size-8 rounded-full ring-2 ring-white/10 group-hover:ring-[#06b6d4]/50 transition-all overflow-hidden bg-[#06b6d4] flex items-center justify-center">
                      {user?.logo || user?.avatar ? (
                        <img 
                          src={`${user?.logo || user?.avatar}?t=${avatarKey}`} 
                          alt="Profile"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = `<span class="text-white text-xs font-bold">${(user?.name || user?.companyName || 'U').charAt(0).toUpperCase()}</span>`;
                          }}
                        />
                      ) : (
                        <span className="text-white text-xs font-bold">{(user?.name || user?.companyName || 'U').charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-200">{user?.name || user?.companyName || (isBusiness ? 'Business' : 'User')}</span>
                  </button>
                  {/* Hover Preview */}
                  <div className="absolute top-14 right-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100]">
                    <div className="bg-[#151F26] border border-white/10 rounded-2xl p-4 shadow-2xl">
                      <div className="size-32 rounded-xl ring-4 ring-[#06b6d4]/30 overflow-hidden bg-[#06b6d4] flex items-center justify-center">
                        {user?.logo || user?.avatar ? (
                          <img 
                            src={`${user?.logo || user?.avatar}?t=${avatarKey}`} 
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-4xl font-bold">{(user?.name || user?.companyName || 'U').charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => window.location.hash = isBusiness ? '#/business/notifications' : '#/notifications'}
                  className="p-2.5 rounded-full bg-[#151F26] border border-white/5 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                  title="Notifications"
                >
                  <span className="material-symbols-outlined text-[20px]">notifications</span>
                </button>
            </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 pt-[72px] overflow-hidden">
            {/* Sidebar - Agency List */}
            <div className="w-full md:w-[420px] flex flex-col border-r border-white/5 bg-[#0F1419] shrink-0 z-10">
               {/* Header & Search */}
               <div className="p-5 border-b border-white/5 bg-[#151F26]">
                  <div className="flex items-center gap-2 mb-4">
                     <button 
                        onClick={() => window.location.hash = dashboardPath}
                        className={`p-2 rounded-lg border transition-colors ${isBusiness ? 'bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20' : 'bg-[#10b981]/10 border-[#10b981]/20 text-[#10b981] hover:bg-[#10b981]/20'}`}
                        title="Back to Dashboard"
                     >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                     </button>
                     <div className="flex-1">
                        <h1 className="text-xl font-bold text-white flex items-center gap-2">
                          <span>🌍</span> Global Recyclers
                        </h1>
                        <p className="text-[#94a3b8] text-xs mt-0.5">
                          {loading ? 'Searching worldwide...' : `${agencies.length} agencies in ${activeRegion === 'All' ? 'all regions' : activeRegion}`}
                        </p>
                     </div>
                  </div>
                  
                  {/* Search */}
                  <div className="relative mb-3">
                     <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-500 text-lg">search</span>
                     <input 
                       type="text" 
                       placeholder="Search city worldwide..." 
                       value={searchLocation}
                       onChange={(e) => setSearchLocation(e.target.value)}
                       onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                       className={`w-full pl-10 pr-20 py-2.5 rounded-lg bg-[#0B1116] border border-white/10 text-white text-sm focus:ring-2 outline-none transition-all placeholder:text-gray-600 ${isBusiness ? 'focus:ring-blue-500/50 focus:border-blue-500' : 'focus:ring-[#10b981]/50 focus:border-[#10b981]'}`} 
                     />
                     <button 
                       onClick={handleSearch}
                       className={`absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 text-white text-xs font-bold rounded-md transition-colors ${isBusiness ? 'bg-blue-500 hover:bg-blue-600' : 'bg-[#10b981] hover:bg-[#059669]'}`}
                     >
                        Search
                     </button>
                  </div>

                  {/* Region Filters */}
                  <div className="flex flex-wrap gap-1.5">
                     {regions.map(region => (
                        <button
                          key={region.name}
                          onClick={() => handleRegionFilter(region.name)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                            activeRegion === region.name 
                              ? (isBusiness ? 'bg-blue-500 text-white' : 'bg-[#10b981] text-white')
                              : 'bg-white/5 text-[#94a3b8] hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <span>{region.icon}</span>
                          {region.name}
                        </button>
                     ))}
                  </div>
               </div>

               {/* Agency Cards */}
               <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                      {/* Loader with orbiting dot - matching LoadingScreen style */}
                      <div className="relative flex items-center justify-center mb-4">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center relative bg-[#0B1116]/50 backdrop-blur-sm ${isBusiness ? 'border border-blue-500/20 shadow-[0_0_40px_-10px_rgba(59,130,246,0.2)]' : 'border border-[#10b981]/20 shadow-[0_0_40px_-10px_rgba(16,185,129,0.2)]'}`}>
                          {/* Inner Glow */}
                          <div className={`absolute inset-0 rounded-full blur-xl animate-pulse ${isBusiness ? 'bg-blue-500/5' : 'bg-[#10b981]/5'}`}></div>
                          
                          {/* Logo SVG */}
                          <div className={`size-10 relative z-10 flex items-center justify-center ${isBusiness ? 'text-blue-500' : 'text-[#10b981]'}`}>
                            <svg className="w-full h-full drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                              <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
                            </svg>
                          </div>

                          {/* Orbiting Dot */}
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full animate-spin [animation-duration:2s]">
                            <div className={`absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${isBusiness ? 'bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'bg-[#10b981] shadow-[0_0_10px_#10b981]'}`}></div>
                          </div>
                        </div>
                        {/* Decorative Particles */}
                        <div className={`absolute top-0 right-0 w-1.5 h-1.5 rounded-full animate-ping [animation-duration:2s] ${isBusiness ? 'bg-blue-500/40' : 'bg-[#10b981]/40'}`}></div>
                        <div className={`absolute bottom-2 -left-2 w-1 h-1 rounded-full animate-pulse ${isBusiness ? 'bg-blue-500/30' : 'bg-[#10b981]/30'}`}></div>
                      </div>
                      <p className="text-[#94a3b8] text-sm">Searching global network...</p>
                    </div>
                  ) : agencies.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="p-4 bg-white/5 rounded-full mb-4">
                        <span className="material-symbols-outlined text-4xl text-[#94a3b8]">travel_explore</span>
                      </div>
                      <p className="text-white font-medium">No agencies found</p>
                      <p className="text-[#94a3b8] text-sm mt-1">Try searching for cities like London, Tokyo, or New York</p>
                    </div>
                  ) : (
                    agencies.map((agency) => {
                      const city = agency.address?.city || '';
                      const cityData = Object.entries(worldCities).find(
                        ([key]) => key.toLowerCase() === city.toLowerCase()
                      );
                      const country = cityData ? cityData[1].country : '';
                      
                      return (
                        <div 
                            key={agency._id} 
                            className={`bg-[#151F26] border rounded-xl p-3.5 transition-all cursor-pointer group ${
                              selectedAgency?._id === agency._id 
                                ? (isBusiness ? 'border-blue-500 ring-1 ring-blue-500/20 hover:border-blue-500/50' : 'border-[#10b981] ring-1 ring-[#10b981]/20 hover:border-[#10b981]/50')
                                : (isBusiness ? 'border-white/5 hover:border-blue-500/50' : 'border-white/5 hover:border-[#10b981]/50')
                            }`}
                            onClick={() => handleAgencyClick(agency)}
                        >
                           <div className="flex gap-3">
                              {/* Icon with Country Flag */}
                              <div className={`h-14 w-14 rounded-xl flex items-center justify-center shrink-0 relative ${isBusiness ? 'bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20' : 'bg-gradient-to-br from-[#10b981]/20 to-[#10b981]/5 border border-[#10b981]/20'}`}>
                                <span className={`material-symbols-outlined text-2xl ${isBusiness ? 'text-blue-500' : 'text-[#10b981]'}`}>recycling</span>
                                {country && (
                                  <span className="absolute -bottom-1 -right-1 text-sm">
                                    {getCountryFlag(country)}
                                  </span>
                                )}
                              </div>
                              
                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                 <div className="flex items-start justify-between gap-2">
                                     <h3 className={`font-semibold text-white text-sm truncate transition-colors ${isBusiness ? 'group-hover:text-blue-500' : 'group-hover:text-[#10b981]'}`}>{agency.name}</h3>
                                     {agency.isVerified && (
                                       <span className={`material-symbols-outlined text-base shrink-0 ${isBusiness ? 'text-blue-500' : 'text-[#10b981]'}`} title="Verified">verified</span>
                                     )}
                                 </div>
                                 
                                 <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center gap-0.5 text-yellow-500 text-xs">
                                       <span className="material-symbols-outlined text-[14px] fill">star</span>
                                       <span className="font-medium">{agency.rating?.toFixed(1) || '4.5'}</span>
                                    </div>
                                    <span className="text-white/20">•</span>
                                    <span className="text-[#94a3b8] text-xs truncate flex items-center gap-1">
                                      <span className="material-symbols-outlined text-[12px]">location_on</span>
                                      {agency.address?.city || 'Unknown'}{country ? `, ${country}` : ''}
                                    </span>
                                 </div>
                                 
                                 <div className="flex items-center justify-between mt-2.5">
                                    <div className="flex gap-1">
                                        {agency.services?.slice(0, 2).map(t => (
                                          <span key={t} className={`text-[10px] uppercase font-medium tracking-wide px-2 py-0.5 rounded ${isBusiness ? 'bg-blue-500/10 text-blue-500' : 'bg-[#10b981]/10 text-[#10b981]'}`}>{t}</span>
                                        ))}
                                    </div>
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); handleBookPickup(agency); }}
                                      className={`text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${isBusiness ? 'bg-blue-500 hover:bg-blue-600' : 'bg-[#10b981] hover:bg-[#059669]'}`}
                                    >
                                        <span className="material-symbols-outlined text-sm">calendar_month</span>
                                        Book
                                    </button>
                                 </div>
                              </div>
                           </div>
                           
                           {/* Expanded details */}
                           {selectedAgency?._id === agency._id && (
                             <div className="mt-3 pt-3 border-t border-white/5 animate-fadeIn">
                               <p className="text-[#94a3b8] text-xs mb-2">{agency.description || 'Professional e-waste recycling services with certified data destruction and international compliance.'}</p>
                               <div className="flex items-center gap-4 text-xs">
                                 <span className="text-[#94a3b8] flex items-center gap-1">
                                   <span className="material-symbols-outlined text-sm">schedule</span>
                                   Mon-Sat, 9AM-6PM
                                 </span>
                                 <span className="text-[#94a3b8] flex items-center gap-1">
                                   <span className="material-symbols-outlined text-sm">language</span>
                                   {country || 'International'}
                                 </span>
                               </div>
                             </div>
                           )}
                        </div>
                      );
                    })
                  )}
               </div>
            </div>

            {/* Map Area - Leaflet Map */}
            <div className="flex-1 relative hidden md:flex flex-col bg-[#0B1116] overflow-hidden">
               {/* Leaflet Map Container */}
               <div 
                 ref={mapRef} 
                 className="absolute inset-0 z-0"
                 style={{ background: '#0B1116' }}
               />
               
               {/* Gradient overlays for depth */}
               <div className="absolute inset-0 pointer-events-none z-[500]">
                 <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0B1116]/80 to-transparent" />
                 <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0B1116]/80 to-transparent" />
                 <div className="absolute top-0 left-0 bottom-0 w-16 bg-gradient-to-r from-[#0B1116]/50 to-transparent" />
               </div>
               
               {/* Map Header with Stats */}
               <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-[1000]">
                 <div className={`backdrop-blur-xl px-5 py-4 rounded-2xl border shadow-2xl ${isBusiness ? 'bg-[#1e3a8a]/95 border-blue-500/20 shadow-blue-500/5' : 'bg-[#0d1f17]/95 border-[#10b981]/20 shadow-[#10b981]/5'}`}>
                   <div className="flex items-center gap-3 mb-3">
                     <div className={`p-2.5 rounded-xl border ${isBusiness ? 'bg-blue-500/15 border-blue-500/20' : 'bg-[#10b981]/15 border-[#10b981]/20'}`}>
                       <span className={`material-symbols-outlined text-xl ${isBusiness ? 'text-blue-500' : 'text-[#10b981]'}`}>public</span>
                     </div>
                     <div>
                       <h3 className="text-white font-bold text-sm">{isBusiness ? 'Business Disposal Network' : 'Global Recycling Network'}</h3>
                       <p className={`text-xs ${isBusiness ? 'text-blue-500/70' : 'text-[#10b981]/70'}`}>Real-time agency locations</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-4">
                     <div className="flex items-center gap-2">
                       <span className="relative flex h-3 w-3">
                         <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isBusiness ? 'bg-blue-500' : 'bg-[#10b981]'}`}></span>
                         <span className={`relative inline-flex rounded-full h-3 w-3 ${isBusiness ? 'bg-blue-500' : 'bg-[#10b981]'}`}></span>
                       </span>
                       <span className={`text-xs font-semibold ${isBusiness ? 'text-blue-500' : 'text-[#10b981]'}`}>{agencies.length} Active</span>
                     </div>
                     <div className={`h-4 w-px ${isBusiness ? 'bg-blue-500/20' : 'bg-[#10b981]/20'}`} />
                     <span className="text-white/60 text-xs">Click markers to explore</span>
                   </div>
                 </div>
                 
                 {/* Quick Region Buttons */}
                 <div className="flex flex-col gap-2">
                   {[
                     { name: 'India', coords: [22.5937, 78.9629], zoom: 5, flag: '🇮🇳' },
                     { name: 'World', coords: [20, 0], zoom: 2, flag: '🌍' },
                   ].map(region => (
                     <button
                       key={region.name}
                       onClick={() => {
                         if (mapInstanceRef.current) {
                           mapInstanceRef.current.flyTo(region.coords, region.zoom, { duration: 1.5 });
                         }
                       }}
                       className={`backdrop-blur-xl px-4 py-2.5 rounded-xl border transition-all flex items-center gap-2 group shadow-lg ${isBusiness ? 'bg-[#1e3a8a]/95 border-blue-500/20 hover:border-blue-500/50 hover:bg-blue-500/10' : 'bg-[#0d1f17]/95 border-[#10b981]/20 hover:border-[#10b981]/50 hover:bg-[#10b981]/10'}`}
                     >
                       <span className="text-base">{region.flag}</span>
                       <span className={`text-white/90 text-xs font-medium transition-colors ${isBusiness ? 'group-hover:text-blue-500' : 'group-hover:text-[#10b981]'}`}>{region.name}</span>
                     </button>
                   ))}
                 </div>
               </div>
               
               {/* Selected Agency Panel - Improved */}
               {selectedAgency && (
                 <div className={`absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 backdrop-blur-xl rounded-2xl border shadow-2xl overflow-hidden z-[1000] animate-slideUp ${isBusiness ? 'bg-[#1e3a8a]/95 border-blue-500/20 shadow-blue-500/10' : 'bg-[#0d1f17]/95 border-[#10b981]/20 shadow-[#10b981]/10'}`}>
                   <div className="p-4">
                     <div className="flex items-start gap-3">
                       <div className={`p-3 rounded-xl border ${isBusiness ? 'bg-blue-500/15 border-blue-500/20' : 'bg-[#10b981]/15 border-[#10b981]/20'}`}>
                         <span className={`material-symbols-outlined text-xl ${isBusiness ? 'text-blue-500' : 'text-[#10b981]'}`}>recycling</span>
                       </div>
                       <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-2">
                           <h3 className="font-bold text-white truncate">{selectedAgency.name}</h3>
                           {selectedAgency.isVerified && (
                             <span className={`material-symbols-outlined text-sm ${isBusiness ? 'text-blue-500' : 'text-[#10b981]'}`}>verified</span>
                           )}
                         </div>
                         <p className={`text-xs mt-0.5 ${isBusiness ? 'text-blue-500/60' : 'text-[#10b981]/60'}`}>{selectedAgency.address?.street}</p>
                         <p className="text-white/50 text-xs">{selectedAgency.address?.city}, {selectedAgency.address?.country || selectedAgency.address?.state}</p>
                       </div>
                       <button 
                         onClick={() => setSelectedAgency(null)}
                         className={`p-1.5 rounded-lg transition-colors ${isBusiness ? 'hover:bg-blue-500/10' : 'hover:bg-[#10b981]/10'}`}
                       >
                         <span className="material-symbols-outlined text-white/50 hover:text-white text-lg">close</span>
                       </button>
                     </div>
                     
                     <div className={`flex items-center gap-3 mt-3 pt-3 border-t ${isBusiness ? 'border-blue-500/10' : 'border-[#10b981]/10'}`}>
                       <div className="flex items-center gap-1 text-[#fbbf24]">
                         <span className="material-symbols-outlined text-sm fill">star</span>
                         <span className="text-sm font-bold">{selectedAgency.rating?.toFixed(1) || '4.5'}</span>
                       </div>
                       <span className="text-white/50 text-xs">({selectedAgency.totalReviews || 0} reviews)</span>
                       <div className="flex-1" />
                       <div className="flex gap-1">
                         {selectedAgency.services?.slice(0, 2).map(s => (
                           <span key={s} className={`text-[9px] uppercase px-2 py-0.5 rounded-full font-medium ${isBusiness ? 'bg-blue-500/10 text-blue-500' : 'bg-[#10b981]/10 text-[#10b981]'}`}>{s}</span>
                         ))}
                       </div>
                     </div>
                   </div>
                   
                   <button
                     onClick={() => handleBookPickup(selectedAgency)}
                     className={`w-full text-white py-3.5 font-bold transition-all flex items-center justify-center gap-2 ${isBusiness ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' : 'bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857]'}`}
                   >
                     <span className="material-symbols-outlined">calendar_month</span>
                     Schedule Pickup
                   </button>
                 </div>
               )}
            </div>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes bounce-marker {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
        
        /* Leaflet container */
        .leaflet-container {
          background: #0B1116 !important;
          font-family: 'Inter', sans-serif;
        }
        
        /* Custom marker wrapper */
        .custom-marker-wrapper {
          background: transparent !important;
          border: none !important;
        }
        
        /* Marker container */
        .marker-container {
          position: relative;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .marker-container:hover {
          transform: scale(1.1);
        }
        .marker-container.selected {
          animation: bounce-marker 1s ease-in-out infinite;
        }
        
        /* Pulse effect - dynamic via inline styles */
        .marker-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          animation: pulse-ring 2s ease-out infinite;
        }
        .marker-container.selected .marker-pulse {
          opacity: 0.5;
          animation: pulse-ring 1.5s ease-out infinite;
        }
        
        /* Main marker pin - dynamic via inline styles */
        .marker-pin {
          position: relative;
          width: 40px;
          height: 40px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        .marker-container:hover .marker-pin {
          filter: brightness(1.1);
        }
        .marker-container.selected .marker-pin {
          filter: brightness(0.9);
        }
        
        /* Marker icon */
        .marker-icon {
          transform: rotate(45deg);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        /* Marker shadow */
        .marker-shadow {
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 6px;
          background: rgba(0,0,0,0.3);
          border-radius: 50%;
          filter: blur(3px);
        }
        
        /* Custom popup styles */
        .custom-popup .leaflet-popup-content-wrapper {
          background: linear-gradient(180deg, #1a2730 0%, #151F26 100%);
          color: white;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(16, 185, 129, 0.1);
          padding: 0;
          overflow: hidden;
        }
        .custom-popup .leaflet-popup-content {
          margin: 0;
          min-width: 220px;
        }
        .custom-popup .leaflet-popup-tip-container {
          display: none;
        }
        .custom-popup .leaflet-popup-close-button {
          color: #94a3b8 !important;
          font-size: 20px !important;
          padding: 8px !important;
          right: 4px !important;
          top: 4px !important;
        }
        .custom-popup .leaflet-popup-close-button:hover {
          color: white !important;
        }
        
        /* Popup content */
        .agency-popup {
          padding: 16px;
        }
        .popup-header {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 12px;
        }
        .popup-icon {
          font-size: 24px;
          padding: 8px;
          border-radius: 12px;
        }
        .popup-title h3 {
          color: white;
          font-weight: 700;
          font-size: 15px;
          margin: 0 0 4px 0;
          line-height: 1.2;
        }
        .popup-location {
          color: #94a3b8;
          font-size: 12px;
        }
        .popup-stats {
          display: flex;
          gap: 16px;
          padding: 10px 0;
          border-top: 1px solid rgba(255,255,255,0.05);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          margin-bottom: 12px;
        }
        .stat {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .stat-icon {
          font-size: 14px;
        }
        .stat-value {
          color: white;
          font-size: 12px;
          font-weight: 600;
        }
        .popup-services {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .service-tag {
          font-size: 10px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        /* Zoom controls */
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.4) !important;
          border-radius: 12px !important;
          overflow: hidden;
        }
        .leaflet-control-zoom a {
          background: #151F26 !important;
          color: white !important;
          border: none !important;
          border-bottom: 1px solid rgba(255,255,255,0.05) !important;
          width: 40px !important;
          height: 40px !important;
          line-height: 40px !important;
          font-size: 18px !important;
          transition: all 0.2s ease !important;
        }
        .leaflet-control-zoom a:hover {
          background: ${isBusiness ? '#3b82f6' : '#10b981'} !important;
          color: white !important;
        }
        .leaflet-control-zoom-in {
          border-radius: 12px 12px 0 0 !important;
        }
        .leaflet-control-zoom-out {
          border-radius: 0 0 12px 12px !important;
          border-bottom: none !important;
        }
        
        /* Hide attribution */
        .leaflet-control-attribution {
          display: none !important;
        }
      `}</style>
    </Layout>
  );
};

export default SearchAgencies;
