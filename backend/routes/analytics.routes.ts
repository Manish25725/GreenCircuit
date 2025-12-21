import { Router } from 'express';
import { getAnalytics } from '../controllers/analytics.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

// Require authentication
router.get('/', protect, authorize('admin', 'agency', 'business'), getAnalytics);

export default router;