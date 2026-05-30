import { CalendarDays, CheckCircle, Circle, Brain } from 'lucide-react'
import AppCard from '../ui/AppCard'
import StatusTag from '../ui/StatusTag'
import type { ReviewTask } from '../../types'

interface ReviewTaskCardProps {
  task: ReviewTask
  mistakeQuestion?: string
  onClick?: () => void
  className?: string
}

export default function ReviewTaskCard({ 
  task, 
  mistakeQuestion,
  onClick, 
  className = '' 
}: ReviewTaskCardProps) {
  const priorityMap = {
    high: { type: 'error' as const, text: '高优先级' },
    medium: { type: 'warning' as const, text: '中优先级' },
    low: { type: 'default' as const, text: '低优先级' }
  }

  const taskTypeMap = {
    daily: '每日复习',
    weekly: '每周复习',
    monthly: '每月复习',
    exam: '考前冲刺'
  }

  const StatusIcon = task.status === 'completed' ? CheckCircle : Circle
  const StatusIconClass = task.status === 'completed' ? 'text-green-500' : 'text-gray-400'

  return (
    <AppCard className={`cursor-pointer transition-all hover:shadow-md ${className}`}>
      <div onClick={onClick} className="space-y-3">
        <div className="flex items-start gap-3">
          <div className={`mt-1 ${task.status === 'completed' ? 'opacity-50' : ''}`}>
            <StatusIcon className={`w-5 h-5 ${StatusIconClass}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                  task.status === 'completed' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-primary-100 text-primary-700'
                }`}>
                  {taskTypeMap[task.taskType]}
                </span>
                <StatusTag type={priorityMap[task.priority].type}>
                  {priorityMap[task.priority].text}
                </StatusTag>
              </div>
            </div>
            
            {mistakeQuestion && (
              <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                {mistakeQuestion}
              </p>
            )}

            <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
              <Brain className="w-3.5 h-3.5" />
              <span>推荐原因：{task.reason}</span>
            </div>
          </div>
        </div>

        {task.status === 'pending' && (
          <div className="flex items-center justify-end pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1 text-xs text-primary-600 font-medium">
              <CalendarDays className="w-3.5 h-3.5" />
              <span>点击开始复习</span>
            </div>
          </div>
        )}

        {task.status === 'completed' && (
          <div className="flex items-center justify-end pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>已完成</span>
            </div>
          </div>
        )}
      </div>
    </AppCard>
  )
}
