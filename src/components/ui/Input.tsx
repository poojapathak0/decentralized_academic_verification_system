import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            'w-full px-4 py-2 rounded-lg border-2 border-accent-300 bg-white dark:bg-accent-800 text-accent-900 dark:text-white placeholder-accent-500 dark:placeholder-accent-400',
            'focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 transition-all',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
