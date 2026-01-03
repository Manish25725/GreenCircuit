import React from 'react';
import Layout from '../components/Layout';

const AdminVetting = () => {
  return (
    <Layout title="" role="Admin" fullWidth>
      <div className="flex h-screen overflow-hidden bg-[#0B1116] font-sans text-gray-200">
        
        {/* Left Panel: Request Queue */}
        <div className="w-full lg:w-[400px] xl:w-[450px] border-r border-white/5 flex flex-col bg-[#0B1116] shrink-0">
            {/* Header / Search */}
            <div className="p-4 border-b border-white/5">
                <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-500 text-[20px]">search</span>
                    </div>
                    <input className="block w-full pl-10 pr-3 py-2.5 border border-white/5 rounded-xl bg-[#1E293B] text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#34D399] focus:border-[#34D399] text-sm transition-all" placeholder="Search requests..." type="text"/>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <button className="flex items-center px-4 py-1.5 rounded-full bg-[#34D399] text-[#0B1120] text-xs font-bold whitespace-nowrap">
                        All Requests
                    </button>
                    <button className="flex items-center px-4 py-1.5 rounded-full bg-[#1E293B] border border-white/5 text-slate-400 hover:text-white text-xs font-medium whitespace-nowrap transition-colors">
                        New Agencies
                    </button>
                    <button className="flex items-center px-4 py-1.5 rounded-full bg-[#1E293B] border border-white/5 text-slate-400 hover:text-white text-xs font-medium whitespace-nowrap transition-colors">
                        Slot Updates
                    </button>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Queue (4)</p>
                    <button className="text-[#34D399] text-xs font-medium hover:underline flex items-center gap-1 cursor-pointer">
                        Sort by Date <span className="material-symbols-outlined text-[14px]">arrow_drop_down</span>
                    </button>
                </div>
            </div>

            {/* List Items */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {/* Active Item */}
                <div className="p-4 rounded-xl bg-[#1E293B] border border-[#34D399]/30 cursor-pointer relative overflow-hidden group">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#34D399]"></div>
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 shadow-lg" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD8PGjilEd7dviAc0qFQiWQM1ZY9po_qdUFVFDMP-09pLUQfva1CjGjM1y2D97TkTfIPx0GNu0mF5JTmF0DqvDJg_zWeKAqxhVy1yZEGM2Em20qYx90yvgmlloOQf6l-FC44OV6UDSYIYICm_oPGyoQRQZIrDAXwVJ_5ev5Rm8MfB1-q3ekhPiqBnP35YA8vXXpCalVfyLbhRcfvyEzjCKovu49qGCYZ5Ty9veN5dsWoYu0jpkup0ClQTqfd3bT5Tsn8FXsex_6HbQ")' }}></div>
                            <div>
                                <h3 className="text-white font-bold text-sm">GreenEarth Recyclers</h3>
                                <p className="text-[#34D399] text-xs font-medium">New Agency Registration</p>
                            </div>
                        </div>
                        <span className="px-2 py-1 rounded bg-yellow-500/10 text-yellow-500 text-[10px] font-bold uppercase border border-yellow-500/20">Pending</span>
                    </div>
                    <p className="text-slate-400 text-xs line-clamp-2 pl-[52px]">Application for full e-waste processing license. Documents uploaded for verification.</p>
                    <div className="flex items-center gap-4 mt-3 pl-[52px]">
                        <span className="text-slate-500 text-[10px] flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">schedule</span> 2 hrs ago
                        </span>
                        <span className="text-slate-500 text-[10px] flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">attachment</span> 3 Docs
                        </span>
                    </div>
                </div>

                {/* Inactive Item 1 */}
                <div className="p-4 rounded-xl hover:bg-[#1E293B]/80 border border-transparent hover:border-white/5 cursor-pointer transition-all">
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 grayscale opacity-70" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDRGcBCzRiK11IwYi6qwyyfuXViUiULVYh3OZfB0KZwzfH2HSBh6zYLmj9CDN4k6O0zC41w07GAwiRi0IcNlV0aBbRgdSzIs_YcBqeVaQFbYm7LAC-7sV1sMGbJgJDgsXDiZn3LjHBoDnGFHXz7QKjKBmKQmmTwdCykaUbq8MqH0hEVhoOOzQ-LGvygPdM3aKZxZuky40k1exVWH02GkGHHS2H4BRy8UA1VW5NCb93lRoZwLLgjkqS1az-OaWQocuKufdodUE_tsQY")' }}></div>
                            <div>
                                <h3 className="text-white font-medium text-sm">TechCycle Solutions</h3>
                                <p className="text-slate-400 text-xs">Slot Capacity Update</p>
                            </div>
                        </div>
                        <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase border border-blue-500/20">Review</span>
                    </div>
                    <p className="text-slate-400 text-xs line-clamp-2 pl-[52px]">Requesting increase in daily pickup capacity from 500kg to 1000kg for Zone B.</p>
                    <div className="flex items-center gap-4 mt-3 pl-[52px]">
                        <span className="text-slate-500 text-[10px] flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">schedule</span> 5 hrs ago
                        </span>
                    </div>
                </div>

                {/* Inactive Item 2 */}
                <div className="p-4 rounded-xl hover:bg-[#1E293B]/80 border border-transparent hover:border-white/5 cursor-pointer transition-all">
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 grayscale opacity-70" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDE5_XkA8brKDGCF0VlR1L9sRGfYvR8IqDr8t3iaXniXkkTOhDNsZvGHuwyUqdko9zziI7g-uGc0sMFf428DeU3zwxnSS9HNZuvlWm6ISEQ4NN2fEP_XUZUSaiLq78_pxe6Dw05fga3mRJO8Vpznn51TTveBviIAwhgN1OPtw9Jx3UAXKzYZR4g-df27gnRzShXJmbYa67ubykdg27u_TdYqIbKrf1UwbbHDiQIF92BjEgLva7fAY1vzWdZei9TU9eBuqQqc1MNaRY")' }}></div>
                            <div>
                                <h3 className="text-white font-medium text-sm">Urban Miners Co.</h3>
                                <p className="text-slate-400 text-xs">License Renewal</p>
                            </div>
                        </div>
                        <span className="px-2 py-1 rounded bg-yellow-500/10 text-yellow-500 text-[10px] font-bold uppercase border border-yellow-500/20">Pending</span>
                    </div>
                    <p className="text-slate-400 text-xs line-clamp-2 pl-[52px]">Annual EPA compliance certificate renewal submission.</p>
                    <div className="flex items-center gap-4 mt-3 pl-[52px]">
                        <span className="text-slate-500 text-[10px] flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">schedule</span> 1 day ago
                        </span>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Panel: Detailed Vetting View */}
        <div className="flex-1 flex flex-col bg-[#0B1116] overflow-hidden relative">
            {/* Detail Header */}
            <div className="px-8 py-6 border-b border-white/5 bg-[#0B1116]">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex items-center gap-5">
                        <div className="size-20 rounded-2xl bg-[#1E293B] border border-white/5 p-1">
                            <div className="w-full h-full bg-center bg-cover rounded-xl" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBnMPVA0vcXfM_HZ2RUEry8yNrxmSJXdqRIK8gmi-esF3ztvjpP2P3Zv2iPJWzI_YPHcaH5NzhNLcb8h7pj-dTUihIWpDBG8Jcu4rtHhthZG-DHeFS3KSwnWbkYJVdSsS7vWk5CXVCX-TWXEvpz_SxSZVyjvokbLWXmqgWBj1bWVgBHrPk2jZyfW-GziD7rEXYoO1YXWcxe3VTfiQpMH_tcWlF2DiMRuVO22laqrgR0GF9k6YuVojQU6pfdtGO-_-DfC-3-omY6bhk")' }}></div>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white tracking-tight">GreenEarth Recyclers</h1>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-slate-400 text-sm font-medium">ID: #GE-2023-8892</span>
                                <span className="size-1 bg-slate-600 rounded-full"></span>
                                <button className="text-[#34D399] text-sm hover:underline flex items-center gap-1 bg-transparent border-none cursor-pointer">
                                    View Public Profile <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Verification Score Widget */}
                    <div className="flex items-center gap-4 bg-[#1E293B] p-3 rounded-xl border border-white/5 shadow-lg">
                        <div className="relative size-12">
                            <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                                <path className="text-white/10" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4"></path>
                                <path className="text-[#34D399]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="85, 100" strokeWidth="4"></path>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-bold text-white">85%</span>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Trust Score</span>
                            <span className="text-sm text-white font-medium">High Confidence</span>
                        </div>
                    </div>
                </div>
                {/* Tabs */}
                <div className="flex items-center gap-8 mt-8 border-b border-white/5">
                    <button className="pb-3 text-[#34D399] font-medium text-sm border-b-2 border-[#34D399]">Overview</button>
                    <button className="pb-3 text-slate-400 hover:text-white font-medium text-sm transition-colors">Documents & Licenses</button>
                    <button className="pb-3 text-slate-400 hover:text-white font-medium text-sm transition-colors">Proposed Slots</button>
                    <button className="pb-3 text-slate-400 hover:text-white font-medium text-sm transition-colors">Feedback History</button>
                </div>
            </div>

            {/* Scrollable Detail Content */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {/* Col 1: Agency Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Key Info Card */}
                        <div className="bg-[#1E293B] border border-white/5 rounded-2xl p-6 shadow-xl">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#34D399]">info</span> Application Details
                            </h3>
                            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Registration Type</p>
                                    <p className="text-white font-medium">Full Service E-Waste Agency</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Submitted On</p>
                                    <p className="text-white font-medium">Oct 24, 2023 at 09:45 AM</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Contact Person</p>
                                    <div className="flex items-center gap-2">
                                        <div className="size-6 rounded-full bg-slate-700 bg-center bg-cover" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBVBtFFBikFXrhcHpeTD52Rh_pquHuny88EB2EIetEc0lt1-pXtlUkgNQtj8dBbVK-LBLGXHS8CyeWTcmMm0asr4jZkM0ptFCnpfHYJUZ7qqw8oyda-hDKRcl5Wk59O8TBoPLcwA3w0kQHt-EoXZB5A0xq93j3ew5MaMEM1czccOK3O-RDpnpUSPw3UuTSzxhtK5F0WUGfcbzRD_DRTe0LCLEwNNqIGseXaUdbtDsanyJV0SMeg7Ho7fsAMO88EXEBpJysoKPLDNRc")' }}></div>
                                        <p className="text-white font-medium">Sarah Jenkins</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Business Email</p>
                                    <p className="text-white font-medium">contact@greenearth.co</p>
                                </div>
                            </div>
                        </div>
                        {/* Location & Coverage */}
                        <div className="bg-[#1E293B] border border-white/5 rounded-2xl p-6 shadow-xl">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#34D399]">map</span> Coverage Area
                            </h3>
                            <div className="aspect-video w-full rounded-xl bg-slate-800 relative overflow-hidden group border border-white/5">
                                {/* Placeholder Map */}
                                <div className="absolute inset-0 opacity-40 bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuAqgpi-nw1_f0IryPm0O-LD4cV6iyILzLWbXX1JwtRa2sM-EMgikfu0Yvbto6WtwR7Bk0syf3LEAF42nEIo0AnP-Tlq0IBu-S4TvTOGW1E9yFSDo5DL2Y0yZa_RNIplMVLp78z5s8XulSFo6QxnJ_tUjpZPDF9xgZvA27UkrKKNGseR1fkhWsF4Cn-hWIltw9iJv1Dfg_wK9hraZxM2TT1XChSEhZFvIXX9z4c9C-Fh-qB_8I2-0_NSFGhz8poxd7rZ23afzmXyqEs')] bg-cover bg-center"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-[#1E293B]/90 backdrop-blur px-4 py-2 rounded-lg border border-white/5 flex items-center gap-2 shadow-lg">
                                        <span className="material-symbols-outlined text-[#34D399]">location_on</span>
                                        <span className="text-white text-sm">Downtown District (Zones 1-4)</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-white/5 rounded-lg text-xs text-white border border-white/5">Primary: Electronics</span>
                                <span className="px-3 py-1 bg-white/5 rounded-lg text-xs text-white border border-white/5">Secondary: Batteries</span>
                                <span className="px-3 py-1 bg-white/5 rounded-lg text-xs text-white border border-white/5">Industrial Waste</span>
                            </div>
                        </div>
                    </div>
                    {/* Col 2: Documents & Quick Actions */}
                    <div className="space-y-6">
                        {/* Documents Widget */}
                        <div className="bg-[#1E293B] border border-white/5 rounded-2xl p-6 shadow-xl">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#34D399]">folder_open</span> Verification Docs
                            </h3>
                            <div className="space-y-3">
                                {/* Doc Item 1 */}
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0B1116] border border-white/5 hover:border-[#34D399]/50 cursor-pointer transition-all group">
                                    <div className="size-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-red-400">picture_as_pdf</span>
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-white text-sm font-medium truncate group-hover:text-[#34D399] transition-colors">Business_License.pdf</p>
                                        <p className="text-slate-400 text-xs">2.4 MB • Verified</p>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-500 group-hover:text-white">visibility</span>
                                </div>
                                {/* Doc Item 2 */}
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0B1116] border border-white/5 hover:border-[#34D399]/50 cursor-pointer transition-all group">
                                    <div className="size-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-blue-400">image</span>
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-white text-sm font-medium truncate group-hover:text-[#34D399] transition-colors">Insurance_Cert.jpg</p>
                                        <p className="text-slate-400 text-xs">1.1 MB • Pending Review</p>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-500 group-hover:text-white">visibility</span>
                                </div>
                                {/* Doc Item 3 */}
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0B1116] border border-white/5 hover:border-[#34D399]/50 cursor-pointer transition-all group">
                                    <div className="size-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-red-400">picture_as_pdf</span>
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-white text-sm font-medium truncate group-hover:text-[#34D399] transition-colors">EPA_Form_2023.pdf</p>
                                        <p className="text-slate-400 text-xs">845 KB • Pending Review</p>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-500 group-hover:text-white">visibility</span>
                                </div>
                            </div>
                            <button className="w-full mt-4 py-2 text-xs font-bold text-[#34D399] border border-[#34D399]/20 rounded-lg hover:bg-[#34D399]/10 transition-colors uppercase tracking-wide cursor-pointer">
                                Download All Files
                            </button>
                        </div>
                        {/* Notes Widget */}
                        <div className="bg-[#1E293B] border border-white/5 rounded-2xl p-6 shadow-xl">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                                Internal Notes
                            </h3>
                            <div className="relative">
                                <textarea className="w-full bg-[#0B1116] border border-white/5 rounded-xl p-3 text-sm text-white focus:ring-1 focus:ring-[#34D399] focus:border-transparent min-h-[120px] outline-none placeholder-slate-500" placeholder="Add private notes for other admins..."></textarea>
                                <div className="absolute bottom-3 right-3">
                                    <button className="text-xs bg-white/10 text-white px-2 py-1 rounded hover:bg-white/20 transition-colors cursor-pointer">Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Bottom Spacer for sticky footer */}
                <div className="h-24"></div>
            </div>

            {/* Sticky Action Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#0B1116]/95 backdrop-blur border-t border-white/5 flex justify-between items-center z-10">
                <div className="hidden sm:flex items-center gap-2">
                    <span className="text-slate-400 text-sm">Next in queue:</span>
                    <span className="text-white text-sm font-medium">TechCycle Solutions</span>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <button className="px-6 py-2.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 font-semibold text-sm transition-colors flex items-center gap-2 cursor-pointer">
                        <span className="material-symbols-outlined text-[18px]">close</span> Reject
                    </button>
                    <button className="px-6 py-2.5 rounded-lg border border-white/5 text-white hover:bg-white/5 font-semibold text-sm transition-colors flex items-center gap-2 cursor-pointer">
                        <span className="material-symbols-outlined text-[18px]">help</span> Request Info
                    </button>
                    <button className="px-8 py-2.5 rounded-lg bg-[#34D399] hover:bg-[#6EE7B7] text-[#0B1120] font-bold text-sm shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-all flex items-center gap-2 transform active:scale-95 cursor-pointer">
                        <span className="material-symbols-outlined text-[18px]">check</span> Approve Listing
                    </button>
                </div>
            </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminVetting;