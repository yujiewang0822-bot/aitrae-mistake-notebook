import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PenTool, Target, CheckCircle, XCircle, Lightbulb, ChevronLeft } from 'lucide-react'
import AppCard from '../components/ui/AppCard'
import StatusTag from '../components/ui/StatusTag'
import PrimaryButton from '../components/ui/PrimaryButton'
import SecondaryButton from '../components/ui/SecondaryButton'
import Modal from '../components/ui/Modal'
import Toast from '../components/ui/Toast'

export default function PracticePage() {
  const navigate = useNavigate()
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [showExitModal, setShowExitModal] = useState(false)
  const [showHintModal, setShowHintModal] = useState(false)
  const [showAnalysisModal, setShowAnalysisModal] = useState(false)
  const [userAnswer, setUserAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleBack = () => {
    navigate('/mistake/1')
  }

  const handleExit = () => {
    setShowExitModal(true)
  }

  const handleConfirmExit = () => {
    setShowExitModal(false)
    navigate('/practice')
  }

  const handleViewHint = () => {
    setShowHintModal(true)
  }

  const handleSubmit = () => {
    if (!userAnswer.trim()) {
      setToastMessage('请先输入答案')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
      return
    }
    const answer = userAnswer.trim().toLowerCase()
    if (answer === 'x = 5' || answer === '5' || answer === 'x=5') {
      setIsCorrect(true)
    } else {
      setIsCorrect(false)
    }
    setSubmitted(true)
  }

  const handleViewAnalysis = () => {
    setShowAnalysisModal(true)
  }

  const handleNext = () => {
    navigate('/practice-result')
  }

  return (
    <div className="min-h-screen bg-[#F6F8FB] flex flex-col">
      {/* 自定义顶部栏 */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <button
          type="button"
          onClick={handleBack}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-gray-900 font-medium text-lg">举一反三</h1>
        <button
          type="button"
          onClick={handleExit}
          className="px-3 py-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
        >
          退出
        </button>
      </div>

      <div className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 text-sm font-medium">练习来源</span>
          </div>
          <p className="text-blue-600 text-sm">基于错题：一元一次方程移项错误</p>
          <p className="text-blue-500 text-xs">练习目标：强化同知识点、同错误类型题目</p>
        </div>

        <AppCard className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <span className="text-gray-800 font-medium">第 <span className="text-primary-600 font-bold">1</span> / 5 题</span>
              <span className="text-gray-600 text-sm">正确 <span className="text-green-600 font-bold">0</span> 题</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary-500 h-2 rounded-full" style={{ width: '20%' }}></div>
          </div>
          <p className="text-gray-400 text-xs mt-2 text-right">进度 20%</p>
        </AppCard>

        <AppCard className="mb-4">
          <h3 className="text-gray-900 font-semibold flex items-center gap-2 mb-3">
            <PenTool className="w-4 h-4 text-primary-600" />
            练习题 1
          </h3>
          <p className="text-gray-800 text-lg leading-relaxed">解方程：2x + 4 = 14，求 x 的值。</p>
        </AppCard>

        <AppCard className="mb-4">
          <h3 className="text-gray-900 font-semibold mb-3">你的答案</h3>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="请输入你的答案，例如 x = 5"
            disabled={submitted}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-60"
          />
        </AppCard>

        {submitted && (
          <AppCard className="mb-4">
            <h3 className="text-gray-900 font-semibold mb-3">AI判题结果</h3>
            <div className="flex items-center gap-3 mb-3">
              {isCorrect ? (
                <>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <StatusTag type="success">正确</StatusTag>
                </>
              ) : (
                <>
                  <XCircle className="w-8 h-8 text-red-500" />
                  <StatusTag type="error">错误</StatusTag>
                </>
              )}
            </div>
            <p className="text-gray-700 mb-2">
              {isCorrect
                ? '很好，这次移项和计算都正确。'
                : '注意移项后要保持等式两边同时变化。'
              }
            </p>
            {!isCorrect && (
              <div className="p-3 bg-green-50 rounded-xl">
                <p className="text-gray-500 text-xs mb-1">正确答案</p>
                <p className="text-green-600 font-mono font-semibold">x = 5</p>
              </div>
            )}
          </AppCard>
        )}
      </div>

      <div className="px-4 py-4 pb-[max(env(safe-area-inset-bottom),20px)] bg-white border-t border-gray-100">
        <div className="flex gap-3">
          <div className="flex-1">
            {submitted ? (
              <SecondaryButton className="w-full" onClick={handleViewAnalysis}>
                <Lightbulb className="w-4 h-4 mr-2" />
                查看解析
              </SecondaryButton>
            ) : (
              <SecondaryButton className="w-full" onClick={handleViewHint}>
                <Lightbulb className="w-4 h-4 mr-2" />
                查看提示
              </SecondaryButton>
            )}
          </div>
          <div className="flex-1">
            {submitted ? (
              <PrimaryButton className="w-full" onClick={handleNext}>
                下一题
              </PrimaryButton>
            ) : (
              <PrimaryButton className="w-full" onClick={handleSubmit}>
                提交答案
              </PrimaryButton>
            )}
          </div>
        </div>
      </div>

      <Modal
        open={showExitModal}
        title="确定退出练习吗？"
        onConfirm={handleConfirmExit}
        confirmText="确认退出"
        cancelText="继续练习"
      >
        <p className="text-gray-600 text-sm">当前练习进度将被暂存。</p>
      </Modal>

      <Modal
        open={showHintModal}
        title="解题提示"
        confirmText="我知道了"
        onConfirm={() => setShowHintModal(false)}
        onCancel={() => setShowHintModal(false)}
      >
        <p className="text-gray-600 text-sm">当前练习题：解方程：2x + 4 = 14</p>
        <div className="space-y-2 mt-3">
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-blue-800 text-sm">
              <span className="font-semibold">提示 1：</span>先把常数项 4 移到等式右边。
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-blue-800 text-sm">
              <span className="font-semibold">提示 2：</span>移项时要注意符号变化，+4 移到右边会变成 -4。
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-blue-800 text-sm">
              <span className="font-semibold">提示 3：</span>得到 2x = 10 后，再让等式两边同时除以 2。
            </p>
          </div>
        </div>
      </Modal>

      <Modal
        open={showAnalysisModal}
        title="解题解析"
        confirmText="我知道了"
        onConfirm={() => setShowAnalysisModal(false)}
        onCancel={() => setShowAnalysisModal(false)}
      >
        <div className="space-y-2 font-mono text-gray-800 text-sm">
          <p>2x + 4 = 14</p>
          <p>2x = 14 - 4</p>
          <p>2x = 10</p>
          <p>x = 5</p>
        </div>
      </Modal>

      <Toast message={toastMessage} visible={showToast} />
    </div>
  )
}
