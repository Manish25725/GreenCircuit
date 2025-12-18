# Partner Registration & Approval Flow

## Overview
This document describes the partner (agency) registration and approval system that requires admin verification before partners can access their dashboard.

## Features Implemented

### 1. Enhanced Agency Model
**File**: `backend/models/Agency.ts`

Added new fields for partner verification:
- `gstNumber` - GST registration number (required)
- `udyamCertificate` - Udyam certificate number (optional)
- `headName` - Business head/owner name (required)
- `businessType` - Type of business entity
- `establishedYear` - Year business was established
- `rejectionReason` - Stores reason if registration is rejected

### 2. Partner Registration Controller
**File**: `backend/controllers/agency.controller.ts`

#### createAgency (Modified)
- Now collects comprehensive partner details including GST, Udyam certificate, etc.
- Creates agency with `verificationStatus: 'pending'` by default
- Creates notification for admin about new registration
- Returns success message indicating pending approval

#### getAgencyDashboard (Modified)
- Now checks verification status before showing dashboard
- Returns different responses based on status:
  - **pending**: Shows "request in progress" message
  - **rejected**: Shows rejection reason and contact support option
  - **approved**: Shows full dashboard with stats

### 3. Admin Approval Endpoints
**File**: `backend/controllers/admin.controller.ts`

#### New Endpoints:
1. **getAgencyForVerification**
   - GET `/admin/agencies/:id/verify`
   - Fetches full agency details for admin review

2. **approvePartnerRegistration**
   - POST `/admin/agencies/:id/approve`
   - Approves partner registration
   - Sets `verificationStatus: 'approved'` and `isVerified: true`
   - Sends notification to partner
   - Body: `{ notes?: string }`

3. **rejectPartnerRegistration**
   - POST `/admin/agencies/:id/reject`
   - Rejects partner registration
   - Sets `verificationStatus: 'rejected'`
   - Stores rejection reason
   - Sends notification to partner
   - Body: `{ reason: string }` (required)

### 4. Updated Routes
**File**: `backend/routes/admin.routes.ts`

New routes added:
```typescript
router.get('/agencies/:id/verify', getAgencyForVerification);
router.post('/agencies/:id/approve', approvePartnerRegistration);
router.post('/agencies/:id/reject', rejectPartnerRegistration);
```

### 5. Frontend Pages

#### PartnerRegistration Component
**File**: `pages/PartnerRegistration.tsx`

Comprehensive registration form collecting:
- Business Information (Agency name, Head name, GST, Udyam)
- Contact Information (Email, Phone)
- Address Details (Street, City, State, ZIP)
- Services Offered (Multiple selection)

Features:
- Real-time validation
- Service checkbox selection
- Clear error messaging
- Responsive design

#### PartnerPending Component
**File**: `pages/PartnerPending.tsx`

Status page showing:
- **Pending State**: 
  - Progress indicator
  - Submitted information summary
  - Timeline visualization
  - "What's Next?" information
  - Refresh status button
  
- **Rejected State**:
  - Rejection reason display
  - Contact support option
  - Submission details
  
- **Approved State**:
  - Automatically redirects to agency dashboard

#### AdminPartnerApproval Component
**File**: `pages/AdminPartnerApproval.tsx`

Admin interface for reviewing partners:
- List view with filters (All, Pending, Approved, Rejected)
- Detailed modal view showing:
  - Business information
  - Contact details
  - Address
  - Services offered
  - GST and Udyam details
- Approve/Reject actions with notes/reason

### 6. Updated App Routes
**File**: `App.tsx`

New routes added:
```typescript
'#/partner/register' - Partner registration form
'#/partner/pending' - Pending approval status page
'#/admin/partners' - Admin partner approval interface
```

## User Flow

### For Partners (Agencies)

1. **Registration**
   - User navigates to `#/partner/register`
   - Fills out comprehensive registration form
   - Provides GST number, business details, contact info, address
   - Submits registration

2. **Pending Approval**
   - After submission, redirected to `#/partner/pending`
   - See "Request in Progress" status
   - Can view submitted information
   - Can refresh status or contact support
   - Cannot access partner dashboard until approved

3. **After Approval**
   - Receives email/in-app notification
   - When logging in or checking status, automatically redirected to partner dashboard
   - Full access to all partner features

4. **If Rejected**
   - See rejection reason on pending page
   - Can contact support for clarification
   - May need to reapply with corrected information

### For Admins

1. **Review Notifications**
   - Receive notification when new partner registers
   - Access admin partner approval page at `#/admin/partners`

2. **Review Applications**
   - View list of all partners filtered by status
   - Click "View Details" to see full information
   - Review:
     - Business credentials (GST, Udyam)
     - Contact information
     - Address and location
     - Services they plan to offer

3. **Make Decision**
   - **To Approve**: 
     - Add optional notes
     - Click "Approve Partner"
     - Partner gets notified and gains access
   
   - **To Reject**:
     - Must provide rejection reason
     - Click "Reject"
     - Partner gets notified with reason

## API Endpoints

### Partner Registration
```
POST /api/agency/create
Authorization: Bearer <token>

Body: {
  name: string,
  headName: string,
  email: string,
  phone: string,
  gstNumber: string,
  udyamCertificate?: string,
  businessType?: string,
  establishedYear?: number,
  description?: string,
  address: {
    street: string,
    city: string,
    state: string,
    zipCode: string,
    country?: string
  },
  services: string[],
  verificationDocuments?: string[]
}
```

### Check Status
```
GET /api/agency/dashboard
Authorization: Bearer <token>

Response (Pending):
{
  status: 'pending',
  message: 'Your partner registration is under review...',
  agency: { name, email, verificationStatus, submittedAt }
}

Response (Approved):
{
  status: 'approved',
  agency: { full agency object },
  stats: { booking stats },
  recentBookings: []
}
```

### Admin: Get Agencies for Review
```
GET /api/admin/agencies?status=pending
Authorization: Bearer <token> (admin only)

Response: {
  agencies: Agency[],
  pagination: { page, limit, total, pages }
}
```

### Admin: Approve Partner
```
POST /api/admin/agencies/:id/approve
Authorization: Bearer <token> (admin only)

Body: {
  notes?: string
}
```

### Admin: Reject Partner
```
POST /api/admin/agencies/:id/reject
Authorization: Bearer <token> (admin only)

Body: {
  reason: string
}
```

## Database Schema Updates

### Agency Model Changes
```typescript
interface IAgency {
  // ... existing fields ...
  
  // New fields
  gstNumber?: string;
  udyamCertificate?: string;
  headName?: string;
  businessType?: string;
  establishedYear?: number;
  rejectionReason?: string;
  
  // Existing verification fields
  verificationStatus: 'pending' | 'approved' | 'rejected';
  isVerified: boolean;
}
```

## Security Considerations

1. **Authentication Required**: All endpoints require valid JWT token
2. **Role-Based Access**: 
   - Only admin can approve/reject partners
   - Partners can only create their own registration
   - Partners can only view their own status
3. **Validation**: Server-side validation of all required fields
4. **Status Checks**: Dashboard checks verification status before displaying data

## Future Enhancements

Possible improvements:
1. Document upload for GST certificate and Udyam certificate
2. Email verification for partner email addresses
3. SMS verification for phone numbers
4. Multi-step verification process
5. Auto-approval based on certain criteria
6. Partner onboarding wizard after approval
7. Re-application process for rejected partners
8. Admin notes/comments history
9. Verification checklist for admins
10. Integration with GST verification APIs

## Testing Checklist

- [ ] Partner can register with all required fields
- [ ] Partner sees pending page after registration
- [ ] Partner cannot access dashboard while pending
- [ ] Admin receives notification on new registration
- [ ] Admin can view all pending registrations
- [ ] Admin can approve partner successfully
- [ ] Partner receives approval notification
- [ ] Approved partner can access dashboard
- [ ] Admin can reject partner with reason
- [ ] Partner sees rejection reason
- [ ] Rejected partner cannot access dashboard
- [ ] Form validation works correctly
- [ ] All routes are properly protected
- [ ] Mobile responsive design works

## Troubleshooting

### Partner stuck on pending page
- Check if agency record exists in database
- Verify verificationStatus field
- Check if admin has processed the request

### Admin can't see pending partners
- Verify admin role in user token
- Check API endpoint permissions
- Verify agencies exist with 'pending' status

### Approval/Rejection not working
- Check admin authorization
- Verify agency ID is correct
- Check notification service is working
- Verify database updates are successful

## Support

For issues or questions:
- Check application logs
- Verify database connections
- Review API response messages
- Contact development team
