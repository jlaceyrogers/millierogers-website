/**
 * Unit Tests for Lightbox Component
 * Feature: art-portfolio-modernization
 * Tests edge cases and specific scenarios
 */

import { render, screen, fireEvent } from '@testing-library/react';
import Lightbox from '../Lightbox';
import { Artwork } from '@/lib/types';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} onLoad={props.onLoad} />;
  },
}));

describe('Lightbox Edge Cases', () => {
  const mockArtworks: Artwork[] = [
    {
      id: '1',
      title: 'First Artwork',
      category: 'Still Photos',
      imagePath: '/assets/first.jpg',
    },
    {
      id: '2',
      title: 'Second Artwork',
      category: 'Portraits',
      imagePath: '/assets/second.jpg',
    },
    {
      id: '3',
      title: 'Third Artwork',
      category: 'Landscapes',
      imagePath: '/assets/third.jpg',
    },
  ];

  beforeEach(() => {
    document.body.style.overflow = '';
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  /**
   * Test: Previous button disabled on first artwork
   * **Validates: Requirements 5.6**
   */
  it('should disable previous button on first artwork', () => {
    const mockOnClose = jest.fn();
    const mockOnNavigate = jest.fn();

    render(
      <Lightbox
        artwork={mockArtworks[0]}
        allArtworks={mockArtworks}
        onClose={mockOnClose}
        onNavigate={mockOnNavigate}
      />
    );

    const prevButton = screen.getByLabelText('Previous artwork');
    expect(prevButton).toBeDisabled();
    expect(prevButton).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  /**
   * Test: Next button disabled on last artwork
   * **Validates: Requirements 5.6**
   */
  it('should disable next button on last artwork', () => {
    const mockOnClose = jest.fn();
    const mockOnNavigate = jest.fn();

    render(
      <Lightbox
        artwork={mockArtworks[2]}
        allArtworks={mockArtworks}
        onClose={mockOnClose}
        onNavigate={mockOnNavigate}
      />
    );

    const nextButton = screen.getByLabelText('Next artwork');
    expect(nextButton).toBeDisabled();
    expect(nextButton).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  /**
   * Test: Both navigation buttons enabled on middle artwork
   * **Validates: Requirements 5.6**
   */
  it('should enable both navigation buttons on middle artwork', () => {
    const mockOnClose = jest.fn();
    const mockOnNavigate = jest.fn();

    render(
      <Lightbox
        artwork={mockArtworks[1]}
        allArtworks={mockArtworks}
        onClose={mockOnClose}
        onNavigate={mockOnNavigate}
      />
    );

    const prevButton = screen.getByLabelText('Previous artwork');
    const nextButton = screen.getByLabelText('Next artwork');

    expect(prevButton).not.toBeDisabled();
    expect(nextButton).not.toBeDisabled();
  });

  /**
   * Test: Focus returns to trigger element on close
   * **Validates: Requirements 14.3**
   */
  it('should return focus to trigger element when closed', async () => {
    const mockOnClose = jest.fn();
    const mockOnNavigate = jest.fn();

    // Create a trigger button
    const triggerButton = document.createElement('button');
    triggerButton.textContent = 'Open Lightbox';
    document.body.appendChild(triggerButton);
    triggerButton.focus();

    // Store the initial focused element
    const initialFocus = document.activeElement;
    expect(initialFocus).toBe(triggerButton);

    // Render lightbox
    const { rerender } = render(
      <Lightbox
        artwork={mockArtworks[0]}
        allArtworks={mockArtworks}
        onClose={mockOnClose}
        onNavigate={mockOnNavigate}
      />
    );

    // Wait for focus to shift (the component uses setTimeout)
    await new Promise(resolve => setTimeout(resolve, 150));

    // Close lightbox
    rerender(
      <Lightbox
        artwork={null}
        allArtworks={mockArtworks}
        onClose={mockOnClose}
        onNavigate={mockOnNavigate}
      />
    );

    // Verify focus returned to trigger button
    expect(document.activeElement).toBe(triggerButton);

    // Cleanup
    document.body.removeChild(triggerButton);
  });

  /**
   * Test: Lightbox does not render when artwork is null
   */
  it('should not render when artwork is null', () => {
    const mockOnClose = jest.fn();
    const mockOnNavigate = jest.fn();

    const { container } = render(
      <Lightbox
        artwork={null}
        allArtworks={mockArtworks}
        onClose={mockOnClose}
        onNavigate={mockOnNavigate}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  /**
   * Test: Clicking on content does not close lightbox
   */
  it('should not close when clicking on content', () => {
    const mockOnClose = jest.fn();
    const mockOnNavigate = jest.fn();

    render(
      <Lightbox
        artwork={mockArtworks[0]}
        allArtworks={mockArtworks}
        onClose={mockOnClose}
        onNavigate={mockOnNavigate}
      />
    );

    const title = screen.getByText('First Artwork');
    fireEvent.click(title);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  /**
   * Test: Single artwork disables both navigation buttons
   */
  it('should disable both navigation buttons when only one artwork', () => {
    const mockOnClose = jest.fn();
    const mockOnNavigate = jest.fn();
    const singleArtwork = [mockArtworks[0]];

    render(
      <Lightbox
        artwork={singleArtwork[0]}
        allArtworks={singleArtwork}
        onClose={mockOnClose}
        onNavigate={mockOnNavigate}
      />
    );

    const prevButton = screen.getByLabelText('Previous artwork');
    const nextButton = screen.getByLabelText('Next artwork');

    expect(prevButton).toBeDisabled();
    expect(nextButton).toBeDisabled();
  });

  /**
   * Test: Displays artwork description when available
   */
  it('should display artwork description when available', () => {
    const mockOnClose = jest.fn();
    const mockOnNavigate = jest.fn();
    const artworkWithDescription: Artwork = {
      ...mockArtworks[0],
      description: 'This is a beautiful artwork',
    };

    render(
      <Lightbox
        artwork={artworkWithDescription}
        allArtworks={[artworkWithDescription]}
        onClose={mockOnClose}
        onNavigate={mockOnNavigate}
      />
    );

    expect(screen.getByText('This is a beautiful artwork')).toBeInTheDocument();
  });

  /**
   * Test: Does not display description section when not available
   */
  it('should not display description when not available', () => {
    const mockOnClose = jest.fn();
    const mockOnNavigate = jest.fn();

    const { container } = render(
      <Lightbox
        artwork={mockArtworks[0]}
        allArtworks={mockArtworks}
        onClose={mockOnClose}
        onNavigate={mockOnNavigate}
      />
    );

    // Check that there's no description paragraph
    const descriptionElements = container.querySelectorAll('.mt-3.text-gray-600');
    expect(descriptionElements.length).toBe(0);
  });
});
