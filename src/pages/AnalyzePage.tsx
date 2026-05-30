import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pencil, Sparkles, CheckCircle2 } from 'lucide-react'
import Header from '../components/layout/Header'
import AppCard from '../components/ui/AppCard'
import StatusTag from '../components/ui/StatusTag'
import PrimaryButton from '../components/ui/PrimaryButton'
import SecondaryButton from '../components/ui/SecondaryButton'
import Modal from '../components/ui/Modal'
import Toast from '../components/ui/Toast'

export default function AnalyzePage() {
  const navigate = useNavigate()
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [showModifyModal, setShowModifyModal] = useState(false)
  const [showDiscardModal, setShowDiscardModal] = useState(false)
  const [judgmentResult, setJudgmentResult] = useState<'正确' | '错误' | '无法判断'>('错误')

  const currentQuestion = 1
  const totalQuestions = 4
  const progress = Math.round((currentQuestion / totalQuestions) * 100)

  const handleSaveDraft = () => {
    setToastMessage('已暂时保存')
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      navigate('/home')
    }, 1500)
  }

  const handleEditQuestion = () => {
    setToastMessage('OCR编辑功能建设中')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const handleEditAnswer = () => {
    setToastMessage('答案编辑功能建设中')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const handleModifyJudgment = () => {
    setShowModifyModal(true)
  }

  const handleConfirmModify = () => {
    setShowModifyModal(false)
    setToastMessage('判题结果已更新')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const handleDiscard = () => {
    setShowDiscardModal(true)
  }

  const handleConfirmDiscard = () => {
    setShowDiscardModal(false)
    navigate('/home')
  }

  const handleAddToMistakes = () => {
    navigate('/save-mistake')
  }

  return (
    <div className="min-h-screen bg-[#F6F8FB] flex flex-col">
      <Header
        title={`第${currentQuestion}题 / 共${totalQuestions}题`}
        showBack
        rightAction={<span onClick={handleSaveDraft} className="text-gray-600 text-sm font-medium">暂存</span>}
      />

      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>正在处理第{currentQuestion}题，共{totalQuestions}题</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary-600 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex-1 px-4 py-4 overflow-y-auto">
        <AppCard className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900 font-semibold">题目（OCR识别）</h3>
            <button 
              type="button"
              onClick={handleEditQuestion} 
              className="flex items-center gap-1 text-gray-400 hover:text-gray-600 active:text-gray-700 active:scale-95 transition-all cursor-pointer"
            >
              <Pencil className="w-4 h-4" />
              <span className="text-xs">编辑</span>
            </button>
          </div>
          <p className="text-gray-800 leading-relaxed">解方程：3x - 5 = 10，求 x 的值。</p>
        </AppCard>

        <AppCard className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900 font-semibold">我的答案（OCR识别）</h3>
            <button 
              type="button"
              onClick={handleEditAnswer} 
              className="flex items-center gap-1 text-gray-400 hover:text-gray-600 active:text-gray-700 active:scale-95 transition-all cursor-pointer"
            >
              <Pencil className="w-4 h-4" />
              <span className="text-xs">编辑</span>
            </button>
          </div>
          <p className="text-gray-800 font-mono text-lg">x = 3</p>
        </AppCard>

        <AppCard className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900 font-semibold">AI判定结果</h3>
            <button onClick={handleModifyJudgment} className="flex items-center gap-1 text-primary-600 hover:text-primary-700 transition-colors">
              <Pencil className="w-4 h-4" />
              <span className="text-xs">修改</span>
            </button>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <StatusTag type="error">错误</StatusTag>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">我的答案：</span>
              <span className="text-red-600 font-mono">{judgmentResult === '正确' ? 'x = 5' : 'x = 3'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">正确答案：</span>
              <span className="text-green-600 font-mono font-semibold">x = 5</span>
            </div>
          </div>
        </AppCard>

        <AppCard className="bg-purple-50 border-purple-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-purple-600" />
            </div>
            <h3 className="text-gray-900 font-semibold">AI归因分析</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-gray-500 text-xs mb-1">错误类型</p>
              <StatusTag type="error">计算错误</StatusTag>
            </div>
            
            <div>
              <p className="text-gray-500 text-xs mb-1">错误原因</p>
              <p className="text-gray-800 text-sm">你在移项时遗漏了负号，导致结果计算错误</p>
            </div>
            
            <div>
              <p className="text-gray-500 text-xs mb-1">关联知识点</p>
              <StatusTag type="ai">一元一次方程移项</StatusTag>
            </div>
            
            <div>
              <p className="text-gray-500 text-xs mb-1">历史提醒</p>
              <div className="flex items-center gap-2">
                <StatusTag type="warning">近7天重复出现</StatusTag>
                <span className="text-gray-400 text-xs">该错误近7天出现2次</span>
              </div>
            </div>
          </div>
        </AppCard>
      </div>

      <div className="px-4 py-4 pb-[max(env(safe-area-inset-bottom),20px)] bg-white border-t border-gray-100">
        <div className="flex gap-3">
          <div className="flex-1">
            <SecondaryButton className="w-full" onClick={handleDiscard}>
              不加入错题本
            </SecondaryButton>
          </div>
          <div className="flex-1">
            <SecondaryButton className="w-full" onClick={handleSaveDraft}>
              暂时保存
            </SecondaryButton>
          </div>
          <div className="flex-1">
            <PrimaryButton className="w-full" onClick={handleAddToMistakes}>
              加入错题本
            </PrimaryButton>
          </div>
        </div>
      </div>

      <Modal
        open={showModifyModal}
        title="修改判题结果"
        onConfirm={handleConfirmModify}
        confirmText="确认"
        cancelText="取消"
      >
        <div className="space-y-3">
          <button
            onClick={() => setJudgmentResult('正确')}
            className={`w-full h-12 rounded-xl flex items-center justify-center gap-2 transition-colors ${
              judgmentResult === '正确' ? 'bg-green-50 text-green-700 border-2 border-green-500' : 'bg-gray-50 text-gray-700 border-2 border-transparent'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>正确</span>
          </button>
          <button
            onClick={() => setJudgmentResult('错误')}
            className={`w-full h-12 rounded-xl flex items-center justify-center gap-2 transition-colors ${
              judgmentResult === '错误' ? 'bg-red-50 text-red-700 border-2 border-red-500' : 'bg-gray-50 text-gray-700 border-2 border-transparent'
            }`}
          >
            <span>错误</span>
          </button>
          <button
            onClick={() => setJudgmentResult('无法判断')}
            className={`w-full h-12 rounded-xl flex items-center justify-center gap-2 transition-colors ${
              judgmentResult === '无法判断' ? 'bg-yellow-50 text-yellow-700 border-2 border-yellow-500' : 'bg-gray-50 text-gray-700 border-2 border-transparent'
            }`}
          >
            <span>无法判断</span>
          </button>
        </div>
      </Modal>

      <Modal
        open={showDiscardModal}
        title="确定不保存这道题吗？"
        onConfirm={handleConfirmDiscard}
        confirmText="不保存"
        cancelText="继续保存"
      >
        <p className="text-gray-600 text-sm">保存后可以用于后续复习和举一反三练习。</p>
      </Modal>

      <Toast message={toastMessage} visible={showToast} />
    </div>
  )
}
