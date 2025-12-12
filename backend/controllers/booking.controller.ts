import { Request, Response } from 'express';
import Booking from '../models/Booking';
import Slot from '../models/Slot';
import User from '../models/User';
import Agency from '../models/Agency';
import Notification from '../models/Notification';
import { sendSuccess, sendError } from '../utils/response';

// Create a new booking
export const createBooking = async (req: Request, res: Response) => {
  try {
    const { agencyId, slotId, items, scheduledDate, scheduledTime, pickupAddress, notes } = req.body;
    const userId = (req as any).user.id;

    // Check if user already has 1 active booking
    const activeBookingsCount = await Booking.countDocuments({
      userId,
      status: { $in: ['pending', 'confirmed', 'in-progress'] }
    });

    if (activeBookingsCount >= 1) {
      return sendError(res, 'You can only have 1 active pickup request at a time. Please wait for your current pickup to be completed.', 400);
    }

    // Validate required fields
    if (!agencyId || !items || items.length === 0) {
      return sendError(res, 'Agency and items are required', 400);
    }

    // Check if agency exists
    const agency = await Agency.findById(agencyId);
    if (!agency) {
      return sendError(res, 'Agency not found', 404);
    }

    // Try to find and validate slot (optional - allow booking without slot)
    let validSlotId = null;
    if (slotId && slotId.length === 24) { // Check if it's a valid MongoDB ObjectId format
      const slot = await Slot.findById(slotId);
      if (slot && slot.status === 'Available') {
        validSlotId = slotId;
        // Update slot status
        await Slot.findByIdAndUpdate(slotId, {
          status: 'Booked',
          bookedBy: userId
        });
      }
    }

    // Generate booking ID
    const bookingCount = await Booking.countDocuments();
    const bookingId = `ECO-${String(bookingCount + 1).padStart(6, '0')}`;

    // Create booking
    const ecoPoints = items.reduce((acc: number, item: any) => acc + (item.quantity * 10), 0);
    const booking = await Booking.create({
      userId,
      agencyId,
      slotId: validSlotId,
      bookingId,
      items,
      scheduledDate: new Date(scheduledDate || Date.now()),
      scheduledTime: scheduledTime || 'TBD',
      pickupAddress: {
        street: pickupAddress?.street || 'Not provided',
        city: pickupAddress?.city || 'Not provided',
        state: pickupAddress?.state || 'Not provided',
        zipCode: pickupAddress?.zipCode || '000000'
      },
      notes: notes || '',
      status: 'pending',
      ecoPointsEarned: ecoPoints,
      trackingHistory: [{
        status: 'pending',
        message: 'Booking request placed',
        timestamp: new Date()
      }]
    });

    // Update slot with booking ID if we have a valid slot
    if (validSlotId) {
      await Slot.findByIdAndUpdate(validSlotId, { bookingId: booking._id });
    }

    // Update user's total pickups and eco points
    await User.findByIdAndUpdate(userId, { 
      $inc: { 
        totalPickups: 1,
        totalBookings: 1,
        ecoPoints: ecoPoints
      } 
    });

    // Create notification
    await Notification.create({
      userId,
      type: 'booking',
      title: 'Booking Confirmed',
      message: `Your booking ${bookingId} has been placed successfully.`,
      icon: 'check_circle'
    });

    // Populate agency info before returning
    const populatedBooking = await Booking.findById(booking._id)
      .populate('agencyId', 'name logo rating');

    sendSuccess(res, populatedBooking, 201);
  } catch (error: any) {
    console.error('Booking creation error:', error);
    sendError(res, error.message);
  }
};

// Get user's bookings
export const getUserBookings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { status, page = 1, limit = 10 } = req.query;

    const query: any = { userId };
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .populate('agencyId', 'name logo rating')
      .sort({ createdAt: -1 })
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

// Get booking by ID
export const getBookingById = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('agencyId', 'name logo rating phone email address')
      .populate('userId', 'name email phone');

    if (!booking) {
      return sendError(res, 'Booking not found', 404);
    }

    sendSuccess(res, booking);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Update booking status (for agency)
export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { status, message } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return sendError(res, 'Booking not found', 404);
    }

    booking.status = status;
    booking.trackingHistory.push({
      status,
      message: message || `Status updated to ${status}`,
      timestamp: new Date()
    });

    // If completed, award eco points
    if (status === 'completed') {
      const totalItems = booking.items.reduce((acc, item) => acc + item.quantity, 0);
      const pointsEarned = totalItems * 50; // 50 points per item
      
      booking.ecoPointsEarned = pointsEarned;
      
      await User.findByIdAndUpdate(booking.userId, {
        $inc: { ecoPoints: pointsEarned }
      });

      // Create notification
      await Notification.create({
        userId: booking.userId,
        type: 'reward',
        title: 'Points Earned!',
        message: `You earned ${pointsEarned} eco points for your recycling pickup!`,
        icon: 'stars'
      });
    }

    await booking.save();
    sendSuccess(res, booking);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Cancel booking
export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return sendError(res, 'Booking not found', 404);
    }

    if (booking.status === 'completed') {
      return sendError(res, 'Cannot cancel a completed booking', 400);
    }

    booking.status = 'cancelled';
    booking.trackingHistory.push({
      status: 'cancelled',
      message: 'Booking cancelled by user',
      timestamp: new Date()
    });

    // Release the slot
    await Slot.findByIdAndUpdate(booking.slotId, {
      status: 'Available',
      bookedBy: null,
      bookingId: null
    });

    await booking.save();
    sendSuccess(res, booking);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Get active booking for tracking
export const getActiveBooking = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    const booking = await Booking.findOne({
      userId,
      status: { $in: ['pending', 'confirmed', 'in-progress'] }
    })
    .populate('agencyId', 'name logo rating phone')
    .sort({ createdAt: -1 });

    sendSuccess(res, booking);
  } catch (error: any) {
    sendError(res, error.message);
  }
};
