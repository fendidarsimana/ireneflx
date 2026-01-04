interface SkeletonCardProps {
  variant?: "default" | "large" | "compact";
}

export function SkeletonCard({ variant = "default" }: SkeletonCardProps) {
  if (variant === "large") {
    return (
      <div className="w-[280px] h-[380px] rounded-xl skeleton-pulse flex-shrink-0" />
    );
  }

  if (variant === "compact") {
    return (
      <div className="flex gap-3 p-2">
        <div className="w-20 h-28 rounded-lg skeleton-pulse flex-shrink-0" />
        <div className="flex-1 py-1">
          <div className="h-4 w-3/4 skeleton-pulse mb-2" />
          <div className="h-3 w-full skeleton-pulse mb-1" />
          <div className="h-3 w-2/3 skeleton-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-[140px] flex-shrink-0">
      <div className="aspect-[2/3] w-full rounded-lg skeleton-pulse mb-2" />
      <div className="h-4 w-3/4 skeleton-pulse mb-1" />
      <div className="h-3 w-1/2 skeleton-pulse" />
    </div>
  );
}

export function SkeletonRow({ count = 5, variant = "default" }: { count?: number; variant?: "default" | "large" | "compact" }) {
  return (
    <div className="flex gap-3 px-4 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} variant={variant} />
      ))}
    </div>
  );
}
