import { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closeButton?: boolean
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  closeButton = true,
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                'bg-white dark:bg-accent-800 rounded-xl shadow-lg w-full',
                sizeClasses[size]
              )}
            >
              {(title || closeButton) && (
                <div className="flex items-center justify-between p-6 border-b border-accent-200 dark:border-accent-700">
                  <div>
                    {title && <h2 className="text-xl font-bold text-accent-900 dark:text-white">{title}</h2>}
                    {description && (
                      <p className="text-sm text-accent-600 dark:text-accent-400 mt-1">{description}</p>
                    )}
                  </div>
                  {closeButton && (
                    <button
                      onClick={onClose}
                      className="p-1 hover:bg-accent-100 dark:hover:bg-accent-700 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}
              <div className="p-6">{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
