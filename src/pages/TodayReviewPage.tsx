import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Info, CalendarDays, CheckCircle, BookOpen, ChevronRight, Target } from 'lucide-react'
import Header from '../components/layout/Header'
import AppCard from '../components/ui/AppCard'
import StatusTag from '../components/ui/StatusTag'
import PrimaryButton from '../components/ui/PrimaryButton'
import SecondaryButton from '../components/ui/SecondaryButton'
import Modal from '../components/ui/Modal'
import Toast from '../components/ui/Toast'

type ReviewMode = 'quick' | 'recall' | 'redo' | 'similar'

interface ReviewTask {
  taskId: string
  id: number
  question: string
  knowledgePoint: string
  errorType: string
  reason: string
  reviewMode: ReviewMode
}

const REVIEW_MODE_TEXT: Record<ReviewMode, string> = {
  quick: '快速回看',
  recall: '遮答案回忆',
  redo: '重新作答',
  similar: '举一反三'
}

const REVIEW_MODE_DESCRIPTION: Record<ReviewMode, string> = {
  quick: '适合已经基本掌握，但需要短暂确认的错题',
  recall: '适合需要确认思路是否还记得的错题',
  redo: '适合上次未掌握或容易重复出错的错题',
  similar: '适合验证是否能迁移到同类题的错题'
}

const REVIEW_MODE_ACTION_TEXT: Record<ReviewMode, string> = {
  quick: '快速回看',
  recall: '开始回忆',
  redo: '重新作答',
  similar: '举一反三'
}

const STORAGE_KEY = 'todayReviewCompletedTaskIds'

export default function TodayReviewPage() {
  const navigate = useNavigate()
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [showToast, setToastMessage] = useState(false)
  const [toastMessage, setToastMessageContent] = useState('')
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([])

  const reviewTasks: ReviewTask[] = [
    {
      taskId: 'task-1',
      id: 1,
      question: '解方程 3x - 5 = 10',
      knowledgePoint: '一元一次方程',
      errorType: '计算错误',
      reason: '近7天重复出现',
      reviewMode: 'quick'
    },
    {
      taskId: 'task-2',
      id: 2,
      question: '二次函数顶点坐标判断',
      knowledgePoint: '二次函数',
      errorType: '概念理解错误',
      reason: '上次复习未掌握',
      reviewMode: 'recall'
    },
    {
      taskId: 'task-3',
      id: 3,
      question: '几何辅助线证明',
      knowledgePoint: '三角形全等',
      errorType: '思路遗漏',
      reason: '已到复习间隔',
      reviewMode: 'redo'
    },
    {
      taskId: 'task-4',
      id: 4,
      question: '分式方程增根判断',
      knowledgePoint: '分式方程',
      errorType: '步骤遗漏',
      reason: '3天后复习节点',
      reviewMode: 'similar'
    },
    {
      taskId: 'task-5',
      id: 5,
      question: '概率基础计算',
      knowledgePoint: '概率',
      errorType: '审题错误',
      reason: '首次复习',
      reviewMode: 'quick'
    }
  ]

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setCompletedTaskIds(parsed)
        }
      } catch (e) {
        console.error('Failed to parse completed tasks:', e)
      }
    }
  }, [])

  const getTaskStatus = (taskId: string) => {
    return completedTaskIds.includes(taskId) ? 'completed' : 'pending'
  }

  const priorityCount = reviewTasks.filter(t => getTaskStatus(t.taskId) !== 'completed' && (t.reviewMode === 'redo' || t.reviewMode === 'similar')).length
  const quickCount = reviewTasks.filter(t => getTaskStatus(t.taskId) !== 'completed' && (t.reviewMode === 'quick')).length
  const totalCount = reviewTasks.length

  const handleBack = () => {
    navigate('/home')
  }

  const handleViewInfo = () => {
    setShowInfoModal(true)
  }

  const getFirstPendingTask = () => {
    const modePriority: ReviewMode[] = ['redo', 'similar', 'recall', 'quick']
    
    for (const mode of modePriority) {
      const task = reviewTasks.find(t => getTaskStatus(t.taskId) !== 'completed' && t.reviewMode === mode)
      if (task) return task
    }
    return null
  }

  const handleStartPriorityReview = () => {
    const firstTask = getFirstPendingTask()
    
    if (!firstTask) {
      setToastMessageContent('暂无需要优先复习的错题')
      setToastMessage(true)
      setTimeout(() => setToastMessage(false), 2000)
      return
    }
    
    const { reviewMode, taskId } = firstTask
    
    if (reviewMode === 'quick' || reviewMode === 'recall') {
      navigate(`/mistake/1?from=today-review&mode=${reviewMode}&taskId=${taskId}`)
    } else {
      navigate(`/practice/1?from=today-review&mode=${reviewMode}&taskId=${taskId}`)
    }
  }

  const handleTaskClick = (task: ReviewTask) => {
    const status = getTaskStatus(task.taskId)
    if (status === 'completed') {
      navigate(`/mistake/1?from=today-review&mode=quick&taskId=${task.taskId}`)
      return
    }
    
    const { reviewMode, taskId } = task
    if (reviewMode === 'quick' || reviewMode === 'recall') {
      navigate(`/mistake/1?from=today-review&mode=${reviewMode}&taskId=${taskId}`)
    } else {
      navigate(`/practice/1?from=today-review&mode=${reviewMode}&taskId=${taskId}`)
    }
  }

  const getStatusTag = (task: ReviewTask) => {
    const status = getTaskStatus(task.taskId)
    if (status === 'completed') {
      return <StatusTag type="success">已回顾</StatusTag>
    }
    if (task.reviewMode === 'redo' || task.reviewMode === 'similar') {
      return <StatusTag type="error">建议优先</StatusTag>
    }
    if (task.reviewMode === 'recall') {
      return <StatusTag type="warning">需动手</StatusTag>
    }
    return <StatusTag type="default">可回看</StatusTag>
  }

  return (
    <div className="min-h-screen bg-[#F6F8FB] flex flex-col">
      <Header
        title="推荐复习"
        showBack
        rightAction={
          <button
            type="button"
            onClick={handleViewInfo}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Info className="w-5 h-5 text-gray-600" />
          </button>
        }
      />

      <div className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="text-center mb-4">
          <p className="text-gray-500 text-sm">根据你的错题状态，推荐今天可以优先回看的内容</p>
        </div>

        <AppCard className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <CalendarDays className="w-5 h-5 text-primary-600" />
            <span className="text-gray-900 font-semibold">今日推荐复习</span>
          </div>
          <p className="text-gray-600 text-sm mb-4">系统根据待复习状态、掌握度和最近练习表现，推荐你优先回看这些错题。</p>
          
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-1">推荐复习</p>
              <p className="text-gray-800 font-bold">{totalCount}题</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-1">重点关注</p>
              <p className="text-orange-500 font-bold">{priorityCount}题</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-1">快速回看</p>
              <p className="text-blue-600 font-bold">{quickCount}题</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-1">建议用时</p>
              <p className="text-primary-600 font-bold">20分钟</p>
            </div>
          </div>
        </AppCard>

        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-4">
          <div className="flex items-start gap-2">
            <Target className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-blue-700 text-sm font-medium mb-1">推荐依据</p>
              <p className="text-blue-600 text-xs">待复习状态、重复错误次数、掌握度、最近练习正确率</p>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <h3 className="text-gray-900 font-semibold flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary-600" />
            推荐复习列表
          </h3>
        </div>

        <div className="space-y-3">
          {reviewTasks.map(task => {
            const status = getTaskStatus(task.taskId)
            return (
              <button
                key={task.taskId}
                type="button"
                onClick={() => handleTaskClick(task)}
                className="w-full text-left hover:opacity-90 transition-opacity"
              >
                <AppCard className={status === 'completed' ? 'opacity-70' : 'hover:shadow-md transition-shadow'}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium mb-1">{task.question}</p>
                      <div className="flex flex-wrap gap-2">
                        <StatusTag type="ai">{task.knowledgePoint}</StatusTag>
                        <StatusTag type="error">{task.errorType}</StatusTag>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {status === 'completed' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <BookOpen className="w-5 h-5 text-gray-400" />
                      )}
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-gray-500 text-xs">复习方式：</span>
                    <StatusTag type={task.reviewMode === 'redo' || task.reviewMode === 'similar' ? 'warning' : 'default'}>
                      {REVIEW_MODE_TEXT[task.reviewMode]}
                    </StatusTag>
                    <span className="text-gray-400 text-xs">{REVIEW_MODE_DESCRIPTION[task.reviewMode]}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-gray-500 text-xs">复习原因：</span>
                    <span className="text-gray-600 text-sm">{task.reason}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      {getStatusTag(task)}
                    </div>
                    {status === 'completed' ? (
                      <span className="text-gray-400 text-sm font-medium">
                        查看回顾 →
                      </span>
                    ) : (
                      <span className="text-primary-600 text-sm font-medium">
                        {REVIEW_MODE_ACTION_TEXT[task.reviewMode]} →
                      </span>
                    )}
                  </div>
                </AppCard>
              </button>
            )
          })}
        </div>
      </div>

      <div className="px-4 py-4 pb-[max(env(safe-area-inset-bottom),20px)] bg-white border-t border-gray-100">
        <div className="flex gap-3">
          <div className="flex-1">
            <SecondaryButton className="w-full" onClick={handleBack}>
              返回首页
            </SecondaryButton>
          </div>
          <div className="flex-1">
            <PrimaryButton className="w-full" onClick={handleStartPriorityReview}>
              开始优先复习
            </PrimaryButton>
          </div>
        </div>
      </div>

      <Modal
        open={showInfoModal}
        title="推荐复习说明"
        confirmText="我知道了"
        onCancel={() => setShowInfoModal(false)}
      >
        <p className="text-gray-600 text-sm">
          系统会根据错题掌握状态、错误频率和上次复习时间，推荐今天可以优先回看的内容。
        </p>
      </Modal>

      <Toast message={toastMessage} visible={showToast} />
    </div>
  )
}