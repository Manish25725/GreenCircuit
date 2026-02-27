import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return _jsx(_Fragment, { children: children });
};
// Profile router component
const ProfileRoute = () => {
    const user = getCurrentUser();
    const userRole = user?.role;
    if (userRole === 'business') {
        return _jsx(BusinessProfileSettings, {});
    }
    else if (userRole === 'agency') {
        return _jsx(PartnerProfile, {});
    }
    else if (userRole === 'user') {
        return _jsx(ResidentProfileSettings, {});
    }
    return _jsx(Profile, {});
};
// Notifications router component
const NotificationsRoute = () => {
    const user = getCurrentUser();
    const userRole = user?.role;
    if (userRole === 'business') {
        return _jsx(BusinessNotifications, {});
    }
    else if (userRole === 'user') {
        return _jsx(ResidentNotifications, {});
    }
    return _jsx(Notifications, {});
};
// Security router component
const SecurityRoute = () => {
    const user = getCurrentUser();
    const userRole = user?.role;
    if (userRole === 'business') {
        return _jsx(BusinessSecurity, {});
    }
    else if (userRole === 'user') {
        return _jsx(ResidentSecurity, {});
    }
    return _jsx(Security, {});
};
// Settings router component
const SettingsRoute = () => {
    const user = getCurrentUser();
    const userRole = user?.role;
    if (userRole === 'business') {
        return _jsx(BusinessAppSettings, {});
    }
    else if (userRole === 'user') {
        return _jsx(ResidentAppSettings, {});
    }
    return _jsx(AppSettings, {});
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
    return (_jsx(ThemeProvider, { children: _jsx(LanguageProvider, { children: _jsxs(Router, { children: [_jsx(ScrollToTop, {}), _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Landing, {}) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/admin-login", element: _jsx(AdminLogin, {}) }), _jsx(Route, { path: "/contact", element: _jsx(ContactUs, {}) }), _jsx(Route, { path: "/how-it-works", element: _jsx(HowItWorks, {}) }), _jsx(Route, { path: "/about", element: _jsx(AboutUs, {}) }), _jsx(Route, { path: "/services", element: _jsx(Services, {}) }), _jsx(Route, { path: "/partner/register", element: _jsx(PartnerRegistration, {}) }), _jsx(Route, { path: "/partner/pending", element: _jsx(PartnerPending, {}) }), _jsx(Route, { path: "/admin", element: _jsx(AdminDashboard, {}) }), _jsx(Route, { path: "/admin/vetting", element: _jsx(AdminVetting, {}) }), _jsx(Route, { path: "/admin/users", element: _jsx(AdminUsers, {}) }), _jsx(Route, { path: "/admin/users/:id", element: _jsx(AdminUserDetail, {}) }), _jsx(Route, { path: "/admin/agencies", element: _jsx(AdminAgencies, {}) }), _jsx(Route, { path: "/admin/agencies/:id", element: _jsx(AdminAgencyDetail, {}) }), _jsx(Route, { path: "/admin/partners", element: _jsx(AdminPartnerApproval, {}) }), _jsx(Route, { path: "/admin/reports", element: _jsx(AdminReports, {}) }), _jsx(Route, { path: "/agency", element: _jsx(ProtectedRoute, { allowedRoles: ['agency'], children: _jsx(AgencyDashboard, {}) }) }), _jsx(Route, { path: "/agency/slots", element: _jsx(ProtectedRoute, { allowedRoles: ['agency'], children: _jsx(ManageSlots, {}) }) }), _jsx(Route, { path: "/agency/bookings", element: _jsx(ProtectedRoute, { allowedRoles: ['agency'], children: _jsx(AgencyBookings, {}) }) }), _jsx(Route, { path: "/agency/profile", element: _jsx(ProtectedRoute, { allowedRoles: ['agency'], children: _jsx(PartnerProfile, {}) }) }), _jsx(Route, { path: "/partner/profile", element: _jsx(ProtectedRoute, { allowedRoles: ['agency'], children: _jsx(PartnerProfile, {}) }) }), _jsx(Route, { path: "/partner/edit-profile", element: _jsx(ProtectedRoute, { allowedRoles: ['agency'], children: _jsx(PartnerEditProfile, {}) }) }), _jsx(Route, { path: "/partner/security", element: _jsx(ProtectedRoute, { allowedRoles: ['agency'], children: _jsx(PartnerSecurity, {}) }) }), _jsx(Route, { path: "/partner/notifications", element: _jsx(ProtectedRoute, { allowedRoles: ['agency'], children: _jsx(PartnerNotifications, {}) }) }), _jsx(Route, { path: "/partner/settings", element: _jsx(ProtectedRoute, { allowedRoles: ['agency'], children: _jsx(PartnerAppSettings, {}) }) }), _jsx(Route, { path: "/dashboard", element: _jsx(ProtectedRoute, { allowedRoles: ['user'], children: _jsx(UserDashboard, {}) }) }), _jsx(Route, { path: "/rewards", element: _jsx(ProtectedRoute, { allowedRoles: ['user'], children: _jsx(Rewards, {}) }) }), _jsx(Route, { path: "/certificate", element: _jsx(ProtectedRoute, { allowedRoles: ['user'], children: _jsx(Certificate, {}) }) }), _jsx(Route, { path: "/certificates", element: _jsx(ProtectedRoute, { allowedRoles: ['user'], children: _jsx(UserCertificates, {}) }) }), _jsx(Route, { path: "/history", element: _jsx(ProtectedRoute, { allowedRoles: ['user'], children: _jsx(History, {}) }) }), _jsx(Route, { path: "/resident/profile", element: _jsx(ProtectedRoute, { allowedRoles: ['user'], children: _jsx(EditResidentProfile, {}) }) }), _jsx(Route, { path: "/resident/sessions", element: _jsx(ProtectedRoute, { allowedRoles: ['user'], children: _jsx(ResidentActiveSessions, {}) }) }), _jsx(Route, { path: "/business", element: _jsx(ProtectedRoute, { allowedRoles: ['business'], children: _jsx(BusinessDashboard, {}) }) }), _jsx(Route, { path: "/business/inventory", element: _jsx(ProtectedRoute, { allowedRoles: ['business'], children: _jsx(BusinessInventory, {}) }) }), _jsx(Route, { path: "/business/certificates", element: _jsx(ProtectedRoute, { allowedRoles: ['business'], children: _jsx(BusinessCertificates, {}) }) }), _jsx(Route, { path: "/business/analytics", element: _jsx(ProtectedRoute, { allowedRoles: ['business'], children: _jsx(BusinessAnalytics, {}) }) }), _jsx(Route, { path: "/business/profile", element: _jsx(ProtectedRoute, { allowedRoles: ['business'], children: _jsx(EditBusinessProfile, {}) }) }), _jsx(Route, { path: "/business/edit-profile", element: _jsx(ProtectedRoute, { allowedRoles: ['business'], children: _jsx(BusinessEditProfile, {}) }) }), _jsx(Route, { path: "/business/address", element: _jsx(ProtectedRoute, { allowedRoles: ['business'], children: _jsx(BusinessAddress, {}) }) }), _jsx(Route, { path: "/business/contact", element: _jsx(ProtectedRoute, { allowedRoles: ['business'], children: _jsx(BusinessContact, {}) }) }), _jsx(Route, { path: "/business/sessions", element: _jsx(ProtectedRoute, { allowedRoles: ['business'], children: _jsx(ActiveSessions, {}) }) }), _jsx(Route, { path: "/search", element: _jsx(ProtectedRoute, { allowedRoles: ['user', 'business'], children: _jsx(SearchAgencies, {}) }) }), _jsx(Route, { path: "/schedule", element: _jsx(ProtectedRoute, { allowedRoles: ['user', 'business'], children: _jsx(SchedulePickup, {}) }) }), _jsx(Route, { path: "/pickup-confirmation", element: _jsx(ProtectedRoute, { allowedRoles: ['user', 'business'], children: _jsx(PickupConfirmation, {}) }) }), _jsx(Route, { path: "/pickup-limit", element: _jsx(ProtectedRoute, { allowedRoles: ['user', 'business'], children: _jsx(PickupLimitReached, {}) }) }), _jsx(Route, { path: "/profile", element: _jsx(ProtectedRoute, { children: _jsx(ProfileRoute, {}) }) }), _jsx(Route, { path: "/notifications", element: _jsx(ProtectedRoute, { children: _jsx(NotificationsRoute, {}) }) }), _jsx(Route, { path: "/security", element: _jsx(ProtectedRoute, { children: _jsx(SecurityRoute, {}) }) }), _jsx(Route, { path: "/settings", element: _jsx(ProtectedRoute, { children: _jsx(SettingsRoute, {}) }) })] })] }) }) }));
};
export default App;
