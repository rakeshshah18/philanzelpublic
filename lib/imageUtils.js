/**
 * Extract the image URL from various data structures
 * Handles both string URLs and object structures with url property
 */
export const getImageUrl = (imageData, fallback = "/pms-img-1.jpg") => {
    if (!imageData) return fallback;

    // If it's already a string URL
    if (typeof imageData === 'string') {
        return imageData || fallback;
    }

    // If it's an object with url property (Cloudinary or similar)
    if (typeof imageData === 'object' && imageData.url) {
        return imageData.url || fallback;
    }

    // Fallback if none of the above
    return fallback;
};

/**
 * Handle image loading errors with fallback logic
 */
export const handleImageError = (e, fallbackUrl = "/pms-img-1.jpg") => {
    if (e && e.target) {
        console.error('Image failed to load:', {
            originalSrc: e.target.src,
            fallbackUrl
        });
        e.target.src = fallbackUrl;
    }
};

/**
 * Log image debugging information
 */
export const logImageDebug = (componentName, imageData) => {
    console.log(`[${componentName}] Image Debug:`, {
        imageData,
        type: typeof imageData,
        hasUrl: imageData?.url ? true : false,
        url: imageData?.url || imageData,
        timestamp: new Date().toISOString()
    });
};
