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

const router = Router();

// User routes
router.post('/', protect, createBooking);
router.get('/', protect, getUserBookings);
router.get('/active', protect, getActiveBooking);
router.get('/:id', protect, getBookingById);
router.delete('/:id', protect, cancelBooking);

// Agency routes
router.put('/:id/status', protect, authorize('agency', 'admin'), updateBookingStatus);

export default router;
