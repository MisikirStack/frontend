/**
 * Loading Skeleton Components
 * Reusable loading indicators for various content types
 */

export function BusinessCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border bg-white p-4 animate-pulse">
      <div className="flex items-start justify-between mb-2">
        <div className="h-12 w-12 rounded-md bg-muted"></div>
        <div className="h-4 w-12 bg-muted rounded"></div>
      </div>
      <div className="h-6 w-3/4 bg-muted rounded mb-2"></div>
      <div className="space-y-2">
        <div className="h-4 w-full bg-muted rounded"></div>
        <div className="h-4 w-2/3 bg-muted rounded"></div>
      </div>
      <div className="mt-4 pt-4 border-t flex justify-between">
        <div className="h-4 w-20 bg-muted rounded"></div>
        <div className="h-4 w-20 bg-muted rounded"></div>
      </div>
    </div>
  );
}

export function BusinessDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-[300px] w-full bg-muted rounded-lg"></div>
      <div className="flex gap-4">
        <div className="h-24 w-24 bg-muted rounded-lg"></div>
        <div className="flex-1 space-y-3">
          <div className="h-8 w-3/4 bg-muted rounded"></div>
          <div className="h-4 w-1/2 bg-muted rounded"></div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-4 w-full bg-muted rounded"></div>
        <div className="h-4 w-full bg-muted rounded"></div>
        <div className="h-4 w-3/4 bg-muted rounded"></div>
      </div>
    </div>
  );
}

export function ReviewSkeleton() {
  return (
    <div className="space-y-3 border-b pb-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-muted"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 bg-muted rounded"></div>
          <div className="h-3 w-24 bg-muted rounded"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full bg-muted rounded"></div>
        <div className="h-4 w-5/6 bg-muted rounded"></div>
      </div>
    </div>
  );
}

export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-green-200 border-t-green-600`}
      ></div>
    </div>
  );
}
