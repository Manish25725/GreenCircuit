import { Router } from 'express';
import {
  getDashboardStats,
  getAllUsers,
  getPendingAgencies,
  updateAgencyVerification,
  getAllAgencies,
  getReports
} from '../controllers/admin.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

// All admin routes require admin role
router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/agencies', getAllAgencies);
router.get('/agencies/pending', getPendingAgencies);
router.put('/agencies/:id/verify', updateAgencyVerification);
router.get('/reports', getReports);

export default router;
