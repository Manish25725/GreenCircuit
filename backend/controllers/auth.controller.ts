import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import { sendSuccess, sendError } from '../utils/response';

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
    sendError(res, error.message);
  }
};