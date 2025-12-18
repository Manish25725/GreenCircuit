import { Router } from 'express';
import {
  // Dashboard
  getDashboardStats,
  // Users
  getAllUsers,
  getUserById,
  updateUser,
  suspendUser,
  reactivateUser,
  deleteUser,
  // Agencies
  getAllAgencies,
  getAgencyForVerification,
  getPendingAgencies,
  updateAgencyVerification,
  getAgencyDetails,
  suspendAgency,
  reactivateAgency,
  approvePartnerRegistration,
  rejectPartnerRegistration,
  // Vetting
  getVettingRequests,
  getVettingRequest,
  updateVettingRequest,
  assignVettingRequest,
  updateChecklistItem,
  // Reports & Analytics
  getReports,
  getPlatformAnalytics,
  exportPlatformReport,
  // System
  getSystemHealth,
  sendSystemNotification
} from '../controllers/admin.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

// All admin routes require admin role
router.use(protect, authorize('admin'));

// ==========================================
// DASHBOARD
// ==========================================
router.get('/dashboard', getDashboardStats);

// ==========================================
// USER MANAGEMENT
// ==========================================
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.post('/users/:id/suspend', suspendUser);
router.post('/users/:id/reactivate', reactivateUser);
router.delete('/users/:id', deleteUser);

// ==========================================
// AGENCY MANAGEMENT
// ==========================================
router.get('/agencies', getAllAgencies);
router.get('/agencies/pending', getPendingAgencies);
router.get('/agencies/:id', getAgencyDetails);
router.get('/agencies/:id/verify', getAgencyForVerification);
router.put('/agencies/:id/verify', updateAgencyVerification);
router.post('/agencies/:id/approve', approvePartnerRegistration);
router.post('/agencies/:id/reject', rejectPartnerRegistration);
router.post('/agencies/:id/suspend', suspendAgency);
router.post('/agencies/:id/reactivate', reactivateAgency);

// ==========================================
// VETTING / VERIFICATION
// ==========================================
router.get('/vetting', getVettingRequests);
router.get('/vetting/:id', getVettingRequest);
router.put('/vetting/:id', updateVettingRequest);
router.post('/vetting/:id/assign', assignVettingRequest);
router.put('/vetting/:id/checklist', updateChecklistItem);

// ==========================================
// REPORTS & ANALYTICS
// ==========================================
router.get('/reports', getReports);
router.get('/analytics', getPlatformAnalytics);
router.get('/reports/export', exportPlatformReport);

// ==========================================
// SYSTEM
// ==========================================
router.get('/system/health', getSystemHealth);
router.post('/system/notification', sendSystemNotification);

export default router;
