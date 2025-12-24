/**
 * Utility functions for handling avatar URLs
 */

/**
 * Get avatar URL with cache busting
 * @param avatarUrl - The avatar URL from the user object
 * @param userName - The user's name for fallback
 * @param cacheBust - Whether to add cache busting parameter (default: true)
 */
export const getAvatarUrl = (
  avatarUrl: string | undefined,
  userName: string | undefined,
  cacheBust: boolean = true
): string => {
  if (avatarUrl) {
    // Add cache busting parameter to force refresh
    return cacheBust ? `${avatarUrl}?t=${Date.now()}` : avatarUrl;
  }
  
  // Fallback to UI Avatars
  const name = encodeURIComponent(userName || 'User');
  return `https://ui-avatars.com/api/?name=${name}&background=10b981&color=fff&size=256`;
};

/**
 * Preload an image to check if it's accessible
 * @param url - The image URL to preload
 * @returns Promise that resolves to true if image loads successfully
 */
export const preloadImage = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

/**
 * Get avatar URL with validation
 * @param avatarUrl - The avatar URL from the user object
 * @param userName - The user's name for fallback
 */
export const getValidatedAvatarUrl = async (
  avatarUrl: string | undefined,
  userName: string | undefined
): Promise<string> => {
  if (avatarUrl) {
    const isValid = await preloadImage(avatarUrl);
    if (isValid) {
      return getAvatarUrl(avatarUrl, userName);
    }
  }
  
  // Return fallback
  return getAvatarUrl(undefined, userName);
};
