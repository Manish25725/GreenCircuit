import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import { sendSuccess, sendError } from '../utils/response';
import { deleteImageByUrl } from '../utils/cloudinary';

const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email: email.toLowerCase() });

    if (userExists) {
      return sendError(res, 'User already exists', 400);
    }

    // Map frontend roles to backend roles
    const mappedRole = role === 'partner' ? 'agency' : role === 'resident' ? 'user' : role;

    const user = await User.create({ 
      name, 
      email: email.toLowerCase(), 
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
    } else {
      sendError(res, 'Invalid user data', 400);
    }
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const authUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user: any = await User.findOne({ email: email.toLowerCase() }).select('+password');

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
    } else {
      sendError(res, 'Invalid email or password', 401);
    }
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).user.id);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }
    sendSuccess(res, user);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { name, phone, address, avatar } = req.body;
    
    // Get current user to check for existing avatar
    const currentUser = await User.findById((req as any).user.id);
    if (!currentUser) {
      return sendError(res, 'User not found', 404);
    }

    // If updating avatar and user has an old avatar, delete the old one from Cloudinary
    if (avatar && currentUser.avatar && currentUser.avatar !== avatar) {
      console.log('Attempting to delete old avatar:', currentUser.avatar);
      if (currentUser.avatar.includes('cloudinary.com')) {
        const deleted = await deleteImageByUrl(currentUser.avatar);
        if (deleted) {
          console.log('✓ Successfully deleted old avatar from Cloudinary');
        } else {
          console.log('✗ Failed to delete old avatar from Cloudinary');
        }
      }
    }

    const user = await User.findByIdAndUpdate(
      (req as any).user.id,
      { name, phone, address, avatar },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return sendError(res, 'User not found', 404);
    }
    sendSuccess(res, user);
  } catch (error: any) {
    console.error('Error in updateProfile:', error);
    sendError(res, error.message);
  }
};

// Update notification preferences
export const updateNotificationPreferences = async (req: Request, res: Response) => {
  try {
    const { notifications } = req.body;
    const user = await User.findByIdAndUpdate(
      (req as any).user.id,
      { 'preferences.notifications': notifications },
      { new: true, runValidators: true }
    );
    if (!user) {
      return sendError(res, 'User not found', 404);
    }
    sendSuccess(res, { preferences: user.preferences });
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Update privacy settings
export const updatePrivacySettings = async (req: Request, res: Response) => {
  try {
    const { privacy } = req.body;
    const user = await User.findByIdAndUpdate(
      (req as any).user.id,
      { 'preferences.privacy': privacy },
      { new: true, runValidators: true }
    );
    if (!user) {
      return sendError(res, 'User not found', 404);
    }
    sendSuccess(res, { preferences: user.preferences });
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Update app settings
export const updateAppSettings = async (req: Request, res: Response) => {
  try {
    const { app } = req.body;
    const user = await User.findByIdAndUpdate(
      (req as any).user.id,
      { 'preferences.app': app },
      { new: true, runValidators: true }
    );
    if (!user) {
      return sendError(res, 'User not found', 404);
    }
    sendSuccess(res, { preferences: user.preferences });
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Change password
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return sendError(res, 'Please provide current and new password', 400);
    }

    if (newPassword.length < 6) {
      return sendError(res, 'New password must be at least 6 characters', 400);
    }

    const user: any = await User.findById((req as any).user.id).select('+password');
    
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
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Enable/Disable Two-Factor Authentication
export const toggleTwoFactor = async (req: Request, res: Response) => {
  try {
    const { enabled } = req.body;
    
    const updateData: any = { twoFactorEnabled: enabled };
    
    // If disabling, clear the secret
    if (!enabled) {
      updateData.twoFactorSecret = undefined;
    }

    const user = await User.findByIdAndUpdate(
      (req as any).user.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    sendSuccess(res, { 
      twoFactorEnabled: user.twoFactorEnabled,
      message: enabled ? 'Two-factor authentication enabled' : 'Two-factor authentication disabled'
    });
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Get user preferences
export const getPreferences = async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).user.id);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }
    sendSuccess(res, { preferences: user.preferences || {} });
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Admin login with key
export const adminLogin = async (req: Request, res: Response) => {
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
  } catch (error: any) {
    sendError(res, error.message);
  }
};