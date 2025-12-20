# Cloudinary Setup Instructions

## Current Configuration
Your `.env` file has:
```
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## Required Setup Steps

### 1. Create Upload Preset
You need to create an **unsigned upload preset** in your Cloudinary account:

1. Go to https://cloudinary.com/console
2. Navigate to **Settings** → **Upload** 
3. Scroll down to **Upload presets**
4. Click **Add upload preset**
5. Configure:
   - **Preset name**: `ecocycle_uploads`
   - **Signing Mode**: Select **Unsigned**
   - **Folder**: (optional) `ecocycle/avatars`
   - **Use filename or externally defined Public ID**: Enable if needed
   - **Unique filename**: Enable (recommended)
   - **Overwrite**: Your choice
   - **Resource Type**: Auto
   - **Access Mode**: Public
6. Click **Save**

### 2. Verify Cloud Name
Make sure your cloud name `dideet7oz` is correct by checking your Cloudinary dashboard.

### 3. Test the Upload
After creating the upload preset:
1. Restart both frontend and backend servers
2. Go to Profile page
3. Try uploading an avatar image
4. Check browser console for any errors

## Troubleshooting

### Error: "Upload preset not found"
- Make sure you created the upload preset named exactly `ecocycle_uploads`
- Make sure it's set to **Unsigned** mode

### Error: "Invalid cloud name"
- Verify your cloud name in Cloudinary dashboard
- Update `CLOUDINARY_CLOUD_NAME` in `.env` if needed

### Error: "Upload failed"
- Check Cloudinary console for any restrictions
- Verify your account is active and not over quota
- Check if there are any IP restrictions

### Error: "CORS issue"
- Make sure the upload preset is unsigned
- Check if your Cloudinary account has CORS enabled

## Alternative: Use Backend Upload

If unsigned uploads don't work, you can implement server-side uploads using the API credentials. This requires creating a backend endpoint that uses `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET`.

## Need Help?
Contact Cloudinary support or check their documentation:
https://cloudinary.com/documentation/upload_images
