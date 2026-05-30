import { Target, Brain, Clock, CheckCircle, Circle, PlayCircle } from 'lucide-react'
import AppCard from '../ui/AppCard'
import StatusTag from '../ui/StatusTag'
import type { StudyPlanTask } from '../../types'

interface StudyPlanCardProps {
  task: StudyPlanTask
  onClick?: () => void
  className?: string
}

export default function StudyPlanCard({ task, onClick, className = '' }: StudyPlanCardProps) {
  const statusConfig = {
    pending: {
      icon: Circle,
      iconClass: 'text-gray-400',
      tagType: 'default' as const,
      tagText: '未开始',
      bgClass: 'bg-gray-50',
      textClass: 'text-gray-700'
    },
    'in-progress': {
      icon: PlayCircle,
      iconClass: 'text-primary-500',
      tagType: 'ai' as const,
      tagText: '进行中',
      bgClass: 'bg-primary-50',
      textClass: 'text-primary-700'
    },
    completed: {
      icon: CheckCircle,
      iconClass: 'text-green-500',
      tagType: 'success' as const,
      tagText: '已完成',
      bgClass: 'bg-green-50',
      textClass: 'text-green-700'
    }
  }

  const config = statusConfig[task.status]
  const StatusIcon = config.icon

  return (
    <AppCard className={`cursor-pointer transition-all hover:shadow-md ${className}`}>
      <div onClick={onClick} className="space-y-3">
        <div className="flex items-start gap-3">
          <div className={`mt-1 ${task.status === 'completed' ? 'opacity-50' : ''}`}>
            <StatusIcon className={`w-5 h-5 ${config.iconClass}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-base font-semibold text-gray-900 flex-1">
                {task.title}
              </h3>
              <StatusTag type={config.tagType} className="ml-2 flex-shrink-0">
                {config.tagText}
              </StatusTag>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">
              {task.description}
            </p>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`px-2 py-0.5 text-xs font-medium rounded ${config.bgClass} ${config.textClass}`}>
                {task.subject}
              </span>
              <span className="px-2 py-0.5 text-xs text-gray-500 bg-gray-100 rounded">
                {task.chapter}
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3.5 h-3.5" />
              <span>截止日期：{task.dueDate}</span>
            </div>
          </div>
        </div>

        {task.status === 'pending' && (
          <div className="flex items-center justify-end pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1 text-xs text-primary-600 font-medium">
              <Brain className="w-3.5 h-3.5" />
              <span>开始学习</span>
            </div>
          </div>
        )}

        {task.status === 'in-progress' && (
          <div className="flex items-center justify-end pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1 text-xs text-primary-600 font-medium">
              <Target className="w-3.5 h-3.5" />
              <span>继续学习</span>
            </div>
          </div>
        )}

        {task.status === 'completed' && (
          <div className="flex items-center justify-end pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>查看详情</span>
            </div>
          </div>
        )}
      </div>
    </AppCard>
  )
}
