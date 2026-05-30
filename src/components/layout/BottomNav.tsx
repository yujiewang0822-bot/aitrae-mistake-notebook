import { useNavigate, useLocation } from 'react-router-dom'
import { Home, BookOpen, Gamepad2, User } from 'lucide-react'

type TabType = {
  label: string
  path: string
  icon: React.ReactNode
  activeIcon: React.ReactNode
}

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const tabs: TabType[] = [
    {
      label: '首页',
      path: '/home',
      icon: <Home className="w-6 h-6" />,
      activeIcon: <Home className="w-6 h-6 fill-current" />,
    },
    {
      label: '错题本',
      path: '/mistakes',
      icon: <BookOpen className="w-6 h-6" />,
      activeIcon: <BookOpen className="w-6 h-6 fill-current" />,
    },
    {
      label: '练习',
      path: '/practice',
      icon: <Gamepad2 className="w-6 h-6" />,
      activeIcon: <Gamepad2 className="w-6 h-6 fill-current" />,
    },
    {
      label: '我的',
      path: '/profile',
      icon: <User className="w-6 h-6" />,
      activeIcon: <User className="w-6 h-6 fill-current" />,
    },
  ]

  const isActive = (path: string) => {
    if (path === '/home') {
      return location.pathname === '/home'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="md:absolute bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 md:max-w-[390px] md:mx-auto md:rounded-t-2xl">
      <div className="fixed md:relative bottom-0 left-0 right-0 flex items-center justify-around h-16 bg-white md:bg-transparent border-t md:border-t-0 border-gray-100" style={{ maxWidth: '390px', margin: '0 auto', left: '50%', transform: 'translateX(-50%)', bottom: 'max(env(safe-area-inset-bottom), 0px)' }}>
        {tabs.map((tab) => {
          const active = isActive(tab.path)
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex-1 flex flex-col items-center justify-center h-full"
            >
              <div className={`transition-colors ${active ? 'text-primary-600' : 'text-gray-400'}`}>
                {active ? tab.activeIcon : tab.icon}
              </div>
              <span className={`text-xs mt-1 font-medium ${active ? 'text-primary-600' : 'text-gray-400'}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
