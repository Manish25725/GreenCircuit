import React, { useState, useEffect } from 'react';
import { api, getCurrentUser } from './services/api';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import AgencyDashboard from './pages/AgencyDashboard';
import AgencyAnalytics from './pages/AgencyAnalytics';
import ManageSlots from './pages/ManageSlots';
import AgencyBookings from './pages/AgencyBookings';
import AgencyProfile from './pages/AgencyProfile';
import PartnerProfile from './pages/PartnerProfile';
import PartnerSecurity from './pages/PartnerSecurity';
import UserDashboard from './pages/UserDashboard';
import Certificate from './pages/Certificate';
import SearchAgencies from './pages/SearchAgencies';
import SchedulePickup from './pages/SchedulePickup';
import AdminDashboard from './pages/AdminDashboard';
import Landing from './pages/Landing';
import Login from './pages/Login';
import ContactUs from './pages/ContactUs';
import HowItWorks from './pages/HowItWorks';
import AboutUs from './pages/AboutUs';
import Profile from './pages/Profile';
import Rewards from './pages/Rewards';
import Notifications from './pages/Notifications';
import Security from './pages/Security';
import AppSettings from './pages/AppSettings';
import AdminVetting from './pages/AdminVetting';
import AdminUsers from './pages/AdminUsers';
import AdminAgencies from './pages/AdminAgencies';
import AdminReports from './pages/AdminReports';
import AdminPartnerApproval from './pages/AdminPartnerApproval';
import PickupConfirmation from './pages/PickupConfirmation';
import PickupLimitReached from './pages/PickupLimitReached';
import History from './pages/History';
import LoadingScreen from './components/LoadingScreen';
import BusinessInventory from './pages/BusinessInventory';
import BusinessCertificates from './pages/BusinessCertificates';
import BusinessDashboard from './pages/BusinessDashboard';
import BusinessAnalytics from './pages/BusinessAnalytics';
import BusinessProfile from './pages/BusinessProfile';
import BusinessProfileSettings from './pages/BusinessProfileSettings';
import EditBusinessProfile from './pages/EditBusinessProfile';
import BusinessNotifications from './pages/BusinessNotifications';
import BusinessSecurity from './pages/BusinessSecurity';
import BusinessAppSettings from './pages/BusinessAppSettings';
import BusinessAddress from './pages/BusinessAddress';
import BusinessContact from './pages/BusinessContact';
import BusinessEditProfile from './pages/BusinessEditProfile';
import ActiveSessions from './pages/ActiveSessions';
import ResidentProfileSettings from './pages/ResidentProfileSettings';
import EditResidentProfile from './pages/EditResidentProfile';
import ResidentNotifications from './pages/ResidentNotifications';
import ResidentSecurity from './pages/ResidentSecurity';
import ResidentAppSettings from './pages/ResidentAppSettings';
import ResidentActiveSessions from './pages/ResidentActiveSessions';
import UserCertificates from './pages/UserCertificates';
import PartnerRegistration from './pages/PartnerRegistration';
import PartnerPending from './pages/PartnerPending';
import Services from './pages/Services';
import AdminLogin from './pages/AdminLogin';
import AdminUserDetail from './pages/AdminUserDetail';
import AdminAgencyDetail from './pages/AdminAgencyDetail';

const App = () => {
  const [route, setRoute] = useState(window.location.hash || '#/');
  // Removed loading screen to fix dark green screen issue
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(100);

  // Get current user role
  const getCurrentUserRole = (): string | null => {
    const user = getCurrentUser();
    return user?.role || null;
  };

  // Check if user can access a route based on their role
  const canAccessRoute = (path: string, userRole: string | null): boolean => {
    // Public routes - anyone can access
    const publicRoutes = ['#/', '#/login', '#/contact', '#/how-it-works', '#/about', '#/services', '#/partner/register', '#/partner/pending', '#/admin-login'];
    if (publicRoutes.includes(path)) return true;

    // Admin routes - anyone can access (no authentication required)
    if (path.startsWith('#/admin')) {
      return true;
    }

    // If no user is logged in, they can only access public routes
    if (!userRole) return false;

    // Agency/Partner routes - only agency can access
    if (path.startsWith('#/agency')) {
      return userRole === 'agency';
    }

    // Partner registration routes - accessible to logged-in users who want to become partners
    if (path.startsWith('#/partner')) {
      return true; // Allow any logged-in user to access partner registration
    }

    // Business routes - only business can access
    if (path.startsWith('#/business')) {
      return userRole === 'business';
    }

    // Resident routes - only residents/users can access
    if (path.startsWith('#/resident')) {
      return userRole === 'user';
    }

    // Common routes accessible by all logged-in users (user, business, agency, admin)
    const commonRoutes = ['#/profile', '#/notifications', '#/security', '#/settings'];
    if (commonRoutes.some(r => path.startsWith(r))) {
      return userRole === 'user' || userRole === 'business' || userRole === 'agency' || userRole === 'admin';
    }

    // User-only routes (dashboard, rewards, etc.)
    const userOnlyRoutes = ['#/dashboard', '#/rewards', '#/certificate', '#/certificates', '#/history'];
    if (userOnlyRoutes.some(r => path.startsWith(r))) {
      return userRole === 'user';
    }

    // Shared routes - users and business can access
    const sharedRoutes = ['#/search', '#/schedule', '#/pickup-confirmation', '#/pickup-limit'];
    if (sharedRoutes.some(r => path.startsWith(r))) {
      return userRole === 'user' || userRole === 'business';
    }

    return false;
  };

  // Get the correct dashboard route for a user role
  const getDashboardForRole = (role: string | null): string => {
    switch (role) {
      case 'admin': return '#/admin';
      case 'agency': return '#/agency';
      case 'business': return '#/business';
      case 'user': return '#/dashboard';
      default: return '#/login';
    }
  };

  // Validate token on app start
  useEffect(() => {
    const validateSession = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const isValid = await api.validateToken();
        if (!isValid) {
          console.log('Invalid token detected - session cleared');
          // Token was invalid and has been cleared
          // If user is on a protected page, redirect to login
          const protectedPaths = ['#/dashboard', '#/profile', '#/rewards', '#/schedule', '#/search'];
          const currentPath = window.location.hash.split('?')[0];
          if (protectedPaths.some(p => currentPath.startsWith(p))) {
            window.location.hash = '#/login';
          }
        }
      }
    };
    validateSession();
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || '#/');
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderRoute = () => {
    // Extract base path without query params
    const basePath = route.split('?')[0];
    const userRole = getCurrentUserRole();

    // Check route access
    if (!canAccessRoute(basePath, userRole)) {
      // If logged in but trying to access wrong dashboard, redirect to correct one
      if (userRole) {
        const correctDashboard = getDashboardForRole(userRole);
        window.location.hash = correctDashboard;
        return null;
      } else {
        // Not logged in, redirect to login for protected routes
        const publicRoutes = ['#/', '#/login', '#/contact', '#/how-it-works', '#/about'];
        if (!publicRoutes.includes(basePath)) {
          window.location.hash = '#/login';
          return null;
        }
      }
    }
    
    switch (basePath) {
      case '#/agency':
        return <AgencyDashboard />;
      case '#/agency/slots':
        return <ManageSlots />;
      case '#/agency/bookings':
        return <AgencyBookings />;
      case '#/agency/profile':
        return <AgencyProfile />;
      case '#/partner/profile':
        return <PartnerProfile />;
      case '#/partner/security':
        return <PartnerSecurity />;
      case '#/partner/register':
        return <PartnerRegistration />;
      case '#/partner/pending':
        return <PartnerPending />;
      case '#/dashboard':
        return <UserDashboard />;
      case '#/rewards':
        return <Rewards />;
      case '#/certificate':
        return <Certificate />;
      case '#/certificates':
        return <UserCertificates />;
      case '#/search':
        return <SearchAgencies />;
      case '#/schedule':
        return <SchedulePickup />;
      case '#/pickup-confirmation':
        return <PickupConfirmation />;
      case '#/pickup-limit':
        return <PickupLimitReached />;
      case '#/history':
        return <History />;
      case '#/admin':
        return <AdminDashboard />;
      case '#/admin/vetting':
        return <AdminVetting />;
      case '#/admin/users':
        return <AdminUsers />;
      case '#/admin/agencies':
        return <AdminAgencies />;
      case '#/admin/partners':
        return <AdminPartnerApproval />;
    }
    
    // Dynamic routes - check if path matches pattern
    if (basePath.startsWith('#/admin/users/')) {
      return <AdminUserDetail />;
    }
    if (basePath.startsWith('#/admin/agencies/')) {
      return <AdminAgencyDetail />;
    }
    
    switch (basePath) {
      case '#/admin/reports':
        return <AdminReports />;
      case '#/admin-login':
        return <AdminLogin />;
      case '#/login':
        return <Login />;
      case '#/contact':
        return <ContactUs />;
      case '#/how-it-works':
        return <HowItWorks />;
      case '#/about':
        return <AboutUs />;
      case '#/services':
        return <Services />;
      case '#/profile':
        // Route to appropriate profile based on user role
        if (userRole === 'business') {
          return <BusinessProfileSettings />;
        } else if (userRole === 'agency') {
          return <PartnerProfile />;
        } else if (userRole === 'user') {
          return <ResidentProfileSettings />;
        }
        return <Profile />;
      case '#/resident/profile':
        return <EditResidentProfile />;
      case '#/resident/sessions':
        return <ResidentActiveSessions />;
      case '#/business/profile':
        return <EditBusinessProfile />;
      case '#/business/edit-profile':
        return <BusinessEditProfile />;
      case '#/business/address':
        return <BusinessAddress />;
      case '#/business/contact':
        return <BusinessContact />;
      case '#/business/sessions':
        return <ActiveSessions />;
      case '#/notifications':
        // Route to role-specific notifications
        if (userRole === 'business') {
          return <BusinessNotifications />;
        } else if (userRole === 'user') {
          return <ResidentNotifications />;
        }
        return <Notifications />;
      case '#/security':
        // Route to role-specific security
        if (userRole === 'business') {
          return <BusinessSecurity />;
        } else if (userRole === 'user') {
          return <ResidentSecurity />;
        }
        return <Security />;
      case '#/settings':
        // Route to role-specific settings
        if (userRole === 'business') {
          return <BusinessAppSettings />;
        } else if (userRole === 'user') {
          return <ResidentAppSettings />;
        }
        return <AppSettings />;
      case '#/business':
        return <BusinessDashboard />;
      case '#/business/inventory':
        return <BusinessInventory />;
      case '#/business/certificates':
        return <BusinessCertificates />;
      case '#/business/analytics':
        return <BusinessAnalytics />;
      case '#/':
      default:
        return <Landing />;
    }
  };

  // Loading screen removed - go directly to content
  return (
    <ThemeProvider>
      <LanguageProvider>
        {renderRoute()}
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;