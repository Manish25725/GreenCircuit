import { Router } from 'express';
import { getSlots, getSlotIndicators, createSlot, updateSlot, deleteSlot, bookSlot } from '../controllers/slots.controller';
import { protect, authorize, optionalAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', optionalAuth, getSlots);
router.get('/indicators', optionalAuth, getSlotIndicators);
router.post('/', protect, authorize('agency', 'admin'), createSlot);
router.put('/:id', protect, authorize('agency', 'admin'), updateSlot);
router.delete('/:id', protect, authorize('agency', 'admin'), deleteSlot);
router.post('/:id/book', protect, bookSlot);

export default router;