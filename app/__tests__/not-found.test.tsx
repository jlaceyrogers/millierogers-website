import { render, screen } from '@testing-library/react';
import NotFound from '../not-found';

describe('NotFound Page', () => {
  it('should render 404 heading', () => {
    render(<NotFound />);
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('should render page not found message', () => {
    render(<NotFound />);
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByText(/doesn't exist or has been moved/i)).toBeInTheDocument();
  });

  it('should render return home link', () => {
    render(<NotFound />);
    const homeLink = screen.getByRole('link', { name: /return home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('should render gallery and contact links', () => {
    render(<NotFound />);
    const galleryLink = screen.getByRole('link', { name: /view gallery/i });
    const contactLink = screen.getByRole('link', { name: /contact/i });
    
    expect(galleryLink).toBeInTheDocument();
    expect(galleryLink).toHaveAttribute('href', '/gallery');
    
    expect(contactLink).toBeInTheDocument();
    expect(contactLink).toHaveAttribute('href', '/contact');
  });
});
