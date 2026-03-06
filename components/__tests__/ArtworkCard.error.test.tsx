import { render, screen, fireEvent } from '@testing-library/react';
import ArtworkCard from '../ArtworkCard';
import { Artwork } from '@/lib/types';

const mockArtwork: Artwork = {
  id: 'test-1',
  title: 'Test Artwork',
  category: 'Still Photos',
  imagePath: '/test-image.jpg',
};

describe('ArtworkCard - Image Error Handling', () => {
  it('should display error fallback when image fails to load', () => {
    render(<ArtworkCard artwork={mockArtwork} onClick={jest.fn()} />);
    
    const image = screen.getByRole('img');
    
    // Simulate image load error
    fireEvent.error(image);
    
    expect(screen.getByText('Image unavailable')).toBeInTheDocument();
  });

  it('should display fallback icon when image fails', () => {
    const { container } = render(<ArtworkCard artwork={mockArtwork} onClick={jest.fn()} />);
    
    const image = screen.getByRole('img');
    fireEvent.error(image);
    
    // Check for SVG icon in the container
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should still be clickable when image fails to load', () => {
    const handleClick = jest.fn();
    render(<ArtworkCard artwork={mockArtwork} onClick={handleClick} />);
    
    const image = screen.getByRole('img');
    fireEvent.error(image);
    
    const card = screen.getByRole('button', { name: /view test artwork/i });
    fireEvent.click(card);
    
    expect(handleClick).toHaveBeenCalledWith(mockArtwork);
  });
});
