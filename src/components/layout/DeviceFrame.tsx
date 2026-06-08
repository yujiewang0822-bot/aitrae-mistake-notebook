import { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import BottomNav from './BottomNav'

interface DeviceFrameProps {
  children: ReactNode
}

export default function DeviceFrame({ children }: DeviceFrameProps) {
  const location = useLocation()
  
  // 登录相关页面不显示底部导航
  const loginPaths = ['/login', '/onboarding']
  const isLoginPage = loginPaths.includes(location.pathname)

  return (
    <div className="min-h-screen bg-[#F6F8FB] w-full">
      <main 
        className={`w-full max-w-[1200px] mx-auto px-8 pt-4 md:px-8 ${
          isLoginPage ? 'pb-8' : 'pb-[96px]'
        }`}
      >
        {children}
      </main>
      {!isLoginPage && <BottomNav />}
    </div>
  )
}
