import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import User from '../models/User';
import Agency from '../models/Agency';

interface AuthRequest extends Request {
  user?: any;
}

// Rate limiter for failed authentication attempts
const failedAuthAttempts = new Map<string, { count: number; resetTime: number }>();

// Clean up old entries every hour
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of failedAuthAttempts.entries()) {
    if (now > data.resetTime) {
      failedAuthAttempts.delete(ip);
    }
  }
}, 60 * 60 * 1000);

// Check for suspicious authentication attempts
const checkAuthRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 10;

  const attempt = failedAuthAttempts.get(ip);
  
  if (!attempt) {
    failedAuthAttempts.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (now > attempt.resetTime) {
    failedAuthAttempts.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (attempt.count >= maxAttempts) {
    return false;
  }

  attempt.count++;
  return true;
};

// Record failed authentication
const recordFailedAuth = (ip: string) => {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const attempt = failedAuthAttempts.get(ip);
  
  if (!attempt) {
    failedAuthAttempts.set(ip, { count: 1, resetTime: now + windowMs });
  } else if (now <= attempt.resetTime) {
    attempt.count++;
  }
};

// Clear successful authentication
const clearFailedAuth = (ip: string) => {
  failedAuthAttempts.delete(ip);
};

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  
  // Check rate limit before processing
  if (!checkAuthRateLimit(clientIp)) {
    return res.status(429).json({ 
      success: false,
      error: 'Too many authentication attempts. Please try again after 15 minutes.' 
    });
  }

  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured');
      }
      
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        recordFailedAuth(clientIp);
        return res.status(401).json({ 
          success: false,
          error: 'User not found' 
        });
      }
      
      // Clear failed attempts on successful auth
      clearFailedAuth(clientIp);
      
      req.user = user;
      
      // If user is an agency, attach agency info
      if (user.role === 'agency') {
        const agency = await Agency.findOne({ userId: user._id });
        if (agency) {
          req.user.agencyId = agency._id;
        }
      }
      
      return next();
    } catch (error) {
      recordFailedAuth(clientIp);
      return res.status(401).json({ 
        success: false,
        error: 'Not authorized, token failed' 
      });
    }
  }

  if (!token) {
    recordFailedAuth(clientIp);
    return res.status(401).json({ 
      success: false,
      error: 'Not authorized, no token' 
    });
  }
};

// Middleware to check for specific roles
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        error: 'Not authorized' 
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        error: `Role ${req.user.role} is not authorized to access this route` 
      });
    }
    
    next();
  };
};

// Rate limiter specifically for admin endpoints
export const adminRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 requests per hour for admin operations
  message: {
    success: false,
    error: 'Too many admin requests. Please try again after an hour.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting if not an admin (will be caught by authorize middleware)
    const authReq = req as AuthRequest;
    return authReq.user?.role !== 'admin';
  }
});

// Rate limiter for protected routes (general authenticated requests)
export const protectedRouteLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requests per 15 minutes for authenticated users
  message: {
    success: false,
    error: 'Too many requests. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Optional auth - doesn't fail if no token
export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured');
      }
      
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Token invalid, but continue without user
    }
  }
  
  next();
};