import { useNavigate } from 'react-router-dom'
import { Bell, Camera, CalendarDays, Brain, TrendingUp, AlertCircle } from 'lucide-react'
import Header from '../components/layout/Header'
import BottomNav from '../components/layout/BottomNav'
import AppCard from '../components/ui/AppCard'
import PrimaryButton from '../components/ui/PrimaryButton'
import { homeSummary, studyPlan, messages } from '../data/mockData'

export default function HomePage() {
  const navigate = useNavigate()
  
  const unreadCount = messages.filter(m => !m.read).length

  return (
    <div className="pb-20">
      <Header
        rightAction={
          <button 
            onClick={() => navigate('/message')}
            className="relative p-2"
          >
            <Bell className="w-6 h-6 text-gray-700" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
        }
      />

      <div className="px-4 pt-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Hi，小明同学 👋</h1>
          <p className="text-gray-500 text-sm mt-1">今天也要加油！</p>
        </div>

        <AppCard className="mb-6">
          <div className="flex justify-around">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="w-4 h-4 text-primary-500" />
                <span className="text-2xl font-bold text-gray-900">{homeSummary.todayReviewCount}</span>
              </div>
              <span className="text-xs text-gray-500">今日待复习</span>
            </div>
            <div className="w-px bg-gray-200" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <CalendarDays className="w-4 h-4 text-green-500" />
                <span className="text-2xl font-bold text-gray-900">{homeSummary.continuousStudyDays}</span>
              </div>
              <span className="text-xs text-gray-500">连续学习天数</span>
            </div>
            <div className="w-px bg-gray-200" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Brain className="w-4 h-4 text-purple-500" />
                <span className="text-2xl font-bold text-gray-900">{homeSummary.weeklyAccuracy}%</span>
              </div>
              <span className="text-xs text-gray-500">本周正确率</span>
            </div>
          </div>
        </AppCard>

        <div className="space-y-4">
          <AppCard className="p-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Camera className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">拍照录入错题</h3>
                <p className="text-sm text-gray-500 mb-2">拍整页作业，自动拆成单题</p>
                <span className="text-xs text-gray-400">今日已录入 {homeSummary.todayAddedMistakes} 题</span>
              </div>
            </div>
            <PrimaryButton className="mt-4" onClick={() => navigate('/upload')}>
              立即上传
            </PrimaryButton>
          </AppCard>

          <AppCard className="p-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <CalendarDays className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">今日待复习 {homeSummary.todayReviewCount} 题</h3>
                <p className="text-sm text-gray-500 mb-2">优先复习最近容易忘的题</p>
                <span className="text-xs text-gray-400">新错题5题｜待强化5题｜已掌握2题</span>
              </div>
            </div>
            <PrimaryButton className="mt-4" onClick={() => navigate('/today-review')}>
              开始复习
            </PrimaryButton>
          </AppCard>

          <AppCard className="p-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{studyPlan.examGoal}复习计划</h3>
                <p className="text-sm text-gray-500 mb-2">根据错题轨迹自动生成</p>
                <span className="text-xs text-gray-400">已完成 {studyPlan.completedTasks}/{studyPlan.totalTasks} 项｜距离考试 {studyPlan.daysLeft} 天</span>
              </div>
            </div>
            <PrimaryButton className="mt-4" onClick={() => navigate('/study-plan')}>
              查看计划
            </PrimaryButton>
          </AppCard>

          <AppCard className="p-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">待完善错题 3 道</h3>
                <p className="text-sm text-gray-500 mb-2">AI 已识别题目和答案，等待你确认知识点、错误类型和复习安排</p>
                <span className="text-xs text-gray-400">待确认 3 题｜今日新增 1 题</span>
              </div>
            </div>
            <PrimaryButton className="mt-4" onClick={() => navigate('/mistakes?filter=incomplete')}>
              继续完善
            </PrimaryButton>
          </AppCard>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
