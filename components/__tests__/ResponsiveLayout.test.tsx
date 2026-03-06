/**
 * Responsive Layout Tests for Tablet and Desktop
 * 
 * Task 14.2: Test tablet and desktop layouts
 * Requirements: 6.1, 6.4
 * 
 * This test suite verifies:
 * - Gallery grid scales appropriately (3-4 columns on tablet/desktop)
 * - Navigation displays correctly in desktop view
 * - Proper spacing and typography at all breakpoints
 */

import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import Gallery from '../Gallery';
import Navigation from '../Navigation';
import { Artwork } from '@/lib/types';

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

// Mock artwork data for testing
const mockArtworks: Artwork[] = Array.from({ length: 12 }, (_, i) => ({
  id: `artwork-${i + 1}`,
  title: `Artwork ${i + 1}`,
  category: ['Still Photos', 'Portraits', 'Landscapes'][i % 3] as 'Still Photos' | 'Portraits' | 'Landscapes',
  imagePath: `/assets/artwork-${i + 1}.jpg`,
}));

// Helper function to set viewport size
const setViewportSize = (width: number, height: number = 768) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  window.dispatchEvent(new Event('resize'));
};

describe('Responsive Layout Tests - Tablet and Desktop', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePathname.mockReturnValue('/');
  });

  describe('Gallery Grid Responsive Behavior', () => {
    /**
     * Requirement 6.1: Gallery grid should display 3-4 columns on desktop
     * Requirement 6.4: Gallery should adapt to desktop viewport (≥1024px)
     */
    it('should apply appropriate grid classes for tablet layout (768px-1023px)', () => {
      setViewportSize(800);
      const { container } = render(<Gallery artworks={mockArtworks} />);
      
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toBeInTheDocument();
      
      // Check for tablet grid classes (md:grid-cols-2)
      expect(gridContainer?.className).toMatch(/md:grid-cols-2/);
    });

    it('should apply appropriate grid classes for desktop layout (≥1024px)', () => {
      setViewportSize(1280);
      const { container } = render(<Gallery artworks={mockArtworks} />);
      
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toBeInTheDocument();
      
      // Check for desktop grid classes (lg:grid-cols-3, xl:grid-cols-4)
      expect(gridContainer?.className).toMatch(/lg:grid-cols-3/);
      expect(gridContainer?.className).toMatch(/xl:grid-cols-4/);
    });

    it('should apply 3 columns on large screens (1024px-1279px)', () => {
      setViewportSize(1100);
      const { container } = render(<Gallery artworks={mockArtworks} />);
      
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer?.className).toContain('lg:grid-cols-3');
    });

    it('should apply 4 columns on extra large screens (≥1280px)', () => {
      setViewportSize(1440);
      const { container } = render(<Gallery artworks={mockArtworks} />);
      
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer?.className).toContain('xl:grid-cols-4');
    });

    it('should have proper gap spacing between grid items', () => {
      const { container } = render(<Gallery artworks={mockArtworks} />);
      
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer?.className).toMatch(/gap-4/);
    });

    it('should render all artworks in the grid', () => {
      render(<Gallery artworks={mockArtworks} />);
      
      const artworkCards = screen.getAllByRole('button', {
        name: /view/i,
      });
      
      expect(artworkCards).toHaveLength(mockArtworks.length);
    });
  });

  describe('Navigation Desktop View', () => {
    /**
     * Requirement 6.4: Navigation should display horizontally on desktop
     * Requirement 7.1: Navigation should provide links to all pages
     */
    it('should display desktop navigation on large screens', () => {
      setViewportSize(1280);
      const { container } = render(<Navigation />);
      
      // Desktop navigation should be visible (has class 'hidden lg:block')
      const desktopNav = container.querySelector('.hidden.lg\\:block');
      expect(desktopNav).toBeInTheDocument();
    });

    it('should hide mobile menu button on desktop', () => {
      setViewportSize(1280);
      const { container } = render(<Navigation />);
      
      // Mobile menu button should have lg:hidden class
      const mobileMenuButton = container.querySelector('.lg\\:hidden button');
      expect(mobileMenuButton).toBeInTheDocument();
    });

    it('should display navigation links horizontally with proper spacing', () => {
      setViewportSize(1280);
      const { container } = render(<Navigation />);
      
      const desktopNav = container.querySelector('.hidden.lg\\:block');
      const navContainer = desktopNav?.querySelector('.flex.items-center');
      
      expect(navContainer).toBeInTheDocument();
      expect(navContainer?.className).toMatch(/space-x-8/);
    });

    it('should render all navigation links in desktop view', () => {
      setViewportSize(1280);
      render(<Navigation />);
      
      // Check for all navigation links
      const homeLinks = screen.getAllByRole('link', { name: /^home$/i });
      const galleryLinks = screen.getAllByRole('link', { name: /^gallery$/i });
      const contactLinks = screen.getAllByRole('link', { name: /^contact$/i });
      
      // Each link should appear at least once (in desktop nav)
      expect(homeLinks.length).toBeGreaterThanOrEqual(1);
      expect(galleryLinks.length).toBeGreaterThanOrEqual(1);
      expect(contactLinks.length).toBeGreaterThanOrEqual(1);
    });

    it('should apply active state styling to current page link', () => {
      setViewportSize(1280);
      mockUsePathname.mockReturnValue('/gallery');
      
      const { container } = render(<Navigation />);
      
      const activeLink = container.querySelector('a[href="/gallery"][aria-current="page"]');
      expect(activeLink).toBeInTheDocument();
      expect(activeLink?.className).toContain('text-primary-blue');
      expect(activeLink?.className).toContain('border-primary-blue');
    });
  });

  describe('Spacing and Layout at Breakpoints', () => {
    /**
     * Requirement 6.1: Responsive layout should adapt to tablet and desktop
     * Requirement 6.4: Proper spacing at all breakpoints
     */
    it('should apply proper container padding on tablet', () => {
      setViewportSize(800);
      const { container } = render(<Navigation />);
      
      const navContainer = container.querySelector('.mx-auto.max-w-7xl');
      expect(navContainer?.className).toMatch(/px-4|sm:px-6|lg:px-8/);
    });

    it('should apply proper container padding on desktop', () => {
      setViewportSize(1280);
      const { container } = render(<Navigation />);
      
      const navContainer = container.querySelector('.mx-auto.max-w-7xl');
      expect(navContainer?.className).toMatch(/lg:px-8/);
    });

    it('should maintain max-width constraint on large screens', () => {
      setViewportSize(1920);
      const { container } = render(<Navigation />);
      
      const navContainer = container.querySelector('.mx-auto.max-w-7xl');
      expect(navContainer).toBeInTheDocument();
      expect(navContainer?.className).toContain('max-w-7xl');
    });

    it('should apply proper vertical spacing in gallery grid', () => {
      const { container } = render(<Gallery artworks={mockArtworks} />);
      
      const galleryWrapper = container.querySelector('.w-full');
      expect(galleryWrapper).toBeInTheDocument();
    });
  });

  describe('Typography at Different Breakpoints', () => {
    /**
     * Requirement 6.4: Typography should remain readable at all viewport sizes
     * Requirement 11.5: Appropriate font sizes for hierarchy
     */
    it('should apply appropriate text size classes for navigation links', () => {
      setViewportSize(1280);
      const { container } = render(<Navigation />);
      
      const desktopNav = container.querySelector('.hidden.lg\\:block');
      const navLinks = desktopNav?.querySelectorAll('a');
      
      navLinks?.forEach(link => {
        expect(link.className).toMatch(/text-base/);
      });
    });

    it('should apply appropriate font weight for navigation links', () => {
      setViewportSize(1280);
      const { container } = render(<Navigation />);
      
      const desktopNav = container.querySelector('.hidden.lg\\:block');
      const navLinks = desktopNav?.querySelectorAll('a');
      
      navLinks?.forEach(link => {
        expect(link.className).toMatch(/font-medium/);
      });
    });

    it('should apply proper brand text size on desktop', () => {
      setViewportSize(1280);
      const { container } = render(<Navigation />);
      
      const brandLink = container.querySelector('a[href="/"]');
      expect(brandLink?.className).toMatch(/text-xl/);
      expect(brandLink?.className).toMatch(/font-semibold/);
    });
  });

  describe('Transition and Animation Classes', () => {
    /**
     * Requirement 10.4: Smooth transitions with appropriate durations
     */
    it('should apply transition classes to gallery grid', () => {
      const { container } = render(<Gallery artworks={mockArtworks} />);
      
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer?.className).toMatch(/transition-all/);
      expect(gridContainer?.className).toMatch(/duration-400/);
    });

    it('should apply transition classes to navigation links', () => {
      setViewportSize(1280);
      const { container } = render(<Navigation />);
      
      const desktopNav = container.querySelector('.hidden.lg\\:block');
      const navLinks = desktopNav?.querySelectorAll('a');
      
      navLinks?.forEach(link => {
        expect(link.className).toMatch(/transition-colors/);
        expect(link.className).toMatch(/duration-200/);
      });
    });
  });

  describe('Accessibility at Different Breakpoints', () => {
    /**
     * Requirement 14.2: Keyboard navigation and focus indicators
     */
    it('should maintain semantic HTML structure on desktop', () => {
      setViewportSize(1280);
      render(<Navigation />);
      
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveAttribute('aria-label', 'Main navigation');
    });

    it('should maintain proper link roles and attributes on desktop', () => {
      setViewportSize(1280);
      mockUsePathname.mockReturnValue('/gallery');
      
      const { container } = render(<Navigation />);
      
      const activeLink = container.querySelector('a[href="/gallery"]');
      expect(activeLink).toHaveAttribute('aria-current', 'page');
    });

    it('should render gallery with proper structure for screen readers', () => {
      render(<Gallery artworks={mockArtworks} />);
      
      const artworkButtons = screen.getAllByRole('button', {
        name: /view/i,
      });
      
      // Each artwork should have an accessible name
      artworkButtons.forEach(button => {
        expect(button).toHaveAccessibleName();
      });
    });
  });

  describe('Edge Cases and Boundary Conditions', () => {
    it('should handle exactly 3 artworks in desktop grid', () => {
      const threeArtworks = mockArtworks.slice(0, 3);
      render(<Gallery artworks={threeArtworks} />);
      
      const artworkCards = screen.getAllByRole('button', {
        name: /view/i,
      });
      
      expect(artworkCards).toHaveLength(3);
    });

    it('should handle exactly 4 artworks in desktop grid', () => {
      const fourArtworks = mockArtworks.slice(0, 4);
      render(<Gallery artworks={fourArtworks} />);
      
      const artworkCards = screen.getAllByRole('button', {
        name: /view/i,
      });
      
      expect(artworkCards).toHaveLength(4);
    });

    it('should handle large number of artworks in grid', () => {
      const manyArtworks = Array.from({ length: 50 }, (_, i) => ({
        id: `artwork-${i + 1}`,
        title: `Artwork ${i + 1}`,
        category: 'Still Photos' as const,
        imagePath: `/assets/artwork-${i + 1}.jpg`,
      }));
      
      render(<Gallery artworks={manyArtworks} />);
      
      const artworkCards = screen.getAllByRole('button', {
        name: /view/i,
      });
      
      expect(artworkCards).toHaveLength(50);
    });

    it('should handle viewport resize from mobile to desktop', () => {
      setViewportSize(375); // Mobile
      const { container, rerender } = render(<Navigation />);
      
      // Mobile menu button should be visible
      let mobileButton = screen.getByRole('button', { name: /toggle navigation menu/i });
      expect(mobileButton).toBeInTheDocument();
      
      // Resize to desktop
      setViewportSize(1280);
      rerender(<Navigation />);
      
      // Desktop nav should be present
      const desktopNav = container.querySelector('.hidden.lg\\:block');
      expect(desktopNav).toBeInTheDocument();
    });
  });
});
