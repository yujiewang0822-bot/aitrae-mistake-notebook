import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { MoreHorizontal, Sparkles, Tags, CalendarDays, CheckCircle, PenTool, ChevronLeft, Target, Eye } from 'lucide-react'
import AppCard from '../components/ui/AppCard'
import StatusTag from '../components/ui/StatusTag'
import PrimaryButton from '../components/ui/PrimaryButton'
import SecondaryButton from '../components/ui/SecondaryButton'
import Toast from '../components/ui/Toast'

const STORAGE_KEY = 'todayReviewCompletedTaskIds'

interface DetailQuestion {
  id: number
  title: string
  userAnswer: string
  correctAnswer: string
  judgment: '正确' | '错误' | '部分正确'
  knowledgePoints: string[]
  analysis: string
}

function ensureQuestionCount(list: DetailQuestion[], count: number): DetailQuestion[] {
  if (list.length >= count) {
    return list.slice(0, count)
  }
  const result = [...list]
  while (result.length < count) {
    const index = result.length + 1
    result.push({
      id: result.length + 1,
      title: `错题 ${index}：综合知识点练习`,
      userAnswer: '待补充',
      correctAnswer: '待确认',
      judgment: '部分正确',
      knowledgePoints: ['综合应用'],
      analysis: '待分析'
    })
  }
  return result
}

const mockDetailQuestions: DetailQuestion[] = [
  {
    id: 1,
    title: '解方程 3x - 5 = 10，求 x 的值',
    userAnswer: 'x = 5',
    correctAnswer: 'x = 5',
    judgment: '正确',
    knowledgePoints: ['一元一次方程', '移项', '方程计算'],
    analysis: '本题作答正确，可作为易错题记录'
  },
  {
    id: 2,
    title: '二次函数 y = x² - 4x + 3 的顶点坐标',
    userAnswer: '(2, -1)',
    correctAnswer: '(2, -1)',
    judgment: '正确',
    knowledgePoints: ['二次函数', '顶点坐标'],
    analysis: '顶点公式掌握较好，建议后续关注图像平移题型'
  },
  {
    id: 3,
    title: '几何证明中添加辅助线完成全等证明',
    userAnswer: '步骤缺失',
    correctAnswer: '需补充辅助线并证明对应边角关系',
    judgment: '错误',
    knowledgePoints: ['全等三角形', '辅助线'],
    analysis: '证明步骤遗漏，辅助线构造意识不足'
  },
  {
    id: 4,
    title: '分式方程化简并检验增根',
    userAnswer: 'x = 2',
    correctAnswer: 'x = 2，但需检验增根',
    judgment: '部分正确',
    knowledgePoints: ['分式方程', '增根检验'],
    analysis: '计算结果正确，但漏写检验步骤，属于过程不完整'
  },
  {
    id: 5,
    title: '一次函数图像识别',
    userAnswer: '斜率为正',
    correctAnswer: '斜率为正，截距为负',
    judgment: '部分正确',
    knowledgePoints: ['一次函数', '图像识别'],
    analysis: '图像信息提取不完整，建议同时关注斜率和截距'
  },
  {
    id: 6,
    title: '解不等式组 {2x + 1 > 5, 3x - 2 < 10}',
    userAnswer: 'x > 2',
    correctAnswer: '2 < x < 4',
    judgment: '部分正确',
    knowledgePoints: ['不等式组', '解集'],
    analysis: '只求出了第一个不等式的解'
  },
  {
    id: 7,
    title: '投掷两枚硬币，至少一枚正面的概率',
    userAnswer: '1/2',
    correctAnswer: '3/4',
    judgment: '错误',
    knowledgePoints: ['概率', '古典概型'],
    analysis: '考虑不全面，遗漏了部分情况'
  },
  {
    id: 8,
    title: '证明圆的切线垂直于过切点的半径',
    userAnswer: '因为切线与圆只有一个交点',
    correctAnswer: '利用反证法证明切线与半径垂直',
    judgment: '部分正确',
    knowledgePoints: ['圆', '切线'],
    analysis: '结论正确，但缺少严谨的证明过程'
  },
  {
    id: 9,
    title: '计算 sin(30°) + cos(60°)',
    userAnswer: '1',
    correctAnswer: '1',
    judgment: '正确',
    knowledgePoints: ['三角函数', '特殊角'],
    analysis: '三角函数值掌握准确，计算正确'
  },
  {
    id: 10,
    title: '等差数列 2, 5, 8, ... 的第10项',
    userAnswer: '29',
    correctAnswer: '29',
    judgment: '正确',
    knowledgePoints: ['等差数列', '通项公式'],
    analysis: '等差数列通项公式应用正确'
  }
]

export default function MistakeDetailPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [masteryStatus, setMasteryStatus] = useState<'需复习' | '已掌握'>('需复习')
  const [showRecallAnswer, setShowRecallAnswer] = useState(false)

  const from = searchParams.get('from')
  const mode = searchParams.get('mode')
  const taskId = searchParams.get('taskId')
  const rawBatchCount = parseInt(searchParams.get('batchCount') || '1', 10)
  const isFromSaveSuccess = from === 'save-success'
  const isFromTodayReview = from === 'today-review'
  const isRecallMode = mode === 'recall'
  const isQuickMode = mode === 'quick'

  const batchList = useMemo(() => {
    // 优先从 sessionStorage 读取 savedQuestions
    if (isFromSaveSuccess) {
      const storedQuestions = sessionStorage.getItem('savedQuestions')
      if (storedQuestions) {
        try {
          const parsed = JSON.parse(storedQuestions)
          if (Array.isArray(parsed) && parsed.length > 0) {
            // 直接使用 savedQuestions，不做 id 匹配
            return parsed.map((q: Record<string, unknown>, index: number) => ({
              id: (q.id as number) || index + 1,
              title: (q.title as string) || (q.question as string) || `第 ${index + 1} 题`,
              userAnswer: (q.userAnswer as string) || (q.aiAnswer as string) || '待补充',
              correctAnswer: (q.correctAnswer as string) || '待确认',
              judgment: (q.judgment as '正确' | '错误' | '部分正确') || '部分正确',
              knowledgePoints: Array.isArray(q.knowledgePoints) ? (q.knowledgePoints as string[]) : ['综合应用'],
              analysis: (q.analysis as string) || (q.errorType as string) || '待分析'
            }))
          }
        } catch {
          console.error('Failed to parse savedQuestions from sessionStorage')
        }
      }
      // 如果没有 sessionStorage，则根据 batchCount 参数，使用 ensureQuestionCount 补齐
      return ensureQuestionCount(mockDetailQuestions, rawBatchCount)
    }
    return [mockDetailQuestions[0]]
  }, [isFromSaveSuccess, rawBatchCount])

  const [activeIdx, setActiveIdx] = useState(0)
  const currentQ = batchList[Math.min(activeIdx, batchList.length - 1)]

  const markTaskCompleted = (id: string) => {
    const stored = localStorage.getItem(STORAGE_KEY)
    let completedIds: string[] = []
    if (stored) {
      try {
        completedIds = JSON.parse(stored)
      } catch (e) {
        console.error('Failed to parse:', e)
      }
    }
    if (!completedIds.includes(id)) {
      completedIds.push(id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedIds))
    }
  }

  const handleBack = () => {
    if (isFromSaveSuccess) {
      navigate('/save-success')
    } else if (isFromTodayReview) {
      navigate('/today-review')
    } else if (from === 'practice-result') {
      navigate('/practice-result')
    } else {
      navigate('/mistakes')
    }
  }

  const handleMore = () => {
    setToastMessage('更多操作功能建设中')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const handleMarkMastered = () => {
    if (masteryStatus === '已掌握') {
      setToastMessage('这道题已标记为已掌握')
    } else {
      setMasteryStatus('已掌握')
      setToastMessage('已标记为已掌握，系统将降低复习频率')
    }
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const handlePractice = () => {
    if (isFromTodayReview && mode) {
      const targetTaskId = taskId || 'task-1'
      navigate(`/practice/1?from=today-review&mode=similar&taskId=${targetTaskId}`)
    } else if (isFromSaveSuccess) {
      navigate(`/practice/1?from=save-success&type=similar&count=3`)
    } else {
      navigate(`/practice/1?from=mistake-detail&type=similar&mistakeId=${currentQ.id}&count=3`)
    }
  }

  const handleViewRecallAnswer = () => {
    setShowRecallAnswer(true)
    setToastMessage('已显示答案和错因')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const handleRecallRemembered = () => {
    if (taskId) markTaskCompleted(taskId)
    setToastMessage('已完成本次回忆复习')
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      navigate('/today-review')
    }, 1500)
  }

  const handleRecallNotYet = () => {
    setToastMessage('已保留在待复习列表')
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      navigate('/today-review')
    }, 1500)
  }

  const handleQuickReviewed = () => {
    if (taskId) markTaskCompleted(taskId)
    setToastMessage('已完成本次快速回看')
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      navigate('/today-review')
    }, 1500)
  }

  const handleQuickStillNeed = () => {
    setToastMessage('已保留在待复习列表')
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      navigate('/today-review')
    }, 1500)
  }

  const getModeTitle = () => {
    if (mode === 'quick') return '快速回看'
    if (mode === 'recall') return '遮答案回忆'
    return '快速回看'
  }

  const getModeDescription = () => {
    if (mode === 'quick') return '建议先快速回顾题目、答案和错因，确认自己是否仍然掌握'
    if (mode === 'recall') return '建议先尝试回忆解题思路，再查看答案和错因'
    return ''
  }

  const shouldShowBottomAction = () => {
    if (isRecallMode && !showRecallAnswer) return false
    return true
  }

  const getBottomButtons = () => {
    if (isRecallMode && showRecallAnswer) {
      return (
        <>
          <div className="flex-1">
            <SecondaryButton className="w-full" onClick={handleRecallNotYet}>
              还没掌握
            </SecondaryButton>
          </div>
          <div className="flex-1">
            <PrimaryButton className="w-full" onClick={handleRecallRemembered}>
              我想起来了
            </PrimaryButton>
          </div>
        </>
      )
    }

    if (isFromTodayReview && isQuickMode) {
      return (
        <>
          <div className="flex-1">
            <SecondaryButton className="w-full" onClick={handleQuickStillNeed}>
              仍需复习
            </SecondaryButton>
          </div>
          <div className="flex-1">
            <PrimaryButton className="w-full" onClick={handleQuickReviewed}>
              已回顾
            </PrimaryButton>
          </div>
        </>
      )
    }

    if (isFromTodayReview && !isRecallMode && !isQuickMode) {
      return (
        <>
          <div className="flex-1">
            <SecondaryButton className="w-full" onClick={handleMarkMastered}>
              <CheckCircle className="w-4 h-4 mr-2" />
              {masteryStatus === '已掌握' ? '已掌握' : '标记已掌握'}
            </SecondaryButton>
          </div>
          <div className="flex-1">
            <PrimaryButton className="w-full" onClick={handlePractice}>
              <PenTool className="w-4 h-4 mr-2" />
              举一反三练习
            </PrimaryButton>
          </div>
        </>
      )
    }

    return (
      <>
        <div className="flex-1">
          <SecondaryButton className="w-full" onClick={handleMarkMastered}>
            <CheckCircle className="w-4 h-4 mr-2" />
            {masteryStatus === '已掌握' ? '已掌握' : '标记已掌握'}
          </SecondaryButton>
        </div>
        <div className="flex-1">
          <PrimaryButton className="w-full" onClick={handlePractice}>
            <PenTool className="w-4 h-4 mr-2" />
            举一反三练习
          </PrimaryButton>
        </div>
      </>
    )
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
        <h1 className="text-gray-900 font-medium text-lg">错题详情</h1>
        <button
          type="button"
          onClick={handleMore}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <MoreHorizontal className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <div className="flex-1 px-4 py-4 overflow-y-auto">
        {isFromSaveSuccess && batchList.length > 1 && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 text-sm font-medium">
                本次保存 {batchList.length} 道题
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
              {batchList.map((q, idx) => (
                <button
                  type="button"
                  key={q.id}
                  onClick={() => {
                    setActiveIdx(idx)
                    setShowRecallAnswer(false)
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors flex-shrink-0 ${
                    idx === activeIdx
                      ? 'bg-primary-600 text-white font-medium'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  第 {idx + 1} 题
                </button>
              ))}
            </div>
          </div>
        )}

        {isFromTodayReview && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 text-sm font-medium">今日复习 · {getModeTitle()}</span>
            </div>
            <p className="text-blue-600 text-sm">{getModeDescription()}</p>
          </div>
        )}

        <AppCard className="mb-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-1">学科</p>
              <p className="text-gray-800 font-medium">数学</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-1">难度</p>
              <StatusTag type="warning">中等</StatusTag>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-1">掌握状态</p>
              <StatusTag type={masteryStatus === '已掌握' ? 'success' : 'warning'}>
                {masteryStatus}
              </StatusTag>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-1">类型</p>
              <StatusTag type={currentQ.judgment === '错误' ? 'error' : currentQ.judgment === '部分正确' ? 'warning' : 'success'}>
                {currentQ.judgment}
              </StatusTag>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-1">最近复习</p>
              <p className="text-gray-800 font-medium">今天</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-1">下次复习</p>
              <p className="text-gray-800 font-medium">明天</p>
            </div>
          </div>
        </AppCard>

        <AppCard className="mb-4">
          <h3 className="text-gray-900 font-semibold mb-3">题目</h3>
          <p className="text-gray-800">{currentQ.title}</p>
        </AppCard>

        {isRecallMode && !showRecallAnswer ? (
          <AppCard className="mb-4">
            <div className="text-center py-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-gray-900 font-semibold mb-2">先回忆一下</h3>
              <p className="text-gray-600 text-sm mb-4">
                先尝试在脑中回忆解题思路，再查看答案和错因
              </p>
              <PrimaryButton className="w-full" onClick={handleViewRecallAnswer}>
                查看答案和错因
              </PrimaryButton>
            </div>
          </AppCard>
        ) : (
          <>
            <AppCard className="mb-4">
              <h3 className="text-gray-900 font-semibold mb-3">答案对比</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                  <span className="text-gray-600 text-sm">我的答案</span>
                  <span className="text-red-600 font-mono font-semibold">{currentQ.userAnswer}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                  <span className="text-gray-600 text-sm">正确答案</span>
                  <span className="text-green-600 font-mono font-semibold">{currentQ.correctAnswer}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600 text-sm">AI判定</span>
                  <StatusTag type={currentQ.judgment === '错误' ? 'error' : currentQ.judgment === '部分正确' ? 'warning' : 'success'}>
                    {currentQ.judgment}
                  </StatusTag>
                </div>
              </div>
            </AppCard>

            <AppCard className="mb-4">
              <h3 className="text-gray-900 font-semibold flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-purple-600" />
                AI错因分析
              </h3>
              <div className="space-y-2">
                <div>
                  <p className="text-gray-500 text-xs mb-1">错误原因</p>
                  <p className="text-gray-800 text-sm">{currentQ.analysis}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">关联知识点</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {currentQ.knowledgePoints.map((kp, i) => (
                      <span key={i} className="px-2 py-1 text-xs bg-white text-gray-600 rounded-full border border-gray-200">
                        {kp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </AppCard>

            <AppCard className="mb-4">
              <h3 className="text-gray-900 font-semibold flex items-center gap-2 mb-3">
                <Tags className="w-4 h-4 text-primary-600" />
                相关知识点
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentQ.knowledgePoints.map((kp, i) => (
                  <StatusTag key={i} type="ai">{kp}</StatusTag>
                ))}
              </div>
            </AppCard>

            <AppCard className="mb-4">
              <h3 className="text-gray-900 font-semibold flex items-center gap-2 mb-3">
                <CalendarDays className="w-4 h-4 text-blue-600" />
                复习安排
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">首次复习</span>
                  <span className="text-gray-800">明天</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">第二次复习</span>
                  <span className="text-gray-800">3天后</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">第三次复习</span>
                  <span className="text-gray-800">7天后</span>
                </div>
              </div>
              <p className="text-gray-400 text-xs mt-3">系统会根据你的掌握情况自动调整复习时间</p>
            </AppCard>
          </>
        )}
      </div>

      {shouldShowBottomAction() && (
        <div className="px-4 py-4 pb-[max(env(safe-area-inset-bottom),20px)] bg-white border-t border-gray-100">
          <div className="flex gap-3">
            {getBottomButtons()}
          </div>
        </div>
      )}

      <Toast message={toastMessage} visible={showToast} />
    </div>
  )
}
