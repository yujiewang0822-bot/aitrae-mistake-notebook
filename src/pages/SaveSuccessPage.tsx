import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, X, BookOpen, PenTool, ChevronRight } from 'lucide-react'
import AppCard from '../components/ui/AppCard'
import PrimaryButton from '../components/ui/PrimaryButton'
import SecondaryButton from '../components/ui/SecondaryButton'
import StatusTag from '../components/ui/StatusTag'

interface SavedQuestion {
  id: number
  title: string
  knowledgePoints: string[]
  judgment: '正确' | '错误' | '部分正确'
  analysis: string
}

const mockSavedQuestions: SavedQuestion[] = [
  {
    id: 1,
    title: '解方程 3x - 5 = 10',
    knowledgePoints: ['一元一次方程', '移项'],
    judgment: '正确',
    analysis: '可作为易错题记录'
  },
  {
    id: 2,
    title: '二次函数 y = x² - 4x + 3 的顶点坐标',
    knowledgePoints: ['二次函数', '顶点坐标'],
    judgment: '正确',
    analysis: '顶点公式掌握较好，建议关注图像平移'
  },
  {
    id: 3,
    title: '几何证明中添加辅助线完成全等证明',
    knowledgePoints: ['全等三角形', '辅助线'],
    judgment: '错误',
    analysis: '证明步骤遗漏，辅助线构造意识不足'
  },
  {
    id: 4,
    title: '分式方程化简并检验增根',
    knowledgePoints: ['分式方程', '增根检验'],
    judgment: '部分正确',
    analysis: '计算结果正确，但漏写检验步骤'
  },
  {
    id: 5,
    title: '一次函数图像识别',
    knowledgePoints: ['一次函数', '图像识别'],
    judgment: '部分正确',
    analysis: '图像信息提取不完整，建议关注斜率和截距'
  },
  {
    id: 6,
    title: '解不等式组 {2x + 1 > 5, 3x - 2 < 10}',
    knowledgePoints: ['不等式组', '解集'],
    judgment: '部分正确',
    analysis: '只求出了第一个不等式的解'
  },
  {
    id: 7,
    title: '投掷两枚硬币，至少一枚正面的概率',
    knowledgePoints: ['概率', '古典概型'],
    judgment: '错误',
    analysis: '考虑不全面，遗漏了部分情况'
  },
  {
    id: 8,
    title: '证明圆的切线垂直于过切点的半径',
    knowledgePoints: ['圆', '切线'],
    judgment: '部分正确',
    analysis: '结论正确，但缺少严谨的证明过程'
  },
  {
    id: 9,
    title: '计算 sin(30°) + cos(60°)',
    knowledgePoints: ['三角函数', '特殊角'],
    judgment: '正确',
    analysis: '三角函数值掌握准确，计算正确'
  },
  {
    id: 10,
    title: '等差数列 2, 5, 8, ... 的第10项',
    knowledgePoints: ['等差数列', '通项公式'],
    judgment: '正确',
    analysis: '等差数列通项公式应用正确'
  }
]

export default function SaveSuccessPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // 安全读取 sessionStorage 数据
  const getSafeSessionArray = (key: string): unknown[] => {
    try {
      const stored = sessionStorage.getItem(key)
      const parsed = stored ? JSON.parse(stored) : []
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  // 读取处理统计数据
  const processStats = useMemo(() => {
    // 安全读取 sessionStorage
    const savedFromStorage = getSafeSessionArray('savedQuestions')
    const pendingFromStorage = getSafeSessionArray('pendingQuestions')
    const skippedFromStorage = getSafeSessionArray('skippedQuestions')
    
    let storedTotal: number | null = null
    try {
      const totalStr = sessionStorage.getItem('processedTotal')
      storedTotal = totalStr ? parseInt(totalStr, 10) : null
    } catch {
      storedTotal = null
    }

    // 如果 sessionStorage 有数据，使用它
    if (savedFromStorage.length > 0 || pendingFromStorage.length > 0 || skippedFromStorage.length > 0) {
      return {
        total: storedTotal || savedFromStorage.length + pendingFromStorage.length + skippedFromStorage.length,
        saved: savedFromStorage,
        pending: pendingFromStorage,
        skipped: skippedFromStorage
      }
    }

    // 从 URL 参数读取
    const total = parseInt(searchParams.get('total') || '0', 10)
    const savedCount = parseInt(searchParams.get('saved') || '0', 10)
    const pendingCount = parseInt(searchParams.get('pending') || '0', 10)
    const skippedCount = parseInt(searchParams.get('skipped') || '0', 10)

    // 根据 URL 参数生成 mock 数据
    const saved = savedCount > 0 ? mockSavedQuestions.slice(0, savedCount) : []
    const pending = pendingCount > 0 ? mockSavedQuestions.slice(savedCount, savedCount + pendingCount) : []
    const skipped = skippedCount > 0 ? mockSavedQuestions.slice(savedCount + pendingCount, savedCount + pendingCount + skippedCount) : []

    return { total: total || savedCount + pendingCount + skippedCount, saved, pending, skipped }
  }, [searchParams])

  // 安全兜底所有列表
  const safeSavedList = Array.isArray(processStats.saved) ? processStats.saved : []
  const safePendingList = Array.isArray(processStats.pending) ? processStats.pending : []
  const safeSkippedList = Array.isArray(processStats.skipped) ? processStats.skipped : []
  const processedTotal = typeof processStats.total === 'number' ? processStats.total : 0

  // 转换为统一格式的题目列表
  const savedList: SavedQuestion[] = safeSavedList.map((item, index) => {
    const q = item as Record<string, unknown>
    return {
      id: (q.id as number) || index + 1,
      title: (q.title as string) || `第 ${index + 1} 题`,
      knowledgePoints: Array.isArray(q.knowledgePoints) ? (q.knowledgePoints as string[]) : ['综合应用'],
      judgment: (q.judgment as '正确' | '错误' | '部分正确') || '部分正确',
      analysis: (q.analysis as string) || '待分析'
    }
  })

  const previewList = savedList.slice(0, 3)
  const remainingCount = Math.max(0, savedList.length - 3)

  // 举一反三推荐数量：基于保存题数，最多3道
  const recommendationCount = savedList.length > 0 ? Math.min(3, savedList.length) : 0

  const handleClose = () => {
    navigate('/home')
  }

  const handleViewDetail = () => {
    navigate(`/mistake/1?from=save-success&batchCount=${savedList.length}`)
  }

  const handlePractice = () => {
    navigate(`/practice/1?from=save-success&type=similar&count=${recommendationCount}`)
  }

  const handleGoToMistakes = () => {
    navigate('/mistakes')
  }

  const handleContinueUpload = () => {
    navigate('/upload')
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
          <span className="text-gray-800 font-medium">处理完成</span>
        </div>
        <div className="w-10"></div>
      </div>

      <div className="px-4 py-8">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">处理完成</h1>
          <p className="text-gray-600 mb-2">
            本次共处理 <span className="font-semibold text-gray-900">{processedTotal}</span> 道题，已保存 <span className="font-semibold text-green-600">{savedList.length}</span> 道到错题本。
          </p>
          <p className="text-gray-400 text-sm">系统将根据掌握情况安排后续复习</p>
        </div>

        <AppCard className="mb-6">
          <h3 className="text-gray-900 font-semibold mb-4">处理结果摘要</h3>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <p className="text-gray-500 text-xs mb-1">本次处理</p>
              <p className="text-gray-800 font-bold text-lg">{processedTotal}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">已保存</p>
              <p className="text-green-600 font-bold text-lg">{savedList.length}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">已暂存</p>
              <p className="text-yellow-600 font-bold text-lg">{safePendingList.length}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">已跳过</p>
              <p className="text-gray-400 font-bold text-lg">{safeSkippedList.length}</p>
            </div>
          </div>
        </AppCard>

        <AppCard className="mb-6">
          <h3 className="text-gray-900 font-semibold mb-4">本次保存题目</h3>
          {savedList.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-400">本次暂无保存题目</p>
            </div>
          ) : (
            <div className="space-y-3">
              {previewList.map((q: SavedQuestion, idx: number) => (
                <div
                  key={q.id}
                  className="p-3 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-gray-800 text-sm font-medium flex-1">
                      {idx + 1}. {q.title}
                    </p>
                    <StatusTag type={q.judgment === '错误' ? 'error' : q.judgment === '部分正确' ? 'warning' : 'success'}>
                      {q.judgment}
                    </StatusTag>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {q.knowledgePoints.map((kp: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 text-xs bg-white text-gray-600 rounded-full border border-gray-200">
                        {kp}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-500 text-xs mt-2">{q.analysis}</p>
                </div>
              ))}
              {remainingCount > 0 && (
                <div className="text-center text-gray-400 text-sm py-2">
                  还有 {remainingCount} 道题已加入错题本
                </div>
              )}
            </div>
          )}
        </AppCard>

        <AppCard className="mb-6">
          <h3 className="text-gray-900 font-semibold mb-4">接下来你可以</h3>
          <div className="space-y-3">
            {savedList.length > 0 ? (
              <button
                type="button"
                onClick={handleViewDetail}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-gray-900 font-medium">查看错题详情</p>
                  <p className="text-gray-500 text-xs">查看本次保存题目的完整解析</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            ) : (
              <div className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 opacity-60">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-gray-400 font-medium">查看错题详情</p>
                  <p className="text-gray-300 text-xs">暂无已保存题目可查看</p>
                </div>
              </div>
            )}

            {savedList.length > 0 ? (
              <button
                type="button"
                onClick={handlePractice}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <PenTool className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-gray-900 font-medium">开始举一反三</p>
                  <p className="text-gray-500 text-xs">练习同类知识点题目，巩固掌握</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            ) : (
              <div className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 opacity-60">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <PenTool className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-gray-400 font-medium">开始举一反三</p>
                  <p className="text-gray-300 text-xs">暂无已保存错题，无法生成练习</p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleGoToMistakes}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-gray-900 font-medium">返回错题本</p>
                <p className="text-gray-500 text-xs">查看全部错题列表</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </AppCard>
      </div>

      <div className="px-4 py-4 pb-[max(env(safe-area-inset-bottom),20px)] bg-white border-t border-gray-100">
        <div className="flex gap-3">
          <div className="flex-1">
            <SecondaryButton className="w-full" onClick={handleClose}>
              返回首页
            </SecondaryButton>
          </div>
          <div className="flex-1">
            <PrimaryButton className="w-full" onClick={handleContinueUpload}>
              继续上传
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  )
}
