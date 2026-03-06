import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-white via-light-bg to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section - More dramatic and spacious */}
        <AnimatedSection className="text-center pt-16 sm:pt-24 lg:pt-32 pb-12 sm:pb-16 lg:pb-20">
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <div className="absolute top-0 left-1/4 w-72 h-72 bg-light-blue rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
              <div className="absolute top-0 right-1/4 w-72 h-72 bg-primary-blue rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 tracking-tight">
              Millie Rogers
            </h1>
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary-blue"></div>
              <p className="text-xl sm:text-2xl lg:text-3xl text-primary-blue font-light tracking-wide">
                Artist & Photographer
              </p>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary-blue"></div>
            </div>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto font-light">
              Capturing the beauty of the world through lens and creative vision
            </p>
          </div>
        </AnimatedSection>

        {/* Bio Section - More modern card design */}
        <AnimatedSection delay={150} className="max-w-5xl mx-auto mb-20 lg:mb-28">
          <div className="relative">
            {/* Accent border */}
            <div className="absolute -inset-1 bg-gradient-to-r from-light-blue via-primary-blue to-light-blue rounded-2xl blur opacity-25"></div>
            
            <div className="relative bg-white rounded-2xl p-8 sm:p-12 shadow-xl border border-gray-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-1 w-16 bg-gradient-to-r from-primary-blue to-light-blue rounded-full"></div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  About the Artist
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-5 text-gray-700 leading-relaxed">
                  <p className="text-lg">
                    Welcome to my art portfolio. I'm <span className="font-semibold text-gray-900">Millie Rogers</span>, 
                    a passionate artist and photographer dedicated to capturing the beauty of the world through my lens and creative vision.
                  </p>
                  <p>
                    My work spans across three main categories: still photography, portraiture, and 
                    landscape art. Each piece tells a unique story, inviting viewers to see the world 
                    from a different perspective.
                  </p>
                </div>
                
                <div className="space-y-5 text-gray-700 leading-relaxed">
                  <p>
                    Through careful composition, lighting, and attention to detail, I strive to create 
                    images that evoke emotion and inspire contemplation.
                  </p>
                  <p>
                    Whether it's the quiet serenity of a landscape, the character revealed in a portrait, 
                    or the subtle beauty of everyday moments, my goal is to share these visual 
                    experiences with you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Featured Work Section - More dynamic grid */}
        <AnimatedSection delay={300} className="mb-20 lg:mb-28">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Explore My Work
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover my portfolio across three distinct categories
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Still Photos Card */}
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="aspect-[3/4] bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 relative">
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                  <div className="transform transition-transform duration-300 group-hover:translate-y-0 translate-y-2">
                    <h3 className="text-2xl font-bold mb-3">Still Photos</h3>
                    <p className="text-gray-200 text-sm mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Capturing moments of beauty in everyday life
                    </p>
                    <Link 
                      href="/gallery" 
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-blue font-semibold rounded-full hover:bg-gray-100 transition-all duration-200 shadow-lg"
                    >
                      View Gallery
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Portraits Card */}
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="aspect-[3/4] bg-gradient-to-br from-indigo-50 via-indigo-100 to-indigo-200 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                
                <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                  <div className="transform transition-transform duration-300 group-hover:translate-y-0 translate-y-2">
                    <h3 className="text-2xl font-bold mb-3">Portraits</h3>
                    <p className="text-gray-200 text-sm mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Revealing character and emotion through portraiture
                    </p>
                    <Link 
                      href="/gallery" 
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-blue font-semibold rounded-full hover:bg-gray-100 transition-all duration-200 shadow-lg"
                    >
                      View Gallery
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Landscapes Card */}
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="aspect-[3/4] bg-gradient-to-br from-cyan-50 via-cyan-100 to-cyan-200 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                
                <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                  <div className="transform transition-transform duration-300 group-hover:translate-y-0 translate-y-2">
                    <h3 className="text-2xl font-bold mb-3">Landscapes</h3>
                    <p className="text-gray-200 text-sm mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Exploring the majesty of natural environments
                    </p>
                    <Link 
                      href="/gallery" 
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-blue font-semibold rounded-full hover:bg-gray-100 transition-all duration-200 shadow-lg"
                    >
                      View Gallery
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Call to Action - More modern design */}
        <AnimatedSection delay={450} className="pb-20 lg:pb-28">
          <div className="relative overflow-hidden rounded-3xl">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-blue via-blue-500 to-light-blue"></div>
            
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '32px 32px'
              }}></div>
            </div>
            
            <div className="relative px-8 py-16 sm:px-12 sm:py-20 text-center text-white">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                Let's Connect
              </h2>
              <p className="text-lg sm:text-xl mb-10 opacity-95 max-w-2xl mx-auto font-light">
                Interested in my work or have a project in mind? I'd love to hear from you.
              </p>
              <Link 
                href="/contact" 
                className="inline-flex items-center gap-3 px-10 py-4 bg-white text-primary-blue font-bold rounded-full hover:bg-gray-100 hover:scale-105 transition-all duration-200 shadow-2xl text-lg"
              >
                Get in Touch
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
