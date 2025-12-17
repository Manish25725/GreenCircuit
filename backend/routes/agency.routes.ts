import { Router } from 'express';
import {
  getAgencies,
  getAgencyById,
  createAgency,
  updateAgency,
  getAgencyDashboard,
  getAgencyBookings,
  searchAgencies,
  updateBookingStatus,
  getAgencyAnalytics,
  getAgencyPublicProfile,
  submitVerificationRequest,
  getAgencyVettingRequests,
  getAgencyProfile,
  updateAgencyProfile,
  addCertification,
  removeCertification,
  updateOperatingHours,
  updateAgencyLogo
} from '../controllers/agency.controller';
import { protect, authorize, optionalAuth } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', optionalAuth, getAgencies);
router.get('/search', searchAgencies);
router.get('/public/:id', getAgencyPublicProfile);
router.get('/:id', optionalAuth, getAgencyById);

// Protected agency routes
router.post('/', protect, createAgency);
router.put('/', protect, authorize('agency'), updateAgency);
router.get('/dashboard/me', protect, authorize('agency'), getAgencyDashboard);
router.get('/bookings/me', protect, authorize('agency'), getAgencyBookings);
router.put('/bookings/:bookingId/status', protect, authorize('agency'), updateBookingStatus);
router.get('/analytics/me', protect, authorize('agency'), getAgencyAnalytics);

// Profile management routes
router.get('/profile/me', protect, authorize('agency'), getAgencyProfile);
router.put('/profile/me', protect, authorize('agency'), updateAgencyProfile);
router.post('/profile/certifications', protect, authorize('agency'), addCertification);
router.delete('/profile/certifications/:index', protect, authorize('agency'), removeCertification);
router.put('/profile/operating-hours', protect, authorize('agency'), updateOperatingHours);
router.put('/profile/logo', protect, authorize('agency'), updateAgencyLogo);

// Vetting requests
router.post('/vetting', protect, authorize('agency'), submitVerificationRequest);
router.get('/vetting/me', protect, authorize('agency'), getAgencyVettingRequests);

export default router;
