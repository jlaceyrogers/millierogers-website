import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-blue mb-4">404</h1>
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block w-full px-6 py-3 bg-primary-blue text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
          >
            Return Home
          </Link>
          <div className="flex gap-4">
            <Link
              href="/gallery"
              className="flex-1 px-6 py-3 bg-light-blue text-gray-900 rounded-lg hover:bg-blue-200 transition-colors duration-200 font-medium"
            >
              View Gallery
            </Link>
            <Link
              href="/contact"
              className="flex-1 px-6 py-3 bg-light-blue text-gray-900 rounded-lg hover:bg-blue-200 transition-colors duration-200 font-medium"
            >
              Contact
            </Link>
          </div>
        </div>

        <div className="mt-12">
          <svg
            className="mx-auto h-48 w-48 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
