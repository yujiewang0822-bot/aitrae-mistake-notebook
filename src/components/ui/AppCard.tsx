import { ReactNode } from 'react'

interface AppCardProps {
  children: ReactNode
  className?: string
}

export default function AppCard({ children, className = '' }: AppCardProps) {
  return (
    <div className={`bg-white rounded-2xl p-4 shadow-sm ${className}`}>
      {children}
    </div>
  )
}
