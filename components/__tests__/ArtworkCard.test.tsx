import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fc from 'fast-check';
import ArtworkCard from '../ArtworkCard';
import { artworkArbitrary } from '@/lib/pbt-utils';

describe('ArtworkCard Component', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  // Feature: art-portfolio-modernization, Property 13: Image Alt Text Presence
  // **Validates: Requirements 14.1**
  describe('Property 13: Image Alt Text Presence', () => {
    it('should have non-empty alt text for all artwork images', () => {
      fc.assert(
        fc.property(artworkArbitrary, (artwork) => {
          const { container } = render(
            <ArtworkCard artwork={artwork} onClick={mockOnClick} />
          );

          const img = container.querySelector('img');
          
          // Verify image exists
          expect(img).toBeInTheDocument();
          
          // Verify alt text exists and is non-empty
          const altText = img?.getAttribute('alt');
          expect(altText).toBeTruthy();
          expect(altText).not.toBe('');
          
          // Verify alt text matches artwork title
          expect(altText).toBe(artwork.title);
        }),
        { numRuns: 100 }
      );
    });
  });

  // Unit tests for specific examples
  describe('Unit Tests', () => {
    const mockArtwork = {
      id: 'test-001',
      title: 'Test Artwork',
      category: 'Still Photos' as const,
      imagePath: '/assets/test.jpg',
    };

    it('should render artwork with correct alt text', () => {
      render(<ArtworkCard artwork={mockArtwork} onClick={mockOnClick} />);
      
      const img = screen.getByAltText('Test Artwork');
      expect(img).toBeInTheDocument();
    });

    it('should call onClick when card is clicked', async () => {
      const user = userEvent.setup();
      render(<ArtworkCard artwork={mockArtwork} onClick={mockOnClick} />);
      
      const card = screen.getByRole('button', { name: /view test artwork/i });
      await user.click(card);
      
      expect(mockOnClick).toHaveBeenCalledWith(mockArtwork);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should call onClick when Enter key is pressed', async () => {
      const user = userEvent.setup();
      render(<ArtworkCard artwork={mockArtwork} onClick={mockOnClick} />);
      
      const card = screen.getByRole('button', { name: /view test artwork/i });
      card.focus();
      await user.keyboard('{Enter}');
      
      expect(mockOnClick).toHaveBeenCalledWith(mockArtwork);
    });

    it('should call onClick when Space key is pressed', async () => {
      const user = userEvent.setup();
      render(<ArtworkCard artwork={mockArtwork} onClick={mockOnClick} />);
      
      const card = screen.getByRole('button', { name: /view test artwork/i });
      card.focus();
      await user.keyboard(' ');
      
      expect(mockOnClick).toHaveBeenCalledWith(mockArtwork);
    });

    it('should display title and category on hover', () => {
      render(<ArtworkCard artwork={mockArtwork} onClick={mockOnClick} />);
      
      expect(screen.getByText('Test Artwork')).toBeInTheDocument();
      expect(screen.getByText('Still Photos')).toBeInTheDocument();
    });

    it('should display fallback when image fails to load', async () => {
      const { rerender } = render(<ArtworkCard artwork={mockArtwork} onClick={mockOnClick} />);
      
      const img = screen.getByAltText('Test Artwork');
      
      // Simulate image error
      await userEvent.setup();
      const errorEvent = new Event('error');
      
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          img.dispatchEvent(errorEvent);
          resolve();
        }, 0);
      });
      
      // Wait for state update
      await screen.findByText('Image unavailable');
      expect(screen.getByText('Image unavailable')).toBeInTheDocument();
    });
  });
});
