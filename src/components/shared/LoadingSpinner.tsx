'use client';

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
    </div>
  );
}

export function LoadingSkeletonCard() {
  return (
    <div className="bg-slate-200 dark:bg-slate-700 rounded-lg h-64 animate-pulse"></div>
  );
}
