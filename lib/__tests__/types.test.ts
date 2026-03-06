import { artworkArbitrary, categoryFilterArbitrary, contactFormDataArbitrary } from '../pbt-utils';
import fc from 'fast-check';

describe('Type Definitions and Arbitraries', () => {
  it('should generate valid artwork objects', () => {
    fc.assert(
      fc.property(artworkArbitrary, (artwork) => {
        expect(artwork).toHaveProperty('id');
        expect(artwork).toHaveProperty('title');
        expect(artwork).toHaveProperty('category');
        expect(artwork).toHaveProperty('imagePath');
        expect(['Still Photos', 'Portraits', 'Landscapes']).toContain(artwork.category);
        expect(artwork.imagePath).toMatch(/^\/assets\/.+\.jpg$/);
      }),
      { numRuns: 10 }
    );
  });

  it('should generate valid category filters', () => {
    fc.assert(
      fc.property(categoryFilterArbitrary, (category) => {
        expect(['All', 'Still Photos', 'Portraits', 'Landscapes']).toContain(category);
      }),
      { numRuns: 10 }
    );
  });

  it('should generate valid contact form data', () => {
    fc.assert(
      fc.property(contactFormDataArbitrary, (formData) => {
        expect(formData.name.length).toBeGreaterThanOrEqual(2);
        expect(formData.email).toMatch(/@/);
        expect(formData.subject.length).toBeGreaterThanOrEqual(3);
        expect(formData.message.length).toBeGreaterThanOrEqual(10);
      }),
      { numRuns: 10 }
    );
  });
});
