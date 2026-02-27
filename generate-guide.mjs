import PDFDocument from 'pdfkit';
import fs from 'fs';

const doc = new PDFDocument({ 
  size: 'A4', 
  margins: { top: 50, bottom: 50, left: 55, right: 55 },
  info: {
    Title: 'EcoCycle Backend Enhancement Guide',
    Author: 'Backend Architecture Review',
    Subject: 'Making Your Backend Top 1%'
  }
});

const stream = fs.createWriteStream('Backend_Enhancement_Guide.pdf');
doc.pipe(stream);

// Colors
const PRIMARY = '#0f172a';
const ACCENT = '#10b981';
const HIGH = '#ef4444';
const MEDIUM = '#f59e0b';
const LOW = '#3b82f6';
const GRAY = '#64748b';
const LIGHT_BG = '#f8fafc';

// Helper functions
function heading(text, size = 22) {
  doc.moveDown(0.5);
  doc.fontSize(size).fillColor(PRIMARY).font('Helvetica-Bold').text(text);
  doc.moveTo(doc.x, doc.y + 4).lineTo(doc.x + 485, doc.y + 4).strokeColor(ACCENT).lineWidth(2).stroke();
  doc.moveDown(0.6);
}

function subheading(text) {
  doc.moveDown(0.3);
  doc.fontSize(13).fillColor(PRIMARY).font('Helvetica-Bold').text(text);
  doc.moveDown(0.3);
}

function body(text) {
  doc.fontSize(10).fillColor('#334155').font('Helvetica').text(text, { lineGap: 3 });
}

function bullet(text, indent = 15) {
  doc.fontSize(10).fillColor('#334155').font('Helvetica').text(`•  ${text}`, doc.x + indent, doc.y, { lineGap: 2, indent: 0 });
}

function priorityBadge(level) {
  const colors = { 'HIGH': HIGH, 'MEDIUM': MEDIUM, 'LOW': LOW };
  const color = colors[level] || GRAY;
  const x = doc.x;
  const y = doc.y;
  doc.roundedRect(x, y, 50, 16, 3).fill(color);
  doc.fontSize(8).fillColor('#ffffff').font('Helvetica-Bold').text(level, x + 6, y + 3, { width: 40 });
  doc.fillColor('#334155');
  doc.y = y;
  doc.x = x;
}

function codeBlock(code) {
  const lines = code.split('\n');
  const blockHeight = lines.length * 13 + 16;
  const x = doc.x;
  const y = doc.y;
  doc.roundedRect(x, y, 485, blockHeight, 4).fill('#1e293b');
  doc.fontSize(8.5).fillColor('#e2e8f0').font('Courier');
  let lineY = y + 8;
  for (const line of lines) {
    doc.text(line, x + 12, lineY, { width: 460 });
    lineY += 13;
  }
  doc.y = y + blockHeight + 8;
  doc.x = x;
  doc.fillColor('#334155').font('Helvetica');
}

function tableRow(cols, widths, isHeader = false) {
  const x = doc.x;
  const y = doc.y;
  const font = isHeader ? 'Helvetica-Bold' : 'Helvetica';
  const bg = isHeader ? '#0f172a' : null;
  const fg = isHeader ? '#ffffff' : '#334155';
  const rowHeight = 22;
  
  if (bg) {
    doc.rect(x, y, widths.reduce((a, b) => a + b, 0), rowHeight).fill(bg);
  } else {
    doc.rect(x, y, widths.reduce((a, b) => a + b, 0), rowHeight).fill(doc._tableRowIdx % 2 === 0 ? '#f8fafc' : '#ffffff');
  }
  
  let cx = x;
  for (let i = 0; i < cols.length; i++) {
    doc.fontSize(9).fillColor(fg).font(font).text(cols[i], cx + 6, y + 6, { width: widths[i] - 12 });
    cx += widths[i];
  }
  doc.y = y + rowHeight;
  doc.x = x;
  if (!isHeader) doc._tableRowIdx = (doc._tableRowIdx || 0) + 1;
}

function checkPage(needed = 100) {
  if (doc.y + needed > 750) {
    doc.addPage();
  }
}

// ============================================================
// COVER PAGE
// ============================================================
doc.rect(0, 0, 595, 842).fill('#0f172a');

doc.fontSize(10).fillColor(ACCENT).font('Helvetica-Bold').text('BACKEND ARCHITECTURE REVIEW', 55, 220, { align: 'center' });
doc.moveDown(0.5);
doc.fontSize(32).fillColor('#ffffff').font('Helvetica-Bold').text('EcoCycle Backend', { align: 'center' });
doc.fontSize(32).fillColor(ACCENT).font('Helvetica-Bold').text('Enhancement Guide', { align: 'center' });
doc.moveDown(1);
doc.moveTo(200, doc.y).lineTo(395, doc.y).strokeColor(ACCENT).lineWidth(2).stroke();
doc.moveDown(1);
doc.fontSize(14).fillColor('#94a3b8').font('Helvetica').text('A comprehensive roadmap to transform your', { align: 'center' });
doc.text('backend into a top 1% production-grade system', { align: 'center' });
doc.moveDown(3);

doc.fontSize(11).fillColor('#64748b').font('Helvetica');
doc.text('Project: EcoCycle E-Waste Management Platform', { align: 'center' });
doc.text('Stack: Node.js + Express 5 + MongoDB + Mongoose', { align: 'center' });
doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, { align: 'center' });

doc.moveDown(6);
doc.fontSize(9).fillColor('#475569').font('Helvetica');
doc.text('11 Enhancement Areas  •  50+ Code Examples  •  Priority-Ranked', { align: 'center' });

// ============================================================
// TABLE OF CONTENTS
// ============================================================
doc.addPage();
heading('Table of Contents', 24);
doc.moveDown(0.5);

const toc = [
  ['1', 'Current Project Assessment', 'What you already have'],
  ['2', 'Custom Error Handling System', 'HIGH PRIORITY'],
  ['3', 'Input Validation with Zod', 'HIGH PRIORITY'],
  ['4', 'Structured Logging with Winston', 'HIGH PRIORITY'],
  ['5', 'API Documentation with Swagger', 'HIGH PRIORITY'],
  ['6', 'Automated Testing (Jest + Supertest)', 'HIGH PRIORITY'],
  ['7', 'Environment Validation & Graceful Shutdown', 'MEDIUM PRIORITY'],
  ['8', 'API Versioning & Response Compression', 'MEDIUM PRIORITY'],
  ['9', 'Background Job Processing', 'MEDIUM PRIORITY'],
  ['10', 'Docker & Containerization', 'LOW PRIORITY'],
  ['11', 'Implementation Roadmap', 'Step-by-step plan'],
];

for (const [num, title, desc] of toc) {
  doc.fontSize(12).fillColor(PRIMARY).font('Helvetica-Bold').text(`${num}.  ${title}`, { continued: true });
  doc.fontSize(10).fillColor(GRAY).font('Helvetica').text(`   — ${desc}`);
  doc.moveDown(0.3);
}

// ============================================================
// SECTION 1: CURRENT ASSESSMENT
// ============================================================
doc.addPage();
heading('1. Current Project Assessment');

body('Before making changes, here is what your project already does well and where it falls short.');
doc.moveDown(0.5);

subheading('What You Already Have (Strengths)');
const strengths = [
  'Express 5 REST API with MVC architecture (11 route groups, 14 models, 11 controllers)',
  'JWT authentication with bcrypt password hashing and role-based access control (4 roles)',
  '6 distinct rate limiters (auth, API, admin, bulk, strict, protected routes)',
  'Security middleware stack: Helmet, CORS, HPP, XSS prevention, NoSQL injection prevention',
  'MongoDB aggregation pipelines ($lookup, $unwind, $group, $match, $dateToString)',
  'PDF certificate generation with PDFKit (multi-page, stamps, tables, signatures)',
  'Cloudinary integration for image management',
  'Consistent response format via utility helpers',
  'Database seeding scripts (800+ lines of realistic test data)',
  'Pagination across all list endpoints',
];
for (const s of strengths) { bullet(s); doc.moveDown(0.15); }

doc.moveDown(0.5);
subheading('What Is Missing (Gaps)');

doc._tableRowIdx = 0;
const gapWidths = [140, 80, 265];
tableRow(['Missing Feature', 'Priority', 'Why It Matters'], gapWidths, true);
const gaps = [
  ['Automated Tests', 'HIGH', 'Every backend role expects test coverage. No tests = instant red flag.'],
  ['Input Validation (Zod/Joi)', 'HIGH', 'Ad-hoc regex validation is fragile. Need schema-level validation.'],
  ['API Documentation', 'HIGH', 'No Swagger = no discoverability. Interviewers check for this.'],
  ['Structured Logging', 'HIGH', 'console.log is not production logging. Need Winston/Pino.'],
  ['Custom Error Classes', 'HIGH', 'Generic try/catch with strings. Need AppError hierarchy.'],
  ['Environment Validation', 'MEDIUM', 'No startup checks for required env vars.'],
  ['Graceful Shutdown', 'MEDIUM', 'No SIGTERM handling = data corruption risk on deploy.'],
  ['API Versioning', 'MEDIUM', 'No /api/v1/ prefix = breaking changes hurt clients.'],
  ['Response Compression', 'MEDIUM', 'No gzip = larger payloads over the wire.'],
  ['Background Jobs', 'MEDIUM', 'PDF generation & notifications should be async.'],
  ['Docker Setup', 'LOW', 'Containerization shows DevOps awareness.'],
  ['Email Service', 'LOW', 'No Nodemailer for password resets, confirmations.'],
  ['Caching (Redis)', 'LOW', 'No caching layer for expensive queries.'],
  ['WebSockets', 'LOW', 'No real-time notifications.'],
];
for (const g of gaps) { 
  checkPage(25);
  tableRow(g, gapWidths); 
}

// ============================================================
// SECTION 2: CUSTOM ERROR HANDLING
// ============================================================
doc.addPage();
heading('2. Custom Error Handling System');

priorityBadge('HIGH');
doc.moveDown(1.2);

body('Replace generic try/catch with a structured error class hierarchy. This gives you consistent error responses, proper HTTP status codes, and operational vs programming error distinction.');
doc.moveDown(0.5);

subheading('Step 1: Create backend/utils/AppError.js');
codeBlock(`class AppError extends Error {
  constructor(message, statusCode, errorCode = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.status = statusCode >= 500 ? 'error' : 'fail';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Pre-built error factories
export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(\`\${resource} not found\`, 404, 'NOT_FOUND');
  }
}

export class ValidationError extends AppError {
  constructor(message, errors = []) {
    super(message, 400, 'VALIDATION_ERROR');
    this.errors = errors;
  }
}

export class UnauthorizedError extends AppError {
  constructor(msg = 'Not authenticated') {
    super(msg, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(msg = 'Not authorized') {
    super(msg, 403, 'FORBIDDEN');
  }
}

export class ConflictError extends AppError {
  constructor(msg = 'Resource already exists') {
    super(msg, 409, 'CONFLICT');
  }
}

export class RateLimitError extends AppError {
  constructor() {
    super('Too many requests', 429, 'RATE_LIMITED');
  }
}

export default AppError;`);

checkPage(200);
subheading('Step 2: Create backend/middleware/errorHandler.js');
codeBlock(`import AppError from '../utils/AppError.js';
import logger from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  // Log error
  if (err.statusCode >= 500) {
    logger.error('Server Error', {
      error: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    err = new AppError(
      \`Duplicate value for \${field}\`, 409, 'DUPLICATE_KEY'
    );
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors)
      .map(e => ({ field: e.path, message: e.message }));
    err = new AppError('Validation failed', 400, 'VALIDATION_ERROR');
    err.errors = errors;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError')
    err = new AppError('Invalid token', 401, 'INVALID_TOKEN');
  if (err.name === 'TokenExpiredError')
    err = new AppError('Token expired', 401, 'TOKEN_EXPIRED');

  res.status(err.statusCode).json({
    success: false,
    error: {
      code: err.errorCode || 'INTERNAL_ERROR',
      message: err.isOperational ? err.message
        : 'Something went wrong',
      ...(err.errors && { details: err.errors }),
      ...(process.env.NODE_ENV === 'development'
        && { stack: err.stack })
    }
  });
};

export default errorHandler;`);

checkPage(120);
subheading('Step 3: Use in Controllers (Before vs After)');
doc.fontSize(10).fillColor(HIGH).font('Helvetica-Bold').text('BEFORE (current code):');
doc.moveDown(0.2);
codeBlock(`export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false, error: 'User not found'
      });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({
      success: false, error: 'Server error'
    });
  }
};`);

doc.fontSize(10).fillColor(ACCENT).font('Helvetica-Bold').text('AFTER (with AppError + asyncHandler):');
doc.moveDown(0.2);
codeBlock(`import { NotFoundError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new NotFoundError('User');
  res.json({ success: true, data: user });
});`);

checkPage(80);
subheading('asyncHandler utility (backend/utils/asyncHandler.js)');
codeBlock(`export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);`);

body('This eliminates try/catch from every controller. Errors bubble to the global error handler automatically.');

// ============================================================
// SECTION 3: ZOD VALIDATION
// ============================================================
doc.addPage();
heading('3. Input Validation with Zod');

priorityBadge('HIGH');
doc.moveDown(1.2);

body('Replace ad-hoc regex validation with Zod schemas. Zod provides type-safe, composable validation with clear error messages.');
doc.moveDown(0.5);

subheading('Install');
codeBlock(`npm install zod`);

subheading('Step 1: Create validation schemas (backend/validators/auth.validator.js)');
codeBlock(`import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(50)
      .regex(/^[a-zA-Z\\s]+$/, 'Name must contain only letters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(8)
      .regex(/[A-Z]/, 'Must contain uppercase letter')
      .regex(/[0-9]/, 'Must contain a number')
      .regex(/[^a-zA-Z0-9]/, 'Must contain special character'),
    role: z.enum(['resident', 'partner', 'business'])
      .optional().default('resident'),
    phone: z.string()
      .regex(/^\\+?[1-9]\\d{7,14}$/, 'Invalid phone')
      .optional()
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1, 'Password is required')
  })
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8)
      .regex(/[A-Z]/, 'Must contain uppercase')
      .regex(/[0-9]/, 'Must contain a number')
  })
});`);

checkPage(250);
subheading('Step 2: Create validation middleware (backend/middleware/validate.js)');
codeBlock(`import { ValidationError } from '../utils/AppError.js';

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params
  });

  if (!result.success) {
    const errors = result.error.issues.map(issue => ({
      field: issue.path.join('.'),
      message: issue.message
    }));
    throw new ValidationError('Validation failed', errors);
  }

  next();
};`);

subheading('Step 3: Use in Routes');
codeBlock(`import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);`);

checkPage(200);
subheading('More Validation Schemas to Create');

doc._tableRowIdx = 0;
const valWidths = [160, 325];
tableRow(['File', 'Schemas to Define'], valWidths, true);
const valSchemas = [
  ['booking.validator.js', 'createBookingSchema, updateStatusSchema, cancelBookingSchema'],
  ['agency.validator.js', 'registerAgencySchema, updateProfileSchema, updateSlotsSchema'],
  ['business.validator.js', 'createInventorySchema, updateInventorySchema, bulkUpdateSchema'],
  ['admin.validator.js', 'updateUserSchema, vetAgencySchema, broadcastSchema'],
  ['common.validator.js', 'paginationSchema, mongoIdSchema (reusable)'],
];
for (const v of valSchemas) { tableRow(v, valWidths); }

// ============================================================
// SECTION 4: STRUCTURED LOGGING
// ============================================================
doc.addPage();
heading('4. Structured Logging with Winston');

priorityBadge('HIGH');
doc.moveDown(1.2);

body('Replace all console.log/error with Winston. Structured logging gives you JSON logs with timestamps, log levels, request IDs, and file output for production.');
doc.moveDown(0.5);

subheading('Install');
codeBlock(`npm install winston`);

subheading('Create backend/utils/logger.js');
codeBlock(`import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'ecocycle-api' },
  transports: [
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880,  // 5MB
      maxFiles: 5
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880,
      maxFiles: 5
    })
  ]
});

// Console output in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

export default logger;`);

checkPage(160);
subheading('Create Request Logger Middleware (backend/middleware/requestLogger.js)');
codeBlock(`import { randomUUID } from 'crypto';
import logger from '../utils/logger.js';

export const requestLogger = (req, res, next) => {
  req.requestId = randomUUID();
  const start = Date.now();

  res.on('finish', () => {
    logger.info('Request completed', {
      requestId: req.requestId,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: Date.now() - start + 'ms',
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id || 'anonymous'
    });
  });

  next();
};`);

subheading('Usage in app.js');
codeBlock(`import { requestLogger } from './middleware/requestLogger.js';
app.use(requestLogger);  // Add before routes`);

// ============================================================
// SECTION 5: SWAGGER
// ============================================================
doc.addPage();
heading('5. API Documentation with Swagger');

priorityBadge('HIGH');
doc.moveDown(1.2);

body('Add interactive API documentation that auto-generates from JSDoc comments. This is the single most visible improvement for portfolio reviewers.');
doc.moveDown(0.5);

subheading('Install');
codeBlock(`npm install swagger-jsdoc swagger-ui-express`);

subheading('Create backend/config/swagger.js');
codeBlock(`import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EcoCycle API',
      version: '1.0.0',
      description: 'E-Waste Management Platform REST API',
      contact: { name: 'Your Name', email: 'you@email.com' }
    },
    servers: [
      { url: '/api/v1', description: 'Version 1' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string' },
                message: { type: 'string' }
              }
            }
          }
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./backend/routes/*.js']
};

export const swaggerSpec = swaggerJsdoc(options);`);

checkPage(200);
subheading('Add JSDoc to Routes (example: auth.routes.js)');
codeBlock(`/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               role:
 *                 type: string
 *                 enum: [resident, partner, business]
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 */
router.post('/register', validate(registerSchema), register);`);

checkPage(60);
subheading('Mount in app.js');
codeBlock(`import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));`);

body('Access documentation at: http://localhost:3001/api-docs');

// ============================================================
// SECTION 6: TESTING
// ============================================================
doc.addPage();
heading('6. Automated Testing (Jest + Supertest)');

priorityBadge('HIGH');
doc.moveDown(1.2);

body('This is the #1 missing feature. Add unit tests for utilities and integration tests for API endpoints. Even 20-30 tests dramatically improve the project.');
doc.moveDown(0.5);

subheading('Install');
codeBlock(`npm install --save-dev jest @jest/globals supertest`);

subheading('Add to package.json');
codeBlock(`"scripts": {
  "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js",
  "test:watch": "npm test -- --watch",
  "test:coverage": "npm test -- --coverage"
}`);

subheading('Create jest.config.js');
codeBlock(`export default {
  testEnvironment: 'node',
  transform: {},
  extensionsToTreatAsEsm: [],
  testMatch: ['**/__tests__/**/*.js', '**/*.test.js'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'backend/**/*.js',
    '!backend/seeds/**',
    '!backend/utils/seed.js'
  ]
};`);

checkPage(250);
subheading('Example: Auth Integration Test (backend/__tests__/auth.test.js)');
codeBlock(`import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';

let server;

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_MONGODB_URI);
  server = app;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('POST /api/auth/register', () => {
  it('should register a new user', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Test@1234',
        role: 'resident'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe('test@example.com');
  });

  it('should reject duplicate email', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Test@1234'
      });

    expect(res.statusCode).toBe(409);
  });

  it('should reject weak password', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({
        name: 'Test', email: 'a@b.com', password: '123'
      });

    expect(res.statusCode).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  it('should login with valid credentials', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'Test@1234'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.token).toBeDefined();
  });

  it('should reject invalid password', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrong' });

    expect(res.statusCode).toBe(401);
  });
});`);

checkPage(150);
subheading('Recommended Test Files to Create');

doc._tableRowIdx = 0;
const testWidths = [220, 80, 185];
tableRow(['Test File', 'Tests', 'What to Cover'], testWidths, true);
const tests = [
  ['__tests__/auth.test.js', '8-10', 'Register, login, profile, password change'],
  ['__tests__/booking.test.js', '8-10', 'Create, list, cancel, complete, limits'],
  ['__tests__/agency.test.js', '5-7', 'List, detail, register, dashboard'],
  ['__tests__/admin.test.js', '5-7', 'Dashboard stats, user CRUD, vetting'],
  ['__tests__/business.test.js', '5-7', 'Inventory CRUD, certificates, analytics'],
  ['__tests__/middleware.test.js', '5-6', 'Auth middleware, validation, rate limit'],
  ['__tests__/utils.test.js', '3-4', 'AppError, response helpers, asyncHandler'],
];
for (const t of tests) { tableRow(t, testWidths); }

doc.moveDown(0.5);
body('Target: 40-50 tests with >70% code coverage. Run with: npm test -- --coverage');

// ============================================================
// SECTION 7: ENV VALIDATION + GRACEFUL SHUTDOWN
// ============================================================
doc.addPage();
heading('7. Environment Validation & Graceful Shutdown');

priorityBadge('MEDIUM');
doc.moveDown(1.2);

subheading('Validate Required Env Vars on Startup (backend/config/env.js)');
codeBlock(`const required = [
  'MONGODB_URI',
  'JWT_SECRET',
  'ADMIN_KEY',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
];

export function validateEnv() {
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    console.error('Missing required environment variables:');
    missing.forEach(key => console.error('  - ' + key));
    process.exit(1);
  }
}`);

subheading('Graceful Shutdown (update server.js)');
codeBlock(`import mongoose from 'mongoose';
import logger from './backend/utils/logger.js';

const server = app.listen(PORT, () => {
  logger.info(\`Server running on port \${PORT}\`);
});

// Graceful shutdown
const shutdown = async (signal) => {
  logger.info(\`\${signal} received. Starting graceful shutdown...\`);

  server.close(async () => {
    logger.info('HTTP server closed');
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');
    process.exit(0);
  });

  // Force shutdown after 10s
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  shutdown('UNHANDLED_REJECTION');
});`);

// ============================================================
// SECTION 8: API VERSIONING + COMPRESSION
// ============================================================
doc.addPage();
heading('8. API Versioning & Response Compression');

priorityBadge('MEDIUM');
doc.moveDown(1.2);

subheading('API Versioning');
body('Prefix all routes with /api/v1/ to allow future breaking changes without affecting existing clients.');
doc.moveDown(0.3);
codeBlock(`// In app.js - change this:
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

// To this:
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/bookings', bookingRoutes);

// Update Vite proxy to match:
// proxy: { '/api/v1': { target: 'http://localhost:3001' } }`);

doc.moveDown(0.5);
subheading('Response Compression');
codeBlock(`npm install compression`);
doc.moveDown(0.3);
codeBlock(`import compression from 'compression';

// Add before routes in app.js
app.use(compression({
  level: 6,
  threshold: 1024,     // Only compress responses > 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  }
}));`);

body('This reduces response sizes by 60-80% for JSON payloads. Visible in Network tab.');

// ============================================================
// SECTION 9: BACKGROUND JOBS
// ============================================================
doc.moveDown(1);
heading('9. Background Job Processing');

priorityBadge('MEDIUM');
doc.moveDown(1.2);

body('Move expensive operations (PDF generation, email sending, analytics computation) out of the request cycle. For a simpler approach without Redis, use a lightweight in-process queue.');
doc.moveDown(0.5);

subheading('Option A: Simple Async Queue (No Redis Required)');
codeBlock(`// backend/utils/jobQueue.js
class JobQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
  }

  add(jobFn, jobName = 'unnamed') {
    this.queue.push({ fn: jobFn, name: jobName });
    if (!this.processing) this.process();
  }

  async process() {
    this.processing = true;
    while (this.queue.length > 0) {
      const job = this.queue.shift();
      try {
        await job.fn();
        logger.info(\`Job completed: \${job.name}\`);
      } catch (err) {
        logger.error(\`Job failed: \${job.name}\`, err);
      }
    }
    this.processing = false;
  }
}

export const jobQueue = new JobQueue();`);

checkPage(100);
subheading('Usage: Move PDF generation to background');
codeBlock(`// In booking.controller.js (after completing a booking):
import { jobQueue } from '../utils/jobQueue.js';

// Instead of generating PDF inline:
jobQueue.add(
  () => generateCertificatePDF(bookingId, userId),
  \`generate-cert-\${bookingId}\`
);

// Return response immediately
res.json({ success: true, data: booking });`);

// ============================================================
// SECTION 10: DOCKER
// ============================================================
doc.addPage();
heading('10. Docker & Containerization');

priorityBadge('LOW');
doc.moveDown(1.2);

body('Add Docker support to show DevOps awareness. This lets anyone run your project with a single command.');
doc.moveDown(0.5);

subheading('Dockerfile');
codeBlock(`FROM node:22-alpine

WORKDIR /app

# Install dependencies first (cached layer)
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Build frontend
RUN npm run build

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s \\
  CMD wget --quiet --tries=1 --spider \\
    http://localhost:3001/api/v1/health || exit 1

CMD ["node", "server.js"]`);

subheading('docker-compose.yml');
codeBlock(`version: '3.8'

services:
  app:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/ecocycle
      - JWT_SECRET=\${JWT_SECRET}
    depends_on:
      mongo:
        condition: service_healthy

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    healthcheck:
      test: mongosh --eval "db.runCommand('ping')"
      interval: 10s
      timeout: 5s
      retries: 3

volumes:
  mongo_data:`);

subheading('.dockerignore');
codeBlock(`node_modules
dist
logs
coverage
.env
.git`);

body('Run with: docker-compose up --build');
body('This spins up both MongoDB and your app in isolated containers.');

// ============================================================
// SECTION 11: IMPLEMENTATION ROADMAP
// ============================================================
doc.addPage();
heading('11. Implementation Roadmap');

body('Follow this order for maximum impact with minimum risk. Each phase builds on the previous.');
doc.moveDown(0.5);

subheading('Phase 1: Foundation (Day 1-2)');
const phase1 = [
  'Create backend/utils/AppError.js — error class hierarchy',
  'Create backend/utils/asyncHandler.js — eliminate try/catch',
  'Create backend/middleware/errorHandler.js — global error handler',
  'Create backend/utils/logger.js — Winston setup',
  'Create backend/middleware/requestLogger.js — HTTP request logging',
  'Create backend/config/env.js — environment validation',
  'Update server.js — graceful shutdown + env validation',
  'Wire everything into backend/app.js',
];
for (const item of phase1) { bullet(item); doc.moveDown(0.1); }

doc.moveDown(0.3);
subheading('Phase 2: Validation & Docs (Day 3-4)');
const phase2 = [
  'npm install zod swagger-jsdoc swagger-ui-express compression',
  'Create backend/validators/ — all validation schemas',
  'Create backend/middleware/validate.js — validation middleware',
  'Create backend/config/swagger.js — Swagger config',
  'Add JSDoc annotations to all 11 route files',
  'Add compression middleware to app.js',
  'Add API versioning (/api → /api/v1)',
  'Update frontend api.js base URL to match',
];
for (const item of phase2) { bullet(item); doc.moveDown(0.1); }

doc.moveDown(0.3);
subheading('Phase 3: Testing (Day 5-7)');
const phase3 = [
  'npm install --save-dev jest @jest/globals supertest',
  'Create jest.config.js',
  'Write auth.test.js (8-10 tests)',
  'Write booking.test.js (8-10 tests)',
  'Write admin.test.js (5-7 tests)',
  'Write business.test.js (5-7 tests)',
  'Write middleware.test.js (5-6 tests)',
  'Run npm test -- --coverage and aim for >70%',
];
for (const item of phase3) { bullet(item); doc.moveDown(0.1); }

checkPage(180);
doc.moveDown(0.3);
subheading('Phase 4: Polish (Day 8-9)');
const phase4 = [
  'Create Dockerfile + docker-compose.yml + .dockerignore',
  'Create backend/utils/jobQueue.js for background processing',
  'Move PDF generation and notification creation to job queue',
  'Add health check endpoint: GET /api/v1/health',
  'Final review — ensure all controllers use asyncHandler + AppError',
  'Run full test suite and fix any failures',
];
for (const item of phase4) { bullet(item); doc.moveDown(0.1); }

// ============================================================
// FINAL SUMMARY
// ============================================================
doc.moveDown(1);
doc.moveTo(55, doc.y).lineTo(540, doc.y).strokeColor(ACCENT).lineWidth(2).stroke();
doc.moveDown(0.8);

doc.fontSize(14).fillColor(PRIMARY).font('Helvetica-Bold').text('After These Changes, Your Backend Will Have:');
doc.moveDown(0.5);

const finals = [
  'Custom error handling with AppError hierarchy + asyncHandler',
  'Zod schema validation on all endpoints',
  'Structured JSON logging with Winston (request logs, error logs)',
  'Interactive Swagger API documentation at /api-docs',
  '40-50 automated tests with >70% coverage',
  'Environment validation + graceful shutdown',
  'API versioning (/api/v1/) + gzip compression',
  'Background job queue for expensive operations',
  'Docker containerization with health checks',
];
for (const f of finals) { 
  checkPage(20);
  doc.fontSize(11).fillColor(ACCENT).font('Helvetica-Bold').text('✓ ', { continued: true });
  doc.fontSize(11).fillColor('#334155').font('Helvetica').text(f);
  doc.moveDown(0.15);
}

doc.moveDown(1);
body('These additions will put your backend in the top 1% of portfolio projects. Most candidates have basic CRUD — you will have production-grade architecture, test coverage, documentation, and DevOps awareness.');

// Done
doc.end();
stream.on('finish', () => {
  console.log('PDF generated: Backend_Enhancement_Guide.pdf');
});
