import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RefreshCw, CheckSquare, Square } from 'lucide-react'
import Header from '../components/layout/Header'
import AppCard from '../components/ui/AppCard'
import PrimaryButton from '../components/ui/PrimaryButton'
import SecondaryButton from '../components/ui/SecondaryButton'
import Modal from '../components/ui/Modal'
import Toast from '../components/ui/Toast'

interface Question {
  id: number
  title: string
  status: 'idle' | 'selected' | 'error'
  type: string
  confidence: '高' | '中' | '低'
}

const mockQuestions: Question[] = [
  { id: 1, title: '解方程 3x - 5 = 10', status: 'selected', type: '方程', confidence: '高' },
  { id: 2, title: '二次函数顶点坐标判断', status: 'selected', type: '函数', confidence: '高' },
  { id: 3, title: '几何辅助线证明', status: 'idle', type: '几何', confidence: '中' },
  { id: 4, title: '分式方程化简', status: 'idle', type: '方程', confidence: '高' },
  { id: 5, title: '一次函数图像识别', status: 'selected', type: '函数', confidence: '中' },
  { id: 6, title: '不等式组求解', status: 'idle', type: '方程', confidence: '高' },
  { id: 7, title: '概率事件判断', status: 'idle', type: '概率', confidence: '中' },
  { id: 8, title: '圆的切线证明', status: 'idle', type: '几何', confidence: '低' },
  { id: 9, title: '三角函数求值', status: 'selected', type: '函数', confidence: '高' },
  { id: 10, title: '数列规律填空', status: 'idle', type: '数列', confidence: '中' },
]

export default function SelectQuestionPage() {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState<Question[]>(mockQuestions)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [showManualSelectModal, setShowManualSelectModal] = useState(false)

  const selectedCount = questions.filter(q => q.status === 'selected').length
  const validQuestions = questions.filter(q => q.status !== 'error')
  const allSelected = validQuestions.length > 0 && validQuestions.every(q => q.status === 'selected')

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

  const handleSelectAll = () => {
    const newStatus = allSelected ? 'idle' : 'selected'
    setQuestions(prev => prev.map(q => 
      q.status !== 'error' ? { ...q, status: newStatus } : q
    ))
  }

  const handleManualSelect = () => {
    setShowManualSelectModal(true)
  }

  const handleCloseManualSelectModal = () => {
    setShowManualSelectModal(false)
  }

  const handleRetakePhoto = () => {
    setShowManualSelectModal(false)
    navigate('/upload')
  }

  const handleConfirm = () => {
    if (selectedCount > 0) {
      const selectedQuestions = questions.filter(q => q.status === 'selected')
      sessionStorage.setItem('selectedQuestions', JSON.stringify(selectedQuestions))
      sessionStorage.setItem('selectedCount', String(selectedCount))
      navigate(`/analyze?count=${selectedCount}`)
    } else {
      setToastMessage('请至少选择一道题')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
    }
  }

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case '高': return 'text-green-600 bg-green-50'
      case '中': return 'text-yellow-600 bg-yellow-50'
      case '低': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
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
            <button
              type="button"
              onClick={handleSelectAll}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
            >
              {allSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
              <span>{allSelected ? '取消全选' : '全选'}</span>
            </button>
          </div>
          <p className="text-blue-600 text-xs mt-2">请勾选需要加入错题本的题目</p>
          <p className="text-blue-500 text-xs mt-1">如果 AI 识别不完整，可以重新拍照或手动框选。</p>
        </AppCard>

        <div className="space-y-3 mt-4">
          {questions.map(question => (
            <div
              key={question.id}
              className={`p-4 bg-white rounded-xl border-2 transition-all cursor-pointer ${
                question.status === 'selected' 
                  ? 'border-primary-500 shadow-sm' 
                  : question.status === 'error'
                    ? 'border-red-200 bg-red-50'
                    : 'border-gray-100 hover:border-gray-200'
              }`}
              onClick={() => handleQuestionClick(question.id)}
            >
              {question.status === 'error' ? (
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xs font-bold">!</span>
                  <span className="text-red-600 text-sm">{question.title}</span>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    question.status === 'selected' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {question.status === 'selected' ? '✓' : question.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 text-sm font-medium mb-2">{question.title}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-600">已识别</span>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">{question.type}</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${getConfidenceColor(question.confidence)}`}>
                        {question.confidence}可信度
                      </span>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                    question.status === 'selected' ? 'border-primary-500 bg-primary-500' : 'border-gray-300'
                  }`}>
                    {question.status === 'selected' && <span className="text-white text-xs">✓</span>}
                  </div>
                </div>
              )}
            </div>
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

      <Modal
        open={showManualSelectModal}
        title="手动框选功能建设中"
        onConfirm={handleRetakePhoto}
        onCancel={handleCloseManualSelectModal}
        confirmText="重新拍照"
        cancelText="我知道了"
      >
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            当前已支持 AI 自动识别题目。后续将支持手动框选题目区域，适用于 AI 漏识别、一页多题识别不完整或题目边界不清晰的情况。
          </p>
        </div>
      </Modal>
    </div>
  )
}
