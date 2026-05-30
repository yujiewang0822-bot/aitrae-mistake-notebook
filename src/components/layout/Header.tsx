import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

interface HeaderProps {
  title?: string
  showBack?: boolean
  rightAction?: ReactNode
  className?: string
}

export default function Header({
  title,
  showBack = false,
  rightAction,
  className = '',
}: HeaderProps) {
  const navigate = useNavigate()

  return (
    <header className={`sticky top-0 z-40 bg-white border-b border-gray-100 ${className}`}>
      <div className="pt-[max(env(safe-area-inset-top),0px)]">
        <div className="h-14 flex items-center px-4">
          <div className="w-10 h-10 flex items-center">
            {showBack && (
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
            )}
          </div>
          {title && (
            <div className="flex-1 text-center">
              <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
            </div>
          )}
          <div className="w-10 h-10 flex items-center justify-end">
            {rightAction}
          </div>
        </div>
      </div>
    </header>
  )
}
