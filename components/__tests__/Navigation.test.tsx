import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import Navigation from '../Navigation';
import fc from 'fast-check';
import userEvent from '@testing-library/user-event';

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

describe('Navigation Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Feature: art-portfolio-modernization, Property 7: Navigation Active State
  describe('Property 7: Navigation Active State', () => {
    /**
     * **Validates: Requirements 7.3**
     * 
     * Property: For any current page route, the navigation component should apply 
     * the active state styling to the corresponding navigation link.
     */
    it('should apply active state to the navigation link matching the current route', () => {
      const validRoutes = fc.constantFrom('/', '/gallery', '/contact');

      fc.assert(
        fc.property(validRoutes, (route) => {
          mockUsePathname.mockReturnValue(route);
          
          const { container } = render(<Navigation />);
          
          // Find the link that matches the current route
          const activeLink = container.querySelector(`a[href="${route}"][aria-current="page"]`);
          
          // The active link should exist
          if (!activeLink) {
            return false;
          }
          
          // The active link should have the active state classes
          const hasActiveClasses = activeLink.className.includes('text-primary-blue') && 
                                   activeLink.className.includes('border-primary-blue');
          
          // All other links should not have aria-current="page"
          const allLinks = container.querySelectorAll('a[href]');
          const otherLinks = Array.from(allLinks).filter(
            link => link.getAttribute('href') !== route
          );
          
          const noOtherActiveLinks = otherLinks.every(
            link => link.getAttribute('aria-current') !== 'page'
          );
          
          return hasActiveClasses && noOtherActiveLinks;
        }),
        { numRuns: 100 }
      );
    });

    it('should highlight exactly one navigation link as active for any valid route', () => {
      const validRoutes = fc.constantFrom('/', '/gallery', '/contact');

      fc.assert(
        fc.property(validRoutes, (route) => {
          mockUsePathname.mockReturnValue(route);
          
          const { container } = render(<Navigation />);
          
          // Count how many links have aria-current="page"
          const activeLinks = container.querySelectorAll('a[aria-current="page"]');
          
          // There should be exactly 2 active links (one in desktop nav, one in mobile nav)
          // Both should point to the same route
          if (activeLinks.length !== 2) {
            return false;
          }
          
          // Verify both active links point to the current route
          return Array.from(activeLinks).every(
            link => link.getAttribute('href') === route
          );
        }),
        { numRuns: 100 }
      );
    });
  });

  // Unit Tests
  describe('Unit Tests', () => {
    /**
     * **Validates: Requirements 7.1**
     * Test that navigation renders all required links
     */
    it('should render all required navigation links', () => {
      mockUsePathname.mockReturnValue('/');
      
      render(<Navigation />);
      
      // Each link appears twice (desktop and mobile nav)
      const homeLinks = screen.getAllByRole('link', { name: /^home$/i });
      const galleryLinks = screen.getAllByRole('link', { name: /^gallery$/i });
      const contactLinks = screen.getAllByRole('link', { name: /^contact$/i });
      
      expect(homeLinks.length).toBeGreaterThanOrEqual(1);
      expect(galleryLinks.length).toBeGreaterThanOrEqual(1);
      expect(contactLinks.length).toBeGreaterThanOrEqual(1);
    });

    it('should render navigation links with correct href attributes', () => {
      mockUsePathname.mockReturnValue('/');
      
      const { container } = render(<Navigation />);
      
      // Check desktop navigation links
      const desktopNav = container.querySelector('.hidden.lg\\:block');
      expect(desktopNav).toBeInTheDocument();
      
      if (desktopNav) {
        const homeLink = desktopNav.querySelector('a[href="/"]');
        const galleryLink = desktopNav.querySelector('a[href="/gallery"]');
        const contactLink = desktopNav.querySelector('a[href="/contact"]');
        
        expect(homeLink).toBeInTheDocument();
        expect(galleryLink).toBeInTheDocument();
        expect(contactLink).toBeInTheDocument();
      }
    });

    /**
     * **Validates: Requirements 7.1, 6.2**
     * Test mobile menu toggle functionality
     */
    it('should toggle mobile menu when hamburger button is clicked', async () => {
      mockUsePathname.mockReturnValue('/');
      const user = userEvent.setup();
      
      render(<Navigation />);
      
      // Find the mobile menu button
      const menuButton = screen.getByRole('button', { name: /toggle navigation menu/i });
      expect(menuButton).toBeInTheDocument();
      
      // Click to open menu
      await user.click(menuButton);
      
      // Menu should be visible (check for close button)
      expect(screen.getByRole('button', { name: /close menu/i })).toBeInTheDocument();
      
      // Click to close menu
      const closeButton = screen.getByRole('button', { name: /close menu/i });
      await user.click(closeButton);
      
      // Menu should be closed (open button should be back)
      expect(screen.getByRole('button', { name: /toggle navigation menu/i })).toBeInTheDocument();
    });

    it('should close mobile menu when backdrop is clicked', async () => {
      mockUsePathname.mockReturnValue('/');
      const user = userEvent.setup();
      
      const { container } = render(<Navigation />);
      
      // Open menu
      const menuButton = screen.getByRole('button', { name: /toggle navigation menu/i });
      await user.click(menuButton);
      
      // Find and click backdrop
      const backdrop = container.querySelector('.fixed.inset-0.bg-black\\/50');
      expect(backdrop).toBeInTheDocument();
      
      if (backdrop) {
        await user.click(backdrop);
      }
      
      // Menu should be closed
      expect(screen.getByRole('button', { name: /toggle navigation menu/i })).toBeInTheDocument();
    });

    /**
     * **Validates: Requirements 7.6**
     * Test keyboard navigation support
     */
    it('should close mobile menu when Escape key is pressed', async () => {
      mockUsePathname.mockReturnValue('/');
      const user = userEvent.setup();
      
      render(<Navigation />);
      
      // Open menu
      const menuButton = screen.getByRole('button', { name: /toggle navigation menu/i });
      await user.click(menuButton);
      
      // Press Escape key
      await user.keyboard('{Escape}');
      
      // Menu should be closed
      expect(screen.getByRole('button', { name: /toggle navigation menu/i })).toBeInTheDocument();
    });

    it('should have proper aria-label for navigation', () => {
      mockUsePathname.mockReturnValue('/');
      
      render(<Navigation />);
      
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'Main navigation');
    });

    it('should have proper aria-expanded attribute on mobile menu button', async () => {
      mockUsePathname.mockReturnValue('/');
      const user = userEvent.setup();
      
      render(<Navigation />);
      
      const menuButton = screen.getByRole('button', { name: /toggle navigation menu/i });
      
      // Initially should be false
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
      
      // After clicking should be true
      await user.click(menuButton);
      const openMenuButton = screen.getByRole('button', { name: /toggle navigation menu/i });
      expect(openMenuButton).toHaveAttribute('aria-expanded', 'true');
    });
  });
});
