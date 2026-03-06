# Image Optimization Guide

This document outlines the image optimization strategies implemented in the Millie Rogers Art Portfolio.

## Overview

The portfolio uses Next.js Image component with comprehensive optimization to ensure fast loading times, excellent Core Web Vitals scores, and a smooth user experience across all devices.

## Key Optimizations

### 1. Next.js Image Component

All images use the Next.js `<Image>` component which provides:
- Automatic image optimization
- Responsive image serving (AVIF, WebP, fallback formats)
- Lazy loading for off-screen images
- Blur placeholders during loading
- Automatic srcset generation

### 2. Image Formats

**Configuration** (`next.config.ts`):
```typescript
formats: ['image/avif', 'image/webp']
```

- **AVIF**: Modern format with superior compression (30-50% smaller than JPEG)
- **WebP**: Widely supported format with good compression
- **Fallback**: Automatic fallback to original format for older browsers

### 3. Responsive Image Sizes

**Device Sizes**:
```typescript
deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840]
```

**Image Sizes**:
```typescript
imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
```

These configurations ensure the browser downloads the optimal image size for each device.

### 4. Priority Loading

**Above-the-Fold Images**:
- First 6 gallery images use `priority={true}`
- Priority images use `loading="eager"`
- Prevents Largest Contentful Paint (LCP) delays

**Below-the-Fold Images**:
- Use lazy loading (`loading="lazy"`)
- Load only when entering viewport
- Reduces initial page load time

### 5. Blur Placeholders

**Implementation**:
- SVG-based blur placeholders
- Matches image aspect ratio
- Lightweight (< 1KB)
- Prevents layout shift during loading

**Utility Function** (`lib/image-utils.ts`):
```typescript
generateBlurDataURL(width, height, color)
```

### 6. Responsive Sizes Attribute

**Gallery Thumbnails**:
```
(max-width: 640px) 100vw,
(max-width: 768px) 50vw,
(max-width: 1024px) 33vw,
25vw
```

**Lightbox Images**:
```
(max-width: 768px) 100vw,
(max-width: 1200px) 90vw,
80vw
```

These tell the browser exactly what size image to download based on viewport width.

### 7. Image Quality Settings

**Context-Based Quality**:
- **Thumbnails**: 85% quality (good balance of quality/size)
- **Lightbox**: 90% quality (high quality for detailed viewing)
- **Hero Images**: 90% quality (high quality for featured content)

### 8. Caching Strategy

**Configuration**:
```typescript
minimumCacheTTL: 60
```

- Images cached for 60 seconds minimum
- Reduces server load
- Improves repeat visit performance

## Performance Benefits

### Expected Improvements

1. **Largest Contentful Paint (LCP)**:
   - Target: < 2.5s
   - Priority loading ensures above-the-fold images load first
   - AVIF/WebP formats reduce file sizes by 30-50%

2. **Cumulative Layout Shift (CLS)**:
   - Target: < 0.1
   - Blur placeholders prevent layout shift
   - Explicit width/height attributes maintain space

3. **First Input Delay (FID)**:
   - Target: < 100ms
   - Lazy loading reduces main thread blocking
   - Smaller images = faster parsing

4. **Total Blocking Time (TBT)**:
   - Reduced by lazy loading non-critical images
   - Priority loading focuses on critical content

## Image Requirements

### Recommended Specifications

**Still Photos & Landscapes**:
- Dimensions: 1920x1280 (3:2 aspect ratio)
- Format: JPEG or PNG
- Max file size: 2MB (before optimization)

**Portraits**:
- Dimensions: 1280x1920 (2:3 aspect ratio)
- Format: JPEG or PNG
- Max file size: 2MB (before optimization)

### File Organization

```
public/
└── assets/
    ├── still-photos/
    │   ├── image-001.jpg
    │   └── ...
    ├── portraits/
    │   ├── portrait-001.jpg
    │   └── ...
    └── landscapes/
        ├── landscape-001.jpg
        └── ...
```

## Adding New Images

### Step 1: Prepare Image

1. Resize to recommended dimensions
2. Optimize with tools like:
   - ImageOptim (Mac)
   - Squoosh (Web)
   - Sharp (CLI)
3. Save with descriptive filename

### Step 2: Add to Assets

```bash
cp your-image.jpg public/assets/[category]/
```

### Step 3: Update data.json

```json
{
  "id": "unique-id",
  "title": "Image Title",
  "category": "Still Photos|Portraits|Landscapes",
  "imagePath": "/assets/[category]/your-image.jpg",
  "description": "Optional description",
  "width": 1920,
  "height": 1280
}
```

### Step 4: Rebuild

```bash
npm run build
```

Next.js will automatically optimize the new image during build.

## Monitoring Performance

### Tools

1. **Lighthouse** (Chrome DevTools):
   ```bash
   npm run build
   npm run start
   # Open Chrome DevTools > Lighthouse
   ```

2. **WebPageTest**:
   - Test production URL
   - Check image optimization scores
   - Verify AVIF/WebP delivery

3. **Vercel Analytics**:
   - Monitor Core Web Vitals
   - Track LCP, FID, CLS
   - Identify performance regressions

### Key Metrics to Monitor

- **LCP**: Should be < 2.5s (green)
- **FID**: Should be < 100ms (green)
- **CLS**: Should be < 0.1 (green)
- **Image Load Time**: First 6 images < 1s
- **Total Page Weight**: < 2MB initial load

## Troubleshooting

### Images Not Loading

1. Check file path in data.json matches actual file location
2. Verify image file exists in public/assets/
3. Check browser console for 404 errors
4. Ensure image dimensions in data.json are correct

### Slow Image Loading

1. Check original image file size (should be < 2MB)
2. Verify AVIF/WebP formats are being served (Network tab)
3. Check if priority prop is set for above-the-fold images
4. Verify CDN is serving optimized images (Vercel)

### Layout Shift Issues

1. Ensure width and height are specified in data.json
2. Verify blur placeholder is rendering
3. Check aspect ratio matches actual image
4. Use Chrome DevTools > Performance to measure CLS

## Best Practices

1. **Always specify dimensions**: Include width and height in data.json
2. **Use priority sparingly**: Only for above-the-fold images (first 6)
3. **Optimize source images**: Don't upload 10MB images
4. **Test on real devices**: Mobile performance matters most
5. **Monitor Core Web Vitals**: Use Vercel Analytics or Google Search Console
6. **Use appropriate quality**: 85% for thumbnails, 90% for lightbox
7. **Maintain aspect ratios**: Prevents distortion and layout shift

## Future Enhancements

Potential improvements for future iterations:

1. **Dynamic Blur Placeholders**: Generate from actual image data
2. **Art Direction**: Different crops for mobile vs desktop
3. **Progressive Loading**: Load low-res first, then high-res
4. **Image CDN**: Use dedicated image CDN for even faster delivery
5. **Automatic Optimization**: Pre-process images on upload
6. **Responsive Art Direction**: Different images for different viewports

## References

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Web.dev Image Optimization](https://web.dev/fast/#optimize-your-images)
- [Core Web Vitals](https://web.dev/vitals/)
- [AVIF Format](https://jakearchibald.com/2020/avif-has-landed/)
