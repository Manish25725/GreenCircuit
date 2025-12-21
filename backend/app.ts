import express from 'express';
import cors from 'cors';

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

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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