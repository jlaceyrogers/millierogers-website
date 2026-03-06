import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from '../ContactForm';

describe('ContactForm Unit Tests', () => {
  describe('Form Rendering', () => {
    it('should render all required fields', () => {
      render(<ContactForm />);

      expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
    });

    it('should have proper labels associated with inputs', () => {
      render(<ContactForm />);

      const nameInput = screen.getByLabelText(/^name$/i);
      const emailInput = screen.getByLabelText(/email/i);
      const subjectInput = screen.getByLabelText(/subject/i);
      const messageInput = screen.getByLabelText(/message/i);

      expect(nameInput).toHaveAttribute('id', 'name');
      expect(emailInput).toHaveAttribute('id', 'email');
      expect(subjectInput).toHaveAttribute('id', 'subject');
      expect(messageInput).toHaveAttribute('id', 'message');
    });
  });

  describe('Form Validation', () => {
    it('should display validation error for empty name field', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      const nameInput = screen.getByLabelText(/^name$/i);
      await user.click(nameInput);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      });
    });

    it('should display validation error for empty email field', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.click(emailInput);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      });
    });

    it('should display validation error for invalid email format', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'invalid-email');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
      });
    });

    it('should display validation error for empty subject field', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      const subjectInput = screen.getByLabelText(/subject/i);
      await user.click(subjectInput);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/subject is required/i)).toBeInTheDocument();
      });
    });

    it('should display validation error for empty message field', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      const messageInput = screen.getByLabelText(/message/i);
      await user.click(messageInput);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/message is required/i)).toBeInTheDocument();
      });
    });

    it('should display validation error for short name', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      const nameInput = screen.getByLabelText(/^name$/i);
      await user.type(nameInput, 'A');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
      });
    });

    it('should display validation error for short subject', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      const subjectInput = screen.getByLabelText(/subject/i);
      await user.type(subjectInput, 'AB');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/subject must be at least 3 characters/i)).toBeInTheDocument();
      });
    });

    it('should display validation error for short message', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      const messageInput = screen.getByLabelText(/message/i);
      await user.type(messageInput, 'Short');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/message must be at least 10 characters/i)).toBeInTheDocument();
      });
    });

    it('should clear validation error when user starts typing', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      const nameInput = screen.getByLabelText(/^name$/i);
      await user.click(nameInput);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      });

      await user.type(nameInput, 'John');

      await waitFor(() => {
        expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should call onSubmit with form data on successful submission', async () => {
      const user = userEvent.setup();
      const mockOnSubmit = jest.fn().mockResolvedValue(undefined);
      render(<ContactForm onSubmit={mockOnSubmit} />);

      await user.type(screen.getByLabelText(/^name$/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/subject/i), 'Test Subject');
      await user.type(screen.getByLabelText(/message/i), 'This is a test message');

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Test Subject',
          message: 'This is a test message',
        });
      });
    });

    it('should display success message after successful submission', async () => {
      const user = userEvent.setup();
      const mockOnSubmit = jest.fn().mockResolvedValue(undefined);
      render(<ContactForm onSubmit={mockOnSubmit} />);

      await user.type(screen.getByLabelText(/^name$/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/subject/i), 'Test Subject');
      await user.type(screen.getByLabelText(/message/i), 'This is a test message');

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
      });
    });

    it('should clear form after successful submission', async () => {
      const user = userEvent.setup();
      const mockOnSubmit = jest.fn().mockResolvedValue(undefined);
      render(<ContactForm onSubmit={mockOnSubmit} />);

      const nameInput = screen.getByLabelText(/^name$/i);
      const emailInput = screen.getByLabelText(/email/i);
      const subjectInput = screen.getByLabelText(/subject/i);
      const messageInput = screen.getByLabelText(/message/i);

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(subjectInput, 'Test Subject');
      await user.type(messageInput, 'This is a test message');

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
      });

      // Click "Send another message" to return to form
      const sendAnotherButton = screen.getByRole('button', { name: /send another message/i });
      await user.click(sendAnotherButton);

      // Form should be cleared
      expect(screen.getByLabelText(/^name$/i)).toHaveValue('');
      expect(screen.getByLabelText(/email/i)).toHaveValue('');
      expect(screen.getByLabelText(/subject/i)).toHaveValue('');
      expect(screen.getByLabelText(/message/i)).toHaveValue('');
    });

    it('should display error message on submission failure', async () => {
      const user = userEvent.setup();
      const mockOnSubmit = jest.fn().mockRejectedValue(new Error('Network error'));
      render(<ContactForm onSubmit={mockOnSubmit} />);

      await user.type(screen.getByLabelText(/^name$/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/subject/i), 'Test Subject');
      await user.type(screen.getByLabelText(/message/i), 'This is a test message');

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/failed to send message/i)).toBeInTheDocument();
      });
    });

    it('should preserve form data on submission failure', async () => {
      const user = userEvent.setup();
      const mockOnSubmit = jest.fn().mockRejectedValue(new Error('Network error'));
      render(<ContactForm onSubmit={mockOnSubmit} />);

      const nameInput = screen.getByLabelText(/^name$/i);
      const emailInput = screen.getByLabelText(/email/i);
      const subjectInput = screen.getByLabelText(/subject/i);
      const messageInput = screen.getByLabelText(/message/i);

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(subjectInput, 'Test Subject');
      await user.type(messageInput, 'This is a test message');

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/failed to send message/i)).toBeInTheDocument();
      });

      // Form data should be preserved
      expect(nameInput).toHaveValue('John Doe');
      expect(emailInput).toHaveValue('john@example.com');
      expect(subjectInput).toHaveValue('Test Subject');
      expect(messageInput).toHaveValue('This is a test message');
    });

    it('should show retry button on submission failure', async () => {
      const user = userEvent.setup();
      const mockOnSubmit = jest.fn().mockRejectedValue(new Error('Network error'));
      render(<ContactForm onSubmit={mockOnSubmit} />);

      await user.type(screen.getByLabelText(/^name$/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/subject/i), 'Test Subject');
      await user.type(screen.getByLabelText(/message/i), 'This is a test message');

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
      });
    });

    it('should disable submit button during submission', async () => {
      const user = userEvent.setup();
      const mockOnSubmit = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
      render(<ContactForm onSubmit={mockOnSubmit} />);

      await user.type(screen.getByLabelText(/^name$/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/subject/i), 'Test Subject');
      await user.type(screen.getByLabelText(/message/i), 'This is a test message');

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      // Button should show "Sending..." and be disabled
      await waitFor(() => {
        expect(screen.getByText(/sending/i)).toBeInTheDocument();
      });
    });

    it('should not submit form with validation errors', async () => {
      const user = userEvent.setup();
      const mockOnSubmit = jest.fn();
      render(<ContactForm onSubmit={mockOnSubmit} />);

      // Only fill in name, leave other fields empty
      await user.type(screen.getByLabelText(/^name$/i), 'John Doe');

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      });

      // onSubmit should not be called
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });
});
