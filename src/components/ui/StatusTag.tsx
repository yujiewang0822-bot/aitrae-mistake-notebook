import { ReactNode } from 'react'

type StatusType = 'success' | 'error' | 'warning' | 'ai' | 'default' | 'info'

interface StatusTagProps {
  type?: StatusType
  children: ReactNode
  className?: string
}

const typeStyles: Record<StatusType, string> = {
  success: 'bg-green-100 text-green-700',
  error: 'bg-red-100 text-red-700',
  warning: 'bg-amber-100 text-amber-700',
  ai: 'bg-purple-100 text-purple-700',
  info: 'bg-blue-100 text-blue-700',
  default: 'bg-gray-100 text-gray-700',
}

export default function StatusTag({
  type = 'default',
  children,
  className = '',
}: StatusTagProps) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${typeStyles[type]} ${className}`}>
      {children}
    </span>
  )
}
