import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, PenTool, Tags, Target, TrendingUp } from 'lucide-react'
import Header from '../components/layout/Header'
import BottomNav from '../components/layout/BottomNav'
import AppCard from '../components/ui/AppCard'
import PrimaryButton from '../components/ui/PrimaryButton'
import Toast from '../components/ui/Toast'

export default function PracticeCenterPage() {
  const navigate = useNavigate()
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const showToast = (message: string) => {
    setToastMessage(message)
    setToastVisible(true)
    setTimeout(() => {
      setToastVisible(false)
    }, 2000)
  }

  const handleKnowledgePointPractice = () => {
    showToast('功能建设中')
  }

  const handlePracticeHistory = () => {
    showToast('功能建设中')
  }

  return (
    <div className="pb-24">
      <Header title="练习中心" />

      <div className="px-4 pt-4">
        <p className="text-sm text-gray-500 mb-6">选择你想强化的练习方式</p>

        <AppCard className="p-4 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">根据你的错题推荐</h3>
              <p className="text-sm text-gray-500 mb-2">优先练习近期重复出错的知识点</p>
              <span className="text-xs text-gray-400">推荐 8 道题</span>
            </div>
          </div>
          <PrimaryButton className="mt-4" onClick={() => navigate('/practice/1')}>
            开始练习
          </PrimaryButton>
        </AppCard>

        <div className="grid grid-cols-2 gap-3">
          <AppCard className="p-4">
            <div className="cursor-pointer" onClick={() => navigate('/practice/1')}>
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-3">
                <PenTool className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">举一反三</h3>
              <p className="text-xs text-gray-500">根据已保存错题推荐同知识点、同错误类型的练习题</p>
            </div>
          </AppCard>

          <AppCard className="p-4">
            <div className="cursor-pointer" onClick={handleKnowledgePointPractice}>
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-3">
                <Tags className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">知识点练习</h3>
              <p className="text-xs text-gray-500">按薄弱知识点选择练习</p>
            </div>
          </AppCard>

          <AppCard className="p-4">
            <div className="cursor-pointer" onClick={() => navigate('/study-plan')}>
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-3">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">考试专题练习</h3>
              <p className="text-xs text-gray-500">围绕月考、期中、期末目标生成专题练习</p>
            </div>
          </AppCard>

          <AppCard className="p-4">
            <div className="cursor-pointer" onClick={handlePracticeHistory}>
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-3">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">练习记录</h3>
              <p className="text-xs text-gray-500">查看历史练习结果和正确率变化</p>
            </div>
          </AppCard>
        </div>
      </div>

      <BottomNav />

      <Toast message={toastMessage} visible={toastVisible} />
    </div>
  )
}
