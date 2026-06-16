import { clsx } from 'clsx';

export function Skeleton({ className = '', ...props }) {
  return (
    <div className={clsx('skeleton-loader', className)} {...props} />
  );
}

export function SkeletonCard() {
  return (
    <div className="glass-card p-6 space-y-4">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="p-4 border-b border-black/5 dark:border-white/5">
        <Skeleton className="h-8 w-48" />
      </div>
      <div className="divide-y divide-black/5 dark:divide-white/5">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-6 py-4 flex gap-6">
            {Array.from({ length: cols }).map((_, j) => (
              <Skeleton
                key={j}
                className="h-4 flex-1"
                style={{ maxWidth: `${Math.random() * 40 + 60}%` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="glass-card p-6">
      <Skeleton className="h-4 w-1/3 mb-6" />
      <Skeleton className="h-48 w-full rounded-xl" />
    </div>
  );
}
