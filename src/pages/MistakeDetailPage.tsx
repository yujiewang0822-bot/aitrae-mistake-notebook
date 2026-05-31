import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { MoreHorizontal, Sparkles, Tags, CalendarDays, CheckCircle, PenTool, ChevronLeft, Target, Eye } from 'lucide-react'
import AppCard from '../components/ui/AppCard'
import StatusTag from '../components/ui/StatusTag'
import PrimaryButton from '../components/ui/PrimaryButton'
import SecondaryButton from '../components/ui/SecondaryButton'
import Toast from '../components/ui/Toast'

const STORAGE_KEY = 'todayReviewCompletedTaskIds'

export default function MistakeDetailPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [masteryStatus, setMasteryStatus] = useState<'需复习' | '已掌握'>('需复习')
  
  const [showRecallAnswer, setShowRecallAnswer] = useState(false)

  const from = searchParams.get('from')
  const mode = searchParams.get('mode')
  const taskId = searchParams.get('taskId')
  const isFromTodayReview = from === 'today-review'
  const isRecallMode = mode === 'recall'
  const isQuickMode = mode === 'quick'

  const markTaskCompleted = (id: string) => {
    const stored = localStorage.getItem(STORAGE_KEY)
    let completedIds: string[] = []
    if (stored) {
      try {
        completedIds = JSON.parse(stored)
      } catch (e) {
        console.error('Failed to parse:', e)
      }
    }
    if (!completedIds.includes(id)) {
      completedIds.push(id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedIds))
    }
  }

  const handleBack = () => {
    if (isFromTodayReview) {
      navigate('/today-review')
    } else {
      navigate('/mistakes')
    }
  }

  const handleMore = () => {
    setToastMessage('更多操作功能建设中')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const handleMarkMastered = () => {
    if (masteryStatus === '已掌握') {
      setToastMessage('这道题已标记为已掌握')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
      return
    }
    setMasteryStatus('已掌握')
    setToastMessage('已标记为已掌握，系统将降低复习频率')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const handlePractice = () => {
    if (isFromTodayReview && mode) {
      const targetTaskId = taskId || 'task-1'
      navigate(`/practice/1?from=today-review&mode=similar&taskId=${targetTaskId}`)
    } else {
      navigate('/practice/1')
    }
  }

  const handleViewRecallAnswer = () => {
    setShowRecallAnswer(true)
    setToastMessage('已显示答案和错因')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const handleRecallRemembered = () => {
    if (taskId) {
      markTaskCompleted(taskId)
    }
    setToastMessage('已完成本次回忆复习')
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      navigate('/today-review')
    }, 1500)
  }

  const handleRecallNotYet = () => {
    setToastMessage('已保留在待复习列表')
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      navigate('/today-review')
    }, 1500)
  }

  const handleQuickReviewed = () => {
    if (taskId) {
      markTaskCompleted(taskId)
    }
    setToastMessage('已完成本次快速回看')
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      navigate('/today-review')
    }, 1500)
  }

  const handleQuickStillNeed = () => {
    setToastMessage('已保留在待复习列表')
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      navigate('/today-review')
    }, 1500)
  }

  const getModeTitle = () => {
    if (mode === 'quick') return '快速回看'
    if (mode === 'recall') return '遮答案回忆'
    return '快速回看'
  }

  const getModeDescription = () => {
    if (mode === 'quick') return '建议先快速回顾题目、答案和错因，确认自己是否仍然掌握。'
    if (mode === 'recall') return '建议先尝试回忆解题思路，再查看答案和错因。'
    return ''
  }

  const shouldShowBottomAction = () => {
    if (isRecallMode && !showRecallAnswer) {
      return false
    }
    return true
  }

  const getBottomButtons = () => {
    if (isRecallMode && showRecallAnswer) {
      return (
        <>
          <div className="flex-1">
            <SecondaryButton className="w-full" onClick={handleRecallNotYet}>
              还没掌握
            </SecondaryButton>
          </div>
          <div className="flex-1">
            <PrimaryButton className="w-full" onClick={handleRecallRemembered}>
              我想起来了
            </PrimaryButton>
          </div>
        </>
      )
    }
    
    if (isFromTodayReview && isQuickMode) {
      return (
        <>
          <div className="flex-1">
            <SecondaryButton className="w-full" onClick={handleQuickStillNeed}>
              仍需复习
            </SecondaryButton>
          </div>
          <div className="flex-1">
            <PrimaryButton className="w-full" onClick={handleQuickReviewed}>
              已回顾
            </PrimaryButton>
          </div>
        </>
      )
    }
    
    if (isFromTodayReview && !isRecallMode && !isQuickMode) {
      return (
        <>
          <div className="flex-1">
            <SecondaryButton className="w-full" onClick={handleMarkMastered}>
              <CheckCircle className="w-4 h-4 mr-2" />
              {masteryStatus === '已掌握' ? '已掌握' : '标记已掌握'}
            </SecondaryButton>
          </div>
          <div className="flex-1">
            <PrimaryButton className="w-full" onClick={handlePractice}>
              <PenTool className="w-4 h-4 mr-2" />
              举一反三练习
            </PrimaryButton>
          </div>
        </>
      )
    }
    
    return (
      <>
        <div className="flex-1">
          <SecondaryButton className="w-full" onClick={handleMarkMastered}>
            <CheckCircle className="w-4 h-4 mr-2" />
            {masteryStatus === '已掌握' ? '已掌握' : '标记已掌握'}
          </SecondaryButton>
        </div>
        <div className="flex-1">
          <PrimaryButton className="w-full" onClick={handlePractice}>
            <PenTool className="w-4 h-4 mr-2" />
            举一反三练习
          </PrimaryButton>
        </div>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-[#F6F8FB] flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <button
          type="button"
          onClick={handleBack}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-gray-900 font-medium text-lg">错题详情</h1>
        <button
          type="button"
          onClick={handleMore}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <MoreHorizontal className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <div className="flex-1 px-4 py-4 overflow-y-auto">
        {isFromTodayReview && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 text-sm font-medium">今日复习 · {getModeTitle()}</span>
            </div>
            <p className="text-blue-600 text-sm">{getModeDescription()}</p>
          </div>
        )}

        <AppCard className="mb-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-1">学科</p>
              <p className="text-gray-800 font-medium">数学</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-1">年级</p>
              <p className="text-gray-800 font-medium">初二</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-1">难度</p>
              <StatusTag type="warning">中等</StatusTag>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-1">掌握状态</p>
              <StatusTag type={masteryStatus === '已掌握' ? 'success' : 'warning'}>
                {masteryStatus}
              </StatusTag>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-1">最近复习</p>
              <p className="text-gray-800 font-medium">今天</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-1">下次复习</p>
              <p className="text-gray-800 font-medium">明天</p>
            </div>
          </div>
        </AppCard>

        <AppCard className="mb-4">
          <h3 className="text-gray-900 font-semibold mb-3">题目</h3>
          <p className="text-gray-800">解方程：3x - 5 = 10，求 x 的值。</p>
        </AppCard>

        {isRecallMode && !showRecallAnswer ? (
          <AppCard className="mb-4">
            <div className="text-center py-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-gray-900 font-semibold mb-2">先回忆一下</h3>
              <p className="text-gray-600 text-sm mb-4">
                先尝试在脑中回忆解题思路，再查看答案和错因。
              </p>
              <PrimaryButton className="w-full" onClick={handleViewRecallAnswer}>
                查看答案和错因
              </PrimaryButton>
            </div>
          </AppCard>
        ) : (
          <>
            <AppCard className="mb-4">
              <h3 className="text-gray-900 font-semibold mb-3">答案对比</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                  <span className="text-gray-600">我的答案</span>
                  <span className="text-red-600 font-mono font-semibold">x = 3</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                  <span className="text-gray-600">正确答案</span>
                  <span className="text-green-600 font-mono font-semibold">x = 5</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">AI判定</span>
                  <StatusTag type="error">错误</StatusTag>
                </div>
              </div>
            </AppCard>

            <AppCard className="mb-4">
              <h3 className="text-gray-900 font-semibold flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-purple-600" />
                AI错因分析
              </h3>
              <div className="space-y-2">
                <div>
                  <p className="text-gray-500 text-xs mb-1">错误类型</p>
                  <StatusTag type="error">计算错误</StatusTag>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">错误原因</p>
                  <p className="text-gray-800">你在移项时遗漏了负号，导致结果计算错误</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">关联知识点</p>
                  <StatusTag type="ai">一元一次方程移项</StatusTag>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">历史提醒</p>
                  <p className="text-gray-800">该错误近7天出现2次</p>
                </div>
              </div>
            </AppCard>

            <AppCard className="mb-4">
              <h3 className="text-gray-900 font-semibold flex items-center gap-2 mb-3">
                <Tags className="w-4 h-4 text-primary-600" />
                相关知识点
              </h3>
              <div className="flex flex-wrap gap-2">
                <StatusTag type="ai">一元一次方程</StatusTag>
                <StatusTag type="ai">移项</StatusTag>
                <StatusTag type="ai">方程计算</StatusTag>
              </div>
            </AppCard>

            <AppCard className="mb-4">
              <h3 className="text-gray-900 font-semibold flex items-center gap-2 mb-3">
                <CalendarDays className="w-4 h-4 text-blue-600" />
                复习安排
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">首次复习</span>
                  <span className="text-gray-800">明天</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">第二次复习</span>
                  <span className="text-gray-800">3天后</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">第三次复习</span>
                  <span className="text-gray-800">7天后</span>
                </div>
              </div>
              <p className="text-gray-400 text-xs mt-3">系统会根据你的掌握情况自动调整复习时间。</p>
            </AppCard>
          </>
        )}
      </div>

      {shouldShowBottomAction() && (
        <div className="px-4 py-4 pb-[max(env(safe-area-inset-bottom),20px)] bg-white border-t border-gray-100">
          <div className="flex gap-3">
            {getBottomButtons()}
          </div>
        </div>
      )}

      <Toast message={toastMessage} visible={showToast} />
    </div>
  )
}
