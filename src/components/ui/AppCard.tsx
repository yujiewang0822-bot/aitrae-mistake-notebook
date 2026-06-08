import { ReactNode } from 'react'

interface AppCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export default function AppCard({ children, className = '', onClick }: AppCardProps) {
  return (
    <div className={`bg-white rounded-2xl p-4 shadow-sm ${className}`} onClick={onClick}>
      {children}
    </div>
  )
}
