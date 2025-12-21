import { Router } from 'express';
import { getSlots, getSlotIndicators, createSlot, updateSlot, deleteSlot, bookSlot } from '../controllers/slots.controller';
import { protect, authorize, optionalAuth } from '../middleware/auth.middleware';
import { apiLimiter, strictLimiter } from '../middleware/security.middleware';

const router = Router();

// Public/user routes with rate limiting
router.get('/', apiLimiter, optionalAuth, getSlots);
router.get('/indicators', apiLimiter, optionalAuth, getSlotIndicators);
router.post('/:id/book', strictLimiter, protect, bookSlot); // Strict limit on bookings

// Agency/Admin routes with rate limiting
router.post('/', apiLimiter, protect, authorize('agency', 'admin'), createSlot);
router.put('/:id', apiLimiter, protect, authorize('agency', 'admin'), updateSlot);
router.delete('/:id', apiLimiter, protect, authorize('agency', 'admin'), deleteSlot);

export default router;