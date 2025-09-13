#!/usr/bin/env node

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const photosDir = path.join(__dirname, '../../../img/photos');
const optimizedDir = path.join(__dirname, '../src/assets/images/photos-optimized');

// Create optimized directory if it doesn't exist
if (!fs.existsSync(optimizedDir)) {
  fs.mkdirSync(optimizedDir, { recursive: true });
}

// Get all image files
const imageFiles = fs.readdirSync(photosDir)
  .filter(file => /\.(jpg|jpeg|png)$/i.test(file));

console.log(`Found ${imageFiles.length} images to compress...`);

// Compression settings
const compressionSettings = {
  carousel: {
    width: 400,
    height: 300,
    quality: 80,
    suffix: '-thumb'
  },
  lightbox: {
    width: 1200,
    height: 900,
    quality: 85,
    suffix: '-full'
  }
};

async function compressImage(filename) {
  const inputPath = path.join(photosDir, filename);
  const baseName = path.parse(filename).name;

  try {
    // Get original file size
    const originalStats = fs.statSync(inputPath);
    const originalSizeKB = Math.round(originalStats.size / 1024);

    console.log(`Processing: ${filename} (${originalSizeKB}KB)`);

    // Create carousel thumbnail (WebP)
    const carouselPath = path.join(optimizedDir, `${baseName}${compressionSettings.carousel.suffix}.webp`);
    await sharp(inputPath)
      .resize(compressionSettings.carousel.width, compressionSettings.carousel.height, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: compressionSettings.carousel.quality })
      .toFile(carouselPath);

    // Create lightbox image (WebP)
    const lightboxPath = path.join(optimizedDir, `${baseName}${compressionSettings.lightbox.suffix}.webp`);
    await sharp(inputPath)
      .resize(compressionSettings.lightbox.width, compressionSettings.lightbox.height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: compressionSettings.lightbox.quality })
      .toFile(lightboxPath);

    // Get compressed file sizes
    const carouselStats = fs.statSync(carouselPath);
    const lightboxStats = fs.statSync(lightboxPath);
    const carouselSizeKB = Math.round(carouselStats.size / 1024);
    const lightboxSizeKB = Math.round(lightboxStats.size / 1024);

    const totalCompressedKB = carouselSizeKB + lightboxSizeKB;
    const compressionRatio = Math.round((1 - totalCompressedKB / originalSizeKB) * 100);

    console.log(`  ✓ Carousel: ${carouselSizeKB}KB, Lightbox: ${lightboxSizeKB}KB`);
    console.log(`  ✓ Compression: ${compressionRatio}% reduction\n`);

    return {
      original: originalSizeKB,
      compressed: totalCompressedKB,
      filename: baseName
    };

  } catch (error) {
    console.error(`Error processing ${filename}:`, error.message);
    return null;
  }
}

async function compressAllImages() {
  console.log('Starting image compression...\n');

  const results = [];
  let totalOriginal = 0;
  let totalCompressed = 0;

  for (const filename of imageFiles) {
    const result = await compressImage(filename);
    if (result) {
      results.push(result);
      totalOriginal += result.original;
      totalCompressed += result.compressed;
    }
  }

  // Generate image list for import
  const imageList = results.map(r => ({
    carousel: `${r.filename}-thumb.webp`,
    lightbox: `${r.filename}-full.webp`,
    alt: `Bosque restaurant - ${r.filename.replace(/-/g, ' ')}`
  }));

  const imageListPath = path.join(optimizedDir, 'image-list.json');
  fs.writeFileSync(imageListPath, JSON.stringify(imageList, null, 2));

  console.log('='.repeat(50));
  console.log('COMPRESSION COMPLETE!');
  console.log('='.repeat(50));
  console.log(`Total images processed: ${results.length}`);
  console.log(`Original total size: ${Math.round(totalOriginal / 1024)}MB`);
  console.log(`Compressed total size: ${Math.round(totalCompressed / 1024)}MB`);
  console.log(`Total space saved: ${Math.round((totalOriginal - totalCompressed) / 1024)}MB`);
  console.log(`Overall compression: ${Math.round((1 - totalCompressed / totalOriginal) * 100)}%`);
  console.log(`\nOptimized images saved to: ${optimizedDir}`);
  console.log(`Image list generated: ${imageListPath}`);
}

compressAllImages().catch(console.error);