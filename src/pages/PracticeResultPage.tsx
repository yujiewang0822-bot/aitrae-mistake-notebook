import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, X, TrendingUp, Target, BookOpen, ChevronRight, AlertCircle, Sparkles, Clock } from 'lucide-react'
import AppCard from '../components/ui/AppCard'
import PrimaryButton from '../components/ui/PrimaryButton'
import SecondaryButton from '../components/ui/SecondaryButton'
import StatusTag from '../components/ui/StatusTag'

export default function PracticeResultPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const type = searchParams.get('type')
  const source = searchParams.get('source')
  const returnTo = searchParams.get('returnTo')
  const paperId = searchParams.get('paperId')
  const paperTitle = searchParams.get('paperTitle')
  const paperType = searchParams.get('paperType')
  const difficulty = searchParams.get('difficulty')
  const practiceGoal = searchParams.get('practiceGoal')
  const time = searchParams.get('time')
  const knowledgeName = searchParams.get('knowledgeName')

  const safeCount = Math.max(0, parseInt(searchParams.get('count') || '0', 10))
  const correctParam = searchParams.get('correct')
  const rawCorrect = correctParam !== null ? Math.max(0, parseInt(correctParam, 10)) : 0
  const safeCorrect = Math.min(rawCorrect, safeCount)
  const safeWrong = safeCount - safeCorrect
  const accuracy = safeCount > 0 ? Math.round((safeCorrect / safeCount) * 100) : 0

  const isPaperResult = useMemo(() => {
    return type === 'paper' || 
           source === 'exam-paper' || 
           source === 'custom-paper' || 
           source === 'recent-paper'
  }, [type, source])

  const from = searchParams.get('from')
  const taskId = searchParams.get('taskId')

  const returnLabel = useMemo(() => {
    if (from === 'today-review' && taskId) {
      return '返回复习任务'
    }
    if (from === 'practice-result') {
      return '返回练习中心'
    }
    return '返回首页'
  }, [from, taskId])

  const getPaperTypeName = (type: string | null) => {
    const typeMap: Record<string, string> = {
      'exam': '考试模拟卷',
      'custom': '自定义练习卷',
      'weak-point': '薄弱知识点专项卷',
      'similar': '错题同类强化卷'
    }
    return typeMap[type || ''] || '练习卷'
  }

  const knowledgeList = useMemo(() => {
    if (!knowledgeName) {
      return [
        { name: '一元一次方程移项', status: 'improved' },
        { name: '符号变化', status: 'warning' },
        { name: '几何证明步骤', status: 'need-strengthen' }
      ]
    }
    return knowledgeName.split(',').map(name => ({
      name,
      status: ['顶点坐标', '函数图像'].includes(name) ? 'need-strengthen' : 'improved'
    }))
  }, [knowledgeName])

  const getKnowledgeStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'improved': '掌握较好',
      'warning': '需要加强',
      'need-strengthen': '需要复习',
      'good': '已改善'
    }
    return statusMap[status] || '掌握较好'
  }

  const getKnowledgeStatusType = (status: string) => {
    const typeMap: Record<string, 'success' | 'warning' | 'error' | 'ai' | 'default' | 'info'> = {
      'improved': 'success',
      'warning': 'warning',
      'need-strengthen': 'error',
      'good': 'success'
    }
    return typeMap[status] || 'success'
  }

  const mockWrongQuestions = useMemo(() => {
    const questions = [
      {
        id: 1,
        title: '解方程：4x - 3 = 9',
        userAnswer: 'x = 2',
        correctAnswer: 'x = 3',
        reason: '移项后计算不完整'
      },
      {
        id: 2,
        title: '判断二次函数顶点坐标',
        userAnswer: '顶点为 (1, -2)',
        correctAnswer: '顶点为 (-1, 2)',
        reason: '符号判断错误'
      },
      {
        id: 3,
        title: '几何证明步骤补全',
        userAnswer: '缺少理由',
        correctAnswer: '需补充全等判定依据',
        reason: '证明步骤遗漏'
      },
      {
        id: 4,
        title: '计算一元二次方程的判别式',
        userAnswer: 'Δ = 4',
        correctAnswer: 'Δ = 16',
        reason: '系数计算错误'
      },
      {
        id: 5,
        title: '求函数的定义域',
        userAnswer: 'x > 0',
        correctAnswer: 'x ≥ 0',
        reason: '边界判断错误'
      }
    ]
    return questions.slice(0, Math.min(safeWrong, questions.length))
  }, [safeWrong])

  const aiReviewAdvice = useMemo(() => {
    if (accuracy >= 85) {
      return '整体掌握较好，可以进入下一阶段练习。'
    } else if (accuracy >= 60) {
      return '基础掌握基本稳定，但仍需要针对错题知识点做二次强化。'
    } else {
      return '本套卷暴露出较多薄弱点，建议先回到知识点专项练习，再进行整卷练习。'
    }
  }, [accuracy])

  const handleClose = () => {
    navigate('/home')
  }

  const handlePracticeAgain = () => {
    if (isPaperResult) {
      navigate(`/practice/1?from=practice-result&type=paper&source=${source || 'custom-paper'}&returnTo=knowledge-practice&paperId=${paperId}&paperTitle=${paperTitle}&paperType=${paperType}&count=${safeCount}`)
    } else {
      navigate(`/practice/1?from=practice-result&type=similar&count=${safeCount}`)
    }
  }

  const handleViewMistake = () => {
    navigate('/mistake/1')
  }

  const handleViewPaperReview = () => {
    const params = new URLSearchParams({
      paperId: paperId || '',
      paperTitle: paperTitle || '',
      paperType: paperType || '',
      count: String(safeCount),
      correct: String(safeCorrect),
      wrong: String(safeWrong),
      source: source || '',
      returnTo: 'practice-result',
      knowledgeName: knowledgeName || '',
      chapterName: ''
    })
    navigate(`/paper-review?${params.toString()}`)
  }

  const handleBackToCenter = () => {
    if (returnTo === 'knowledge-practice') {
      navigate('/knowledge-practice')
    } else {
      navigate('/practice')
    }
  }

  const handleBackToHome = () => {
    navigate('/home')
  }

  if (isPaperResult) {
    return (
      <div className="min-h-screen bg-[#F6F8FB]">
        <div className="flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-sm border-b border-gray-100">
          <button
            type="button"
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1 text-center">
            <span className="text-gray-800 font-medium">试卷练习结果</span>
          </div>
          <div className="w-10"></div>
        </div>

        <div className="px-4 py-6">
          <AppCard className="mb-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-gray-900 font-bold text-lg mb-1">{paperTitle || '练习卷'}</h3>
                <div className="flex items-center gap-2">
                  <StatusTag type="info">{getPaperTypeName(paperType)}</StatusTag>
                  {practiceGoal && <span className="text-gray-500 text-xs">{practiceGoal}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1 text-gray-500 text-xs">
                <Clock className="w-3 h-3" />
                <span>{time || '--'} 分钟</span>
              </div>
            </div>
            <div className="flex gap-4 text-sm">
              <span className="text-gray-500">难度：</span>
              <span className="text-gray-800 font-medium">{difficulty || '中等'}</span>
            </div>
          </AppCard>

          <AppCard className="mb-4">
            <h3 className="text-gray-900 font-semibold flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-primary-500" />
              结果概览
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <p className="text-gray-500 text-xs mb-1">本套试卷</p>
                <p className="text-gray-800 font-bold text-xl">{safeCount} 道题</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-xl">
                <p className="text-gray-500 text-xs mb-1">答对</p>
                <p className="text-green-600 font-bold text-xl">{safeCorrect} 道</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-xl">
                <p className="text-gray-500 text-xs mb-1">答错</p>
                <p className="text-red-600 font-bold text-xl">{safeWrong} 道</p>
              </div>
              <div className="text-center p-3 bg-primary-50 rounded-xl">
                <p className="text-gray-500 text-xs mb-1">正确率</p>
                <p className="text-primary-600 font-bold text-2xl">{accuracy}%</p>
              </div>
            </div>
          </AppCard>

          <AppCard className="mb-4">
            <h3 className="text-gray-900 font-semibold flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-green-600" />
              知识点表现
            </h3>
            <div className="space-y-2">
              {knowledgeList.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">{item.name}</span>
                  <StatusTag type={getKnowledgeStatusType(item.status)}>{getKnowledgeStatusText(item.status)}</StatusTag>
                </div>
              ))}
            </div>
          </AppCard>

          <AppCard className="mb-4">
            <h3 className="text-gray-900 font-semibold flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-red-500" />
              本卷错题回顾
            </h3>
            {safeWrong > 0 ? (
              <div className="space-y-3">
                {mockWrongQuestions.map((question) => (
                  <div key={question.id} className="p-3 bg-gray-50 rounded-xl">
                    <div className="mb-2">
                      <p className="text-gray-500 text-xs">题目</p>
                      <p className="text-gray-800 font-medium">{question.title}</p>
                    </div>
                    <div className="flex gap-4 mb-2">
                      <div className="flex-1">
                        <p className="text-gray-500 text-xs">我的答案</p>
                        <p className="text-red-600 font-mono text-sm">{question.userAnswer}</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-500 text-xs">正确答案</p>
                        <p className="text-green-600 font-mono text-sm">{question.correctAnswer}</p>
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs">错因：{question.reason}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center bg-green-50 rounded-xl">
                <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
                <p className="text-green-700 font-medium">本套卷没有错题，继续保持。</p>
              </div>
            )}
          </AppCard>

          <AppCard className="mb-6">
            <h3 className="text-gray-900 font-semibold flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              AI 复盘建议
            </h3>
            <div className="p-4 bg-blue-50 rounded-xl">
              <p className="text-blue-700 text-sm leading-relaxed">{aiReviewAdvice}</p>
            </div>
          </AppCard>

          <AppCard className="mb-6">
            <h3 className="text-gray-900 font-semibold mb-4">接下来你可以</h3>
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleViewPaperReview}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-gray-900 font-medium">查看本卷错题</p>
                  <p className="text-gray-500 text-xs">回顾本套卷中的所有错题</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button
                type="button"
                onClick={handlePracticeAgain}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-gray-900 font-medium">再练一套</p>
                  <p className="text-gray-500 text-xs">生成新的练习卷</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button
                type="button"
                onClick={handleBackToCenter}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-gray-900 font-medium">返回练习中心</p>
                  <p className="text-gray-500 text-xs">选择其他练习方式</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </AppCard>
        </div>

        <div className="px-4 py-4 pb-[max(env(safe-area-inset-bottom),20px)] bg-white border-t border-gray-100">
          <div className="flex gap-3">
            <div className="flex-1">
              <SecondaryButton className="w-full" onClick={handleBackToCenter}>
                返回练习中心
              </SecondaryButton>
            </div>
            <div className="flex-1">
              <PrimaryButton className="w-full" onClick={handlePracticeAgain}>
                再练一套
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F6F8FB]">
      <div className="flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <button
          type="button"
          onClick={handleClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1 text-center">
          <span className="text-gray-800 font-medium">练习结果</span>
        </div>
        <div className="w-10"></div>
      </div>

      <div className="px-4 py-8">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">练习完成</h1>
          <p className="text-gray-600">你完成了本次举一反三练习</p>
        </div>

        <AppCard className="mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-1">本次练习</p>
              <p className="text-gray-800 font-bold text-xl">{safeCount} 道题</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-1">答对</p>
              <p className="text-green-600 font-bold text-xl">{safeCorrect} 道</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-1">答错</p>
              <p className="text-red-600 font-bold text-xl">{safeWrong} 道</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-1">正确率</p>
              <p className="text-primary-600 font-bold text-2xl">{accuracy}%</p>
            </div>
          </div>
        </AppCard>

        <AppCard className="mb-4">
          <h3 className="text-gray-900 font-semibold flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-green-600" />
            本次表现
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <StatusTag type="success">已改善</StatusTag>
              <span className="text-gray-700">一元一次方程移项</span>
            </div>
            <div className="flex items-center gap-2">
              <StatusTag type="warning">仍需注意</StatusTag>
              <span className="text-gray-700">符号变化</span>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl mt-3">
              <p className="text-blue-700 text-sm">
                <span className="font-medium">AI 建议：</span>
                {accuracy >= 80
                  ? '表现良好，可尝试更复杂的方程题型'
                  : '继续练习 2 道同类题，巩固移项计算'}
              </p>
            </div>
          </div>
        </AppCard>

        <AppCard className="mb-6">
          <h3 className="text-gray-900 font-semibold flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-red-500" />
            错误回顾
          </h3>
          <div className="p-3 bg-gray-50 rounded-xl">
            <div className="mb-2">
              <p className="text-gray-500 text-xs">题目</p>
              <p className="text-gray-800">解方程：4x - 3 = 9</p>
            </div>
            <div className="flex gap-4">
              <div>
                <p className="text-gray-500 text-xs">你的答案</p>
                <p className="text-red-600 font-mono">x = 2</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">正确答案</p>
                <p className="text-green-600 font-mono">x = 3</p>
              </div>
            </div>
            <p className="text-gray-500 text-xs mt-2">错误原因：移项后计算不完整</p>
          </div>
        </AppCard>

        <AppCard className="mb-6">
          <h3 className="text-gray-900 font-semibold mb-4">接下来你可以</h3>
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleViewMistake}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-gray-900 font-medium">查看原错题</p>
                <p className="text-gray-500 text-xs">回到错题详情页复盘</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              type="button"
              onClick={handleBackToCenter}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-gray-900 font-medium">返回练习中心</p>
                <p className="text-gray-500 text-xs">选择其他练习方式</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              type="button"
              onClick={handleBackToHome}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-primary-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-gray-900 font-medium">{returnLabel}</p>
                <p className="text-gray-500 text-xs">回到主页面</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </AppCard>
      </div>

      <div className="px-4 py-4 pb-[max(env(safe-area-inset-bottom),20px)] bg-white border-t border-gray-100">
        <div className="flex gap-3">
          <div className="flex-1">
            <SecondaryButton className="w-full" onClick={handleBackToHome}>
              {returnLabel}
            </SecondaryButton>
          </div>
          <div className="flex-1">
            <PrimaryButton className="w-full" onClick={handlePracticeAgain}>
              再练一组
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  )
}