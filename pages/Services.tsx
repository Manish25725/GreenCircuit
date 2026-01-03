import React from 'react';

const Services = () => {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#0B1116] font-sans text-gray-200 antialiased overflow-x-hidden selection:bg-[#34D399] selection:text-[#0B1120]">
      {/* Full Navbar */}
      <div className="w-full flex justify-center fixed top-0 left-0 right-0 z-50">
        <div className="absolute inset-0 bg-[#0B1116]/80 backdrop-blur-md border-b border-white/5"></div>
        <div className="w-full max-w-7xl px-4 sm:px-6 relative z-10">
          <header className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.hash = '#/'}>
                <div className="size-8 sm:size-10 text-[#34D399] flex items-center justify-center">
                  <svg className="w-full h-full drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
                  </svg>
                </div>
              </div>
              <span className="text-slate-50 text-xl sm:text-2xl font-black tracking-tight">EcoCycle</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <button className="text-slate-400 hover:text-[#34D399] text-sm font-medium transition-colors bg-transparent border-none cursor-pointer" onClick={() => window.location.hash = '#/how-it-works'}>How It Works</button>
              <button className="text-[#34D399] text-sm font-medium transition-colors bg-transparent border-none cursor-pointer" onClick={() => window.location.hash = '#/services'}>Services</button>
              <button className="text-slate-400 hover:text-[#34D399] text-sm font-medium transition-colors bg-transparent border-none cursor-pointer" onClick={() => window.location.hash = '#/about'}>About Us</button>
              <button className="text-slate-400 hover:text-[#34D399] text-sm font-medium transition-colors bg-transparent border-none cursor-pointer" onClick={() => window.location.hash = '#/contact'}>Contact</button>
            </nav>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => window.location.hash = '#/login'}
                className="hidden sm:flex h-10 px-5 items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/5 border border-white/5 text-sm font-bold transition-all duration-300 cursor-pointer"
              >
                Log In
              </button>
              <button 
                onClick={() => window.location.hash = '#/search'}
                className="h-10 px-6 flex items-center justify-center rounded-full bg-[#34D399] text-slate-900 hover:bg-[#6EE7B7] shadow-[0_0_15px_rgba(52,211,153,0.3)] hover:shadow-[0_0_25px_rgba(52,211,153,0.5)] text-sm font-bold transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                Get Started
              </button>
            </div>
          </header>
        </div>
      </div>

      {/* Back Button */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28">
        <button 
          onClick={() => window.history.back()}
          className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-slate-400 hover:text-[#34D399] hover:border-[#34D399]/30 hover:bg-[#34D399]/10 transition-all duration-300 cursor-pointer backdrop-blur-sm"
        >
          <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center pt-8 pb-20">
        {/* Hero Section */}
        <section className="w-full max-w-7xl px-4 sm:px-6 py-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight mb-6">
              Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#34D399] to-[#6EE7B7]">Path</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl leading-relaxed">
              Whether you're an individual, a business, or a recycling partner, we have the perfect solution for your e-waste management needs.
            </p>
          </div>

          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Residents Card */}
            <div className="group relative flex flex-col gap-6 p-8 rounded-3xl bg-[#1E293B]/30 border border-white/5 hover:border-[#34D399]/30 transition-all duration-500 hover:bg-[#1E293B]/50">
              {/* Background Icon */}
              <div className="absolute top-8 right-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              
              {/* Icon */}
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#34D399]/10 border border-[#34D399]/20 group-hover:bg-[#34D399]/20 group-hover:border-[#34D399]/40 transition-all duration-300">
                <svg className="w-7 h-7 text-[#34D399]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-3 flex-grow">
                <h3 className="text-white text-2xl font-bold tracking-tight">Residents</h3>
                <p className="text-slate-400 text-base leading-relaxed">
                  Recycling made effortless. Book a doorstep pickup for your old gadgets and earn eco-rewards instantly.
                </p>
              </div>

              {/* CTA Link */}
              <button 
                onClick={() => window.location.hash = '#/search'}
                className="group/btn flex items-center gap-2 text-[#34D399] font-semibold text-base mt-auto bg-transparent border-none cursor-pointer p-0"
              >
                <span>Start Recycling</span>
                <svg className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>

            {/* Businesses Card */}
            <div className="group relative flex flex-col gap-6 p-8 rounded-3xl bg-[#1E293B]/30 border border-white/5 hover:border-[#818CF8]/30 transition-all duration-500 hover:bg-[#1E293B]/50">
              {/* Background Icon */}
              <div className="absolute top-8 right-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
                </svg>
              </div>
              
              {/* Icon */}
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#818CF8]/10 border border-[#818CF8]/20 group-hover:bg-[#818CF8]/20 group-hover:border-[#818CF8]/40 transition-all duration-300">
                <svg className="w-7 h-7 text-[#818CF8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-3 flex-grow">
                <h3 className="text-white text-2xl font-bold tracking-tight">Businesses</h3>
                <p className="text-slate-400 text-base leading-relaxed">
                  Corporate e-waste solutions. Secure data destruction, compliance certificates, and bulk pickup logistics.
                </p>
              </div>

              {/* CTA Link */}
              <button 
                onClick={() => window.location.hash = '#/login'}
                className="group/btn flex items-center gap-2 text-[#818CF8] font-semibold text-base mt-auto bg-transparent border-none cursor-pointer p-0"
              >
                <span>Business Solutions</span>
                <svg className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>

            {/* Partners Card */}
            <div className="group relative flex flex-col gap-6 p-8 rounded-3xl bg-[#1E293B]/30 border border-white/5 hover:border-[#A78BFA]/30 transition-all duration-500 hover:bg-[#1E293B]/50">
              {/* Background Icon */}
              <div className="absolute top-8 right-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>
              
              {/* Icon */}
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#A78BFA]/10 border border-[#A78BFA]/20 group-hover:bg-[#A78BFA]/20 group-hover:border-[#A78BFA]/40 transition-all duration-300">
                <svg className="w-7 h-7 text-[#A78BFA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-3 flex-grow">
                <h3 className="text-white text-2xl font-bold tracking-tight">Partners</h3>
                <p className="text-slate-400 text-base leading-relaxed">
                  Grow your recycling business. Access our booking stream, manage fleet logistics, and track inventory.
                </p>
              </div>

              {/* CTA Link */}
              <button 
                onClick={() => window.location.hash = '#/partner-registration'}
                className="group/btn flex items-center gap-2 text-[#A78BFA] font-semibold text-base mt-auto bg-transparent border-none cursor-pointer p-0"
              >
                <span>Join Network</span>
                <svg className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full max-w-7xl px-4 sm:px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-white text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Why Choose EcoCycle?
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              We make e-waste recycling simple, rewarding, and impactful for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-[#1E293B]/20 border border-white/5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#34D399]/10 mb-4">
                <svg className="w-6 h-6 text-[#34D399]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-white font-semibold mb-2">Verified Partners</h4>
              <p className="text-slate-500 text-sm">All recycling agencies are certified and vetted</p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-[#1E293B]/20 border border-white/5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#34D399]/10 mb-4">
                <svg className="w-6 h-6 text-[#34D399]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="text-white font-semibold mb-2">Data Security</h4>
              <p className="text-slate-500 text-sm">Secure data destruction with certificates</p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-[#1E293B]/20 border border-white/5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#34D399]/10 mb-4">
                <svg className="w-6 h-6 text-[#34D399]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-white font-semibold mb-2">Earn Rewards</h4>
              <p className="text-slate-500 text-sm">Get eco-points for every device recycled</p>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-[#1E293B]/20 border border-white/5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#34D399]/10 mb-4">
                <svg className="w-6 h-6 text-[#34D399]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h4 className="text-white font-semibold mb-2">Doorstep Pickup</h4>
              <p className="text-slate-500 text-sm">Convenient scheduling at your location</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full max-w-7xl px-4 sm:px-6 py-12">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#34D399]/20 to-[#818CF8]/20 border border-white/5 p-8 md:p-12">
            <div className="absolute inset-0 bg-[#0B1116]/50"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-white text-2xl md:text-3xl font-bold mb-2">Ready to make a difference?</h3>
                <p className="text-slate-400">Join thousands of eco-conscious individuals and businesses today.</p>
              </div>
              <button 
                onClick={() => window.location.hash = '#/login'}
                className="flex h-12 items-center justify-center rounded-full bg-[#34D399] px-8 text-[#0B1120] text-base font-bold transition-all duration-300 hover:bg-[#6EE7B7] shadow-[0_0_20px_rgba(52,211,153,0.4)] hover:shadow-[0_0_30px_rgba(52,211,153,0.6)] transform hover:scale-105 cursor-pointer whitespace-nowrap"
              >
                Get Started Now
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 bg-[#0B1116]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-6 text-[#34D399]">
                <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
                </svg>
              </div>
              <span className="text-slate-400 text-sm">© 2025 EcoCycle. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6">
              <button className="text-slate-500 hover:text-[#34D399] text-sm transition-colors bg-transparent border-none cursor-pointer" onClick={() => window.location.hash = '#/about'}>About</button>
              <button className="text-slate-500 hover:text-[#34D399] text-sm transition-colors bg-transparent border-none cursor-pointer" onClick={() => window.location.hash = '#/contact'}>Contact</button>
              <button className="text-slate-500 hover:text-[#34D399] text-sm transition-colors bg-transparent border-none cursor-pointer">Privacy</button>
              <button className="text-slate-500 hover:text-[#34D399] text-sm transition-colors bg-transparent border-none cursor-pointer">Terms</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Services;
