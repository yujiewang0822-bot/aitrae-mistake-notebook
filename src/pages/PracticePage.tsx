import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { PenTool, Target, CheckCircle, XCircle, Lightbulb, ChevronLeft, BookOpen } from 'lucide-react'
import AppCard from '../components/ui/AppCard'
import StatusTag from '../components/ui/StatusTag'
import PrimaryButton from '../components/ui/PrimaryButton'
import SecondaryButton from '../components/ui/SecondaryButton'
import Modal from '../components/ui/Modal'
import Toast from '../components/ui/Toast'

interface PracticeQuestion {
  id: number
  title: string
  content: string
  answer: string
  explanation: string
}

const mockSimilarQuestions: PracticeQuestion[] = [
  { 
    id: 1, 
    title: '解方程练习',
    content: '解方程 2x + 4 = 14，求 x 的值', 
    answer: 'x = 5',
    explanation: '将常数项移到右边，2x = 14 - 4 = 10，然后 x = 10 ÷ 2 = 5'
  },
  { 
    id: 2, 
    title: '解方程练习',
    content: '解方程 5x - 7 = 18，求 x 的值', 
    answer: 'x = 5',
    explanation: '将常数项移到右边，5x = 18 + 7 = 25，然后 x = 25 ÷ 5 = 5'
  },
  { 
    id: 3, 
    title: '解方程练习',
    content: '解方程 3(x - 1) = 12，求 x 的值', 
    answer: 'x = 5',
    explanation: '先去括号，3x - 3 = 12，移项得 3x = 15，x = 5'
  },
  { 
    id: 4, 
    title: '解方程练习',
    content: '解方程 4x + 6 = 2x + 16，求 x 的值', 
    answer: 'x = 5',
    explanation: '移项得 4x - 2x = 16 - 6，2x = 10，x = 5'
  },
  { 
    id: 5, 
    title: '解方程练习',
    content: '解方程 7x - 12 = 3x + 8，求 x 的值', 
    answer: 'x = 5',
    explanation: '移项得 7x - 3x = 8 + 12，4x = 20，x = 5'
  }
]

// 根据来源和数量生成练习题队列
function generateQuestionQueue(
  source: string | null, 
  type: string | null, 
  count: number,
  knowledgeName: string | null,
  chapterName: string | null
): PracticeQuestion[] {
  const result: PracticeQuestion[] = []
  
  if (source === 'knowledge' || type === 'knowledge') {
    // 知识点专项练习
    const kpName = knowledgeName?.split(',').join('、') || '数学知识点'
    const templates = [
      { title: `${kpName}基础判断`, content: `围绕「${kpName}」完成下列练习：判断下列说法是否正确` },
      { title: `${kpName}易错辨析`, content: `围绕「${kpName}」完成下列练习：辨析常见错误` },
      { title: `${kpName}综合应用`, content: `围绕「${kpName}」完成下列练习：综合应用题` },
      { title: `${kpName}变式练习`, content: `围绕「${kpName}」完成下列练习：变式训练` },
      { title: `${kpName}拓展提升`, content: `围绕「${kpName}」完成下列练习：拓展提升题` },
    ]
    
    for (let i = 0; i < count; i++) {
      const template = templates[i % templates.length]
      result.push({
        id: i + 1,
        title: `知识点专项题 ${i + 1}：${template.title}`,
        content: template.content,
        answer: '正确',
        explanation: `这是关于「${kpName}」的知识点专项练习解析`
      })
    }
  } else if (source === 'chapter' || type === 'chapter') {
    // 章节专项练习
    const chName = chapterName || '当前章节'
    const templates = [
      { title: '基础题', content: `「${chName}」基础练习题` },
      { title: '提升题', content: `「${chName}」提升练习题` },
      { title: '应用题', content: `「${chName}」应用练习题` },
      { title: '综合题', content: `「${chName}」综合练习题` },
      { title: '拓展题', content: `「${chName}」拓展练习题` },
    ]
    
    for (let i = 0; i < count; i++) {
      const template = templates[i % templates.length]
      result.push({
        id: i + 1,
        title: `章节练习题 ${i + 1}：${chName}${template.title}`,
        content: `${template.content}，请解答下列问题`,
        answer: '正确',
        explanation: `这是「${chName}」${template.title}的解析`
      })
    }
  } else {
    // 默认举一反三练习
    for (let i = 0; i < count; i++) {
      if (i < mockSimilarQuestions.length) {
        result.push(mockSimilarQuestions[i])
      } else {
        result.push({
          id: i + 1,
          title: `同类题 ${i + 1}`,
          content: `解方程 ${(i + 1) * 3}x + ${(i + 1) * 2} = ${(i + 1) * 8}，求 x 的值`,
          answer: 'x = 1',
          explanation: '同类题解析'
        })
      }
    }
  }
  
  return result
}

export default function PracticePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [showExitModal, setShowExitModal] = useState(false)
  const [showHintModal, setShowHintModal] = useState(false)
  const [showAnalysisModal, setShowAnalysisModal] = useState(false)
  const [userAnswer, setUserAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [wrongCount, setWrongCount] = useState(0)

  // 读取 URL 参数
  const from = searchParams.get('from')
  const type = searchParams.get('type')
  const source = searchParams.get('source')
  const mode = searchParams.get('mode')
  const taskId = searchParams.get('taskId')
  const mistakeId = searchParams.get('mistakeId')
  const returnTo = searchParams.get('returnTo')
  
  // 教材参数
  const grade = searchParams.get('grade') || '初二'
  const volume = searchParams.get('volume') || '上册'
  const publisher = searchParams.get('publisher') || '人教版'
  
  // 知识点参数
  const knowledgeName = searchParams.get('knowledgeName')
  
  // 章节参数
  const chapterName = searchParams.get('chapterName')
  
  // 试卷参数
  const paperTitle = searchParams.get('paperTitle')
  const difficulty = searchParams.get('difficulty')
  const practiceGoal = searchParams.get('practiceGoal')
  const estimatedTime = searchParams.get('estimatedTime')
  
  // 数量参数
  const rawCount = parseInt(searchParams.get('count') || '5', 10)
  const targetCount = Math.max(rawCount, 1)

  // 根据来源生成题目队列
  const questionQueue = useMemo(() => {
    return generateQuestionQueue(source, type, targetCount, knowledgeName, chapterName)
  }, [source, type, targetCount, knowledgeName, chapterName])

  const [currentIdx, setCurrentIdx] = useState(0)
  const currentQ = questionQueue[Math.min(currentIdx, questionQueue.length - 1)]
  const progressPercent = Math.round(((currentIdx + 1) / questionQueue.length) * 100)

  // 获取返回路径
  const getReturnPath = () => {
    // 优先使用 returnTo
    if (returnTo) {
      return `/${returnTo}`.replace(/\/\//g, '/')
    }
    
    // 根据 from 返回
    switch (from) {
      case 'knowledge-practice':
        return '/knowledge-practice'
      case 'chapter-practice':
        return '/chapter-practice'
      case 'exam-practice':
        return '/exam-practice'
      case 'save-success':
        return '/save-success'
      case 'mistake-detail':
        return `/mistake/${mistakeId || 1}`
      case 'practice-result':
        return '/practice-result'
      case 'today-review':
        return '/today-review'
      case 'study-plan':
        return '/study-plan'
      default:
        return '/practice'
    }
  }

  const getPracticeInfo = () => {
    const practiceCount = questionQueue.length
    const returnPath = getReturnPath()
    
    // 知识点专项练习
    if (source === 'knowledge' || type === 'knowledge') {
      const kpNames = knowledgeName?.split(',').join('、') || '数学知识点'
      return {
        title: '知识点专项练习',
        description: `根据你选择的知识点生成专项练习，共 ${practiceCount} 道题`,
        tags: ['来源：知识点练习', '目标：专项巩固'],
        returnPath,
        subInfo: {
          type: 'knowledge',
          name: kpNames,
          label: '当前知识点'
        }
      }
    }
    
    // 章节专项练习
    if (source === 'chapter' || type === 'chapter') {
      return {
        title: '章节专项练习',
        description: `根据你选择的教材章节生成章节练习，共 ${practiceCount} 道题`,
        tags: ['来源：章节练习', '目标：章节巩固'],
        returnPath,
        subInfo: {
          type: 'chapter',
          name: chapterName || '当前章节',
          label: '当前章节'
        }
      }
    }
    
    // 试卷练习（AI 推荐试卷、自定义组卷、最近生成）
    if (type === 'paper' && (source === 'exam-paper' || source === 'custom-paper' || source === 'recent-paper')) {
      const ptTitle = paperTitle || '练习卷'
      const ptDifficulty = difficulty || '中等'
      const ptGoal = practiceGoal || '巩固练习'
      const ptTime = estimatedTime ? `${estimatedTime} 分钟` : '按题量估算'
      return {
        title: '试卷练习',
        description: `正在练习《${ptTitle}》，共 ${practiceCount} 道题`,
        tags: [
          `来源：${source === 'exam-paper' ? 'AI推荐试卷' : source === 'custom-paper' ? '自定义组卷' : '最近生成'}`,
          `难度：${ptDifficulty}`,
          `目标：${ptGoal}`,
          `预计：${ptTime}`
        ],
        returnPath,
        subInfo: {
          type: 'paper',
          name: ptTitle,
          label: '当前试卷'
        }
      }
    }
    
    // 举一反三练习（原有逻辑）
    if (from === 'mistake-detail' && type === 'similar') {
      return {
        title: '举一反三练习',
        description: `系统根据当前错题生成 ${practiceCount} 道同类题，帮助你验证是否真正掌握`,
        tags: ['来源：错题详情', '目标：同类题迁移'],
        returnPath
      }
    } else if (from === 'save-success' && type === 'similar') {
      return {
        title: '保存后的举一反三',
        description: `系统根据本次保存的错题，优先推荐你练习 ${practiceCount} 道同类题`,
        tags: ['来源：保存成功', '目标：立即巩固'],
        returnPath
      }
    } else if (from === 'practice-result' && type === 'similar') {
      return {
        title: '再练一组',
        description: `继续练习 ${practiceCount} 道同类题，巩固刚才暴露的问题`,
        tags: ['来源：练习结果', '目标：强化巩固'],
        returnPath
      }
    } else if (from === 'practice-center' && type === 'recommend') {
      return {
        title: '系统推荐练习',
        description: '根据错题分布推荐你优先练习这类题目',
        tags: ['推荐依据：错题数', '高频错因：移项符号错误'],
        returnPath
      }
    } else if (from === 'practice-center' && type === 'similar') {
      return {
        title: '举一反三练习',
        description: '根据已保存错题生成同类题，帮助你验证是否真正掌握',
        tags: ['练习目标：同知识点迁移', '同错误类型强化'],
        returnPath
      }
    } else if (from === 'today-review' && mode === 'redo') {
      return {
        title: '重新作答',
        description: '这道题来自复习任务，建议重新完整做一遍，再查看解析',
        tags: ['复习方式：重新作答'],
        returnPath
      }
    } else if (from === 'today-review' && mode === 'similar') {
      return {
        title: '复习后的举一反三',
        description: '这道题用于检查你是否能把原错题方法迁移到同类题',
        tags: ['复习方式：举一反三'],
        returnPath
      }
    } else if (from === 'study-plan' && type === 'priority') {
      return {
        title: '复习优先级练习',
        description: '这道题来自 AI 学习计划中的复习优先级，用于巩固当前考试前最需要补强的单元',
        tags: ['来源：AI 学习计划', '目标：优先补弱', '依据：错题数量与掌握度'],
        returnPath
      }
    } else {
      return {
        title: '练习题',
        description: '完成练习后，系统会根据结果更新你的掌握状态',
        tags: [],
        returnPath
      }
    }
  }

  const practiceInfo = getPracticeInfo()

  const handleBack = () => {
    navigate(practiceInfo.returnPath)
  }

  const handleExit = () => {
    setShowExitModal(true)
  }

  const handleConfirmExit = () => {
    setShowExitModal(false)
    navigate(practiceInfo.returnPath)
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
    const correct = currentQ.answer.toLowerCase()
    const answerIsCorrect = answer === correct || answer === correct.replace(/\s+/g, '') || answer === correct.replace('x = ', '').trim()
    setIsCorrect(answerIsCorrect)
    if (answerIsCorrect) {
      setCorrectCount(prev => prev + 1)
    } else {
      setWrongCount(prev => prev + 1)
    }
    setSubmitted(true)
  }

  const handleViewAnalysis = () => {
    setShowAnalysisModal(true)
  }

  const handleNext = () => {
    if (currentIdx < questionQueue.length - 1) {
      const nextIdx = currentIdx + 1
      setCurrentIdx(nextIdx)
      setUserAnswer('')
      setSubmitted(false)
      setIsCorrect(false)
    } else {
      const finalCorrectCount = correctCount
      const countParam = questionQueue.length
      const finalWrongCount = countParam - finalCorrectCount
      if (from === 'today-review' && taskId) {
        navigate(`/practice-result?from=today-review&taskId=${taskId}&count=${countParam}&correct=${finalCorrectCount}&wrong=${finalWrongCount}`)
      } else {
        navigate(`/practice-result?count=${countParam}&correct=${finalCorrectCount}&wrong=${finalWrongCount}`)
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F8FB] flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <button
          type="button"
          onClick={handleBack}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-gray-900 font-medium text-lg">{practiceInfo.title}</h1>
        <button
          type="button"
          onClick={handleExit}
          className="px-3 py-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
        >
          退出
        </button>
      </div>

      <div className="flex-1 px-4 py-4 overflow-y-auto">
        {/* 当前教材信息 */}
        <AppCard className="mb-4 bg-yellow-50 border-yellow-100">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-yellow-600 flex-shrink-0" />
            <span className="text-sm text-yellow-800">
              当前教材：{grade}{volume} · {publisher}
            </span>
          </div>
        </AppCard>

        <AppCard className="mb-4 bg-blue-50 border-blue-100">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Target className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-gray-900 font-semibold mb-1">{practiceInfo.title}</h3>
              <p className="text-gray-700 text-sm mb-2">{practiceInfo.description}</p>
              
              {/* 显示当前知识点或章节 */}
              {practiceInfo.subInfo && (
                <div className="mb-2">
                  <span className="text-xs text-gray-500">{practiceInfo.subInfo.label}：</span>
                  <span className="text-xs font-medium text-blue-600">{practiceInfo.subInfo.name}</span>
                </div>
              )}
              
              {practiceInfo.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {practiceInfo.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-white text-xs text-gray-600 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </AppCard>

        <AppCard className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <span className="text-gray-800 font-medium">第 <span className="text-primary-600 font-bold">{currentIdx + 1}</span> / {questionQueue.length} 题</span>
              <span className="text-gray-600 text-sm">正确 <span className="text-green-600 font-bold">{correctCount}</span> 题</span>
              <span className="text-gray-600 text-sm">错误 <span className="text-red-600 font-bold">{wrongCount}</span> 题</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary-500 h-2 rounded-full transition-all" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <p className="text-gray-400 text-xs mt-2 text-right">进度 {progressPercent}%</p>
        </AppCard>

        <AppCard className="mb-4">
          <h3 className="text-gray-900 font-semibold flex items-center gap-2 mb-3">
            <PenTool className="w-4 h-4 text-primary-600" />
            {currentQ.title}
          </h3>
          <p className="text-gray-800 text-lg leading-relaxed">{currentQ.content}</p>
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
                ? '很好，回答正确！'
                : '答案错误，请查看正确答案和解析'
              }
            </p>
            {!isCorrect && (
              <div className="p-3 bg-green-50 rounded-xl">
                <p className="text-gray-500 text-xs mb-1">正确答案</p>
                <p className="text-green-600 font-mono font-semibold">{currentQ.answer}</p>
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
                {currentIdx < questionQueue.length - 1 ? '下一题' : '完成练习'}
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
        <p className="text-gray-600 text-sm">当前练习进度将被暂存</p>
      </Modal>

      <Modal
        open={showHintModal}
        title="解题提示"
        confirmText="我知道了"
        onConfirm={() => setShowHintModal(false)}
        onCancel={() => setShowHintModal(false)}
      >
        <div className="space-y-2">
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-blue-800 text-sm">
              <span className="font-semibold">提示 1：</span>先把常数项移到等式右边，注意变号
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-blue-800 text-sm">
              <span className="font-semibold">提示 2：</span>再让等式两边同时除以未知数的系数
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
        <div className="space-y-2">
          <p className="text-gray-800 text-sm">题目：{currentQ.content}</p>
          <p className="text-gray-800 text-sm">正确答案：{currentQ.answer}</p>
          <p className="text-gray-600 text-sm">解析：{currentQ.explanation}</p>
        </div>
      </Modal>

      <Toast message={toastMessage} visible={showToast} />
    </div>
  )
}
