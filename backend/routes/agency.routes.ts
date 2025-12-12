import { Router } from 'express';
import {
  getAgencies,
  getAgencyById,
  createAgency,
  updateAgency,
  getAgencyDashboard,
  getAgencyBookings,
  searchAgencies
} from '../controllers/agency.controller';
import { protect, authorize, optionalAuth } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', optionalAuth, getAgencies);
router.get('/search', searchAgencies);
router.get('/:id', optionalAuth, getAgencyById);

// Protected agency routes
router.post('/', protect, createAgency);
router.put('/', protect, authorize('agency'), updateAgency);
router.get('/dashboard/me', protect, authorize('agency'), getAgencyDashboard);
router.get('/bookings/me', protect, authorize('agency'), getAgencyBookings);

export default router;
