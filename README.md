# EcoCycle - E-Waste Management System

A comprehensive platform for managing electronic waste collection, recycling, and disposal with role-based access for residents, agencies, businesses, and administrators.

## 🚀 Live Demo

[https://e-waste-frontened.onrender.com](https://e-waste-frontened.onrender.com)

> **Note**: First request may take 30-60 seconds (free tier cold start)

## Features

- 👤 **Multi-Role System**: Resident, Agency, Business, and Admin roles
- 📅 **Smart Booking**: Schedule e-waste pickups with real-time slot management
- 🏢 **Agency Management**: Collection agencies with service areas and analytics
- 🏭 **Business Portal**: Inventory tracking and certificate management
- 🎁 **Rewards System**: Points-based rewards for recycling
- 📊 **Analytics Dashboard**: Comprehensive insights for all user types
- 📱 **Contact System**: Integrated messaging and support
- 🔒 **Secure Authentication**: JWT-based auth with role-based access control
- 📱 **Fully Responsive**: Mobile-first design works on all devices (phone, tablet, desktop)

## Tech Stack

**Frontend:**
- React 19.2.1 with TypeScript
- Vite 6.2.0 for build tooling
- Tailwind CSS for styling
- Lucide React for icons

**Backend:**
- Node.js with Express 5.2.1
- MongoDB 9.0.1 with Mongoose
- JWT authentication with bcryptjs
- Cloudinary for image storage

## Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account
- Cloudinary account

## Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd e-waste
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory with:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ADMIN_KEY=your_admin_registration_key
   ```

4. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api

## Deployment

### Environment Configuration

This project uses Vite environment variables for API configuration across different environments.

**Local Development:**
- Uses `.env` or `.env.development`
- API URL: `http://localhost:3001/api`

**Production (Render.com):**
- Uses `.env.production` (committed to git)
- API URL: `https://e-waste-7ios.onrender.com/api`

### Deploy to Render

The project includes a `render.yaml` for automatic deployment configuration.

**Prerequisites:**
1. GitHub repository connected to Render
2. MongoDB Atlas connection string
3. Cloudinary account credentials

**Deployment Steps:**

1. **Commit and push your code**
   ```bash
   git add .
   git commit -m "Deploy to Render"
   git push origin main
   ```

2. **Render Auto-Deployment**
   - Connect your GitHub repository on Render
   - Render will detect `render.yaml` and create both services:
     - **Backend** (Node.js Web Service)
     - **Frontend** (Static Site)

3. **Configure Backend Environment Variables**
   
   Set these in Render Dashboard for the backend service:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ADMIN_KEY=your_admin_registration_key
   NODE_ENV=production
   PORT=3001
   ```

4. **Frontend Environment Variables**
   
   Already configured in `render.yaml`:
   ```
   VITE_API_URL=https://e-waste-7ios.onrender.com/api
   ```
   
   This is automatically set during build and tells the frontend where to find the backend API.

5. **Verify Deployment**
   - Backend health check: `https://e-waste-7ios.onrender.com/api/health`
   - Frontend: `https://e-waste-frontened.onrender.com`

**Troubleshooting:**

- **CORS Errors**: Ensure backend `app.ts` includes your frontend URL in CORS origins
- **Connection Refused**: Verify `VITE_API_URL` is set correctly in Render frontend environment
- **Cold Starts**: Free tier services sleep after inactivity (30-60s first request)
- **Build Failures**: Check Render build logs for missing dependencies or env variables

## Project Structure

```
e-waste/
├── backend/
│   ├── controllers/     # Business logic
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth & validation
│   ├── utils/           # Helper functions
│   └── app.ts           # Express configuration
├── pages/               # React page components
├── components/          # Reusable React components
├── services/            # API client
└── types.ts             # TypeScript definitions
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `PUT /api/bookings/:id` - Update booking status

### Agencies
- `GET /api/agencies` - List all agencies
- `GET /api/agencies/:id` - Get agency details
- `PUT /api/agencies/profile` - Update agency profile

### Rewards
- `GET /api/rewards` - List available rewards
- `POST /api/rewards/redeem` - Redeem reward

### Admin
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/:id` - Update user
- `GET /api/admin/analytics` - System analytics

## Security Notes

- Never commit `.env` file to version control
- Use strong JWT secrets in production
- Rotate API keys regularly
- Enable MongoDB IP whitelist for production
- Use HTTPS in production

## Support

For issues or questions, use the Contact form in the application or open an issue on GitHub.

## License

MIT License
