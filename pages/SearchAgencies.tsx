import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import { api, Agency, getCurrentUser } from '../services/api';

// Declare Leaflet types
declare const L: any;

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

  useEffect(() => {
    loadAgencies();
  }, []);

  // Initialize map
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current && typeof L !== 'undefined') {
      // Create map centered on world view
      mapInstanceRef.current = L.map(mapRef.current, {
        center: [20, 0],
        zoom: 2,
        zoomControl: false,
        attributionControl: false,
      });

      // Add dark-themed tile layer (CartoDB Dark Matter)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);

      // Add custom zoom control
      L.control.zoom({ position: 'bottomright' }).addTo(mapInstanceRef.current);
      
      setMapReady(true);
    }

    return () => {
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

    // Add markers for each agency
    agencies.forEach(agency => {
      const city = agency.address?.city || '';
      const cityData = Object.entries(worldCities).find(
        ([key]) => key.toLowerCase() === city.toLowerCase()
      );

      if (cityData) {
        const [, { coords }] = cityData;
        
        // Custom marker icon
        const customIcon = L.divIcon({
          className: 'custom-marker',
          html: `
            <div class="marker-pin ${selectedAgency?._id === agency._id ? 'selected' : ''}">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
          `,
          iconSize: [36, 42],
          iconAnchor: [18, 42],
          popupAnchor: [0, -42],
        });

        const marker = L.marker(coords, { icon: customIcon })
          .addTo(mapInstanceRef.current)
          .on('click', () => {
            setSelectedAgency(agency);
            mapInstanceRef.current.flyTo(coords, 12, { duration: 1 });
          });

        // Add popup
        marker.bindPopup(`
          <div class="popup-content">
            <h3>${agency.name}</h3>
            <p>${agency.address?.city}, ${agency.address?.country || agency.address?.state}</p>
            <div class="rating">
              <span>★</span> ${agency.rating?.toFixed(1) || '4.5'}
            </div>
          </div>
        `, { className: 'dark-popup' });

        markersRef.current.push(marker);
      }
    });

    // Fit bounds if we have markers
    if (markersRef.current.length > 0) {
      const group = L.featureGroup(markersRef.current);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.2));
    }
  }, [agencies, mapReady]);

  const loadAgencies = async () => {
    setLoading(true);
    try {
      const result = await api.getAgencies();
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
    localStorage.setItem('selectedAgency', JSON.stringify(agency));
    window.location.hash = `#/schedule?agency=${agency._id}&name=${encodeURIComponent(agency.name)}`;
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
    <Layout title="" role="User" fullWidth hideSidebar>
      <div className="flex flex-col h-screen bg-[#0B1116] text-gray-200 font-sans overflow-hidden">
        
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50">
            <div className="flex items-center gap-3 text-white cursor-pointer" onClick={() => window.location.hash = '#/'}>
                <div className="p-2 bg-[#10b981]/10 rounded-lg">
                    <svg className="h-6 w-6 text-[#10b981]" fill="currentColor" viewBox="0 0 48 48">
                    <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"></path>
                    </svg>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white">EcoCycle</h2>
            </div>
            <nav className="hidden md:flex flex-1 justify-center gap-1">
                <a className="text-sm font-medium px-5 py-2.5 rounded-full text-[#94a3b8] hover:text-white hover:bg-white/5 transition-all cursor-pointer" onClick={() => window.location.hash = '#/dashboard'}>Dashboard</a>
                <a className="text-sm font-semibold px-5 py-2.5 rounded-full text-white bg-white/10 shadow-inner border border-white/5 cursor-pointer" onClick={() => window.location.hash = '#/search'}>New Request</a>
                <a className="text-sm font-medium px-5 py-2.5 rounded-full text-[#94a3b8] hover:text-white hover:bg-white/5 transition-all cursor-pointer" onClick={() => window.location.hash = '#/rewards'}>Rewards</a>
                <a className="text-sm font-medium px-5 py-2.5 rounded-full text-[#94a3b8] hover:text-white hover:bg-white/5 transition-all cursor-pointer" onClick={() => window.location.hash = '#/certificate'}>Certificate</a>
            </nav>
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => window.location.hash = '#/profile'}
                    className="hidden sm:flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-[#151F26] border border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"
                >
                    <div className="size-8 rounded-full bg-[#10b981] flex items-center justify-center ring-2 ring-white/10 group-hover:ring-[#10b981]/50 transition-all text-white font-bold text-sm">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="text-sm font-medium text-gray-200">{user?.name || 'User'}</span>
                </button>
                <button className="relative p-2.5 rounded-full bg-[#151F26] border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                    <span className="absolute top-2.5 right-3 size-2 bg-red-500 rounded-full border-2 border-[#151F26]"></span>
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
                  <div className="flex items-center justify-between mb-4">
                     <div>
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
                       className="w-full pl-10 pr-20 py-2.5 rounded-lg bg-[#0B1116] border border-white/10 text-white text-sm focus:ring-2 focus:ring-[#10b981]/50 focus:border-[#10b981] outline-none transition-all placeholder:text-gray-600" 
                     />
                     <button 
                       onClick={handleSearch}
                       className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#10b981] text-white text-xs font-bold rounded-md hover:bg-[#059669] transition-colors"
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
                              ? 'bg-[#10b981] text-white' 
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
                      <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#10b981] border-t-transparent mb-3"></div>
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
                            className={`bg-[#151F26] border rounded-xl p-3.5 hover:border-[#10b981]/50 transition-all cursor-pointer group ${
                              selectedAgency?._id === agency._id ? 'border-[#10b981] ring-1 ring-[#10b981]/20' : 'border-white/5'
                            }`}
                            onClick={() => handleAgencyClick(agency)}
                        >
                           <div className="flex gap-3">
                              {/* Icon with Country Flag */}
                              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-[#10b981]/20 to-[#10b981]/5 flex items-center justify-center shrink-0 border border-[#10b981]/20 relative">
                                <span className="material-symbols-outlined text-[#10b981] text-2xl">recycling</span>
                                {country && (
                                  <span className="absolute -bottom-1 -right-1 text-sm">
                                    {getCountryFlag(country)}
                                  </span>
                                )}
                              </div>
                              
                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                 <div className="flex items-start justify-between gap-2">
                                     <h3 className="font-semibold text-white text-sm truncate group-hover:text-[#10b981] transition-colors">{agency.name}</h3>
                                     {agency.isVerified && (
                                       <span className="material-symbols-outlined text-[#10b981] text-base shrink-0" title="Verified">verified</span>
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
                                          <span key={t} className="text-[10px] uppercase font-medium tracking-wide bg-[#10b981]/10 text-[#10b981] px-2 py-0.5 rounded">{t}</span>
                                        ))}
                                    </div>
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); handleBookPickup(agency); }}
                                      className="bg-[#10b981] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#059669] transition-colors flex items-center gap-1"
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
            <div className="flex-1 relative hidden md:flex flex-col bg-[#0B1116]">
               {/* Leaflet Map Container */}
               <div 
                 ref={mapRef} 
                 className="flex-1 z-0"
                 style={{ background: '#0B1116' }}
               />
               
               {/* Map Overlay - Legend */}
               <div className="absolute top-4 left-4 bg-[#151F26]/95 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/10 z-[1000]">
                 <div className="flex items-center gap-2 text-white text-sm font-bold mb-2">
                   <span className="material-symbols-outlined text-[#10b981]">public</span>
                   Global E-Waste Network
                 </div>
                 <div className="flex items-center gap-4 text-xs text-[#94a3b8]">
                   <span className="flex items-center gap-1">
                     <span className="w-3 h-3 rounded-full bg-[#10b981]"></span>
                     Active ({agencies.length})
                   </span>
                 </div>
                 <p className="text-[10px] text-[#94a3b8] mt-2">Click markers or agencies in list</p>
               </div>
               
               {/* Selected Agency Panel */}
               {selectedAgency && (
                 <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 bg-[#151F26]/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden z-[1000] animate-slideUp">
                   <div className="p-4">
                     <div className="flex items-start gap-3">
                       <div className="p-3 bg-[#10b981]/20 rounded-xl">
                         <span className="material-symbols-outlined text-[#10b981] text-xl">recycling</span>
                       </div>
                       <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-2">
                           <h3 className="font-bold text-white truncate">{selectedAgency.name}</h3>
                           {selectedAgency.isVerified && (
                             <span className="material-symbols-outlined text-[#10b981] text-sm">verified</span>
                           )}
                         </div>
                         <p className="text-[#94a3b8] text-xs mt-0.5">{selectedAgency.address?.street}</p>
                         <p className="text-[#94a3b8] text-xs">{selectedAgency.address?.city}, {selectedAgency.address?.country || selectedAgency.address?.state}</p>
                       </div>
                       <button 
                         onClick={() => setSelectedAgency(null)}
                         className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                       >
                         <span className="material-symbols-outlined text-[#94a3b8] text-lg">close</span>
                       </button>
                     </div>
                     
                     <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/5">
                       <div className="flex items-center gap-1 text-yellow-500">
                         <span className="material-symbols-outlined text-sm fill">star</span>
                         <span className="text-sm font-bold">{selectedAgency.rating?.toFixed(1) || '4.5'}</span>
                       </div>
                       <span className="text-[#94a3b8] text-xs">({selectedAgency.totalReviews || 0} reviews)</span>
                       <div className="flex-1" />
                       <div className="flex gap-1">
                         {selectedAgency.services?.slice(0, 2).map(s => (
                           <span key={s} className="text-[9px] uppercase bg-white/5 text-[#94a3b8] px-1.5 py-0.5 rounded">{s}</span>
                         ))}
                       </div>
                     </div>
                   </div>
                   
                   <button
                     onClick={() => handleBookPickup(selectedAgency)}
                     className="w-full bg-[#10b981] text-white py-3.5 font-bold hover:bg-[#059669] transition-colors flex items-center justify-center gap-2"
                   >
                     <span className="material-symbols-outlined">calendar_month</span>
                     Schedule International Pickup
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
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
        
        /* Leaflet custom styles */
        .leaflet-container {
          background: #0B1116 !important;
          font-family: 'Inter', sans-serif;
        }
        
        /* Custom marker */
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        .marker-pin {
          width: 36px;
          height: 36px;
          border-radius: 50% 50% 50% 0;
          background: #10b981;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
          border: 3px solid white;
          transition: all 0.2s ease;
        }
        .marker-pin:hover {
          transform: rotate(-45deg) scale(1.1);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
        }
        .marker-pin.selected {
          transform: rotate(-45deg) scale(1.2);
          box-shadow: 0 6px 24px rgba(16, 185, 129, 0.6);
          background: #059669;
        }
        .marker-pin svg {
          transform: rotate(45deg);
          width: 18px;
          height: 18px;
        }
        
        /* Popup styles */
        .dark-popup .leaflet-popup-content-wrapper {
          background: #151F26;
          color: white;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        }
        .dark-popup .leaflet-popup-tip {
          background: #151F26;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .popup-content {
          padding: 4px;
        }
        .popup-content h3 {
          color: white;
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 4px;
        }
        .popup-content p {
          color: #94a3b8;
          font-size: 12px;
          margin-bottom: 6px;
        }
        .popup-content .rating {
          color: #eab308;
          font-size: 12px;
          font-weight: 500;
        }
        
        /* Zoom controls */
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
        }
        .leaflet-control-zoom a {
          background: #151F26 !important;
          color: white !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          font-size: 18px !important;
        }
        .leaflet-control-zoom a:hover {
          background: #10b981 !important;
          color: white !important;
        }
        .leaflet-control-zoom-in {
          border-radius: 8px 8px 0 0 !important;
        }
        .leaflet-control-zoom-out {
          border-radius: 0 0 8px 8px !important;
        }
      `}</style>
    </Layout>
  );
};

export default SearchAgencies;
