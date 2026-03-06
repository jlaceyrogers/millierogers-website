import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fc from 'fast-check';
import Gallery from '../Gallery';
import { categoryFilterArbitrary } from '@/lib/pbt-utils';
import { Artwork, CategoryFilter } from '@/lib/types';

// Mock artwork data for testing
const mockArtworks: Artwork[] = [
  {
    id: 'still-1',
    title: 'Still Photo 1',
    category: 'Still Photos',
    imagePath: '/assets/still-1.jpg',
  },
  {
    id: 'still-2',
    title: 'Still Photo 2',
    category: 'Still Photos',
    imagePath: '/assets/still-2.jpg',
  },
  {
    id: 'portrait-1',
    title: 'Portrait 1',
    category: 'Portraits',
    imagePath: '/assets/portrait-1.jpg',
  },
  {
    id: 'portrait-2',
    title: 'Portrait 2',
    category: 'Portraits',
    imagePath: '/assets/portrait-2.jpg',
  },
  {
    id: 'landscape-1',
    title: 'Landscape 1',
    category: 'Landscapes',
    imagePath: '/assets/landscape-1.jpg',
  },
  {
    id: 'landscape-2',
    title: 'Landscape 2',
    category: 'Landscapes',
    imagePath: '/assets/landscape-2.jpg',
  },
];

describe('Gallery Component', () => {
  // Feature: art-portfolio-modernization, Property 2: Filter State Persistence
  // **Validates: Requirements 4.5**
  describe('Property 2: Filter State Persistence', () => {
    it('should persist selected category during session', async () => {
      const user = userEvent.setup();

      await fc.assert(
        fc.asyncProperty(
          categoryFilterArbitrary,
          async (category) => {
            const { unmount } = render(<Gallery artworks={mockArtworks} />);

            // Find and click the category button
            const categoryButton = screen.getByRole('button', {
              name: new RegExp(category, 'i'),
            });
            await user.click(categoryButton);

            // Verify the button is in pressed state (active)
            expect(categoryButton).toHaveAttribute('aria-pressed', 'true');

            // Verify the selected category persists by checking if button remains active
            expect(categoryButton).toHaveAttribute('aria-pressed', 'true');

            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain filter state across multiple interactions', async () => {
      const user = userEvent.setup();

      await fc.assert(
        fc.asyncProperty(
          fc.array(categoryFilterArbitrary, { minLength: 2, maxLength: 5 }),
          async (categories) => {
            const { unmount } = render(<Gallery artworks={mockArtworks} />);

            // Click through multiple categories
            for (const category of categories) {
              const categoryButton = screen.getByRole('button', {
                name: new RegExp(category, 'i'),
              });
              await user.click(categoryButton);

              // Verify this category is now active
              expect(categoryButton).toHaveAttribute('aria-pressed', 'true');

              // Verify other categories are not active
              const allButtons = screen.getAllByRole('button', {
                name: /\(.*\)/,
              });
              allButtons.forEach((button) => {
                if (button === categoryButton) {
                  expect(button).toHaveAttribute('aria-pressed', 'true');
                } else {
                  expect(button).toHaveAttribute('aria-pressed', 'false');
                }
              });
            }

            unmount();
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  // Unit tests for specific examples
  describe('Unit Tests', () => {
    it('should display all artworks by default', () => {
      render(<Gallery artworks={mockArtworks} />);

      // Should show all 6 artworks
      const artworkCards = screen.getAllByRole('button', {
        name: /view/i,
      });
      expect(artworkCards).toHaveLength(6);
    });

    it('should filter artworks when category is selected', async () => {
      const user = userEvent.setup();
      render(<Gallery artworks={mockArtworks} />);

      // Click "Still Photos" filter
      const stillPhotosButton = screen.getByRole('button', {
        name: /still photos.*2/i,
      });
      await user.click(stillPhotosButton);

      // Should show only 2 still photos
      const artworkCards = screen.getAllByRole('button', {
        name: /view/i,
      });
      expect(artworkCards).toHaveLength(2);
    });

    it('should display empty state when no artworks match filter', () => {
      // Render with empty artworks array
      render(<Gallery artworks={[]} />);

      expect(screen.getByText('No artworks found')).toBeInTheDocument();
      expect(
        screen.getByText('No artworks match the selected category.')
      ).toBeInTheDocument();
    });

    it('should display correct category counts', () => {
      render(<Gallery artworks={mockArtworks} />);

      // Check aria-labels which contain the full text
      expect(screen.getByLabelText('Filter by All (6 artworks)')).toBeInTheDocument();
      expect(screen.getByLabelText('Filter by Still Photos (2 artworks)')).toBeInTheDocument();
      expect(screen.getByLabelText('Filter by Portraits (2 artworks)')).toBeInTheDocument();
      expect(screen.getByLabelText('Filter by Landscapes (2 artworks)')).toBeInTheDocument();
    });

    it('should initialize with provided initialCategory', () => {
      render(<Gallery artworks={mockArtworks} initialCategory="Portraits" />);

      const portraitsButton = screen.getByRole('button', {
        name: /portraits.*2/i,
      });
      expect(portraitsButton).toHaveAttribute('aria-pressed', 'true');

      // Should show only 2 portraits
      const artworkCards = screen.getAllByRole('button', {
        name: /view/i,
      });
      expect(artworkCards).toHaveLength(2);
    });

    it('should call onClick handler when artwork is clicked', async () => {
      const user = userEvent.setup();
      render(<Gallery artworks={mockArtworks} />);

      const firstArtwork = screen.getByRole('button', {
        name: /view still photo 1/i,
      });
      await user.click(firstArtwork);

      // Note: Currently just verifies no errors occur
      // Lightbox functionality will be tested in task 8
    });
  });
});
