import { useState } from 'react'
import { User, BookOpen, CheckCircle, Flame, TrendingUp, ChevronRight } from 'lucide-react'
import Header from '../components/layout/Header'
import BottomNav from '../components/layout/BottomNav'
import AppCard from '../components/ui/AppCard'
import SecondaryButton from '../components/ui/SecondaryButton'
import Toast from '../components/ui/Toast'
import { useAuth } from '../data/mockAuth'
import { homeSummary } from '../data/mockData'

export default function ProfilePage() {
  const { userProfile } = useAuth()
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const showToast = (message: string) => {
    setToastMessage(message)
    setToastVisible(true)
    setTimeout(() => {
      setToastVisible(false)
    }, 2000)
  }

  const handleLogout = () => {
    showToast('已退出登录')
  }

  const handleSettingClick = () => {
    showToast('功能建设中')
  }

  const gradeText = userProfile.grade || '初二'
  const textbookText = userProfile.textbookVersion || '人教版'
  const examGoalText = userProfile.examGoal || '期中考'

  return (
    <div className="pb-24">
      <Header title="我的" />

      <div className="px-4 pt-4">
        <p className="text-sm text-gray-500 mb-6">查看学习信息与账号设置</p>

        <AppCard className="p-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg">小明同学</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">{gradeText}</span>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">{textbookText}</span>
                <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">{examGoalText}</span>
              </div>
            </div>
          </div>
        </AppCard>

        <AppCard className="p-4 mb-4">
          <h3 className="font-semibold text-gray-900 mb-4">学习数据</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">{homeSummary.totalMistakes}</div>
                <div className="text-xs text-gray-500">已收录错题</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">{homeSummary.masteredMistakes}</div>
                <div className="text-xs text-gray-500">已掌握</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">{homeSummary.continuousStudyDays}天</div>
                <div className="text-xs text-gray-500">连续学习</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">{homeSummary.weeklyAccuracy}%</div>
                <div className="text-xs text-gray-500">本周正确率</div>
              </div>
            </div>
          </div>
        </AppCard>

        <AppCard className="mb-4">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">学习设置</h3>
          </div>
          <div>
            <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50">
              <span className="text-gray-700">年级与教材</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50">
              <span className="text-gray-700">考试目标</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50">
              <span className="text-gray-700">复习提醒</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button 
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50"
              onClick={handleSettingClick}
            >
              <span className="text-gray-700">数据导出</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </AppCard>

        <AppCard className="mb-4">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">账号与支持</h3>
          </div>
          <div>
            <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50">
              <span className="text-gray-700">用户协议</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50">
              <span className="text-gray-700">隐私政策</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button 
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50"
              onClick={handleSettingClick}
            >
              <span className="text-gray-700">意见反馈</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50">
              <span className="text-gray-700">关于 AI错题本</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </AppCard>

        <SecondaryButton className="w-full" onClick={handleLogout}>
          退出登录
        </SecondaryButton>
      </div>

      <BottomNav />

      <Toast message={toastMessage} visible={toastVisible} />
    </div>
  )
}
