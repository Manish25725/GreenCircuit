import React from 'react';

const HowItWorks = () => {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#0B1120] font-sans text-slate-300 antialiased overflow-x-hidden selection:bg-[#34D399] selection:text-[#0B1120]">
        {/* Style for animations and specific elements */}
        <style>{`
            .timeline-line {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                width: 2px;
                height: 100%;
                background: linear-gradient(to bottom, transparent, #34D399, transparent);
                z-index: 0;
            }
            @keyframes pulse-glow {
                0% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.4); }
                70% { box-shadow: 0 0 0 10px rgba(52, 211, 153, 0); }
                100% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0); }
            }
            .animate-pulse-glow {
                animation: pulse-glow 2s infinite;
            }
        `}</style>

        {/* Header - Logo Only */}
        <header className="sticky top-0 z-50 flex items-center justify-center border-b border-white/5 bg-[#0B1120]/80 backdrop-blur-md px-6 py-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.history.back()}>
                <svg className="w-6 h-6 text-[#34D399]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-slate-400 hover:text-[#34D399] text-sm font-medium">Back</span>
            </div>
            <div className="flex items-center gap-3 cursor-pointer ml-auto opacity-0 pointer-events-none" onClick={() => window.location.hash = '#/'}>
                <div className="size-8 text-[#34D399] flex items-center justify-center">
                    <svg className="w-full h-full drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
                    </svg>
                </div>
                <h2 className="text-white text-xl font-black tracking-tight">EcoCycle</h2>
            </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow flex flex-col items-center">
            {/* Hero Header */}
            <section className="w-full max-w-[960px] px-6 py-20 text-center">
                <span className="inline-block py-1 px-3 rounded-full bg-[#34D399]/10 text-[#34D399] text-xs font-bold uppercase tracking-wider mb-4 border border-[#34D399]/20">
                    Simple & Transparent
                </span>
                <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">
                    Your Journey to <span className="text-[#34D399]">Zero Waste</span>
                </h1>
                <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                    We've simplified e-waste recycling into a transparent, automated process. Follow the path below to see how easy it is to make an impact.
                </p>
            </section>

            {/* Vertical Timeline Section */}
            <section className="w-full max-w-[1000px] px-6 pb-24 relative">
                {/* Central Timeline Line */}
                <div className="hidden md:block timeline-line top-0 h-full"></div>
                <div className="flex flex-col gap-16 md:gap-24 relative z-10">
                    
                    {/* Step 1 */}
                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-0 group">
                        {/* Left Content */}
                        <div className="w-full md:w-1/2 md:pr-12 md:text-right flex flex-col items-center md:items-end order-2 md:order-1">
                            <h3 className="text-[#34D399] text-sm font-bold tracking-widest uppercase mb-2">Step 01</h3>
                            <h2 className="text-white text-2xl font-bold mb-3">Identify & List</h2>
                            <p className="text-slate-400 leading-relaxed max-w-sm text-center md:text-right">
                                Select your e-waste category from our comprehensive database. Whether it's an old laptop, batteries, or a broken phone, tell us what you're recycling.
                            </p>
                        </div>
                        {/* Center Icon */}
                        <div className="relative flex items-center justify-center order-1 md:order-2">
                            <div className="w-16 h-16 rounded-full bg-[#0B1120] border-2 border-[#34D399] flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.3)] z-20 animate-pulse-glow">
                                <span className="material-symbols-outlined text-[#34D399] text-3xl">inventory_2</span>
                            </div>
                        </div>
                        {/* Right Image */}
                        <div className="w-full md:w-1/2 md:pl-12 order-3">
                            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-[#1E293B]/50 border border-white/5 relative group-hover:border-[#34D399]/50 transition-colors duration-300">
                                <div className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCmtR5a-dAhOP7_2dg3Y-YqqbtwN9VLgttPl32giV-Evax9rE2y4g2zsZnPi7zyay0Anc5lPVFxFkTwwKnXa-s3cNOGXLj1e3ft0ULg_NvixEUgJ16k41vW99GpJqTMRqZBuGXJGq6VXFo9Pa0yPah0bdv0RTnVfFxLr6I9ugS2UvAKir8mIVL6xzH4n5yNlAjwdXl-QrMsRHJM4xdflT9uYCb6em-ZyDsDhHCPi3Ia2usjwqDp6MCUXOCGxdGf76yNHzzwP8dLGW0')" }}></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] to-transparent"></div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm p-2 rounded-lg border border-white/10 w-fit">
                                        <span className="material-symbols-outlined text-white text-sm">laptop_mac</span>
                                        <span className="text-xs text-white font-medium">Laptop selected</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-0 group">
                        {/* Left Image */}
                        <div className="w-full md:w-1/2 md:pr-12 order-3 md:order-1">
                            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-[#1E293B]/50 border border-white/5 relative group-hover:border-[#34D399]/50 transition-colors duration-300">
                                <div className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDBQxrNFem1sljFKN8Fbycw_4FyF7KqfWgZXL8Ry0cjamrTItFm7tUVE1Cp-zJuHe3zgaZGAoJlFhTMB9ZqRRUnjFm6GZvPijuPfLyh-Ewwj_5NKd7H3MpLtnEOUfoIs_zdScDGQyUgaeG9K1xbPmmKnXyz23kzthSfdebXNpDU0g1TSHWZLJCEbF5z5UhAOOxKiRNinM_AvbJarKQfuVA4SNFs9f6dRi1IzLuTBiKd5F6Gg1jBMG6i2xZ6A146x1rQca1QLdHyKHk')" }}></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] to-transparent"></div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm p-2 rounded-lg border border-white/10 w-fit">
                                        <span className="material-symbols-outlined text-[#34D399] text-sm">check_circle</span>
                                        <span className="text-xs text-white font-medium">Pickup Confirmed: Oct 24</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Center Icon */}
                        <div className="relative flex items-center justify-center order-1 md:order-2">
                            <div className="w-16 h-16 rounded-full bg-[#0B1120] border-2 border-white/10 group-hover:border-[#34D399] flex items-center justify-center transition-all duration-300 z-20">
                                <span className="material-symbols-outlined text-white group-hover:text-[#34D399] transition-colors text-3xl">calendar_month</span>
                            </div>
                        </div>
                        {/* Right Content */}
                        <div className="w-full md:w-1/2 md:pl-12 md:text-left flex flex-col items-center md:items-start order-2 md:order-3">
                            <h3 className="text-[#34D399] text-sm font-bold tracking-widest uppercase mb-2">Step 02</h3>
                            <h2 className="text-white text-2xl font-bold mb-3">Instant Booking</h2>
                            <p className="text-slate-400 leading-relaxed max-w-sm text-center md:text-left">
                                Browse verified recycling agencies near you. Compare ratings, choose a partner, and schedule a pickup slot that fits perfectly into your busy calendar.
                            </p>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-0 group">
                        {/* Left Content */}
                        <div className="w-full md:w-1/2 md:pr-12 md:text-right flex flex-col items-center md:items-end order-2 md:order-1">
                            <h3 className="text-[#34D399] text-sm font-bold tracking-widest uppercase mb-2">Step 03</h3>
                            <h2 className="text-white text-2xl font-bold mb-3">Live Tracking</h2>
                            <p className="text-slate-400 leading-relaxed max-w-sm text-center md:text-right">
                                No more waiting in the dark. Watch our agents arrive in real-time with live GPS tracking on our map interface. Transparency at every mile.
                            </p>
                        </div>
                        {/* Center Icon */}
                        <div className="relative flex items-center justify-center order-1 md:order-2">
                            <div className="w-16 h-16 rounded-full bg-[#0B1120] border-2 border-white/10 group-hover:border-[#34D399] flex items-center justify-center transition-all duration-300 z-20">
                                <span className="material-symbols-outlined text-white group-hover:text-[#34D399] transition-colors text-3xl">location_on</span>
                            </div>
                        </div>
                        {/* Right Image */}
                        <div className="w-full md:w-1/2 md:pl-12 order-3">
                            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-[#1E293B]/50 border border-white/5 relative group-hover:border-[#34D399]/50 transition-colors duration-300">
                                <div className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1748&auto=format&fit=crop')" }}></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] to-transparent"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-[#34D399]/20 p-3 rounded-full animate-pulse">
                                        <div className="bg-[#34D399] p-2 rounded-full border-2 border-white"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-0 group">
                        {/* Left Image */}
                        <div className="w-full md:w-1/2 md:pr-12 order-3 md:order-1">
                            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-[#1E293B]/50 border border-white/5 relative group-hover:border-[#34D399]/50 transition-colors duration-300 flex items-center justify-center">
                                <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCI6zhCDfGVIhY5IWN8lrrnGbJJZTRuzdgM_3HODzUq8xphu6MoYQbRBmtlMf4i3t10tXWXjJcfbQX-awvrk8KqLenn_TcAv6D4gfXt8ZWQFkZDK0JR-PqKX9KQSwwVc5T19JoeuHBW7l4_y6foCd4abHa5Cvz1-h6ktAw6wFD98ac6t8m6Au5hleJYPd5oV-yLEkUTJOsnH1Q_emxCHVVhC8ZcalqD9lP7dxVkONcKYzGRYvzEknrfZTizdDW7V7rwb1UDlaCFDRY')" }}></div>
                                <div className="relative z-10 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-xl text-center max-w-[200px]">
                                    <div className="text-[#34D399] mb-2">
                                        <span className="material-symbols-outlined text-4xl">verified</span>
                                    </div>
                                    <div className="text-white font-bold text-lg">Eco Certified</div>
                                    <div className="text-xs text-slate-400 mt-1">2.4kg CO2 Saved</div>
                                </div>
                            </div>
                        </div>
                        {/* Center Icon */}
                        <div className="relative flex items-center justify-center order-1 md:order-2">
                            <div className="w-16 h-16 rounded-full bg-[#0B1120] border-2 border-white/10 group-hover:border-[#34D399] flex items-center justify-center transition-all duration-300 z-20">
                                <span className="material-symbols-outlined text-white group-hover:text-[#34D399] transition-colors text-3xl">workspace_premium</span>
                            </div>
                        </div>
                        {/* Right Content */}
                        <div className="w-full md:w-1/2 md:pl-12 md:text-left flex flex-col items-center md:items-start order-2 md:order-3">
                            <h3 className="text-[#34D399] text-sm font-bold tracking-widest uppercase mb-2">Step 04</h3>
                            <h2 className="text-white text-2xl font-bold mb-3">Certified Impact</h2>
                            <p className="text-slate-400 leading-relaxed max-w-sm text-center md:text-left">
                                Once recycled, you'll receive a digital Eco-Certificate. View your total carbon savings and share your contribution to a greener planet with the world.
                            </p>
                        </div>
                    </div>

                </div>
            </section>

            {/* CTA Section */}
            <section className="w-full px-4 py-20">
                <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-[#34D399] relative shadow-[0_0_40px_rgba(52,211,153,0.15)]">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                    <div className="relative flex flex-col items-center gap-6 px-4 py-16 text-center md:px-20">
                        <h2 className="text-3xl font-black text-[#0B1120] md:text-5xl max-w-2xl tracking-tight">
                            Ready to make a difference?
                        </h2>
                        <p className="max-w-xl text-lg font-medium text-[#0B1120]/80">
                            Join thousands of eco-conscious users and start your journey towards a cleaner planet today. It only takes a minute.
                        </p>
                        <button 
                            onClick={() => window.location.hash = '#/search'}
                            className="bg-[#0B1120] text-white text-lg font-bold px-8 py-4 rounded-xl shadow-lg transition-all transform hover:scale-105"
                        >
                            Schedule Pickup
                        </button>
                        <p className="mt-4 text-xs text-[#0B1116]/70 font-semibold">
                            <span className="material-symbols-outlined align-middle text-sm mr-1">check_circle</span>
                            No hidden fees. 100% Certified.
                        </p>
                    </div>
                </div>
            </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/5 bg-[#0B1120] px-10 py-12">
            <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:justify-between">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-white">
                        <div className="size-6 text-[#34D399]">
                            <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" stroke="currentColor" strokeWidth="3"></path>
                            </svg>
                        </div>
                        <h2 className="text-lg font-bold">EcoCycle</h2>
                    </div>
                    <p className="text-sm text-slate-400 max-w-xs">
                        Empowering the world to recycle responsibly. Join us in creating a sustainable future.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
                    <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Company</h3>
                        <button className="text-sm text-slate-400 hover:text-[#34D399] text-left bg-transparent border-none cursor-pointer">About</button>
                        <button className="text-sm text-slate-400 hover:text-[#34D399] text-left bg-transparent border-none cursor-pointer">Careers</button>
                        <button className="text-sm text-slate-400 hover:text-[#34D399] text-left bg-transparent border-none cursor-pointer">Press</button>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Resources</h3>
                        <button className="text-sm text-slate-400 hover:text-[#34D399] text-left bg-transparent border-none cursor-pointer">Help Center</button>
                        <button className="text-sm text-slate-400 hover:text-[#34D399] text-left bg-transparent border-none cursor-pointer">Recycling Guide</button>
                        <button className="text-sm text-slate-400 hover:text-[#34D399] text-left bg-transparent border-none cursor-pointer" onClick={() => window.location.hash = '#/agency'}>Partner with Us</button>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Legal</h3>
                        <button className="text-sm text-slate-400 hover:text-[#34D399] text-left bg-transparent border-none cursor-pointer">Privacy</button>
                        <button className="text-sm text-slate-400 hover:text-[#34D399] text-left bg-transparent border-none cursor-pointer">Terms</button>
                        <button className="text-sm text-slate-400 hover:text-[#34D399] text-left bg-transparent border-none cursor-pointer">Security</button>
                    </div>
                </div>
            </div>
            <div className="mx-auto mt-12 max-w-7xl border-t border-white/5 pt-8 text-center text-sm text-slate-500">
                © 2024 EcoCycle Inc. All rights reserved.
            </div>
        </footer>
    </div>
  );
};

export default HowItWorks;