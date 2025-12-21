# EcoCycle - Render Deployment Guide

## Prerequisites
1. GitHub account (to connect your repository to Render)
2. Render account (free tier available at https://render.com)
3. MongoDB Atlas database (already configured)
4. Cloudinary account (already configured)

## Deployment Steps

### Step 1: Prepare Your Repository
1. Make sure all your code is committed to Git
2. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

### Step 2: Deploy Backend on Render

#### Option A: Using Blueprint (Automated - Recommended)
1. Go to https://render.com and sign in
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Render will detect the `render.yaml` file automatically
5. Add environment variables when prompted:
   - `MONGODB_URI`: mongodb+srv://manish:manish25@cluster0.n4rjlbq.mongodb.net/ecocycle
   - `JWT_SECRET`: 4988e4c82f6cf5009398bd0c3993442c
   - `CLOUDINARY_CLOUD_NAME`: dideet7oz
   - `CLOUDINARY_API_KEY`: 158768775958885
   - `CLOUDINARY_API_SECRET`: 9FdnxbqHtVZVXKCb2g_alJKSjlY
   - `ADMIN_KEY`: manish123
6. Click "Apply" to deploy both frontend and backend

#### Option B: Manual Deployment
**Backend Service:**
1. Go to https://render.com/dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: ecocycle-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm run start`
   - **Plan**: Free
5. Add Environment Variables:
   - Click "Environment" tab
   - Add all variables from `.env` file (see list above)
6. Click "Create Web Service"
7. **Important**: Copy the backend URL (e.g., `https://ecocycle-backend.onrender.com`)

**Frontend Service:**
1. Click "New +" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name**: ecocycle-frontend
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Click "Create Static Site"

### Step 3: Update API URL in Frontend
After backend is deployed, update the API base URL in your frontend:

1. Open `services/api.ts`
2. Change:
   ```typescript
   const API_BASE_URL = 'http://localhost:3001/api';
   ```
   To:
   ```typescript
   const API_BASE_URL = import.meta.env.PROD 
     ? 'https://your-backend-url.onrender.com/api'  // Replace with your actual backend URL
     : 'http://localhost:3001/api';
   ```
3. Commit and push changes
4. Frontend will automatically redeploy

### Step 4: Configure CORS on Backend (if needed)
If you get CORS errors, update `backend/app.ts`:

```typescript
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'https://your-frontend-url.onrender.com'  // Add your frontend URL
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## Important Notes

### Free Tier Limitations:
- Backend will spin down after 15 minutes of inactivity
- First request after spin down will take 30-60 seconds
- Frontend is always available (static hosting)

### Database:
- Your MongoDB Atlas is already configured and will work
- No additional database setup needed

### Cloudinary:
- Already configured in environment variables
- Image uploads will work immediately

### Custom Domain (Optional):
1. Go to your service settings
2. Click "Custom Domain"
3. Follow instructions to add your domain

## Testing Deployment

### Backend:
Visit: `https://your-backend-url.onrender.com/api/health`
You should see: `{"status":"ok","message":"EcoCycle API is running"}`

### Frontend:
Visit: `https://your-frontend-url.onrender.com`
Your application should load

## Troubleshooting

### Backend Won't Start:
- Check "Logs" tab in Render dashboard
- Verify all environment variables are set correctly
- Make sure MongoDB URI is accessible

### Frontend Can't Connect to Backend:
- Check CORS configuration
- Verify API_BASE_URL is set correctly
- Check browser console for errors

### Database Connection Issues:
- Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Check connection string is correct

## Monitoring
- Use Render dashboard to view logs
- Check "Metrics" tab for performance data
- Set up email notifications for deployment failures

## Updating Your Deployment
After making code changes:
1. Commit and push to GitHub
2. Render will automatically redeploy
3. Check deployment logs for any errors

## Environment Variables Reference
```
MONGODB_URI=mongodb+srv://manish:manish25@cluster0.n4rjlbq.mongodb.net/ecocycle
JWT_SECRET=4988e4c82f6cf5009398bd0c3993442c
PORT=3001
CLOUDINARY_CLOUD_NAME=dideet7oz
CLOUDINARY_API_KEY=158768775958885
CLOUDINARY_API_SECRET=9FdnxbqHtVZVXKCb2g_alJKSjlY
ADMIN_KEY=manish123
NODE_ENV=production
```

## Support
- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com
