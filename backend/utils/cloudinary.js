import { v2 as cloudinary } from 'cloudinary';
// Lazy configuration function to ensure env variables are loaded
let isConfigured = false;
const ensureConfigured = () => {
    if (!isConfigured) {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        isConfigured = true;
    }
};
/**
 * Extract public_id from Cloudinary URL
 * Example: https://res.cloudinary.com/dideet7oz/image/upload/v1234567890/ecocycle/avatars/abc123.jpg
 * Returns: ecocycle/avatars/abc123
 */
export const extractPublicId = (url) => {
    try {
        if (!url || !url.includes('cloudinary.com')) {
            return null;
        }
        // Match the pattern after /upload/ and before file extension
        const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
        const publicId = match ? match[1] : null;
        return publicId;
    }
    catch (error) {
        return null;
    }
};
/**
 * Delete an image from Cloudinary
 */
export const deleteImage = async (publicId) => {
    try {
        ensureConfigured();
        const result = await cloudinary.uploader.destroy(publicId);
        return result.result === 'ok';
    }
    catch (error) {
        return false;
    }
};
/**
 * Delete an image by URL
 */
export const deleteImageByUrl = async (url) => {
    const publicId = extractPublicId(url);
    if (!publicId) {
        return false;
    }
    return await deleteImage(publicId);
};
export default cloudinary;
