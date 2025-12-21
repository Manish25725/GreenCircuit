import { Router } from 'express';
import {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getActiveBooking
} from '../controllers/booking.controller';
import { protect, authorize } from '../middleware/auth.middleware';
import { apiLimiter, strictLimiter } from '../middleware/security.middleware';

const router = Router();

// User routes with rate limiting
router.post('/', strictLimiter, protect, createBooking); // Strict limit on booking creation
router.get('/', apiLimiter, protect, getUserBookings);
router.get('/active', apiLimiter, protect, getActiveBooking);
router.get('/:id', apiLimiter, protect, getBookingById);
router.delete('/:id', apiLimiter, protect, cancelBooking);

// Agency routes
router.put('/:id/status', apiLimiter, protect, authorize('agency', 'admin'), updateBookingStatus);

export default router;
