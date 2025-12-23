# Backend Connection Guide - EditBusinessProfile

## Overview
The EditBusinessProfile page is now fully connected with the backend. This guide explains the data flow, API endpoints, and how to test the connection.

## Data Flow Architecture

### Frontend → Backend Flow
```
EditBusinessProfile.tsx
    ↓ (calls)
api.updateBusinessProfile(formData)
    ↓ (sends PUT request)
/api/business/profile
    ↓ (handled by)
business.controller.ts → updateBusinessProfile()
    ↓ (transforms & saves to)
MongoDB Business Collection
```

### Backend → Frontend Flow
```
MongoDB Business Collection
    ↓ (fetched by)
business.controller.ts → getBusinessProfile()
    ↓ (flattens nested objects)
Response with flattened data
    ↓ (received by)
api.getBusinessProfile()
    ↓ (populates state)
EditBusinessProfile.tsx
```

## API Endpoints

### 1. Get Business Profile
**Endpoint:** `GET /api/business/profile`
**Auth Required:** Yes (JWT token)
**Role:** Business or Admin

**Response Format:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "userId": "...",
    "companyName": "Tech Corp",
    "description": "Leading tech company",
    "logo": "base64 or URL",
    "industry": "Technology",
    "email": "info@techcorp.com",
    "phone": "+1234567890",
    "website": "https://techcorp.com",
    "address": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94102",
    "country": "USA",
    "contactPersonName": "John Doe",
    "contactPersonRole": "CEO",
    "contactPersonEmail": "john@techcorp.com",
    "contactPersonPhone": "+1234567890",
    "sustainabilityGoals": "Our sustainability goals...",
    "totalWasteProcessed": 0,
    "co2Saved": 0,
    "totalPickups": 0,
    "complianceScore": 100,
    "plan": "starter",
    "isVerified": false
  }
}
```

### 2. Update Business Profile
**Endpoint:** `PUT /api/business/profile`
**Auth Required:** Yes (JWT token)
**Role:** Business or Admin

**Request Body:**
```json
{
  "companyName": "Tech Corp Updated",
  "description": "Updated description",
  "industry": "Technology",
  "email": "newemail@techcorp.com",
  "phone": "+1234567890",
  "website": "https://techcorp.com",
  "address": "123 Main St",
  "city": "San Francisco",
  "state": "CA",
  "zipCode": "94102",
  "country": "USA",
  "contactPersonName": "John Doe",
  "contactPersonRole": "CEO",
  "contactPersonEmail": "john@techcorp.com",
  "contactPersonPhone": "+1234567890",
  "sustainabilityGoals": "Updated goals",
  "logo": "base64ImageString"
}
```

**Response:** Same format as GET endpoint

## Database Schema

### Business Model (MongoDB)
```javascript
{
  userId: ObjectId (ref: 'User'),
  companyName: String (required),
  description: String,
  logo: String,
  industry: String (enum: ['Technology', 'Healthcare', ...]),
  email: String (required),
  phone: String,
  website: String,
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  contactPerson: {
    name: String,
    role: String,
    email: String,
    phone: String
  },
  sustainabilityGoals: String,
  totalWasteProcessed: Number,
  co2Saved: Number,
  totalPickups: Number,
  complianceScore: Number,
  monthlyTarget: Number,
  plan: String,
  isVerified: Boolean,
  verificationDocuments: [String],
  timestamps: true
}
```

## Data Transformation

### Backend Controller Transformations

The backend automatically transforms nested objects to flat structure for frontend compatibility:

**Database Structure:**
```javascript
{
  address: {
    street: "123 Main St",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    country: "USA"
  },
  contactPerson: {
    name: "John Doe",
    role: "CEO",
    email: "john@example.com",
    phone: "+1234567890"
  }
}
```

**Flattened Response (sent to frontend):**
```javascript
{
  address: "123 Main St",
  city: "San Francisco",
  state: "CA",
  zipCode: "94102",
  country: "USA",
  contactPersonName: "John Doe",
  contactPersonRole: "CEO",
  contactPersonEmail: "john@example.com",
  contactPersonPhone: "+1234567890"
}
```

**Update Request (from frontend):**
```javascript
{
  address: "456 New St",
  city: "Los Angeles",
  state: "CA",
  zipCode: "90001",
  country: "USA",
  contactPersonName: "Jane Smith",
  contactPersonRole: "CTO",
  contactPersonEmail: "jane@example.com",
  contactPersonPhone: "+0987654321"
}
```

**Transformed for Database (by backend):**
```javascript
{
  address: {
    street: "456 New St",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90001",
    country: "USA"
  },
  contactPerson: {
    name: "Jane Smith",
    role: "CTO",
    email: "jane@example.com",
    phone: "+0987654321"
  }
}
```

## Frontend Features

### 1. Form State Management
- All form fields are controlled components
- Real-time validation
- Auto-populate from database on load

### 2. Logo Upload
- File input with preview
- Base64 encoding for storage
- Visual feedback with gradient background
- Camera icon overlay for upload action

### 3. Error Handling
- Toast notifications for success/error
- Detailed error messages from backend
- Auto-dismiss after 3-5 seconds
- Console logging for debugging

### 4. Loading States
- Full-screen spinner during initial load
- Button disabled state during save
- Loading text on save button

## Testing the Connection

### 1. Start the Backend Server
```bash
npm run server
# or
npm run dev
```

### 2. Start the Frontend
```bash
npm run dev
```

### 3. Login as Business User
- Navigate to `#/login`
- Login with business account
- You should be redirected to business dashboard

### 4. Access Profile Editor
- From business dashboard, go to Profile Settings
- Click "Edit Business Profile" card
- Or navigate directly to `#/business/profile`

### 5. Test Profile Load
- Page should load without errors
- Form fields should populate with existing data
- Logo preview should show if logo exists
- Check browser console for API calls

### 6. Test Profile Update
- Modify any field (e.g., company name)
- Click "Save Changes" button
- Should see green success toast
- Data should persist on page reload

### 7. Test Error Handling
- Disconnect backend server
- Try to save profile
- Should see red error toast with message

## API Call Examples (Browser Console)

### Manual API Testing
```javascript
// Get current business profile
fetch('http://localhost:3001/api/business/profile', {
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN',
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log(data));

// Update business profile
fetch('http://localhost:3001/api/business/profile', {
  method: 'PUT',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    companyName: 'Updated Company Name',
    email: 'updated@example.com'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

## Troubleshooting

### Issue: "Unauthorized" Error
**Solution:** 
- Check if user is logged in
- Verify JWT token in localStorage
- Ensure token is valid and not expired

### Issue: Profile Not Loading
**Solution:**
- Check browser console for errors
- Verify backend server is running on port 3001
- Check MongoDB connection
- Ensure user has business role

### Issue: Data Not Saving
**Solution:**
- Check network tab for API response
- Verify request payload format
- Check backend logs for validation errors
- Ensure all required fields are filled

### Issue: Logo Not Uploading
**Solution:**
- Check file size (should be reasonable for base64)
- Verify file type is image/*
- Check browser console for errors
- Consider using Cloudinary for large images

## Protected Fields

These fields cannot be updated via the profile endpoint:
- `userId` - Linked to user account
- `totalWasteProcessed` - Updated by bookings
- `co2Saved` - Calculated from waste processed
- `totalPickups` - Updated by completed bookings

## Security Features

### 1. Authentication
- JWT token required for all requests
- Token validated on every request
- Automatic logout on token expiration

### 2. Authorization
- Only business and admin roles can access
- Users can only update their own profile
- Protected fields cannot be modified

### 3. Data Validation
- Input sanitization on backend
- Schema validation via Mongoose
- XSS protection
- Rate limiting on API endpoints

## Future Enhancements

1. **Image Upload Service**
   - Integrate Cloudinary for logo storage
   - Support larger images
   - Image optimization and compression

2. **Real-time Validation**
   - Email format validation
   - Phone number formatting
   - Website URL validation
   - Duplicate company name check

3. **Auto-save**
   - Save changes automatically
   - Debounced updates
   - Visual feedback for unsaved changes

4. **Profile Completion**
   - Progress indicator
   - Required vs optional fields
   - Badges for complete profile

5. **Version History**
   - Track profile changes
   - Ability to revert changes
   - Audit log

## Support

For issues or questions:
1. Check browser console for errors
2. Check backend server logs
3. Verify MongoDB connection
4. Review this documentation
5. Check API endpoint responses in Network tab

---

**Last Updated:** December 24, 2025
**Status:** ✅ Fully Connected and Tested
