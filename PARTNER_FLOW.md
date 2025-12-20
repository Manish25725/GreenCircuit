# Partner Registration & Approval Flow

## Overview
This document describes the complete partner registration and admin approval workflow in the EcoCycle platform.

## User Flow

### 1. Partner Sign Up
- User visits Login page and selects "Partner" role
- User enters name, email, password and clicks "Sign Up"
- System creates a user account with role='agency'
- **User is automatically redirected to Partner Registration Form** (#/partner/register)

### 2. Partner Registration Form
Location: `pages/PartnerRegistration.tsx`

The partner must fill out comprehensive details:
- **Basic Information:**
  - Agency Name
  - Head Name (Person in charge)
  - Email
  - Phone Number
  
- **Business Details:**
  - Business Type (Registered Company, Partnership, Proprietorship, NGO)
  - Established Year
  - GST Number (Required)
  - Udyam Certificate Number (Optional)
  
- **Address:**
  - Street Address
  - City
  - State
  - Postal Code
  
- **Services:**
  - Computers & Laptops
  - Mobile Phones & Tablets
  - Home Appliances
  - Office Equipment
  - Industrial Equipment
  - Batteries
  - Small Electronics
  - Large Appliances

### 3. Submission & Backend Processing
Location: `backend/controllers/agency.controller.ts` - `createAgency()`

When form is submitted:
1. Validates all required fields (name, email, phone, address, GST, headName)
2. Creates Agency record with `verificationStatus: 'pending'` and `isVerified: false`
3. Updates user role to 'agency'
4. **Creates notification for admin** about new partner registration
5. Returns success message: "Partner registration submitted successfully. Your request is pending admin approval."

### 4. Pending Status Page
Location: `pages/PartnerPending.tsx`

Partner is redirected to pending page which shows:
- **If Pending:**
  - Timeline visualization
  - Message: "Your registration is under review"
  - Estimated review time
  - Submitted details summary
  
- **If Rejected:**
  - Rejection reason from admin
  - Contact support option
  
- **If Approved:**
  - Success message
  - Redirect to partner dashboard button

### 5. Admin Review & Approval
Location: `pages/AdminPartnerApproval.tsx` (accessible via Admin Dashboard → Pending Partner Approvals)

Admin can:
- **View all pending partner applications**
- **Filter by status:** All, Pending, Approved, Rejected
- **Review complete details:**
  - Business Information (Name, Type, GST, Udyam)
  - Contact Details
  - Address
  - Services Offered
  - Head Name
  - Submission Date

Admin Actions:
1. **Approve Partner:**
   - Endpoint: `POST /api/admin/agencies/:id/approve`
   - Sets `verificationStatus: 'approved'` and `isVerified: true`
   - Creates notification for partner: "Your partner registration has been approved!"
   
2. **Reject Partner:**
   - Endpoint: `POST /api/admin/agencies/:id/reject`
   - Requires rejection reason
   - Sets `verificationStatus: 'rejected'` and stores reason
   - Creates notification for partner with rejection reason

### 6. Partner Dashboard Access
Location: `pages/AgencyDashboard.tsx`

Backend endpoint: `GET /api/agencies/dashboard`
Location: `backend/controllers/agency.controller.ts` - `getAgencyDashboard()`

**Access Control:**
- If `verificationStatus === 'pending'`: Returns pending message, no dashboard access
- If `verificationStatus === 'rejected'`: Returns rejection reason, no dashboard access  
- If `verificationStatus === 'approved'`: Full dashboard access with stats and bookings

## Admin Dashboard Features

Location: `pages/AdminDashboard.tsx`

### Key Metrics:
1. **Total Users** - All registered users
2. **Pending Partner Approvals** - Requires action (clickable)
3. **Verified Partners** - Total approved agencies
4. **Total Bookings** - Platform-wide bookings

### Quick Actions:
1. **Review Partner Applications** - Goes to partner approval page
2. **Manage Users** - User management
3. **View All Partners** - See all agencies

### System Overview:
- Platform status (Operational/Down)
- Active sessions count
- API response time
- Total bookings & active partners

## Database Models

### User Model (`backend/models/User.ts`)
```typescript
{
  name: String,
  email: String,
  password: String (hashed),
  role: 'user' | 'agency' | 'business' | 'admin'
}
```

### Agency Model (`backend/models/Agency.ts`)
```typescript
{
  userId: ObjectId,
  name: String,
  email: String,
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String
  },
  gstNumber: String (required),
  udyamCertificate: String (optional),
  headName: String (required),
  businessType: String,
  establishedYear: Number,
  services: [String],
  verificationStatus: 'pending' | 'approved' | 'rejected',
  isVerified: Boolean,
  rejectionReason: String
}
```

## API Endpoints

### Partner Registration:
- `POST /api/agencies` - Create agency profile (requires auth)

### Admin Approval:
- `GET /api/admin/agencies/:id/verify` - Get agency details for verification
- `POST /api/admin/agencies/:id/approve` - Approve partner
- `POST /api/admin/agencies/:id/reject` - Reject partner with reason

### Dashboard:
- `GET /api/agencies/dashboard` - Get partner dashboard (checks verification status)
- `GET /api/admin/dashboard` - Get admin statistics

## Routes Configuration

### Public Routes (no authentication required):
- `#/` - Landing page
- `#/login` - Login/Sign up
- `#/partner/register` - Partner registration form
- `#/partner/pending` - Pending approval status
- `#/admin` - Admin panel
- `#/contact`, `#/how-it-works`, `#/about` - Info pages

### Protected Routes:
- `#/agency` - Partner dashboard (requires approved status)
- `#/admin/partners` - Admin partner approval page
- `#/admin/users`, `#/admin/agencies` - Admin management pages

## Security Features

1. **JWT Authentication** - All API calls require valid token
2. **Role-based Access Control** - Backend validates user role for protected endpoints
3. **Admin Verification Required** - Partners cannot access dashboard until approved
4. **Password Hashing** - Bcrypt for secure password storage
5. **Public Route Protection** - Unauthenticated users redirected to login

## Notification System

Partners receive notifications for:
- Registration submission confirmation
- Approval status change
- Rejection with reason

Admins receive notifications for:
- New partner registration requests
- System alerts

## Summary

The partner registration flow ensures:
✅ Comprehensive business information collection
✅ Admin verification before platform access
✅ Clear communication of registration status
✅ Secure authentication and authorization
✅ Professional onboarding experience
