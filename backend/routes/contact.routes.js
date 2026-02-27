import express from 'express';
import { createContact, getAllContacts, updateContactStatus, deleteContact } from '../controllers/contact.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
const router = express.Router();
// Public route
router.post('/', createContact);
// Admin routes
router.get('/', protect, authorize('admin'), getAllContacts);
router.put('/:id', protect, authorize('admin'), updateContactStatus);
router.delete('/:id', protect, authorize('admin'), deleteContact);
export default router;
