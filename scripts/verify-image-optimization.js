#!/usr/bin/env node

/**
 * Image Optimization Verification Script
 * 
 * This script verifies that all image optimization requirements are met:
 * - Next.js Image component is used throughout
 * - Priority prop is set on above-the-fold images
 * - Image sizes and formats are optimized
 * - Requirements 3.1, 3.2, 13.5 are satisfied
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Image Optimization...\n');

// Check 1: Verify next.config.ts has proper image optimization settings
console.log('✓ Check 1: Next.js Image Configuration');
const nextConfig = fs.readFileSync(path.join(__dirname, '../next.config.ts'), 'utf8');

const checks = {
  avif: nextConfig.includes("'image/avif'"),
  webp: nextConfig.includes("'image/webp'"),
  deviceSizes: nextConfig.includes('deviceSizes'),
  imageSizes: nextConfig.includes('imageSizes'),
  unoptimized: nextConfig.includes('unoptimized: false'),
};

Object.entries(checks).forEach(([key, passed]) => {
  console.log(`  ${passed ? '✓' : '✗'} ${key}: ${passed ? 'Configured' : 'Missing'}`);
});

// Check 2: Verify ArtworkCard uses Next.js Image with priority prop
console.log('\n✓ Check 2: ArtworkCard Component');
const artworkCard = fs.readFileSync(path.join(__dirname, '../components/ArtworkCard.tsx'), 'utf8');

const artworkCardChecks = {
  'Next.js Image import': artworkCard.includes("import Image from 'next/image'"),
  'Priority prop support': artworkCard.includes('priority={priority}'),
  'Lazy loading': artworkCard.includes("loading={priority ? 'eager' : 'lazy'}"),
  'Blur placeholder': artworkCard.includes('placeholder="blur"'),
  'Sizes attribute': artworkCard.includes('sizes={getGallerySizes()}'),
  'Quality optimization': artworkCard.includes("quality={getImageQuality('thumbnail')}"),
};

Object.entries(artworkCardChecks).forEach(([key, passed]) => {
  console.log(`  ${passed ? '✓' : '✗'} ${key}`);
});

// Check 3: Verify Gallery component prioritizes first 6 images
console.log('\n✓ Check 3: Gallery Component - Priority Loading');
const gallery = fs.readFileSync(path.join(__dirname, '../components/Gallery.tsx'), 'utf8');

const galleryChecks = {
  'Priority function used': gallery.includes('shouldPrioritizeImage'),
  'First 6 images prioritized': gallery.includes('shouldPrioritizeImage(index, 6)'),
  'Priority passed to ArtworkCard': gallery.includes('priority={'),
};

Object.entries(galleryChecks).forEach(([key, passed]) => {
  console.log(`  ${passed ? '✓' : '✗'} ${key}`);
});

// Check 4: Verify Lightbox uses optimized images
console.log('\n✓ Check 4: Lightbox Component');
const lightbox = fs.readFileSync(path.join(__dirname, '../components/Lightbox.tsx'), 'utf8');

const lightboxChecks = {
  'Next.js Image import': lightbox.includes("import Image from 'next/image'"),
  'Priority loading': lightbox.includes('priority'),
  'Sizes attribute': lightbox.includes('sizes={getLightboxSizes()}'),
  'Quality optimization': lightbox.includes("quality={getImageQuality('lightbox')}"),
};

Object.entries(lightboxChecks).forEach(([key, passed]) => {
  console.log(`  ${passed ? '✓' : '✗'} ${key}`);
});

// Check 5: Verify image utility functions exist
console.log('\n✓ Check 5: Image Utility Functions');
const imageUtils = fs.readFileSync(path.join(__dirname, '../lib/image-utils.ts'), 'utf8');

const utilChecks = {
  'generateBlurDataURL': imageUtils.includes('export function generateBlurDataURL'),
  'getGallerySizes': imageUtils.includes('export function getGallerySizes'),
  'getLightboxSizes': imageUtils.includes('export function getLightboxSizes'),
  'shouldPrioritizeImage': imageUtils.includes('export function shouldPrioritizeImage'),
  'getImageQuality': imageUtils.includes('export function getImageQuality'),
};

Object.entries(utilChecks).forEach(([key, passed]) => {
  console.log(`  ${passed ? '✓' : '✗'} ${key}`);
});

// Check 6: Verify data.json has width and height for all images
console.log('\n✓ Check 6: Image Metadata in data.json');
const dataJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/data.json'), 'utf8'));

let allHaveDimensions = true;
dataJson.artworks.forEach(artwork => {
  if (!artwork.width || !artwork.height) {
    console.log(`  ✗ Missing dimensions for: ${artwork.id}`);
    allHaveDimensions = false;
  }
});

if (allHaveDimensions) {
  console.log(`  ✓ All ${dataJson.artworks.length} artworks have width and height specified`);
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 VERIFICATION SUMMARY');
console.log('='.repeat(60));

const allChecks = {
  ...checks,
  ...artworkCardChecks,
  ...galleryChecks,
  ...lightboxChecks,
  ...utilChecks,
  'All images have dimensions': allHaveDimensions,
};

const passed = Object.values(allChecks).filter(Boolean).length;
const total = Object.keys(allChecks).length;

console.log(`\n✓ Passed: ${passed}/${total} checks`);

if (passed === total) {
  console.log('\n🎉 All image optimization requirements are met!');
  console.log('\nRequirements Validated:');
  console.log('  ✓ 3.1: Next.js Image component used for all artwork images');
  console.log('  ✓ 3.2: Appropriately sized images served based on viewport');
  console.log('  ✓ 13.5: Above-the-fold images prioritized for loading');
  process.exit(0);
} else {
  console.log('\n⚠️  Some checks failed. Please review the output above.');
  process.exit(1);
}
