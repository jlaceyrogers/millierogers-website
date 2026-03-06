#!/usr/bin/env node

/**
 * Generate placeholder images for testing
 * 
 * This script creates simple placeholder images for the portfolio
 * to demonstrate image optimization without requiring actual artwork files.
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dataJson = require('../public/data.json');

async function generatePlaceholderImage(outputPath, width, height, text, color) {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${color}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="48" 
            fill="white" text-anchor="middle" dominant-baseline="middle">
        ${text}
      </text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .jpeg({ quality: 90 })
    .toFile(outputPath);
}

async function main() {
  console.log('🎨 Generating placeholder images...\n');

  const colors = {
    'Still Photos': '#4f8fef',
    'Portraits': '#ADD8E6',
    'Landscapes': '#6b9bd1',
  };

  let generated = 0;

  for (const artwork of dataJson.artworks) {
    const outputPath = path.join(__dirname, '..', 'public', artwork.imagePath);
    const dir = path.dirname(outputPath);

    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Skip if file already exists
    if (fs.existsSync(outputPath)) {
      console.log(`  ⏭️  Skipping ${artwork.id} (already exists)`);
      continue;
    }

    const color = colors[artwork.category] || '#4f8fef';
    await generatePlaceholderImage(
      outputPath,
      artwork.width,
      artwork.height,
      artwork.title,
      color
    );

    console.log(`  ✓ Generated ${artwork.id}`);
    generated++;
  }

  console.log(`\n✅ Generated ${generated} placeholder images`);
  console.log('📁 Images saved to public/assets/');
}

main().catch(console.error);
