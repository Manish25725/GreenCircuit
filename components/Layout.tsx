import React, { useState } from 'react';
import { NavItem } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  role: 'Admin' | 'Agency' | 'User' | 'Business';
  fullWidth?: boolean;
  hideSidebar?: boolean;
}

// Get current user from localStorage
const getStoredUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
  } catch (e) {
    console.error('Failed to parse user from localStorage');
  }
  return null;
};

const Layout: React.FC<LayoutProps> = ({ children, title, subtitle, role, fullWidth = false, hideSidebar = false }) => {
  const storedUser = getStoredUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const agencyNav: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', path: '#/agency' },
    { label: 'Manage Slots', icon: 'calendar_month', path: '#/agency/slots', active: title === 'Manage Slots' },
    { label: 'Bookings', icon: 'book_online', path: '#/agency/bookings' },
    { label: 'Profile', icon: 'person', path: '#/agency/profile' },
    { label: 'Settings', icon: 'settings', path: '#/agency/settings' },
  ];

  const userNav: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', path: '#/dashboard' },
    { label: 'Book Pickup', icon: 'local_shipping', path: '#/search' },
    { label: 'Rewards', icon: 'military_tech', path: '#/rewards' },
    { label: 'Certificate', icon: 'workspace_premium', path: '#/certificate' },
    { label: 'How It Works', icon: 'info', path: '#/how-it-works' },
    { label: 'Profile', icon: 'person', path: '#/profile' },
  ];

  const adminNav: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', path: '#/admin' },
    { label: 'Users', icon: 'group', path: '#/admin/users' },
    { label: 'Vetting Queue', icon: 'verified_user', path: '#/admin/vetting' },
    { label: 'Agencies', icon: 'domain', path: '#/admin/agencies' },
    { label: 'Reports', icon: 'assessment', path: '#/admin/reports' },
  ];

  const businessNav: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', path: '#/business' },
    { label: 'Inventory', icon: 'inventory_2', path: '#/business/inventory' },
    { label: 'Certificates', icon: 'verified', path: '#/business/certificates' },
    { label: 'Analytics', icon: 'analytics', path: '#/business/analytics' },
    { label: 'Book Pickup', icon: 'local_shipping', path: '#/search' },
  ];

  const currentNav = role === 'Agency' ? agencyNav : role === 'Admin' ? adminNav : role === 'Business' ? businessNav : userNav;
  
  // Use stored user info or fallback to defaults
  const userName = storedUser?.name || (role === 'Agency' ? 'EcoCycle Inc.' : role === 'Admin' ? 'Admin Panel' : role === 'Business' ? 'Business User' : 'User');
  const userEmail = storedUser?.email || (role === 'Agency' ? 'agency@ecocycle.com' : role === 'Admin' ? 'admin@ecocycle.com' : role === 'Business' ? 'business@company.com' : 'user@example.com');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.hash = '#/';
  };

  return (
    <div className="flex min-h-screen w-full bg-[#0B1116] text-gray-200 font-sans">
      {/* Mobile Header */}
      {!hideSidebar && (
        <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0B1116] border-b border-white/5 flex items-center justify-between px-4 z-50">
          <div className="flex items-center gap-2" onClick={() => window.location.hash = '#/'}>
            <div className="h-8 w-8 rounded-full bg-[#34D399]/10 text-[#34D399] flex items-center justify-center font-bold text-sm border border-[#34D399]/20">
              <span className="material-symbols-outlined text-lg">recycling</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm font-bold text-white tracking-tight">{userName}</h1>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </header>
      )}

      {/* Mobile Menu Overlay */}
      {!hideSidebar && isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      {!hideSidebar && (
        <aside className={`fixed top-0 left-0 h-screen w-64 border-r border-white/5 bg-[#0B1116] flex flex-col z-50 transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => window.location.hash = '#/'}>
              <div className="h-10 w-10 rounded-full bg-[#34D399]/10 text-[#34D399] flex items-center justify-center font-bold text-lg border border-[#34D399]/20 shadow-[0_0_15px_rgba(52,211,153,0.2)]">
                <span className="material-symbols-outlined">recycling</span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-base font-bold text-white tracking-tight">{userName}</h1>
                <p className="text-xs text-slate-400">{userEmail}</p>
              </div>
            </div>

            <nav className="flex flex-col gap-1">
              {currentNav.map((item) => (
                <a
                  key={item.label}
                  href={item.path}
                  onClick={(e) => { 
                    e.preventDefault(); 
                    window.location.hash = item.path;
                    setIsMobileMenuOpen(false); // Close mobile menu on navigation
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    item.active || window.location.hash === item.path
                      ? 'bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/10'
                      : 'text-slate-400 hover:bg-white/5 hover:translate-x-1'
                  }`}
                >
                  <span className={`material-symbols-outlined ${item.active ? 'fill' : ''} text-xl`}>
                    {item.icon}
                  </span>
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="mt-auto p-6 border-t border-white/5">
            <button 
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined">logout</span>
              Logout
            </button>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className={`flex-1 ${!hideSidebar ? 'lg:ml-64 pt-16 lg:pt-0' : ''} overflow-y-auto ${fullWidth ? 'p-0' : 'p-4 sm:p-6 lg:p-8'}`}>
        <div className={fullWidth ? 'w-full' : 'max-w-7xl mx-auto'}>
          <div className={`flex flex-col gap-1 ${fullWidth ? 'hidden' : 'mb-6 lg:mb-8'}`}>
             {/* Only show header if title is present */}
             {title && (
                 <div className="animate-fade-in-up">
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">{title}</h1>
                    {subtitle && <p className="text-slate-400 mt-1 text-sm sm:text-base">{subtitle}</p>}
                 </div>
             )}
          </div>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;