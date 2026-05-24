import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: ReactNode
}

const buttonVariants = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 transition-colors',
  secondary:
    'bg-accent-200 text-accent-900 hover:bg-accent-300 active:bg-accent-400 transition-colors dark:bg-accent-800 dark:text-accent-100 dark:hover:bg-accent-700',
  outline:
    'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 active:bg-primary-100 dark:hover:bg-primary-950 transition-colors',
  ghost:
    'text-primary-600 hover:bg-primary-50 active:bg-primary-100 dark:text-primary-400 dark:hover:bg-accent-950 transition-colors',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 transition-colors',
}

const sizeVariants = {
  sm: 'px-3 py-1.5 text-sm font-medium rounded-md',
  md: 'px-4 py-2 text-base font-medium rounded-lg',
  lg: 'px-6 py-3 text-lg font-medium rounded-lg',
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        'font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-accent-900',
        buttonVariants[variant],
        sizeVariants[size],
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center gap-2">
        {isLoading && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </div>
    </button>
  )
}
