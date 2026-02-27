import { Router } from 'express';
import { getRewards, redeemReward, getRedemptionHistory, getPointsBalance, createReward, updateReward } from '../controllers/reward.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
const router = Router();
// Public/User routes
router.get('/', getRewards);
router.get('/balance', protect, getPointsBalance);
router.get('/history', protect, getRedemptionHistory);
router.post('/redeem', protect, redeemReward);
// Admin routes
router.post('/', protect, authorize('admin'), createReward);
router.put('/:id', protect, authorize('admin'), updateReward);
export default router;
