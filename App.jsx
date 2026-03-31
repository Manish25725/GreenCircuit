import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { api, getCurrentUser } from './services/api.js';
import { LanguageProvider } from './contexts/LanguageContext.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import AgencyDashboard from './pages/AgencyDashboard.jsx';
import ManageSlots from './pages/ManageSlots.jsx';
import AgencyBookings from './pages/AgencyBookings.jsx';
import PartnerProfile from './pages/PartnerProfile.jsx';
import PartnerEditProfile from './pages/PartnerEditProfile.jsx';
import PartnerSecurity from './pages/PartnerSecurity.jsx';
import PartnerNotifications from './pages/PartnerNotifications.jsx';
import PartnerAppSettings from './pages/PartnerAppSettings.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import Certificate from './pages/Certificate.jsx';
import SearchAgencies from './pages/SearchAgencies.jsx';
import SchedulePickup from './pages/SchedulePickup.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import ContactUs from './pages/ContactUs.jsx';
import HowItWorks from './pages/HowItWorks.jsx';
import AboutUs from './pages/AboutUs.jsx';
import Profile from './pages/Profile.jsx';
import Rewards from './pages/Rewards.jsx';
import Notifications from './pages/Notifications.jsx';
import Security from './pages/Security.jsx';
import AppSettings from './pages/AppSettings.jsx';
import AdminVetting from './pages/AdminVetting.jsx';
import AdminUsers from './pages/AdminUsers.jsx';
import AdminAgencies from './pages/AdminAgencies.jsx';
import AdminReports from './pages/AdminReports.jsx';
import AdminPartnerApproval from './pages/AdminPartnerApproval.jsx';
import PickupConfirmation from './pages/PickupConfirmation.jsx';
import PickupLimitReached from './pages/PickupLimitReached.jsx';
import History from './pages/History.jsx';
import BusinessInventory from './pages/BusinessInventory.jsx';
import BusinessCertificates from './pages/BusinessCertificates.jsx';
import BusinessDashboard from './pages/BusinessDashboard.jsx';
import BusinessAnalytics from './pages/BusinessAnalytics.jsx';
import BusinessProfileSettings from './pages/BusinessProfileSettings.jsx';
import EditBusinessProfile from './pages/EditBusinessProfile.jsx';
import BusinessNotifications from './pages/BusinessNotifications.jsx';
import BusinessSecurity from './pages/BusinessSecurity.jsx';
import BusinessAppSettings from './pages/BusinessAppSettings.jsx';
import BusinessAddress from './pages/BusinessAddress.jsx';
import BusinessContact from './pages/BusinessContact.jsx';
import BusinessEditProfile from './pages/BusinessEditProfile.jsx';
import ActiveSessions from './pages/ActiveSessions.jsx';
import ResidentProfileSettings from './pages/ResidentProfileSettings.jsx';
import EditResidentProfile from './pages/EditResidentProfile.jsx';
import ResidentNotifications from './pages/ResidentNotifications.jsx';
import ResidentSecurity from './pages/ResidentSecurity.jsx';
import ResidentAppSettings from './pages/ResidentAppSettings.jsx';
import ResidentActiveSessions from './pages/ResidentActiveSessions.jsx';
import UserCertificates from './pages/UserCertificates.jsx';
import PartnerRegistration from './pages/PartnerRegistration.jsx';
import PartnerPending from './pages/PartnerPending.jsx';
import Services from './pages/Services.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminUserDetail from './pages/AdminUserDetail.jsx';
import AdminAgencyDetail from './pages/AdminAgencyDetail.jsx';
// Protected Route wrapper component
const ProtectedRoute = ({ children, allowedRoles }) => {
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
    }
    else if (userRole === 'agency') {
        return <PartnerProfile />;
    }
    else if (userRole === 'user') {
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
    }
    else if (userRole === 'user') {
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
    }
    else if (userRole === 'user') {
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
    }
    else if (userRole === 'user') {
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
                        
                        {/* Partner Public Routes */}
                        <Route path="/partner/register" element={<PartnerRegistration />} />
                        <Route path="/partner/pending" element={<PartnerPending />} />

                        {/* Admin Routes */}
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

                        {/* Resident (User) Routes */}
                        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['user']}><UserDashboard /></ProtectedRoute>} />
                        <Route path="/rewards" element={<ProtectedRoute allowedRoles={['user']}><Rewards /></ProtectedRoute>} />
                        <Route path="/certificate" element={<ProtectedRoute allowedRoles={['user']}><Certificate /></ProtectedRoute>} />
                        <Route path="/certificates" element={<ProtectedRoute allowedRoles={['user']}><UserCertificates /></ProtectedRoute>} />
                        <Route path="/history" element={<ProtectedRoute allowedRoles={['user']}><History /></ProtectedRoute>} />
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

                        {/* Shared Protected Routes (User & Business) */}
                        <Route path="/search" element={<ProtectedRoute allowedRoles={['user', 'business']}><SearchAgencies /></ProtectedRoute>} />
                        <Route path="/schedule" element={<ProtectedRoute allowedRoles={['user', 'business']}><SchedulePickup /></ProtectedRoute>} />
                        <Route path="/pickup-confirmation" element={<ProtectedRoute allowedRoles={['user', 'business']}><PickupConfirmation /></ProtectedRoute>} />
                        <Route path="/pickup-limit" element={<ProtectedRoute allowedRoles={['user', 'business']}><PickupLimitReached /></ProtectedRoute>} />

                        {/* General Protected Routes (Any Role) */}
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
