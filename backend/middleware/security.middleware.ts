import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

// Rate limiting for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    error: 'Too many login attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for general API endpoints
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiting for expensive operations
export const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 requests per hour
  message: {
    success: false,
    error: 'Too many requests. Please try again after an hour.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Input validation middleware
export const validateInput = (req: Request, res: Response, next: NextFunction) => {
  // Check for common XSS patterns
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi
  ];

  const checkXSS = (obj: any): boolean => {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        for (const pattern of xssPatterns) {
          if (pattern.test(obj[key])) {
            return true;
          }
        }
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        if (checkXSS(obj[key])) {
          return true;
        }
      }
    }
    return false;
  };

  if (checkXSS(req.body) || checkXSS(req.query) || checkXSS(req.params)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid input detected. Please remove any scripts or malicious content.'
    });
  }

  next();
};

// Request size validation
export const validateRequestSize = (req: Request, res: Response, next: NextFunction) => {
  const contentLength = req.headers['content-length'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (contentLength && parseInt(contentLength) > maxSize) {
    return res.status(413).json({
      success: false,
      error: 'Request payload too large. Maximum size is 10MB.'
    });
  }

  next();
};

// Pagination helper
export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export const parsePagination = (req: Request): PaginationParams => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10)); // Max 100 items per page
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

// Add pagination metadata to response
export const addPaginationMeta = (
  total: number,
  page: number,
  limit: number
) => {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
};

// Security headers middleware
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Remove fingerprinting headers
  res.removeHeader('X-Powered-By');
  
  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  next();
};

// SQL Injection prevention for MongoDB
export const sanitizeMongoOperators = (req: Request, res: Response, next: NextFunction) => {
  const sanitize = (obj: any): any => {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    if (Array.isArray(obj)) {
      return obj.map(item => sanitize(item));
    }
    
    const sanitized: any = {};
    for (const key in obj) {
      // Remove $ operators from user input
      if (key.startsWith('$')) {
        continue;
      }
      sanitized[key] = sanitize(obj[key]);
    }
    return sanitized;
  };

  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  req.params = sanitize(req.params);
  
  next();
};
