import { Router } from 'express';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification, getUnreadCount } from '../controllers/notification.controller.js';
import { protect } from '../middleware/auth.middleware.js';
const router = Router();
// All notification routes
router.get('/', protect, getNotifications);
router.get('/unread-count', protect, getUnreadCount);
router.put('/:id/read', protect, markAsRead);
router.put('/read-all', protect, markAllAsRead);
router.delete('/:id', protect, deleteNotification);
export default router;
