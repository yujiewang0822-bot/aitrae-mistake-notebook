import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Pencil, Sparkles, CheckCircle2, Camera } from 'lucide-react'
import Header from '../components/layout/Header'
import AppCard from '../components/ui/AppCard'
import StatusTag from '../components/ui/StatusTag'
import PrimaryButton from '../components/ui/PrimaryButton'
import SecondaryButton from '../components/ui/SecondaryButton'
import Modal from '../components/ui/Modal'
import Toast from '../components/ui/Toast'

interface QuestionData {
  id: number
  title: string
  aiAnswer: string
  correctAnswer: string
  judgment: '正确' | '错误' | '部分正确'
  analysis: string
}

const mockQuestions: QuestionData[] = [
  {
    id: 1,
    title: '解方程 3x - 5 = 10',
    aiAnswer: 'x = 5',
    correctAnswer: 'x = 5',
    judgment: '正确',
    analysis: '本题作答正确，可选择不加入错题本，或作为易错题记录。'
  },
  {
    id: 2,
    title: '二次函数 y = x² - 4x + 3 的顶点坐标',
    aiAnswer: '(2, -1)',
    correctAnswer: '(2, -1)',
    judgment: '正确',
    analysis: '顶点公式掌握较好，建议后续关注图像平移题型。'
  },
  {
    id: 3,
    title: '几何证明中添加辅助线完成全等证明',
    aiAnswer: '步骤缺失',
    correctAnswer: '需补充辅助线并证明对应边角关系',
    judgment: '错误',
    analysis: '证明步骤遗漏，辅助线构造意识不足。'
  },
  {
    id: 4,
    title: '分式方程化简并检验增根',
    aiAnswer: 'x = 2',
    correctAnswer: 'x = 2，但需检验增根',
    judgment: '部分正确',
    analysis: '计算结果正确，但漏写检验步骤，属于过程不完整。'
  },
  {
    id: 5,
    title: '一次函数图像识别',
    aiAnswer: '斜率为正',
    correctAnswer: '斜率为正，截距为负',
    judgment: '部分正确',
    analysis: '图像信息提取不完整，建议同时关注斜率和截距。'
  },
  {
    id: 6,
    title: '解不等式组 {2x + 1 > 5, 3x - 2 < 10}',
    aiAnswer: 'x > 2',
    correctAnswer: '2 < x < 4',
    judgment: '部分正确',
    analysis: '只求出了第一个不等式的解，第二个不等式未求解。'
  },
  {
    id: 7,
    title: '投掷两枚硬币，至少一枚正面的概率',
    aiAnswer: '1/2',
    correctAnswer: '3/4',
    judgment: '错误',
    analysis: '考虑不全面，遗漏了"一正一反"和"两正"两种情况。'
  },
  {
    id: 8,
    title: '证明圆的切线垂直于过切点的半径',
    aiAnswer: '因为切线与圆只有一个交点',
    correctAnswer: '利用反证法证明切线与半径垂直',
    judgment: '部分正确',
    analysis: '结论正确，但缺少严谨的证明过程。'
  },
  {
    id: 9,
    title: '计算 sin(30°) + cos(60°)',
    aiAnswer: '1',
    correctAnswer: '1',
    judgment: '正确',
    analysis: '三角函数值掌握准确，计算正确。'
  },
  {
    id: 10,
    title: '等差数列 2, 5, 8, ... 的第10项',
    aiAnswer: '29',
    correctAnswer: '29',
    judgment: '正确',
    analysis: '等差数列通项公式应用正确。'
  }
]

export default function AnalyzePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [showModifyModal, setShowModifyModal] = useState(false)
  const [showSkipModal, setShowSkipModal] = useState(false)
  const [showExitModal, setShowExitModal] = useState(false)

  const questions = useMemo(() => {
    const storedQuestions = sessionStorage.getItem('selectedQuestions')
    if (storedQuestions) {
      try {
        const parsed = JSON.parse(storedQuestions)
        const questionIds = parsed.map((q: { id: number }) => q.id)
        return mockQuestions.filter(q => questionIds.includes(q.id))
      } catch {
        console.error('Failed to parse selectedQuestions from sessionStorage')
      }
    }
    const rawCount = parseInt(searchParams.get('count') || '5', 10)
    const queueLength = Math.min(Math.max(rawCount, 1), mockQuestions.length)
    return mockQuestions.slice(0, queueLength)
  }, [searchParams])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [processedCount, setProcessedCount] = useState(0)
  const [judgmentResult, setJudgmentResult] = useState<'正确' | '错误' | '无法判断' | '部分正确'>('错误')

  // 区分保存、暂存、跳过三种处理结果
  const [savedQuestions, setSavedQuestions] = useState<QuestionData[]>([])
  const [pendingQuestions, setPendingQuestions] = useState<QuestionData[]>([])
  const [skippedQuestions, setSkippedQuestions] = useState<QuestionData[]>([])

  const [questionText, setQuestionText] = useState(questions[0].title)
  const [answerText, setAnswerText] = useState(questions[0].aiAnswer)
  const [tempQuestionText, setTempQuestionText] = useState('')
  const [tempAnswerText, setTempAnswerText] = useState('')
  const [showQuestionEditModal, setShowQuestionEditModal] = useState(false)
  const [showAnswerEditModal, setShowAnswerEditModal] = useState(false)
  const [showPhotoModal, setShowPhotoModal] = useState(false)

  const currentQuestion = currentIndex + 1
  const totalQuestions = questions.length
  const progress = Math.round((processedCount / totalQuestions) * 100)

  const currentData = questions[currentIndex]

  // 统一处理"进入下一题"或"完成处理"的逻辑
  const goToNextOrFinish = (
    nextSaved: QuestionData[],
    nextPending: QuestionData[],
    nextSkipped: QuestionData[]
  ) => {
    if (currentIndex < totalQuestions - 1) {
      const nextIdx = currentIndex + 1
      setCurrentIndex(nextIdx)
      setProcessedCount(prev => prev + 1)
      setQuestionText(questions[nextIdx].title)
      setAnswerText(questions[nextIdx].aiAnswer)
      setJudgmentResult(questions[nextIdx].judgment === '部分正确' ? '错误' : questions[nextIdx].judgment)
    } else {
      // 最后一题处理完成，写入 sessionStorage
      sessionStorage.setItem('processedTotal', String(totalQuestions))
      sessionStorage.setItem('savedQuestions', JSON.stringify(nextSaved))
      sessionStorage.setItem('pendingQuestions', JSON.stringify(nextPending))
      sessionStorage.setItem('skippedQuestions', JSON.stringify(nextSkipped))
      sessionStorage.setItem('savedCount', String(nextSaved.length))
      sessionStorage.setItem('pendingCount', String(nextPending.length))
      sessionStorage.setItem('skippedCount', String(nextSkipped.length))

      // 跳转到保存成功页，传递真实统计
      navigate(`/save-success?total=${totalQuestions}&saved=${nextSaved.length}&pending=${nextPending.length}&skipped=${nextSkipped.length}`)
    }
  }

  const handleSaveDraft = () => {
    setToastMessage(`第${currentQuestion}题已暂存到待完善`)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      const nextPendingQuestions = [...pendingQuestions, currentData]
      setPendingQuestions(nextPendingQuestions)
      goToNextOrFinish(savedQuestions, nextPendingQuestions, skippedQuestions)
    }, 1500)
  }

  const handleSkip = () => {
    setShowSkipModal(true)
  }

  const handleConfirmSkip = () => {
    setShowSkipModal(false)
    setToastMessage(`第${currentQuestion}题已跳过`)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      const nextSkippedQuestions = [...skippedQuestions, currentData]
      setSkippedQuestions(nextSkippedQuestions)
      goToNextOrFinish(savedQuestions, pendingQuestions, nextSkippedQuestions)
    }, 1500)
  }

  const handleSaveCurrent = () => {
    setToastMessage(`第${currentQuestion}题已保存到错题本`)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      const nextSavedQuestions = [...savedQuestions, currentData]
      setSavedQuestions(nextSavedQuestions)
      goToNextOrFinish(nextSavedQuestions, pendingQuestions, skippedQuestions)
    }, 1500)
  }

  const handleExit = () => {
    setShowExitModal(true)
  }

  const handleConfirmExit = () => {
    setShowExitModal(false)
    setToastMessage('未处理题目已暂存，可稍后继续完善')
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      navigate(`/mistakes?filter=incomplete&count=${totalQuestions}`)
    }, 1500)
  }

  const handleOpenQuestionEdit = () => {
    setTempQuestionText(questionText)
    setShowQuestionEditModal(true)
  }

  const handleCancelQuestionEdit = () => {
    setShowQuestionEditModal(false)
    setTempQuestionText('')
  }

  const handleSaveQuestion = () => {
    if (!tempQuestionText.trim()) {
      setToastMessage('题目内容不能为空')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
      return
    }
    setQuestionText(tempQuestionText)
    setShowQuestionEditModal(false)
    setTempQuestionText('')
    setToastMessage('题目已更新')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const handleOpenAnswerEdit = () => {
    setTempAnswerText(answerText)
    setShowAnswerEditModal(true)
  }

  const handleCancelAnswerEdit = () => {
    setShowAnswerEditModal(false)
    setTempAnswerText('')
  }

  const handleSaveAnswer = () => {
    if (!tempAnswerText.trim()) {
      setToastMessage('答案内容不能为空')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
      return
    }
    setAnswerText(tempAnswerText)
    setShowAnswerEditModal(false)
    setTempAnswerText('')
    setToastMessage('答案已更新')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const handleOpenPhotoModal = () => {
    setShowPhotoModal(true)
  }

  const handleCancelPhoto = () => {
    setShowPhotoModal(false)
  }

  const handleSimulateRecognize = () => {
    setShowPhotoModal(false)
    setAnswerText(currentData.correctAnswer)
    setToastMessage('答案已重新识别')
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

  const getJudgmentType = (judgment: string) => {
    switch (judgment) {
      case '正确': return 'success'
      case '部分正确': return 'warning'
      case '错误': return 'error'
      default: return 'warning'
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F8FB] flex flex-col">
      <Header
        title={`第${currentQuestion}题 / 共${totalQuestions}题`}
        showBack
        rightAction={
          <button
            type="button"
            onClick={handleExit}
            className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-lg transition-colors border border-gray-200"
          >
            暂存退出
          </button>
        }
      />

      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>已处理 {processedCount} / 共 {totalQuestions} 题</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary-600 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-gray-500 text-xs mt-2">请确认当前题目的识别结果、判题结果和错因分析。</p>
      </div>

      <div className="flex-1 px-4 py-4 overflow-y-auto">
        <AppCard className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900 font-semibold">题目（OCR识别）</h3>
            <button 
              type="button"
              onClick={handleOpenQuestionEdit} 
              className="flex items-center gap-1 text-gray-400 hover:text-gray-600 active:text-gray-700 active:scale-95 transition-all cursor-pointer"
            >
              <Pencil className="w-4 h-4" />
              <span className="text-xs">编辑</span>
            </button>
          </div>
          <p className="text-gray-800 leading-relaxed">{questionText}</p>
        </AppCard>

        <AppCard className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900 font-semibold">我的答案（OCR识别）</h3>
            <button 
              type="button"
              onClick={handleOpenAnswerEdit} 
              className="flex items-center gap-1 text-gray-400 hover:text-gray-600 active:text-gray-700 active:scale-95 transition-all cursor-pointer"
            >
              <Pencil className="w-4 h-4" />
              <span className="text-xs">编辑</span>
            </button>
          </div>
          <p className="text-gray-800 font-mono text-lg whitespace-pre-line">{answerText}</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <button 
              type="button"
              onClick={handleOpenPhotoModal} 
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 active:text-gray-800 active:scale-98 transition-all cursor-pointer text-sm"
            >
              <Camera className="w-4 h-4" />
              <span>拍照识别答案</span>
            </button>
          </div>
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
            <StatusTag type={getJudgmentType(currentData.judgment)}>
              {currentData.judgment}
            </StatusTag>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">我的答案：</span>
              <span className={`${currentData.judgment !== '正确' ? 'text-red-600' : 'text-green-600'} font-mono`}>{answerText}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">正确答案：</span>
              <span className="text-green-600 font-mono font-semibold">{currentData.correctAnswer}</span>
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
              <StatusTag type={currentData.judgment === '正确' ? 'success' : 'error'}>
                {currentData.judgment === '正确' ? '答题正确' : '答题错误'}
              </StatusTag>
            </div>
            
            <div>
              <p className="text-gray-500 text-xs mb-1">错误原因</p>
              <p className="text-gray-800 text-sm">{currentData.analysis}</p>
            </div>
            
            <div>
              <p className="text-gray-500 text-xs mb-1">关联知识点</p>
              <StatusTag type="ai">AI识别结果</StatusTag>
            </div>
          </div>
        </AppCard>
      </div>

      <div className="px-4 py-4 pb-[max(env(safe-area-inset-bottom),20px)] bg-white border-t border-gray-100">
        <div className="flex gap-2">
          <div className="flex-1">
            <SecondaryButton className="w-full" onClick={handleSaveDraft}>
              暂存当前题
            </SecondaryButton>
          </div>
          <div className="flex-1">
            <button 
              type="button"
              onClick={handleSkip}
              className="w-full h-12 px-4 rounded-xl bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 active:bg-gray-300 transition-colors"
            >
              跳过当前题
            </button>
          </div>
          <div className="flex-1">
            <PrimaryButton className="w-full" onClick={handleSaveCurrent}>
              保存当前题
            </PrimaryButton>
          </div>
        </div>
      </div>

      <Modal
        open={showQuestionEditModal}
        title="编辑题目"
        onConfirm={handleSaveQuestion}
        onCancel={handleCancelQuestionEdit}
        confirmText="保存"
        cancelText="取消"
      >
        <textarea
          value={tempQuestionText}
          onChange={(e) => setTempQuestionText(e.target.value)}
          placeholder="请输入题目内容"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          rows={4}
          maxLength={500}
          autoFocus
        />
      </Modal>

      <Modal
        open={showAnswerEditModal}
        title="编辑我的答案"
        onConfirm={handleSaveAnswer}
        onCancel={handleCancelAnswerEdit}
        confirmText="保存"
        cancelText="取消"
      >
        <textarea
          value={tempAnswerText}
          onChange={(e) => setTempAnswerText(e.target.value)}
          placeholder="请输入答案"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none font-mono"
          rows={3}
          maxLength={100}
          autoFocus
        />
      </Modal>

      <Modal
        open={showPhotoModal}
        title="拍照识别答案"
        onConfirm={handleSimulateRecognize}
        onCancel={handleCancelPhoto}
        confirmText="模拟识别"
        cancelText="取消"
      >
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            你可以拍摄学生手写答案区域，系统会尝试识别答案和解题步骤。
          </p>
          <div className="bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 py-8 flex flex-col items-center gap-2">
            <Camera className="w-10 h-10 text-gray-400" />
            <p className="text-gray-500 text-sm">答案区域拍照识别</p>
          </div>
        </div>
      </Modal>

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

      {/* 自定义跳过确认弹窗 - 确保两个按钮都显示 */}
      {showSkipModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowSkipModal(false)}
          />
          <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm mx-0 sm:mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">跳过当前题？</h3>
            <p className="text-gray-600 text-sm mb-6">
              跳过后，这道题不会加入错题本，你可以继续处理下一题。
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                className="flex-1 h-12 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 active:bg-gray-300 transition-colors"
                onClick={() => setShowSkipModal(false)}
              >
                取消
              </button>
              <button
                type="button"
                className="flex-1 h-12 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 active:bg-primary-800 transition-colors"
                onClick={handleConfirmSkip}
              >
                确认跳过
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal
        open={showExitModal}
        title="退出识别流程？"
        onConfirm={handleConfirmExit}
        confirmText="暂存并退出"
        cancelText="继续处理"
      >
        <p className="text-gray-600 text-sm">
          还有未处理的题目，退出后未保存的题目不会进入错题本。
        </p>
      </Modal>

      <Toast message={toastMessage} visible={showToast} />
    </div>
  )
}