import React from 'react';

const AboutUs = () => {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#0B1120] text-slate-300 font-sans group/design-root overflow-x-hidden selection:bg-[#34D399] selection:text-[#0B1120]">
      <div className="layout-container flex h-full grow flex-col">
        {/* Header - Logo Only */}
        <header className="sticky top-0 z-50 flex items-center justify-center border-b border-white/5 bg-[#0B1120]/80 backdrop-blur-md px-6 py-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.hash = '#/'}>
                <div className="size-8 text-[#34D399] flex items-center justify-center">
                    <svg className="w-full h-full drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
                    </svg>
                </div>
                <h2 className="text-white text-xl font-black tracking-tight">EcoCycle</h2>
            </div>
        </header>

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

        <main className="flex-1 px-4 py-6 sm:px-10 lg:px-40 lg:py-14">
          <div className="mx-auto flex max-w-[960px] flex-col gap-10">
        <main className="flex-1 px-4 py-6 sm:px-10 lg:px-40 lg:py-14">
          <div className="mx-auto flex max-w-[960px] flex-col gap-10">
            {/* Page Header */}
            <div className="flex min-w-72 flex-col gap-3">
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
            <section className="w-full max-w-7xl px-4 py-12 md:px-10">
                <div className="flex flex-col gap-12 lg:flex-row">
                    <div className="flex flex-1 flex-col justify-center gap-6">
                        <h2 className="text-3xl font-bold text-white md:text-4xl lg:max-w-md tracking-tight">
                            Our Mission & Vision
                        </h2>
                        <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
                            We believe that waste is simply a resource in the wrong place. By leveraging technology, we are bridging the gap between consumers and certified recyclers.
                        </p>
                        <div className="flex flex-col gap-4 mt-4">
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
                    </div>
                    <div className="flex-1 relative h-[500px] w-full rounded-3xl overflow-hidden group border border-white/5 shadow-2xl">
                        <div 
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDbGo_OLrE4jxZhRfikgagRk-cD8A1fOBVO_0LTzI14mGWuhksGvaLUycZ7PQ0aIXdAcqOLU74scaaDMcUln9EZR1Ury8c9lwVvDuMpeNqekVG0eFUPIOosg1ox5mYkAmDum1ev6bfIKXptEoX9LE-FPaM5p168cmyTrzBF_JUNHjoJa3QF8Zo_6Z6lBF30fSsACVv33hu2fcfxFd863JP-4IcY0lX_NR17KctDdpamGlVDQaoOk3N_EihtiYApgclc_DmxVIR9QA4')" }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent opacity-90"></div>
                        <div className="absolute bottom-8 left-8 right-8">
                            <div className="inline-flex items-center gap-2 rounded-full bg-[#34D399]/10 border border-[#34D399]/20 px-3 py-1 text-xs font-bold text-[#34D399] backdrop-blur-sm mb-3">
                                <span className="material-symbols-outlined text-sm">eco</span> SUSTAINABILITY FIRST
                            </div>
                            <p className="text-white text-xl font-medium">"We don't inherit the earth from our ancestors, we borrow it from our children."</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="w-full max-w-7xl px-4 py-16 md:px-10">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-white md:text-4xl tracking-tight">Core Values</h2>
                    <p className="text-slate-400 mt-4">The principles that drive our innovation</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-[#1E293B]/30 border border-white/5 hover:border-[#34D399]/30 transition-all hover:-translate-y-1">
                        <div className="mb-6 p-4 rounded-2xl bg-[#0B1120] border border-white/5 text-[#34D399] shadow-lg">
                            <span className="material-symbols-outlined text-4xl">verified_user</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Transparency</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">Real-time tracking of your e-waste from pickup to final processing.</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-[#1E293B]/30 border border-white/5 hover:border-[#34D399]/30 transition-all hover:-translate-y-1">
                        <div className="mb-6 p-4 rounded-2xl bg-[#0B1120] border border-white/5 text-[#34D399] shadow-lg">
                            <span className="material-symbols-outlined text-4xl">lightbulb</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Innovation</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">Leveraging AI and blockchain to modernize the recycling supply chain.</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-[#1E293B]/30 border border-white/5 hover:border-[#34D399]/30 transition-all hover:-translate-y-1">
                        <div className="mb-6 p-4 rounded-2xl bg-[#0B1120] border border-white/5 text-[#34D399] shadow-lg">
                            <span className="material-symbols-outlined text-4xl">public</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Impact</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">Quantifiable environmental metrics for every device recycled.</p>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="w-full max-w-7xl px-4 py-16 md:px-10">
                <div className="flex flex-col gap-4 mb-10">
                    <h2 className="text-3xl font-bold text-white md:text-4xl tracking-tight">Meet the Eco-Warriors</h2>
                    <p className="text-slate-400 max-w-2xl">The diverse team of environmentalists, engineers, and strategists working behind the scenes.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Member 1 */}
                    <div className="group relative overflow-hidden rounded-2xl bg-[#1E293B] border border-white/5">
                        <div className="aspect-[4/5] w-full bg-slate-800">
                            <img alt="Portrait of James Carter, CEO" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGgTCckYVGpYGNvrY1q371qxcBYHMq9K93GTXQiNpiIue3_bOHdHWYWcs8k7zJ8XkVazmiccRBRy7y74-57B4MVAKSvUBd_ZqnYNMKhe9OyGhwjV-S9YEqTOd3Qt_OUjygg8r4fFqRmadxwfH9Z1rffoc7dtlX-ZiaUDPulRVDXrDjMooXPFPigWcCgOnKjHpmtqvxtvnCFMCbfV6lOvWY3DPMTllCZt3mx_rPRVMY6uo-dr4tMOjfq3zhSWXmNcRVbb6Wuf0H5Nk"/>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent opacity-90"></div>
                        <div className="absolute bottom-0 p-4 w-full">
                            <h3 className="text-lg font-bold text-white">James Carter</h3>
                            <p className="text-[#34D399] text-sm font-medium">Founder & CEO</p>
                        </div>
                    </div>
                    {/* Member 2 */}
                    <div className="group relative overflow-hidden rounded-2xl bg-[#1E293B] border border-white/5">
                        <div className="aspect-[4/5] w-full bg-slate-800">
                            <img alt="Portrait of Sarah Chen, CTO" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5MLRbZQ0gSkFjhap3C6bfnHwXvn4JvuF6ss6f0yWmf4EwIVFc4a3rPSqzhN7i35KYavUxLv2TGbQ0DDUpoORoEIf0nrHu0MIsJGyS9uHCSZjo_oeM1gyEXxKb3fbFOSK8xvcd0hTzp8PCdSZL82ZlgYpnJlIiSTHnnrqMrruJ3jul78QOWK69tU3pOEpU2wx0xkbTtHOh1revLlJYGrGnMtGvDzt0TGWA-JQMemBuevlPYOj-lhisiYpiiGbLA0fafNfQa3Qkrqw"/>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent opacity-90"></div>
                        <div className="absolute bottom-0 p-4 w-full">
                            <h3 className="text-lg font-bold text-white">Sarah Chen</h3>
                            <p className="text-[#34D399] text-sm font-medium">Chief Technology Officer</p>
                        </div>
                    </div>
                    {/* Member 3 */}
                    <div className="group relative overflow-hidden rounded-2xl bg-[#1E293B] border border-white/5">
                        <div className="aspect-[4/5] w-full bg-slate-800">
                            <img alt="Portrait of Marcus Johnson, Head of Operations" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdzPXX7qiTFwXug2YK1NVDymqMxFHFG24SraLeMywUWNZxFpnYg8U5IvNsP2uKN7dd5-rL5op8jR3-9tSQCbDRWCc4U9u5iK6LnwhpWsKOxsXQdjWKyR6pF6DYjhC5I4UD9oBeau8YEwJpsWlcO6aP7_15fbtbuZ4PYIqgfptR1bWJPMOADu1gm8C2xeQdhoeDmEMVxNMJuL0Oshjckl_zQkjKc6YkwZxVNBf0wENk6wC38wxZcyIjTAUKDXxBZbXlqUWFaU2-eT4"/>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent opacity-90"></div>
                        <div className="absolute bottom-0 p-4 w-full">
                            <h3 className="text-lg font-bold text-white">Marcus Johnson</h3>
                            <p className="text-[#34D399] text-sm font-medium">Head of Operations</p>
                        </div>
                    </div>
                    {/* Member 4 */}
                    <div className="group relative overflow-hidden rounded-2xl bg-[#1E293B] border border-white/5">
                        <div className="aspect-[4/5] w-full bg-slate-800">
                            <img alt="Portrait of Emily Davis, Sustainability Lead" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3JWfndAXP1p4SeqYC8loBDfme96P8XyUrmKLCJEemRqvfWvZj8IVXtyugQ3RoR7o2OWv9HdoTNAcpBnqu8TVaOJMf1ZyVwCa7u9tsEa1vhSh9fl9nj6RQkPf0xxUzOYXE5zaQDAlnkSF2pM5m0Z3lnE2ziJrrhwe0WQqOV_EbCp_UJRmS1pgLpDKwtYuH0IlSEiCqUrHZ5yout9ILN1ZNBdRCXyveCJWx_3f6tWJMRC8zwzLm1de_8zpBB46uroNK8tKRinB8h1Y"/>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent opacity-90"></div>
                        <div className="absolute bottom-0 p-4 w-full">
                            <h3 className="text-lg font-bold text-white">Emily Davis</h3>
                            <p className="text-[#34D399] text-sm font-medium">Sustainability Lead</p>
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
                            Join thousands of eco-conscious individuals and businesses. Schedule your first pickup today.
                        </p>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <button 
                                onClick={() => window.location.hash = '#/search'}
                                className="flex h-12 min-w-[160px] cursor-pointer items-center justify-center rounded-full bg-[#0B1120] px-6 text-white text-base font-bold transition-transform hover:scale-105"
                            >
                                Book Pickup
                            </button>
                            <button 
                                onClick={() => window.location.hash = '#/contact'}
                                className="flex h-12 min-w-[160px] cursor-pointer items-center justify-center rounded-full border-2 border-[#0B1120] px-6 text-[#0B1120] text-base font-bold transition-colors hover:bg-[#0B1120]/10"
                            >
                                Contact Sales
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        {/* Footer */}
        <footer className="w-full border-t border-white/5 bg-[#0B1120] pt-16 pb-8 relative z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4 cursor-pointer" onClick={() => window.location.hash = '#/'}>
                            <div className="size-6 text-[#34D399] flex items-center justify-center">
                                <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" stroke="currentColor" strokeWidth="3"></path>
                                </svg>
                            </div>
                            <span className="text-white text-lg font-bold">EcoCycle</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">Making e-waste recycling accessible, transparent, and rewarding for everyone.</p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">Company</h4>
                        <ul className="flex flex-col gap-2 text-sm text-slate-400">
                            <li><button className="hover:text-[#34D399] transition-colors bg-transparent border-none cursor-pointer p-0" onClick={() => window.location.hash = '#/about'}>About</button></li>
                            <li><button className="hover:text-[#34D399] transition-colors bg-transparent border-none cursor-pointer p-0">Careers</button></li>
                            <li><button className="hover:text-[#34D399] transition-colors bg-transparent border-none cursor-pointer p-0">Impact</button></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">Resources</h4>
                        <ul className="flex flex-col gap-2 text-sm text-slate-400">
                            <li><button className="hover:text-[#34D399] transition-colors bg-transparent border-none cursor-pointer p-0">Help Center</button></li>
                            <li><button className="hover:text-[#34D399] transition-colors bg-transparent border-none cursor-pointer p-0">Recycling Guide</button></li>
                            <li><button className="hover:text-[#34D399] transition-colors bg-transparent border-none cursor-pointer p-0" onClick={() => window.location.hash = '#/agency'}>Partner with Us</button></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">Legal</h4>
                        <ul className="flex flex-col gap-2 text-sm text-slate-400">
                            <li><button className="hover:text-[#34D399] transition-colors bg-transparent border-none cursor-pointer p-0">Privacy Policy</button></li>
                            <li><button className="hover:text-[#34D399] transition-colors bg-transparent border-none cursor-pointer p-0">Terms of Service</button></li>
                            <li><button className="hover:text-[#34D399] transition-colors bg-transparent border-none cursor-pointer p-0">Cookie Policy</button></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm">© 2024 EcoCycle. All rights reserved.</p>
                    <div className="flex gap-4">
                        <button className="text-slate-500 hover:text-white transition-colors bg-transparent border-none cursor-pointer"><span className="sr-only">Twitter</span><svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg></button>
                        <button className="text-slate-500 hover:text-white transition-colors bg-transparent border-none cursor-pointer"><span className="sr-only">GitHub</span><svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fillRule="evenodd"></path></svg></button>
                    </div>
                </div>
            </div>
        </footer>
    </div>
  );
};

export default AboutUs;