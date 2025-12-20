import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Extract public_id from Cloudinary URL
 * Example: https://res.cloudinary.com/dideet7oz/image/upload/v1234567890/ecocycle/avatars/abc123.jpg
 * Returns: ecocycle/avatars/abc123
 */
export const extractPublicId = (url: string): string | null => {
  try {
    if (!url || !url.includes('cloudinary.com')) {
      return null;
    }

    // Match the pattern after /upload/ and before file extension
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Error extracting public_id:', error);
    return null;
  }
};

/**
 * Delete an image from Cloudinary
 */
export const deleteImage = async (publicId: string): Promise<boolean> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    return false;
  }
};

/**
 * Delete an image by URL
 */
export const deleteImageByUrl = async (url: string): Promise<boolean> => {
  const publicId = extractPublicId(url);
  if (!publicId) {
    console.log('Could not extract public_id from URL:', url);
    return false;
  }
  return await deleteImage(publicId);
};

export default cloudinary;
