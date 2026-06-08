import { useNavigate } from 'react-router-dom'
import { useAuth } from '../data/mockAuth'
import PrimaryButton from '../components/ui/PrimaryButton'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleLogin = () => {
    login()
    navigate('/onboarding', { replace: true })
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 bg-primary-600 rounded-2xl flex items-center justify-center mb-6">
          <span className="text-white text-2xl font-bold">AI</span>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">AI数学错题本</h1>
        <p className="text-gray-500 text-center mb-12">
          记录错题，理解错因，练会同类题
        </p>
      </div>

      <div className="px-6 pb-8 space-y-4">
        <PrimaryButton onClick={handleLogin}>
          手机号登录
        </PrimaryButton>
        
        <button 
          className="w-full h-12 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
          onClick={handleLogin}
        >
          <span className="text-green-600">●</span>
          微信登录
        </button>
      </div>

      <div className="pb-8 text-center">
        <p className="text-xs text-gray-400">
          登录即代表同意
          <span className="text-primary-600">用户协议</span>
          与
          <span className="text-primary-600">隐私政策</span>
        </p>
      </div>
    </div>
  )
}
