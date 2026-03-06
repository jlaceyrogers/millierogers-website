import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fc from 'fast-check';
import ContactForm from '../ContactForm';
import { ContactFormData } from '@/lib/types';

describe('ContactForm Property-Based Tests', () => {
  // Feature: art-portfolio-modernization, Property 8: Form Validation for Empty Fields
  // **Validates: Requirements 9.2**
  describe('Property 8: Form Validation for Empty Fields', () => {
    it('should trigger validation error when name field is empty', async () => {
      const user = userEvent.setup();

      await fc.assert(
        fc.asyncProperty(
          fc.record({
            email: fc.emailAddress(),
            subject: fc.string({ minLength: 3 }),
            message: fc.string({ minLength: 10 }),
          }),
          async (formData) => {
            const { unmount } = render(<ContactForm />);

            // Fill in all fields except name (leave it empty)
            const emailInput = screen.getByLabelText(/email/i);
            const subjectInput = screen.getByLabelText(/subject/i);
            const messageInput = screen.getByLabelText(/message/i);

            await user.type(emailInput, formData.email);
            await user.type(subjectInput, formData.subject);
            await user.type(messageInput, formData.message);

            // Submit the form
            const submitButton = screen.getByRole('button', { name: /send message/i });
            await user.click(submitButton);

            // Wait for validation error to appear
            await waitFor(() => {
              const nameError = screen.getByText(/name is required/i);
              expect(nameError).toBeInTheDocument();
            });

            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should trigger validation error when email field is empty', async () => {
      const user = userEvent.setup();

      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.string({ minLength: 2 }),
            subject: fc.string({ minLength: 3 }),
            message: fc.string({ minLength: 10 }),
          }),
          async (formData) => {
            const { unmount } = render(<ContactForm />);

            // Fill in all fields except email (leave it empty)
            const nameInput = screen.getByLabelText(/^name$/i);
            const subjectInput = screen.getByLabelText(/subject/i);
            const messageInput = screen.getByLabelText(/message/i);

            await user.type(nameInput, formData.name);
            await user.type(subjectInput, formData.subject);
            await user.type(messageInput, formData.message);

            // Submit the form
            const submitButton = screen.getByRole('button', { name: /send message/i });
            await user.click(submitButton);

            // Wait for validation error to appear
            await waitFor(() => {
              const emailError = screen.getByText(/email is required/i);
              expect(emailError).toBeInTheDocument();
            });

            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should trigger validation error when subject field is empty', async () => {
      const user = userEvent.setup();

      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.string({ minLength: 2 }),
            email: fc.emailAddress(),
            message: fc.string({ minLength: 10 }),
          }),
          async (formData) => {
            const { unmount } = render(<ContactForm />);

            // Fill in all fields except subject (leave it empty)
            const nameInput = screen.getByLabelText(/^name$/i);
            const emailInput = screen.getByLabelText(/email/i);
            const messageInput = screen.getByLabelText(/message/i);

            await user.type(nameInput, formData.name);
            await user.type(emailInput, formData.email);
            await user.type(messageInput, formData.message);

            // Submit the form
            const submitButton = screen.getByRole('button', { name: /send message/i });
            await user.click(submitButton);

            // Wait for validation error to appear
            await waitFor(() => {
              const subjectError = screen.getByText(/subject is required/i);
              expect(subjectError).toBeInTheDocument();
            });

            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should trigger validation error when message field is empty', async () => {
      const user = userEvent.setup();

      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.string({ minLength: 2 }),
            email: fc.emailAddress(),
            subject: fc.string({ minLength: 3 }),
          }),
          async (formData) => {
            const { unmount } = render(<ContactForm />);

            // Fill in all fields except message (leave it empty)
            const nameInput = screen.getByLabelText(/^name$/i);
            const emailInput = screen.getByLabelText(/email/i);
            const subjectInput = screen.getByLabelText(/subject/i);

            await user.type(nameInput, formData.name);
            await user.type(emailInput, formData.email);
            await user.type(subjectInput, formData.subject);

            // Submit the form
            const submitButton = screen.getByRole('button', { name: /send message/i });
            await user.click(submitButton);

            // Wait for validation error to appear
            await waitFor(() => {
              const messageError = screen.getByText(/message is required/i);
              expect(messageError).toBeInTheDocument();
            });

            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // Feature: art-portfolio-modernization, Property 11: Email Validation
  // **Validates: Requirements 9.6**
  describe('Property 11: Email Validation', () => {
    it('should reject invalid email formats', async () => {
      const user = userEvent.setup();

      // Generate invalid email strings
      const invalidEmailArbitrary = fc.oneof(
        fc.string().filter(s => !s.includes('@')), // No @ symbol
        fc.string().map(s => s + '@'), // Missing domain
        fc.string().map(s => '@' + s), // Missing local part
        fc.string().map(s => s + '@domain'), // Missing TLD
        fc.constant('invalid-email'),
        fc.constant('test@'),
        fc.constant('@test.com'),
        fc.constant('test@test'),
        fc.constant('test test@test.com'), // Space in email
      );

      await fc.assert(
        fc.asyncProperty(
          invalidEmailArbitrary,
          async (invalidEmail) => {
            const { unmount } = render(<ContactForm />);

            const emailInput = screen.getByLabelText(/email/i);
            
            // Type the invalid email
            await user.clear(emailInput);
            await user.type(emailInput, invalidEmail);
            
            // Blur to trigger validation
            await user.tab();

            // Wait for validation error to appear
            await waitFor(() => {
              const emailError = screen.queryByText(/invalid email format|email is required/i);
              expect(emailError).toBeInTheDocument();
            });

            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should accept valid email formats', async () => {
      const user = userEvent.setup();

      await fc.assert(
        fc.asyncProperty(
          fc.emailAddress(),
          async (validEmail) => {
            const { unmount } = render(<ContactForm />);

            const emailInput = screen.getByLabelText(/email/i);
            
            // Type the valid email
            await user.clear(emailInput);
            await user.type(emailInput, validEmail);
            
            // Blur to trigger validation
            await user.tab();

            // Wait a bit to ensure no error appears
            await waitFor(() => {
              const emailError = screen.queryByText(/invalid email format/i);
              expect(emailError).not.toBeInTheDocument();
            }, { timeout: 500 });

            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should validate email format on blur', async () => {
      const user = userEvent.setup();

      await fc.assert(
        fc.asyncProperty(
          fc.tuple(
            fc.emailAddress(),
            fc.string().filter(s => !s.includes('@') && s.length > 0)
          ),
          async ([validEmail, invalidEmail]) => {
            const { unmount } = render(<ContactForm />);

            const emailInput = screen.getByLabelText(/email/i);
            
            // Type invalid email first
            await user.type(emailInput, invalidEmail);
            await user.tab();

            // Should show error
            await waitFor(() => {
              const emailError = screen.queryByText(/invalid email format/i);
              expect(emailError).toBeInTheDocument();
            });

            // Clear and type valid email
            await user.clear(emailInput);
            await user.type(emailInput, validEmail);
            await user.tab();

            // Error should be cleared
            await waitFor(() => {
              const emailError = screen.queryByText(/invalid email format/i);
              expect(emailError).not.toBeInTheDocument();
            });

            unmount();
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  // Feature: art-portfolio-modernization, Property 9: Form Success State
  // **Validates: Requirements 9.4**
  describe('Property 9: Form Success State', () => {
    it('should trigger success state on successful submission', async () => {
      const user = userEvent.setup();

      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.string({ minLength: 2 }).filter(s => s.trim().length >= 2),
            email: fc.emailAddress().filter(email => !email.includes('{') && !email.includes('[')),
            subject: fc.string({ minLength: 3 }).filter(s => s.trim().length >= 3),
            message: fc.string({ minLength: 10 }).filter(s => s.trim().length >= 10),
          }),
          async (formData) => {
            const mockOnSubmit = jest.fn().mockResolvedValue(undefined);
            const { unmount } = render(<ContactForm onSubmit={mockOnSubmit} />);

            // Fill in all fields
            const nameInput = screen.getByLabelText(/^name$/i);
            const emailInput = screen.getByLabelText(/email/i);
            const subjectInput = screen.getByLabelText(/subject/i);
            const messageInput = screen.getByLabelText(/message/i);

            await user.type(nameInput, formData.name);
            await user.type(emailInput, formData.email);
            await user.type(subjectInput, formData.subject);
            await user.type(messageInput, formData.message);

            // Submit the form
            const submitButton = screen.getByRole('button', { name: /send message/i });
            await user.click(submitButton);

            // Wait for success message to appear
            await waitFor(() => {
              const successMessage = screen.getByText(/message sent successfully/i);
              expect(successMessage).toBeInTheDocument();
            });

            // Verify onSubmit was called
            expect(mockOnSubmit).toHaveBeenCalledWith({
              name: formData.name,
              email: formData.email,
              subject: formData.subject,
              message: formData.message,
            });

            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // Feature: art-portfolio-modernization, Property 10: Form Error State
  // **Validates: Requirements 9.5**
  describe('Property 10: Form Error State', () => {
    it('should trigger error state on failed submission', async () => {
      const user = userEvent.setup();

      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.string({ minLength: 2 }).filter(s => s.trim().length >= 2),
            email: fc.emailAddress().filter(email => !email.includes('{') && !email.includes('[')),
            subject: fc.string({ minLength: 3 }).filter(s => s.trim().length >= 3),
            message: fc.string({ minLength: 10 }).filter(s => s.trim().length >= 10),
          }),
          async (formData) => {
            const mockOnSubmit = jest.fn().mockRejectedValue(new Error('Submission failed'));
            const { unmount } = render(<ContactForm onSubmit={mockOnSubmit} />);

            // Fill in all fields
            const nameInput = screen.getByLabelText(/^name$/i);
            const emailInput = screen.getByLabelText(/email/i);
            const subjectInput = screen.getByLabelText(/subject/i);
            const messageInput = screen.getByLabelText(/message/i);

            await user.type(nameInput, formData.name);
            await user.type(emailInput, formData.email);
            await user.type(subjectInput, formData.subject);
            await user.type(messageInput, formData.message);

            // Submit the form
            const submitButton = screen.getByRole('button', { name: /send message/i });
            await user.click(submitButton);

            // Wait for error message to appear
            await waitFor(() => {
              const errorMessage = screen.getByText(/failed to send message/i);
              expect(errorMessage).toBeInTheDocument();
            });

            // Verify retry button is present
            const retryButton = screen.getByRole('button', { name: /try again/i });
            expect(retryButton).toBeInTheDocument();

            // Verify form data is preserved
            expect(nameInput).toHaveValue(formData.name);
            expect(emailInput).toHaveValue(formData.email);
            expect(subjectInput).toHaveValue(formData.subject);
            expect(messageInput).toHaveValue(formData.message);

            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
