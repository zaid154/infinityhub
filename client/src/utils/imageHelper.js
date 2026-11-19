/**
 * Universal Image Helper for Nova Infotech
 * Authoritative Single Source of Truth: MongoDB Database & Cloudinary CDN
 */

export const DEFAULT_HARDWARE_PLACEHOLDER = '/products/real-thinkpad-t14-transparent.png';

/**
 * Returns the primary or indexed image URL for a product directly from MongoDB / Cloudinary.
 * Never overrides valid Cloudinary URLs with local paths.
 *
 * @param {Object} product - Product document from MongoDB
 * @param {number} index - Index in images array (default 0)
 * @returns {string} Cloudinary URL or safe fallback
 */
export const getSafeImageUrl = (product, index = 0) => {
  if (!product) return DEFAULT_HARDWARE_PLACEHOLDER;

  // 1. Direct MongoDB Cloudinary images array: [{ url, public_id }]
  if (Array.isArray(product.images) && product.images.length > index) {
    const item = product.images[index];
    const url = typeof item === 'string' ? item : item?.url;
    if (url && typeof url === 'string' && url.trim().length > 0) {
      return url.trim();
    }
  }

  // 2. First image fallback if specified index out of bounds
  if (Array.isArray(product.images) && product.images.length > 0) {
    const item = product.images[0];
    const url = typeof item === 'string' ? item : item?.url;
    if (url && typeof url === 'string' && url.trim().length > 0) {
      return url.trim();
    }
  }

  // 3. String property image or imageUrl (e.g., in Cart items or legacy payloads)
  if (product.image && typeof product.image === 'string' && product.image.trim().length > 0) {
    return product.image.trim();
  }
  if (product.imageUrl && typeof product.imageUrl === 'string' && product.imageUrl.trim().length > 0) {
    return product.imageUrl.trim();
  }

  // 4. Default clean fallback only if literally zero images exist
  return DEFAULT_HARDWARE_PLACEHOLDER;
};

/**
 * Detects if a URL points to a video asset (Cloudinary video, mp4, webm, mov, etc.)
 */
export const isVideoUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  const clean = url.toLowerCase().split('?')[0];
  return (
    clean.endsWith('.mp4') ||
    clean.endsWith('.webm') ||
    clean.endsWith('.mov') ||
    clean.endsWith('.ogg') ||
    clean.endsWith('.mkv') ||
    url.includes('/video/upload/') ||
    url.includes('/videos/')
  );
};

/**
 * Returns an array of all Cloudinary image URLs for a product gallery.
 *
 * @param {Object} product - Product document from MongoDB
 * @returns {string[]} Array of image URLs
 */
export const getGalleryUrls = (product) => {
  if (!product) return [DEFAULT_HARDWARE_PLACEHOLDER];

  if (Array.isArray(product.images) && product.images.length > 0) {
    const urls = product.images
      .map((item) => (typeof item === 'string' ? item : item?.url))
      .filter((url) => typeof url === 'string' && url.trim().length > 0);

    if (urls.length > 0) return urls;
  }

  if (product.image && typeof product.image === 'string') {
    return [product.image];
  }

  return [DEFAULT_HARDWARE_PLACEHOLDER];
};

/**
 * Returns structured media items (images and videos) for gallery viewers.
 *
 * @param {Object} product - Product document from MongoDB
 * @returns {{ url: string, type: 'image' | 'video', public_id?: string }[]} Array of media objects
 */
export const getGalleryMedia = (product) => {
  if (!product) return [{ url: DEFAULT_HARDWARE_PLACEHOLDER, type: 'image' }];

  if (Array.isArray(product.images) && product.images.length > 0) {
    const media = product.images
      .map((item) => {
        const url = typeof item === 'string' ? item : item?.url;
        if (!url || typeof url !== 'string' || url.trim().length === 0) return null;
        const isVid = (item && item.resource_type === 'video') || isVideoUrl(url);
        return {
          url: url.trim(),
          type: isVid ? 'video' : 'image',
          public_id: item?.public_id || ''
        };
      })
      .filter(Boolean);

    if (media.length > 0) return media;
  }

  if (product.image && typeof product.image === 'string') {
    return [{ url: product.image, type: isVideoUrl(product.image) ? 'video' : 'image' }];
  }

  return [{ url: DEFAULT_HARDWARE_PLACEHOLDER, type: 'image' }];
};

export default getSafeImageUrl;
