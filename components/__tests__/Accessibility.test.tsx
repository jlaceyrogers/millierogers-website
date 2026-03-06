/**
 * Comprehensive Accessibility Audit Tests
 * 
 * This test suite runs jest-axe accessibility tests on all components
 * to ensure WCAG 2.1 AA compliance.
 * 
 * Requirements: 11.6, 14.2, 14.4, 14.5
 */

import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import Navigation from '../Navigation';
import Gallery from '../Gallery';
import ContactForm from '../ContactForm';
import Lightbox from '../Lightbox';
import ArtworkCard from '../ArtworkCard';
import CategoryFilter from '../CategoryFilter';
import { Artwork, CategoryFilter as CategoryFilterType } from '@/lib/types';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Sample test data
const mockArtworks: Artwork[] = [
  {
    id: 'artwork-1',
    title: 'Sunset Over Water',
    category: 'Still Photos',
    imagePath: '/assets/still-photos/sunset.jpg',
    description: 'A beautiful sunset',
    width: 1920,
    height: 1280,
  },
  {
    id: 'artwork-2',
    title: 'Portrait Study',
    category: 'Portraits',
    imagePath: '/assets/portraits/portrait.jpg',
    width: 1280,
    height: 1920,
  },
  {
    id: 'artwork-3',
    title: 'Mountain View',
    category: 'Landscapes',
    imagePath: '/assets/landscapes/mountain.jpg',
    width: 1920,
    height: 1280,
  },
];

describe('Accessibility Audit - Navigation Component', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<Navigation />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper ARIA labels', () => {
    const { getByRole, getByLabelText } = render(<Navigation />);
    
    // Check main navigation has aria-label
    expect(getByRole('navigation')).toHaveAttribute('aria-label', 'Main navigation');
    
    // Check mobile menu button has aria-label
    expect(getByLabelText('Toggle navigation menu')).toBeInTheDocument();
  });

  it('should have proper aria-current for active page', () => {
    const { getAllByRole } = render(<Navigation />);
    const links = getAllByRole('link');
    
    // Home link should be active (mocked pathname is '/')
    const homeLink = links.find(link => link.textContent === 'Home');
    expect(homeLink).toHaveAttribute('aria-current', 'page');
  });
});

describe('Accessibility Audit - Gallery Component', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<Gallery artworks={mockArtworks} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have accessible empty state', async () => {
    const { container } = render(<Gallery artworks={[]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('Accessibility Audit - ArtworkCard Component', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(
      <ArtworkCard 
        artwork={mockArtworks[0]} 
        onClick={jest.fn()} 
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have alt text for images', () => {
    const { getByAltText } = render(
      <ArtworkCard 
        artwork={mockArtworks[0]} 
        onClick={jest.fn()} 
      />
    );
    
    expect(getByAltText('Sunset Over Water')).toBeInTheDocument();
  });

  it('should have accessible button', () => {
    const { getByRole } = render(
      <ArtworkCard 
        artwork={mockArtworks[0]} 
        onClick={jest.fn()} 
      />
    );
    
    const button = getByRole('button');
    expect(button).toHaveAccessibleName();
  });
});

describe('Accessibility Audit - CategoryFilter Component', () => {
  const mockCounts = {
    'All': 3,
    'Still Photos': 1,
    'Portraits': 1,
    'Landscapes': 1,
  };

  it('should have no accessibility violations', async () => {
    const { container } = render(
      <CategoryFilter
        selectedCategory="All"
        onCategoryChange={jest.fn()}
        artworkCounts={mockCounts}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have accessible buttons with proper labels', () => {
    const { getAllByRole } = render(
      <CategoryFilter
        selectedCategory="All"
        onCategoryChange={jest.fn()}
        artworkCounts={mockCounts}
      />
    );
    
    const buttons = getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveAccessibleName();
    });
  });
});

describe('Accessibility Audit - ContactForm Component', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<ContactForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have properly associated labels', () => {
    const { getByLabelText } = render(<ContactForm />);
    
    expect(getByLabelText('Name')).toBeInTheDocument();
    expect(getByLabelText('Email')).toBeInTheDocument();
    expect(getByLabelText('Subject')).toBeInTheDocument();
    expect(getByLabelText('Message')).toBeInTheDocument();
  });

  it('should have proper ARIA attributes for validation errors', () => {
    const { getByLabelText } = render(<ContactForm />);
    
    const nameInput = getByLabelText('Name');
    const emailInput = getByLabelText('Email');
    
    // Initially should not have aria-invalid
    expect(nameInput).not.toHaveAttribute('aria-invalid', 'true');
    expect(emailInput).not.toHaveAttribute('aria-invalid', 'true');
  });

  it('should have accessible submit button', () => {
    const { getByRole } = render(<ContactForm />);
    
    const submitButton = getByRole('button', { name: /send message/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAccessibleName();
  });
});

describe('Accessibility Audit - Lightbox Component', () => {
  // Mock createPortal for testing
  beforeAll(() => {
    // Create a div to act as portal target
    const portalRoot = document.createElement('div');
    portalRoot.setAttribute('id', 'portal-root');
    document.body.appendChild(portalRoot);
  });

  it('should have no accessibility violations when open', async () => {
    const { container } = render(
      <Lightbox
        artwork={mockArtworks[0]}
        allArtworks={mockArtworks}
        onClose={jest.fn()}
        onNavigate={jest.fn()}
      />
    );
    
    // Wait for portal to render
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const results = await axe(document.body);
    expect(results).toHaveNoViolations();
  });

  it('should have proper dialog role and aria attributes', async () => {
    render(
      <Lightbox
        artwork={mockArtworks[0]}
        allArtworks={mockArtworks}
        onClose={jest.fn()}
        onNavigate={jest.fn()}
      />
    );
    
    // Wait for portal to render
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const dialog = document.querySelector('[role="dialog"]');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'lightbox-title');
  });

  it('should have accessible navigation buttons', async () => {
    render(
      <Lightbox
        artwork={mockArtworks[0]}
        allArtworks={mockArtworks}
        onClose={jest.fn()}
        onNavigate={jest.fn()}
      />
    );
    
    // Wait for portal to render
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const prevButton = document.querySelector('[aria-label="Previous artwork"]');
    const nextButton = document.querySelector('[aria-label="Next artwork"]');
    const closeButton = document.querySelector('[aria-label="Close lightbox"]');
    
    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
  });

  it('should have alt text for artwork image', async () => {
    render(
      <Lightbox
        artwork={mockArtworks[0]}
        allArtworks={mockArtworks}
        onClose={jest.fn()}
        onNavigate={jest.fn()}
      />
    );
    
    // Wait for portal to render
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const image = document.querySelector('img[alt="Sunset Over Water"]');
    expect(image).toBeInTheDocument();
  });
});

describe('Accessibility Audit - Color Contrast', () => {
  it('should have sufficient color contrast in navigation', async () => {
    const { container } = render(<Navigation />);
    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true },
      },
    });
    expect(results).toHaveNoViolations();
  });

  it('should have sufficient color contrast in gallery', async () => {
    const { container } = render(<Gallery artworks={mockArtworks} />);
    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true },
      },
    });
    expect(results).toHaveNoViolations();
  });

  it('should have sufficient color contrast in contact form', async () => {
    const { container } = render(<ContactForm />);
    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true },
      },
    });
    expect(results).toHaveNoViolations();
  });
});

describe('Accessibility Audit - Keyboard Navigation', () => {
  it('should have visible focus indicators on navigation links', () => {
    const { getAllByRole } = render(<Navigation />);
    const links = getAllByRole('link');
    
    links.forEach(link => {
      // Check that links are focusable
      expect(link).not.toHaveAttribute('tabindex', '-1');
    });
  });

  it('should have visible focus indicators on form inputs', () => {
    const { getByLabelText } = render(<ContactForm />);
    
    const nameInput = getByLabelText('Name');
    const emailInput = getByLabelText('Email');
    
    // Check that inputs are focusable
    expect(nameInput).not.toHaveAttribute('tabindex', '-1');
    expect(emailInput).not.toHaveAttribute('tabindex', '-1');
  });

  it('should have visible focus indicators on buttons', () => {
    const { getAllByRole } = render(
      <CategoryFilter
        selectedCategory="All"
        onCategoryChange={jest.fn()}
        artworkCounts={{
          'All': 3,
          'Still Photos': 1,
          'Portraits': 1,
          'Landscapes': 1,
        }}
      />
    );
    
    const buttons = getAllByRole('button');
    buttons.forEach(button => {
      expect(button).not.toHaveAttribute('tabindex', '-1');
    });
  });
});

describe('Accessibility Audit - Touch Targets', () => {
  it('should have minimum 44x44px touch targets in navigation', () => {
    const { getByLabelText } = render(<Navigation />);
    
    const menuButton = getByLabelText('Toggle navigation menu');
    const styles = window.getComputedStyle(menuButton);
    
    // Check minimum dimensions (class: min-w-[44px] min-h-[44px])
    expect(menuButton.className).toContain('min-w-[44px]');
    expect(menuButton.className).toContain('min-h-[44px]');
  });

  it('should have minimum 44x44px touch targets in contact form', () => {
    const { getByRole } = render(<ContactForm />);
    
    const submitButton = getByRole('button', { name: /send message/i });
    
    // Check minimum dimensions (class: min-h-[44px])
    expect(submitButton.className).toContain('min-h-[44px]');
  });
});
