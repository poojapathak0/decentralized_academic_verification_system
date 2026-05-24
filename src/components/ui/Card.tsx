import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  className?: string
  children: ReactNode
}

export function Card({ className, children }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-accent-800 rounded-xl border border-accent-200 dark:border-accent-700 shadow-sm hover:shadow-md transition-shadow p-6',
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children }: CardProps) {
  return <div className={cn('mb-4 pb-4 border-b border-accent-200 dark:border-accent-700', className)}>{children}</div>
}

export function CardTitle({ className, children }: CardProps) {
  return <h3 className={cn('text-xl font-bold text-accent-900 dark:text-white', className)}>{children}</h3>
}

export function CardDescription({ className, children }: CardProps) {
  return <p className={cn('text-sm text-accent-600 dark:text-accent-400 mt-1', className)}>{children}</p>
}

export function CardContent({ className, children }: CardProps) {
  return <div className={cn('', className)}>{children}</div>
}

export function CardFooter({ className, children }: CardProps) {
  return (
    <div className={cn('mt-6 pt-6 border-t border-accent-200 dark:border-accent-700 flex gap-3', className)}>
      {children}
    </div>
  )
}
