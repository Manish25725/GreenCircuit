import express from 'express';
import { createContact, getAllContacts, updateContactStatus, deleteContact } from '../controllers/contact.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// Public route - anyone can submit contact form
router.post('/', createContact);

// Admin routes - protected
router.get('/', protect, authorize('admin'), getAllContacts);
router.put('/:id', protect, authorize('admin'), updateContactStatus);
router.delete('/:id', protect, authorize('admin'), deleteContact);

export default router;
