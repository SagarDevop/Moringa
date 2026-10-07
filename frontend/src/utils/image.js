/**
 * High-performance on-the-fly image optimization for Cloudinary and Unsplash.
 * Automatically delivers modern formats (WebP/AVIF) and high-efficiency compression.
 * 
 * @param {string} url - Original image URL
 * @param {number} width - Target width in pixels
 * @param {'good' | 'eco' | 'low'} quality - Compression quality preset
 * @returns {string} Optimized image URL
 */
export function optimizeImageUrl(url, width = 400, quality = 'good') {
  if (!url || typeof url !== 'string') return '';

  // 1. Cloudinary URLs
  if (url.includes('res.cloudinary.com')) {
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex !== -1) {
      const prefix = url.slice(0, uploadIndex + 8); // includes '/upload/'
      let rest = url.slice(uploadIndex + 8);

      // Strip existing transformation parameters before /v[0-9]+ or public_id
      const versionMatch = rest.match(/v\d+\//);
      if (versionMatch) {
        rest = rest.slice(rest.indexOf(versionMatch[0]));
      } else {
        // If there's no version prefix but there are old transform parameters
        const segments = rest.split('/');
        if (segments.length > 1 && (segments[0].includes('f_') || segments[0].includes('w_') || segments[0].includes('q_') || segments[0].includes('c_'))) {
          rest = segments.slice(1).join('/');
        }
      }

      // Quality mode selection for ultra-fast load
      const qMode = quality === 'low' || width <= 160 ? 'q_auto:eco' : (quality === 'eco' ? 'q_auto:eco' : 'q_auto:good');
      const roundedWidth = Math.round(width);
      const transforms = `f_auto,${qMode},w_${roundedWidth},c_limit,dpr_auto`;

      return `${prefix}${transforms}/${rest}`;
    }
  }

  // 2. Unsplash URLs
  if (url.includes('images.unsplash.com')) {
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set('w', Math.round(width).toString());
      urlObj.searchParams.set('q', width <= 200 ? '60' : '75');
      urlObj.searchParams.set('auto', 'format');
      urlObj.searchParams.set('fit', 'crop');
      return urlObj.toString();
    } catch (e) {
      return url;
    }
  }

  return url;
}

// In-memory cache for preloaded URLs to avoid duplicate fetches
const prefetchedUrls = new Set();

/**
 * Preloads an image into browser cache in the background
 * @param {string} url - Original image URL
 * @param {number} width - Target width
 */
export function preloadImage(url, width = 500) {
  if (!url || typeof url !== 'string') return;
  const optimizedUrl = optimizeImageUrl(url, width);
  if (!optimizedUrl || prefetchedUrls.has(optimizedUrl)) return;
  
  prefetchedUrls.add(optimizedUrl);
  const img = new Image();
  img.src = optimizedUrl;
}
