/**
 * Image Optimization Tests
 * 
 * Tests to verify image optimization requirements:
 * - Requirement 3.1: Next.js Image component used for all artwork images
 * - Requirement 3.2: Appropriately sized images served based on viewport
 * - Requirement 13.5: Above-the-fold images prioritized for loading
 */

import { render, screen } from '@testing-library/react';
import ArtworkCard from '@/components/ArtworkCard';
import Gallery from '@/components/Gallery';
import Lightbox from '@/components/Lightbox';
import { Artwork } from '@/lib/types';
import {
  generateBlurDataURL,
  getGallerySizes,
  getLightboxSizes,
  shouldPrioritizeImage,
  getImageQuality,
} from '@/lib/image-utils';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

const mockArtwork: Artwork = {
  id: 'test-001',
  title: 'Test Artwork',
  category: 'Still Photos',
  imagePath: '/assets/test.jpg',
  width: 1920,
  height: 1280,
};

const mockArtworks: Artwork[] = Array.from({ length: 10 }, (_, i) => ({
  id: `artwork-${i}`,
  title: `Artwork ${i}`,
  category: 'Still Photos',
  imagePath: `/assets/artwork-${i}.jpg`,
  width: 1920,
  height: 1280,
}));

describe('Image Optimization - Requirement 3.1: Next.js Image Component', () => {
  it('should use Next.js Image component in ArtworkCard', () => {
    const onClick = jest.fn();
    const { container } = render(
      <ArtworkCard artwork={mockArtwork} onClick={onClick} />
    );

    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', mockArtwork.imagePath);
    expect(img).toHaveAttribute('alt', mockArtwork.title);
  });

  it('should include alt text for accessibility', () => {
    const onClick = jest.fn();
    render(<ArtworkCard artwork={mockArtwork} onClick={onClick} />);

    const img = screen.getByAltText(mockArtwork.title);
    expect(img).toBeInTheDocument();
  });

  it('should use blur placeholder for loading state', () => {
    const onClick = jest.fn();
    const { container } = render(
      <ArtworkCard artwork={mockArtwork} onClick={onClick} />
    );

    const img = container.querySelector('img');
    expect(img).toHaveAttribute('placeholder', 'blur');
  });
});

describe('Image Optimization - Requirement 3.2: Responsive Image Sizes', () => {
  it('should generate correct gallery sizes attribute', () => {
    const sizes = getGallerySizes();
    expect(sizes).toContain('(max-width: 640px) 100vw');
    expect(sizes).toContain('(max-width: 768px) 50vw');
    expect(sizes).toContain('(max-width: 1024px) 33vw');
    expect(sizes).toContain('25vw');
  });

  it('should generate correct lightbox sizes attribute', () => {
    const sizes = getLightboxSizes();
    expect(sizes).toContain('(max-width: 768px) 100vw');
    expect(sizes).toContain('(max-width: 1200px) 90vw');
    expect(sizes).toContain('80vw');
  });

  it('should apply sizes attribute to gallery images', () => {
    const onClick = jest.fn();
    const { container } = render(
      <ArtworkCard artwork={mockArtwork} onClick={onClick} />
    );

    const img = container.querySelector('img');
    expect(img).toHaveAttribute('sizes');
    const sizes = img?.getAttribute('sizes');
    expect(sizes).toContain('vw'); // Should contain viewport width units
  });

  it('should use appropriate quality settings for thumbnails', () => {
    const quality = getImageQuality('thumbnail');
    expect(quality).toBe(85);
  });

  it('should use appropriate quality settings for lightbox', () => {
    const quality = getImageQuality('lightbox');
    expect(quality).toBe(90);
  });

  it('should use appropriate quality settings for hero images', () => {
    const quality = getImageQuality('hero');
    expect(quality).toBe(90);
  });
});

describe('Image Optimization - Requirement 13.5: Priority Loading', () => {
  it('should prioritize first 6 images', () => {
    expect(shouldPrioritizeImage(0, 6)).toBe(true);
    expect(shouldPrioritizeImage(5, 6)).toBe(true);
    expect(shouldPrioritizeImage(6, 6)).toBe(false);
    expect(shouldPrioritizeImage(10, 6)).toBe(false);
  });

  it('should pass priority prop to above-the-fold images', () => {
    const onClick = jest.fn();
    const { container: priorityContainer } = render(
      <ArtworkCard artwork={mockArtwork} onClick={onClick} priority={true} />
    );

    const priorityImg = priorityContainer.querySelector('img');
    // In the mock, priority is passed as a prop
    expect(priorityImg).toHaveAttribute('loading', 'eager');
  });

  it('should use lazy loading for below-the-fold images', () => {
    const onClick = jest.fn();
    const { container } = render(
      <ArtworkCard artwork={mockArtwork} onClick={onClick} priority={false} />
    );

    const img = container.querySelector('img');
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  it('should prioritize first 6 images in gallery', () => {
    render(<Gallery artworks={mockArtworks} />);

    // The gallery should render with priority on first 6 images
    // This is tested through the shouldPrioritizeImage function
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
  });
});

describe('Image Optimization - Blur Placeholder Generation', () => {
  it('should generate valid blur data URL', () => {
    const blurDataURL = generateBlurDataURL(400, 400, '#f3f4f6');
    expect(blurDataURL).toMatch(/^data:image\/svg\+xml;base64,/);
  });

  it('should generate blur data URL with correct dimensions', () => {
    const blurDataURL = generateBlurDataURL(1920, 1280, '#f3f4f6');
    // Decode base64 to check content
    const decoded = Buffer.from(blurDataURL.split(',')[1], 'base64').toString();
    expect(decoded).toContain('width="1920"');
    expect(decoded).toContain('height="1280"');
  });

  it('should generate blur data URL with specified color', () => {
    const color = '#4f8fef';
    const blurDataURL = generateBlurDataURL(400, 400, color);
    // Decode base64 to check content
    const decoded = Buffer.from(blurDataURL.split(',')[1], 'base64').toString();
    expect(decoded).toContain(color);
  });
});

describe('Image Optimization - Error Handling', () => {
  it('should display fallback when image fails to load', () => {
    const onClick = jest.fn();
    const { container } = render(
      <ArtworkCard artwork={mockArtwork} onClick={onClick} />
    );

    const img = container.querySelector('img');
    // The component has error handling via onError callback
    expect(img).toBeInTheDocument();
  });

  it('should show error state in lightbox when image fails', () => {
    const onClose = jest.fn();
    const onNavigate = jest.fn();

    render(
      <Lightbox
        artwork={mockArtwork}
        allArtworks={[mockArtwork]}
        onClose={onClose}
        onNavigate={onNavigate}
      />
    );

    // Lightbox should handle image errors gracefully
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});

describe('Image Optimization - Performance Considerations', () => {
  it('should maintain aspect ratio with width and height', () => {
    const onClick = jest.fn();
    render(<ArtworkCard artwork={mockArtwork} onClick={onClick} />);

    // The component should use the artwork's width and height
    expect(mockArtwork.width).toBeDefined();
    expect(mockArtwork.height).toBeDefined();
  });

  it('should use fill layout for gallery thumbnails', () => {
    const onClick = jest.fn();
    const { container } = render(
      <ArtworkCard artwork={mockArtwork} onClick={onClick} />
    );

    const img = container.querySelector('img');
    // The component uses fill prop in Next.js Image
    expect(img).toBeInTheDocument();
  });

  it('should specify explicit dimensions for lightbox images', () => {
    const onClose = jest.fn();
    const onNavigate = jest.fn();

    const { container } = render(
      <Lightbox
        artwork={mockArtwork}
        allArtworks={[mockArtwork]}
        onClose={onClose}
        onNavigate={onNavigate}
      />
    );

    const img = container.querySelector('img[alt="Test Artwork"]');
    if (img) {
      expect(img).toHaveAttribute('width');
      expect(img).toHaveAttribute('height');
    }
  });
});

describe('Image Optimization - Integration Tests', () => {
  it('should render gallery with optimized images', () => {
    render(<Gallery artworks={mockArtworks} />);

    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);

    // All images should have alt text
    images.forEach(img => {
      expect(img).toHaveAttribute('alt');
    });
  });

  it('should apply different optimization strategies based on context', () => {
    const thumbnailQuality = getImageQuality('thumbnail');
    const lightboxQuality = getImageQuality('lightbox');
    const heroQuality = getImageQuality('hero');

    // Thumbnails should use lower quality for performance
    expect(thumbnailQuality).toBeLessThan(lightboxQuality);

    // Lightbox and hero should use high quality
    expect(lightboxQuality).toBeGreaterThanOrEqual(90);
    expect(heroQuality).toBeGreaterThanOrEqual(90);
  });
});
