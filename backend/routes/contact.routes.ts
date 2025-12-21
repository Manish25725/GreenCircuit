import express from 'express';
import { createContact, getAllContacts, updateContactStatus, deleteContact } from '../controllers/contact.controller';
import { protect, authorize } from '../middleware/auth.middleware';
import { strictLimiter, apiLimiter } from '../middleware/security.middleware';

const router = express.Router();

// Public route with strict rate limiting to prevent spam
router.post('/', strictLimiter, createContact);

// Admin routes with rate limiting
router.get('/', apiLimiter, protect, authorize('admin'), getAllContacts);
router.put('/:id', apiLimiter, protect, authorize('admin'), updateContactStatus);
router.delete('/:id', apiLimiter, protect, authorize('admin'), deleteContact);

export default router;
