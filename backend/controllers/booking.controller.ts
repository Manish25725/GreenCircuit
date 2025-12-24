import { Request, Response } from 'express';
import Booking from '../models/Booking';
import Slot from '../models/Slot';
import User from '../models/User';
import Agency from '../models/Agency';
import Business from '../models/Business';
import BusinessCertificate from '../models/BusinessCertificate';
import Certificate from '../models/Certificate';
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

    // Create booking (points awarded only when completed, not at creation)
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
      ecoPointsEarned: 0, // Points awarded only when completed
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

    // Update user's total bookings (pickups counted when completed)
    await User.findByIdAndUpdate(userId, { 
      $inc: { 
        totalBookings: 1
        // Note: ecoPoints and totalPickups incremented only when status becomes 'completed'
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

    // If completed, award eco points and generate certificates
    if (status === 'completed' && booking.ecoPointsEarned === 0) {
      booking.completedAt = new Date();
      
      // Calculate total weight from items if not already set
      if (!booking.totalWeight || booking.totalWeight === 0) {
        const calculatedWeight = booking.items?.reduce((sum: number, item: any) => {
          const itemWeight = item.estimatedWeight || item.weight || (item.quantity * 2);
          return sum + itemWeight;
        }, 0) || 0;
        booking.totalWeight = calculatedWeight;
      }
      
      const totalWeight = booking.totalWeight || 0;
      // Formula: 5 points per 20kg = weight * 0.25, rounded to nearest integer
      const pointsEarned = Math.max(1, Math.round(totalWeight * 0.25)); // Minimum 1 point
      
      booking.ecoPointsEarned = pointsEarned;
      
      await User.findByIdAndUpdate(booking.userId, {
        $inc: { 
          ecoPoints: pointsEarned,
          totalPickups: 1, // Increment pickups only when completed
          totalWasteRecycled: totalWeight
        }
      });

      // Create notification
      await Notification.create({
        userId: booking.userId,
        type: 'reward',
        title: 'Points Earned!',
        message: `You earned ${pointsEarned} eco points for recycling ${totalWeight}kg of e-waste!`,
        icon: 'stars'
      });
      
      // Get user info for certificate generation
      const user = await User.findById(booking.userId);
      console.log('🎯 Booking completed for user:', user?.email, 'Role:', user?.role);
      
      // Check if this is a business user and generate BusinessCertificate
      let business = await Business.findOne({ userId: booking.userId });
      console.log('🏢 Business profile found:', business ? business.companyName : 'None');
      
      // If user has business role but no profile, create one automatically
      if (!business && user?.role === 'business') {
        console.log('✨ Creating business profile automatically for:', user.email);
        business = await Business.create({
          userId: booking.userId,
          companyName: user.name + "'s Business",
          email: user.email,
          phone: user.phone || '',
          industry: 'Technology',
          address: user.address || {
            street: '',
            city: '',
            state: '',
            country: 'India',
            zipCode: ''
          }
        });
        console.log('✅ Business profile created:', business.companyName, 'ID:', business._id);
      }
      
      if (business) {
        // Generate Business Compliance Certificate
        const items = booking.items?.map((item: any) => ({
          name: item.description || item.type || 'E-Waste Item',
          category: item.type || item.category || 'General',
          quantity: item.quantity || 1,
          weight: item.estimatedWeight || item.weight || 0
        })) || [];

        console.log('📜 Generating Compliance Certificate for business:', business.companyName);

        const certificate = await BusinessCertificate.create({
          businessId: business._id,
          bookingId: booking._id,
          agencyId: booking.agencyId,
          type: 'compliance',
          title: 'E-Waste Compliance Certificate',
          items,
          totalWeight: totalWeight,
          totalItems: items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0),
          co2Saved: totalWeight * 2.5, // kg of CO2 saved per kg of e-waste
          materialsRecovered: [
            { material: 'Metals', weight: totalWeight * 0.65 },
            { material: 'Plastics', weight: totalWeight * 0.20 },
            { material: 'Glass', weight: totalWeight * 0.10 },
            { material: 'Other Materials', weight: totalWeight * 0.05 }
          ],
          complianceStandards: [
            'EPA - E-Waste Management Guidelines',
            'ISO 14001 - Environmental Management',
            'R2 - Responsible Recycling',
            'e-Stewards Certification',
            'Ministry of Environment Guidelines'
          ],
          disposalMethod: 'Certified E-Waste Recycling - Environmentally Sound Management',
          issuedBy: {
            name: 'EcoCycle Platform',
            designation: 'Authorized E-Waste Recycling Partner'
          },
          status: 'issued',
          validUntil: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000), // 6 months validity
          issuedAt: new Date()
        });

        console.log('✅ Compliance Certificate created successfully!');
        console.log('   Certificate ID:', certificate.certificateId);
        console.log('   Business ID:', certificate.businessId);
        console.log('   Booking ID:', certificate.bookingId);

        // Create notification for business user
        await Notification.create({
          userId: booking.userId,
          type: 'certificate',
          title: 'Compliance Certificate Issued',
          message: `Your E-Waste Compliance Certificate (${certificate.certificateId}) has been issued for ${totalWeight}kg of recycled e-waste.`,
          icon: 'verified',
          metadata: {
            certificateId: certificate.certificateId,
            type: 'compliance'
          }
        });

        // Update business stats
        await Business.findByIdAndUpdate(business._id, {
          $inc: {
            totalWasteProcessed: totalWeight,
            co2Saved: totalWeight * 0.67
          }
        });
        
        console.log('✅ Certificate generation complete!');
      } else {
        // Generate regular user Certificate
        console.log('📄 Generating regular certificate for user:', user?.email);
        const itemsRecycled = booking.items?.map((item: any) => ({
          type: item.type || item.category || 'E-Waste',
          quantity: item.quantity || 1,
          weight: item.estimatedWeight || item.weight || 0
        })) || [];

        await Certificate.create({
          userId: booking.userId,
          bookingId: booking._id,
          agencyId: booking.agencyId,
          issueDate: new Date(),
          totalWeight: totalWeight,
          itemsRecycled,
          environmentalImpact: {
            co2Saved: totalWeight * 2.5,
            waterSaved: totalWeight * 100,
            energySaved: totalWeight * 10
          }
        });
        
        booking.certificateIssued = true;
        console.log('✅ Regular certificate generated!');
      }
    }

    await booking.save();
    sendSuccess(res, booking);
  } catch (error: any) {
    console.error('❌ Error in updateBookingStatus:', error);
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

    // Refund eco points if they were awarded (i.e., booking was completed then cancelled)
    if (booking.ecoPointsEarned > 0) {
      await User.findByIdAndUpdate(booking.userId, {
        $inc: { 
          ecoPoints: -booking.ecoPointsEarned,
          totalPickups: -1 // Decrement pickup count if it was completed
        }
      });
      booking.ecoPointsEarned = 0; // Reset points
    }

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
