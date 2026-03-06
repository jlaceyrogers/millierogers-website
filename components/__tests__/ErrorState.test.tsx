import { render, screen, fireEvent } from '@testing-library/react';
import ErrorState from '../ErrorState';

describe('ErrorState Component', () => {
  it('should render default error message', () => {
    render(<ErrorState />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/unable to load content/i)).toBeInTheDocument();
  });

  it('should render custom error message', () => {
    const customMessage = 'Custom error occurred';
    render(<ErrorState message={customMessage} />);
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('should render retry button when onRetry is provided', () => {
    const handleRetry = jest.fn();
    render(<ErrorState onRetry={handleRetry} />);
    
    const retryButton = screen.getByRole('button', { name: /try again/i });
    expect(retryButton).toBeInTheDocument();
  });

  it('should not render retry button when onRetry is not provided', () => {
    render(<ErrorState />);
    expect(screen.queryByRole('button', { name: /try again/i })).not.toBeInTheDocument();
  });

  it('should call onRetry when retry button is clicked', () => {
    const handleRetry = jest.fn();
    render(<ErrorState onRetry={handleRetry} />);
    
    const retryButton = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(retryButton);
    
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it('should display error icon', () => {
    const { container } = render(<ErrorState />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
