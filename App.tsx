import React, { useState, useEffect } from 'react';
import AgencyAnalytics from './pages/AgencyAnalytics';
import ManageSlots from './pages/ManageSlots';
import AgencyBookings from './pages/AgencyBookings';
import AgencyProfile from './pages/AgencyProfile';
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
import PickupConfirmation from './pages/PickupConfirmation';
import LoadingScreen from './components/LoadingScreen';
import BusinessInventory from './pages/BusinessInventory';
import BusinessCertificates from './pages/BusinessCertificates';
import BusinessDashboard from './pages/BusinessDashboard';
import BusinessAnalytics from './pages/BusinessAnalytics';

const App = () => {
  const [route, setRoute] = useState(window.location.hash || '#/');
  // Removed loading screen to fix dark green screen issue
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(100);

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
    
    switch (basePath) {
      case '#/agency':
        return <AgencyAnalytics />;
      case '#/agency/slots':
        return <ManageSlots />;
      case '#/agency/bookings':
        return <AgencyBookings />;
      case '#/agency/profile':
        return <AgencyProfile />;
      case '#/dashboard':
        return <UserDashboard />;
      case '#/rewards':
        return <Rewards />;
      case '#/certificate':
        return <Certificate />;
      case '#/search':
        return <SearchAgencies />;
      case '#/schedule':
        return <SchedulePickup />;
      case '#/pickup-confirmation':
        return <PickupConfirmation />;
      case '#/admin':
        return <AdminDashboard />;
      case '#/admin/vetting':
        return <AdminVetting />;
      case '#/admin/users':
        return <AdminUsers />;
      case '#/admin/agencies':
        return <AdminAgencies />;
      case '#/admin/reports':
        return <AdminReports />;
      case '#/login':
        return <Login />;
      case '#/contact':
        return <ContactUs />;
      case '#/how-it-works':
        return <HowItWorks />;
      case '#/about':
        return <AboutUs />;
      case '#/profile':
        return <Profile />;
      case '#/notifications':
        return <Notifications />;
      case '#/security':
        return <Security />;
      case '#/settings':
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
    <>
      {renderRoute()}
    </>
  );
};

export default App;