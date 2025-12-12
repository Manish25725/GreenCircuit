import { Request, Response } from 'express';
import User from '../models/User';
import Agency from '../models/Agency';
import Booking from '../models/Booking';
import { sendSuccess, sendError } from '../utils/response';

// Get admin dashboard stats
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      totalAgencies,
      pendingAgencies,
      totalBookings,
      monthBookings,
      completedBookings
    ] = await Promise.all([
      User.countDocuments({ role: { $ne: 'admin' } }),
      Agency.countDocuments({ isVerified: true }),
      Agency.countDocuments({ verificationStatus: 'pending' }),
      Booking.countDocuments(),
      Booking.countDocuments({ createdAt: { $gte: monthAgo } }),
      Booking.countDocuments({ status: 'completed' })
    ]);

    // Calculate total waste collected
    const wasteStats = await Booking.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, totalWeight: { $sum: '$totalWeight' } } }
    ]);

    sendSuccess(res, {
      users: {
        total: totalUsers,
        growth: '+12.5%' // Placeholder
      },
      agencies: {
        total: totalAgencies,
        pending: pendingAgencies
      },
      bookings: {
        total: totalBookings,
        thisMonth: monthBookings,
        completed: completedBookings
      },
      waste: {
        total: wasteStats[0]?.totalWeight || 0,
        unit: 'kg'
      }
    });
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Get all users (admin)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { role, page = 1, limit = 20, search } = req.query;

    const query: any = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: new RegExp(search as string, 'i') },
        { email: new RegExp(search as string, 'i') }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    sendSuccess(res, {
      users,
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

// Get pending agency verifications
export const getPendingAgencies = async (req: Request, res: Response) => {
  try {
    const agencies = await Agency.find({ verificationStatus: 'pending' })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    sendSuccess(res, agencies);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Approve/Reject agency
export const updateAgencyVerification = async (req: Request, res: Response) => {
  try {
    const { status, reason } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return sendError(res, 'Invalid status', 400);
    }

    const agency = await Agency.findByIdAndUpdate(
      req.params.id,
      { 
        verificationStatus: status,
        isVerified: status === 'approved'
      },
      { new: true }
    );

    if (!agency) {
      return sendError(res, 'Agency not found', 404);
    }

    // Update user verification status
    await User.findByIdAndUpdate(agency.userId, {
      isVerified: status === 'approved'
    });

    sendSuccess(res, agency);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Get all agencies (admin)
export const getAllAgencies = async (req: Request, res: Response) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query: any = {};
    if (status) query.verificationStatus = status;

    const agencies = await Agency.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Agency.countDocuments(query);

    sendSuccess(res, {
      agencies,
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

// Get platform reports
export const getReports = async (req: Request, res: Response) => {
  try {
    const { period = '30d' } = req.query;
    
    let startDate = new Date();
    if (period === '7d') startDate.setDate(startDate.getDate() - 7);
    else if (period === '30d') startDate.setDate(startDate.getDate() - 30);
    else if (period === '90d') startDate.setDate(startDate.getDate() - 90);

    // Bookings by status
    const bookingsByStatus = await Booking.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Daily bookings trend
    const dailyBookings = await Booking.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Top agencies
    const topAgencies = await Agency.find({ isVerified: true })
      .sort({ totalBookings: -1 })
      .limit(5)
      .select('name totalBookings totalWasteCollected rating');

    sendSuccess(res, {
      bookingsByStatus,
      dailyBookings,
      topAgencies
    });
  } catch (error: any) {
    sendError(res, error.message);
  }
};
