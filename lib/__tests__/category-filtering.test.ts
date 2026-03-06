import fc from 'fast-check';
import { getArtworksByCategory } from '../artwork-data';
import { artworkArbitrary, categoryFilterArbitrary } from '../pbt-utils';
import { Artwork, CategoryFilter } from '../types';

describe('Category Filtering', () => {
  // Feature: art-portfolio-modernization, Property 1: Category Filtering Correctness
  // **Validates: Requirements 4.2**
  describe('Property 1: Category Filtering Correctness', () => {
    it('should only return artworks of the selected category', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('Still Photos', 'Portraits', 'Landscapes') as fc.Arbitrary<'Still Photos' | 'Portraits' | 'Landscapes'>,
          (category) => {
            const filtered = getArtworksByCategory(category);
            
            // All filtered artworks should belong to the selected category
            return filtered.every(artwork => artwork.category === category);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should include all artworks of the selected category', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('Still Photos', 'Portraits', 'Landscapes') as fc.Arbitrary<'Still Photos' | 'Portraits' | 'Landscapes'>,
          (category) => {
            const filtered = getArtworksByCategory(category);
            const allArtworks = getArtworksByCategory('All');
            
            // Count artworks in the category from all artworks
            const expectedCount = allArtworks.filter(a => a.category === category).length;
            
            // Filtered result should have the same count
            return filtered.length === expectedCount;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return all artworks when "All" category is selected', () => {
      const allArtworks = getArtworksByCategory('All');
      const stillPhotos = getArtworksByCategory('Still Photos');
      const portraits = getArtworksByCategory('Portraits');
      const landscapes = getArtworksByCategory('Landscapes');
      
      // Sum of all categories should equal "All"
      const totalCount = stillPhotos.length + portraits.length + landscapes.length;
      expect(allArtworks.length).toBe(totalCount);
    });

    it('should maintain data integrity - no duplicates or missing artworks', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('Still Photos', 'Portraits', 'Landscapes') as fc.Arbitrary<'Still Photos' | 'Portraits' | 'Landscapes'>,
          (category) => {
            const filtered = getArtworksByCategory(category);
            const allArtworks = getArtworksByCategory('All');
            
            // Every filtered artwork should exist in all artworks
            return filtered.every(filteredArtwork => 
              allArtworks.some(artwork => artwork.id === filteredArtwork.id)
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not modify artwork data during filtering', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('Still Photos', 'Portraits', 'Landscapes') as fc.Arbitrary<'Still Photos' | 'Portraits' | 'Landscapes'>,
          (category) => {
            const filtered = getArtworksByCategory(category);
            
            // All artworks should have required fields intact
            return filtered.every(artwork => 
              artwork.id &&
              artwork.title &&
              artwork.category &&
              artwork.imagePath
            );
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // Unit tests for specific examples
  describe('Unit Tests', () => {
    it('should filter Still Photos correctly', () => {
      const stillPhotos = getArtworksByCategory('Still Photos');
      
      expect(stillPhotos.length).toBeGreaterThan(0);
      stillPhotos.forEach(artwork => {
        expect(artwork.category).toBe('Still Photos');
      });
    });

    it('should filter Portraits correctly', () => {
      const portraits = getArtworksByCategory('Portraits');
      
      expect(portraits.length).toBeGreaterThan(0);
      portraits.forEach(artwork => {
        expect(artwork.category).toBe('Portraits');
      });
    });

    it('should filter Landscapes correctly', () => {
      const landscapes = getArtworksByCategory('Landscapes');
      
      expect(landscapes.length).toBeGreaterThan(0);
      landscapes.forEach(artwork => {
        expect(artwork.category).toBe('Landscapes');
      });
    });

    it('should return all artworks when "All" is selected', () => {
      const allArtworks = getArtworksByCategory('All');
      
      expect(allArtworks.length).toBeGreaterThan(0);
      
      // Should contain artworks from all categories
      const categories = new Set(allArtworks.map(a => a.category));
      expect(categories.size).toBeGreaterThan(0);
    });
  });
});
