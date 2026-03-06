import { getAllArtworks, getArtworksByCategory, getArtworkById, getCategoryCounts } from '../artwork-data';
import { runPropertyTest } from '../pbt-utils';
import fc from 'fast-check';

describe('Artwork Data Utilities', () => {
  describe('Property 12: Artwork Data Structure Validity', () => {
    /**
     * **Validates: Requirements 12.1, 12.4, 12.5**
     * 
     * This property test verifies that all artworks in the data store
     * have the required fields and valid values:
     * - All required fields are present (id, title, category, imagePath)
     * - Category is one of the three valid categories
     * - Image paths start with "/" or "/assets/"
     */
    it('should have all required fields with valid values', () => {
      const artworks = getAllArtworks();
      
      runPropertyTest(
        fc.constantFrom(...artworks),
        (artwork) => {
          // Test that all required fields are present and non-empty
          expect(artwork.id).toBeDefined();
          expect(typeof artwork.id).toBe('string');
          expect(artwork.id.length).toBeGreaterThan(0);
          
          expect(artwork.title).toBeDefined();
          expect(typeof artwork.title).toBe('string');
          expect(artwork.title.length).toBeGreaterThan(0);
          
          expect(artwork.category).toBeDefined();
          expect(typeof artwork.category).toBe('string');
          
          expect(artwork.imagePath).toBeDefined();
          expect(typeof artwork.imagePath).toBe('string');
          expect(artwork.imagePath.length).toBeGreaterThan(0);
          
          // Test that category is valid
          expect(['Still Photos', 'Portraits', 'Landscapes']).toContain(artwork.category);
          
          // Test that image path starts with "/" or "/assets/"
          const startsWithSlash = artwork.imagePath.startsWith('/');
          const startsWithAssets = artwork.imagePath.startsWith('/assets/');
          expect(startsWithSlash || startsWithAssets).toBe(true);
        },
        { numRuns: 100 }
      );
    });

    it('should validate all artworks have required fields', () => {
      const artworks = getAllArtworks();
      
      artworks.forEach(artwork => {
        expect(artwork).toHaveProperty('id');
        expect(artwork).toHaveProperty('title');
        expect(artwork).toHaveProperty('category');
        expect(artwork).toHaveProperty('imagePath');
      });
    });

    it('should validate all categories are valid', () => {
      const artworks = getAllArtworks();
      const validCategories = ['Still Photos', 'Portraits', 'Landscapes'];
      
      artworks.forEach(artwork => {
        expect(validCategories).toContain(artwork.category);
      });
    });

    it('should validate all image paths start with "/" or "/assets/"', () => {
      const artworks = getAllArtworks();
      
      artworks.forEach(artwork => {
        const startsWithSlash = artwork.imagePath.startsWith('/');
        const startsWithAssets = artwork.imagePath.startsWith('/assets/');
        expect(startsWithSlash || startsWithAssets).toBe(true);
      });
    });
  });

  describe('Data Utility Functions', () => {
    it('should return all artworks', () => {
      const artworks = getAllArtworks();
      expect(Array.isArray(artworks)).toBe(true);
      expect(artworks.length).toBeGreaterThan(0);
    });

    it('should filter artworks by category', () => {
      const stillPhotos = getArtworksByCategory('Still Photos');
      expect(stillPhotos.every(a => a.category === 'Still Photos')).toBe(true);
      
      const portraits = getArtworksByCategory('Portraits');
      expect(portraits.every(a => a.category === 'Portraits')).toBe(true);
      
      const landscapes = getArtworksByCategory('Landscapes');
      expect(landscapes.every(a => a.category === 'Landscapes')).toBe(true);
    });

    it('should return all artworks when category is "All"', () => {
      const all = getArtworksByCategory('All');
      const allArtworks = getAllArtworks();
      expect(all.length).toBe(allArtworks.length);
    });

    it('should find artwork by id', () => {
      const artworks = getAllArtworks();
      const firstArtwork = artworks[0];
      const found = getArtworkById(firstArtwork.id);
      expect(found).toEqual(firstArtwork);
    });

    it('should return undefined for non-existent id', () => {
      const found = getArtworkById('non-existent-id');
      expect(found).toBeUndefined();
    });

    it('should return correct category counts', () => {
      const counts = getCategoryCounts();
      const allArtworks = getAllArtworks();
      
      expect(counts['All']).toBe(allArtworks.length);
      expect(counts['Still Photos']).toBe(allArtworks.filter(a => a.category === 'Still Photos').length);
      expect(counts['Portraits']).toBe(allArtworks.filter(a => a.category === 'Portraits').length);
      expect(counts['Landscapes']).toBe(allArtworks.filter(a => a.category === 'Landscapes').length);
    });
  });
});
