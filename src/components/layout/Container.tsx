import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ContainerProps {
  className?: string
  children: ReactNode
}

export function Container({ className, children }: ContainerProps) {
  return (
    <div className={cn('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </div>
  )
}

export function PageHeader({
  title,
  description,
  className,
}: {
  title: string
  description?: string
  className?: string
}) {
  return (
    <div className={cn('mb-8 py-8', className)}>
      <h1 className="text-3xl md:text-4xl font-bold text-accent-900 dark:text-white mb-2">
        {title}
      </h1>
      {description && (
        <p className="text-lg text-accent-600 dark:text-accent-400">{description}</p>
      )}
    </div>
  )
}
