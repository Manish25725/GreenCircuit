// Configuration
// API URL is set via environment variables:
// - Development: VITE_API_URL in .env.development (defaults to localhost:3001)
// - Production: VITE_API_URL in .env.production (set to Render backend URL)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Set this to false to use real API calls to the backend server
// Set to true to use internal mock data (useful for frontend preview without running server)
const USE_MOCK_FALLBACK = false; 

import { getCookie, setCookie, deleteCookie } from '../utils/cookies';

// Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'agency' | 'business' | 'admin';
  avatar?: string;
  logo?: string;
  companyName?: string;
  phone?: string;
  address?: string | {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  ecoPoints: number;
  totalWasteRecycled: number;
  totalPickups: number;
  token?: string;
}

export interface Slot {
  id: string;
  _id?: string;
  date: number;
  startTime: string;
  endTime: string;
  status: 'Available' | 'Booked' | 'Unavailable';
  bookedBy?: string | null;
  agencyId?: string;
}

export interface Agency {
  _id: string;
  name: string;
  description?: string;
  logo?: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  services: string[];
  rating: number;
  totalBookings: number;
  isVerified: boolean;
}

export interface Booking {
  _id: string;
  bookingId: string;
  userId: string;
  agencyId: Agency | string;
  slotId: string;
  items: {
    type: string;
    quantity: number;
    description: string;
    weight?: number;
  }[];
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  scheduledTime: string;
  pickupAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  ecoPointsEarned: number;
  trackingHistory: {
    status: string;
    message: string;
    timestamp: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string;
}

export interface Reward {
  _id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  pointsCost: number;
  stock: number;
  isActive: boolean;
}

export interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  icon?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AnalyticsData {
  kpi: any[];
  charts: {
    trends: any[];
    breakdown: any[];
  };
  leaderboard: any[];
}

// --- MOCK DATA STORE (Fallback) ---
const MOCK_ANALYTICS: AnalyticsData = {
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

const MOCK_SLOTS: Slot[] = [
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

const saveToken = (token: string) => {
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
  const headers: Record<string, string> = {
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

async function fetchWithFallback<T>(endpoint: string, mockData: T, options?: RequestInit): Promise<T> {
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

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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
    return apiRequest<AnalyticsData>('/analytics');
  },

  // Slots
  getSlots: async (date?: number, agencyId?: string) => {
    if (USE_MOCK_FALLBACK) {
      let mock = MOCK_SLOTS;
      if (date) {
        mock = MOCK_SLOTS.filter(s => s.date === date);
      }
      return Promise.resolve(mock);
    }
    
    let url = '/slots';
    const params = new URLSearchParams();
    if (date) params.append('date', date.toString());
    if (agencyId) params.append('agencyId', agencyId);
    if (params.toString()) url += `?${params.toString()}`;
    return apiRequest<Slot[]>(url);
  },

  getSlotIndicators: async (agencyId?: string) => {
    if (USE_MOCK_FALLBACK) {
      const indicators = MOCK_SLOTS.reduce((acc: any, slot) => {
        if (!acc[slot.date]) acc[slot.date] = { hasAvailable: false, hasBooked: false };
        if (slot.status === 'Available') acc[slot.date].hasAvailable = true;
        if (slot.status === 'Booked') acc[slot.date].hasBooked = true;
        return acc;
      }, {});
      return Promise.resolve(indicators);
    }
    
    const url = agencyId ? `/slots/indicators?agencyId=${agencyId}` : '/slots/indicators';
    return apiRequest(url);
  },

  createSlot: async (slotData: Partial<Slot>) => {
    return apiRequest<Slot>('/slots', {
      method: 'POST',
      body: JSON.stringify(slotData),
    });
  },

  addSlot: async (slotData: Partial<Slot>) => {
    return apiRequest<Slot>('/slots', {
      method: 'POST',
      body: JSON.stringify(slotData),
    });
  },

  updateSlot: async (id: string, slotData: Partial<Slot>) => {
    return apiRequest<Slot>(`/slots/${id}`, {
      method: 'PUT',
      body: JSON.stringify(slotData),
    });
  },

  deleteSlot: async (id: string) => {
    if (USE_MOCK_FALLBACK) {
      const index = MOCK_SLOTS.findIndex(s => s.id === id);
      if (index > -1) MOCK_SLOTS.splice(index, 1);
      return new Promise(resolve => setTimeout(resolve, 300));
    }
    return apiRequest(`/slots/${id}`, { method: 'DELETE' });
  },

  bookSlot: async (id: string) => {
    return apiRequest<Slot>(`/slots/${id}/book`, { method: 'POST' });
  },

  // Auth
  login: async (email: string, password: string): Promise<User> => {
    const data = await apiRequest<User>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      saveToken(data.token);
      saveUser(data);
    }
    return data;
  },

  register: async (name: string, email: string, password: string, role: string): Promise<User> => {
    const data = await apiRequest<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
    if (data.token) {
      saveToken(data.token);
      saveUser(data);
    }
    return data;
  },

  adminLogin: async (adminKey: string): Promise<any> => {
    const data = await apiRequest<any>('/auth/admin-login', {
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
  validateToken: async (): Promise<boolean> => {
    const token = getToken();
    if (!token) return false;
    
    try {
      await apiRequest<User>('/auth/me');
      return true;
    } catch (error) {
      // Token is invalid - clear it
      removeToken();
      clearUser();
      return false;
    }
  },

  getMe: async (): Promise<User> => {
    const user = await apiRequest<User>('/auth/me');
    // Update saved user data with fresh data from server
    if (user) {
      saveUser(user);
    }
    return user;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const user = await apiRequest<User>('/auth/profile', {
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

  updateNotificationPreferences: async (notifications: any) => {
    return apiRequest('/auth/preferences/notifications', {
      method: 'PUT',
      body: JSON.stringify({ notifications }),
    });
  },

  updatePrivacySettings: async (privacy: any) => {
    return apiRequest('/auth/preferences/privacy', {
      method: 'PUT',
      body: JSON.stringify({ privacy }),
    });
  },

  updateAppSettings: async (app: any) => {
    return apiRequest('/auth/preferences/app', {
      method: 'PUT',
      body: JSON.stringify({ app }),
    });
  },

  // Security
  changePassword: async (currentPassword: string, newPassword: string) => {
    return apiRequest('/auth/security/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  toggleTwoFactor: async (enabled: boolean) => {
    return apiRequest('/auth/security/two-factor', {
      method: 'PUT',
      body: JSON.stringify({ enabled }),
    });
  },

  // Agencies
  getAgencies: async (params?: { city?: string; service?: string; page?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.city) searchParams.append('city', params.city);
    if (params?.service) searchParams.append('service', params.service);
    if (params?.page) searchParams.append('page', params.page.toString());
    const url = `/agencies${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return fetchWithFallback(url, { agencies: [], pagination: {} });
  },

  getAgencyById: async (id: string): Promise<Agency> => {
    return fetchWithFallback<Agency>(`/agencies/${id}`, {} as Agency);
  },

  searchAgencies: async (location: string) => {
    return fetchWithFallback(`/agencies/search?location=${location}`, []);
  },

  // Bookings
  createBooking: async (bookingData: any): Promise<Booking> => {
    return apiRequest<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  getUserBookings: async (status?: string) => {
    const url = status ? `/bookings?status=${status}` : '/bookings';
    return apiRequest(url);
  },

  getBookingById: async (id: string): Promise<Booking> => {
    return apiRequest<Booking>(`/bookings/${id}`);
  },

  getActiveBooking: async (): Promise<Booking | null> => {
    return apiRequest<Booking | null>('/bookings/active');
  },

  cancelBooking: async (id: string): Promise<Booking> => {
    return apiRequest<Booking>(`/bookings/${id}`, { method: 'DELETE' });
  },

  // Rewards
  getRewards: async (category?: string) => {
    const url = category && category !== 'All Rewards' ? `/rewards?category=${category}` : '/rewards';
    return fetchWithFallback(url, { rewards: [], pagination: {} });
  },

  getPointsBalance: async () => {
    return apiRequest('/rewards/balance');
  },

  redeemReward: async (rewardId: string) => {
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

  getCertificateById: async (id: string) => {
    return apiRequest(`/certificates/${id}`);
  },

  verifyCertificate: async (code: string) => {
    return fetchWithFallback(`/certificates/verify/${code}`, null);
  },

  // Notifications
  getNotifications: async (unreadOnly = false) => {
    try {
      const url = unreadOnly ? '/notifications?unreadOnly=true' : '/notifications';
      return await apiRequest(url);
    } catch (error: any) {
      // Return empty array instead of throwing to prevent UI crashes
      return { notifications: [], unreadCount: 0, pagination: { page: 1, limit: 20, total: 0, pages: 0 } };
    }
  },

  markNotificationRead: async (id: string) => {
    try {
      return await apiRequest(`/notifications/${id}/read`, { method: 'PUT' });
    } catch (error: any) {
      return null;
    }
  },

  markAllNotificationsRead: async () => {
    try {
      return await apiRequest('/notifications/read-all', { method: 'PUT' });
    } catch (error: any) {
      return null;
    }
  },

  getUnreadCount: async () => {
    try {
      return await apiRequest('/notifications/unread-count');
    } catch (error: any) {
      return { count: 0 };
    }
  },

  // Admin
  getAdminDashboard: async () => {
    return apiRequest('/admin/dashboard');
  },

  getAdminUsers: async (params?: { role?: string; search?: string; page?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.role) searchParams.append('role', params.role);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.page) searchParams.append('page', params.page.toString());
    return apiRequest(`/admin/users?${searchParams.toString()}`);
  },

  getPendingAgencies: async () => {
    return apiRequest('/admin/agencies/pending');
  },

  approveAgency: async (id: string) => {
    return apiRequest(`/admin/agencies/${id}/verify`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'approved' }),
    });
  },

  rejectAgency: async (id: string, reason: string) => {
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

  updateBusinessProfile: async (data: any) => {
    return apiRequest('/business/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Business Inventory
  getBusinessInventory: async (params?: { category?: string; status?: string; search?: string; page?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.page) searchParams.append('page', params.page.toString());
    return apiRequest(`/business/inventory?${searchParams.toString()}`);
  },

  getBusinessInventoryItem: async (id: string) => {
    return apiRequest(`/business/inventory/${id}`);
  },

  addBusinessInventoryItem: async (data: any) => {
    return apiRequest('/business/inventory', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateBusinessInventoryItem: async (id: string, data: any) => {
    return apiRequest(`/business/inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteBusinessInventoryItem: async (id: string) => {
    return apiRequest(`/business/inventory/${id}`, { method: 'DELETE' });
  },

  bulkUpdateInventoryStatus: async (itemIds: string[], status: string) => {
    return apiRequest('/business/inventory/bulk-update', {
      method: 'POST',
      body: JSON.stringify({ itemIds, status }),
    });
  },

  markItemsForPickup: async (itemIds: string[]) => {
    return apiRequest('/business/inventory/mark-pickup', {
      method: 'POST',
      body: JSON.stringify({ itemIds }),
    });
  },

  // Business Certificates
  getBusinessCertificates: async (params?: { status?: string; search?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    return apiRequest(`/business/certificates?${searchParams.toString()}`);
  },

  getBusinessCertificate: async (id: string) => {
    return apiRequest(`/business/certificates/${id}`);
  },

  downloadBusinessCertificate: async (id: string) => {
    return apiRequest(`/business/certificates/${id}/download`);
  },

  // Business Analytics
  getBusinessAnalytics: async (period = '30d') => {
    return apiRequest(`/business/analytics?period=${period}`);
  },

  exportBusinessReport: async (format: 'pdf' | 'csv' = 'pdf') => {
    return apiRequest(`/business/reports/export?format=${format}`);
  },

  // Business Bookings
  getBusinessBookings: async (status?: string) => {
    const url = status ? `/business/bookings?status=${status}` : '/business/bookings';
    return apiRequest(url);
  },

  createBusinessBooking: async (data: any) => {
    return apiRequest('/business/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Agency Dashboard
  getAgencyDashboard: async () => {
    return apiRequest('/agencies/dashboard/me');
  },

  getAgencyBookings: async (status?: string) => {
    const url = status ? `/agencies/bookings/me?status=${status}` : '/agencies/bookings/me';
    return apiRequest(url);
  },

  updateBookingStatus: async (bookingId: string, status: string, message?: string) => {
    return apiRequest(`/bookings/${bookingId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, message }),
    });
  },

  // Agency profile management
  getAgencyProfile: async () => {
    return apiRequest('/agencies/profile/me');
  },

  updateAgencyProfile: async (profileData: any) => {
    return apiRequest('/agencies/profile/me', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  addCertification: async (certData: { name: string; type: string; icon?: string; color?: string }) => {
    return apiRequest('/agencies/profile/certifications', {
      method: 'POST',
      body: JSON.stringify(certData),
    });
  },

  removeCertification: async (index: number) => {
    return apiRequest(`/agencies/profile/certifications/${index}`, {
      method: 'DELETE',
    });
  },

  updateOperatingHours: async (operatingHours: any[]) => {
    return apiRequest('/agencies/profile/operating-hours', {
      method: 'PUT',
      body: JSON.stringify({ operatingHours }),
    });
  },

  updateAgencyLogo: async (logoUrl: string) => {
    return apiRequest('/agencies/profile/logo', {
      method: 'PUT',
      body: JSON.stringify({ logo: logoUrl }),
    });
  },

  // Generic methods for admin and other custom endpoints
  get: async <T = any>(endpoint: string, config?: { params?: any }): Promise<{ data: T }> => {
    let url = endpoint;
    if (config?.params) {
      const params = new URLSearchParams(config.params);
      url += `?${params.toString()}`;
    }
    const data = await apiRequest<any>(url);
    return { data };
  },

  post: async <T = any>(endpoint: string, body?: any): Promise<{ data: T }> => {
    const data = await apiRequest<any>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
    return { data };
  },

  put: async <T = any>(endpoint: string, body?: any): Promise<{ data: T }> => {
    const data = await apiRequest<any>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
    return { data };
  },

  delete: async <T = any>(endpoint: string): Promise<{ data: T }> => {
    const data = await apiRequest<any>(endpoint, {
      method: 'DELETE',
    });
    return { data };
  },
};

// Export current user helper
export const getCurrentUser = (): User | null => {
  // Try to get user from cookie first, then fallback to localStorage
  const userCookie = getCookie('user');
  if (userCookie) {
    try {
      return JSON.parse(decodeURIComponent(userCookie));
    } catch (e) {
      // Silent fail
    }
  }
  
  const userStr = localStorage.getItem('user');
  if (!userStr || userStr === 'undefined' || userStr === 'null') {
    return null;
  }
  
  try {
    return JSON.parse(userStr);
  } catch (e) {
    return null;
  }
};

export const saveUser = (user: User) => {
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

export const isAuthenticated = (): boolean => {
  return !!getToken();
};