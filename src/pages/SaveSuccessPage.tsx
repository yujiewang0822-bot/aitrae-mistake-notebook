import { useNavigate } from 'react-router-dom'
import { CheckCircle, X, BookOpen, PenTool, Camera, ChevronRight } from 'lucide-react'
import AppCard from '../components/ui/AppCard'
import PrimaryButton from '../components/ui/PrimaryButton'
import SecondaryButton from '../components/ui/SecondaryButton'
import StatusTag from '../components/ui/StatusTag'

export default function SaveSuccessPage() {
  const navigate = useNavigate()

  const handleClose = () => {
    navigate('/home')
  }

  const handleViewDetail = () => {
    navigate('/mistake/1')
  }

  const handlePractice = () => {
    navigate('/practice/1')
  }

  const handleContinueUpload = () => {
    navigate('/upload')
  }

  const handleGoHome = () => {
    navigate('/home')
  }

  return (
    <div className="min-h-screen bg-[#F6F8FB]">
      <div className="flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <button
          type="button"
          onClick={handleClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1 text-center">
          <span className="text-gray-800 font-medium">保存成功</span>
        </div>
        <div className="w-10"></div>
      </div>

      <div className="px-4 py-8">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">保存成功</h1>
          <p className="text-gray-600 mb-2">这道错题已加入你的错题本</p>
          <p className="text-gray-400 text-sm">系统将根据掌握情况安排后续复习</p>
        </div>

        <AppCard className="mb-6">
          <h3 className="text-gray-900 font-semibold mb-4">保存结果摘要</h3>
          <div className="space-y-3">
            <div>
              <p className="text-gray-500 text-xs mb-1">题目</p>
              <p className="text-gray-800">解方程：3x - 5 = 10</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">知识点</p>
              <div className="flex flex-wrap gap-2">
                <StatusTag type="ai">一元一次方程</StatusTag>
                <StatusTag type="ai">移项</StatusTag>
                <StatusTag type="ai">方程计算</StatusTag>
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">错误类型</p>
              <StatusTag type="error">计算错误</StatusTag>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">复习安排</p>
              <p className="text-gray-800">明天首次复习</p>
            </div>
          </div>
        </AppCard>

        <AppCard className="mb-6">
          <h3 className="text-gray-900 font-semibold mb-4">接下来你可以</h3>
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleViewDetail}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-gray-900 font-medium">查看错题详情</p>
                <p className="text-gray-500 text-xs">查看完整解析与错因记录</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              type="button"
              onClick={handlePractice}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <PenTool className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-gray-900 font-medium">开始举一反三</p>
                <p className="text-gray-500 text-xs">练习同知识点、同错误类型题目</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              type="button"
              onClick={handleContinueUpload}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Camera className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-gray-900 font-medium">继续上传错题</p>
                <p className="text-gray-500 text-xs">继续整理下一道错题</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </AppCard>
      </div>

      <div className="px-4 py-4 pb-[max(env(safe-area-inset-bottom),20px)] bg-white border-t border-gray-100">
        <div className="flex gap-3">
          <div className="flex-1">
            <SecondaryButton className="w-full" onClick={handleGoHome}>
              返回首页
            </SecondaryButton>
          </div>
          <div className="flex-1">
            <PrimaryButton className="w-full" onClick={handleContinueUpload}>
              继续上传
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  )
}
