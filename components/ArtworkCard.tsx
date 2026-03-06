'use client';

import Image from 'next/image';
import { Artwork } from '@/lib/types';
import { useState } from 'react';
import { generateBlurDataURL, getGallerySizes, getImageQuality } from '@/lib/image-utils';

interface ArtworkCardProps {
  artwork: Artwork;
  onClick: (artwork: Artwork) => void;
  priority?: boolean;
}

export default function ArtworkCard({ artwork, onClick, priority = false }: ArtworkCardProps) {
  const [imageError, setImageError] = useState(false);
  
  // Generate optimized blur placeholder based on image dimensions
  const blurDataURL = generateBlurDataURL(
    artwork.width || 400,
    artwork.height || 400,
    '#f3f4f6'
  );

  return (
    <div
      className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer min-h-[120px]"
      onClick={() => onClick(artwork)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(artwork);
        }
      }}
      aria-label={`View ${artwork.title}`}
    >
      {/* Image Container with aspect ratio */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {!imageError ? (
          <Image
            src={artwork.imagePath}
            alt={artwork.title}
            fill
            sizes={getGallerySizes()}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            placeholder="blur"
            blurDataURL={blurDataURL}
            onError={() => setImageError(true)}
            quality={getImageQuality('thumbnail')}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <div className="text-center p-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-500">Image unavailable</p>
            </div>
          </div>
        )}

        {/* Title Overlay - appears on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-semibold text-lg mb-1">
              {artwork.title}
            </h3>
            <p className="text-white/90 text-sm">
              {artwork.category}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
