import User from '../models/User.js';
import Agency from '../models/Agency.js';
import Booking from '../models/Booking.js';
import VettingRequest from '../models/VettingRequest.js';
import Notification from '../models/Notification.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { parsePagination, addPaginationMeta } from '../middleware/security.middleware.js';
import mongoose from 'mongoose';
// Get admin dashboard stats
export const getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        const [totalUsers, totalAgencies, pendingAgencies, totalBookings, monthBookings, completedBookings] = await Promise.all([
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
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Get all users (admin)
export const getAllUsers = async (req, res) => {
    try {
        const { role, search } = req.query;
        const { page, limit, skip } = parsePagination(req);
        const query = {};
        if (role && role !== 'all')
            query.role = role;
        if (search) {
            query.$or = [
                { name: new RegExp(search, 'i') },
                { email: new RegExp(search, 'i') }
            ];
        }
        const [users, total] = await Promise.all([
            User.find(query)
                .select('-password')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            User.countDocuments(query)
        ]);
        sendSuccess(res, {
            users,
            pagination: addPaginationMeta(total, page, limit)
        });
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Get pending agency verifications
export const getPendingAgencies = async (req, res) => {
    try {
        const { page, limit, skip } = parsePagination(req);
        const [agencies, total] = await Promise.all([
            Agency.find({ verificationStatus: 'pending' })
                .populate('userId', 'name email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Agency.countDocuments({ verificationStatus: 'pending' })
        ]);
        sendSuccess(res, {
            agencies,
            pagination: addPaginationMeta(total, page, limit)
        });
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Approve/Reject agency
export const updateAgencyVerification = async (req, res) => {
    try {
        const { status, reason } = req.body;
        if (!['approved', 'rejected'].includes(status)) {
            return sendError(res, 'Invalid status', 400);
        }
        const agency = await Agency.findByIdAndUpdate(req.params.id, {
            verificationStatus: status,
            isVerified: status === 'approved'
        }, { new: true });
        if (!agency) {
            return sendError(res, 'Agency not found', 404);
        }
        // Update user verification status
        await User.findByIdAndUpdate(agency.userId, {
            isVerified: status === 'approved'
        });
        sendSuccess(res, agency);
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Get all agencies (admin)
export const getAllAgencies = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const query = {};
        if (status)
            query.verificationStatus = status;
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
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Get agency details for verification (admin)
export const getAgencyForVerification = async (req, res) => {
    try {
        const agency = await Agency.findById(req.params.id)
            .populate('userId', 'name email phone createdAt');
        if (!agency) {
            return sendError(res, 'Agency not found', 404);
        }
        sendSuccess(res, agency);
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Approve partner registration (admin)
export const approvePartnerRegistration = async (req, res) => {
    try {
        const { id } = req.params;
        const { notes } = req.body;
        const agency = await Agency.findById(id).populate('userId', 'name email');
        if (!agency) {
            return sendError(res, 'Agency not found', 404);
        }
        if (agency.verificationStatus !== 'pending') {
            return sendError(res, `Agency is already ${agency.verificationStatus}`, 400);
        }
        // Update agency status
        agency.verificationStatus = 'approved';
        agency.isVerified = true;
        await agency.save();
        // Create notification for agency user
        await Notification.create({
            userId: agency.userId,
            type: 'account',
            title: 'Partner Registration Approved',
            message: `Congratulations! Your partner registration has been approved. You can now access your partner dashboard.${notes ? ` Note: ${notes}` : ''}`
        });
        sendSuccess(res, {
            message: 'Partner registration approved successfully',
            agency
        });
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Reject partner registration (admin)
export const rejectPartnerRegistration = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        if (!reason) {
            return sendError(res, 'Rejection reason is required', 400);
        }
        const agency = await Agency.findById(id).populate('userId', 'name email');
        if (!agency) {
            return sendError(res, 'Agency not found', 404);
        }
        if (agency.verificationStatus !== 'pending') {
            return sendError(res, `Agency is already ${agency.verificationStatus}`, 400);
        }
        // Update agency status
        agency.verificationStatus = 'rejected';
        agency.isVerified = false;
        agency.rejectionReason = reason;
        await agency.save();
        // Create notification for agency user
        await Notification.create({
            userId: agency.userId,
            type: 'account',
            title: 'Partner Registration Rejected',
            message: `Your partner registration has been rejected. Reason: ${reason}. Please contact support for more information.`
        });
        sendSuccess(res, {
            message: 'Partner registration rejected',
            agency
        });
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Get platform reports
export const getReports = async (req, res) => {
    try {
        const { period = '30d' } = req.query;
        let startDate = new Date();
        if (period === '7d')
            startDate.setDate(startDate.getDate() - 7);
        else if (period === '30d')
            startDate.setDate(startDate.getDate() - 30);
        else if (period === '90d')
            startDate.setDate(startDate.getDate() - 90);
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
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// ==========================================
// USER MANAGEMENT (Extended)
// ==========================================
// Get user by ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password');
        if (!user) {
            return sendError(res, 'User not found', 404);
        }
        // Get user's booking history
        const bookings = await Booking.find({ userId: user._id })
            .populate('agencyId', 'name')
            .sort({ createdAt: -1 })
            .limit(10);
        sendSuccess(res, { user, bookings });
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Update user (admin)
export const updateUser = async (req, res) => {
    try {
        const { name, email, role, phone, isVerified } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { name, email, role, phone, isVerified }, { new: true, runValidators: true }).select('-password');
        if (!user) {
            return sendError(res, 'User not found', 404);
        }
        sendSuccess(res, user);
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Suspend user
// Reactivate user
export const reactivateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, {
            isVerified: true,
            $unset: { suspendedAt: '', suspendReason: '' }
        }, { new: true }).select('-password');
        if (!user) {
            return sendError(res, 'User not found', 404);
        }
        sendSuccess(res, { message: 'User reactivated successfully', user });
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Delete user (soft delete)
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return sendError(res, 'User not found', 404);
        }
        // Prevent deleting admin users
        if (user.role === 'admin') {
            return sendError(res, 'Cannot delete admin users', 403);
        }
        // Soft delete - update email and mark as deleted
        await User.findByIdAndUpdate(req.params.id, {
            email: `deleted_${Date.now()}_${user.email}`,
            isDeleted: true,
            deletedAt: new Date()
        });
        sendSuccess(res, { message: 'User deleted successfully' });
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// ==========================================
// VETTING / VERIFICATION MANAGEMENT
// ==========================================
// Get all vetting requests
export const getVettingRequests = async (req, res) => {
    try {
        const { type, status, page = 1, limit = 20 } = req.query;
        const query = {};
        if (type)
            query.type = type;
        if (status)
            query.status = status;
        const requests = await VettingRequest.find(query)
            .populate({
            path: 'agencyId',
            select: 'name logo email phone address verificationStatus',
            populate: { path: 'userId', select: 'name email' }
        })
            .populate('assignedTo', 'name email')
            .sort({ submittedAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));
        const total = await VettingRequest.countDocuments(query);
        // Get counts by status
        const statusCounts = await VettingRequest.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);
        sendSuccess(res, {
            requests,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            },
            statusCounts: statusCounts.reduce((acc, curr) => {
                acc[curr._id] = curr.count;
                return acc;
            }, {})
        });
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Get single vetting request
export const getVettingRequest = async (req, res) => {
    try {
        const request = await VettingRequest.findById(req.params.id)
            .populate({
            path: 'agencyId',
            populate: { path: 'userId', select: 'name email avatar' }
        })
            .populate('assignedTo', 'name email')
            .populate('reviewedBy', 'name email');
        if (!request) {
            return sendError(res, 'Vetting request not found', 404);
        }
        sendSuccess(res, request);
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Update vetting request status
export const updateVettingRequest = async (req, res) => {
    try {
        const adminId = req.user.id;
        const { status, reviewNotes, rejectionReason, trustScore } = req.body;
        const request = await VettingRequest.findById(req.params.id);
        if (!request) {
            return sendError(res, 'Vetting request not found', 404);
        }
        const updateData = {
            status,
            reviewNotes,
            reviewedBy: adminId,
            reviewedAt: new Date()
        };
        if (status === 'rejected') {
            updateData.rejectionReason = rejectionReason;
        }
        if (trustScore !== undefined) {
            updateData.trustScore = trustScore;
        }
        if (status === 'approved' || status === 'rejected') {
            updateData.completedAt = new Date();
        }
        const updatedRequest = await VettingRequest.findByIdAndUpdate(req.params.id, updateData, { new: true });
        // If approved and it's a new agency request, verify the agency
        if (status === 'approved' && request.type === 'new-agency') {
            await Agency.findByIdAndUpdate(request.agencyId, {
                verificationStatus: 'approved',
                isVerified: true
            });
            // Update user verification
            const agency = await Agency.findById(request.agencyId);
            if (agency) {
                await User.findByIdAndUpdate(agency.userId, { isVerified: true });
            }
        }
        // Create notification for agency
        const agency = await Agency.findById(request.agencyId);
        if (agency) {
            await Notification.create({
                userId: agency.userId,
                type: 'verification',
                title: status === 'approved' ? 'Request Approved' :
                    status === 'rejected' ? 'Request Rejected' : 'Request Updated',
                message: status === 'approved'
                    ? `Your ${request.type} request has been approved!`
                    : status === 'rejected'
                        ? `Your ${request.type} request has been rejected. Reason: ${rejectionReason || 'Not specified'}`
                        : `Your ${request.type} request status has been updated to: ${status}`
            });
        }
        sendSuccess(res, updatedRequest);
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Assign vetting request to admin
export const assignVettingRequest = async (req, res) => {
    try {
        const { assignedTo } = req.body;
        const request = await VettingRequest.findByIdAndUpdate(req.params.id, {
            assignedTo,
            status: 'under-review'
        }, { new: true }).populate('assignedTo', 'name email');
        if (!request) {
            return sendError(res, 'Vetting request not found', 404);
        }
        sendSuccess(res, request);
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Update verification checklist item
export const updateChecklistItem = async (req, res) => {
    try {
        const adminId = req.user.id;
        const { itemIndex, status, notes } = req.body;
        const request = await VettingRequest.findById(req.params.id);
        if (!request) {
            return sendError(res, 'Vetting request not found', 404);
        }
        if (request.verificationChecklist[itemIndex]) {
            request.verificationChecklist[itemIndex].status = status;
            request.verificationChecklist[itemIndex].notes = notes;
            request.verificationChecklist[itemIndex].verifiedBy = adminId;
            request.verificationChecklist[itemIndex].verifiedAt = new Date();
        }
        // Recalculate trust score based on checklist
        const verifiedItems = request.verificationChecklist.filter(item => item.status === 'verified').length;
        const totalItems = request.verificationChecklist.length;
        request.trustScore = totalItems > 0 ? Math.round((verifiedItems / totalItems) * 100) : 0;
        await request.save();
        sendSuccess(res, request);
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// ==========================================
// AGENCY MANAGEMENT (Extended)
// ==========================================
// Get agency details
export const getAgencyDetails = async (req, res) => {
    try {
        const agency = await Agency.findById(req.params.id)
            .populate('userId', 'name email avatar');
        if (!agency) {
            return sendError(res, 'Agency not found', 404);
        }
        // Get agency stats
        const bookingStats = await Booking.aggregate([
            { $match: { agencyId: new mongoose.Types.ObjectId(req.params.id) } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalWeight: { $sum: '$totalWeight' }
                }
            }
        ]);
        // Recent bookings
        const recentBookings = await Booking.find({ agencyId: req.params.id })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .limit(10);
        // Vetting history
        const vettingHistory = await VettingRequest.find({ agencyId: req.params.id })
            .sort({ submittedAt: -1 })
            .limit(5);
        sendSuccess(res, {
            agency,
            bookingStats,
            recentBookings,
            vettingHistory
        });
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Suspend agency
// Reactivate agency
export const reactivateAgency = async (req, res) => {
    try {
        const agency = await Agency.findByIdAndUpdate(req.params.id, {
            isVerified: true,
            verificationStatus: 'approved',
            $unset: { suspendReason: '', suspendedAt: '' }
        }, { new: true });
        if (!agency) {
            return sendError(res, 'Agency not found', 404);
        }
        // Update user
        await User.findByIdAndUpdate(agency.userId, { isVerified: true });
        sendSuccess(res, { message: 'Agency reactivated successfully', agency });
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// ==========================================
// PLATFORM ANALYTICS & REPORTS (Extended)
// ==========================================
// Get comprehensive platform analytics
export const getPlatformAnalytics = async (req, res) => {
    try {
        const { period = '30d' } = req.query;
        let startDate = new Date();
        if (period === '7d')
            startDate.setDate(startDate.getDate() - 7);
        else if (period === '30d')
            startDate.setDate(startDate.getDate() - 30);
        else if (period === '90d')
            startDate.setDate(startDate.getDate() - 90);
        else if (period === '1y')
            startDate.setFullYear(startDate.getFullYear() - 1);
        // User growth
        const userGrowth = await User.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        // Revenue/Earnings (from completed bookings)
        const revenueData = await Booking.aggregate([
            { $match: { status: 'completed', createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    revenue: { $sum: '$totalWeight' }, // Simplified - multiply by rate in production
                    bookings: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        // Geographic distribution
        const geographicData = await Agency.aggregate([
            { $match: { isVerified: true } },
            {
                $group: {
                    _id: '$address.city',
                    count: { $sum: 1 },
                    totalBookings: { $sum: '$totalBookings' }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);
        // E-waste categories
        const categoryData = await Booking.aggregate([
            { $match: { status: 'completed', createdAt: { $gte: startDate } } },
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
        // Environmental impact
        const totalWaste = await Booking.aggregate([
            { $match: { status: 'completed', createdAt: { $gte: startDate } } },
            { $group: { _id: null, total: { $sum: '$totalWeight' } } }
        ]);
        const totalWasteKg = totalWaste[0]?.total || 0;
        const co2Saved = totalWasteKg * 0.67; // Approximate factor
        const treesEquivalent = Math.floor(co2Saved / 20);
        sendSuccess(res, {
            userGrowth,
            revenueData,
            geographicData,
            categoryData,
            environmentalImpact: {
                totalWasteCollected: totalWasteKg,
                co2Saved,
                treesEquivalent,
                landfillDiverted: totalWasteKg * 0.85 // Approximate diversion rate
            },
            period
        });
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Export platform report
export const exportPlatformReport = async (req, res) => {
    try {
        const { type = 'summary', format = 'json', period = '30d' } = req.query;
        let startDate = new Date();
        if (period === '7d')
            startDate.setDate(startDate.getDate() - 7);
        else if (period === '30d')
            startDate.setDate(startDate.getDate() - 30);
        else if (period === '90d')
            startDate.setDate(startDate.getDate() - 90);
        let reportData = {
            generatedAt: new Date(),
            period: { start: startDate, end: new Date() }
        };
        if (type === 'users' || type === 'all') {
            reportData.users = {
                total: await User.countDocuments(),
                byRole: await User.aggregate([
                    { $group: { _id: '$role', count: { $sum: 1 } } }
                ]),
                newInPeriod: await User.countDocuments({ createdAt: { $gte: startDate } })
            };
        }
        if (type === 'agencies' || type === 'all') {
            reportData.agencies = {
                total: await Agency.countDocuments(),
                verified: await Agency.countDocuments({ isVerified: true }),
                pending: await Agency.countDocuments({ verificationStatus: 'pending' }),
                topPerformers: await Agency.find({ isVerified: true })
                    .sort({ totalBookings: -1 })
                    .limit(10)
                    .select('name totalBookings totalWasteCollected rating')
            };
        }
        if (type === 'bookings' || type === 'all') {
            reportData.bookings = {
                total: await Booking.countDocuments({ createdAt: { $gte: startDate } }),
                byStatus: await Booking.aggregate([
                    { $match: { createdAt: { $gte: startDate } } },
                    { $group: { _id: '$status', count: { $sum: 1 } } }
                ]),
                totalWaste: (await Booking.aggregate([
                    { $match: { status: 'completed', createdAt: { $gte: startDate } } },
                    { $group: { _id: null, total: { $sum: '$totalWeight' } } }
                ]))[0]?.total || 0
            };
        }
        sendSuccess(res, reportData);
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// ==========================================
// SYSTEM MANAGEMENT
// ==========================================
// Get system health
export const getSystemHealth = async (req, res) => {
    try {
        const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
        // Get collection counts
        const [users, agencies, bookings, notifications] = await Promise.all([
            User.estimatedDocumentCount(),
            Agency.estimatedDocumentCount(),
            Booking.estimatedDocumentCount(),
            Notification.estimatedDocumentCount()
        ]);
        sendSuccess(res, {
            status: 'healthy',
            database: {
                status: dbStatus,
                collections: { users, agencies, bookings, notifications }
            },
            uptime: process.uptime(),
            memoryUsage: process.memoryUsage(),
            timestamp: new Date()
        });
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Send system notification to all users
export const sendSystemNotification = async (req, res) => {
    try {
        const { title, message, priority = 'normal', targetRole } = req.body;
        let userFilter = {};
        if (targetRole) {
            userFilter.role = targetRole;
        }
        const users = await User.find(userFilter).select('_id');
        const notifications = users.map(user => ({
            userId: user._id,
            type: 'system',
            title,
            message,
            priority
        }));
        await Notification.insertMany(notifications);
        sendSuccess(res, {
            message: `Notification sent to ${users.length} users`,
            recipientCount: users.length
        });
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Suspend user
export const suspendUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { reason } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return sendError(res, 'User not found', 404);
        }
        if (user.role === 'admin') {
            return sendError(res, 'Cannot suspend admin users', 403);
        }
        user.suspended = true;
        user.suspendedAt = new Date();
        user.suspendedReason = reason || 'Account suspended by administrator';
        await user.save();
        // Send notification to user
        await Notification.create({
            userId: user._id,
            title: 'Account Suspended',
            message: `Your account has been suspended. Reason: ${user.suspendedReason}`,
            type: 'alert',
            priority: 'high'
        });
        sendSuccess(res, {
            message: 'User suspended successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                suspended: user.suspended,
                suspendedReason: user.suspendedReason
            }
        });
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Unsuspend user
export const unsuspendUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return sendError(res, 'User not found', 404);
        }
        user.suspended = false;
        user.suspendedAt = undefined;
        user.suspendedReason = undefined;
        await user.save();
        // Send notification to user
        await Notification.create({
            userId: user._id,
            title: 'Account Restored',
            message: 'Your account has been restored. You can now access all features.',
            type: 'success',
            priority: 'normal'
        });
        sendSuccess(res, {
            message: 'User unsuspended successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                suspended: user.suspended
            }
        });
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Suspend agency
export const suspendAgency = async (req, res) => {
    try {
        const { agencyId } = req.params;
        const { reason } = req.body;
        const agency = await Agency.findById(agencyId);
        if (!agency) {
            return sendError(res, 'Agency not found', 404);
        }
        agency.suspended = true;
        agency.suspendedAt = new Date();
        agency.suspendedReason = reason || 'Agency suspended by administrator';
        await agency.save();
        // Send notification to agency owner
        await Notification.create({
            userId: agency.userId,
            title: 'Agency Suspended',
            message: `Your agency "${agency.name}" has been suspended. Reason: ${agency.suspendedReason}`,
            type: 'alert',
            priority: 'high'
        });
        sendSuccess(res, {
            message: 'Agency suspended successfully',
            agency: {
                _id: agency._id,
                name: agency.name,
                suspended: agency.suspended,
                suspendedReason: agency.suspendedReason
            }
        });
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Unsuspend agency
export const unsuspendAgency = async (req, res) => {
    try {
        const { agencyId } = req.params;
        const agency = await Agency.findById(agencyId);
        if (!agency) {
            return sendError(res, 'Agency not found', 404);
        }
        agency.suspended = false;
        agency.suspendedAt = undefined;
        agency.suspendedReason = undefined;
        await agency.save();
        // Send notification to agency owner
        await Notification.create({
            userId: agency.userId,
            title: 'Agency Restored',
            message: `Your agency "${agency.name}" has been restored. You can now access all features.`,
            type: 'success',
            priority: 'normal'
        });
        sendSuccess(res, {
            message: 'Agency unsuspended successfully',
            agency: {
                _id: agency._id,
                name: agency.name,
                suspended: agency.suspended
            }
        });
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Send message to user
export const sendMessageToUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { title, message, priority } = req.body;
        if (!title || !message) {
            return sendError(res, 'Title and message are required', 400);
        }
        const user = await User.findById(userId);
        if (!user) {
            return sendError(res, 'User not found', 404);
        }
        const notification = await Notification.create({
            userId: user._id,
            title,
            message,
            type: 'info',
            priority: priority || 'normal'
        });
        sendSuccess(res, {
            message: 'Message sent successfully',
            notification: {
                _id: notification._id,
                title: notification.title,
                message: notification.message,
                recipient: {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                }
            }
        });
    }
    catch (error) {
        sendError(res, error.message);
    }
};
// Send message to agency
export const sendMessageToAgency = async (req, res) => {
    try {
        const { agencyId } = req.params;
        const { title, message, priority } = req.body;
        if (!title || !message) {
            return sendError(res, 'Title and message are required', 400);
        }
        const agency = await Agency.findById(agencyId);
        if (!agency) {
            return sendError(res, 'Agency not found', 404);
        }
        const notification = await Notification.create({
            userId: agency.userId,
            title,
            message,
            type: 'info',
            priority: priority || 'normal'
        });
        sendSuccess(res, {
            message: 'Message sent successfully',
            notification: {
                _id: notification._id,
                title: notification.title,
                message: notification.message,
                recipient: {
                    _id: agency._id,
                    name: agency.name,
                    email: agency.email
                }
            }
        });
    }
    catch (error) {
        sendError(res, error.message);
    }
};
