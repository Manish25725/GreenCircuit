import { Request, Response } from 'express';
import Agency from '../models/Agency';
import User from '../models/User';
import Booking from '../models/Booking';
import { sendSuccess, sendError } from '../utils/response';

// Get all agencies (with filters)
export const getAgencies = async (req: Request, res: Response) => {
  try {
    const { 
      city, 
      service, 
      rating, 
      verified,
      page = 1, 
      limit = 10,
      sort = 'rating'
    } = req.query;

    const query: any = { isVerified: true };
    
    if (city) query['address.city'] = new RegExp(city as string, 'i');
    if (service) query.services = service;
    if (rating) query.rating = { $gte: Number(rating) };
    if (verified !== undefined) query.isVerified = verified === 'true';

    const sortOptions: any = {};
    if (sort === 'rating') sortOptions.rating = -1;
    else if (sort === 'distance') sortOptions.createdAt = -1; // Placeholder
    else if (sort === 'bookings') sortOptions.totalBookings = -1;

    const agencies = await Agency.find(query)
      .sort(sortOptions)
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

// Get agency by ID
export const getAgencyById = async (req: Request, res: Response) => {
  try {
    const agency = await Agency.findById(req.params.id)
      .populate('userId', 'name email');

    if (!agency) {
      return sendError(res, 'Agency not found', 404);
    }

    sendSuccess(res, agency);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Create agency profile (for agency users)
export const createAgency = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { name, description, email, phone, address, services } = req.body;

    // Check if agency already exists for this user
    const existingAgency = await Agency.findOne({ userId });
    if (existingAgency) {
      return sendError(res, 'Agency profile already exists', 400);
    }

    const agency = await Agency.create({
      userId,
      name,
      description,
      email,
      phone,
      address,
      services,
      verificationStatus: 'pending'
    });

    // Update user role to agency
    await User.findByIdAndUpdate(userId, { role: 'agency' });

    sendSuccess(res, agency, 201);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Update agency profile
export const updateAgency = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const updates = req.body;

    const agency = await Agency.findOneAndUpdate(
      { userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!agency) {
      return sendError(res, 'Agency not found', 404);
    }

    sendSuccess(res, agency);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Get agency dashboard data
export const getAgencyDashboard = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const agency = await Agency.findOne({ userId });

    if (!agency) {
      return sendError(res, 'Agency not found', 404);
    }

    // Get booking stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      todayBookings,
      weekBookings,
      pendingBookings,
      completedBookings
    ] = await Promise.all([
      Booking.countDocuments({ agencyId: agency._id, createdAt: { $gte: today } }),
      Booking.countDocuments({ agencyId: agency._id, createdAt: { $gte: weekAgo } }),
      Booking.countDocuments({ agencyId: agency._id, status: 'pending' }),
      Booking.countDocuments({ agencyId: agency._id, status: 'completed' })
    ]);

    // Recent bookings
    const recentBookings = await Booking.find({ agencyId: agency._id })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(5);

    sendSuccess(res, {
      agency,
      stats: {
        todayBookings,
        weekBookings,
        pendingBookings,
        completedBookings,
        totalBookings: agency.totalBookings,
        totalWasteCollected: agency.totalWasteCollected,
        earnings: agency.earnings,
        rating: agency.rating
      },
      recentBookings
    });
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Get agency bookings
export const getAgencyBookings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { status, page = 1, limit = 10 } = req.query;

    const agency = await Agency.findOne({ userId });
    if (!agency) {
      return sendError(res, 'Agency not found', 404);
    }

    const query: any = { agencyId: agency._id };
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .populate('userId', 'name email phone avatar')
      .sort({ scheduledDate: 1, createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Booking.countDocuments(query);

    sendSuccess(res, {
      bookings,
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

// Search agencies by location
export const searchAgencies = async (req: Request, res: Response) => {
  try {
    const { location, lat, lng, radius = 10 } = req.query;

    let query: any = { isVerified: true };

    if (location) {
      query['address.city'] = new RegExp(location as string, 'i');
    }

    // If coordinates provided, use geo query (requires 2dsphere index)
    // For now, simple text search
    const agencies = await Agency.find(query)
      .select('name logo rating address services totalBookings')
      .sort({ rating: -1 })
      .limit(20);

    sendSuccess(res, agencies);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Update booking status (for agency)
export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { bookingId } = req.params;
    const { status, notes } = req.body;

    const agency = await Agency.findOne({ userId });
    if (!agency) {
      return sendError(res, 'Agency not found', 404);
    }

    const booking = await Booking.findOne({ _id: bookingId, agencyId: agency._id });
    if (!booking) {
      return sendError(res, 'Booking not found', 404);
    }

    const validTransitions: Record<string, string[]> = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['in-progress', 'cancelled'],
      'in-progress': ['completed', 'cancelled']
    };

    if (!validTransitions[booking.status]?.includes(status)) {
      return sendError(res, `Cannot transition from ${booking.status} to ${status}`, 400);
    }

    booking.status = status;
    if (notes) booking.notes = notes;
    
    if (status === 'completed') {
      booking.completedAt = new Date();
      
      // Update agency stats
      await Agency.findByIdAndUpdate(agency._id, {
        $inc: {
          totalBookings: 1,
          totalWasteCollected: booking.totalWeight || 0
        }
      });

      // Update user stats
      await User.findByIdAndUpdate(booking.userId, {
        $inc: {
          totalPickups: 1,
          totalWasteRecycled: booking.totalWeight || 0,
          ecoPoints: Math.floor((booking.totalWeight || 0) * 10)
        }
      });
    }

    await booking.save();

    sendSuccess(res, booking);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Get agency analytics
export const getAgencyAnalytics = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { period = '30d' } = req.query;

    const agency = await Agency.findOne({ userId });
    if (!agency) {
      return sendError(res, 'Agency not found', 404);
    }

    let startDate = new Date();
    if (period === '7d') startDate.setDate(startDate.getDate() - 7);
    else if (period === '30d') startDate.setDate(startDate.getDate() - 30);
    else if (period === '90d') startDate.setDate(startDate.getDate() - 90);

    // Booking trends
    const bookingTrends = await Booking.aggregate([
      {
        $match: {
          agencyId: agency._id,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          totalWeight: { $sum: '$totalWeight' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Waste by category
    const wasteByCategory = await Booking.aggregate([
      {
        $match: {
          agencyId: agency._id,
          status: 'completed',
          createdAt: { $gte: startDate }
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.category',
          totalWeight: { $sum: '$items.weight' },
          count: { $sum: '$items.quantity' }
        }
      },
      { $sort: { totalWeight: -1 } }
    ]);

    // Status distribution
    const statusDistribution = await Booking.aggregate([
      { $match: { agencyId: agency._id, createdAt: { $gte: startDate } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Performance metrics
    const completedBookings = await Booking.find({
      agencyId: agency._id,
      status: 'completed',
      createdAt: { $gte: startDate }
    });

    const totalWeight = completedBookings.reduce((sum, b) => sum + (b.totalWeight || 0), 0);
    const avgWeight = completedBookings.length > 0 ? totalWeight / completedBookings.length : 0;

    sendSuccess(res, {
      overview: {
        totalBookings: completedBookings.length,
        totalWeight,
        avgWeightPerBooking: avgWeight,
        rating: agency.rating,
        totalEarnings: agency.earnings
      },
      bookingTrends,
      wasteByCategory,
      statusDistribution,
      period
    });
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Get agency profile for public view
export const getAgencyPublicProfile = async (req: Request, res: Response) => {
  try {
    const agency = await Agency.findById(req.params.id)
      .select('name description logo coverImage rating totalReviews services address operatingHours totalBookings');

    if (!agency || !agency.isVerified) {
      return sendError(res, 'Agency not found', 404);
    }

    sendSuccess(res, agency);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Submit verification request
export const submitVerificationRequest = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { type, title, description, documents, requestData } = req.body;

    const agency = await Agency.findOne({ userId });
    if (!agency) {
      return sendError(res, 'Agency not found', 404);
    }

    // Import VettingRequest here to avoid circular dependencies
    const VettingRequest = require('../models/VettingRequest').default;

    const request = await VettingRequest.create({
      agencyId: agency._id,
      type,
      title,
      description,
      documents,
      requestData,
      verificationChecklist: [
        { item: 'Business Registration Verified', status: 'pending' },
        { item: 'Environmental Permits Valid', status: 'pending' },
        { item: 'Insurance Coverage Confirmed', status: 'pending' },
        { item: 'Equipment Standards Met', status: 'pending' }
      ]
    });

    sendSuccess(res, request, 201);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Get agency's vetting requests
export const getAgencyVettingRequests = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const agency = await Agency.findOne({ userId });
    if (!agency) {
      return sendError(res, 'Agency not found', 404);
    }

    const VettingRequest = require('../models/VettingRequest').default;

    const requests = await VettingRequest.find({ agencyId: agency._id })
      .sort({ submittedAt: -1 });

    sendSuccess(res, requests);
  } catch (error: any) {
    sendError(res, error.message);
  }
};
