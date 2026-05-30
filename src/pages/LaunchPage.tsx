import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../data/mockAuth'

export default function LaunchPage() {
  const navigate = useNavigate()
  const { isLoggedIn, hasCompletedOnboarding } = useAuth()

  useEffect(() => {
    if (!isLoggedIn) {
      // 未登录，跳转到登录页
      navigate('/login', { replace: true })
    } else if (!hasCompletedOnboarding) {
      // 已登录但未完成新手引导，跳转到新手引导页
      navigate('/onboarding', { replace: true })
    } else {
      // 已登录且完成新手引导，跳转到首页
      navigate('/home', { replace: true })
    }
  }, [navigate, isLoggedIn, hasCompletedOnboarding])

  // 显示加载状态
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="animate-pulse text-gray-400">加载中...</div>
    </div>
  )
}
