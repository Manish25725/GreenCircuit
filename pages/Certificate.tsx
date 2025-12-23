import React from 'react';
import Layout from '../components/Layout';

const Certificate = () => {
  return (
    <Layout title="" role="User" fullWidth hideSidebar>
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#0B1116] text-gray-200 group/design-root overflow-x-hidden font-sans">
        
        {/* Background Ambient Blobs */}
        <div className="fixed top-0 left-0 w-full h-[500px] bg-[#10b981]/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
        <div className="fixed bottom-0 right-0 w-full h-[500px] bg-[#3b82f6]/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none"></div>

        <div className="layout-container flex h-full grow flex-col relative z-10">
            {/* Standard Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 transition-all duration-300">
                <div className="flex items-center gap-3 text-white cursor-pointer" onClick={() => window.location.hash = '#/'}>
                    <div className="p-2 bg-[#10b981]/10 rounded-lg">
                        <svg className="h-6 w-6 text-[#10b981]" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"></path>
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-white">EcoCycle <span className="text-[#10b981]">Resident</span></h2>
                </div>
                <nav className="hidden md:flex flex-1 justify-center gap-1">
                    <a className="text-sm font-medium px-5 py-2.5 rounded-full text-[#94a3b8] hover:text-white hover:bg-white/5 transition-all cursor-pointer" onClick={() => window.location.hash = '#/dashboard'}>Dashboard</a>
                    <a className="text-sm font-medium px-5 py-2.5 rounded-full text-[#94a3b8] hover:text-white hover:bg-white/5 transition-all cursor-pointer" onClick={() => window.location.hash = '#/search'}>New Request</a>
                    <a className="text-sm font-medium px-5 py-2.5 rounded-full text-[#94a3b8] hover:text-white hover:bg-white/5 transition-all cursor-pointer" onClick={() => window.location.hash = '#/rewards'}>Rewards</a>
                    <a className="text-sm font-semibold px-5 py-2.5 rounded-full text-white bg-white/10 shadow-inner border border-white/5 cursor-pointer" onClick={() => window.location.hash = '#/certificate'}>Certificate</a>
                </nav>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => window.location.hash = '#/profile'}
                        className="hidden sm:flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-[#151F26] border border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"
                    >
                        <div className="size-8 rounded-full bg-cover bg-center ring-2 ring-white/10 group-hover:ring-[#10b981]/50 transition-all" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAreboopkKSy4YYDs4PFvd-l4xnboU1-dCb6q7kuogZsIpVK9icd7CNdE17iE4uQKdoqiJuI30CTaWxw7GK3QrR7H_FstEqPZBbUqkey_74QXoP8uhTfR9RY780_K4O8UAQpRMWJiKbRdh5-SdE7JAIX5lG3yPPg3Wisf3RGrXHACYJxJFU0vYynDCqaru_FI7DW3EV-buSFuzGK8Z7LP7p7c25u8kqkBUXlt5pQG5d-4WVmAzmNX9U0trABs1cC--zDVlgdRcgww")' }}></div>
                        <span className="text-sm font-medium text-gray-200">Alex Morgan</span>
                    </button>
                    <button className="relative p-2.5 rounded-full bg-[#151F26] border border-white/5 text-[#3b82f6] hover:text-[#3b82f6] hover:bg-[#3b82f6]/10 transition-colors">
                        <span className="absolute top-2.5 right-3 size-2 bg-red-500 rounded-full border-2 border-[#151F26]"></span>
                        <span className="material-symbols-outlined text-[20px]">notifications</span>
                    </button>
                </div>
            </header>

            <main className="flex-1 px-4 py-10 sm:px-10 lg:px-40 lg:py-20 mt-20">
              <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-10">
                <div className="flex w-full flex-col items-center gap-3 text-center">
                  <p className="text-[#10b981] text-base font-bold uppercase tracking-widest">Recycling Complete</p>
                  <p className="text-white text-4xl font-black leading-tight tracking-[-0.033em] md:text-5xl">Your Digital E-Waste Certificate</p>
                  <p className="max-w-3xl text-[#94a3b8] text-base font-normal leading-normal md:text-lg">Congratulations on making a positive impact! Here is your official Eco-Certificate, a testament to your commitment to a sustainable future. Download or share it to inspire others.</p>
                </div>
                <div className="flex w-full flex-col items-center gap-12 lg:flex-row lg:items-start lg:gap-10">
                  <div className="w-full max-w-2xl flex-shrink-0 lg:max-w-none lg:flex-1">
                    <div className="relative w-full rounded-xl border border-white/10 bg-[#151F26] p-4 shadow-2xl shadow-black/50">
                      <div className="aspect-[1/1.414] w-full overflow-hidden rounded-lg">
                        <img alt="Eco-Certificate Preview" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgnfU-T-R2fLd8stmD3NK5HAyrShc6WrAOIrUGhC0xxyejPEeRand1oBX53xaQacvGOxXRAmRgeevaYOnv9mdBG5G9c-Y8Ad8ERgrvuwEPtau4o4lF_iwoNvPHbKgEi8K2J2dqtbcY8XA3MyLGAscHDCtJM_S4cSKeSX6B8yMEXowE0KItZFzhaP9N7GXnXJst4SjUdvt2FftcJo-ymnQPJ1mQEH0JzHSpM8GXPE8b6MTxTywzbB2f3ORUs55e-m5EV_tC60_n-Q"/>
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full flex-col gap-8 lg:max-w-xs">
                    <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-[#151F26] p-6">
                      <h3 className="text-white text-lg font-bold">Details</h3>
                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between">
                          <span className="text-[#94a3b8] text-sm">Certificate ID</span>
                          <span className="text-white text-sm font-medium">EC-2024-8842</span>
                        </div>
                         <div className="flex justify-between">
                          <span className="text-[#94a3b8] text-sm">Date Issued</span>
                          <span className="text-white text-sm font-medium">Oct 12, 2024</span>
                        </div>
                         <div className="flex justify-between">
                          <span className="text-[#94a3b8] text-sm">Recycled Items</span>
                          <span className="text-white text-sm font-medium">Laptop, 2 Phones</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#94a3b8] text-sm">CO2 Saved</span>
                          <span className="text-[#10b981] text-sm font-bold">12.5 kg</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#10b981] px-4 py-3 text-[#0B1116] font-bold hover:bg-[#059669] transition-colors cursor-pointer">
                        <span className="material-symbols-outlined">download</span>
                        Download PDF
                      </button>
                      <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/5 px-4 py-3 text-white font-bold hover:bg-white/10 transition-colors border border-white/10 cursor-pointer">
                        <span className="material-symbols-outlined">share</span>
                        Share Certificate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </main>
        </div>
      </div>
    </Layout>
  );
};

export default Certificate;