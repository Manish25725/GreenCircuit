import { Request, Response } from 'express';
import Business from '../models/Business';
import Inventory from '../models/Inventory';
import BusinessCertificate from '../models/BusinessCertificate';
import Booking from '../models/Booking';
import User from '../models/User';
import Agency from '../models/Agency';
import { sendSuccess, sendError } from '../utils/response';
import mongoose from 'mongoose';

// ==========================================
// BUSINESS PROFILE MANAGEMENT
// ==========================================

// Get business dashboard data
export const getBusinessDashboard = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id || (req as any).user.id;
    
    // Find or create business profile
    let business = await Business.findOne({ userId });
    
    if (!business) {
      // Create default business profile
      const user = await User.findById(userId);
      if (!user) {
        return sendError(res, 'User not found', 404);
      }
      
      business = await Business.create({
        userId,
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
    }

    // Get inventory stats
    const inventoryStats = await Inventory.aggregate([
      { $match: { businessId: business._id } },
      {
        $group: {
          _id: null,
          totalItems: { $sum: '$quantity' },
          totalWeight: { $sum: { $multiply: ['$weight', '$quantity'] } },
          readyForPickup: {
            $sum: { $cond: [{ $eq: ['$status', 'ready-for-pickup'] }, '$quantity', 0] }
          }
        }
      }
    ]);

    // Get pending pickups
    const pendingPickups = await Booking.countDocuments({
      userId,
      status: { $in: ['pending', 'confirmed', 'in-progress'] }
    });

    // Get certificates count
    const certificatesCount = await BusinessCertificate.countDocuments({
      businessId: business._id
    });

    // Get recent bookings
    const recentBookings = await Booking.find({ userId })
      .populate('agencyId', 'name logo')
      .sort({ createdAt: -1 })
      .limit(5);

    // Monthly waste trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrend = await Booking.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          status: 'completed',
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          totalWeight: { $sum: '$totalWeight' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    sendSuccess(res, {
      business,
      stats: {
        totalWasteProcessed: business.totalWasteProcessed,
        co2Saved: business.co2Saved,
        totalPickups: business.totalPickups,
        complianceScore: business.complianceScore,
        pendingPickups,
        certificatesCount,
        inventory: {
          totalItems: inventoryStats[0]?.totalItems || 0,
          totalWeight: inventoryStats[0]?.totalWeight || 0,
          readyForPickup: inventoryStats[0]?.readyForPickup || 0
        }
      },
      recentBookings,
      monthlyTrend
    });
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Get business profile
export const getBusinessProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id || (req as any).user.id;
    const business = await Business.findOne({ userId }).populate('userId', 'name email avatar');

    if (!business) {
      return sendError(res, 'Business profile not found', 404);
    }

    sendSuccess(res, business);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Create business profile
export const createBusinessProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id || (req as any).user.id;
    const { companyName, description, industry, email, phone, website, address, contactPerson } = req.body;

    // Check if business already exists
    const existingBusiness = await Business.findOne({ userId });
    if (existingBusiness) {
      return sendError(res, 'Business profile already exists', 400);
    }

    const business = await Business.create({
      userId,
      companyName,
      description,
      industry,
      email,
      phone,
      website,
      address,
      contactPerson
    });

    // Update user role to business
    await User.findByIdAndUpdate(userId, { role: 'business' });

    sendSuccess(res, business, 201);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Update business profile
export const updateBusinessProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id || (req as any).user.id;
    const updates = req.body;

    // Prevent updating certain fields
    delete updates.userId;
    delete updates.totalWasteProcessed;
    delete updates.co2Saved;
    delete updates.totalPickups;

    const business = await Business.findOneAndUpdate(
      { userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!business) {
      return sendError(res, 'Business profile not found', 404);
    }

    sendSuccess(res, business);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// ==========================================
// INVENTORY MANAGEMENT
// ==========================================

// Get all inventory items
export const getInventory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id || (req as any).user.id;
    const { category, status, search, page = 1, limit = 50 } = req.query;

    console.log('getInventory called for userId:', userId);

    // Find or create business profile
    let business = await Business.findOne({ userId });
    if (!business) {
      console.log('No business found, creating new one...');
      const user = await User.findById(userId);
      if (!user) {
        return sendError(res, 'User not found', 404);
      }
      try {
        business = await Business.create({
          userId,
          companyName: user.name + "'s Business",
          email: user.email,
          phone: user.phone || '',
          industry: 'Technology',
          address: {
            street: user.address?.street || 'Not specified',
            city: user.address?.city || 'Not specified',
            state: user.address?.state || 'Not specified',
            country: 'India',
            zipCode: user.address?.zipCode || '000000'
          }
        });
        console.log('Business created:', business._id);
      } catch (createError: any) {
        console.error('Error creating business:', createError);
        return sendError(res, 'Failed to create business profile: ' + createError.message, 500);
      }
    }

    const query: any = { businessId: business._id };
    
    if (category && category !== 'all') query.category = category;
    if (status && status !== 'all') query.status = status;
    if (search) {
      query.$or = [
        { itemName: new RegExp(search as string, 'i') },
        { assetId: new RegExp(search as string, 'i') },
        { serialNumber: new RegExp(search as string, 'i') }
      ];
    }

    const items = await Inventory.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Inventory.countDocuments(query);

    // Get stats by category
    let categoryStats: any[] = [];
    try {
      categoryStats = await Inventory.aggregate([
        { $match: { businessId: new mongoose.Types.ObjectId(business._id.toString()) } },
        {
          $group: {
            _id: '$category',
            count: { $sum: '$quantity' },
            weight: { $sum: { $multiply: ['$weight', '$quantity'] } }
          }
        }
      ]);
    } catch (aggError) {
      console.error('Aggregate error:', aggError);
    }

    sendSuccess(res, {
      items,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      },
      categoryStats
    });
  } catch (error: any) {
    console.error('getInventory error:', error);
    sendError(res, error.message || 'Failed to fetch inventory');
  }
};

// Get single inventory item
export const getInventoryItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id || (req as any).user.id;
    const { id } = req.params;

    const business = await Business.findOne({ userId });
    if (!business) {
      return sendError(res, 'Business profile not found', 404);
    }

    const item = await Inventory.findOne({ _id: id, businessId: business._id })
      .populate('bookingId');

    if (!item) {
      return sendError(res, 'Item not found', 404);
    }

    sendSuccess(res, item);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Add inventory item
export const addInventoryItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id || (req as any).user.id;
    const itemData = req.body;

    console.log('addInventoryItem called for userId:', userId, 'data:', itemData);

    // Find or create business profile
    let business = await Business.findOne({ userId });
    if (!business) {
      const user = await User.findById(userId);
      if (!user) {
        return sendError(res, 'User not found', 404);
      }
      business = await Business.create({
        userId,
        companyName: user.name + "'s Business",
        email: user.email,
        phone: user.phone || '',
        industry: 'Technology',
        address: {
          street: user.address?.street || 'Not specified',
          city: user.address?.city || 'Not specified',
          state: user.address?.state || 'Not specified',
          country: 'India',
          zipCode: user.address?.zipCode || '000000'
        }
      });
    }

    // Generate asset ID
    const category = itemData.category || 'Other';
    const prefix = category.substring(0, 3).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const assetId = `${prefix}-${Date.now().toString().slice(-6)}-${random}`;

    // Map frontend fields to backend model fields
    const inventoryData = {
      businessId: business._id,
      itemName: itemData.name || itemData.itemName,
      category: category,
      assetId: assetId,
      quantity: itemData.quantity || 1,
      weight: itemData.weight || 0,
      status: itemData.status || 'in-storage',
      condition: itemData.condition || 'unknown',
      location: itemData.location || 'Main Storage',
      description: itemData.description || '',
      hazardous: itemData.hazardous || false,
      recyclable: itemData.recyclable !== false,
      tags: itemData.tags || [],
      notes: itemData.notes || ''
    };

    console.log('Creating inventory with data:', inventoryData);

    const item = await Inventory.create(inventoryData);

    console.log('Inventory item created:', item._id);

    return sendSuccess(res, item, 201);
  } catch (error: any) {
    console.error('Add inventory error:', error);
    return sendError(res, error.message);
  }
};

// Update inventory item
export const updateInventoryItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id || (req as any).user.id;
    const { id } = req.params;
    const updates = req.body;

    // Find or create business profile
    let business = await Business.findOne({ userId });
    if (!business) {
      const user = await User.findById(userId);
      if (!user) {
        return sendError(res, 'User not found', 404);
      }
      business = await Business.create({
        userId,
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
    }

    // Map frontend fields to backend model fields if needed
    const updateData: any = { ...updates };
    if (updates.name) {
      updateData.itemName = updates.name;
      delete updateData.name;
    }

    const item = await Inventory.findOneAndUpdate(
      { _id: id, businessId: business._id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!item) {
      return sendError(res, 'Item not found', 404);
    }

    sendSuccess(res, item);
  } catch (error: any) {
    console.error('Update inventory error:', error);
    sendError(res, error.message);
  }
};

// Delete inventory item
export const deleteInventoryItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id || (req as any).user.id;
    const { id } = req.params;

    const business = await Business.findOne({ userId });
    if (!business) {
      return sendError(res, 'Business profile not found', 404);
    }

    const item = await Inventory.findOneAndDelete({ _id: id, businessId: business._id });

    if (!item) {
      return sendError(res, 'Item not found', 404);
    }

    sendSuccess(res, { message: 'Item deleted successfully' });
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Bulk update inventory status
export const bulkUpdateInventoryStatus = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id || (req as any).user.id;
    const { itemIds, status } = req.body;

    const business = await Business.findOne({ userId });
    if (!business) {
      return sendError(res, 'Business profile not found', 404);
    }

    const result = await Inventory.updateMany(
      { _id: { $in: itemIds }, businessId: business._id },
      { status }
    );

    sendSuccess(res, { 
      message: `Updated ${result.modifiedCount} items`,
      modifiedCount: result.modifiedCount
    });
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Mark items ready for pickup
export const markItemsForPickup = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id || (req as any).user.id;
    const { itemIds } = req.body;

    const business = await Business.findOne({ userId });
    if (!business) {
      return sendError(res, 'Business profile not found', 404);
    }

    await Inventory.updateMany(
      { _id: { $in: itemIds }, businessId: business._id },
      { status: 'ready-for-pickup' }
    );

    // Get total weight of items
    const items = await Inventory.find({ _id: { $in: itemIds } });
    const totalWeight = items.reduce((sum, item) => sum + (item.weight * item.quantity), 0);

    sendSuccess(res, { 
      message: 'Items marked for pickup',
      totalItems: items.length,
      totalWeight
    });
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// ==========================================
// CERTIFICATE MANAGEMENT
// ==========================================

// Get all certificates
export const getCertificates = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id || (req as any).user.id;
    const { type, status, page = 1, limit = 20 } = req.query;

    const business = await Business.findOne({ userId });
    if (!business) {
      return sendError(res, 'Business profile not found', 404);
    }

    const query: any = { businessId: business._id };
    if (type) query.type = type;
    if (status) query.status = status;

    const certificates = await BusinessCertificate.find(query)
      .populate('agencyId', 'name logo')
      .sort({ issuedAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await BusinessCertificate.countDocuments(query);

    // Get stats
    const stats = await BusinessCertificate.aggregate([
      { $match: { businessId: business._id } },
      {
        $group: {
          _id: null,
          totalCertificates: { $sum: 1 },
          totalWeight: { $sum: '$totalWeight' },
          totalCo2Saved: { $sum: '$co2Saved' }
        }
      }
    ]);

    sendSuccess(res, {
      certificates,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      },
      stats: stats[0] || { totalCertificates: 0, totalWeight: 0, totalCo2Saved: 0 }
    });
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Get single certificate
export const getCertificate = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id || (req as any).user.id;
    const { id } = req.params;

    const business = await Business.findOne({ userId });
    if (!business) {
      return sendError(res, 'Business profile not found', 404);
    }

    const certificate = await BusinessCertificate.findOne({ 
      $or: [{ _id: id }, { certificateId: id }],
      businessId: business._id 
    })
      .populate('agencyId', 'name logo email phone')
      .populate('bookingId');

    if (!certificate) {
      return sendError(res, 'Certificate not found', 404);
    }

    sendSuccess(res, certificate);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Download certificate (returns URL)
export const downloadCertificate = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id || (req as any).user.id;
    const { id } = req.params;

    const business = await Business.findOne({ userId });
    if (!business) {
      return sendError(res, 'Business profile not found', 404);
    }

    const certificate = await BusinessCertificate.findOne({ 
      $or: [{ _id: id }, { certificateId: id }],
      businessId: business._id 
    });

    if (!certificate) {
      return sendError(res, 'Certificate not found', 404);
    }

    // In production, generate actual PDF here
    sendSuccess(res, { 
      downloadUrl: certificate.documentUrl || `/api/business/certificates/${certificate._id}/pdf`,
      certificate
    });
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// ==========================================
// ANALYTICS
// ==========================================

// Get business analytics
export const getBusinessAnalytics = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id || (req as any).user.id;
    const { period = '30d', category } = req.query;

    const business = await Business.findOne({ userId });
    if (!business) {
      return sendError(res, 'Business profile not found', 404);
    }

    // Calculate date range
    let startDate = new Date();
    if (period === '7d') startDate.setDate(startDate.getDate() - 7);
    else if (period === '30d') startDate.setDate(startDate.getDate() - 30);
    else if (period === '90d') startDate.setDate(startDate.getDate() - 90);
    else if (period === '1y') startDate.setFullYear(startDate.getFullYear() - 1);

    // Waste by category
    const wasteByCategory = await Booking.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
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

    // Monthly trends
    const monthlyTrends = await Booking.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          status: 'completed',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          totalWeight: { $sum: '$totalWeight' },
          bookings: { $sum: 1 },
          co2Saved: { $sum: { $multiply: ['$totalWeight', 0.67] } } // Approx CO2 factor
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Environmental impact
    const completedBookings = await Booking.find({
      userId: new mongoose.Types.ObjectId(userId),
      status: 'completed',
      createdAt: { $gte: startDate }
    });

    const totalWeight = completedBookings.reduce((sum, b) => sum + (b.totalWeight || 0), 0);
    const co2Saved = totalWeight * 0.67; // Approximate CO2 savings per kg
    const treesEquivalent = Math.floor(co2Saved / 20); // Approx 20kg CO2 per tree per year

    // Top agencies used
    const topAgencies = await Booking.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          status: 'completed'
        }
      },
      {
        $group: {
          _id: '$agencyId',
          bookings: { $sum: 1 },
          totalWeight: { $sum: '$totalWeight' }
        }
      },
      { $sort: { bookings: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'agencies',
          localField: '_id',
          foreignField: '_id',
          as: 'agency'
        }
      },
      { $unwind: '$agency' },
      {
        $project: {
          _id: 1,
          bookings: 1,
          totalWeight: 1,
          'agency.name': 1,
          'agency.logo': 1,
          'agency.rating': 1
        }
      }
    ]);

    sendSuccess(res, {
      summary: {
        totalWasteProcessed: totalWeight,
        co2Saved,
        treesEquivalent,
        totalBookings: completedBookings.length,
        complianceScore: business.complianceScore
      },
      wasteByCategory,
      monthlyTrends,
      topAgencies,
      period
    });
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Export report
export const exportReport = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id || (req as any).user.id;
    const { type = 'summary', format = 'json', period = '30d' } = req.query;

    const business = await Business.findOne({ userId });
    if (!business) {
      return sendError(res, 'Business profile not found', 404);
    }

    let startDate = new Date();
    if (period === '7d') startDate.setDate(startDate.getDate() - 7);
    else if (period === '30d') startDate.setDate(startDate.getDate() - 30);
    else if (period === '90d') startDate.setDate(startDate.getDate() - 90);

    let reportData: any = {};

    if (type === 'summary' || type === 'all') {
      reportData.summary = {
        companyName: business.companyName,
        period: { start: startDate, end: new Date() },
        totalWasteProcessed: business.totalWasteProcessed,
        co2Saved: business.co2Saved,
        complianceScore: business.complianceScore
      };
    }

    if (type === 'bookings' || type === 'all') {
      reportData.bookings = await Booking.find({
        userId: new mongoose.Types.ObjectId(userId),
        createdAt: { $gte: startDate }
      })
        .populate('agencyId', 'name')
        .sort({ createdAt: -1 });
    }

    if (type === 'certificates' || type === 'all') {
      reportData.certificates = await BusinessCertificate.find({
        businessId: business._id,
        issuedAt: { $gte: startDate }
      })
        .populate('agencyId', 'name')
        .sort({ issuedAt: -1 });
    }

    if (type === 'inventory' || type === 'all') {
      reportData.inventory = await Inventory.find({ businessId: business._id });
    }

    // In production, convert to CSV/PDF based on format
    sendSuccess(res, {
      format,
      type,
      period,
      generatedAt: new Date(),
      data: reportData
    });
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// ==========================================
// BUSINESS BOOKINGS
// ==========================================

// Schedule business pickup
export const scheduleBusinessPickup = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id || (req as any).user.id;
    const { agencyId, slotId, items, pickupAddress, notes, inventoryItemIds, scheduledDate, scheduledTime } = req.body;

    const business = await Business.findOne({ userId });
    if (!business) {
      return sendError(res, 'Business profile not found', 404);
    }

    // Calculate total weight
    const totalWeight = items.reduce((sum: number, item: any) => sum + ((item.weight || 0) * (item.quantity || 1)), 0);

    // Create booking
    const booking = await Booking.create({
      userId,
      agencyId,
      slotId,
      items: items.map((item: any) => ({
        type: item.type || item.category,
        quantity: item.quantity || 1,
        description: item.description || item.name,
        estimatedWeight: item.weight
      })),
      totalWeight,
      pickupAddress: pickupAddress || business.address,
      notes,
      status: 'pending',
      businessId: business._id,
      scheduledDate: scheduledDate || new Date(),
      scheduledTime: scheduledTime || '09:00 AM'
    });

    // Update inventory items if provided
    if (booking && inventoryItemIds && inventoryItemIds.length > 0) {
      await Inventory.updateMany(
        { _id: { $in: inventoryItemIds }, businessId: business._id },
        { status: 'scheduled', bookingId: booking._id }
      );
    }

    // Update business pickup count
    await Business.findByIdAndUpdate(business._id, {
      $inc: { totalPickups: 1 }
    });

    sendSuccess(res, booking, 201);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Get business bookings
export const getBusinessBookings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id || (req as any).user.id;
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
