import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { api, getCurrentUser } from './services/api';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import AgencyDashboard from './pages/AgencyDashboard';
import AgencyAnalytics from './pages/AgencyAnalytics';
import ManageSlots from './pages/ManageSlots';
import AgencyBookings from './pages/AgencyBookings';
import AgencyProfile from './pages/AgencyProfile';
import PartnerProfile from './pages/PartnerProfile';
import PartnerEditProfile from './pages/PartnerEditProfile';
import PartnerSecurity from './pages/PartnerSecurity';
import PartnerNotifications from './pages/PartnerNotifications';
import PartnerAppSettings from './pages/PartnerAppSettings';
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

// Protected Route wrapper component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const user = getCurrentUser();
  const userRole = user?.role || null;
  const navigate = useNavigate();

  useEffect(() => {
    if (!userRole) {
      navigate('/login', { replace: true });
      return;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      // Redirect to correct dashboard
      switch (userRole) {
        case 'admin':
          navigate('/admin', { replace: true });
          break;
        case 'agency':
          navigate('/agency', { replace: true });
          break;
        case 'business':
          navigate('/business', { replace: true });
          break;
        case 'user':
          navigate('/dashboard', { replace: true });
          break;
      }
    }
  }, [userRole, allowedRoles, navigate]);

  if (!userRole || (allowedRoles && !allowedRoles.includes(userRole))) {
    return null;
  }

  return <>{children}</>;
};

// Profile router component
const ProfileRoute = () => {
  const user = getCurrentUser();
  const userRole = user?.role;

  if (userRole === 'business') {
    return <BusinessProfileSettings />;
  } else if (userRole === 'agency') {
    return <PartnerProfile />;
  } else if (userRole === 'user') {
    return <ResidentProfileSettings />;
  }
  return <Profile />;
};

// Notifications router component
const NotificationsRoute = () => {
  const user = getCurrentUser();
  const userRole = user?.role;

  if (userRole === 'business') {
    return <BusinessNotifications />;
  } else if (userRole === 'user') {
    return <ResidentNotifications />;
  }
  return <Notifications />;
};

// Security router component
const SecurityRoute = () => {
  const user = getCurrentUser();
  const userRole = user?.role;

  if (userRole === 'business') {
    return <BusinessSecurity />;
  } else if (userRole === 'user') {
    return <ResidentSecurity />;
  }
  return <Security />;
};

// Settings router component
const SettingsRoute = () => {
  const user = getCurrentUser();
  const userRole = user?.role;

  if (userRole === 'business') {
    return <BusinessAppSettings />;
  } else if (userRole === 'user') {
    return <ResidentAppSettings />;
  }
  return <AppSettings />;
};

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  // Validate token on app start
  useEffect(() => {
    const validateSession = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        await api.validateToken();
      }
    };
    validateSession();
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/services" element={<Services />} />
            
            {/* Partner Registration Routes */}
            <Route path="/partner/register" element={<PartnerRegistration />} />
            <Route path="/partner/pending" element={<PartnerPending />} />
            
            {/* Admin Routes - No auth required */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/vetting" element={<AdminVetting />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/users/:id" element={<AdminUserDetail />} />
            <Route path="/admin/agencies" element={<AdminAgencies />} />
            <Route path="/admin/agencies/:id" element={<AdminAgencyDetail />} />
            <Route path="/admin/partners" element={<AdminPartnerApproval />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            
            {/* Agency/Partner Routes */}
            <Route path="/agency" element={<ProtectedRoute allowedRoles={['agency']}><AgencyDashboard /></ProtectedRoute>} />
            <Route path="/agency/slots" element={<ProtectedRoute allowedRoles={['agency']}><ManageSlots /></ProtectedRoute>} />
            <Route path="/agency/bookings" element={<ProtectedRoute allowedRoles={['agency']}><AgencyBookings /></ProtectedRoute>} />
            <Route path="/agency/profile" element={<ProtectedRoute allowedRoles={['agency']}><PartnerProfile /></ProtectedRoute>} />
            <Route path="/partner/profile" element={<ProtectedRoute allowedRoles={['agency']}><PartnerProfile /></ProtectedRoute>} />
            <Route path="/partner/edit-profile" element={<ProtectedRoute allowedRoles={['agency']}><PartnerEditProfile /></ProtectedRoute>} />
            <Route path="/partner/security" element={<ProtectedRoute allowedRoles={['agency']}><PartnerSecurity /></ProtectedRoute>} />
            <Route path="/partner/notifications" element={<ProtectedRoute allowedRoles={['agency']}><PartnerNotifications /></ProtectedRoute>} />
            <Route path="/partner/settings" element={<ProtectedRoute allowedRoles={['agency']}><PartnerAppSettings /></ProtectedRoute>} />
            
            {/* User Routes */}
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['user']}><UserDashboard /></ProtectedRoute>} />
            <Route path="/rewards" element={<ProtectedRoute allowedRoles={['user']}><Rewards /></ProtectedRoute>} />
            <Route path="/certificate" element={<ProtectedRoute allowedRoles={['user']}><Certificate /></ProtectedRoute>} />
            <Route path="/certificates" element={<ProtectedRoute allowedRoles={['user']}><UserCertificates /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute allowedRoles={['user']}><History /></ProtectedRoute>} />
            
            {/* Resident Routes */}
            <Route path="/resident/profile" element={<ProtectedRoute allowedRoles={['user']}><EditResidentProfile /></ProtectedRoute>} />
            <Route path="/resident/sessions" element={<ProtectedRoute allowedRoles={['user']}><ResidentActiveSessions /></ProtectedRoute>} />
            
            {/* Business Routes */}
            <Route path="/business" element={<ProtectedRoute allowedRoles={['business']}><BusinessDashboard /></ProtectedRoute>} />
            <Route path="/business/inventory" element={<ProtectedRoute allowedRoles={['business']}><BusinessInventory /></ProtectedRoute>} />
            <Route path="/business/certificates" element={<ProtectedRoute allowedRoles={['business']}><BusinessCertificates /></ProtectedRoute>} />
            <Route path="/business/analytics" element={<ProtectedRoute allowedRoles={['business']}><BusinessAnalytics /></ProtectedRoute>} />
            <Route path="/business/profile" element={<ProtectedRoute allowedRoles={['business']}><EditBusinessProfile /></ProtectedRoute>} />
            <Route path="/business/edit-profile" element={<ProtectedRoute allowedRoles={['business']}><BusinessEditProfile /></ProtectedRoute>} />
            <Route path="/business/address" element={<ProtectedRoute allowedRoles={['business']}><BusinessAddress /></ProtectedRoute>} />
            <Route path="/business/contact" element={<ProtectedRoute allowedRoles={['business']}><BusinessContact /></ProtectedRoute>} />
            <Route path="/business/sessions" element={<ProtectedRoute allowedRoles={['business']}><ActiveSessions /></ProtectedRoute>} />
            
            {/* Shared Routes - User & Business */}
            <Route path="/search" element={<ProtectedRoute allowedRoles={['user', 'business']}><SearchAgencies /></ProtectedRoute>} />
            <Route path="/schedule" element={<ProtectedRoute allowedRoles={['user', 'business']}><SchedulePickup /></ProtectedRoute>} />
            <Route path="/pickup-confirmation" element={<ProtectedRoute allowedRoles={['user', 'business']}><PickupConfirmation /></ProtectedRoute>} />
            <Route path="/pickup-limit" element={<ProtectedRoute allowedRoles={['user', 'business']}><PickupLimitReached /></ProtectedRoute>} />
            
            {/* Common Routes - Role-based rendering */}
            <Route path="/profile" element={<ProtectedRoute><ProfileRoute /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><NotificationsRoute /></ProtectedRoute>} />
            <Route path="/security" element={<ProtectedRoute><SecurityRoute /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsRoute /></ProtectedRoute>} />
          </Routes>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;