import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
// Import security middleware
import { validateInput, validateRequestSize, securityHeaders, sanitizeMongoOperators, antiDataFlood, validateDataStructure, validateStringLengths } from './middleware/security.middleware.js';
// Import routes
import authRoutes from './routes/auth.routes.js';
import slotRoutes from './routes/slots.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import agencyRoutes from './routes/agency.routes.js';
import rewardRoutes from './routes/reward.routes.js';
import certificateRoutes from './routes/certificate.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import adminRoutes from './routes/admin.routes.js';
import businessRoutes from './routes/business.routes.js';
import contactRoutes from './routes/contact.routes.js';
const app = express();
// Security Middleware
// Helmet - Set security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    crossOriginEmbedderPolicy: false,
}));
// Custom security headers
app.use(securityHeaders);
// CORS configuration
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'https://e-waste-frontened.onrender.com'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Length', 'X-Total-Count'],
    maxAge: 86400, // 24 hours
}));
// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Validate request size before processing
app.use(validateRequestSize);
// Prevent parameter pollution (must be after body parsing)
app.use(hpp());
// Anti data flooding - track cumulative data volume
app.use(antiDataFlood);
// Validate data structure complexity
app.use(validateDataStructure);
// Validate string field lengths
app.use(validateStringLengths);
// Sanitize MongoDB operators in body only (query/params handled by mongoSanitize)
app.use(sanitizeMongoOperators);
// Input validation
app.use(validateInput);
// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/agencies', agencyRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/contact', contactRoutes);
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'EcoCycle API is running' });
});
// Error handling middleware
app.use((err, req, res, next) => {
    res.status(500).json({
        success: false,
        error: err.message || 'Internal Server Error'
    });
});
export default app;
