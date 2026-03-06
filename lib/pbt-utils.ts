import fc from 'fast-check';
import { Artwork, CategoryFilter, ContactFormData } from './types';

// Arbitrary generators for property-based testing

export const artworkArbitrary = fc.record({
  id: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
  title: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
  category: fc.constantFrom('Still Photos', 'Portraits', 'Landscapes') as fc.Arbitrary<'Still Photos' | 'Portraits' | 'Landscapes'>,
  imagePath: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0).map(s => `/assets/${s.trim()}.jpg`),
  description: fc.option(fc.string()),
  width: fc.option(fc.integer({ min: 100, max: 4000 })),
  height: fc.option(fc.integer({ min: 100, max: 4000 })),
}) as fc.Arbitrary<Artwork>;

export const categoryFilterArbitrary = fc.constantFrom(
  'All',
  'Still Photos',
  'Portraits',
  'Landscapes'
) as fc.Arbitrary<CategoryFilter>;

export const contactFormDataArbitrary = fc.record({
  name: fc.string({ minLength: 2 }),
  email: fc.emailAddress(),
  subject: fc.string({ minLength: 3 }),
  message: fc.string({ minLength: 10 }),
}) as fc.Arbitrary<ContactFormData>;

// Helper function to run property tests with default configuration
export const runPropertyTest = <T,>(
  arbitrary: fc.Arbitrary<T>,
  predicate: (value: T) => boolean | void,
  options: fc.Parameters<[T]> = {}
) => {
  return fc.assert(
    fc.property(arbitrary, predicate),
    { numRuns: 100, ...options }
  );
};
