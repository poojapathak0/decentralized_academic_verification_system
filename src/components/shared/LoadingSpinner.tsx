import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

const sizeMap = {
  sm: 'w-8 h-8 border-2',
  md: 'w-12 h-12 border-3',
  lg: 'w-16 h-16 border-4',
}

export function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={`${sizeMap[size]} border-accent-300 dark:border-accent-600 border-t-primary-600 dark:border-t-primary-400 rounded-full`}
      />
      {text && (
        <p className="text-accent-600 dark:text-accent-400 font-medium">{text}</p>
      )}
    </div>
  )
}

export function FullPageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-accent-900 z-50">
      <LoadingSpinner size="lg" text="Loading..." />
    </div>
  )
}
