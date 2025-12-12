import { Request, Response } from 'express';
import Certificate from '../models/Certificate';
import Booking from '../models/Booking';
import User from '../models/User';
import { sendSuccess, sendError } from '../utils/response';

// Generate certificate for a completed booking
export const generateCertificate = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return sendError(res, 'Booking not found', 404);
    }

    if (booking.status !== 'completed') {
      return sendError(res, 'Certificate can only be generated for completed bookings', 400);
    }

    if (booking.certificateIssued) {
      const existingCert = await Certificate.findOne({ bookingId });
      return sendSuccess(res, existingCert);
    }

    // Calculate environmental impact (simplified)
    const totalWeight = booking.totalWeight || booking.items.reduce((acc, item) => acc + (item.estimatedWeight || item.quantity * 2), 0);
    
    const certificate = await Certificate.create({
      userId: booking.userId,
      bookingId: booking._id,
      agencyId: booking.agencyId,
      totalWeight,
      itemsRecycled: booking.items.map(item => ({
        type: item.type,
        quantity: item.quantity,
        weight: item.estimatedWeight || item.quantity * 2
      })),
      environmentalImpact: {
        co2Saved: totalWeight * 2.5, // kg of CO2 saved
        waterSaved: totalWeight * 100, // liters
        energySaved: totalWeight * 10 // kWh
      }
    });

    // Update booking
    booking.certificateIssued = true;
    booking.certificateId = certificate.certificateId;
    await booking.save();

    sendSuccess(res, certificate, 201);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Get user's certificates
export const getUserCertificates = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { page = 1, limit = 10 } = req.query;

    const certificates = await Certificate.find({ userId })
      .populate('agencyId', 'name logo')
      .populate('bookingId', 'bookingId scheduledDate')
      .sort({ issueDate: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Certificate.countDocuments({ userId });

    // Calculate totals
    const totals = await Certificate.aggregate([
      { $match: { userId: (req as any).user._id } },
      {
        $group: {
          _id: null,
          totalWeight: { $sum: '$totalWeight' },
          totalCo2Saved: { $sum: '$environmentalImpact.co2Saved' },
          totalWaterSaved: { $sum: '$environmentalImpact.waterSaved' },
          totalEnergySaved: { $sum: '$environmentalImpact.energySaved' }
        }
      }
    ]);

    sendSuccess(res, {
      certificates,
      totals: totals[0] || {
        totalWeight: 0,
        totalCo2Saved: 0,
        totalWaterSaved: 0,
        totalEnergySaved: 0
      },
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

// Get certificate by ID
export const getCertificateById = async (req: Request, res: Response) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('agencyId', 'name logo address')
      .populate('bookingId', 'bookingId scheduledDate items');

    if (!certificate) {
      return sendError(res, 'Certificate not found', 404);
    }

    sendSuccess(res, certificate);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Verify certificate by code
export const verifyCertificate = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;

    const certificate = await Certificate.findOne({ 
      $or: [
        { verificationCode: code.toUpperCase() },
        { certificateId: code.toUpperCase() }
      ]
    })
    .populate('userId', 'name')
    .populate('agencyId', 'name');

    if (!certificate) {
      return sendError(res, 'Invalid certificate code', 404);
    }

    sendSuccess(res, {
      valid: true,
      certificate: {
        certificateId: certificate.certificateId,
        issueDate: certificate.issueDate,
        totalWeight: certificate.totalWeight,
        userName: (certificate.userId as any).name,
        agencyName: (certificate.agencyId as any).name
      }
    });
  } catch (error: any) {
    sendError(res, error.message);
  }
};
