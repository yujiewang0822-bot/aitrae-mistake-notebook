import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { X, BookOpen, Target, ChevronRight, AlertCircle, Sparkles, CheckCircle, Tag } from 'lucide-react'
import AppCard from '../components/ui/AppCard'
import PrimaryButton from '../components/ui/PrimaryButton'
import SecondaryButton from '../components/ui/SecondaryButton'
import StatusTag from '../components/ui/StatusTag'

export default function PaperReviewPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const paperId = searchParams.get('paperId')
  const paperTitle = searchParams.get('paperTitle')
  const paperType = searchParams.get('paperType')
  const source = searchParams.get('source')
  const returnTo = searchParams.get('returnTo')
  const knowledgeName = searchParams.get('knowledgeName')
  const chapterName = searchParams.get('chapterName')

  const safeCount = Math.max(0, parseInt(searchParams.get('count') || '0', 10))
  const correctParam = searchParams.get('correct')
  const rawCorrect = correctParam !== null ? Math.max(0, parseInt(correctParam, 10)) : 0
  const safeCorrect = Math.min(rawCorrect, safeCount)
  const safeWrong = safeCount - safeCorrect

  const getPaperTypeName = (type: string | null) => {
    const typeMap: Record<string, string> = {
      'exam': '考试模拟卷',
      'custom': '自定义练习卷',
      'weak-point': '薄弱知识点专项卷',
      'similar': '错题同类强化卷'
    }
    return typeMap[type || ''] || '练习卷'
  }

  const mockWrongQuestions = useMemo(() => {
    const questions = [
      {
        id: 1,
        title: '解方程：4x - 3 = 9',
        userAnswer: 'x = 2',
        correctAnswer: 'x = 3',
        reason: '移项后计算不完整',
        knowledge: '移项、等式变形',
        analysis: '本题的关键是移项后需要继续完成除法步骤，不能停在中间结果。'
      },
      {
        id: 2,
        title: '判断二次函数顶点坐标',
        userAnswer: '顶点为 (1, -2)',
        correctAnswer: '顶点为 (-1, 2)',
        reason: '符号判断错误',
        knowledge: '顶点坐标、函数图像',
        analysis: '顶点式中的符号容易反向判断，需要注意 (x - h)^2 + k 中顶点为 (h, k)。'
      },
      {
        id: 3,
        title: '几何证明步骤补全',
        userAnswer: '缺少理由',
        correctAnswer: '需补充全等判定依据',
        reason: '证明步骤遗漏',
        knowledge: '全等三角形、证明步骤表达',
        analysis: '几何证明不仅要写结论，还要补充推理依据，否则证明链条不完整。'
      },
      {
        id: 4,
        title: '计算一元二次方程的判别式',
        userAnswer: 'Δ = 4',
        correctAnswer: 'Δ = 16',
        reason: '系数计算错误',
        knowledge: '判别式、二次方程',
        analysis: '判别式公式为 Δ = b² - 4ac，计算时需要注意系数的正确代入。'
      },
      {
        id: 5,
        title: '求函数的定义域',
        userAnswer: 'x > 0',
        correctAnswer: 'x ≥ 0',
        reason: '边界判断错误',
        knowledge: '定义域、函数概念',
        analysis: '平方根函数的定义域要求被开方数非负，即 x ≥ 0。'
      }
    ]
    return questions.slice(0, Math.min(safeWrong, questions.length))
  }, [safeWrong])

  const mistakeCategories = useMemo(() => {
    const categoryMap: Record<string, number> = {}
    mockWrongQuestions.forEach(q => {
      categoryMap[q.reason] = (categoryMap[q.reason] || 0) + 1
    })
    return Object.entries(categoryMap).map(([reason, count]) => ({ reason, count }))
  }, [mockWrongQuestions])

  const aiReviewAdvice = useMemo(() => {
    if (safeWrong === 0) {
      return '本套卷掌握情况较好，可以进入下一阶段练习。'
    } else if (safeWrong <= 2) {
      return '建议针对本卷错题做一次同类强化，避免同类错误重复出现。'
    } else {
      return '建议先回到知识点专项练习，优先补齐高频错因，再进行整卷训练。'
    }
  }, [safeWrong])

  const handleClose = () => {
    navigate('/knowledge-practice')
  }

  const handlePracticeWrong = () => {
    navigate(`/practice/1?from=paper-review&type=paper&source=paper-wrong-review&returnTo=paper-review&paperId=${paperId}&paperTitle=${paperTitle}错题强化&paperType=wrong-review&count=${safeWrong || 3}`)
  }

  const handleBackToResult = () => {
    if (returnTo === 'practice-result') {
      const params = new URLSearchParams({
        type: 'paper',
        source: source || 'recent-paper',
        paperId: paperId || '',
        paperTitle: paperTitle || '',
        paperType: paperType || '',
        count: String(safeCount),
        correct: String(safeCorrect),
        wrong: String(safeWrong),
        returnTo: 'knowledge-practice'
      })
      navigate(`/practice-result?${params.toString()}`)
    } else {
      navigate('/practice-result')
    }
  }

  const handleBackToCenter = () => {
    navigate('/knowledge-practice')
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
          <span className="text-gray-800 font-medium">本卷错题回顾</span>
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
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">本套试卷：</span>
              <span className="text-gray-800 font-medium">{safeCount} 道题</span>
            </div>
            <div>
              <span className="text-gray-500">答错：</span>
              <span className="text-red-600 font-medium">{safeWrong} 道</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-500">关联章节：</span>
              <span className="text-gray-800">{chapterName || '根据本卷范围生成'}</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-500">关联知识点：</span>
              <span className="text-gray-800">{knowledgeName || '根据错题自动归因'}</span>
            </div>
          </div>
        </AppCard>

        {safeWrong > 0 && (
          <AppCard className="mb-4">
            <h3 className="text-gray-900 font-semibold flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-primary-500" />
              错因归类
            </h3>
            <div className="flex flex-wrap gap-2">
              {mistakeCategories.map((cat, index) => (
                <span key={index} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                  {cat.reason}：{cat.count} 道
                </span>
              ))}
            </div>
          </AppCard>
        )}

        {safeWrong > 0 ? (
          <AppCard className="mb-4">
            <h3 className="text-gray-900 font-semibold flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 text-red-500" />
              错题列表
            </h3>
            <div className="space-y-4">
              {mockWrongQuestions.map((question) => (
                <div key={question.id} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-medium">
                      {question.id}
                    </span>
                    <span className="text-gray-700 font-medium">错题 {question.id}</span>
                  </div>
                  <div className="mb-2">
                    <p className="text-gray-500 text-xs">题目</p>
                    <p className="text-gray-800">{question.title}</p>
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
                  <div className="mb-2">
                    <p className="text-gray-500 text-xs">错因</p>
                    <p className="text-amber-600 text-sm">{question.reason}</p>
                  </div>
                  <div className="mb-3">
                    <p className="text-gray-500 text-xs">关联知识点</p>
                    <p className="text-blue-600 text-sm">{question.knowledge}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-gray-500 text-xs mb-1">AI 解析</p>
                    <p className="text-blue-700 text-sm">{question.analysis}</p>
                  </div>
                </div>
              ))}
            </div>
          </AppCard>
        ) : (
          <AppCard className="mb-4">
            <div className="p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-gray-900 font-bold text-lg mb-2">本卷没有错题</h3>
              <p className="text-gray-500">继续保持，再接再厉！</p>
            </div>
          </AppCard>
        )}

        {safeWrong === 0 && (
          <AppCard className="mb-4">
            <h3 className="text-gray-900 font-semibold flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-primary-500" />
              错因归类
            </h3>
            <p className="text-gray-500 text-center py-4">暂无错因归类。</p>
          </AppCard>
        )}

        <AppCard className="mb-6">
          <h3 className="text-gray-900 font-semibold flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            AI 复习建议
          </h3>
          <div className="p-4 bg-blue-50 rounded-xl">
            <p className="text-blue-700 text-sm leading-relaxed">{aiReviewAdvice}</p>
          </div>
        </AppCard>

        <AppCard className="mb-6">
          <h3 className="text-gray-900 font-semibold mb-4">接下来你可以</h3>
          {safeWrong > 0 && (
            <button
              type="button"
              onClick={handlePracticeWrong}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors mb-3"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-gray-900 font-medium">针对错题再练</p>
                <p className="text-gray-500 text-xs">生成同类强化练习题</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          )}

          <button
            type="button"
            onClick={handleBackToResult}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors mb-3"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-gray-900 font-medium">返回试卷结果</p>
              <p className="text-gray-500 text-xs">查看完整练习报告</p>
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
        </AppCard>
      </div>

      <div className="px-4 py-4 pb-[max(env(safe-area-inset-bottom),20px)] bg-white border-t border-gray-100">
        <div className="flex gap-3">
          <div className="flex-1">
            <SecondaryButton className="w-full" onClick={handleBackToCenter}>
              返回练习中心
            </SecondaryButton>
          </div>
          {safeWrong > 0 && (
            <div className="flex-1">
              <PrimaryButton className="w-full" onClick={handlePracticeWrong}>
                针对错题再练
              </PrimaryButton>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}