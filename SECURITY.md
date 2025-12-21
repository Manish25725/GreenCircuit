# Security Implementation Guide

## Overview
Comprehensive security measures have been implemented to protect the EcoCycle API against common vulnerabilities and attacks.

## 🔒 Security Features Implemented

### 1. **Rate Limiting**
Prevents brute force attacks and API abuse by limiting requests per IP address.

#### Authentication Endpoints
- **Limit**: 5 requests per 15 minutes
- **Applies to**: `/api/auth/login`, `/api/auth/register`
- **Purpose**: Prevent brute force login attacks

#### Admin Endpoints
- **Limit**: 10 requests per hour (login), 50 requests per hour (operations)
- **Applies to**: `/api/auth/admin-login`, `/api/admin/*`
- **Purpose**: Stricter protection for admin access

#### Protected Routes (Authenticated)
- **Limit**: 200 requests per 15 minutes
- **Applies to**: All authenticated user requests
- **Purpose**: Prevent abuse from authenticated users

#### General API Endpoints
- **Limit**: 100 requests per 15 minutes
- **Applies to**: All `/api/*` routes
- **Purpose**: Prevent API abuse and DoS attacks

#### Auth Middleware Rate Limiting
- **Failed Auth Attempts**: 10 per 15 minutes per IP
- **Applies to**: JWT token validation failures
- **Purpose**: Prevent token brute forcing
- **Auto-cleanup**: Failed attempts reset after 15 minutes

### 2. **Input Validation & Sanitization**

#### XSS Protection
- Automatic detection and blocking of malicious scripts
- Filters `<script>` tags, `javascript:` protocol, and `on*` event handlers
- Applied to all request bodies, query parameters, and URL parameters

#### NoSQL Injection Prevention
- MongoDB operator sanitization (removes `$` operators from user input)
- Prevents query manipulation attacks
- Uses `express-mongo-sanitize` middleware

#### Parameter Pollution Prevention
- Uses `hpp` middleware to prevent HTTP Parameter Pollution
- Protects against duplicate parameter attacks

### 3. **Security Headers**
Implemented using Helmet.js:

```
✅ X-Content-Type-Options: nosniff
✅ X-Frame-Options: DENY
✅ X-XSS-Protection: 1; mode=block
✅ Strict-Transport-Security: max-age=31536000
✅ Content-Security-Policy
✅ Removes X-Powered-By header
```

### 4. **Request Size Limits**
- **Maximum request size**: 10MB per request
- **Applies to**: All POST/PUT requests
- **Purpose**: Prevent payload flooding attacks

### 5. **Data Flooding Protection** ✨ NEW
Comprehensive protection against data flooding attacks:

#### Cumulative Volume Tracking
- **Limit**: 100MB per hour per IP address
- **Purpose**: Prevent sustained data flooding
- **Tracking**: Cumulative data sent across all requests
- **Auto-reset**: Counters reset after 1 hour
- **Response**: 429 error with retry-after header

#### Data Structure Validation
- **Max object depth**: 10 levels
- **Max array length**: 1000 items per array
- **Max object keys**: 100 keys per object
- **Purpose**: Prevent deep nesting attacks and memory exhaustion

#### String Length Validation
- **Standard fields**: Max 10KB per string (10,000 characters)
- **Text fields** (description, content, body, message, notes): Max 100KB (100,000 characters)
- **Purpose**: Prevent buffer overflow and memory attacks
- **Validation**: Field-specific limits based on usage

#### Bulk Operation Rate Limiting
- **Limit**: 5 bulk operations per hour
- **Applies to**: 
  - `/api/business/inventory/bulk-update`
  - `/api/business/inventory/mark-pickup`
  - `/api/business/reports/export`
  - `/api/admin/reports/export`
- **Purpose**: Prevent resource exhaustion from large batch operations

### 6. **CORS Configuration**
```typescript
{
  origin: Whitelist of allowed domains
  credentials: true
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  allowedHeaders: ['Content-Type', 'Authorization']
  maxAge: 86400 (24 hours)
}
```

### 7. **Data Pagination**
Prevents loading excessive data that could cause server overload.

#### Default Pagination Settings
- **Default page size**: 10 items
- **Maximum page size**: 100 items
- **Minimum page size**: 1 item

#### Usage in API Responses
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 250,
    "page": 1,
    "limit": 10,
    "totalPages": 25,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

#### Paginated Endpoints
- ✅ GET `/api/admin/users` - User listing
- ✅ GET `/api/admin/agencies/pending` - Pending agencies
- ✅ GET `/api/bookings` - Booking history
- ✅ GET `/api/agencies` - Agency listing
- ✅ GET `/api/business/inventory` - Inventory items
- ✅ GET `/api/certificates` - Certificate history

### 8. **Authentication Security**

#### JWT Token Protection
- Tokens stored with HttpOnly flag (if using cookies)
- Token expiration: Configurable
- Refresh token mechanism recommended
- **IP-based rate limiting**: 10 failed attempts per 15 minutes
- **Automatic cleanup**: Failed auth attempts cleared hourly
- **Smart tracking**: Successful auth clears failed attempt counter

#### Password Security
- Bcrypt hashing with salt rounds
- Minimum password requirements enforced
- Password reset with time-limited tokens

#### Protected Routes
All sensitive endpoints require authentication via JWT middleware with built-in rate limiting:
```typescript
router.get('/profile', protect, getProfile);
```

#### Rate Limiting Layers
1. **Global API rate limit**: 100 req/15min (all endpoints)
2. **Auth endpoint limit**: 5 req/15min (login/register)
3. **Auth middleware limit**: 10 failed attempts/15min (token validation)
4. **Admin endpoint limit**: 50 req/hour (admin operations)
5. **Protected route limit**: 200 req/15min (authenticated users)

## � Comprehensive API Security Coverage

Every API endpoint in the application is now secured with appropriate authentication, authorization, and rate limiting:

### Public Endpoints (Rate Limited)
- **Agency Search**: `/api/agencies/search` - apiLimiter (100 req/15min)
- **Agency Listing**: `/api/agencies` - apiLimiter (100 req/15min)
- **Agency Public Profile**: `/api/agencies/public/:id` - apiLimiter (100 req/15min)
- **Certificate Verification**: `/api/certificates/verify/:code` - apiLimiter (100 req/15min)
- **Reward Listing**: `/api/rewards` - apiLimiter (100 req/15min)
- **Slot Viewing**: `/api/slots` - apiLimiter (100 req/15min)
- **Slot Indicators**: `/api/slots/indicators` - apiLimiter (100 req/15min)
- **Contact Form**: `/api/contact` - strictLimiter (10 req/hour)

### Authentication Endpoints (Strict Rate Limiting)
- **Login**: `/api/auth/login` - authLimiter (5 req/15min)
- **Register**: `/api/auth/register` - authLimiter (5 req/15min)
- **Admin Login**: `/api/auth/admin-login` - strictLimiter (10 req/hour)

### User Protected Endpoints (Authenticated + Rate Limited)
- **Profile Management**: `/api/auth/me`, `/api/auth/profile` - protect + apiLimiter
- **User Preferences**: `/api/auth/preferences/*` - protect + apiLimiter
- **Security Settings**: `/api/auth/security/*` - protect + apiLimiter
- **Bookings**: `/api/bookings/*` - protect + apiLimiter/strictLimiter
  - Booking creation: strictLimiter (10 req/hour)
  - Booking viewing: apiLimiter (100 req/15min)
- **Certificates**: `/api/certificates/*` - protect + apiLimiter
  - Certificate generation: strictLimiter (10 req/hour)
- **Notifications**: `/api/notifications/*` - protect + apiLimiter
- **Rewards**: `/api/rewards/redeem` - protect + strictLimiter (10 req/hour)
- **Reward History**: `/api/rewards/history` - protect + apiLimiter
- **Slot Booking**: `/api/slots/:id/book` - protect + strictLimiter (10 req/hour)

### Agency Protected Endpoints (Role: agency)
- **Agency Profile**: `/api/agency/profile/me` - protect + authorize('agency') + apiLimiter
- **Agency Dashboard**: `/api/agency/dashboard/me` - protect + authorize('agency') + apiLimiter
- **Agency Bookings**: `/api/agency/bookings/me` - protect + authorize('agency') + apiLimiter
- **Agency Analytics**: `/api/agency/analytics/me` - protect + authorize('agency') + apiLimiter
- **Vetting Requests**: `/api/agency/vetting/*` - protect + authorize('agency') + apiLimiter
- **Slot Management**: `/api/slots` (POST/PUT/DELETE) - protect + authorize('agency', 'admin') + apiLimiter

### Business Protected Endpoints (Role: business)
- **Business Dashboard**: `/api/business/dashboard` - protect + authorize('business', 'admin') + apiLimiter
- **Business Profile**: `/api/business/profile` - protect + authorize('business', 'admin') + apiLimiter
- **Inventory Management**: `/api/business/inventory/*` - protect + authorize('business', 'admin') + apiLimiter
  - Bulk operations: bulkOperationLimiter (5 req/hour)
- **Business Certificates**: `/api/business/certificates/*` - protect + authorize('business', 'admin') + apiLimiter
- **Business Analytics**: `/api/business/analytics` - protect + authorize('business', 'admin') + apiLimiter
- **Report Export**: `/api/business/reports/export` - protect + authorize('business', 'admin') + bulkOperationLimiter (5 req/hour)
- **Business Bookings**: `/api/business/bookings` - protect + authorize('business', 'admin') + apiLimiter

### Admin Protected Endpoints (Role: admin) 🔒
**ALL admin endpoints require authentication and admin role authorization**:
- **Dashboard**: `/api/admin/dashboard` - protect + authorize('admin') + adminRateLimit (50 req/hour)
- **User Management**: `/api/admin/users/*` - protect + authorize('admin') + adminRateLimit
- **Agency Management**: `/api/admin/agencies/*` - protect + authorize('admin') + adminRateLimit
- **Vetting Management**: `/api/admin/vetting/*` - protect + authorize('admin') + adminRateLimit
- **Reports & Analytics**: `/api/admin/reports/*` - protect + authorize('admin') + adminRateLimit
  - Platform export: bulkOperationLimiter (5 req/hour)
- **System Management**: `/api/admin/system/*` - protect + authorize('admin') + adminRateLimit
- **Contact Management**: `/api/contact` (GET/PUT/DELETE) - protect + authorize('admin') + apiLimiter

### Analytics Endpoints (Protected)
- **Platform Analytics**: `/api/analytics` - protect + authorize('admin', 'agency', 'business') + apiLimiter

### Security Middleware Stack Order
All API requests pass through these security layers in order:
1. **Helmet** - Security headers
2. **CORS** - Origin validation
3. **Request Size Validation** - 10MB max
4. **Anti-Data Flood** - 100MB/hour per IP
5. **Data Structure Validation** - Depth, size, key limits
6. **String Length Validation** - Field-specific limits
7. **MongoDB Sanitization** - NoSQL injection prevention
8. **HPP** - Parameter pollution prevention
9. **XSS Validation** - Script injection prevention
10. **Route-specific Rate Limiters** - Per-endpoint limits
11. **Authentication Middleware** (if required) - JWT validation + IP tracking
12. **Authorization Middleware** (if required) - Role-based access control

### Rate Limiting Summary by Endpoint Type
| Endpoint Type | Rate Limit | Window | Purpose |
|--------------|------------|---------|----------|
| Authentication | 5 requests | 15 min | Prevent brute force |
| Admin Operations | 50 requests | 1 hour | Protect admin access |
| Bulk Operations | 5 requests | 1 hour | Prevent resource exhaustion |
| Strict Actions | 10 requests | 1 hour | High-value operations |
| General API | 100 requests | 15 min | Normal usage protection |
| Failed Auth | 10 attempts | 15 min | Token brute force prevention |

## �🛡️ Attack Prevention

### SQL/NoSQL Injection
**Protection**: 
- Input sanitization middleware
- MongoDB operator filtering
- Parameterized queries

**Example Attack Blocked**:
```json
// Malicious input
{ "email": { "$ne": null } }

// Sanitized to
{ "email": "[object Object]" }
```

### Cross-Site Scripting (XSS)
**Protection**:
- Content Security Policy headers
- Input validation for script tags
- Output encoding

**Example Attack Blocked**:
```json
{
  "name": "<script>alert('XSS')</script>"
}
// Returns: 400 Bad Request - Invalid input detected
```

### Cross-Site Request Forgery (CSRF)
**Protection**:
- SameSite cookie attributes
- Origin validation
- Token-based authentication

### Denial of Service (DoS)
**Protection**:
- Rate limiting
- Request size limits
- Pagination (prevents large data dumps)
- Connection timeouts

### Brute Force Attacks
**Protection**:
- Strict rate limiting on auth endpoints
- Account lockout after failed attempts (recommended)
- CAPTCHA integration (recommended for future)

## 📊 Monitoring & Logging

### Security Events to Monitor
- Failed login attempts
- Rate limit violations
- Blocked XSS/injection attempts
- Unusual traffic patterns
- Admin access

### Recommended Tools
- **Winston** or **Morgan** for request logging
- **Sentry** for error tracking
- **DataDog** for performance monitoring

## 🔧 Configuration

### Environment Variables
```env
# JWT
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRE=7d

# Rate Limiting (optional overrides)
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# Request Limits
MAX_REQUEST_SIZE=10mb
```

### Customizing Rate Limits
Edit `backend/middleware/security.middleware.ts`:

```typescript
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // Adjust as needed
  message: { success: false, error: 'Too many requests' }
});
```

## 🚀 Best Practices

### For Developers

1. **Always use middleware on protected routes**
   ```typescript
   router.get('/sensitive-data', protect, authLimiter, handler);
   ```

2. **Validate all user inputs**
   ```typescript
   if (!email || !password) {
     return res.status(400).json({ error: 'Missing required fields' });
   }
   ```

3. **Use pagination for list endpoints**
   ```typescript
   const { page, limit, skip } = parsePagination(req);
   const users = await User.find().skip(skip).limit(limit);
   ```

4. **Never expose sensitive data**
   ```typescript
   User.find().select('-password -resetToken');
   ```

5. **Handle errors gracefully**
   ```typescript
   try {
     // code
   } catch (error) {
     // Never expose stack traces in production
     res.status(500).json({ error: 'Internal server error' });
   }
   ```

### For Production Deployment

1. ✅ Set strong `JWT_SECRET` (32+ random characters)
2. ✅ Enable HTTPS only (Strict-Transport-Security header)
3. ✅ Use environment variables for all secrets
4. ✅ Enable MongoDB IP whitelist
5. ✅ Regular security audits (`npm audit`)
6. ✅ Keep dependencies updated
7. ✅ Enable CloudFlare or WAF for additional protection
8. ✅ Implement request logging
9. ✅ Set up monitoring and alerts
10. ✅ Regular backup strategy

## 📝 API Rate Limit Response

When rate limit is exceeded:
```json
{
  "success": false,
  "error": "Too many requests from this IP. Please try again later.",
  "retryAfter": 900
}
```

Headers included:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1640000000
Retry-After: 900
```

## 🔍 Testing Security

### Manual Testing
```bash
# Test rate limiting
for i in {1..10}; do
  curl -X POST http://localhost:3001/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done

# Test XSS protection
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"<script>alert(1)</script>","email":"test@test.com"}'

# Test pagination
curl "http://localhost:3001/api/admin/users?page=2&limit=50"
```

### Automated Testing
Use tools like:
- **OWASP ZAP** for vulnerability scanning
- **Postman** for API security testing
- **Artillery** for load testing

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Helmet.js Documentation](https://helmetjs.github.io/)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)

## 🆘 Security Issues

If you discover a security vulnerability:
1. **DO NOT** create a public GitHub issue
2. Email security concerns to: security@ecocycle.com
3. Provide detailed information and steps to reproduce
4. Allow time for patching before public disclosure
