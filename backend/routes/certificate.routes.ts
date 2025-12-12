import { Router } from 'express';
import {
  generateCertificate,
  getUserCertificates,
  getCertificateById,
  verifyCertificate
} from '../controllers/certificate.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

// Public verification
router.get('/verify/:code', verifyCertificate);

// User routes
router.get('/', protect, getUserCertificates);
router.get('/:id', protect, getCertificateById);

// Generate certificate (agency/admin)
router.post('/generate', protect, authorize('agency', 'admin'), generateCertificate);

export default router;
