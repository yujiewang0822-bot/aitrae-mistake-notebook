import { Image, AlertTriangle, CheckCircle } from 'lucide-react'
import AppCard from '../ui/AppCard'
import StatusTag from '../ui/StatusTag'

type QuestionStatus = 'idle' | 'selected' | 'error'

interface QuestionCardProps {
  questionNumber?: number
  questionText?: string
  imagePlaceholder?: boolean
  selected?: boolean
  status?: QuestionStatus
  statusText?: string
  onClick?: () => void
  className?: string
}

export default function QuestionCard({
  questionNumber,
  questionText,
  imagePlaceholder = false,
  selected = false,
  status = 'idle',
  statusText,
  onClick,
  className = ''
}: QuestionCardProps) {
  const borderClass = {
    idle: 'border-gray-200',
    selected: 'border-primary-500 border-2',
    error: 'border-red-500 border-2'
  }

  const bgClass = {
    idle: 'bg-white',
    selected: 'bg-primary-50',
    error: 'bg-red-50'
  }

  return (
    <AppCard 
      className={`transition-all hover:shadow-md ${borderClass[status]} ${bgClass[status]} ${className}`}
    >
      <div onClick={onClick} className="space-y-3">
        <div className="flex items-start gap-3">
          {questionNumber !== undefined && (
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
              ${status === 'selected' ? 'bg-primary-600 text-white' : 
                status === 'error' ? 'bg-red-600 text-white' : 
                'bg-gray-100 text-gray-700'}
            `}>
              {questionNumber}
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            {questionText && (
              <p className="text-sm text-gray-900 line-clamp-3">
                {questionText}
              </p>
            )}
            
            {imagePlaceholder && (
              <div className="mt-3 flex items-center justify-center bg-gray-50 rounded-lg h-32">
                <div className="text-center text-gray-400">
                  <Image className="w-8 h-8 mx-auto mb-1" />
                  <span className="text-xs">题目图片</span>
                </div>
              </div>
            )}
          </div>

          {selected && (
            <div className="flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-primary-600" />
            </div>
          )}
        </div>

        {status !== 'idle' && statusText && (
          <div className="flex items-center justify-end">
            <StatusTag type={status === 'error' ? 'error' : 'success'}>
              {statusText}
            </StatusTag>
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-center gap-2 text-xs text-red-600">
            <AlertTriangle className="w-4 h-4" />
            <span>识别异常，请重新选择</span>
          </div>
        )}
      </div>
    </AppCard>
  )
}
