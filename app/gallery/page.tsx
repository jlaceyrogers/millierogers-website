import { Metadata } from 'next';
import { getAllArtworks } from '@/lib/artwork-data';
import Gallery from '@/components/Gallery';
import AnimatedSection from '@/components/AnimatedSection';
import ErrorState from '@/components/ErrorState';

// Generate metadata for SEO
export const metadata: Metadata = {
  title: 'Gallery | Millie Rogers Art Portfolio',
  description: 'Browse the complete collection of artwork by Millie Rogers, including still photos, portraits, and landscapes. Explore beautiful photography and art pieces.',
  keywords: ['art gallery', 'photography', 'portraits', 'landscapes', 'still photos', 'Millie Rogers'],
  openGraph: {
    title: 'Gallery | Millie Rogers Art Portfolio',
    description: 'Browse the complete collection of artwork by Millie Rogers',
    type: 'website',
  },
};

export default function GalleryPage() {
  let artworks;
  let error = false;

  try {
    // Load artwork data at build time
    artworks = getAllArtworks();
  } catch (err) {
    console.error('Failed to load artwork data:', err);
    error = true;
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Page Header */}
        <AnimatedSection className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Gallery
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore my collection of artwork spanning still photography, portraits, and landscapes. 
            Click on any image to view it in detail.
          </p>
        </AnimatedSection>

        {/* Gallery Component or Error State */}
        <AnimatedSection delay={150}>
          {error || !artworks ? (
            <ErrorState 
              message="Unable to load gallery. Please refresh the page or try again later."
              onRetry={() => window.location.reload()}
            />
          ) : (
            <Gallery artworks={artworks} />
          )}
        </AnimatedSection>
      </div>
    </div>
  );
}
