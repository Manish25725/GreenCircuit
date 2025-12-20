import React from 'react';

const AboutUs = () => {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#0B1120] text-slate-300 font-sans group/design-root overflow-x-hidden selection:bg-[#34D399] selection:text-[#0B1120]">
      <div className="layout-container flex h-full grow flex-col">
        {/* Back Button */}
        <div className="w-full max-w-[960px] mx-auto px-4 sm:px-10 lg:px-0 pt-6">
            <button 
                onClick={() => window.history.back()}
                className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-[#34D399] hover:border-[#34D399]/30 hover:bg-[#34D399]/10 transition-all duration-300 cursor-pointer backdrop-blur-sm"
            >
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm font-medium">Back</span>
            </button>
        </div>

        <main className="flex-1 flex items-center justify-center px-4 py-6 sm:px-10 lg:px-40 lg:py-14">
          <div className="w-full max-w-[960px] flex flex-col gap-10">
            {/* Page Header */}
            <div className="flex min-w-72 flex-col gap-3 text-center">
              <p className="text-white text-4xl font-black leading-tight tracking-tight md:text-5xl">About EcoCycle</p>
              <p className="text-slate-400 text-base font-normal leading-normal md:text-lg">Transforming the global e-waste crisis into a sustainable opportunity.</p>
            </div>

            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-3xl bg-[#1E293B]/50 border border-white/5 shadow-2xl">
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-30" 
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCrsLiC0nxjqeTfacyb3X1M16q-VSh7ZB-yPcCf2GKIlm-ssCwFsUqZB9OIhRlJ5pp2W6ukykkDmh0d47H9aE871Cw0ALWhcnTe2fo0EuA8JtvdgBQqVLszK5UhEyezfVf3bDMTcl38iMBCym-COJ7PWrA6tkMbZXojK8Pvf5q74S8D9ZVnNnmMMQMehgCMvSQGUMDw22D1xpdR7mPKceoD_XfOfOjOpLbe97sBqc1538-pvXjsfWf3K3_p6NypGXbZyTfs5r6v0ow')" }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/80 to-transparent"></div>
                <div className="relative z-10 flex min-h-[360px] flex-col items-center justify-center gap-6 p-8 text-center">
                    <h2 className="text-white text-4xl font-black leading-tight tracking-tight md:text-5xl max-w-2xl">
                        Rewiring the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#34D399] to-[#6EE7B7]">Future</span>
                    </h2>
                    <p className="text-slate-300 text-lg font-light leading-relaxed max-w-xl">
                        Building the circular economy of tomorrow, today.
                    </p>
                </div>
            </section>

            {/* Stats Section */}
            <section className="grid grid-cols-2 gap-6 md:grid-cols-4 border-y border-white/5 py-8">
                <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <span className="text-3xl font-black text-[#34D399] md:text-4xl">50K+</span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Devices Recycled</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <span className="text-3xl font-black text-[#34D399] md:text-4xl">120</span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Partner Agencies</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <span className="text-3xl font-black text-[#34D399] md:text-4xl">800T</span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">CO2 Saved</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <span className="text-3xl font-black text-[#34D399] md:text-4xl">15+</span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Countries</span>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="flex flex-col gap-8">
                <h2 className="text-2xl font-bold text-white md:text-3xl tracking-tight">Our Mission & Vision</h2>
                <p className="text-slate-400 text-base leading-relaxed">
                    We believe that waste is simply a resource in the wrong place. By leveraging technology, we are bridging the gap between consumers and certified recyclers.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group flex gap-4 rounded-2xl border border-white/5 bg-[#1E293B]/50 p-6 transition-colors hover:border-[#34D399]/30">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/20 group-hover:bg-[#34D399] group-hover:text-[#0B1120] transition-colors">
                            <span className="material-symbols-outlined">target</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-lg font-bold text-white">Our Mission</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                To simplify e-waste recycling for everyone while ensuring verified, safe disposal channels that prioritize data security and environmental health.
                            </p>
                        </div>
                    </div>
                    <div className="group flex gap-4 rounded-2xl border border-white/5 bg-[#1E293B]/50 p-6 transition-colors hover:border-[#34D399]/30">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/20 group-hover:bg-[#34D399] group-hover:text-[#0B1120] transition-colors">
                            <span className="material-symbols-outlined">visibility</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-lg font-bold text-white">Our Vision</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                A zero-waste planet where technology feeds nature rather than polluting landfills, creating a closed-loop system for all electronics.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="flex flex-col gap-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white md:text-3xl tracking-tight">Core Values</h2>
                    <p className="text-slate-400 mt-3">The principles that drive our innovation</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-[#1E293B]/30 border border-white/5 hover:border-[#34D399]/30 transition-all">
                        <div className="mb-4 p-3 rounded-xl bg-[#0B1120] border border-white/5 text-[#34D399]">
                            <span className="material-symbols-outlined text-3xl">verified_user</span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Transparency</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">Real-time tracking of your e-waste from pickup to final processing.</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-[#1E293B]/30 border border-white/5 hover:border-[#34D399]/30 transition-all">
                        <div className="mb-4 p-3 rounded-xl bg-[#0B1120] border border-white/5 text-[#34D399]">
                            <span className="material-symbols-outlined text-3xl">lightbulb</span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Innovation</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">Leveraging AI and blockchain to modernize the recycling supply chain.</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-[#1E293B]/30 border border-white/5 hover:border-[#34D399]/30 transition-all">
                        <div className="mb-4 p-3 rounded-xl bg-[#0B1120] border border-white/5 text-[#34D399]">
                            <span className="material-symbols-outlined text-3xl">public</span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Impact</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">Quantifiable environmental metrics for every device recycled.</p>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="flex flex-col gap-8">
                <div>
                    <h2 className="text-2xl font-bold text-white md:text-3xl tracking-tight">Meet the Eco-Warriors</h2>
                    <p className="text-slate-400 mt-3">The team working behind the scenes</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="group relative overflow-hidden rounded-2xl bg-[#1E293B] border border-white/5">
                        <div className="aspect-[4/5] w-full bg-slate-800">
                            <img alt="James Carter" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGgTCckYVGpYGNvrY1q371qxcBYHMq9K93GTXQiNpiIue3_bOHdHWYWcs8k7zJ8XkVazmiccRBRy7y74-57B4MVAKSvUBd_ZqnYNMKhe9OyGhwjV-S9YEqTOd3Qt_OUjygg8r4fFqRmadxwfH9Z1rffoc7dtlX-ZiaUDPulRVDXrDjMooXPFPigWcCgOnKjHpmtqvxtvnCFMCbfV6lOvWY3DPMTllCZt3mx_rPRVMY6uo-dr4tMOjfq3zhSWXmNcRVbb6Wuf0H5Nk"/>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent opacity-90"></div>
                        <div className="absolute bottom-0 p-4 w-full">
                            <h3 className="text-base font-bold text-white">James Carter</h3>
                            <p className="text-[#34D399] text-sm font-medium">Founder & CEO</p>
                        </div>
                    </div>
                    <div className="group relative overflow-hidden rounded-2xl bg-[#1E293B] border border-white/5">
                        <div className="aspect-[4/5] w-full bg-slate-800">
                            <img alt="Sarah Chen" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5MLRbZQ0gSkFjhap3C6bfnHwXvn4JvuF6ss6f0yWmf4EwIVFc4a3rPSqzhN7i35KYavUxLv2TGbQ0DDUpoORoEIf0nrHu0MIsJGyS9uHCSZjo_oeM1gyEXxKb3fbFOSK8xvcd0hTzp8PCdSZL82ZlgYpnJlIiSTHnnrqMrruJ3jul78QOWK69tU3pOEpU2wx0xkbTtHOh1revLlJYGrGnMtGvDzt0TGWA-JQMemBuevlPYOj-lhisiYpiiGbLA0fafNfQa3Qkrqw"/>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent opacity-90"></div>
                        <div className="absolute bottom-0 p-4 w-full">
                            <h3 className="text-base font-bold text-white">Sarah Chen</h3>
                            <p className="text-[#34D399] text-sm font-medium">CTO</p>
                        </div>
                    </div>
                    <div className="group relative overflow-hidden rounded-2xl bg-[#1E293B] border border-white/5">
                        <div className="aspect-[4/5] w-full bg-slate-800">
                            <img alt="Marcus Johnson" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdzPXX7qiTFwXug2YK1NVDymqMxFHFG24SraLeMywUWNZxFpnYg8U5IvNsP2uKN7dd5-rL5op8jR3-9tSQCbDRWCc4U9u5iK6LnwhpWsKOxsXQdjWKyR6pF6DYjhC5I4UD9oBeau8YEwJpsWlcO6aP7_15fbtbuZ4PYIqgfptR1bWJPMOADu1gm8C2xeQdhoeDmEMVxNMJuL0Oshjckl_zQkjKc6YkwZxVNBf0wENk6wC38wxZcyIjTAUKDXxBZbXlqUWFaU2-eT4"/>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent opacity-90"></div>
                        <div className="absolute bottom-0 p-4 w-full">
                            <h3 className="text-base font-bold text-white">Marcus Johnson</h3>
                            <p className="text-[#34D399] text-sm font-medium">Head of Operations</p>
                        </div>
                    </div>
                    <div className="group relative overflow-hidden rounded-2xl bg-[#1E293B] border border-white/5">
                        <div className="aspect-[4/5] w-full bg-slate-800">
                            <img alt="Emily Davis" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3JWfndAXP1p4SeqYC8loBDfme96P8XyUrmKLCJEemRqvfWvZj8IVXtyugQ3RoR7o2OWv9HdoTNAcpBnqu8TVaOJMf1ZyVwCa7u9tsEa1vhSh9fl9nj6RQkPf0xxUzOYXE5zaQDAlnkSF2pM5m0Z3lnE2ziJrrhwe0WQqOV_EbCp_UJRmS1pgLpDKwtYuH0IlSEiCqUrHZ5yout9ILN1ZNBdRCXyveCJWx_3f6tWJMRC8zwzLm1de_8zpBB46uroNK8tKRinB8h1Y"/>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent opacity-90"></div>
                        <div className="absolute bottom-0 p-4 w-full">
                            <h3 className="text-base font-bold text-white">Emily Davis</h3>
                            <p className="text-[#34D399] text-sm font-medium">Sustainability Lead</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="overflow-hidden rounded-3xl bg-[#34D399] relative shadow-[0_0_30px_rgba(52,211,153,0.15)]">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <div className="relative flex flex-col items-center gap-6 px-4 py-12 text-center md:px-12">
                    <h2 className="text-3xl font-black text-[#0B1120] md:text-4xl max-w-xl tracking-tight">
                        Ready to make a difference?
                    </h2>
                    <p className="max-w-lg text-base font-medium text-[#0B1120]/80">
                        Join thousands of eco-conscious individuals. Schedule your first pickup today.
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <button 
                            onClick={() => window.location.hash = '#/search'}
                            className="flex h-12 min-w-[140px] cursor-pointer items-center justify-center rounded-full bg-[#0B1120] px-6 text-white text-base font-bold transition-transform hover:scale-105"
                        >
                            Book Pickup
                        </button>
                        <button 
                            onClick={() => window.location.hash = '#/contact'}
                            className="flex h-12 min-w-[140px] cursor-pointer items-center justify-center rounded-full border-2 border-[#0B1120] px-6 text-[#0B1120] text-base font-bold transition-colors hover:bg-[#0B1120]/10"
                        >
                            Contact Sales
                        </button>
                    </div>
                </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AboutUs;