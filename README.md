# EcoCycle - E-Waste Management System

A comprehensive platform for managing electronic waste collection, recycling, and disposal with role-based access for residents, agencies, businesses, and administrators.

## Features

- 👤 **Multi-Role System**: Resident, Agency, Business, and Admin roles
- 📅 **Smart Booking**: Schedule e-waste pickups with real-time slot management
- 🏢 **Agency Management**: Collection agencies with service areas and analytics
- 🏭 **Business Portal**: Inventory tracking and certificate management
- 🎁 **Rewards System**: Points-based rewards for recycling
- 📊 **Analytics Dashboard**: Comprehensive insights for all user types
- 📱 **Contact System**: Integrated messaging and support
- 🔒 **Secure Authentication**: JWT-based auth with role-based access control

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

### Deploy to Render

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Deploy to Render"
   git push origin main
   ```

2. **Create Web Service on Render**
   - Go to https://render.com/dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: your-app-backend
     - **Build Command**: `npm install`
     - **Start Command**: `npm run start`
     - **Environment**: Node

3. **Add Environment Variables**
   - Add all variables from your `.env` file in Render dashboard
   - Do NOT commit sensitive keys to Git

4. **Create Static Site for Frontend**
   - Click "New +" → "Static Site"
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

5. **Update API URL**
   - After backend deployment, update `services/api.ts` with your backend URL
   - Commit and push to trigger frontend redeploy

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
