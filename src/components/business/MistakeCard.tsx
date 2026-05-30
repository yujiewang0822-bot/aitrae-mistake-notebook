import { AlertCircle, XCircle, Clock, Tag as TagIcon } from 'lucide-react'
import AppCard from '../ui/AppCard'
import StatusTag from '../ui/StatusTag'
import type { Mistake } from '../../types'

interface MistakeCardProps {
  mistake: Mistake
  onClick?: () => void
  className?: string
}

export default function MistakeCard({ mistake, onClick, className = '' }: MistakeCardProps) {
  const statusMap = {
    pending: { type: 'warning' as const, text: '待复习' },
    reviewing: { type: 'ai' as const, text: '复习中' },
    mastered: { type: 'success' as const, text: '已掌握' }
  }

  const errorTypeIcon = mistake.errorType.includes('概念') || mistake.errorType.includes('理解') ? (
    <AlertCircle className="w-4 h-4 text-amber-500" />
  ) : (
    <XCircle className="w-4 h-4 text-red-500" />
  )

  return (
    <AppCard className={`cursor-pointer transition-all hover:shadow-md ${className}`}>
      <div onClick={onClick} className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-medium text-gray-900 line-clamp-2 mb-2">
              {mistake.questionText}
            </h3>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="font-medium text-primary-600">{mistake.subject}</span>
              <span>{mistake.grade}</span>
            </div>
          </div>
          <StatusTag type={statusMap[mistake.status].type} className="ml-2 flex-shrink-0">
            {statusMap[mistake.status].text}
          </StatusTag>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            {errorTypeIcon}
            <span>{mistake.errorType}</span>
          </div>
          <div className="flex items-center gap-1">
            <TagIcon className="w-3.5 h-3.5" />
            <span className="truncate max-w-[120px]">{mistake.knowledgePoint}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            <span>最近复习：{mistake.lastReviewTime}</span>
          </div>
          {mistake.wrongCount > 0 && (
            <span className="text-xs text-red-500 font-medium">
              已错{mistake.wrongCount}次
            </span>
          )}
        </div>

        {mistake.tags && mistake.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {mistake.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </AppCard>
  )
}
