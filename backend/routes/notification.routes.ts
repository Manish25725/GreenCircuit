import { Router } from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount
} from '../controllers/notification.controller';
import { protect } from '../middleware/auth.middleware';
import { apiLimiter } from '../middleware/security.middleware';

const router = Router();

// All notification routes with rate limiting
router.get('/', apiLimiter, protect, getNotifications);
router.get('/unread-count', apiLimiter, protect, getUnreadCount);
router.put('/:id/read', apiLimiter, protect, markAsRead);
router.put('/read-all', apiLimiter, protect, markAllAsRead);
router.delete('/:id', apiLimiter, protect, deleteNotification);

export default router;
