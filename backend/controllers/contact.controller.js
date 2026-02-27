import Contact from '../models/Contact.js';
import { sendSuccess, sendError } from '../utils/response.js';
export const createContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        // Validate required fields
        if (!name || !email || !subject || !message) {
            return sendError(res, 'All fields are required', 400);
        }
        // Create contact message
        const contact = await Contact.create({
            name,
            email,
            subject,
            message,
            status: 'new'
        });
        sendSuccess(res, {
            message: 'Your message has been sent successfully! We will get back to you soon.',
            contact
        }, 201);
    }
    catch (error) {
        sendError(res, error.message || 'Failed to send message', 400);
    }
};
export const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        sendSuccess(res, contacts);
    }
    catch (error) {
        sendError(res, error.message || 'Failed to fetch contacts', 500);
    }
};
export const updateContactStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const contact = await Contact.findByIdAndUpdate(id, { status }, { new: true });
        if (!contact) {
            return sendError(res, 'Contact not found', 404);
        }
        sendSuccess(res, contact);
    }
    catch (error) {
        sendError(res, error.message || 'Failed to update contact status', 400);
    }
};
export const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findByIdAndDelete(id);
        if (!contact) {
            return sendError(res, 'Contact not found', 404);
        }
        sendSuccess(res, { message: 'Contact deleted successfully' });
    }
    catch (error) {
        sendError(res, error.message || 'Failed to delete contact', 500);
    }
};
