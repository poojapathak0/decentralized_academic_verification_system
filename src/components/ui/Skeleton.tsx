import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-accent-300 dark:bg-accent-700 rounded-lg animate-pulse',
        className
      )}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-accent-800 rounded-xl border border-accent-200 dark:border-accent-700 p-6 space-y-4">
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex gap-2 pt-4">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  )
}

export function CertificateCardSkeleton() {
  return (
    <div className="bg-white dark:bg-accent-800 rounded-lg border border-accent-200 dark:border-accent-700 p-4 space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-8 w-16 rounded-full" />
        <Skeleton className="h-8 w-16 rounded-full" />
      </div>
    </div>
  )
}
