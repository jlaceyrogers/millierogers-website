// Artwork data loading utilities

import artworkData from '@/public/data.json';
import { Artwork, CategoryFilter } from './types';

/**
 * Get all artworks from the data store
 * @returns Array of all artwork entries
 */
export function getAllArtworks(): Artwork[] {
  return artworkData.artworks as Artwork[];
}

/**
 * Get artworks filtered by category
 * @param category - The category to filter by ('All' returns all artworks)
 * @returns Array of artworks matching the category
 */
export function getArtworksByCategory(category: CategoryFilter): Artwork[] {
  if (category === 'All') {
    return getAllArtworks();
  }
  return (artworkData.artworks as Artwork[]).filter(artwork => artwork.category === category);
}

/**
 * Get a single artwork by its ID
 * @param id - The unique identifier of the artwork
 * @returns The artwork if found, undefined otherwise
 */
export function getArtworkById(id: string): Artwork | undefined {
  return (artworkData.artworks as Artwork[]).find(artwork => artwork.id === id);
}

/**
 * Get the count of artworks in each category
 * @returns Object with counts for each category including 'All'
 */
export function getCategoryCounts(): Record<CategoryFilter, number> {
  const artworks = getAllArtworks();
  return {
    'All': artworks.length,
    'Still Life': artworks.filter(a => a.category === 'Still Life').length,
    'Portraits': artworks.filter(a => a.category === 'Portraits').length,
    'Landscapes': artworks.filter(a => a.category === 'Landscapes').length,
  };
}
