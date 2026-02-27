import Agency from '../models/Agency.js';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Business from '../models/Business.js';
import BusinessCertificate from '../models/BusinessCertificate.js';
import Certificate from '../models/Certificate.js';
import Notification from '../models/Notification.js';
import { sendSuccess, sendError } from '../utils/response.js';
// Get all agencies (with filters)
export const getAgencies = async (req, res) => {
    try {
        const { city, service, rating, verified, page = 1, limit = 100, sort = 'rating' } = req.query;
        const query = { isVerified: true, verificationStatus: 'approved' };
        if (city)
            query['address.city'] = new RegExp(city, 'i');
        if (service)
            query.services = service;
        if (rating)
            query.rating = { $gte: Number(rating) };
        if (verified !== undefined)
            query.isVerified = verified === 'true';
        const sortOptions = {};
        if (sort === 'rating')
            sortOptions.rating = -1;
        else if (sort === 'distance')
            sortOptions.createdAt = -1; // Placeholder
        else if (sort === 'bookings')
            sortOptions.totalBookings = -1;
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
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Get agency by ID
export const getAgencyById = async (req, res) => {
    try {
        const agency = await Agency.findById(req.params.id)
            .populate('userId', 'name email');
        if (!agency) {
            return sendError(res, 'Agency not found', 404);
        }
        sendSuccess(res, agency);
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Create agency profile (for agency users) - Partner Registration
export const createAgency = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, description, email, phone, address, services, gstNumber, udyamCertificate, headName, businessType, establishedYear, verificationDocuments } = req.body;
        // Validate required partner details
        if (!name || !email || !phone || !address || !gstNumber || !headName) {
            return sendError(res, 'Please provide all required details: name, email, phone, address, GST number, and head name', 400);
        }
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
            services: services || [],
            gstNumber,
            udyamCertificate,
            headName,
            businessType,
            establishedYear,
            verificationDocuments: verificationDocuments || [],
            verificationStatus: 'pending',
            isVerified: false
        });
        // Update user role to agency (but they still can't access dashboard until approved)
        await User.findByIdAndUpdate(userId, { role: 'agency' });
        // Create a notification for admin
        await Notification.create({
            userId: '000000000000000000000000', // Admin notification (use actual admin ID in production)
            type: 'admin',
            title: 'New Partner Registration',
            message: `New partner registration from ${name}. GST: ${gstNumber}`
        });
        sendSuccess(res, {
            message: 'Partner registration submitted successfully. Your request is pending admin approval.',
            agency
        }, 201);
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Update agency profile
export const updateAgency = async (req, res) => {
    try {
        const userId = req.user.id;
        const updates = req.body;
        const agency = await Agency.findOneAndUpdate({ userId }, updates, { new: true, runValidators: true });
        if (!agency) {
            return sendError(res, 'Agency not found', 404);
        }
        sendSuccess(res, agency);
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Get agency dashboard data
export const getAgencyDashboard = async (req, res) => {
    try {
        const userId = req.user.id;
        const agency = await Agency.findOne({ userId });
        if (!agency) {
            return sendError(res, 'Agency profile not found. Please complete partner registration.', 404);
        }
        // Check verification status
        if (agency.verificationStatus === 'pending') {
            return sendSuccess(res, {
                status: 'pending',
                message: 'Your partner registration is under review. Please wait for admin approval.',
                agency: {
                    name: agency.name,
                    email: agency.email,
                    gstNumber: agency.gstNumber,
                    verificationStatus: agency.verificationStatus,
                    submittedAt: agency.createdAt
                }
            });
        }
        if (agency.verificationStatus === 'rejected') {
            return sendSuccess(res, {
                status: 'rejected',
                message: 'Your partner registration was rejected.',
                rejectionReason: agency.rejectionReason || 'Please contact admin for more details.',
                agency: {
                    name: agency.name,
                    email: agency.email,
                    gstNumber: agency.gstNumber,
                    verificationStatus: agency.verificationStatus
                }
            });
        }
        // Get booking stats (only for approved agencies)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const [todayBookings, weekBookings, pendingBookings, completedBookings] = await Promise.all([
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
            status: 'approved',
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
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Get agency bookings
export const getAgencyBookings = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        const { status, page = 1, limit = 100 } = req.query;
        // Find agency by userId
        const agency = await Agency.findOne({ userId });
        if (!agency) {
            // Return helpful debug info
            const allAgencies = await Agency.find({}).select('_id name userId').limit(5);
            return sendError(res, `Agency profile not found for userId: ${userId}. User role: ${userRole}. Please create an agency profile first or check if logged in with the correct account.`, 404);
        }
        // Query bookings by agency._id
        const query = { agencyId: agency._id };
        if (status)
            query.status = status;
        const bookings = await Booking.find(query)
            .populate('userId', 'name email phone avatar')
            .populate('agencyId', 'name logo rating')
            .sort({ scheduledDate: 1, createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));
        const total = await Booking.countDocuments(query);
        sendSuccess(res, {
            bookings,
            agencyInfo: {
                id: agency._id,
                name: agency.name,
                userId: agency.userId
            },
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Search agencies by location
export const searchAgencies = async (req, res) => {
    try {
        const { location, lat, lng, radius = 10 } = req.query;
        let query = { isVerified: true };
        if (location) {
            query['address.city'] = new RegExp(location, 'i');
        }
        // If coordinates provided, use geo query (requires 2dsphere index)
        // For now, simple text search
        const agencies = await Agency.find(query)
            .select('name logo rating address services totalBookings')
            .sort({ rating: -1 })
            .limit(20);
        sendSuccess(res, agencies);
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Update booking status (for agency)
export const updateBookingStatus = async (req, res) => {
    try {
        const userId = req.user.id;
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
        const validTransitions = {
            'pending': ['confirmed', 'cancelled'],
            'confirmed': ['in-progress', 'cancelled'],
            'in-progress': ['completed', 'cancelled']
        };
        if (!validTransitions[booking.status]?.includes(status)) {
            return sendError(res, `Cannot transition from ${booking.status} to ${status}`, 400);
        }
        booking.status = status;
        if (notes)
            booking.notes = notes;
        if (status === 'completed') {
            booking.completedAt = new Date();
            // Calculate total weight from items if not already set
            if (!booking.totalWeight || booking.totalWeight === 0) {
                const calculatedWeight = booking.items?.reduce((sum, item) => {
                    // Use estimatedWeight if available, otherwise use quantity * 2 (assume 2kg per item)
                    const itemWeight = item.estimatedWeight || item.weight || (item.quantity * 2);
                    return sum + itemWeight;
                }, 0) || 0;
                booking.totalWeight = calculatedWeight;
            }
            // Update agency stats
            await Agency.findByIdAndUpdate(agency._id, {
                $inc: {
                    totalBookings: 1,
                    totalWasteCollected: booking.totalWeight || 0
                }
            });
            // Update user stats (points awarded in booking.controller when status changes to completed)
            await User.findByIdAndUpdate(booking.userId, {
                $inc: {
                    totalWasteRecycled: booking.totalWeight || 0
                    // Note: totalPickups and ecoPoints are incremented in booking.controller.ts when completed
                }
            });
            // Get user info for certificate
            const user = await User.findById(booking.userId);
            // Check if this is a business user and generate BusinessCertificate
            let business = await Business.findOne({ userId: booking.userId });
            // If user has business role but no profile, create one automatically
            if (!business && user?.role === 'business') {
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
            }
            if (business) {
                // Generate Business Compliance Certificate
                try {
                    const items = booking.items?.map((item) => ({
                        name: item.description || item.type || 'E-Waste Item',
                        category: item.type || item.category || 'General',
                        quantity: item.quantity || 1,
                        weight: item.estimatedWeight || item.weight || 0
                    })) || [];
                    const totalWeight = booking.totalWeight || 0;
                    const certificate = await BusinessCertificate.create({
                        businessId: business._id,
                        bookingId: booking._id,
                        agencyId: agency._id,
                        type: 'compliance',
                        title: 'E-Waste Compliance Certificate',
                        items,
                        totalWeight: totalWeight,
                        totalItems: items.reduce((sum, item) => sum + (item.quantity || 1), 0),
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
                            name: agency.name,
                            designation: 'Authorized E-Waste Recycling Partner'
                        },
                        status: 'issued',
                        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year validity
                        issuedAt: new Date()
                    });
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
                            totalWasteProcessed: booking.totalWeight || 0,
                            co2Saved: (booking.totalWeight || 0) * 0.67
                        }
                    });
                }
                catch (certError) {
                    // Certificate generation failed, but pickup still marked as complete
                    console.error('Business certificate generation failed:', certError);
                }
            }
            else {
                // Generate regular user Certificate
                try {
                    const itemsRecycled = booking.items?.map((item) => ({
                        type: item.type || item.category || 'E-Waste',
                        quantity: item.quantity || 1,
                        weight: item.estimatedWeight || item.weight || 0
                    })) || [];
                    await Certificate.create({
                        userId: booking.userId,
                        bookingId: booking._id,
                        agencyId: agency._id,
                        issueDate: new Date(),
                        totalWeight: booking.totalWeight || 0,
                        itemsRecycled,
                        environmentalImpact: {
                            co2Saved: (booking.totalWeight || 0) * 0.67,
                            waterSaved: (booking.totalWeight || 0) * 1.2,
                            energySaved: (booking.totalWeight || 0) * 0.8
                        }
                    });
                }
                catch (certError) {
                    // Certificate generation failed, but pickup still marked as complete
                    console.error('User certificate generation failed:', certError);
                }
            }
        }
        await booking.save();
        sendSuccess(res, booking);
    }
    catch (error) {
        console.error('Failed to update booking status:', error);
        sendError(res, error.message);
    }
};
// Get agency analytics
export const getAgencyAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;
        const { period = '30d' } = req.query;
        const agency = await Agency.findOne({ userId });
        if (!agency) {
            return sendError(res, 'Agency not found', 404);
        }
        let startDate = new Date();
        if (period === '7d')
            startDate.setDate(startDate.getDate() - 7);
        else if (period === '30d')
            startDate.setDate(startDate.getDate() - 30);
        else if (period === '90d')
            startDate.setDate(startDate.getDate() - 90);
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
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Get agency profile for public view
export const getAgencyPublicProfile = async (req, res) => {
    try {
        const agency = await Agency.findById(req.params.id)
            .select('name description logo coverImage rating totalReviews services address operatingHours totalBookings');
        if (!agency || !agency.isVerified) {
            return sendError(res, 'Agency not found', 404);
        }
        sendSuccess(res, agency);
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Submit verification request
export const submitVerificationRequest = async (req, res) => {
    try {
        const userId = req.user.id;
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
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Get agency's vetting requests
export const getAgencyVettingRequests = async (req, res) => {
    try {
        const userId = req.user.id;
        const agency = await Agency.findOne({ userId });
        if (!agency) {
            return sendError(res, 'Agency not found', 404);
        }
        const VettingRequest = require('../models/VettingRequest').default;
        const requests = await VettingRequest.find({ agencyId: agency._id })
            .sort({ submittedAt: -1 });
        sendSuccess(res, requests);
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Get agency profile
export const getAgencyProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const agency = await Agency.findOne({ userId })
            .populate('userId', 'name email');
        if (!agency) {
            return sendError(res, 'Agency not found', 404);
        }
        sendSuccess(res, agency);
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Update agency profile
export const updateAgencyProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, registrationNumber, description, email, phone, address, services, certifications, operatingHours, operatingRegions, logo, coverImage, gstNumber, udyamCertificate, headName, businessType, establishedYear } = req.body;
        const agency = await Agency.findOne({ userId });
        if (!agency) {
            return sendError(res, 'Agency not found', 404);
        }
        // Update fields if provided
        if (name !== undefined)
            agency.name = name;
        if (registrationNumber !== undefined)
            agency.registrationNumber = registrationNumber;
        if (description !== undefined)
            agency.description = description;
        if (email !== undefined)
            agency.email = email;
        if (phone !== undefined)
            agency.phone = phone;
        if (logo !== undefined)
            agency.logo = logo;
        if (coverImage !== undefined)
            agency.coverImage = coverImage;
        if (gstNumber !== undefined)
            agency.gstNumber = gstNumber;
        if (udyamCertificate !== undefined)
            agency.udyamCertificate = udyamCertificate;
        if (headName !== undefined)
            agency.headName = headName;
        if (businessType !== undefined)
            agency.businessType = businessType;
        if (establishedYear !== undefined)
            agency.establishedYear = establishedYear;
        if (address) {
            const updatedAddress = {
                street: address.street || agency.address.street,
                city: address.city || agency.address.city,
                state: address.state || agency.address.state,
                country: address.country || agency.address.country || '',
                zipCode: address.zipCode || agency.address.zipCode
            };
            // Only include coordinates if they exist
            if (address.coordinates) {
                updatedAddress.coordinates = address.coordinates;
            }
            else if (agency.address.coordinates) {
                updatedAddress.coordinates = agency.address.coordinates;
            }
            agency.address = updatedAddress;
        }
        if (services !== undefined)
            agency.services = services;
        if (certifications !== undefined)
            agency.certifications = certifications;
        if (operatingHours !== undefined)
            agency.operatingHours = operatingHours;
        if (operatingRegions !== undefined)
            agency.operatingRegions = operatingRegions;
        await agency.save();
        sendSuccess(res, agency);
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Add certification
export const addCertification = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, type, icon, color } = req.body;
        if (!name || !type) {
            return sendError(res, 'Certification name and type are required', 400);
        }
        const agency = await Agency.findOne({ userId });
        if (!agency) {
            return sendError(res, 'Agency not found', 404);
        }
        // Add certification (stored as JSON string for flexibility)
        const certData = JSON.stringify({ name, type, icon, color });
        agency.certifications.push(certData);
        await agency.save();
        sendSuccess(res, { message: 'Certification added', agency });
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Remove certification
export const removeCertification = async (req, res) => {
    try {
        const userId = req.user.id;
        const { index } = req.params;
        const agency = await Agency.findOne({ userId });
        if (!agency) {
            return sendError(res, 'Agency not found', 404);
        }
        const certIndex = parseInt(index);
        if (certIndex < 0 || certIndex >= agency.certifications.length) {
            return sendError(res, 'Invalid certification index', 400);
        }
        agency.certifications.splice(certIndex, 1);
        await agency.save();
        sendSuccess(res, { message: 'Certification removed', agency });
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Update operating hours
export const updateOperatingHours = async (req, res) => {
    try {
        const userId = req.user.id;
        const { operatingHours } = req.body;
        if (!operatingHours || !Array.isArray(operatingHours)) {
            return sendError(res, 'Operating hours must be an array', 400);
        }
        const agency = await Agency.findOne({ userId });
        if (!agency) {
            return sendError(res, 'Agency not found', 404);
        }
        agency.operatingHours = operatingHours;
        await agency.save();
        sendSuccess(res, { message: 'Operating hours updated', agency });
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Update agency logo/profile picture
export const updateAgencyLogo = async (req, res) => {
    try {
        const userId = req.user.id;
        const { logo } = req.body;
        if (!logo) {
            return sendError(res, 'Logo URL is required', 400);
        }
        const agency = await Agency.findOne({ userId });
        if (!agency) {
            return sendError(res, 'Agency not found', 404);
        }
        agency.logo = logo;
        await agency.save();
        sendSuccess(res, { message: 'Logo updated', agency });
    }
    catch (error) {
        sendError(res, error.message);
    }
};
