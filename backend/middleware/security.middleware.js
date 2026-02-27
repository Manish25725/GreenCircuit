import rateLimit from 'express-rate-limit';
// Track data volume per IP to prevent data flooding
const dataVolumeTracker = new Map();
// Clean up old entries every hour
setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of dataVolumeTracker.entries()) {
        if (now > data.resetTime) {
            dataVolumeTracker.delete(ip);
        }
    }
}, 60 * 60 * 1000);
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
export const validateInput = (req, res, next) => {
    // Check for common XSS patterns
    const xssPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi
    ];
    const checkXSS = (obj) => {
        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                for (const pattern of xssPatterns) {
                    if (pattern.test(obj[key])) {
                        return true;
                    }
                }
            }
            else if (typeof obj[key] === 'object' && obj[key] !== null) {
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
export const validateRequestSize = (req, res, next) => {
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
// Data flooding protection - Track cumulative data volume per IP
export const antiDataFlood = (req, res, next) => {
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    const contentLength = parseInt(req.headers['content-length'] || '0');
    const now = Date.now();
    const windowMs = 60 * 60 * 1000; // 1 hour window
    const maxBytes = 100 * 1024 * 1024; // 100MB per hour per IP
    let tracker = dataVolumeTracker.get(clientIp);
    if (!tracker || now > tracker.resetTime) {
        tracker = { bytes: contentLength, resetTime: now + windowMs };
        dataVolumeTracker.set(clientIp, tracker);
        return next();
    }
    tracker.bytes += contentLength;
    if (tracker.bytes > maxBytes) {
        return res.status(429).json({
            success: false,
            error: 'Data volume limit exceeded. You have sent too much data in the last hour. Please try again later.',
            retryAfter: Math.ceil((tracker.resetTime - now) / 1000)
        });
    }
    next();
};
// Validate object/array depth and size to prevent deep nesting attacks
export const validateDataStructure = (req, res, next) => {
    const maxDepth = 10;
    const maxArrayLength = 1000;
    const maxObjectKeys = 100;
    const checkDepth = (obj, depth = 0) => {
        if (depth > maxDepth)
            return false;
        if (Array.isArray(obj)) {
            if (obj.length > maxArrayLength)
                return false;
            return obj.every(item => typeof item !== 'object' || item === null || checkDepth(item, depth + 1));
        }
        if (typeof obj === 'object' && obj !== null) {
            const keys = Object.keys(obj);
            if (keys.length > maxObjectKeys)
                return false;
            return keys.every(key => typeof obj[key] !== 'object' || obj[key] === null || checkDepth(obj[key], depth + 1));
        }
        return true;
    };
    if (req.body && !checkDepth(req.body)) {
        return res.status(400).json({
            success: false,
            error: 'Request data structure is too complex. Maximum depth: 10 levels, array size: 1000 items, object keys: 100.'
        });
    }
    next();
};
// Rate limiter for data-intensive operations (bulk operations, exports, etc.)
export const bulkOperationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Only 5 bulk operations per hour
    message: {
        success: false,
        error: 'Too many bulk operations. Please try again after an hour.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
// Validate string lengths to prevent buffer overflow
export const validateStringLengths = (req, res, next) => {
    const maxStringLength = 10000; // 10KB per string field
    const maxTextFieldLength = 100000; // 100KB for text fields (descriptions, etc.)
    const checkStrings = (obj, path = '') => {
        for (const key in obj) {
            const currentPath = path ? `${path}.${key}` : key;
            const value = obj[key];
            if (typeof value === 'string') {
                // Allow larger text for specific fields
                const textFields = ['description', 'content', 'body', 'message', 'notes'];
                const maxLen = textFields.includes(key.toLowerCase()) ? maxTextFieldLength : maxStringLength;
                if (value.length > maxLen) {
                    return `Field "${currentPath}" exceeds maximum length of ${maxLen} characters`;
                }
            }
            else if (typeof value === 'object' && value !== null) {
                const error = checkStrings(value, currentPath);
                if (error)
                    return error;
            }
        }
        return null;
    };
    const error = checkStrings(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            error
        });
    }
    next();
};
export const parsePagination = (req) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10)); // Max 100 items per page
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};
// Add pagination metadata to response
export const addPaginationMeta = (total, page, limit) => {
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
export const securityHeaders = (req, res, next) => {
    // Remove fingerprinting headers
    res.removeHeader('X-Powered-By');
    // Add security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
};
// NoSQL Injection prevention for MongoDB (Enhanced)
export const sanitizeMongoOperators = (req, res, next) => {
    const sanitize = (obj) => {
        if (typeof obj !== 'object' || obj === null)
            return obj;
        if (Array.isArray(obj)) {
            return obj.map(item => sanitize(item));
        }
        const sanitized = {};
        for (const key in obj) {
            // Remove MongoDB operators ($ne, $gt, etc.) and other dangerous patterns
            if (key.startsWith('$') || key.startsWith('__proto__') || key === 'constructor' || key === 'prototype') {
                continue;
            }
            // Also sanitize string values that contain MongoDB operators
            if (typeof obj[key] === 'string') {
                sanitized[key] = obj[key].replace(/\$/g, '_');
            }
            else {
                sanitized[key] = sanitize(obj[key]);
            }
        }
        return sanitized;
    };
    // Sanitize body only (query/params are read-only in newer Express)
    if (req.body) {
        req.body = sanitize(req.body);
    }
    next();
};
