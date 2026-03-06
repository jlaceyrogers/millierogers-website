'use client';

import { useState, FormEvent, ChangeEvent, FocusEvent } from 'react';
import { ContactFormData } from '@/lib/types';

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => Promise<void>;
}

export default function ContactForm({ onSubmit }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const validateField = (name: keyof ContactFormData, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Invalid email format';
        return '';
      case 'subject':
        if (!value.trim()) return 'Subject is required';
        if (value.trim().length < 3) return 'Subject must be at least 3 characters';
        return '';
      case 'message':
        if (!value.trim()) return 'Message is required';
        if (value.trim().length < 10) return 'Message must be at least 10 characters';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof ContactFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const error = validateField(name as keyof ContactFormData, value);
    if (error) {
      setErrors(prev => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof ContactFormData>).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitStatus('submitting');
    setErrorMessage('');

    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Default mailto implementation
        const mailtoLink = `mailto:millie.rogers@sympatico.ca?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`)}`;
        window.location.href = mailtoLink;
      }

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Failed to send message. Please try again or email directly at millie.rogers@sympatico.ca');
      console.error('Form submission failed:', error);
    }
  };

  const handleRetry = () => {
    setSubmitStatus('idle');
    setErrorMessage('');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-0">
      {submitStatus === 'success' ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 animate-fade-in">
          <div className="flex items-start">
            <svg
              className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 mt-0.5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="ml-3">
              <h3 className="text-base sm:text-lg font-semibold text-green-900">Message sent successfully!</h3>
              <p className="mt-2 text-sm sm:text-base text-green-800">
                Thank you for your message. I'll get back to you as soon as possible.
              </p>
              <button
                onClick={() => setSubmitStatus('idle')}
                className="mt-4 min-h-[44px] px-4 py-2 text-sm sm:text-base text-green-700 hover:text-green-900 font-medium transition-colors duration-200"
              >
                Send another message
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6" noValidate>
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={submitStatus === 'submitting'}
              className={`
                w-full px-4 py-3 min-h-[44px] rounded-lg border text-base
                ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary-blue'}
                focus:ring-2 focus:outline-none
                disabled:bg-gray-100 disabled:cursor-not-allowed
                transition-colors duration-200
              `}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <p id="name-error" className="mt-2 text-sm text-red-600" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={submitStatus === 'submitting'}
              className={`
                w-full px-4 py-3 min-h-[44px] rounded-lg border text-base
                ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary-blue'}
                focus:ring-2 focus:outline-none
                disabled:bg-gray-100 disabled:cursor-not-allowed
                transition-colors duration-200
              `}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="mt-2 text-sm text-red-600" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          {/* Subject Field */}
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={submitStatus === 'submitting'}
              className={`
                w-full px-4 py-3 min-h-[44px] rounded-lg border text-base
                ${errors.subject ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary-blue'}
                focus:ring-2 focus:outline-none
                disabled:bg-gray-100 disabled:cursor-not-allowed
                transition-colors duration-200
              `}
              aria-invalid={!!errors.subject}
              aria-describedby={errors.subject ? 'subject-error' : undefined}
            />
            {errors.subject && (
              <p id="subject-error" className="mt-2 text-sm text-red-600" role="alert">
                {errors.subject}
              </p>
            )}
          </div>

          {/* Message Field */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              value={formData.message}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={submitStatus === 'submitting'}
              className={`
                w-full px-4 py-3 min-h-[120px] rounded-lg border text-base
                ${errors.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary-blue'}
                focus:ring-2 focus:outline-none
                disabled:bg-gray-100 disabled:cursor-not-allowed
                transition-colors duration-200
                resize-vertical
              `}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'message-error' : undefined}
            />
            {errors.message && (
              <p id="message-error" className="mt-2 text-sm text-red-600" role="alert">
                {errors.message}
              </p>
            )}
          </div>

          {/* Error Message */}
          {submitStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-fade-in">
              <div className="flex items-start">
                <svg
                  className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{errorMessage}</p>
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="mt-2 min-h-[44px] px-4 py-2 text-sm text-red-700 hover:text-red-900 font-medium transition-colors duration-200"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button - Optimized for mobile touch */}
          <div>
            <button
              type="submit"
              disabled={submitStatus === 'submitting'}
              className={`
                w-full px-6 py-3 min-h-[44px] rounded-lg font-medium text-base
                text-white bg-primary-blue
                hover:bg-blue-600
                focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2
                disabled:bg-gray-400 disabled:cursor-not-allowed
                transition-all duration-200
                ${submitStatus === 'submitting' ? 'opacity-75' : ''}
              `}
            >
              {submitStatus === 'submitting' ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Sending...
                </span>
              ) : (
                'Send Message'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
