import { Router } from 'express';
import {
  generateCertificate,
  getUserCertificates,
  getCertificateById,
  verifyCertificate
} from '../controllers/certificate.controller';
import { protect, authorize } from '../middleware/auth.middleware';
import { apiLimiter, strictLimiter } from '../middleware/security.middleware';

const router = Router();

// Public verification with rate limiting
router.get('/verify/:code', apiLimiter, verifyCertificate);

// User routes with rate limiting
router.get('/', apiLimiter, protect, getUserCertificates);
router.get('/:id', apiLimiter, protect, getCertificateById);

// Generate certificate (agency/admin) with strict rate limiting
router.post('/generate', strictLimiter, protect, authorize('agency', 'admin'), generateCertificate);

export default router;
