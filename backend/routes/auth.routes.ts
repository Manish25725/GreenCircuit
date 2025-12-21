import { Router } from 'express';
import { 
  registerUser, 
  authUser, 
  getMe, 
  updateProfile,
  updateNotificationPreferences,
  updatePrivacySettings,
  updateAppSettings,
  changePassword,
  toggleTwoFactor,
  getPreferences,
  adminLogin
} from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import { authLimiter, strictLimiter } from '../middleware/security.middleware';

const router = Router();

// Authentication routes with rate limiting
router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, authUser);
router.post('/admin-login', strictLimiter, adminLogin);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

// Preferences routes
router.get('/preferences', protect, getPreferences);
router.put('/preferences/notifications', protect, updateNotificationPreferences);
router.put('/preferences/privacy', protect, updatePrivacySettings);
router.put('/preferences/app', protect, updateAppSettings);

// Security routes
router.put('/security/change-password', protect, changePassword);
router.put('/security/two-factor', protect, toggleTwoFactor);

export default router;