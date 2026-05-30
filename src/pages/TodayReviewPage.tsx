import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Info, CalendarDays, CheckCircle, AlertCircle, BookOpen, ChevronRight } from 'lucide-react'
import Header from '../components/layout/Header'
import AppCard from '../components/ui/AppCard'
import StatusTag from '../components/ui/StatusTag'
import PrimaryButton from '../components/ui/PrimaryButton'
import SecondaryButton from '../components/ui/SecondaryButton'
import Modal from '../components/ui/Modal'

interface ReviewTask {
  id: number
  question: string
  knowledgePoint: string
  errorType: string
  reason: string
  status: 'pending' | 'focus' | 'completed'
}

export default function TodayReviewPage() {
  const navigate = useNavigate()
  const [showInfoModal, setShowInfoModal] = useState(false)

  const reviewTasks: ReviewTask[] = [
    {
      id: 1,
      question: '解方程 3x - 5 = 10',
      knowledgePoint: '一元一次方程',
      errorType: '计算错误',
      reason: '近7天重复出现',
      status: 'pending'
    },
    {
      id: 2,
      question: '二次函数顶点坐标判断',
      knowledgePoint: '二次函数',
      errorType: '概念理解错误',
      reason: '上次复习未掌握',
      status: 'focus'
    },
    {
      id: 3,
      question: '几何辅助线证明',
      knowledgePoint: '三角形全等',
      errorType: '思路遗漏',
      reason: '已到复习间隔',
      status: 'pending'
    },
    {
      id: 4,
      question: '分式方程增根判断',
      knowledgePoint: '分式方程',
      errorType: '步骤遗漏',
      reason: '3天后复习节点',
      status: 'completed'
    },
    {
      id: 5,
      question: '概率基础计算',
      knowledgePoint: '概率',
      errorType: '审题错误',
      reason: '首次复习',
      status: 'completed'
    }
  ]

  const completedCount = reviewTasks.filter(t => t.status === 'completed').length
  const pendingCount = reviewTasks.filter(t => t.status !== 'completed').length
  const totalCount = reviewTasks.length
  const completionRate = Math.round((completedCount / totalCount) * 100)

  const handleBack = () => {
    navigate('/home')
  }

  const handleViewInfo = () => {
    setShowInfoModal(true)
  }

  const handleStartReview = () => {
    navigate('/mistake/1')
  }

  const handleTaskClick = () => {
    navigate('/mistake/1')
  }

  return (
    <div className="min-h-screen bg-[#F6F8FB] flex flex-col">
      <Header
        title="今日复习"
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
        <AppCard className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary-600" />
              <span className="text-gray-900 font-semibold">今日任务概览</span>
            </div>
            <span className="text-primary-600 font-bold text-xl">{completionRate}%</span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-1">今日需复习</p>
              <p className="text-gray-800 font-bold text-xl">{totalCount} 题</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-1">已完成</p>
              <p className="text-green-600 font-bold text-xl">{completedCount} 题</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-1">剩余</p>
              <p className="text-orange-500 font-bold text-xl">{pendingCount} 题</p>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all" 
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </AppCard>

        <div className="space-y-3">
          {reviewTasks.map(task => (
            <button
              key={task.id}
              type="button"
              onClick={handleTaskClick}
              className="w-full text-left"
            >
              <AppCard className="hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium mb-1">{task.question}</p>
                    <div className="flex flex-wrap gap-2">
                      <StatusTag type="ai">{task.knowledgePoint}</StatusTag>
                      <StatusTag type="error">{task.errorType}</StatusTag>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {task.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : task.status === 'focus' ? (
                      <AlertCircle className="w-5 h-5 text-orange-500" />
                    ) : (
                      <BookOpen className="w-5 h-5 text-gray-400" />
                    )}
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-xs">复习原因：</span>
                  <span className="text-gray-600 text-sm">{task.reason}</span>
                </div>
                <div className="mt-2">
                  {task.status === 'completed' ? (
                    <StatusTag type="success">已完成</StatusTag>
                  ) : task.status === 'focus' ? (
                    <StatusTag type="warning">需重点关注</StatusTag>
                  ) : (
                    <StatusTag type="default">待复习</StatusTag>
                  )}
                </div>
              </AppCard>
            </button>
          ))}
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
            <PrimaryButton className="w-full" onClick={handleStartReview}>
              开始复习
            </PrimaryButton>
          </div>
        </div>
      </div>

      <Modal
        open={showInfoModal}
        title="今日复习说明"
        confirmText="我知道了"
      >
        <p className="text-gray-600 text-sm">
          系统会根据错题掌握状态、错误频率和上次复习时间，推荐今天最需要复习的错题。
        </p>
      </Modal>
    </div>
  )
}
