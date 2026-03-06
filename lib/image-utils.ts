/**
 * Image optimization utilities for the art portfolio
 */

/**
 * Generate a blur placeholder data URL for images
 * This creates a lightweight SVG placeholder that matches the image aspect ratio
 */
export function generateBlurDataURL(width: number = 400, height: number = 400, color: string = '#f3f4f6'): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${color}"/>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Calculate optimal sizes attribute for responsive images
 * Based on the gallery grid layout breakpoints
 */
export function getGallerySizes(): string {
  return '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw';
}

/**
 * Calculate optimal sizes attribute for lightbox images
 */
export function getLightboxSizes(): string {
  return '(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw';
}

/**
 * Determine if an image should be prioritized for loading
 * Based on its position in the gallery
 */
export function shouldPrioritizeImage(index: number, threshold: number = 6): boolean {
  return index < threshold;
}

/**
 * Get optimal image quality based on context
 */
export function getImageQuality(context: 'thumbnail' | 'lightbox' | 'hero'): number {
  switch (context) {
    case 'thumbnail':
      return 85; // Good quality for thumbnails, smaller file size
    case 'lightbox':
      return 90; // High quality for full-size viewing
    case 'hero':
      return 90; // High quality for hero/featured images
    default:
      return 85;
  }
}
