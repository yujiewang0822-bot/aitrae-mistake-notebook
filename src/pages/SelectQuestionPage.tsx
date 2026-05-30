import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RefreshCw } from 'lucide-react'
import Header from '../components/layout/Header'
import AppCard from '../components/ui/AppCard'
import QuestionCard from '../components/business/QuestionCard'
import PrimaryButton from '../components/ui/PrimaryButton'
import SecondaryButton from '../components/ui/SecondaryButton'
import Toast from '../components/ui/Toast'

interface Question {
  id: number
  title: string
  status: 'idle' | 'selected' | 'error'
}

const mockQuestions: Question[] = [
  { id: 1, title: '一元一次方程计算题', status: 'selected' },
  { id: 2, title: '几何图形证明题', status: 'selected' },
  { id: 3, title: '二元一次方程组求解', status: 'idle' },
  { id: 4, title: '不等式应用问题', status: 'selected' },
  { id: 5, title: '题目区域可能重叠，请调整', status: 'error' },
  { id: 6, title: '函数图像分析题', status: 'selected' },
]

export default function SelectQuestionPage() {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState<Question[]>(mockQuestions)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const selectedCount = questions.filter(q => q.status === 'selected').length

  const handleRefresh = () => {
    setToastMessage('已重新识别题目区域')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const handleQuestionClick = (id: number) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === id && q.status !== 'error') {
        return { ...q, status: q.status === 'selected' ? 'idle' : 'selected' }
      }
      return q
    }))
  }

  const handleManualSelect = () => {
    setToastMessage('手动框选功能建设中')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const handleConfirm = () => {
    if (selectedCount > 0) {
      navigate('/analyze')
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F8FB] flex flex-col">
      <Header
        title="选择题目"
        showBack
        rightAction={<RefreshCw className="w-5 h-5 text-gray-600" onClick={handleRefresh} />}
      />

      <div className="flex-1 px-4 py-4 overflow-y-auto">
        <AppCard className="bg-blue-50 border-blue-100">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="text-blue-700">已识别 <strong>{questions.length}</strong> 道题</span>
              <span className="text-blue-700">已选择 <strong>{selectedCount}</strong> 道</span>
            </div>
          </div>
          <p className="text-blue-600 text-xs mt-2">请勾选需要加入错题本的题目</p>
        </AppCard>

        <div className="space-y-3 mt-4">
          {questions.map(question => (
            <QuestionCard
              key={question.id}
              questionNumber={question.id}
              questionText={question.status === 'error' ? undefined : question.title}
              imagePlaceholder={question.status !== 'error'}
              selected={question.status === 'selected'}
              status={question.status}
              statusText={question.status === 'error' ? '识别异常' : question.status === 'selected' ? '已选择' : undefined}
              onClick={() => handleQuestionClick(question.id)}
            />
          ))}
        </div>
      </div>

      <div className="px-4 py-4 pb-[max(env(safe-area-inset-bottom),20px)] bg-white border-t border-gray-100">
        <div className="flex gap-3">
          <div className="flex-1">
            <SecondaryButton className="w-full" onClick={handleManualSelect}>
              手动框选
            </SecondaryButton>
          </div>
          <div className="flex-1">
            <PrimaryButton 
              className="w-full" 
              onClick={handleConfirm}
              disabled={selectedCount === 0}
            >
              确认选择 ({selectedCount})
            </PrimaryButton>
          </div>
        </div>
      </div>

      <Toast message={toastMessage} visible={showToast} />
    </div>
  )
}
