import { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import AnimatedSection from '@/components/AnimatedSection';

// Generate metadata for SEO
export const metadata: Metadata = {
  title: 'Contact | Millie Rogers Art Portfolio',
  description: 'Get in touch with Millie Rogers for inquiries about artwork, commissions, or collaborations. Send a message through the contact form or email directly.',
  keywords: ['contact', 'art inquiries', 'commissions', 'Millie Rogers', 'artist contact'],
  openGraph: {
    title: 'Contact | Millie Rogers Art Portfolio',
    description: 'Get in touch with Millie Rogers for inquiries about artwork and commissions',
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Page Header */}
        <AnimatedSection className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            I'd love to hear from you! Whether you have questions about my work, 
            are interested in purchasing a piece, or want to discuss a commission, 
            please feel free to reach out.
          </p>
        </AnimatedSection>

        {/* Contact Form */}
        <AnimatedSection delay={150} className="mb-12">
          <ContactForm />
        </AnimatedSection>

        {/* Alternative Contact Information */}
        <AnimatedSection delay={300} className="text-center">
          <div className="bg-light-bg rounded-lg p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Prefer to Email Directly?
            </h2>
            <p className="text-gray-600 mb-4">
              You can also reach me at:
            </p>
            <a 
              href="mailto:millie.rogers@sympatico.ca"
              className="inline-flex items-center text-primary-blue hover:text-blue-600 font-medium transition-colors duration-200"
            >
              <svg 
                className="w-5 h-5 mr-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                />
              </svg>
              millie.rogers@sympatico.ca
            </a>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
