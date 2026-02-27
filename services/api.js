// Configuration
// API URL is set via environment variables:
// - Development: VITE_API_URL in .env.development (defaults to localhost:3001)
// - Production: VITE_API_URL in .env.production (set to Render backend URL)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
// Set this to false to use real API calls to the backend server
// Set to true to use internal mock data (useful for frontend preview without running server)
const USE_MOCK_FALLBACK = false;
import { getCookie, setCookie, deleteCookie } from '../utils/cookies.js';
// --- MOCK DATA STORE (Fallback) ---
const MOCK_ANALYTICS = {
    kpi: [
        { icon: 'scale', title: 'Total E-Waste Collected', value: '1,250 kg', trend: '+15.2%', positive: true },
        { icon: 'book_online', title: 'Bookings this Month', value: '312', trend: '+8.5%', positive: true },
        { icon: 'smartphone', title: 'Top Performing Category', value: 'Smartphones', trend: '-2.1%', positive: false },
    ],
    charts: {
        trends: [
            { name: '1', value: 20 }, { name: '4', value: 25 }, { name: '7', value: 40 },
            { name: '10', value: 48 }, { name: '13', value: 60 }, { name: '16', value: 68 },
            { name: '19', value: 75 }, { name: '22', value: 90 }, { name: '25', value: 105 },
            { name: '28', value: 115 }
        ],
        breakdown: [
            { name: 'Smartphones', value: 35, color: '#34D399' },
            { name: 'Laptops', value: 25, color: '#3B82F6' },
            { name: 'Batteries', value: 15, color: '#A855F7' },
            { name: 'Appliances', value: 15, color: '#EC4899' },
            { name: 'Cables', value: 10, color: '#F97316' },
        ]
    },
    leaderboard: [
        { rank: 1, name: 'GreenLeaf Recyclers', waste: 450.5, bookings: 102, score: 95 },
        { rank: 2, name: 'EcoCycle Inc. (You)', waste: 312.0, bookings: 88, score: 82, active: true },
        { rank: 3, name: 'Re-Tech Solutions', waste: 280.2, bookings: 75, score: 76 },
    ]
};
const MOCK_SLOTS = [
    { id: 1, date: 4, startTime: '09:00 AM', endTime: '11:00 AM', status: 'Available', bookedBy: null },
    { id: '2', date: 4, startTime: '11:00 AM', endTime: '01:00 PM', status: 'Booked', bookedBy: 'John Doe' },
    { id: '3', date: 4, startTime: '02:00 PM', endTime: '04:00 PM', status: 'Available', bookedBy: null },
    { id: '4', date: 4, startTime: '04:00 PM', endTime: '06:00 PM', status: 'Unavailable', bookedBy: null },
    { id: '5', date: 1, startTime: '09:00 AM', endTime: '10:00 AM', status: 'Available', bookedBy: null },
    { id: '6', date: 3, startTime: '09:00 AM', endTime: '10:00 AM', status: 'Booked', bookedBy: 'Jane Smith' },
    { id: '10', date: 6, startTime: '09:00 AM', endTime: '10:00 AM', status: 'Available', bookedBy: null },
    { id: '11', date: 8, startTime: '09:00 AM', endTime: '10:00 AM', status: 'Booked', bookedBy: null },
    { id: '12', date: 10, startTime: '09:00 AM', endTime: '10:00 AM', status: 'Available', bookedBy: null },
    { id: '13', date: 11, startTime: '09:00 AM', endTime: '10:00 AM', status: 'Booked', bookedBy: null },
    { id: '14', date: 15, startTime: '09:00 AM', endTime: '10:00 AM', status: 'Available', bookedBy: null },
    { id: '15', date: 18, startTime: '09:00 AM', endTime: '10:00 AM', status: 'Booked', bookedBy: null },
    { id: '16', date: 22, startTime: '09:00 AM', endTime: '10:00 AM', status: 'Available', bookedBy: null },
    { id: '17', date: 25, startTime: '09:00 AM', endTime: '10:00 AM', status: 'Booked', bookedBy: null },
];
// --- HELPER FUNCTIONS ---
const getToken = () => {
    // Try to get token from cookie first, then fallback to localStorage
    return getCookie('token') || localStorage.getItem('token');
};
const saveToken = (token) => {
    // Save token to both cookie (with 7 days expiration) and localStorage
    setCookie('token', token, 7);
    localStorage.setItem('token', token);
};
const removeToken = () => {
    // Remove token from both cookie and localStorage
    deleteCookie('token');
    localStorage.removeItem('token');
};
const getHeaders = (includeAuth = true) => {
    const headers = {
        'Content-Type': 'application/json',
    };
    if (includeAuth) {
        const token = getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }
    return headers;
};
async function fetchWithFallback(endpoint, mockData, options) {
    if (USE_MOCK_FALLBACK) {
        return new Promise((resolve) => setTimeout(() => resolve(mockData), 600));
    }
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: getHeaders(),
        ...options,
    });
    if (!res.ok) {
        throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return data.data || data;
}
async function apiRequest(endpoint, options = {}) {
    const headers = {
        ...getHeaders(),
        ...(options.headers || {}),
    };
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || data.message || 'Request failed');
    }
    return data.data || data;
}
// --- API METHODS ---
export const api = {
    // Analytics
    getAnalytics: () => {
        if (USE_MOCK_FALLBACK) {
            return Promise.resolve(MOCK_ANALYTICS);
        }
        return apiRequest('/analytics');
    },
    // Slots
    getSlots: async (date, agencyId) => {
        if (USE_MOCK_FALLBACK) {
            let mock = MOCK_SLOTS;
            if (date) {
                mock = MOCK_SLOTS.filter(s => s.date === date);
            }
            return Promise.resolve(mock);
        }
        let url = '/slots';
        const params = new URLSearchParams();
        if (date)
            params.append('date', date.toString());
        if (agencyId)
            params.append('agencyId', agencyId);
        if (params.toString())
            url += `?${params.toString()}`;
        return apiRequest(url);
    },
    getSlotIndicators: async (agencyId) => {
        if (USE_MOCK_FALLBACK) {
            const indicators = MOCK_SLOTS.reduce((acc, slot) => {
                if (!acc[slot.date])
                    acc[slot.date] = { hasAvailable: false, hasBooked: false };
                if (slot.status === 'Available')
                    acc[slot.date].hasAvailable = true;
                if (slot.status === 'Booked')
                    acc[slot.date].hasBooked = true;
                return acc;
            }, {});
            return Promise.resolve(indicators);
        }
        const url = agencyId ? `/slots/indicators?agencyId=${agencyId}` : '/slots/indicators';
        return apiRequest(url);
    },
    createSlot: async (slotData) => {
        return apiRequest('/slots', {
            method: 'POST',
            body: JSON.stringify(slotData),
        });
    },
    addSlot: async (slotData) => {
        return apiRequest('/slots', {
            method: 'POST',
            body: JSON.stringify(slotData),
        });
    },
    updateSlot: async (id, slotData) => {
        return apiRequest(`/slots/${id}`, {
            method: 'PUT',
            body: JSON.stringify(slotData),
        });
    },
    deleteSlot: async (id) => {
        if (USE_MOCK_FALLBACK) {
            const index = MOCK_SLOTS.findIndex(s => s.id === id);
            if (index > -1)
                MOCK_SLOTS.splice(index, 1);
            return new Promise(resolve => setTimeout(resolve, 300));
        }
        return apiRequest(`/slots/${id}`, { method: 'DELETE' });
    },
    bookSlot: async (id) => {
        return apiRequest(`/slots/${id}/book`, { method: 'POST' });
    },
    // Auth
    login: async (email, password) => {
        const data = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        if (data.token) {
            saveToken(data.token);
            saveUser(data);
        }
        return data;
    },
    register: async (name, email, password, role) => {
        const data = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password, role }),
        });
        if (data.token) {
            saveToken(data.token);
            saveUser(data);
        }
        return data;
    },
    adminLogin: async (adminKey) => {
        const data = await apiRequest('/auth/admin-login', {
            method: 'POST',
            body: JSON.stringify({ adminKey }),
        });
        if (data.token) {
            saveToken(data.token);
            saveUser(data);
        }
        return data;
    },
    logout: () => {
        removeToken();
        clearUser();
    },
    // Validate current token - returns true if valid, false if invalid
    validateToken: async () => {
        const token = getToken();
        if (!token)
            return false;
        try {
            await apiRequest('/auth/me');
            return true;
        }
        catch (error) {
            // Token is invalid - clear it
            removeToken();
            clearUser();
            return false;
        }
    },
    getMe: async () => {
        const user = await apiRequest('/auth/me');
        // Update saved user data with fresh data from server
        if (user) {
            saveUser(user);
        }
        return user;
    },
    updateProfile: async (data) => {
        const user = await apiRequest('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        // Update saved user data after profile update
        if (user) {
            saveUser(user);
        }
        return user;
    },
    // Preferences
    getPreferences: async () => {
        return apiRequest('/auth/preferences');
    },
    updateNotificationPreferences: async (notifications) => {
        return apiRequest('/auth/preferences/notifications', {
            method: 'PUT',
            body: JSON.stringify({ notifications }),
        });
    },
    updatePrivacySettings: async (privacy) => {
        return apiRequest('/auth/preferences/privacy', {
            method: 'PUT',
            body: JSON.stringify({ privacy }),
        });
    },
    updateAppSettings: async (app) => {
        return apiRequest('/auth/preferences/app', {
            method: 'PUT',
            body: JSON.stringify({ app }),
        });
    },
    // Security
    changePassword: async (currentPassword, newPassword) => {
        return apiRequest('/auth/security/change-password', {
            method: 'PUT',
            body: JSON.stringify({ currentPassword, newPassword }),
        });
    },
    toggleTwoFactor: async (enabled) => {
        return apiRequest('/auth/security/two-factor', {
            method: 'PUT',
            body: JSON.stringify({ enabled }),
        });
    },
    // Agencies
    getAgencies: async (params) => {
        const searchParams = new URLSearchParams();
        if (params?.city)
            searchParams.append('city', params.city);
        if (params?.service)
            searchParams.append('service', params.service);
        if (params?.page)
            searchParams.append('page', params.page.toString());
        const url = `/agencies${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
        return fetchWithFallback(url, { agencies: [], pagination: {} });
    },
    getAgencyById: async (id) => {
        return fetchWithFallback(`/agencies/${id}`, {});
    },
    searchAgencies: async (location) => {
        return fetchWithFallback(`/agencies/search?location=${location}`, []);
    },
    // Bookings
    createBooking: async (bookingData) => {
        return apiRequest('/bookings', {
            method: 'POST',
            body: JSON.stringify(bookingData),
        });
    },
    getUserBookings: async (status) => {
        const url = status ? `/bookings?status=${status}` : '/bookings';
        return apiRequest(url);
    },
    getBookingById: async (id) => {
        return apiRequest(`/bookings/${id}`);
    },
    getActiveBooking: async () => {
        return apiRequest('/bookings/active');
    },
    cancelBooking: async (id) => {
        return apiRequest(`/bookings/${id}`, { method: 'DELETE' });
    },
    // Rewards
    getRewards: async (category) => {
        const url = category && category !== 'All Rewards' ? `/rewards?category=${category}` : '/rewards';
        return fetchWithFallback(url, { rewards: [], pagination: {} });
    },
    getPointsBalance: async () => {
        return apiRequest('/rewards/balance');
    },
    redeemReward: async (rewardId) => {
        return apiRequest('/rewards/redeem', {
            method: 'POST',
            body: JSON.stringify({ rewardId }),
        });
    },
    getRedemptionHistory: async () => {
        return apiRequest('/rewards/history');
    },
    // Certificates
    getUserCertificates: async () => {
        return apiRequest('/certificates');
    },
    getCertificateById: async (id) => {
        return apiRequest(`/certificates/${id}`);
    },
    verifyCertificate: async (code) => {
        return fetchWithFallback(`/certificates/verify/${code}`, null);
    },
    // Notifications
    getNotifications: async (unreadOnly = false) => {
        try {
            const url = unreadOnly ? '/notifications?unreadOnly=true' : '/notifications';
            return await apiRequest(url);
        }
        catch (error) {
            // Return empty array instead of throwing to prevent UI crashes
            return { notifications: [], unreadCount: 0, pagination: { page: 1, limit: 20, total: 0, pages: 0 } };
        }
    },
    markNotificationRead: async (id) => {
        try {
            return await apiRequest(`/notifications/${id}/read`, { method: 'PUT' });
        }
        catch (error) {
            return null;
        }
    },
    markAllNotificationsRead: async () => {
        try {
            return await apiRequest('/notifications/read-all', { method: 'PUT' });
        }
        catch (error) {
            return null;
        }
    },
    getUnreadCount: async () => {
        try {
            return await apiRequest('/notifications/unread-count');
        }
        catch (error) {
            return { count: 0 };
        }
    },
    // Admin
    getAdminDashboard: async () => {
        return apiRequest('/admin/dashboard');
    },
    getAdminUsers: async (params) => {
        const searchParams = new URLSearchParams();
        if (params?.role)
            searchParams.append('role', params.role);
        if (params?.search)
            searchParams.append('search', params.search);
        if (params?.page)
            searchParams.append('page', params.page.toString());
        return apiRequest(`/admin/users?${searchParams.toString()}`);
    },
    getPendingAgencies: async () => {
        return apiRequest('/admin/agencies/pending');
    },
    approveAgency: async (id) => {
        return apiRequest(`/admin/agencies/${id}/verify`, {
            method: 'PUT',
            body: JSON.stringify({ status: 'approved' }),
        });
    },
    rejectAgency: async (id, reason) => {
        return apiRequest(`/admin/agencies/${id}/verify`, {
            method: 'PUT',
            body: JSON.stringify({ status: 'rejected', reason }),
        });
    },
    getAdminReports: async (period = '30d') => {
        return apiRequest(`/admin/reports?period=${period}`);
    },
    // Business Dashboard
    getBusinessDashboard: async () => {
        return apiRequest('/business/dashboard');
    },
    getBusinessProfile: async () => {
        return apiRequest('/business/profile');
    },
    updateBusinessProfile: async (data) => {
        return apiRequest('/business/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },
    // Business Inventory
    getBusinessInventory: async (params) => {
        const searchParams = new URLSearchParams();
        if (params?.category)
            searchParams.append('category', params.category);
        if (params?.status)
            searchParams.append('status', params.status);
        if (params?.search)
            searchParams.append('search', params.search);
        if (params?.page)
            searchParams.append('page', params.page.toString());
        return apiRequest(`/business/inventory?${searchParams.toString()}`);
    },
    getBusinessInventoryItem: async (id) => {
        return apiRequest(`/business/inventory/${id}`);
    },
    addBusinessInventoryItem: async (data) => {
        return apiRequest('/business/inventory', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    updateBusinessInventoryItem: async (id, data) => {
        return apiRequest(`/business/inventory/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },
    deleteBusinessInventoryItem: async (id) => {
        return apiRequest(`/business/inventory/${id}`, { method: 'DELETE' });
    },
    bulkUpdateInventoryStatus: async (itemIds, status) => {
        return apiRequest('/business/inventory/bulk-update', {
            method: 'POST',
            body: JSON.stringify({ itemIds, status }),
        });
    },
    markItemsForPickup: async (itemIds) => {
        return apiRequest('/business/inventory/mark-pickup', {
            method: 'POST',
            body: JSON.stringify({ itemIds }),
        });
    },
    // Business Certificates
    getBusinessCertificates: async (params) => {
        const searchParams = new URLSearchParams();
        if (params?.status)
            searchParams.append('status', params.status);
        if (params?.search)
            searchParams.append('search', params.search);
        if (params?.page)
            searchParams.append('page', params.page.toString());
        if (params?.limit)
            searchParams.append('limit', params.limit.toString());
        return apiRequest(`/business/certificates?${searchParams.toString()}`);
    },
    getBusinessCertificate: async (id) => {
        return apiRequest(`/business/certificates/${id}`);
    },
    downloadBusinessCertificate: async (id) => {
        return apiRequest(`/business/certificates/${id}/download`);
    },
    // Business Analytics
    getBusinessAnalytics: async (period = '30d') => {
        return apiRequest(`/business/analytics?period=${period}`);
    },
    exportBusinessReport: async (format = 'pdf') => {
        return apiRequest(`/business/reports/export?format=${format}`);
    },
    // Business Bookings
    getBusinessBookings: async (status) => {
        const url = status ? `/business/bookings?status=${status}` : '/business/bookings';
        return apiRequest(url);
    },
    createBusinessBooking: async (data) => {
        return apiRequest('/business/bookings', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    // Agency Dashboard
    getAgencyDashboard: async () => {
        return apiRequest('/agencies/dashboard/me');
    },
    getAgencyBookings: async (status) => {
        const url = status ? `/agencies/bookings/me?status=${status}` : '/agencies/bookings/me';
        return apiRequest(url);
    },
    updateBookingStatus: async (bookingId, status, message) => {
        return apiRequest(`/bookings/${bookingId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status, message }),
        });
    },
    // Agency profile management
    getAgencyProfile: async () => {
        return apiRequest('/agencies/profile/me');
    },
    updateAgencyProfile: async (profileData) => {
        return apiRequest('/agencies/profile/me', {
            method: 'PUT',
            body: JSON.stringify(profileData),
        });
    },
    addCertification: async (certData) => {
        return apiRequest('/agencies/profile/certifications', {
            method: 'POST',
            body: JSON.stringify(certData),
        });
    },
    removeCertification: async (index) => {
        return apiRequest(`/agencies/profile/certifications/${index}`, {
            method: 'DELETE',
        });
    },
    updateOperatingHours: async (operatingHours) => {
        return apiRequest('/agencies/profile/operating-hours', {
            method: 'PUT',
            body: JSON.stringify({ operatingHours }),
        });
    },
    updateAgencyLogo: async (logoUrl) => {
        return apiRequest('/agencies/profile/logo', {
            method: 'PUT',
            body: JSON.stringify({ logo: logoUrl }),
        });
    },
    // Generic methods for admin and other custom endpoints
    get: async (endpoint, config) => {
        let url = endpoint;
        if (config?.params) {
            const params = new URLSearchParams(config.params);
            url += `?${params.toString()}`;
        }
        const data = await apiRequest(url);
        return { data };
    },
    post: async (endpoint, body) => {
        const data = await apiRequest(endpoint, {
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        });
        return { data };
    },
    put: async (endpoint, body) => {
        const data = await apiRequest(endpoint, {
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        });
        return { data };
    },
    delete: async (endpoint) => {
        const data = await apiRequest(endpoint, {
            method: 'DELETE',
        });
        return { data };
    },
};
// Export current user helper
export const getCurrentUser = () => {
    // Try to get user from cookie first, then fallback to localStorage
    const userCookie = getCookie('user');
    if (userCookie) {
        try {
            return JSON.parse(decodeURIComponent(userCookie));
        }
        catch (e) {
            // Silent fail
        }
    }
    const userStr = localStorage.getItem('user');
    if (!userStr || userStr === 'undefined' || userStr === 'null') {
        return null;
    }
    try {
        return JSON.parse(userStr);
    }
    catch (e) {
        return null;
    }
};
export const saveUser = (user) => {
    // Save user to both cookie and localStorage
    const userStr = JSON.stringify(user);
    setCookie('user', encodeURIComponent(userStr), 7);
    localStorage.setItem('user', userStr);
};
export const clearUser = () => {
    // Clear user from both cookie and localStorage
    deleteCookie('user');
    localStorage.removeItem('user');
};
export const isAuthenticated = () => {
    return !!getToken();
};
