import { useNavigate } from 'react-router-dom'
import { CheckCircle, X, TrendingUp, Target, RotateCcw, BookOpen, ChevronRight } from 'lucide-react'
import AppCard from '../components/ui/AppCard'
import PrimaryButton from '../components/ui/PrimaryButton'
import SecondaryButton from '../components/ui/SecondaryButton'
import StatusTag from '../components/ui/StatusTag'

export default function PracticeResultPage() {
  const navigate = useNavigate()

  const handleClose = () => {
    navigate('/home')
  }

  const handlePracticeAgain = () => {
    navigate('/practice/1')
  }

  const handleViewMistake = () => {
    navigate('/mistake/1')
  }

  const handleBackToCenter = () => {
    navigate('/practice')
  }

  const handleBackToHome = () => {
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
          <span className="text-gray-800 font-medium">练习结果</span>
        </div>
        <div className="w-10"></div>
      </div>

      <div className="px-4 py-8">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">练习完成</h1>
          <p className="text-gray-600">你完成了本次举一反三练习</p>
        </div>

        <AppCard className="mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-1">本次练习</p>
              <p className="text-gray-800 font-bold text-xl">5 道题</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-1">答对</p>
              <p className="text-green-600 font-bold text-xl">4 道</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-1">正确率</p>
              <p className="text-primary-600 font-bold text-2xl">80%</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-1">用时</p>
              <p className="text-gray-800 font-bold text-xl">6 分钟</p>
            </div>
          </div>
        </AppCard>

        <AppCard className="mb-4">
          <h3 className="text-gray-900 font-semibold flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-green-600" />
            本次表现
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <StatusTag type="success">已改善</StatusTag>
              <span className="text-gray-700">一元一次方程移项</span>
            </div>
            <div className="flex items-center gap-2">
              <StatusTag type="warning">仍需注意</StatusTag>
              <span className="text-gray-700">符号变化</span>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl mt-3">
              <p className="text-blue-700 text-sm">
                <span className="font-medium">AI 建议：</span>继续练习 2 道同类题，巩固移项计算
              </p>
            </div>
          </div>
        </AppCard>

        <AppCard className="mb-6">
          <h3 className="text-gray-900 font-semibold flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-red-500" />
            错误回顾
          </h3>
          <div className="p-3 bg-gray-50 rounded-xl">
            <div className="mb-2">
              <p className="text-gray-500 text-xs">题目</p>
              <p className="text-gray-800">解方程：4x - 3 = 9</p>
            </div>
            <div className="flex gap-4">
              <div>
                <p className="text-gray-500 text-xs">你的答案</p>
                <p className="text-red-600 font-mono">x = 2</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">正确答案</p>
                <p className="text-green-600 font-mono">x = 3</p>
              </div>
            </div>
            <p className="text-gray-500 text-xs mt-2">错误原因：移项后计算不完整</p>
          </div>
        </AppCard>

        <AppCard className="mb-6">
          <h3 className="text-gray-900 font-semibold mb-4">接下来你可以</h3>
          <div className="space-y-3">
            <button
              type="button"
              onClick={handlePracticeAgain}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <RotateCcw className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-gray-900 font-medium">再练一组</p>
                <p className="text-gray-500 text-xs">继续练习同知识点题目</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              type="button"
              onClick={handleViewMistake}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-gray-900 font-medium">查看原错题</p>
                <p className="text-gray-500 text-xs">回到错题详情页复盘</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              type="button"
              onClick={handleBackToCenter}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-gray-900 font-medium">返回练习中心</p>
                <p className="text-gray-500 text-xs">选择其他练习方式</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </AppCard>
      </div>

      <div className="px-4 py-4 pb-[max(env(safe-area-inset-bottom),20px)] bg-white border-t border-gray-100">
        <div className="flex gap-3">
          <div className="flex-1">
            <SecondaryButton className="w-full" onClick={handleBackToHome}>
              返回首页
            </SecondaryButton>
          </div>
          <div className="flex-1">
            <PrimaryButton className="w-full" onClick={handlePracticeAgain}>
              再练一组
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  )
}
