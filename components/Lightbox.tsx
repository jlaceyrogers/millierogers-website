'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { Artwork } from '@/lib/types';
import { getLightboxSizes, getImageQuality } from '@/lib/image-utils';

interface LightboxProps {
  artwork: Artwork | null;
  allArtworks: Artwork[];
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

export default function Lightbox({ artwork, allArtworks, onClose, onNavigate }: LightboxProps) {
  const [mounted, setMounted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const triggerElementRef = useRef<Element | null>(null);

  const isOpen = artwork !== null;

  // Handle mounting for portal
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Store the trigger element when opening
  useEffect(() => {
    if (isOpen && !triggerElementRef.current) {
      triggerElementRef.current = document.activeElement;
    }
  }, [isOpen]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setImageLoaded(false);
      setImageError(false);
      
      // Focus the close button when opened
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = '';
      
      // Return focus to trigger element when closed
      if (triggerElementRef.current instanceof HTMLElement) {
        triggerElementRef.current.focus();
        triggerElementRef.current = null;
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle Escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Handle arrow key navigation
  useEffect(() => {
    const handleArrowKeys = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onNavigate('prev');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onNavigate('next');
      }
    };

    document.addEventListener('keydown', handleArrowKeys);
    return () => document.removeEventListener('keydown', handleArrowKeys);
  }, [isOpen, onNavigate]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  // Calculate current index and navigation state
  const currentIndex = artwork ? allArtworks.findIndex(a => a.id === artwork.id) : -1;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === allArtworks.length - 1;

  // Focus trap implementation
  useEffect(() => {
    if (!isOpen) return;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = document.querySelectorAll(
        '[data-lightbox-focusable]'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  if (!mounted || !isOpen || !artwork) {
    return null;
  }

  return createPortal(
    <div
      ref={backdropRef}
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        bg-black/90 p-2 sm:p-4
        transition-opacity duration-200
        ${isOpen ? 'opacity-100' : 'opacity-0'}
      `}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
    >
      {/* Lightbox Content */}
      <div
        className={`
          relative max-w-7xl max-h-[95vh] sm:max-h-[90vh] w-full
          transition-all duration-300
          ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
      >
        {/* Close Button - Optimized for mobile touch */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="
            absolute -top-10 sm:-top-12 right-0 z-10
            text-white hover:text-light-blue
            transition-colors duration-200
            min-w-[44px] min-h-[44px] p-2 rounded-full hover:bg-white/10
          "
          aria-label="Close lightbox"
          data-lightbox-focusable
        >
          <svg
            className="w-6 h-6 sm:w-8 sm:h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Image Container */}
        <div className="relative bg-white rounded-lg overflow-hidden shadow-2xl">
          <div className="relative w-full" style={{ minHeight: '200px' }}>
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="animate-pulse text-gray-400">Loading...</div>
              </div>
            )}
            {imageError ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-center p-4 sm:p-8">
                  <svg
                    className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-gray-600 font-medium text-sm sm:text-base">Image unavailable</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">
                    Unable to load the full-resolution image
                  </p>
                </div>
              </div>
            ) : (
              <Image
                src={artwork.imagePath}
                alt={artwork.title}
                width={artwork.width || 1920}
                height={artwork.height || 1280}
                className="w-full h-auto"
                style={{ maxHeight: 'calc(95vh - 140px)' }}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                priority
                quality={getImageQuality('lightbox')}
                sizes={getLightboxSizes()}
              />
            )}
          </div>

          {/* Artwork Information - Optimized for mobile */}
          <div className="p-4 sm:p-6 bg-white">
            <h2 id="lightbox-title" className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
              {artwork.title}
            </h2>
            <p className="text-primary-blue font-medium text-sm sm:text-base">
              {artwork.category}
            </p>
            {artwork.description && (
              <p className="mt-2 sm:mt-3 text-gray-600 text-sm sm:text-base">
                {artwork.description}
              </p>
            )}
          </div>
        </div>

        {/* Navigation Buttons - Optimized for mobile touch */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none px-1 sm:px-0">
          <button
            onClick={() => onNavigate('prev')}
            disabled={isFirst}
            className={`
              pointer-events-auto -ml-2 sm:-ml-4
              min-w-[44px] min-h-[44px] p-2 sm:p-3 rounded-full
              bg-white/90 hover:bg-white
              shadow-lg
              transition-all duration-200
              ${isFirst ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
            `}
            aria-label="Previous artwork"
            data-lightbox-focusable
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={() => onNavigate('next')}
            disabled={isLast}
            className={`
              pointer-events-auto -mr-2 sm:-mr-4
              min-w-[44px] min-h-[44px] p-2 sm:p-3 rounded-full
              bg-white/90 hover:bg-white
              shadow-lg
              transition-all duration-200
              ${isLast ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
            `}
            aria-label="Next artwork"
            data-lightbox-focusable
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
