import { Router } from 'express';
import { getAnalytics } from '../controllers/analytics.controller';
import { protect, authorize } from '../middleware/auth.middleware';
import { apiLimiter } from '../middleware/security.middleware';

const router = Router();

// Apply rate limiting and require authentication
router.get('/', apiLimiter, protect, authorize('admin', 'agency', 'business'), getAnalytics);

export default router;