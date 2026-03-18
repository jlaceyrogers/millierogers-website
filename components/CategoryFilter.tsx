'use client';

import { CategoryFilter as CategoryFilterType } from '@/lib/types';

interface CategoryFilterProps {
  selectedCategory: CategoryFilterType;
  onCategoryChange: (category: CategoryFilterType) => void;
  artworkCounts: Record<CategoryFilterType, number>;
}

const categories: CategoryFilterType[] = ['All', 'Still Life', 'Portraits', 'Landscapes'];

export default function CategoryFilter({
  selectedCategory,
  onCategoryChange,
  artworkCounts,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-6 sm:mb-8 px-2" role="group" aria-label="Filter artworks by category">
      {categories.map((category) => {
        const isActive = selectedCategory === category;
        const count = artworkCounts[category];

        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`
              px-4 sm:px-6 py-3 min-h-[44px] rounded-full font-medium text-sm sm:text-base
              transition-all duration-200 ease-out
              focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2
              ${
                isActive
                  ? 'bg-primary-blue text-white shadow-md hover:bg-blue-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-light-blue hover:text-primary-blue'
              }
            `}
            aria-label={`Filter by ${category} (${count} artworks)`}
            aria-pressed={isActive}
          >
            <span className="flex items-center gap-2">
              <span>{category}</span>
              <span
                className={`
                  text-xs sm:text-sm font-normal
                  ${isActive ? 'text-white/90' : 'text-gray-500'}
                `}
              >
                ({count})
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
