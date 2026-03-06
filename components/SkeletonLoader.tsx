interface SkeletonLoaderProps {
  count?: number;
}

export default function SkeletonLoader({ count = 8 }: SkeletonLoaderProps) {
  return (
    <div
      className="
        grid gap-6
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
      "
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse"
          style={{
            animationDelay: `${index * 50}ms`,
          }}
        >
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-200">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}
