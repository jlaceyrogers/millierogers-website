'use client';

import { useState, useMemo } from 'react';
import { Artwork, CategoryFilter as CategoryFilterType } from '@/lib/types';
import ArtworkCard from './ArtworkCard';
import CategoryFilter from './CategoryFilter';
import Lightbox from './Lightbox';
import { shouldPrioritizeImage } from '@/lib/image-utils';

interface GalleryProps {
  artworks: Artwork[];
  initialCategory?: CategoryFilterType;
}

export default function Gallery({ artworks, initialCategory = 'All' }: GalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilterType>(initialCategory);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  // Calculate category counts
  const artworkCounts = useMemo(() => {
    return {
      'All': artworks.length,
      'Still Life': artworks.filter(a => a.category === 'Still Life').length,
      'Portraits': artworks.filter(a => a.category === 'Portraits').length,
      'Landscapes': artworks.filter(a => a.category === 'Landscapes').length,
    };
  }, [artworks]);

  // Filter artworks based on selected category
  const filteredArtworks = useMemo(() => {
    if (selectedCategory === 'All') {
      return artworks;
    }
    return artworks.filter(artwork => artwork.category === selectedCategory);
  }, [artworks, selectedCategory]);

  const handleCategoryChange = (category: CategoryFilterType) => {
    setSelectedCategory(category);
  };

  const handleArtworkClick = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
  };

  const handleCloseLightbox = () => {
    setSelectedArtwork(null);
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (!selectedArtwork) return;

    const currentIndex = filteredArtworks.findIndex(a => a.id === selectedArtwork.id);
    let newIndex: number;

    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : currentIndex;
    } else {
      newIndex = currentIndex < filteredArtworks.length - 1 ? currentIndex + 1 : currentIndex;
    }

    setSelectedArtwork(filteredArtworks[newIndex]);
  };

  return (
    <div className="w-full">
      {/* Category Filter */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        artworkCounts={artworkCounts}
      />

      {/* Gallery Grid - Optimized for mobile with 1-2 columns */}
      {filteredArtworks.length > 0 ? (
        <div
          className="
            grid gap-4
            grid-cols-1
            xs:grid-cols-2
            sm:grid-cols-2
            md:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
            transition-all duration-400
          "
        >
          {filteredArtworks.map((artwork, index) => (
            <div
              key={artwork.id}
              className="animate-fade-in"
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: 'backwards',
              }}
            >
              <ArtworkCard
                artwork={artwork}
                onClick={handleArtworkClick}
                priority={shouldPrioritizeImage(index, 6)} // Prioritize first 6 images for better LCP
              />
            </div>
          ))}
        </div>
      ) : (
        // Empty state
        <div className="text-center py-20">
          <svg
            className="mx-auto h-16 w-16 text-gray-400 mb-4"
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
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No artworks found
          </h3>
          <p className="text-gray-600">
            No artworks match the selected category.
          </p>
        </div>
      )}

      {/* Lightbox Modal */}
      <Lightbox
        artwork={selectedArtwork}
        allArtworks={filteredArtworks}
        onClose={handleCloseLightbox}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
