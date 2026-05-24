import { ReactNode } from 'react'
import * as RadixTabs from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

export function Tabs({ value, onValueChange, children, className }: any) {
  return (
    <RadixTabs.Root value={value} onValueChange={onValueChange} className={className}>
      {children}
    </RadixTabs.Root>
  )
}

export function TabsList({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <RadixTabs.List
      className={cn(
        'flex gap-2 border-b border-accent-200 dark:border-accent-700 bg-transparent overflow-x-auto',
        className
      )}
    >
      {children}
    </RadixTabs.List>
  )
}

export function TabsTrigger({ value, children, className }: { value: string; children: ReactNode; className?: string }) {
  return (
    <RadixTabs.Trigger
      value={value}
      className={cn(
        'px-4 py-3 font-medium text-accent-600 dark:text-accent-400 hover:text-accent-900 dark:hover:text-accent-300 whitespace-nowrap',
        'border-b-2 border-transparent transition-all',
        'data-[state=active]:border-primary-600 data-[state=active]:text-primary-600 dark:data-[state=active]:text-primary-400',
        className
      )}
    >
      {children}
    </RadixTabs.Trigger>
  )
}

export function TabsContent({ value, children, className }: { value: string; children: ReactNode; className?: string }) {
  return (
    <RadixTabs.Content value={value} className={className}>
      {children}
    </RadixTabs.Content>
  )
}
