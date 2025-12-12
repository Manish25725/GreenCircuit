import { Request, Response } from 'express';
import Notification from '../models/Notification';
import { sendSuccess, sendError } from '../utils/response';

// Get user's notifications
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { unreadOnly, page = 1, limit = 20 } = req.query;

    const query: any = { userId };
    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ userId, isRead: false });

    sendSuccess(res, {
      notifications,
      unreadCount,
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

// Mark notification as read
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return sendError(res, 'Notification not found', 404);
    }

    sendSuccess(res, notification);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );

    sendSuccess(res, { message: 'All notifications marked as read' });
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Delete notification
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return sendError(res, 'Notification not found', 404);
    }

    sendSuccess(res, { message: 'Notification deleted' });
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Get unread count
export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const count = await Notification.countDocuments({ userId, isRead: false });

    sendSuccess(res, { unreadCount: count });
  } catch (error: any) {
    sendError(res, error.message);
  }
};
