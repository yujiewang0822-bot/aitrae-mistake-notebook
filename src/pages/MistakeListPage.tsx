import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { BookOpen, Tags, AlertCircle, FileText, ChevronRight } from 'lucide-react'
import BottomNav from '../components/layout/BottomNav'
import AppCard from '../components/ui/AppCard'
import StatusTag from '../components/ui/StatusTag'
import PrimaryButton from '../components/ui/PrimaryButton'
import MistakeCard from '../components/business/MistakeCard'
import Modal from '../components/ui/Modal'
import Toast from '../components/ui/Toast'
import { mistakes } from '../data/mockData'

interface Chapter {
  id: number
  name: string
  mistakeCount: number
  mastery: number
  commonErrors: string[]
  statusBreakdown: {
    pending: number
    mastered: number
    incomplete: number
  }
  lessons: { id: number; name: string; count: number }[]
}

interface Source {
  id: number
  name: string
  mistakeCount: number
  description: string
  statusBreakdown?: {
    pending?: number
    mastered?: number
    incomplete?: number
  }
}

interface KnowledgePoint {
  id: number
  name: string
  mistakeCount: number
  description: string
  mastery: number
}

interface ErrorType {
  id: number
  name: string
  mistakeCount: number
  description: string
}

interface IncompleteMistake {
  id: number
  question: string
  status: string
  description: string
}

const chapters: Chapter[] = [
  {
    id: 1,
    name: '第一单元 一元一次方程',
    mistakeCount: 12,
    mastery: 70,
    commonErrors: ['移项符号错误', '计算错误'],
    statusBreakdown: { pending: 4, mastered: 8, incomplete: 1 },
    lessons: [
      { id: 1, name: '第1课 等式性质', count: 3 },
      { id: 2, name: '第2课 移项与合并同类项', count: 5 },
      { id: 3, name: '第3课 方程应用', count: 4 }
    ]
  },
  {
    id: 2,
    name: '第二单元 二次函数',
    mistakeCount: 9,
    mastery: 62,
    commonErrors: ['顶点坐标判断', '图像理解错误'],
    statusBreakdown: { pending: 3, mastered: 6, incomplete: 1 },
    lessons: [
      { id: 4, name: '第1课 函数图像', count: 3 },
      { id: 5, name: '第2课 顶点坐标', count: 4 },
      { id: 6, name: '第3课 图像平移', count: 2 }
    ]
  },
  {
    id: 3,
    name: '第三单元 几何证明',
    mistakeCount: 7,
    mastery: 55,
    commonErrors: ['辅助线思路', '证明步骤遗漏'],
    statusBreakdown: { pending: 5, mastered: 2, incomplete: 1 },
    lessons: [
      { id: 7, name: '第1课 全等三角形', count: 3 },
      { id: 8, name: '第2课 辅助线构造', count: 2 },
      { id: 9, name: '第3课 证明步骤表达', count: 2 }
    ]
  }
]

const sources: Source[] = [
  {
    id: 1,
    name: '期中模拟卷 01',
    mistakeCount: 10,
    description: '覆盖3个单元',
    statusBreakdown: { pending: 4, mastered: 6 }
  },
  {
    id: 2,
    name: '同步练习册 P32-P38',
    mistakeCount: 8,
    description: '集中在一元一次方程',
    statusBreakdown: { incomplete: 1, pending: 3 }
  },
  {
    id: 3,
    name: '课本习题 第三章',
    mistakeCount: 6,
    description: '几何证明相关',
    statusBreakdown: { pending: 5 }
  }
]

const knowledgePoints: KnowledgePoint[] = [
  { id: 1, name: '移项与符号变化', mistakeCount: 8, description: '主要集中在第一单元', mastery: 65 },
  { id: 2, name: '二次函数顶点坐标', mistakeCount: 6, description: '主要集中在第二单元', mastery: 60 },
  { id: 3, name: '几何辅助线', mistakeCount: 5, description: '主要集中在第三单元', mastery: 52 }
]

const errorTypes: ErrorType[] = [
  { id: 1, name: '计算错误', mistakeCount: 16, description: '多发生于方程和函数题' },
  { id: 2, name: '概念理解错误', mistakeCount: 10, description: '集中在二次函数' },
  { id: 3, name: '审题错误', mistakeCount: 8, description: '多来自应用题' },
  { id: 4, name: '步骤遗漏', mistakeCount: 11, description: '多发生于几何证明' }
]

const incompleteMistakes: IncompleteMistake[] = [
  { id: 1, question: '解方程 3x - 5 = 10', status: '待完善', description: 'AI 已识别，等待确认章节、知识点和错因' }
]

const grades = ['初一', '初二', '初三', '高一', '高二', '高三']
const versions = ['人教版', '北师大版', '苏科版', '浙教版', '沪教版', '湘教版', '自定义']

const textbookBookOptions = {
  junior: ['上册', '下册', '专题复习', '校本讲义', '自定义'],
  senior: ['必修第一册', '必修第二册', '选择性必修第一册', '选择性必修第二册', '选择性必修第三册', '专题复习', '校本讲义', '自定义']
}

const chapterMap: Record<string, string[]> = {
  '初二-上册-人教版': [
    '第一单元 一元一次方程',
    '第二单元 二次函数',
    '第三单元 几何证明'
  ],
  '高一-必修第一册-人教版': [
    '第一章 集合与常用逻辑用语',
    '第二章 一元二次函数、方程和不等式',
    '第三章 函数的概念与性质'
  ],
  '初三-下册-北师大版': [
    '第一单元 反比例函数',
    '第二单元 相似三角形',
    '第三单元 圆'
  ],
  '高二-选择性必修第一册-人教版': [
    '第一章 空间向量与立体几何',
    '第二章 直线和圆的方程',
    '第三章 圆锥曲线的方程'
  ]
}

const getVolumesByGrade = (grade: string): string[] => {
  const juniorGrades = ['初一', '初二', '初三']
  return juniorGrades.includes(grade) ? textbookBookOptions.junior : textbookBookOptions.senior
}

const getChapters = (grade: string, volume: string, version: string): string[] => {
  const key = `${grade}-${volume === '自定义' ? '上册' : volume}-${version === '自定义' ? '人教版' : version}`
  return chapterMap[key] || []
}

export default function MistakeListPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState('chapter')
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null)
  const [selectedSource, setSelectedSource] = useState<number | null>(null)
  const [selectedKnowledgePoint, setSelectedKnowledgePoint] = useState<number | null>(null)
  const [selectedErrorType, setSelectedErrorType] = useState<number | null>(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [showTextbookModal, setShowTextbookModal] = useState(false)
  // 章节图谱 Modal 状态
  const [showChapterModal, setShowChapterModal] = useState(false)
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set())
  
  const [grade, setGrade] = useState('初二')
  const [volume, setVolume] = useState('上册')
  const [version, setVersion] = useState('人教版')
  const [customVersion, setCustomVersion] = useState('')
  const [customVolume, setCustomVolume] = useState('')
  
  const [pageSize] = useState(5)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  // 从 URL 参数读取 filter
  useEffect(() => {
    const filterParam = searchParams.get('filter')
    if (filterParam) {
      switch (filterParam) {
        case 'all':
          setActiveTab('all')
          setFilterStatus('all')
          break
        case 'mastered':
          setActiveTab('all')
          setFilterStatus('mastered')
          break
        case 'review':
          setActiveTab('all')
          setFilterStatus('pending')
          break
        default:
          break
      }
    }
  }, [searchParams])

  const handleGradeChange = (newGrade: string) => {
    const newVolumes = getVolumesByGrade(newGrade)
    if (!newVolumes.includes(volume)) {
      setVolume(newVolumes[0])
      setCustomVolume('')
    }
    setGrade(newGrade)
  }

  const resetPagination = () => {
    setCurrentPage(1)
    setHasMore(true)
  }

  const handleLoadMore = () => {
    if (loading || !hasMore) return
    setLoading(true)
    setTimeout(() => {
      const totalCount = mistakes.length
      const newPage = currentPage + 1
      if (newPage * pageSize >= totalCount) {
        setHasMore(false)
      }
      setCurrentPage(newPage)
      setLoading(false)
    }, 500)
  }

  const toggleChapter = (chapterName: string) => {
    const newExpanded = new Set(expandedChapters)
    if (newExpanded.has(chapterName)) {
      newExpanded.delete(chapterName)
    } else {
      newExpanded.add(chapterName)
    }
    setExpandedChapters(newExpanded)
  }

  const showNotification = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const handleChapterClick = (chapterId: number) => {
    setSelectedChapter(chapterId)
    setSelectedSource(null)
    setSelectedKnowledgePoint(null)
    setSelectedErrorType(null)
    showNotification('已筛选第一单元错题')
  }

  const handleSourceClick = (sourceId: number) => {
    setSelectedSource(sourceId)
    setSelectedChapter(null)
    setSelectedKnowledgePoint(null)
    setSelectedErrorType(null)
    showNotification('已筛选该来源错题')
  }

  const handleKnowledgePointClick = (kpId: number) => {
    setSelectedKnowledgePoint(kpId)
    setSelectedChapter(null)
    setSelectedSource(null)
    setSelectedErrorType(null)
    showNotification('已筛选该知识点错题')
  }

  const handleErrorTypeClick = (etId: number) => {
    setSelectedErrorType(etId)
    setSelectedChapter(null)
    setSelectedSource(null)
    setSelectedKnowledgePoint(null)
    showNotification('已筛选该错因错题')
  }

  const handleMistakeClick = () => {
    navigate('/mistake/m1')
  }

  const handleSaveTextbook = () => {
    if (version === '自定义' && !customVersion.trim()) {
      showNotification('请输入教材版本')
      return
    }
    if (volume === '自定义' && !customVolume.trim()) {
      showNotification('请输入册别')
      return
    }
    const currentChapters = getChapters(grade, volume, version)
    if (currentChapters.length > 0) {
      console.log('当前教材章节:', currentChapters)
    }
    setShowTextbookModal(false)
    showNotification('教材信息已更新')
  }

  const tabs = [
    { key: 'chapter', label: '按章节', icon: <BookOpen className="w-4 h-4" /> },
    { key: 'source', label: '按来源', icon: <FileText className="w-4 h-4" /> },
    { key: 'knowledge', label: '按知识点（AI识别）', icon: <Tags className="w-4 h-4" /> },
    { key: 'error', label: '按错因（AI归因）', icon: <AlertCircle className="w-4 h-4" /> },
    { key: 'all', label: '全部题目', icon: null }
  ]

  const filterStatuses = [
    { key: 'all', label: '全部' },
    { key: 'pending', label: '待复习' },
    { key: 'mastered', label: '已掌握' },
    { key: 'incomplete', label: '待完善' }
  ]

  const displayMistakes = mistakes.slice(0, currentPage * pageSize)

  return (
    <div className="bg-[#F6F8FB] min-h-screen">
      <div className="px-4 pt-4 md:px-0">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">数学错题本</h1>
            <p className="text-sm text-gray-500">按单元、课时和错因管理你的数学错题</p>
          </div>
          {/* 教材信息 - 可点击 */}
          <button
            type="button"
            onClick={() => setShowTextbookModal(true)}
            className="w-full md:w-auto px-3 py-2 bg-white rounded-xl border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-gray-500" />
              <div className="text-left">
                <span className="text-gray-400">当前教材：</span>
                <span>{grade}{volume === '自定义' ? customVolume : volume} · {version === '自定义' ? customVersion : version}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-primary-600">
              <span className="text-xs">切换</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>

        {/* 顶部统计 */}
        <AppCard className="mb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              type="button"
              onClick={() => {
                setActiveTab('all')
                setFilterStatus('all')
                resetPagination()
              }}
              className="text-center hover:bg-gray-50 rounded-lg transition-colors py-2 -my-2"
            >
              <div className="text-2xl font-bold text-gray-900 mb-1 hover:underline underline-offset-2">45</div>
              <span className="text-xs text-gray-500">累计错题</span>
            </button>
            <button
              type="button"
              onClick={() => setShowChapterModal(true)}
              className="text-center hover:bg-gray-50 rounded-lg transition-colors py-2 -my-2"
            >
              <div className="text-2xl font-bold text-primary-600 mb-1 hover:underline underline-offset-2">6</div>
              <span className="text-xs text-gray-500">覆盖章节 →</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('all')
                setFilterStatus('pending')
                resetPagination()
              }}
              className="text-center hover:bg-gray-50 rounded-lg transition-colors py-2 -my-2"
            >
              <div className="text-2xl font-bold text-amber-500 mb-1 hover:underline underline-offset-2">12</div>
              <span className="text-xs text-gray-500">待复习</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('all')
                setFilterStatus('mastered')
                resetPagination()
              }}
              className="text-center hover:bg-gray-50 rounded-lg transition-colors py-2 -my-2"
            >
              <div className="text-2xl font-bold text-green-500 mb-1 hover:underline underline-offset-2">33</div>
              <span className="text-xs text-gray-500">已掌握</span>
            </button>
          </div>
        </AppCard>

        {/* 当前筛选状态提示 - 仅在有筛选条件时显示 */}
        {filterStatus !== 'all' && activeTab === 'all' && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">当前筛选：</span>
                <span className="text-sm font-medium text-blue-700">
                  {filterStatus === 'pending' ? '待复习题目' : '已掌握题目'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('chapter')
                  setFilterStatus('all')
                  resetPagination()
                }}
                className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
              >
                清除筛选
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key)
                setSelectedChapter(null)
                setSelectedSource(null)
                setSelectedKnowledgePoint(null)
                setSelectedErrorType(null)
                resetPagination()
              }}
              className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? 'bg-primary-100 text-primary-700 border border-primary-200'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 按章节视图 - 桌面端两列 */}
        {activeTab === 'chapter' && !selectedChapter && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chapters.map(chapter => (
              <AppCard key={chapter.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-gray-900 font-semibold">{chapter.name}</h4>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm text-gray-600">{chapter.mistakeCount}道错题</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">掌握度</span>
                      <span className="text-xs text-primary-600 font-medium">{chapter.mastery}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-primary-500 h-1.5 rounded-full transition-all"
                        style={{ width: `${chapter.mastery}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {chapter.commonErrors.map((error, idx) => (
                    <StatusTag key={idx} type="info">{error}</StatusTag>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <span>待复习{chapter.statusBreakdown.pending}</span>
                  <span className="text-gray-300">｜</span>
                  <span>已掌握{chapter.statusBreakdown.mastered}</span>
                  <span className="text-gray-300">｜</span>
                  <span>待完善{chapter.statusBreakdown.incomplete}</span>
                </div>
                {/* 课时 */}
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs text-gray-500 mb-2">课时分布</p>
                  <div className="space-y-1">
                    {chapter.lessons.map(lesson => (
                      <div key={lesson.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{lesson.name}</span>
                        <span className="text-gray-500">{lesson.count}道错题</span>
                      </div>
                    ))}
                  </div>
                </div>
                <PrimaryButton className="w-full mt-4" onClick={() => handleChapterClick(chapter.id)}>查看本单元错题</PrimaryButton>
              </AppCard>
            ))}
          </div>
        )}

        {/* 按来源视图 */}
        {activeTab === 'source' && !selectedSource && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sources.map(source => (
              <AppCard key={source.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleSourceClick(source.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-gray-900 font-semibold mb-1">{source.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <span>{source.mistakeCount}道错题</span>
                      <span>｜</span>
                      <span>{source.description}</span>
                    </div>
                    {source.statusBreakdown && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        {source.statusBreakdown.pending !== undefined && <span>待复习{source.statusBreakdown.pending}</span>}
                        {source.statusBreakdown.mastered !== undefined && <><span className="text-gray-300">｜</span><span>已掌握{source.statusBreakdown.mastered}</span></>}
                        {source.statusBreakdown.incomplete !== undefined && <><span className="text-gray-300">｜</span><span>待完善{source.statusBreakdown.incomplete}</span></>}
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </AppCard>
            ))}
          </div>
        )}

        {/* 按知识点视图 */}
        {activeTab === 'knowledge' && !selectedKnowledgePoint && (
          <div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-4">
              <p className="text-blue-700 text-sm">知识点由 AI 根据题目内容初步识别，保存错题时可手动调整。</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {knowledgePoints.map(kp => (
              <AppCard key={kp.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleKnowledgePointClick(kp.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-gray-900 font-semibold mb-1">{kp.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <span>{kp.mistakeCount}题</span>
                      <span>｜</span>
                      <span>{kp.description}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">掌握度{kp.mastery}%</span>
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full">
                        <div
                          className="h-1.5 bg-primary-500 rounded-full"
                          style={{ width: `${kp.mastery}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </AppCard>
            ))}
            </div>
          </div>
        )}

        {/* 按错因视图 */}
        {activeTab === 'error' && !selectedErrorType && (
          <div>
            <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 mb-4">
              <p className="text-orange-700 text-sm">错因由 AI 根据答案和解题过程初步归因，可能存在偏差，保存错题时可手动修正。</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {errorTypes.map(et => (
              <AppCard key={et.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleErrorTypeClick(et.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-gray-900 font-semibold mb-1">{et.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{et.mistakeCount}题</span>
                      <span>｜</span>
                      <span>{et.description}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </AppCard>
            ))}
            </div>
          </div>
        )}

        {/* 展示单题列表的情况 */}
        {(selectedChapter || selectedSource || selectedKnowledgePoint || selectedErrorType || activeTab === 'all') && (
          <div>
            {/* 回退按钮 */}
            {(selectedChapter || selectedSource || selectedKnowledgePoint || selectedErrorType) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedChapter(null)
                  setSelectedSource(null)
                  setSelectedKnowledgePoint(null)
                  setSelectedErrorType(null)
                }}
                className="flex items-center gap-2 text-sm text-gray-600 mb-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                返回{activeTab === 'chapter' ? '章节列表' : activeTab === 'source' ? '来源列表' : activeTab === 'knowledge' ? '知识点列表' : '错因列表'}
              </button>
            )}

            {/* 全部题目视图的状态筛选 */}
            {activeTab === 'all' && !selectedChapter && !selectedSource && !selectedKnowledgePoint && !selectedErrorType && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filterStatuses.map(status => (
                  <button
                    key={status.key}
                    onClick={() => setFilterStatus(status.key)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      filterStatus === status.key
                        ? 'bg-primary-100 text-primary-700 border border-primary-200'
                        : 'bg-white text-gray-700 border border-gray-200'
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            )}

            {/* 待完善错题展示 */}
            {filterStatus === 'incomplete' ? (
              <div className="space-y-3">
                {incompleteMistakes.map(mistake => (
                  <button
                    key={mistake.id}
                    type="button"
                    onClick={() => navigate('/save-mistake')}
                    className="w-full text-left"
                  >
                    <AppCard className="hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium mb-1">{mistake.question}</p>
                        </div>
                        <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <StatusTag type="warning">{mistake.status}</StatusTag>
                      </div>
                      <p className="text-gray-500 text-sm">{mistake.description}</p>
                    </AppCard>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {displayMistakes.map(mistake => (
                  <MistakeCard
                    key={mistake.id}
                    mistake={mistake}
                    onClick={() => handleMistakeClick()}
                  />
                ))}
                
                {hasMore && (
                  <div className="flex justify-center mt-6">
                    <button
                      type="button"
                      onClick={handleLoadMore}
                      disabled={loading}
                      className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-gray-500" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          加载中...
                        </>
                      ) : (
                        <>
                          <span>加载更多</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 教材设置 Modal */}
      <Modal
        open={showTextbookModal}
        title="设置教材信息"
        confirmText="保存"
        onConfirm={handleSaveTextbook}
        onCancel={() => setShowTextbookModal(false)}
      >
        <div className="space-y-4">
          {/* 年级选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">年级</label>
            <div className="flex flex-wrap gap-2">
              {grades.map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => handleGradeChange(g)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    grade === g
                      ? 'bg-primary-100 text-primary-700 border border-primary-200'
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* 册别选择 - 根据年级动态显示 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">册别</label>
            <div className="flex flex-wrap gap-2">
              {getVolumesByGrade(grade).map(v => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVolume(v)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    volume === v
                      ? 'bg-primary-100 text-primary-700 border border-primary-200'
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            {volume === '自定义' && (
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  placeholder="请输入册别"
                  value={customVolume}
                  onChange={(e) => setCustomVolume(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="button"
                  onClick={() => setCustomVolume('')}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* 教材版本选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">教材版本</label>
            <div className="flex flex-wrap gap-2">
              {versions.map(v => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVersion(v)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    version === v
                      ? 'bg-primary-100 text-primary-700 border border-primary-200'
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            {version === '自定义' && (
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  placeholder="请输入教材版本"
                  value={customVersion}
                  onChange={(e) => setCustomVersion(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="button"
                  onClick={() => setCustomVersion('')}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* 章节图谱 Modal */}
      <Modal
        open={showChapterModal}
        title="章节错题图谱"
        confirmText="查看错题本"
        onConfirm={() => {
          setShowChapterModal(false)
          navigate('/mistakes')
        }}
        onCancel={() => setShowChapterModal(false)}
      >
        <p className="text-gray-600 text-sm mb-6">
          根据已保存错题的章节归属，直观看到哪些章节错题更集中。点击章节卡片可展开查看课时详情。
        </p>
        
        {/* 中心节点 - 教材信息 */}
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl shadow-lg">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              <span className="font-semibold">{grade}{volume === '自定义' ? customVolume : volume} · {version === '自定义' ? customVersion : version}</span>
            </div>
          </div>
        </div>
        
        {/* 连接线 */}
        <div className="flex justify-center mb-4">
          <div className="w-0.5 h-4 bg-gray-300" />
        </div>
        
        {/* 章节节点列表 - 支持滚动 */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {chapters.map((chapter, index) => {
            const isExpanded = expandedChapters.has(chapter.name)
            const statusType = chapter.mastery >= 80 ? 'success' : chapter.mastery >= 50 ? 'warning' : 'error'
            const statusText = chapter.mastery >= 80 ? '掌握良好' : chapter.mastery >= 50 ? '需关注' : '高频错题'
            const tip = chapter.mastery >= 80 ? '掌握度较高，继续保持' : chapter.mastery >= 50 ? '部分题目仍需复习' : '错题较多，建议重点复习'
            return (
              <div key={chapter.name} className={`flex gap-4 ${chapter.mistakeCount > 0 ? '' : 'opacity-50'}`}>
                {/* 连接线 */}
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${chapter.mistakeCount > 0 ? 'bg-primary-500' : 'bg-gray-300'}`} />
                  {index < chapters.length - 1 && (
                    <div className="w-0.5 flex-1 bg-gray-200 min-h-[60px]" />
                  )}
                </div>
                
                {/* 章节卡片 - 可点击展开 */}
                <div className="flex-1">
                  <button
                    type="button"
                    onClick={() => chapter.mistakeCount > 0 && toggleChapter(chapter.name)}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${chapter.mistakeCount > 0 ? 'bg-white border-gray-200 shadow-sm hover:shadow-md cursor-pointer' : 'bg-gray-50 border-gray-100 cursor-default'}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className={`font-medium ${chapter.mistakeCount > 0 ? 'text-gray-900' : 'text-gray-400'}`}>
                          {chapter.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className={`text-sm font-bold ${chapter.mistakeCount > 0 ? 'text-primary-600' : 'text-gray-400'}`}>
                            {chapter.mistakeCount}道错题
                          </span>
                          <StatusTag type={statusType}>{statusText}</StatusTag>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {chapter.mistakeCount > 0 && chapter.mistakeCount >= 10 && (
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                            <AlertCircle className="w-4 h-4 text-red-600" />
                          </div>
                        )}
                        {chapter.mistakeCount > 0 && chapter.lessons && chapter.lessons.length > 0 && (
                          <ChevronRight 
                            className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                          />
                        )}
                      </div>
                    </div>
                    <p className={`text-sm ${chapter.mistakeCount > 0 ? 'text-gray-500' : 'text-gray-300'}`}>
                      {tip}
                    </p>
                    {chapter.mistakeCount > 0 && (
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span>已掌握 {chapter.statusBreakdown.mastered} 道</span>
                        <span className="text-gray-300">|</span>
                        <span>待复习 {chapter.statusBreakdown.pending} 道</span>
                      </div>
                    )}
                  </button>
                  
                  {/* 展开的课时详情 */}
                  {isExpanded && chapter.lessons && chapter.lessons.length > 0 && (
                    <div className="mt-2 ml-4 pl-4 border-l-2 border-primary-200">
                      <p className="text-xs text-gray-500 mb-2">课时分布</p>
                      <div className="space-y-2">
                        {chapter.lessons.map(lesson => (
                          <button
                            key={lesson.id}
                            onClick={() => {
                              setShowChapterModal(false)
                              navigate(`/mistakes?chapter=${encodeURIComponent(chapter.name)}&lesson=${encodeURIComponent(lesson.name)}`)
                            }}
                            className="w-full flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors text-left"
                          >
                            <span className="text-sm text-gray-700">{lesson.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">{lesson.count}道错题</span>
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Modal>

      <Toast message={toastMessage} visible={showToast} />
      <BottomNav />
    </div>
  )
}
