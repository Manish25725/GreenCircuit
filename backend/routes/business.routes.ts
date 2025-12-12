import { Router } from 'express';
import {
  // Dashboard & Profile
  getBusinessDashboard,
  getBusinessProfile,
  createBusinessProfile,
  updateBusinessProfile,
  // Inventory
  getInventory,
  getInventoryItem,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  bulkUpdateInventoryStatus,
  markItemsForPickup,
  // Certificates
  getCertificates,
  getCertificate,
  downloadCertificate,
  // Analytics
  getBusinessAnalytics,
  exportReport,
  // Bookings
  scheduleBusinessPickup,
  getBusinessBookings
} from '../controllers/business.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication and business role
router.use(protect, authorize('business', 'admin'));

// ==========================================
// DASHBOARD & PROFILE ROUTES
// ==========================================
router.get('/dashboard', getBusinessDashboard);
router.get('/profile', getBusinessProfile);
router.post('/profile', createBusinessProfile);
router.put('/profile', updateBusinessProfile);

// ==========================================
// INVENTORY ROUTES
// ==========================================
router.get('/inventory', getInventory);
router.get('/inventory/:id', getInventoryItem);
router.post('/inventory', addInventoryItem);
router.put('/inventory/:id', updateInventoryItem);
router.delete('/inventory/:id', deleteInventoryItem);
router.post('/inventory/bulk-update', bulkUpdateInventoryStatus);
router.post('/inventory/mark-pickup', markItemsForPickup);

// ==========================================
// CERTIFICATE ROUTES
// ==========================================
router.get('/certificates', getCertificates);
router.get('/certificates/:id', getCertificate);
router.get('/certificates/:id/download', downloadCertificate);

// ==========================================
// ANALYTICS ROUTES
// ==========================================
router.get('/analytics', getBusinessAnalytics);
router.get('/reports/export', exportReport);

// ==========================================
// BOOKING ROUTES
// ==========================================
router.get('/bookings', getBusinessBookings);
router.post('/bookings', scheduleBusinessPickup);

export default router;
