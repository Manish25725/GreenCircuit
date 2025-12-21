import { Router } from 'express';
import { getSlots, getSlotIndicators, createSlot, updateSlot, deleteSlot, bookSlot } from '../controllers/slots.controller';
import { protect, authorize, optionalAuth } from '../middleware/auth.middleware';

const router = Router();

// Public/user routes
router.get('/', optionalAuth, getSlots);
router.get('/indicators', optionalAuth, getSlotIndicators);
router.post('/:id/book', protect, bookSlot);

// Agency/Admin routes
router.post('/', protect, authorize('agency', 'admin'), createSlot);
router.put('/:id', protect, authorize('agency', 'admin'), updateSlot);
router.delete('/:id', protect, authorize('agency', 'admin'), deleteSlot);

export default router;