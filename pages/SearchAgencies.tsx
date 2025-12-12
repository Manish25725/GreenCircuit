import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { api, Agency, getCurrentUser } from '../services/api';

const SearchAgencies = () => {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState('');
  const user = getCurrentUser();

  useEffect(() => {
    loadAgencies();
  }, []);

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
      return;
    }
    setLoading(true);
    try {
      const result = await api.getAgencies({ city: searchLocation });
      setAgencies(result.agencies || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="" role="User" fullWidth hideSidebar>
      <div className="flex flex-col h-screen bg-[#0B1116] text-gray-200 font-sans overflow-hidden">
        
        {/* Standard Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 transition-all duration-300">
            <div className="flex items-center gap-3 text-white cursor-pointer" onClick={() => window.location.hash = '#/'}>
                <div className="p-2 bg-[#10b981]/10 rounded-lg">
                    <svg className="h-6 w-6 text-[#10b981]" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
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

        {/* Main Content (Split View) */}
        <div className="flex flex-1 pt-[72px] overflow-hidden">
            {/* Sidebar Results */}
            <div className="w-full md:w-[450px] flex flex-col border-r border-white/5 bg-[#151F26] shrink-0 z-10 shadow-xl">
               {/* Internal Search Controls */}
               <div className="p-6 border-b border-white/5">
                  <div className="space-y-1 mb-5">
                     <h1 className="text-2xl font-bold text-white tracking-tight">Select Agency</h1>
                     <p className="text-[#94a3b8] text-sm">
                       {loading ? 'Loading...' : `Found ${agencies.length} recyclers`}
                     </p>
                  </div>
                  
                  {/* Search Input */}
                  <div className="relative mb-4 group">
                     <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-500 group-focus-within:text-[#10b981] transition-colors">search</span>
                     <input 
                       type="text" 
                       placeholder="Search by city..." 
                       value={searchLocation}
                       onChange={(e) => setSearchLocation(e.target.value)}
                       onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                       className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B1116] border border-white/10 text-white text-sm focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] outline-none transition-all placeholder:text-gray-600" 
                     />
                  </div>

                  {/* Filters */}
                  <div className="flex gap-2">
                     <button 
                       onClick={handleSearch}
                       className="flex items-center gap-2 px-4 py-2 bg-[#10b981] rounded-lg text-xs font-bold text-white hover:bg-[#059669] transition-colors cursor-pointer"
                     >
                        Search
                     </button>
                     <button 
                       onClick={() => { setSearchLocation(''); loadAgencies(); }}
                       className="flex items-center gap-2 px-3 py-2 bg-[#0B1116] border border-white/10 rounded-lg text-xs font-medium text-gray-300 hover:border-white/30 hover:text-white transition-colors cursor-pointer"
                     >
                        Clear
                     </button>
                  </div>
               </div>

               {/* Agency List */}
               <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#10b981]"></div>
                    </div>
                  ) : agencies.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
                      <p>No agencies found</p>
                    </div>
                  ) : (
                    agencies.map((agency) => (
                      <div 
                          key={agency._id} 
                          className="bg-[#0B1116] border border-white/5 rounded-xl p-4 hover:border-[#10b981]/50 hover:bg-white/5 transition-all cursor-pointer group"
                          onClick={() => {
                            localStorage.setItem('selectedAgency', JSON.stringify(agency));
                            window.location.hash = '#/schedule';
                          }}
                      >
                         <div className="flex gap-4">
                            <div className="h-20 w-20 rounded-lg bg-[#10b981]/20 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-white/20 transition-colors">
                              <span className="material-symbols-outlined text-[#10b981] text-3xl">recycling</span>
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                               <div>
                                   <div className="flex justify-between items-start">
                                       <h3 className="font-bold text-white text-base truncate pr-2 group-hover:text-[#10b981] transition-colors">{agency.name}</h3>
                                   </div>
                                   <div className="flex items-center gap-3 text-xs text-[#94a3b8] my-1.5">
                                      <div className="flex items-center gap-1 bg-yellow-500/10 px-1.5 py-0.5 rounded text-yellow-500 font-medium">
                                         <span className="material-symbols-outlined text-[14px] fill">star</span>
                                         <span>{agency.rating?.toFixed(1) || 'N/A'}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                         <span className="material-symbols-outlined text-[14px]">location_on</span>
                                         <span>{agency.address?.city}, {agency.address?.state}</span>
                                      </div>
                                   </div>
                               </div>
                               
                               <div className="flex justify-between items-end mt-2">
                                  <div className="flex flex-wrap gap-1.5">
                                      {agency.services?.slice(0, 2).map(t => (
                                      <span key={t} className="text-[10px] uppercase font-bold tracking-wider bg-[#10b981]/10 text-[#10b981] px-2 py-0.5 rounded border border-[#10b981]/20">{t}</span>
                                      ))}
                                  </div>
                                  <button className="bg-[#10b981] text-background-dark px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#059669] transition-colors flex items-center gap-1 shadow-sm text-white">
                                      Book Pickup
                                  </button>
                               </div>
                            </div>
                         </div>
                      </div>
                    ))
                  )}
               </div>
               
            </div>

            {/* Right Map Area */}
            <div className="flex-1 bg-[#1a1a1a] relative hidden md:block">
               <div className="absolute inset-0 bg-cover bg-center" style={{ 
                   backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAsWQOySAenUrjfowNOFPlCOTKLwAVlzr0zRvypqqix9sWWnWapHSOf2UQm1mOrZ0-xZqWnc853J53lp7yfouWxmDNDZ9cIj7x_r2433jNhuH3MfhOzc6NlhTVfalmz5L-kIsEwacbg2VC4aPU60pCKYCPYBea0wtrkmzDD9VxrpcRrJ2hsx3l_D8r8kbpRoK-Zn3gvG2kjbzJrj2jAACD1vwjvEQgzFFh1dwelA32UdUsX8thGtNZgm8lWTmu4t8NX8KBagaGwCg')",
                   filter: 'invert(0.9) hue-rotate(180deg) brightness(0.7) contrast(1.2) grayscale(0.6)'
               }}></div>
               
               {/* Map Controls Overlay */}
               <div className="absolute bottom-8 right-8 flex flex-col gap-2">
                   <button className="h-10 w-10 bg-[#151F26] text-white border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors shadow-lg">
                       <span className="material-symbols-outlined">my_location</span>
                   </button>
                   <button className="h-10 w-10 bg-[#151F26] text-white border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors shadow-lg">
                       <span className="material-symbols-outlined">add</span>
                   </button>
                   <button className="h-10 w-10 bg-[#151F26] text-white border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors shadow-lg">
                       <span className="material-symbols-outlined">remove</span>
                   </button>
               </div>
            </div>
        </div>
      </div>
    </Layout>
  );
};

export default SearchAgencies;