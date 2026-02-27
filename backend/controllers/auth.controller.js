import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { sendSuccess, sendError } from '../utils/response.js';
import { deleteImageByUrl } from '../utils/cloudinary.js';
const generateToken = (id, role) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is not configured');
    }
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};
export const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        // Validate required fields
        if (!name || !email || !password) {
            return sendError(res, 'Please provide all required fields', 400);
        }
        // Normalize email to lowercase and trim
        const normalizedEmail = email.toLowerCase().trim();
        // Check if user already exists
        const userExists = await User.findOne({ email: normalizedEmail });
        if (userExists) {
            return sendError(res, 'An account with this email already exists. Please login or use a different email.', 400);
        }
        // Map frontend roles to backend roles
        const mappedRole = role === 'partner' ? 'agency' : role === 'resident' ? 'user' : role;
        const user = await User.create({
            name,
            email: normalizedEmail,
            password,
            role: mappedRole
        });
        if (user) {
            sendSuccess(res, {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                ecoPoints: user.ecoPoints,
                token: generateToken(user._id.toString(), user.role),
            }, 201);
        }
        else {
            sendError(res, 'Invalid user data', 400);
        }
    }
    catch (error) {
        sendError(res, error.message);
    }
};
export const authUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Validate required fields
        if (!email || !password) {
            return sendError(res, 'Please provide email and password', 400);
        }
        // Normalize email to lowercase and trim
        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail }).select('+password');
        if (user && (await user.matchPassword(password))) {
            sendSuccess(res, {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                ecoPoints: user.ecoPoints,
                totalWasteRecycled: user.totalWasteRecycled,
                totalPickups: user.totalPickups,
                token: generateToken(user._id.toString(), user.role),
            });
        }
        else {
            sendError(res, 'Invalid email or password', 401);
        }
    }
    catch (error) {
        sendError(res, error.message);
    }
};
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return sendError(res, 'User not found', 404);
        }
        sendSuccess(res, user);
    }
    catch (error) {
        sendError(res, error.message);
    }
};
export const updateProfile = async (req, res) => {
    try {
        const { name, phone, address, city, state, zipCode, country, avatar, sustainabilityGoals } = req.body;
        // Get current user to check for existing avatar
        const currentUser = await User.findById(req.user.id);
        if (!currentUser) {
            return sendError(res, 'User not found', 404);
        }
        // If updating avatar and user has an old avatar, delete the old one from Cloudinary
        if (avatar && currentUser.avatar && currentUser.avatar !== avatar) {
            if (currentUser.avatar.includes('cloudinary.com')) {
                await deleteImageByUrl(currentUser.avatar);
            }
        }
        // Handle address - can accept flat fields or nested object
        let addressData = address;
        if (city || state || zipCode || country) {
            addressData = {
                street: address || '',
                city: city || '',
                state: state || '',
                zipCode: zipCode || '',
                country: country || 'India'
            };
        }
        const updateData = { name, phone, avatar };
        if (addressData)
            updateData.address = addressData;
        if (sustainabilityGoals !== undefined)
            updateData.sustainabilityGoals = sustainabilityGoals;
        const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true, runValidators: true });
        if (!user) {
            return sendError(res, 'User not found', 404);
        }
        sendSuccess(res, user);
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Update notification preferences
export const updateNotificationPreferences = async (req, res) => {
    try {
        const { notifications } = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, { 'preferences.notifications': notifications }, { new: true, runValidators: true });
        if (!user) {
            return sendError(res, 'User not found', 404);
        }
        sendSuccess(res, { preferences: user.preferences });
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Update privacy settings
export const updatePrivacySettings = async (req, res) => {
    try {
        const { privacy } = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, { 'preferences.privacy': privacy }, { new: true, runValidators: true });
        if (!user) {
            return sendError(res, 'User not found', 404);
        }
        sendSuccess(res, { preferences: user.preferences });
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Update app settings
export const updateAppSettings = async (req, res) => {
    try {
        const { app } = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, { 'preferences.app': app }, { new: true, runValidators: true });
        if (!user) {
            return sendError(res, 'User not found', 404);
        }
        sendSuccess(res, { preferences: user.preferences });
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Change password
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return sendError(res, 'Please provide current and new password', 400);
        }
        if (newPassword.length < 6) {
            return sendError(res, 'New password must be at least 6 characters', 400);
        }
        const user = await User.findById(req.user.id).select('+password');
        if (!user) {
            return sendError(res, 'User not found', 404);
        }
        // Verify current password
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return sendError(res, 'Current password is incorrect', 401);
        }
        // Update password
        user.password = newPassword;
        await user.save();
        sendSuccess(res, { message: 'Password updated successfully' });
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Enable/Disable Two-Factor Authentication
export const toggleTwoFactor = async (req, res) => {
    try {
        const { enabled } = req.body;
        const updateData = { twoFactorEnabled: enabled };
        // If disabling, clear the secret
        if (!enabled) {
            updateData.twoFactorSecret = undefined;
        }
        const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true, runValidators: true });
        if (!user) {
            return sendError(res, 'User not found', 404);
        }
        sendSuccess(res, {
            twoFactorEnabled: user.twoFactorEnabled,
            message: enabled ? 'Two-factor authentication enabled' : 'Two-factor authentication disabled'
        });
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Get user preferences
export const getPreferences = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return sendError(res, 'User not found', 404);
        }
        sendSuccess(res, { preferences: user.preferences || {} });
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Admin login with key
export const adminLogin = async (req, res) => {
    const { adminKey } = req.body;
    try {
        // Validate admin key against environment variable
        if (adminKey !== process.env.ADMIN_KEY) {
            return sendError(res, 'Invalid admin key', 401);
        }
        // Find or create admin user
        let adminUser = await User.findOne({ role: 'admin', email: 'admin@ecocycle.com' });
        if (!adminUser) {
            // Create default admin user if doesn't exist
            adminUser = await User.create({
                name: 'Administrator',
                email: 'admin@ecocycle.com',
                password: adminKey, // Use admin key as password
                role: 'admin'
            });
        }
        sendSuccess(res, {
            _id: adminUser._id,
            name: adminUser.name,
            email: adminUser.email,
            role: adminUser.role,
            token: generateToken(adminUser._id.toString(), adminUser.role),
        });
    }
    catch (error) {
        sendError(res, error.message);
    }
};
