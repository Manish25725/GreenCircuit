import { Request, Response } from 'express';
import Reward from '../models/Reward';
import Redemption from '../models/Redemption';
import User from '../models/User';
import Notification from '../models/Notification';
import { sendSuccess, sendError } from '../utils/response';

// Get all rewards
export const getRewards = async (req: Request, res: Response) => {
  try {
    const { category, page = 1, limit = 12 } = req.query;

    const query: any = { isActive: true };
    if (category && category !== 'All Rewards') {
      query.category = category;
    }

    const rewards = await Reward.find(query)
      .sort({ pointsCost: 1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Reward.countDocuments(query);

    sendSuccess(res, {
      rewards,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Redeem a reward
export const redeemReward = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { rewardId } = req.body;

    const [user, reward] = await Promise.all([
      User.findById(userId),
      Reward.findById(rewardId)
    ]);

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    if (!reward) {
      return sendError(res, 'Reward not found', 404);
    }

    if (!reward.isActive) {
      return sendError(res, 'This reward is no longer available', 400);
    }

    if (reward.stock !== -1 && reward.stock <= 0) {
      return sendError(res, 'This reward is out of stock', 400);
    }

    if (user.ecoPoints < reward.pointsCost) {
      return sendError(res, 'Insufficient eco points', 400);
    }

    // Deduct points
    user.ecoPoints -= reward.pointsCost;
    await user.save();

    // Update reward stock and redemption count
    if (reward.stock !== -1) {
      reward.stock -= 1;
    }
    reward.redemptionCount += 1;
    await reward.save();

    // Create redemption record
    const redemption = await Redemption.create({
      userId,
      rewardId,
      pointsSpent: reward.pointsCost,
      status: 'completed',
      redemptionCode: Math.random().toString(36).substring(2, 10).toUpperCase()
    });

    // Create notification
    await Notification.create({
      userId,
      type: 'reward',
      title: 'Reward Redeemed!',
      message: `You successfully redeemed "${reward.title}" for ${reward.pointsCost} points.`,
      icon: 'redeem'
    });

    sendSuccess(res, {
      redemption,
      newBalance: user.ecoPoints
    });
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Get user's redemption history
export const getRedemptionHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { page = 1, limit = 10 } = req.query;

    const redemptions = await Redemption.find({ userId })
      .populate('rewardId', 'title icon color pointsCost')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Redemption.countDocuments({ userId });

    sendSuccess(res, {
      redemptions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Get user's eco points balance
export const getPointsBalance = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user = await User.findById(userId).select('ecoPoints totalWasteRecycled totalPickups');

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    sendSuccess(res, {
      ecoPoints: user.ecoPoints,
      totalWasteRecycled: user.totalWasteRecycled,
      totalPickups: user.totalPickups
    });
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Admin: Create a new reward
export const createReward = async (req: Request, res: Response) => {
  try {
    const { title, description, icon, color, category, pointsCost, stock } = req.body;

    const reward = await Reward.create({
      title,
      description,
      icon,
      color,
      category,
      pointsCost,
      stock: stock || -1
    });

    sendSuccess(res, reward, 201);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Admin: Update reward
export const updateReward = async (req: Request, res: Response) => {
  try {
    const reward = await Reward.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!reward) {
      return sendError(res, 'Reward not found', 404);
    }

    sendSuccess(res, reward);
  } catch (error: any) {
    sendError(res, error.message);
  }
};
