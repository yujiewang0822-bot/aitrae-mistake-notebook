import { useNavigate, useLocation } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { messages } from '../../data/mockData'

type NavItem = {
  label: string
  path: string
}

export default function DesktopNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems: NavItem[] = [
    { label: '首页', path: '/home' },
    { label: '错题本', path: '/mistakes' },
    { label: '练习', path: '/practice' },
    { label: '我的', path: '/profile' },
  ]

  const isActive = (path: string) => {
    if (path === '/home') {
      return location.pathname === '/home'
    }
    return location.pathname.startsWith(path)
  }

  const unreadCount = messages.filter(m => !m.read).length

  return (
    <nav className="hidden md:block bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-8 h-16 flex items-center justify-between">
        <button 
          onClick={() => navigate('/home')}
          className="text-xl font-bold text-primary-600"
        >
          AI数学错题本
        </button>
        
        <div className="flex items-center gap-8">
          {navItems.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`text-sm font-medium transition-colors ${
                isActive(item.path) 
                  ? 'text-primary-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button 
          onClick={() => navigate('/message')}
          className="relative p-2"
        >
          <Bell className="w-5 h-5 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </button>
      </div>
    </nav>
  )
}
