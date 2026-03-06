/**
 * Property-Based Tests for Lightbox Component
 * Feature: art-portfolio-modernization
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import fc from 'fast-check';
import Lightbox from '../Lightbox';
import { Artwork } from '@/lib/types';
import { artworkArbitrary } from '@/lib/pbt-utils';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} onLoad={props.onLoad} />;
  },
}));

describe('Lightbox Property-Based Tests', () => {
  beforeEach(() => {
    // Reset body overflow before each test
    document.body.style.overflow = '';
  });

  afterEach(() => {
    // Clean up body overflow after each test
    document.body.style.overflow = '';
  });

  /**
   * Property 3: Lightbox Content Display
   * **Validates: Requirements 5.2, 5.3**
   */
  describe('Property 3: Lightbox Content Display', () => {
    it('should display correct artwork data for any artwork', () => {
      fc.assert(
        fc.property(
          fc.array(artworkArbitrary, { minLength: 1, maxLength: 10 }),
          fc.integer({ min: 0, max: 9 }),
          (artworks, indexMod) => {
            const index = indexMod % artworks.length;
            const selectedArtwork = artworks[index];
            const mockOnClose = jest.fn();
            const mockOnNavigate = jest.fn();

            const { unmount } = render(
              <Lightbox
                artwork={selectedArtwork}
                allArtworks={artworks}
                onClose={mockOnClose}
                onNavigate={mockOnNavigate}
              />
            );

            try {
              // Check that the dialog is rendered
              const dialog = screen.getByRole('dialog');
              expect(dialog).toBeInTheDocument();

              // Check that the image is rendered with the correct src
              const images = screen.getAllByRole('img');
              const artworkImage = images.find(img => 
                img.getAttribute('src') === selectedArtwork.imagePath
              );
              expect(artworkImage).toBeDefined();
              expect(artworkImage).toHaveAttribute('alt', selectedArtwork.title);

              // Check that the category is displayed somewhere in the dialog
              expect(dialog.textContent).toContain(selectedArtwork.category);
              
              // Check that the title is displayed somewhere in the dialog
              expect(dialog.textContent).toContain(selectedArtwork.title);
            } finally {
              unmount();
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 4: Lightbox Scroll Prevention
   * **Validates: Requirements 5.4**
   */
  describe('Property 4: Lightbox Scroll Prevention', () => {
    it('should set body overflow to hidden when lightbox is open', () => {
      fc.assert(
        fc.property(
          artworkArbitrary,
          fc.array(artworkArbitrary, { minLength: 1, maxLength: 5 }),
          (artwork, allArtworks) => {
            const mockOnClose = jest.fn();
            const mockOnNavigate = jest.fn();

            // Ensure body overflow is not hidden initially
            document.body.style.overflow = '';

            const { unmount } = render(
              <Lightbox
                artwork={artwork}
                allArtworks={[artwork, ...allArtworks]}
                onClose={mockOnClose}
                onNavigate={mockOnNavigate}
              />
            );

            // Check that body overflow is hidden when lightbox is open
            expect(document.body.style.overflow).toBe('hidden');

            unmount();

            // Check that body overflow is restored when lightbox is closed
            expect(document.body.style.overflow).toBe('');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should restore body overflow when lightbox closes', () => {
      fc.assert(
        fc.property(
          artworkArbitrary,
          fc.array(artworkArbitrary, { minLength: 1, maxLength: 5 }),
          (artwork, allArtworks) => {
            const mockOnClose = jest.fn();
            const mockOnNavigate = jest.fn();

            document.body.style.overflow = '';

            const { rerender, unmount } = render(
              <Lightbox
                artwork={artwork}
                allArtworks={[artwork, ...allArtworks]}
                onClose={mockOnClose}
                onNavigate={mockOnNavigate}
              />
            );

            expect(document.body.style.overflow).toBe('hidden');

            // Close the lightbox by setting artwork to null
            rerender(
              <Lightbox
                artwork={null}
                allArtworks={[artwork, ...allArtworks]}
                onClose={mockOnClose}
                onNavigate={mockOnNavigate}
              />
            );

            // Body overflow should be restored
            expect(document.body.style.overflow).toBe('');

            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 5: Lightbox Close Interactions
   * **Validates: Requirements 5.5**
   */
  describe('Property 5: Lightbox Close Interactions', () => {
    it('should call onClose when close button is clicked', () => {
      fc.assert(
        fc.property(
          artworkArbitrary,
          fc.array(artworkArbitrary, { minLength: 1, maxLength: 5 }),
          (artwork, allArtworks) => {
            const mockOnClose = jest.fn();
            const mockOnNavigate = jest.fn();

            const { unmount } = render(
              <Lightbox
                artwork={artwork}
                allArtworks={[artwork, ...allArtworks]}
                onClose={mockOnClose}
                onNavigate={mockOnNavigate}
              />
            );

            const closeButton = screen.getByLabelText('Close lightbox');
            fireEvent.click(closeButton);

            expect(mockOnClose).toHaveBeenCalledTimes(1);

            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should call onClose when Escape key is pressed', () => {
      fc.assert(
        fc.property(
          artworkArbitrary,
          fc.array(artworkArbitrary, { minLength: 1, maxLength: 5 }),
          (artwork, allArtworks) => {
            const mockOnClose = jest.fn();
            const mockOnNavigate = jest.fn();

            const { unmount } = render(
              <Lightbox
                artwork={artwork}
                allArtworks={[artwork, ...allArtworks]}
                onClose={mockOnClose}
                onNavigate={mockOnNavigate}
              />
            );

            fireEvent.keyDown(document, { key: 'Escape' });

            expect(mockOnClose).toHaveBeenCalledTimes(1);

            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should call onClose when backdrop is clicked', () => {
      fc.assert(
        fc.property(
          artworkArbitrary,
          fc.array(artworkArbitrary, { minLength: 1, maxLength: 5 }),
          (artwork, allArtworks) => {
            const mockOnClose = jest.fn();
            const mockOnNavigate = jest.fn();

            const { unmount, container } = render(
              <Lightbox
                artwork={artwork}
                allArtworks={[artwork, ...allArtworks]}
                onClose={mockOnClose}
                onNavigate={mockOnNavigate}
              />
            );

            // Find the backdrop (the outermost div with role="dialog")
            const backdrop = screen.getByRole('dialog');
            fireEvent.click(backdrop);

            expect(mockOnClose).toHaveBeenCalledTimes(1);

            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 6: Lightbox Navigation Correctness
   * **Validates: Requirements 5.6**
   */
  describe('Property 6: Lightbox Navigation Correctness', () => {
    it('should navigate to correct next artwork', () => {
      fc.assert(
        fc.property(
          fc.array(artworkArbitrary, { minLength: 3, maxLength: 10 }),
          fc.integer({ min: 0, max: 8 }),
          (artworks, indexMod) => {
            // Select an artwork that is not the last one
            const index = indexMod % (artworks.length - 1);
            const currentArtwork = artworks[index];
            const mockOnClose = jest.fn();
            const mockOnNavigate = jest.fn();

            const { unmount } = render(
              <Lightbox
                artwork={currentArtwork}
                allArtworks={artworks}
                onClose={mockOnClose}
                onNavigate={mockOnNavigate}
              />
            );

            const nextButton = screen.getByLabelText('Next artwork');
            fireEvent.click(nextButton);

            expect(mockOnNavigate).toHaveBeenCalledWith('next');

            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should navigate to correct previous artwork', () => {
      fc.assert(
        fc.property(
          fc.array(artworkArbitrary, { minLength: 3, maxLength: 10 }),
          fc.integer({ min: 1, max: 9 }),
          (artworks, indexMod) => {
            // Select an artwork that is not the first one
            const index = 1 + (indexMod % (artworks.length - 1));
            const currentArtwork = artworks[index];
            const mockOnClose = jest.fn();
            const mockOnNavigate = jest.fn();

            const { unmount } = render(
              <Lightbox
                artwork={currentArtwork}
                allArtworks={artworks}
                onClose={mockOnClose}
                onNavigate={mockOnNavigate}
              />
            );

            const prevButton = screen.getByLabelText('Previous artwork');
            fireEvent.click(prevButton);

            expect(mockOnNavigate).toHaveBeenCalledWith('prev');

            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should support arrow key navigation', () => {
      fc.assert(
        fc.property(
          fc.array(artworkArbitrary, { minLength: 3, maxLength: 10 }),
          fc.integer({ min: 1, max: 8 }),
          (artworks, indexMod) => {
            const index = indexMod % (artworks.length - 1);
            const currentArtwork = artworks[index];
            const mockOnClose = jest.fn();
            const mockOnNavigate = jest.fn();

            const { unmount } = render(
              <Lightbox
                artwork={currentArtwork}
                allArtworks={artworks}
                onClose={mockOnClose}
                onNavigate={mockOnNavigate}
              />
            );

            // Test ArrowRight for next
            fireEvent.keyDown(document, { key: 'ArrowRight' });
            expect(mockOnNavigate).toHaveBeenCalledWith('next');

            // Test ArrowLeft for previous
            fireEvent.keyDown(document, { key: 'ArrowLeft' });
            expect(mockOnNavigate).toHaveBeenCalledWith('prev');

            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
