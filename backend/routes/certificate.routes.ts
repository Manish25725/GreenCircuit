import { Router } from 'express';
import {
  generateCertificate,
  getUserCertificates,
  getCertificateById,
  verifyCertificate,
  downloadCertificate
} from '../controllers/certificate.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

// Public verification
router.get('/verify/:code', verifyCertificate);

// User routes
router.get('/', protect, getUserCertificates);
router.get('/:id', protect, getCertificateById);
router.get('/:id/download', protect, downloadCertificate);

// Generate certificate (agency/admin)
router.post('/generate', protect, authorize('agency', 'admin'), generateCertificate);

export default router;
