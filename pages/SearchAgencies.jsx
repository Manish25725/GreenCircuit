import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout.jsx';
import { api, getCurrentUser, isAuthenticated } from '../services/api.js';
import { useNavigate } from 'react-router-dom';
// Helper to get user role
const getUserRole = () => {
    try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            const role = user.role?.toLowerCase();
            if (role === 'business')
                return 'Business';
            if (role === 'agency' || role === 'partner')
                return 'Agency';
            if (role === 'admin')
                return 'Admin';
        }
    }
    catch (e) { }
    return 'User';
};
// Helper to get dashboard path based on role
const getDashboardPath = (role) => {
    switch (role) {
        case 'Business': return '/business';
        case 'Agency': return '/agency';
        case 'Admin': return '/admin';
        default: return '/dashboard';
    }
};
// Worldwide city coordinates
const worldCities = {
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
    const navigate = useNavigate();
    const [agencies, setAgencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchLocation, setSearchLocation] = useState('');
    const [selectedAgency, setSelectedAgency] = useState(null);
    const [activeRegion, setActiveRegion] = useState('All');
    const [mapReady, setMapReady] = useState(false);
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef([]);
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
                }
                catch (error) {
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
        if (!mapInstanceRef.current || !mapReady)
            return;
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
            let coords = null;
            let coordSource = '';
            // First try to use exact coordinates from agency
            if (agency.address?.coordinates?.lat && agency.address?.coordinates?.lng) {
                coords = [agency.address.coordinates.lat, agency.address.coordinates.lng];
                coordSource = 'GPS coordinates';
            }
            else {
                // Fallback to city lookup
                const city = agency.address?.city || '';
                const cityData = Object.entries(worldCities).find(([key]) => key.toLowerCase() === city.toLowerCase());
                if (cityData) {
                    coords = cityData[1].coords;
                    coordSource = `City lookup (${city})`;
                }
                else {
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
              ${(agency.services || ['Electronics', 'Batteries']).slice(0, 3).map(s => `<span class="service-tag" style="background: rgba(${markerColorRgb}, 0.1); color: ${markerColor};">${s}</span>`).join('')}
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
                    }
                    else {
                        // Multiple markers - fit all in view
                        mapInstanceRef.current.fitBounds(bounds.pad(0.1), {
                            maxZoom: 12,
                            animate: true,
                            duration: 1
                        });
                    }
                }
            }, 100);
        }
    }, [agencies, mapReady, selectedAgency, isBusiness]);
    const loadAgencies = async () => {
        setLoading(true);
        try {
            const result = await api.getAgencies();
            setAgencies(result.agencies || []);
        }
        catch (error) {
        }
        finally {
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
            const cityData = Object.entries(worldCities).find(([key]) => key.toLowerCase() === searchLocation.toLowerCase());
            if (cityData && mapInstanceRef.current) {
                mapInstanceRef.current.flyTo(cityData[1].coords, 10, { duration: 1.5 });
            }
        }
        catch (error) {
        }
        finally {
            setLoading(false);
        }
    };
    const handleRegionFilter = async (region) => {
        setActiveRegion(region);
        setLoading(true);
        try {
            const result = await api.getAgencies();
            let filtered = result.agencies || [];
            if (region !== 'All') {
                // Filter by region/country
                const regionCountries = {
                    'India': ['India'],
                    'USA': ['USA', 'United States'],
                    'Europe': ['UK', 'France', 'Germany', 'Netherlands', 'Spain', 'Italy'],
                    'Asia Pacific': ['Singapore', 'Japan', 'Australia', 'UAE', 'Hong Kong', 'China'],
                };
                const countries = regionCountries[region] || [];
                filtered = filtered.filter(a => {
                    const city = a.address?.city || '';
                    const cityData = Object.entries(worldCities).find(([key]) => key.toLowerCase() === city.toLowerCase());
                    return cityData && countries.includes(cityData[1].country);
                });
            }
            setAgencies(filtered);
            // Pan to region
            if (mapInstanceRef.current) {
                const regionCenters = {
                    'All': { center: [20, 0], zoom: 2 },
                    'India': { center: [20.5937, 78.9629], zoom: 5 },
                    'USA': { center: [39.8283, -98.5795], zoom: 4 },
                    'Europe': { center: [50.0, 10.0], zoom: 4 },
                    'Asia Pacific': { center: [15.0, 115.0], zoom: 3 },
                };
                const { center, zoom } = regionCenters[region] || regionCenters['All'];
                mapInstanceRef.current.flyTo(center, zoom, { duration: 1 });
            }
        }
        catch (error) {
        }
        finally {
            setLoading(false);
        }
    };
    const handleAgencyClick = (agency) => {
        setSelectedAgency(selectedAgency?._id === agency._id ? null : agency);
        // Pan map to agency location
        if (mapInstanceRef.current) {
            const city = agency.address?.city || '';
            const cityData = Object.entries(worldCities).find(([key]) => key.toLowerCase() === city.toLowerCase());
            if (cityData) {
                mapInstanceRef.current.flyTo(cityData[1].coords, 12, { duration: 1 });
            }
        }
    };
    const handleBookPickup = (agency) => {
        // Check if user is logged in before booking
        if (!isAuthenticated()) {
            alert('Please log in to schedule a pickup');
            navigate('/login');
            return;
        }
        // Navigate to schedule page with agency ID - data will be fetched from MongoDB
        navigate(`/schedule?agency=${agency._id}`);
    };
    const getCountryFlag = (country) => {
        const flags = {
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
    return (_jsxs(Layout, { title: "", role: userRole, fullWidth: true, hideSidebar: true, children: [_jsxs("div", { className: "flex flex-col h-screen bg-[#0B1116] text-white font-sans overflow-hidden", children: [_jsxs("header", { className: "flex items-center justify-between whitespace-nowrap border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50", children: [_jsxs("div", { className: "flex items-center gap-3 text-white cursor-pointer", onClick: () => navigate('/'), children: [_jsx("div", { className: `p-2 rounded-lg ${isBusiness ? 'bg-blue-500/10' : 'bg-[#10b981]/10'}`, children: _jsx("svg", { className: `h-6 w-6 ${isBusiness ? 'text-blue-500' : 'text-[#10b981]'}`, fill: "currentColor", viewBox: "0 0 48 48", children: _jsx("path", { d: "M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" }) }) }), _jsxs("h2", { className: "text-xl font-bold tracking-tight text-white", children: ["EcoCycle ", _jsx("span", { className: `font-semibold ${isBusiness ? 'text-blue-500' : 'text-[#10b981]'}`, children: isBusiness ? 'Business' : 'Resident' })] })] }), _jsx("nav", { className: "hidden md:flex flex-1 justify-center gap-1" }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "relative group", children: [_jsxs("button", { onClick: () => navigate(dashboardPath), className: "hidden sm:flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-[#151F26] border border-white/5 hover:bg-white/5 transition-colors cursor-pointer", children: [_jsx("div", { className: "size-8 rounded-full ring-2 ring-white/10 group-hover:ring-[#06b6d4]/50 transition-all overflow-hidden bg-[#06b6d4] flex items-center justify-center", children: user?.logo || user?.avatar ? (_jsx("img", { src: `${user?.logo || user?.avatar}?t=${avatarKey}`, alt: "Profile", className: "w-full h-full object-cover", onError: (e) => {
                                                                e.currentTarget.style.display = 'none';
                                                                e.currentTarget.parentElement.innerHTML = `<span class="text-white text-xs font-bold">${(user?.name || user?.companyName || 'U').charAt(0).toUpperCase()}</span>`;
                                                            } })) : (_jsx("span", { className: "text-white text-xs font-bold", children: (user?.name || user?.companyName || 'U').charAt(0).toUpperCase() })) }), _jsx("span", { className: "text-sm font-medium text-gray-200", children: user?.name || user?.companyName || (isBusiness ? 'Business' : 'User') })] }), _jsx("div", { className: "absolute top-14 right-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100]", children: _jsx("div", { className: "bg-[#151F26] border border-white/5 rounded-2xl p-4 shadow-2xl", children: _jsx("div", { className: "size-32 rounded-xl ring-4 ring-[#06b6d4]/30 overflow-hidden bg-[#06b6d4] flex items-center justify-center", children: user?.logo || user?.avatar ? (_jsx("img", { src: `${user?.logo || user?.avatar}?t=${avatarKey}`, alt: "Profile", className: "w-full h-full object-cover" })) : (_jsx("span", { className: "text-white text-4xl font-bold", children: (user?.name || user?.companyName || 'U').charAt(0).toUpperCase() })) }) }) })] }), _jsx("button", { onClick: () => navigate(isBusiness ? '/business/notifications' : '/notifications'), className: "p-2.5 rounded-full bg-[#151F26] border border-white/5 text-slate-400 hover:text-white hover:bg-white/5 transition-colors", title: "Notifications", children: _jsx("span", { className: "material-symbols-outlined text-[20px]", children: "notifications" }) })] })] }), _jsxs("div", { className: "flex flex-1 pt-[72px] overflow-hidden", children: [_jsxs("div", { className: "w-full md:w-[420px] flex flex-col border-r border-white/5 bg-[#0F1419] shrink-0 z-10", children: [_jsxs("div", { className: "p-5 border-b border-white/5 bg-[#151F26]", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx("button", { onClick: () => navigate(dashboardPath), className: `p-2 rounded-lg border transition-colors ${isBusiness ? 'bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20' : 'bg-[#10b981]/10 border-[#10b981]/20 text-[#10b981] hover:bg-[#10b981]/20'}`, title: "Back to Dashboard", children: _jsx("span", { className: "material-symbols-outlined text-lg", children: "arrow_back" }) }), _jsxs("div", { className: "flex-1", children: [_jsxs("h1", { className: "text-xl font-bold text-white flex items-center gap-2", children: [_jsx("span", { children: "\uD83C\uDF0D" }), " Global Recyclers"] }), _jsx("p", { className: "text-[#94a3b8] text-xs mt-0.5", children: loading ? 'Searching worldwide...' : `${agencies.length} agencies in ${activeRegion === 'All' ? 'all regions' : activeRegion}` })] })] }), _jsxs("div", { className: "relative mb-3", children: [_jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-500 text-lg", children: "search" }), _jsx("input", { type: "text", placeholder: "Search city worldwide...", value: searchLocation, onChange: (e) => setSearchLocation(e.target.value), onKeyDown: (e) => e.key === 'Enter' && handleSearch(), className: `w-full pl-10 pr-20 py-2.5 rounded-lg bg-[#0B1116] border border-white/5 text-white text-sm focus:ring-2 outline-none transition-all placeholder:text-gray-600 ${isBusiness ? 'focus:ring-blue-500/50 focus:border-blue-500' : 'focus:ring-[#10b981]/50 focus:border-[#10b981]'}` }), _jsx("button", { onClick: handleSearch, className: `absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 text-white text-xs font-bold rounded-md transition-colors ${isBusiness ? 'bg-blue-500 hover:bg-blue-600' : 'bg-[#10b981] hover:bg-[#059669]'}`, children: "Search" })] }), _jsx("div", { className: "flex flex-wrap gap-1.5", children: regions.map(region => (_jsxs("button", { onClick: () => handleRegionFilter(region.name), className: `px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${activeRegion === region.name
                                                        ? (isBusiness ? 'bg-blue-500 text-white' : 'bg-[#10b981] text-white')
                                                        : 'bg-white/5 text-[#94a3b8] hover:bg-white/5 hover:text-white'}`, children: [_jsx("span", { children: region.icon }), region.name] }, region.name))) })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-3 space-y-2", children: loading ? (_jsxs("div", { className: "flex flex-col items-center justify-center py-16", children: [_jsxs("div", { className: "relative flex items-center justify-center mb-4", children: [_jsxs("div", { className: `w-20 h-20 rounded-full flex items-center justify-center relative bg-[#0B1116]/50 backdrop-blur-sm ${isBusiness ? 'border border-blue-500/20 shadow-[0_0_40px_-10px_rgba(59,130,246,0.2)]' : 'border border-[#10b981]/20 shadow-[0_0_40px_-10px_rgba(16,185,129,0.2)]'}`, children: [_jsx("div", { className: `absolute inset-0 rounded-full blur-xl animate-pulse ${isBusiness ? 'bg-blue-500/5' : 'bg-[#10b981]/5'}` }), _jsx("div", { className: `size-10 relative z-10 flex items-center justify-center ${isBusiness ? 'text-blue-500' : 'text-[#10b981]'}`, children: _jsx("svg", { className: "w-full h-full drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]", fill: "none", viewBox: "0 0 48 48", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "3" }) }) }), _jsx("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 w-full h-full animate-spin [animation-duration:2s]", children: _jsx("div", { className: `absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${isBusiness ? 'bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'bg-[#10b981] shadow-[0_0_10px_#10b981]'}` }) })] }), _jsx("div", { className: `absolute top-0 right-0 w-1.5 h-1.5 rounded-full animate-ping [animation-duration:2s] ${isBusiness ? 'bg-blue-500/40' : 'bg-[#10b981]/40'}` }), _jsx("div", { className: `absolute bottom-2 -left-2 w-1 h-1 rounded-full animate-pulse ${isBusiness ? 'bg-blue-500/30' : 'bg-[#10b981]/30'}` })] }), _jsx("p", { className: "text-[#94a3b8] text-sm", children: "Searching global network..." })] })) : agencies.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-center", children: [_jsx("div", { className: "p-4 bg-white/5 rounded-full mb-4", children: _jsx("span", { className: "material-symbols-outlined text-4xl text-[#94a3b8]", children: "travel_explore" }) }), _jsx("p", { className: "text-white font-medium", children: "No agencies found" }), _jsx("p", { className: "text-[#94a3b8] text-sm mt-1", children: "Try searching for cities like London, Tokyo, or New York" })] })) : (agencies.map((agency) => {
                                            const city = agency.address?.city || '';
                                            const cityData = Object.entries(worldCities).find(([key]) => key.toLowerCase() === city.toLowerCase());
                                            const country = cityData ? cityData[1].country : '';
                                            return (_jsxs("div", { className: `bg-[#151F26] border rounded-xl p-3.5 transition-all cursor-pointer group ${selectedAgency?._id === agency._id
                                                    ? (isBusiness ? 'border-blue-500 ring-1 ring-blue-500/20 hover:border-blue-500/50' : 'border-[#10b981] ring-1 ring-[#10b981]/20 hover:border-[#10b981]/50')
                                                    : (isBusiness ? 'border-white/5 hover:border-blue-500/50' : 'border-white/5 hover:border-[#10b981]/50')}`, onClick: () => handleAgencyClick(agency), children: [_jsxs("div", { className: "flex gap-3", children: [_jsxs("div", { className: `h-14 w-14 rounded-xl flex items-center justify-center shrink-0 relative ${isBusiness ? 'bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20' : 'bg-gradient-to-br from-[#10b981]/20 to-[#10b981]/5 border border-[#10b981]/20'}`, children: [_jsx("span", { className: `material-symbols-outlined text-2xl ${isBusiness ? 'text-blue-500' : 'text-[#10b981]'}`, children: "recycling" }), country && (_jsx("span", { className: "absolute -bottom-1 -right-1 text-sm", children: getCountryFlag(country) }))] }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsx("h3", { className: `font-semibold text-white text-sm truncate transition-colors ${isBusiness ? 'group-hover:text-blue-500' : 'group-hover:text-[#10b981]'}`, children: agency.name }), agency.isVerified && (_jsx("span", { className: `material-symbols-outlined text-base shrink-0 ${isBusiness ? 'text-blue-500' : 'text-[#10b981]'}`, title: "Verified", children: "verified" }))] }), _jsxs("div", { className: "flex items-center gap-2 mt-1", children: [_jsxs("div", { className: "flex items-center gap-0.5 text-yellow-500 text-xs", children: [_jsx("span", { className: "material-symbols-outlined text-[14px] fill", children: "star" }), _jsx("span", { className: "font-medium", children: agency.rating?.toFixed(1) || '4.5' })] }), _jsx("span", { className: "text-white/20", children: "\u2022" }), _jsxs("span", { className: "text-[#94a3b8] text-xs truncate flex items-center gap-1", children: [_jsx("span", { className: "material-symbols-outlined text-[12px]", children: "location_on" }), agency.address?.city || 'Unknown', country ? `, ${country}` : ''] })] }), _jsxs("div", { className: "flex items-center justify-between mt-2.5", children: [_jsx("div", { className: "flex gap-1", children: agency.services?.slice(0, 2).map(t => (_jsx("span", { className: `text-[10px] uppercase font-medium tracking-wide px-2 py-0.5 rounded ${isBusiness ? 'bg-blue-500/10 text-blue-500' : 'bg-[#10b981]/10 text-[#10b981]'}`, children: t }, t))) }), _jsxs("button", { onClick: (e) => { e.stopPropagation(); handleBookPickup(agency); }, className: `text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${isBusiness ? 'bg-blue-500 hover:bg-blue-600' : 'bg-[#10b981] hover:bg-[#059669]'}`, children: [_jsx("span", { className: "material-symbols-outlined text-sm", children: "calendar_month" }), "Book"] })] })] })] }), selectedAgency?._id === agency._id && (_jsxs("div", { className: "mt-3 pt-3 border-t border-white/5 animate-fadeIn", children: [_jsx("p", { className: "text-[#94a3b8] text-xs mb-2", children: agency.description || 'Professional e-waste recycling services with certified data destruction and international compliance.' }), _jsxs("div", { className: "flex items-center gap-4 text-xs", children: [_jsxs("span", { className: "text-[#94a3b8] flex items-center gap-1", children: [_jsx("span", { className: "material-symbols-outlined text-sm", children: "schedule" }), "Mon-Sat, 9AM-6PM"] }), _jsxs("span", { className: "text-[#94a3b8] flex items-center gap-1", children: [_jsx("span", { className: "material-symbols-outlined text-sm", children: "language" }), country || 'International'] })] })] }))] }, agency._id));
                                        })) })] }), _jsxs("div", { className: "flex-1 relative hidden md:flex flex-col bg-[#0B1116] overflow-hidden", children: [_jsx("div", { ref: mapRef, className: "absolute inset-0 z-0", style: { background: '#0B1116' } }), _jsxs("div", { className: "absolute inset-0 pointer-events-none z-[500]", children: [_jsx("div", { className: "absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0B1116]/80 to-transparent" }), _jsx("div", { className: "absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0B1116]/80 to-transparent" }), _jsx("div", { className: "absolute top-0 left-0 bottom-0 w-16 bg-gradient-to-r from-[#0B1116]/50 to-transparent" })] }), _jsxs("div", { className: "absolute top-4 left-4 right-4 flex items-start justify-between z-[1000]", children: [_jsxs("div", { className: `backdrop-blur-xl px-5 py-4 rounded-2xl border shadow-2xl ${isBusiness ? 'bg-[#1e3a8a]/95 border-blue-500/20 shadow-blue-500/5' : 'bg-[#0d1f17]/95 border-[#10b981]/20 shadow-[#10b981]/5'}`, children: [_jsxs("div", { className: "flex items-center gap-3 mb-3", children: [_jsx("div", { className: `p-2.5 rounded-xl border ${isBusiness ? 'bg-blue-500/15 border-blue-500/20' : 'bg-[#10b981]/15 border-[#10b981]/20'}`, children: _jsx("span", { className: `material-symbols-outlined text-xl ${isBusiness ? 'text-blue-500' : 'text-[#10b981]'}`, children: "public" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-white font-bold text-sm", children: isBusiness ? 'Business Disposal Network' : 'Global Recycling Network' }), _jsx("p", { className: `text-xs ${isBusiness ? 'text-blue-500/70' : 'text-[#10b981]/70'}`, children: "Real-time agency locations" })] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "relative flex h-3 w-3", children: [_jsx("span", { className: `animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isBusiness ? 'bg-blue-500' : 'bg-[#10b981]'}` }), _jsx("span", { className: `relative inline-flex rounded-full h-3 w-3 ${isBusiness ? 'bg-blue-500' : 'bg-[#10b981]'}` })] }), _jsxs("span", { className: `text-xs font-semibold ${isBusiness ? 'text-blue-500' : 'text-[#10b981]'}`, children: [agencies.length, " Active"] })] }), _jsx("div", { className: `h-4 w-px ${isBusiness ? 'bg-blue-500/20' : 'bg-[#10b981]/20'}` }), _jsx("span", { className: "text-white/60 text-xs", children: "Click markers to explore" })] })] }), _jsx("div", { className: "flex flex-col gap-2", children: [
                                                    { name: 'India', coords: [22.5937, 78.9629], zoom: 5, flag: '🇮🇳' },
                                                    { name: 'World', coords: [20, 0], zoom: 2, flag: '🌍' },
                                                ].map(region => (_jsxs("button", { onClick: () => {
                                                        if (mapInstanceRef.current) {
                                                            mapInstanceRef.current.flyTo(region.coords, region.zoom, { duration: 1.5 });
                                                        }
                                                    }, className: `backdrop-blur-xl px-4 py-2.5 rounded-xl border transition-all flex items-center gap-2 group shadow-lg ${isBusiness ? 'bg-[#1e3a8a]/95 border-blue-500/20 hover:border-blue-500/50 hover:bg-blue-500/10' : 'bg-[#0d1f17]/95 border-[#10b981]/20 hover:border-[#10b981]/50 hover:bg-[#10b981]/10'}`, children: [_jsx("span", { className: "text-base", children: region.flag }), _jsx("span", { className: `text-white/90 text-xs font-medium transition-colors ${isBusiness ? 'group-hover:text-blue-500' : 'group-hover:text-[#10b981]'}`, children: region.name })] }, region.name))) })] }), selectedAgency && (_jsxs("div", { className: `absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 backdrop-blur-xl rounded-2xl border shadow-2xl overflow-hidden z-[1000] animate-slideUp ${isBusiness ? 'bg-[#1e3a8a]/95 border-blue-500/20 shadow-blue-500/10' : 'bg-[#0d1f17]/95 border-[#10b981]/20 shadow-[#10b981]/10'}`, children: [_jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: `p-3 rounded-xl border ${isBusiness ? 'bg-blue-500/15 border-blue-500/20' : 'bg-[#10b981]/15 border-[#10b981]/20'}`, children: _jsx("span", { className: `material-symbols-outlined text-xl ${isBusiness ? 'text-blue-500' : 'text-[#10b981]'}`, children: "recycling" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h3", { className: "font-bold text-white truncate", children: selectedAgency.name }), selectedAgency.isVerified && (_jsx("span", { className: `material-symbols-outlined text-sm ${isBusiness ? 'text-blue-500' : 'text-[#10b981]'}`, children: "verified" }))] }), _jsx("p", { className: `text-xs mt-0.5 ${isBusiness ? 'text-blue-500/60' : 'text-[#10b981]/60'}`, children: selectedAgency.address?.street }), _jsxs("p", { className: "text-white/50 text-xs", children: [selectedAgency.address?.city, ", ", selectedAgency.address?.country || selectedAgency.address?.state] })] }), _jsx("button", { onClick: () => setSelectedAgency(null), className: `p-1.5 rounded-lg transition-colors ${isBusiness ? 'hover:bg-blue-500/10' : 'hover:bg-[#10b981]/10'}`, children: _jsx("span", { className: "material-symbols-outlined text-white/50 hover:text-white text-lg", children: "close" }) })] }), _jsxs("div", { className: `flex items-center gap-3 mt-3 pt-3 border-t ${isBusiness ? 'border-blue-500/10' : 'border-[#10b981]/10'}`, children: [_jsxs("div", { className: "flex items-center gap-1 text-[#fbbf24]", children: [_jsx("span", { className: "material-symbols-outlined text-sm fill", children: "star" }), _jsx("span", { className: "text-sm font-bold", children: selectedAgency.rating?.toFixed(1) || '4.5' })] }), _jsxs("span", { className: "text-white/50 text-xs", children: ["(", selectedAgency.totalReviews || 0, " reviews)"] }), _jsx("div", { className: "flex-1" }), _jsx("div", { className: "flex gap-1", children: selectedAgency.services?.slice(0, 2).map(s => (_jsx("span", { className: `text-[9px] uppercase px-2 py-0.5 rounded-full font-medium ${isBusiness ? 'bg-blue-500/10 text-blue-500' : 'bg-[#10b981]/10 text-[#10b981]'}`, children: s }, s))) })] })] }), _jsxs("button", { onClick: () => handleBookPickup(selectedAgency), className: `w-full text-white py-3.5 font-bold transition-all flex items-center justify-center gap-2 ${isBusiness ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' : 'bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857]'}`, children: [_jsx("span", { className: "material-symbols-outlined", children: "calendar_month" }), "Schedule Pickup"] })] }))] })] })] }), _jsx("style", { children: `
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
      ` })] }));
};
export default SearchAgencies;
