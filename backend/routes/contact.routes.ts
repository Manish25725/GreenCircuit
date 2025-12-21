import express from 'express';
import { createContact, getAllContacts, updateContactStatus, deleteContact } from '../controllers/contact.controller';
import { auth, adminOnly } from '../middleware/auth.middleware';

const router = express.Router();

// Public route - anyone can submit contact form
router.post('/', createContact);

// Admin routes - protected
router.get('/', auth, adminOnly, getAllContacts);
router.put('/:id', auth, adminOnly, updateContactStatus);
router.delete('/:id', auth, adminOnly, deleteContact);

export default router;
