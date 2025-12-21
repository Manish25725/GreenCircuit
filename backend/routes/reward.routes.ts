import { Router } from 'express';
import {
  getRewards,
  redeemReward,
  getRedemptionHistory,
  getPointsBalance,
  createReward,
  updateReward
} from '../controllers/reward.controller';
import { protect, authorize } from '../middleware/auth.middleware';
import { apiLimiter, strictLimiter } from '../middleware/security.middleware';

const router = Router();

// Public/User routes with rate limiting
router.get('/', apiLimiter, getRewards);
router.get('/balance', apiLimiter, protect, getPointsBalance);
router.get('/history', apiLimiter, protect, getRedemptionHistory);
router.post('/redeem', strictLimiter, protect, redeemReward); // Strict limit on redemption

// Admin routes with rate limiting
router.post('/', apiLimiter, protect, authorize('admin'), createReward);
router.put('/:id', apiLimiter, protect, authorize('admin'), updateReward);

export default router;
