import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';

// Import security middleware
import { 
  apiLimiter, 
  validateInput, 
  validateRequestSize,
  securityHeaders,
  sanitizeMongoOperators
} from './middleware/security.middleware';

// Import routes
import authRoutes from './routes/auth.routes';
import slotRoutes from './routes/slots.routes';
import analyticsRoutes from './routes/analytics.routes';
import bookingRoutes from './routes/booking.routes';
import agencyRoutes from './routes/agency.routes';
import rewardRoutes from './routes/reward.routes';
import certificateRoutes from './routes/certificate.routes';
import notificationRoutes from './routes/notification.routes';
import adminRoutes from './routes/admin.routes';
import businessRoutes from './routes/business.routes';
import contactRoutes from './routes/contact.routes';

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
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://e-waste-frontened.onrender.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 hours
}));

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Prevent parameter pollution
app.use(hpp());

// Validate request size
app.use(validateRequestSize);

// Sanitize MongoDB operators
app.use(sanitizeMongoOperators);

// Input validation
app.use(validateInput);

// Rate limiting for all API routes
app.use('/api/', apiLimiter);

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
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: err.message || 'Internal Server Error' 
  });
});

export default app;