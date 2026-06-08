import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Info,
  Tags,
  BookOpen,
  Target,
  Clock,
  ChevronRight,
  AlertTriangle,
  Search,
  ChevronDown,
  Settings,
  Sparkles,
  CheckCircle2
} from 'lucide-react'
import AppCard from '../components/ui/AppCard'
import StatusTag from '../components/ui/StatusTag'
import PrimaryButton from '../components/ui/PrimaryButton'
import SecondaryButton from '../components/ui/SecondaryButton'
import Modal from '../components/ui/Modal'
import Toast from '../components/ui/Toast'

/* ================================
 * 教材 / 章节 / 知识点 mock 数据
 * ================================ */

const currentTextbook = {
  textbookId: 'math-g8a-pep',
  subject: '数学',
  stage: '初中',
  grade: '初二',
  volume: '上册',
  publisher: '人教版',
  textbookName: '义务教育教科书 数学 八年级上册',
  sourceType: 'official-mock'
}

interface KnowledgePoint {
  knowledgeId: string
  knowledgeName: string
}

interface Lesson {
  lessonId: string
  lessonName: string
  knowledgePoints: KnowledgePoint[]
}

interface TextbookChapter {
  chapterId: string
  chapterName: string
  lessonCount: number
  mistakeCount: number
  masteryRate: number
  lessons: Lesson[]
}

const textbookChapters: TextbookChapter[] = [
  {
    chapterId: 'g8a-chapter-01',
    chapterName: '第一单元 一元一次方程',
    lessonCount: 3,
    mistakeCount: 12,
    masteryRate: 70,
    lessons: [
      {
        lessonId: 'g8a-c01-l01',
        lessonName: '第1课 等式性质',
        knowledgePoints: [
          { knowledgeId: 'kp-equation-property', knowledgeName: '等式性质' },
          { knowledgeId: 'kp-equation-transform', knowledgeName: '等式变形' }
        ]
      },
      {
        lessonId: 'g8a-c01-l02',
        lessonName: '第2课 移项与合并同类项',
        knowledgePoints: [
          { knowledgeId: 'kp-transpose', knowledgeName: '移项' },
          { knowledgeId: 'kp-combine-like-terms', knowledgeName: '合并同类项' }
        ]
      },
      {
        lessonId: 'g8a-c01-l03',
        lessonName: '第3课 方程应用',
        knowledgePoints: [
          { knowledgeId: 'kp-equation-solving', knowledgeName: '解方程' },
          { knowledgeId: 'kp-word-problem', knowledgeName: '应用题建模' }
        ]
      }
    ]
  },
  {
    chapterId: 'g8a-chapter-02',
    chapterName: '第二单元 二次函数',
    lessonCount: 3,
    mistakeCount: 9,
    masteryRate: 62,
    lessons: [
      {
        lessonId: 'g8a-c02-l01',
        lessonName: '第1课 函数图像',
        knowledgePoints: [
          { knowledgeId: 'kp-function-image', knowledgeName: '函数图像' },
          { knowledgeId: 'kp-quadratic-vertex', knowledgeName: '顶点坐标' }
        ]
      },
      {
        lessonId: 'g8a-c02-l02',
        lessonName: '第2课 顶点坐标',
        knowledgePoints: [
          { knowledgeId: 'kp-quadratic-vertex', knowledgeName: '顶点坐标' },
          { knowledgeId: 'kp-axis-of-symmetry', knowledgeName: '对称轴' }
        ]
      },
      {
        lessonId: 'g8a-c02-l03',
        lessonName: '第3课 图像平移',
        knowledgePoints: [
          { knowledgeId: 'kp-image-translation', knowledgeName: '图像平移' },
          { knowledgeId: 'kp-quadratic-vertex', knowledgeName: '顶点坐标' }
        ]
      }
    ]
  },
  {
    chapterId: 'g8a-chapter-03',
    chapterName: '第三单元 几何证明',
    lessonCount: 3,
    mistakeCount: 7,
    masteryRate: 55,
    lessons: [
      {
        lessonId: 'g8a-c03-l01',
        lessonName: '第1课 全等三角形',
        knowledgePoints: [
          { knowledgeId: 'kp-congruent-triangle', knowledgeName: '全等三角形' },
          { knowledgeId: 'kp-proof-step', knowledgeName: '证明步骤表达' }
        ]
      },
      {
        lessonId: 'g8a-c03-l02',
        lessonName: '第2课 辅助线构造',
        knowledgePoints: [
          { knowledgeId: 'kp-auxiliary-line', knowledgeName: '辅助线' },
          { knowledgeId: 'kp-congruent-triangle', knowledgeName: '全等三角形' }
        ]
      },
      {
        lessonId: 'g8a-c03-l03',
        lessonName: '第3课 证明步骤表达',
        knowledgePoints: [
          { knowledgeId: 'kp-proof-step', knowledgeName: '证明步骤表达' },
          { knowledgeId: 'kp-logic-reasoning', knowledgeName: '逻辑推理' }
        ]
      }
    ]
  }
]

/* ================================
 * 知识点扁平化选项（保留按知识点练习使用）
 * ================================ */

interface FlatKnowledgeOption {
  knowledgeId: string
  knowledgeName: string
  chapterId: string
  chapterName: string
  lessonId: string
  lessonName: string
  textbookId: string
  grade: string
  volume: string
  publisher: string
}

/* ================================
 * AI 推荐练习（按知识点推荐，保留原入口）
 * ================================ */

interface RecommendItem {
  id: number
  title: string
  description: string
  questionCount: number
  duration: number
  difficulty: string
  chapterId: string
  chapterName: string
  knowledgeIds: string[]
  knowledgeNames: string[]
}

const recommendItems: RecommendItem[] = [
  {
    id: 1,
    title: '一元一次方程移项',
    description: '近7天重复出错，建议优先练习',
    questionCount: 6,
    duration: 12,
    difficulty: '中等',
    chapterId: 'g8a-chapter-01',
    chapterName: '第一单元 一元一次方程',
    knowledgeIds: ['kp-transpose'],
    knowledgeNames: ['移项']
  },
  {
    id: 2,
    title: '二次函数顶点坐标',
    description: '正确率偏低，需要巩固概念',
    questionCount: 5,
    duration: 10,
    difficulty: '中等',
    chapterId: 'g8a-chapter-02',
    chapterName: '第二单元 二次函数',
    knowledgeIds: ['kp-quadratic-vertex'],
    knowledgeNames: ['顶点坐标']
  },
  {
    id: 3,
    title: '几何辅助线证明',
    description: '步骤遗漏较多，建议专项训练',
    questionCount: 4,
    duration: 15,
    difficulty: '困难',
    chapterId: 'g8a-chapter-03',
    chapterName: '第三单元 几何证明',
    knowledgeIds: ['kp-auxiliary-line', 'kp-proof-step'],
    knowledgeNames: ['辅助线', '证明步骤表达']
  }
]

/* ================================
 * AI 推荐试卷（整卷组卷入口）
 * ================================ */

interface RecommendPaper {
  paperId: string
  paperType: 'exam' | 'weak-point' | 'similar'
  paperTitle: string
  questionCount: number
  estimatedTime: number
  difficulty: string
  recommendationReason: string
  coverChapters: string[]
  coverChaptersDisplay: string
  chapterIds: string[]
  knowledgeIds: string[]
  practiceGoal: string
}

const recommendPapers: RecommendPaper[] = [
  {
    paperId: 'paper-exam-001',
    paperType: 'exam',
    paperTitle: '期中考前模拟卷',
    questionCount: 10,
    estimatedTime: 25,
    difficulty: '中等',
    recommendationReason: '覆盖近期高频错题和考试重点',
    coverChapters: ['第一单元 一元一次方程', '第二单元 二次函数', '第三单元 几何证明'],
    coverChaptersDisplay: '一元一次方程、二次函数、几何证明',
    chapterIds: ['g8a-chapter-01', 'g8a-chapter-02', 'g8a-chapter-03'],
    knowledgeIds: [
      'kp-equation-property',
      'kp-transpose',
      'kp-equation-solving',
      'kp-quadratic-vertex',
      'kp-axis-of-symmetry',
      'kp-function-image',
      'kp-congruent-triangle',
      'kp-auxiliary-line',
      'kp-proof-step'
    ],
    practiceGoal: '考前模拟'
  },
  {
    paperId: 'paper-weak-002',
    paperType: 'weak-point',
    paperTitle: '薄弱知识点专项卷',
    questionCount: 8,
    estimatedTime: 20,
    difficulty: '中等',
    recommendationReason: '针对近期反复出错的知识点强化',
    coverChapters: ['第一单元 一元一次方程'],
    coverChaptersDisplay: '一元一次方程',
    chapterIds: ['g8a-chapter-01'],
    knowledgeIds: ['kp-equation-property', 'kp-transpose', 'kp-equation-solving', 'kp-combine-like-terms'],
    practiceGoal: '易错强化'
  },
  {
    paperId: 'paper-similar-003',
    paperType: 'similar',
    paperTitle: '错题同类强化卷',
    questionCount: 6,
    estimatedTime: 15,
    difficulty: '中等',
    recommendationReason: '根据已保存错题生成同类变式题',
    coverChapters: ['第三单元 几何证明', '第二单元 二次函数'],
    coverChaptersDisplay: '几何证明、二次函数',
    chapterIds: ['g8a-chapter-03', 'g8a-chapter-02'],
    knowledgeIds: [
      'kp-congruent-triangle',
      'kp-proof-step',
      'kp-auxiliary-line',
      'kp-function-image',
      'kp-quadratic-vertex'
    ],
    practiceGoal: '查漏补缺'
  }
]

/* ================================
 * 自定义组卷相关常量
 * ================================ */

const CUSTOM_QUESTION_COUNT_OPTIONS = [5, 10, 15, 20]
const CUSTOM_DIFFICULTY_OPTIONS = ['简单', '中等', '困难', '混合']
const CUSTOM_GOAL_OPTIONS = ['基础巩固', '查漏补缺', '考前模拟', '易错强化']
const CUSTOM_MAX_KNOWLEDGE_DISPLAY = 6

/* ================================
 * 教材选择相关常量（按学段分组）
 * ================================ */

const STAGE_OPTIONS = ['小学', '初中', '高中']
const MATERIAL_TYPE_OPTIONS = ['教材', '同步练习册', '教辅资料']

const GRADE_BY_STAGE: Record<string, string[]> = {
  '小学': ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
  '初中': ['初一', '初二', '初三'],
  '高中': ['高一', '高二', '高三']
}

const VOLUME_BY_STAGE: Record<string, string[]> = {
  '小学': ['上册', '下册'],
  '初中': ['上册', '下册'],
  '高中': ['必修第一册', '必修第二册', '选择性必修第一册', '选择性必修第二册', '选择性必修第三册']
}

const PUBLISHER_BY_STAGE: Record<string, string[]> = {
  '小学': ['人教版', '北师大版', '苏教版', '沪教版', '冀教版', '青岛版'],
  '初中': ['人教版', '北师大版', '苏教版', '沪教版', '华师大版', '湘教版', '冀教版', '浙教版'],
  '高中': ['人教A版', '人教B版', '北师大版', '苏教版', '湘教版']
}

const DEFAULT_BY_STAGE: Record<string, { grade: string; volume: string; publisher: string }> = {
  '小学': { grade: '一年级', volume: '上册', publisher: '人教版' },
  '初中': { grade: '初一', volume: '上册', publisher: '人教版' },
  '高中': { grade: '高一', volume: '必修第一册', publisher: '人教A版' }
}

/* ================================
 * 最近生成的试卷（最近练过升级）
 * ================================ */

interface RecentPaper {
  paperId: string
  paperTitle: string
  paperType: 'exam' | 'weak-point' | 'similar' | 'custom'
  count: number
  accuracy: number
  date: string
}

const recentPapers: RecentPaper[] = [
  {
    paperId: 'paper-001',
    paperTitle: '二次函数专项卷',
    paperType: 'custom',
    count: 8,
    accuracy: 80,
    date: '昨天'
  },
  {
    paperId: 'paper-002',
    paperTitle: '期中考前模拟卷',
    paperType: 'exam',
    count: 10,
    accuracy: 60,
    date: '2天前'
  },
  {
    paperId: 'paper-003',
    paperTitle: '几何证明薄弱卷',
    paperType: 'weak-point',
    count: 6,
    accuracy: 67,
    date: '3天前'
  }
]

const MAX_DISPLAY_COUNT = 6

export default function KnowledgePracticePage() {
  const navigate = useNavigate()
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  /* ------ 按知识点选择区状态（保留原功能） ------ */
  const [selectedKnowledgeIds, setSelectedKnowledgeIds] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null)
  const [showAllKnowledge, setShowAllKnowledge] = useState(false)

  /* ------ 自定义组卷状态 ------ */
  const [customChapterIds, setCustomChapterIds] = useState<string[]>([])
  const [customKnowledgeIds, setCustomKnowledgeIds] = useState<string[]>([])
  const [customCount, setCustomCount] = useState<number>(10)
  const [customDifficulty, setCustomDifficulty] = useState<string>('中等')
  const [customGoal, setCustomGoal] = useState<string>('查漏补缺')
  const [customShowAllKnowledge, setCustomShowAllKnowledge] = useState(false)
  const [showTextbookModal, setShowTextbookModal] = useState(false)
  
  /* ------ 教材选择状态 ------ */
  const [selectedStage, setSelectedStage] = useState<string>('初中')
  const [selectedGrade, setSelectedGrade] = useState<string>('初二')
  const [selectedVolume, setSelectedVolume] = useState<string>('上册')
  const [selectedPublisher, setSelectedPublisher] = useState<string>('人教版')
  const [selectedMaterialType, setSelectedMaterialType] = useState<string>('教材')

  /* ------ 自定义组卷知识点搜索 ------ */
  const [customSearchQuery, setCustomSearchQuery] = useState('')

  /* ================================
   * 自定义组卷：根据教材选择获取可用章节
   * TODO: 后续替换为官方教材目录接口返回的章节列表
   * ================================ */
  const availableChapters = useMemo(() => {
    return textbookChapters
  }, [])

  /* ================================
   * 自定义组卷：根据章节选择获取可用知识点
   * ================================ */
  const availableKnowledgeOptions = useMemo(() => {
    const options: FlatKnowledgeOption[] = []
    const seen = new Set<string>()
    
    const chaptersToUse = customChapterIds.length > 0 
      ? availableChapters.filter(ch => customChapterIds.includes(ch.chapterId))
      : availableChapters

    for (const chapter of chaptersToUse) {
      for (const lesson of chapter.lessons) {
        for (const kp of lesson.knowledgePoints) {
          if (!seen.has(kp.knowledgeId)) {
            seen.add(kp.knowledgeId)
            options.push({
              knowledgeId: kp.knowledgeId,
              knowledgeName: kp.knowledgeName,
              chapterId: chapter.chapterId,
              chapterName: chapter.chapterName,
              lessonId: lesson.lessonId,
              lessonName: lesson.lessonName,
              textbookId: currentTextbook.textbookId,
              grade: selectedGrade,
              volume: selectedVolume,
              publisher: selectedPublisher
            })
          }
        }
      }
    }
    return options
  }, [availableChapters, customChapterIds, selectedGrade, selectedVolume, selectedPublisher])

  /* ================================
   * 自定义组卷：搜索过滤知识点
   * ================================ */
  const filteredCustomKnowledgeOptions = useMemo(() => {
    if (!customSearchQuery.trim()) {
      return availableKnowledgeOptions
    }
    const query = customSearchQuery.toLowerCase().trim()
    return availableKnowledgeOptions.filter(
      opt =>
        opt.knowledgeName.toLowerCase().includes(query) ||
        opt.chapterName.toLowerCase().includes(query) ||
        opt.lessonName.toLowerCase().includes(query)
    )
  }, [availableKnowledgeOptions, customSearchQuery])

  /* ================================
   * 自定义组卷：显示的知识点（带数量限制）
   * ================================ */
  const displayedCustomKnowledgeOptions = useMemo(() => {
    if (customShowAllKnowledge || customSearchQuery.trim()) {
      return filteredCustomKnowledgeOptions
    }
    return filteredCustomKnowledgeOptions.slice(0, CUSTOM_MAX_KNOWLEDGE_DISPLAY)
  }, [filteredCustomKnowledgeOptions, customShowAllKnowledge, customSearchQuery])

  /* ================================
   * 知识点扁平化（按知识点选择使用）
   * ================================ */
  const knowledgeOptions: FlatKnowledgeOption[] = useMemo(() => {
    const options: FlatKnowledgeOption[] = []
    const seen = new Set<string>()
    for (const chapter of textbookChapters) {
      for (const lesson of chapter.lessons) {
        for (const kp of lesson.knowledgePoints) {
          if (!seen.has(kp.knowledgeId)) {
            seen.add(kp.knowledgeId)
            options.push({
              knowledgeId: kp.knowledgeId,
              knowledgeName: kp.knowledgeName,
              chapterId: chapter.chapterId,
              chapterName: chapter.chapterName,
              lessonId: lesson.lessonId,
              lessonName: lesson.lessonName,
              textbookId: currentTextbook.textbookId,
              grade: currentTextbook.grade,
              volume: currentTextbook.volume,
              publisher: currentTextbook.publisher
            })
          }
        }
      }
    }
    return options
  }, [])

  /* ================================
   * 按知识点选择区：筛选 & 展示
   * ================================ */
  const filteredKnowledgeOptions = useMemo(() => {
    let filtered = [...knowledgeOptions]
    if (selectedChapterId) {
      filtered = filtered.filter(opt => opt.chapterId === selectedChapterId)
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(
        opt =>
          opt.knowledgeName.toLowerCase().includes(query) ||
          opt.chapterName.toLowerCase().includes(query) ||
          opt.lessonName.toLowerCase().includes(query)
      )
    }
    return filtered
  }, [knowledgeOptions, selectedChapterId, searchQuery])

  const displayedKnowledgeOptions = useMemo(() => {
    if (showAllKnowledge || searchQuery.trim()) {
      return filteredKnowledgeOptions
    }
    return filteredKnowledgeOptions.slice(0, MAX_DISPLAY_COUNT)
  }, [filteredKnowledgeOptions, showAllKnowledge, searchQuery])

  /* ================================
   * 返回顶部
   * ================================ */
  const handleBack = () => {
    navigate('/practice')
  }

  const handleViewInfo = () => {
    setShowInfoModal(true)
  }

  /* ================================
   * AI 推荐练习（按知识点入口，保留原有参数）
   * ================================ */
  const handleStartRecommend = (item: RecommendItem) => {
    const params = new URLSearchParams({
      from: 'knowledge-practice',
      type: 'knowledge',
      source: 'knowledge',
      returnTo: 'knowledge-practice',
      count: String(item.questionCount),
      textbookId: currentTextbook.textbookId,
      grade: currentTextbook.grade,
      volume: currentTextbook.volume,
      publisher: currentTextbook.publisher,
      knowledgeId: item.knowledgeIds.join(','),
      knowledgeName: item.knowledgeNames.join(',')
    })
    navigate(`/practice/1?${params.toString()}`)
  }

  /* ================================
   * 按知识点选择：切换选择
   * ================================ */
  const handleKnowledgePointToggle = (knowledgeId: string) => {
    if (selectedKnowledgeIds.includes(knowledgeId)) {
      setSelectedKnowledgeIds(selectedKnowledgeIds.filter(k => k !== knowledgeId))
    } else {
      setSelectedKnowledgeIds([...selectedKnowledgeIds, knowledgeId])
    }
  }

  /* ================================
   * 按知识点选择：生成练习
   * ================================ */
  const handleGenerateCustomKnowledge = () => {
    if (selectedKnowledgeIds.length === 0) {
      setToastMessage('请至少选择一个知识点')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
      return
    }
    const selectedOptions = knowledgeOptions.filter(kp => selectedKnowledgeIds.includes(kp.knowledgeId))
    setShowToast(true)
    setToastMessage('已生成知识点练习')
    setTimeout(() => {
      const urlParams = new URLSearchParams({
        from: 'knowledge-practice',
        type: 'knowledge',
        source: 'knowledge',
        returnTo: 'knowledge-practice',
        count: '5',
        textbookId: currentTextbook.textbookId,
        grade: currentTextbook.grade,
        volume: currentTextbook.volume,
        publisher: currentTextbook.publisher,
        knowledgeId: selectedOptions.map(kp => kp.knowledgeId).join(','),
        knowledgeName: selectedOptions.map(kp => kp.knowledgeName).join(',')
      })
      navigate(`/practice/1?${urlParams.toString()}`)
      setShowToast(false)
    }, 1000)
  }

  /* ================================
   * 按章节练习：保留原有逻辑
   * ================================ */
  const handleStartChapter = (chapter: TextbookChapter) => {
    const params = new URLSearchParams({
      from: 'knowledge-practice',
      type: 'chapter',
      source: 'chapter',
      returnTo: 'knowledge-practice',
      count: String(Math.min(3, chapter.lessonCount)),
      textbookId: currentTextbook.textbookId,
      grade: currentTextbook.grade,
      volume: currentTextbook.volume,
      publisher: currentTextbook.publisher,
      chapterId: chapter.chapterId,
      chapterName: chapter.chapterName
    })
    navigate(`/practice/1?${params.toString()}`)
  }

  /* ================================
   * AI 推荐试卷：生成整卷
   * ================================ */
  const handleGenerateExamPaper = (paper: RecommendPaper) => {
    const params = new URLSearchParams({
      from: 'knowledge-practice',
      type: 'paper',
      source: 'exam-paper',
      returnTo: 'knowledge-practice',
      paperType: paper.paperType,
      paperTitle: paper.paperTitle,
      count: String(paper.questionCount),
      estimatedTime: String(paper.estimatedTime),
      difficulty: paper.difficulty,
      practiceGoal: paper.practiceGoal,
      textbookId: currentTextbook.textbookId,
      grade: currentTextbook.grade,
      volume: currentTextbook.volume,
      publisher: currentTextbook.publisher,
      chapterId: paper.chapterIds.join(','),
      chapterName: paper.coverChapters.join(','),
      knowledgeId: paper.knowledgeIds.join(',')
    })
    navigate(`/practice/1?${params.toString()}`)
  }

  /* ================================
   * 自定义组卷：章节选择
   * ================================ */
  const toggleCustomChapter = (chapterId: string) => {
    if (customChapterIds.includes(chapterId)) {
      const newChapterIds = customChapterIds.filter(id => id !== chapterId)
      setCustomChapterIds(newChapterIds)
      // 移除不在新章节范围内的知识点
      const remainingKnowledgeIds = availableKnowledgeOptions
        .filter(opt => newChapterIds.length === 0 || newChapterIds.includes(opt.chapterId))
        .map(opt => opt.knowledgeId)
      setCustomKnowledgeIds(prev => prev.filter(kid => remainingKnowledgeIds.includes(kid)))
    } else {
      setCustomChapterIds([...customChapterIds, chapterId])
    }
  }

  /* ================================
   * 自定义组卷：知识点选择
   * ================================ */
  const toggleCustomKnowledge = (knowledgeId: string) => {
    if (customKnowledgeIds.includes(knowledgeId)) {
      setCustomKnowledgeIds(customKnowledgeIds.filter(id => id !== knowledgeId))
    } else {
      setCustomKnowledgeIds([...customKnowledgeIds, knowledgeId])
    }
  }

  /* ================================
   * 自定义组卷：生成练习卷
   * ================================ */
  const handleGenerateCustomPaper = () => {
    const chapterParams: string[] = []
    const chapterNameParams: string[] = []
    const knowledgeIdParams: string[] = []
    const knowledgeNameParams: string[] = []

    if (customChapterIds.length > 0) {
      // 用户选择了章节：传所选章节
      for (const chapter of availableChapters) {
        if (customChapterIds.includes(chapter.chapterId)) {
          chapterParams.push(chapter.chapterId)
          chapterNameParams.push(chapter.chapterName)
        }
      }
    } else {
      // 用户未选择章节：传全部章节
      for (const chapter of availableChapters) {
        chapterParams.push(chapter.chapterId)
        chapterNameParams.push(chapter.chapterName)
      }
    }

    if (customKnowledgeIds.length > 0) {
      // 用户选择了知识点：传所选知识点
      for (const opt of availableKnowledgeOptions) {
        if (customKnowledgeIds.includes(opt.knowledgeId)) {
          knowledgeIdParams.push(opt.knowledgeId)
          knowledgeNameParams.push(opt.knowledgeName)
        }
      }
    } else {
      // 用户未选择知识点：传全部可用知识点
      for (const opt of availableKnowledgeOptions) {
        knowledgeIdParams.push(opt.knowledgeId)
        knowledgeNameParams.push(opt.knowledgeName)
      }
    }

    const paperTitle = '自定义练习卷'
    const stageCode = selectedStage === '小学' ? 'primary' : selectedStage === '初中' ? 'junior' : 'senior'
    const gradeNum = selectedGrade.replace(/[^0-9]/g, '') || '1'
    const volumeCode = selectedStage === '高中' 
      ? selectedVolume.replace(/[^0-9]/g, '') 
      : selectedVolume === '上册' ? 'a' : 'b'
    const publisherCode = selectedPublisher.replace(/[^a-zA-Z]/g, '').toLowerCase() || 'unknown'
    const textbookId = `math-${stageCode}-g${gradeNum}-${volumeCode}-${publisherCode}`

    const urlParams = new URLSearchParams({
      from: 'knowledge-practice',
      type: 'paper',
      source: 'custom-paper',
      returnTo: 'knowledge-practice',
      paperType: 'custom',
      paperTitle,
      count: String(customCount),
      difficulty: customDifficulty,
      practiceGoal: customGoal,
      textbookId,
      stage: selectedStage,
      grade: selectedGrade,
      volume: selectedVolume,
      publisher: selectedPublisher,
      materialType: selectedMaterialType,
      chapterId: chapterParams.join(','),
      chapterName: chapterNameParams.join(','),
      knowledgeId: knowledgeIdParams.join(','),
      knowledgeName: knowledgeNameParams.join(',')
    })

    setShowToast(true)
    setToastMessage('正在生成练习卷…')
    setTimeout(() => {
      navigate(`/practice/1?${urlParams.toString()}`)
      setShowToast(false)
    }, 800)
  }

  /* ================================
   * 最近生成：继续练习 / 查看结果
   * ================================ */
  const handleContinuePaper = (paper: RecentPaper) => {
    const params = new URLSearchParams({
      from: 'knowledge-practice',
      type: 'paper',
      source: 'recent-paper',
      returnTo: 'knowledge-practice',
      paperId: paper.paperId,
      paperTitle: paper.paperTitle,
      paperType: paper.paperType,
      count: String(paper.count),
      textbookId: currentTextbook.textbookId,
      grade: currentTextbook.grade,
      volume: currentTextbook.volume,
      publisher: currentTextbook.publisher
    })
    navigate(`/practice/1?${params.toString()}`)
  }

  const handleViewPaperResult = (paper: RecentPaper) => {
    const params = new URLSearchParams({
      from: 'knowledge-practice',
      type: 'paper',
      source: 'recent-paper',
      returnTo: 'knowledge-practice',
      paperId: paper.paperId,
      paperTitle: paper.paperTitle,
      paperType: paper.paperType,
      count: String(paper.count),
      correct: String(Math.floor(paper.count * paper.accuracy / 100)),
      wrong: String(Math.max(paper.count - Math.floor(paper.count * paper.accuracy / 100), 0))
    })
    navigate(`/practice-result?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-[#F6F8FB] flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <button
          type="button"
          onClick={handleBack}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-gray-900 font-medium text-lg">知识点练习</h1>
        <button
          type="button"
          onClick={handleViewInfo}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Info className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="flex-1 px-4 py-4 overflow-y-auto pb-8">
        {/* 教材提示与 mock 数据说明 */}
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-3 mb-4 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-yellow-800 font-medium">
              当前教材：{currentTextbook.grade}{currentTextbook.volume} · {currentTextbook.publisher}
            </p>
            <p className="text-xs text-yellow-600 mt-1">
              当前为 mock 教材目录与组卷结果，后续可替换为官方教材章节与知识点数据，并接入题库与 AI 组卷接口
            </p>
          </div>
        </div>

        {/* ================================
         * AI 推荐练习（按知识点推荐）
         * ================================ */}
        <AppCard className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-purple-600" />
            <h3 className="text-gray-900 font-semibold">AI推荐练习</h3>
          </div>
          <p className="text-gray-500 text-sm mb-4">根据近期错题和薄弱点推荐</p>

          <div className="space-y-3">
            {recommendItems.map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleStartRecommend(item)}
                className="w-full text-left"
              >
                <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="text-gray-900 font-medium mb-1">{item.title}</h4>
                      <p className="text-gray-500 text-sm">{item.description}</p>
                      <p className="text-xs text-gray-400 mt-1">所属章节：{item.chapterName}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-white rounded text-xs text-gray-600">
                      {item.questionCount}题
                    </span>
                    <span className="px-2 py-1 bg-white rounded text-xs text-gray-600">
                      {item.duration}分钟
                    </span>
                    <StatusTag
                      type={
                        item.difficulty === '困难'
                          ? 'error'
                          : item.difficulty === '中等'
                          ? 'warning'
                          : 'success'
                      }
                    >
                      {item.difficulty}
                    </StatusTag>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </AppCard>

        {/* ================================
         * AI 推荐试卷（整卷组卷）
         * ================================ */}
        <AppCard className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-pink-600" />
            <h3 className="text-gray-900 font-semibold">AI 推荐试卷</h3>
          </div>
          <p className="text-gray-500 text-sm mb-4">
            根据近期错题、待复习状态和考试目标自动组卷，生成一整套练习卷
          </p>

          <div className="space-y-3">
            {recommendPapers.map(paper => (
              <div
                key={paper.paperId}
                className="p-4 bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-100 rounded-xl"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="text-gray-900 font-semibold mb-1">{paper.paperTitle}</h4>
                    <p className="text-xs text-gray-600 mb-1">
                      <span className="font-medium">推荐依据：</span>
                      {paper.recommendationReason}
                    </p>
                    <p className="text-xs text-gray-500">
                      覆盖范围：{paper.coverChaptersDisplay}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2 py-1 bg-white rounded text-xs text-gray-700 border border-gray-100">
                    {paper.questionCount}题
                  </span>
                  <span className="px-2 py-1 bg-white rounded text-xs text-gray-700 border border-gray-100">
                    预计 {paper.estimatedTime} 分钟
                  </span>
                  <StatusTag type="warning">{paper.difficulty}</StatusTag>
                  <StatusTag type="success">{paper.practiceGoal}</StatusTag>
                </div>

                <PrimaryButton
                  className="w-full"
                  onClick={() => handleGenerateExamPaper(paper)}
                >
                  生成试卷
                </PrimaryButton>
              </div>
            ))}
          </div>
        </AppCard>

        {/* ================================
         * 按知识点选择区（保留原搜索与筛选）
         * ================================ */}
        <AppCard className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Tags className="w-5 h-5 text-blue-600" />
            <h3 className="text-gray-900 font-semibold">按知识点选择</h3>
          </div>

          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索知识点 / 章节"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value)
                setShowAllKnowledge(true)
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            <button
              type="button"
              onClick={() => {
                setSelectedChapterId(null)
                if (!searchQuery.trim()) setShowAllKnowledge(false)
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                !selectedChapterId
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              全部
            </button>
            {textbookChapters.map(chapter => (
              <button
                key={chapter.chapterId}
                type="button"
                onClick={() => {
                  setSelectedChapterId(chapter.chapterId)
                  if (!searchQuery.trim()) setShowAllKnowledge(false)
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedChapterId === chapter.chapterId
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {chapter.chapterName}
              </button>
            ))}
          </div>

          <div className="max-h-[360px] overflow-y-auto space-y-2 mb-4 pr-1">
            {displayedKnowledgeOptions.map(opt => (
              <button
                key={opt.knowledgeId}
                type="button"
                onClick={() => handleKnowledgePointToggle(opt.knowledgeId)}
                className={`w-full text-left p-3 rounded-xl transition-colors ${
                  selectedKnowledgeIds.includes(opt.knowledgeId)
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <p className="font-medium">{opt.knowledgeName}</p>
                <p className="text-xs mt-1 opacity-80">所属章节：{opt.chapterName}</p>
                <p className="text-xs opacity-60">所属课时：{opt.lessonName}</p>
              </button>
            ))}
          </div>

          {!searchQuery.trim() && filteredKnowledgeOptions.length > MAX_DISPLAY_COUNT && (
            <button
              type="button"
              onClick={() => setShowAllKnowledge(!showAllKnowledge)}
              className="w-full py-2 text-primary-600 text-sm font-medium flex items-center justify-center gap-1 hover:bg-gray-50 rounded-xl transition-colors mb-4"
            >
              {showAllKnowledge ? '收起' : '展开更多'}
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showAllKnowledge ? 'rotate-180' : ''}`}
              />
            </button>
          )}

          <div className="mb-3">
            {selectedKnowledgeIds.length === 0 ? (
              <p className="text-xs text-gray-500 text-center">请选择至少 1 个知识点后生成练习</p>
            ) : (
              <p className="text-xs text-primary-600 text-center">
                已选择 {selectedKnowledgeIds.length} 个知识点
              </p>
            )}
          </div>

          <PrimaryButton className="w-full" onClick={handleGenerateCustomKnowledge}>
            生成练习
          </PrimaryButton>
        </AppCard>

        {/* ================================
         * 按章节练习（保留原结构）
         * ================================ */}
        <AppCard className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-orange-600" />
            <h3 className="text-gray-900 font-semibold">按章节练习</h3>
          </div>

          <div className="space-y-3">
            {textbookChapters.map(chapter => (
              <div key={chapter.chapterId} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="text-gray-900 font-medium">{chapter.chapterName}</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {chapter.lessonCount} 课时 · {chapter.mistakeCount} 道错题
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">已掌握</span>
                      <span className="text-xs text-primary-600 font-medium">
                        {chapter.masteryRate}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all"
                        style={{ width: `${chapter.masteryRate}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">错题 {chapter.mistakeCount} 道</span>
                </div>
                <PrimaryButton className="w-full" onClick={() => handleStartChapter(chapter)}>
                  练习本章
                </PrimaryButton>
              </div>
            ))}
          </div>
        </AppCard>

        {/* ================================
         * 自定义组卷
         * ================================ */}
        <AppCard className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="w-5 h-5 text-indigo-600" />
            <h3 className="text-gray-900 font-semibold">自定义组卷</h3>
          </div>
          <p className="text-gray-500 text-sm mb-4">
            按教材范围、章节、知识点、题量、难度和练习目标生成练习卷
          </p>

          {/* 1. 教材范围卡片 */}
          <div className="mb-4 p-4 bg-indigo-50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-800 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                教材范围
              </h4>
              <button
                type="button"
                onClick={() => setShowTextbookModal(true)}
                className="text-xs text-primary-600 hover:text-primary-700 font-medium"
              >
                修改教材
              </button>
            </div>
            <p className="text-sm text-gray-700 font-medium">
              {selectedStage === '高中'
                ? `${selectedStage} · ${selectedGrade} · ${selectedVolume} · ${selectedPublisher} · ${selectedMaterialType}`
                : `${selectedStage} · ${selectedGrade}${selectedVolume} · ${selectedPublisher} · ${selectedMaterialType}`}
            </p>
            <p className="text-xs text-gray-500 mt-1">来源：官方教材目录 mock</p>
          </div>

          {/* 2. 章节范围卡片 */}
          <div className="mb-4 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                章节范围
              </h4>
              <span className="text-xs text-gray-500">
                {customChapterIds.length > 0 ? `已选择 ${customChapterIds.length} 个章节` : '默认全部章节'}
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-3">当前为 mock 教材章节，后续将根据官方教材目录动态更新。</p>
            <div className="space-y-2">
              {availableChapters.map(chapter => {
                const selected = customChapterIds.includes(chapter.chapterId)
                return (
                  <button
                    key={chapter.chapterId}
                    type="button"
                    onClick={() => toggleCustomChapter(chapter.chapterId)}
                    className={`w-full text-left p-3 rounded-xl transition-colors ${
                      selected
                        ? 'bg-primary-500 text-white border-2 border-primary-500'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{chapter.chapterName}</span>
                      {selected && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <div className="flex items-center gap-3 text-xs opacity-75">
                      <span>{chapter.mistakeCount} 道错题</span>
                      <span>掌握度 {chapter.masteryRate}%</span>
                      <span>{chapter.lessonCount} 个课时</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 3. 知识点范围卡片 */}
          <div className="mb-4 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-800 flex items-center gap-2">
                <Tags className="w-4 h-4 text-indigo-500" />
                知识点范围
              </h4>
              <span className="text-xs text-gray-500">
                {customKnowledgeIds.length > 0 ? `已选择 ${customKnowledgeIds.length} 个知识点` : '默认覆盖所选章节下全部知识点'}
              </span>
            </div>

            {/* 搜索框 */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索知识点 / 章节 / 课时"
                value={customSearchQuery}
                onChange={(e) => {
                  setCustomSearchQuery(e.target.value)
                  if (e.target.value.trim()) setCustomShowAllKnowledge(true)
                }}
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
              />
            </div>

            <div className="max-h-[280px] overflow-y-auto space-y-2 mb-3 pr-1">
              {displayedCustomKnowledgeOptions.map(opt => {
                const selected = customKnowledgeIds.includes(opt.knowledgeId)
                return (
                  <button
                    key={opt.knowledgeId}
                    type="button"
                    onClick={() => toggleCustomKnowledge(opt.knowledgeId)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selected
                        ? 'bg-primary-500 text-white border-2 border-primary-500'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{opt.knowledgeName}</span>
                      {selected && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs opacity-75">
                      <span>所属章节：{opt.chapterName}</span>
                      <span>所属课时：{opt.lessonName}</span>
                    </div>
                  </button>
                )
              })}
            </div>

            {filteredCustomKnowledgeOptions.length > CUSTOM_MAX_KNOWLEDGE_DISPLAY && !customSearchQuery.trim() && (
              <button
                type="button"
                onClick={() => setCustomShowAllKnowledge(!customShowAllKnowledge)}
                className="w-full py-2 text-primary-600 text-xs font-medium flex items-center justify-center gap-1 hover:bg-white rounded-lg transition-colors"
              >
                {customShowAllKnowledge ? '收起' : `展开更多（共 ${filteredCustomKnowledgeOptions.length} 个知识点）`}
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${customShowAllKnowledge ? 'rotate-180' : ''}`}
                />
              </button>
            )}

            {filteredCustomKnowledgeOptions.length === 0 && (
              <p className="text-xs text-gray-500 text-center py-3">
                {customSearchQuery.trim() ? '未找到匹配的知识点' : '请先在上方选择章节，或清空章节筛选以显示全部知识点'}
              </p>
            )}
          </div>

          {/* 4. 题量 / 难度 两列 */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <h4 className="text-sm font-medium text-gray-800 mb-3">题量</h4>
              <div className="flex flex-wrap gap-1.5">
                {CUSTOM_QUESTION_COUNT_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setCustomCount(opt)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      customCount === opt
                        ? 'bg-primary-500 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {opt}题
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <h4 className="text-sm font-medium text-gray-800 mb-3">难度</h4>
              <div className="flex flex-wrap gap-1.5">
                {CUSTOM_DIFFICULTY_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setCustomDifficulty(opt)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      customDifficulty === opt
                        ? 'bg-primary-500 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 5. 练习目标卡片 */}
          <div className="mb-4 p-4 bg-gray-50 rounded-xl">
            <h4 className="text-sm font-medium text-gray-800 mb-3">练习目标</h4>
            <div className="flex flex-wrap gap-2">
              {CUSTOM_GOAL_OPTIONS.map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setCustomGoal(opt)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    customGoal === opt
                      ? 'bg-primary-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* 6. 组卷摘要 */}
          <div className="mb-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
            <h4 className="text-sm font-medium text-indigo-800 mb-3">组卷摘要</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">教材</span>
                <span className="text-gray-800 font-medium">
                  {selectedStage === '高中'
                    ? `${selectedStage} · ${selectedGrade} · ${selectedVolume} · ${selectedPublisher} · ${selectedMaterialType}`
                    : `${selectedStage} · ${selectedGrade}${selectedVolume} · ${selectedPublisher} · ${selectedMaterialType}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">章节</span>
                <span className="text-gray-800 font-medium">
                  {customChapterIds.length > 0
                    ? `已选择 ${customChapterIds.length} 个章节`
                    : '默认全部章节'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">知识点</span>
                <span className="text-gray-800 font-medium">
                  {customKnowledgeIds.length > 0
                    ? `已选择 ${customKnowledgeIds.length} 个知识点`
                    : '默认覆盖所选章节下全部知识点'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">题量</span>
                <span className="text-gray-800 font-medium">{customCount} 题</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">难度</span>
                <span className="text-gray-800 font-medium">{customDifficulty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">目标</span>
                <span className="text-gray-800 font-medium">{customGoal}</span>
              </div>
            </div>
          </div>

          {/* 7. 生成练习卷按钮 */}
          <PrimaryButton className="w-full" onClick={handleGenerateCustomPaper}>
            生成练习卷
          </PrimaryButton>
        </AppCard>

        {/* ================================
         * 最近生成
         * ================================ */}
        <AppCard className="mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-green-600" />
            <h3 className="text-gray-900 font-semibold">最近生成</h3>
          </div>

          <div className="space-y-3">
            {recentPapers.map(paper => (
              <div key={paper.paperId} className="p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-gray-900 font-medium text-sm">{paper.paperTitle}</h4>
                  <span className="text-xs text-gray-500">{paper.date}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {paper.count}题 · 正确率
                    </span>
                    <StatusTag type={paper.accuracy >= 70 ? 'success' : 'warning'}>
                      {paper.accuracy}%
                    </StatusTag>
                  </div>
                </div>
                <div className="flex gap-2">
                  <SecondaryButton
                    className="flex-1"
                    onClick={() => handleViewPaperResult(paper)}
                  >
                    查看结果
                  </SecondaryButton>
                  <PrimaryButton
                    className="flex-1"
                    onClick={() => handleContinuePaper(paper)}
                  >
                    继续练习
                  </PrimaryButton>
                </div>
              </div>
            ))}
          </div>
        </AppCard>
      </div>

      <Modal
        open={showInfoModal}
        title="知识点练习说明"
        confirmText="我知道了"
        onCancel={() => setShowInfoModal(false)}
      >
        <p className="text-gray-600 text-sm leading-relaxed">
          系统会根据你的错题记录和薄弱知识点推荐练习内容。你也可以按章节或知识点手动选择练习，或通过自定义组卷生成一整套练习卷。
          当前为 mock 组卷数据与教材目录，后续可接入官方教材章节、知识点与题库服务。
        </p>
      </Modal>

      <Modal
        open={showTextbookModal}
        title="选择教材"
        confirmText="确认选择"
        cancelText="取消"
        onConfirm={() => {
          setShowTextbookModal(false)
          setCustomChapterIds([])
          setCustomKnowledgeIds([])
          setCustomShowAllKnowledge(false)
          setCustomSearchQuery('')
          setToastMessage('教材已更新，章节和知识点范围已重置')
          setShowToast(true)
          setTimeout(() => setShowToast(false), 2000)
        }}
        onCancel={() => setShowTextbookModal(false)}
      >
        <div className="space-y-4">
          {/* 学段 */}
          <div>
            <label className="block text-xs text-gray-600 mb-2 font-medium">学段</label>
            <div className="flex flex-wrap gap-2">
              {STAGE_OPTIONS.map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setSelectedStage(opt)
                    const defaults = DEFAULT_BY_STAGE[opt]
                    setSelectedGrade(defaults.grade)
                    setSelectedVolume(defaults.volume)
                    setSelectedPublisher(defaults.publisher)
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedStage === opt
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* 年级 */}
          <div>
            <label className="block text-xs text-gray-600 mb-2 font-medium">年级</label>
            <div className="flex flex-wrap gap-2">
              {(GRADE_BY_STAGE[selectedStage] || []).map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSelectedGrade(opt)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedGrade === opt
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* 册别 */}
          <div>
            <label className="block text-xs text-gray-600 mb-2 font-medium">册别</label>
            <div className="flex flex-wrap gap-2">
              {(VOLUME_BY_STAGE[selectedStage] || []).map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSelectedVolume(opt)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedVolume === opt
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* 版本 */}
          <div>
            <label className="block text-xs text-gray-600 mb-2 font-medium">版本</label>
            <div className="flex flex-wrap gap-2">
              {(PUBLISHER_BY_STAGE[selectedStage] || []).map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSelectedPublisher(opt)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedPublisher === opt
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* 资料类型 */}
          <div>
            <label className="block text-xs text-gray-600 mb-2 font-medium">资料类型</label>
            <div className="flex flex-wrap gap-2">
              {MATERIAL_TYPE_OPTIONS.map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSelectedMaterialType(opt)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedMaterialType === opt
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* 当前选择摘要 */}
          <div className="p-3 bg-gray-50 rounded-lg mt-4">
            <p className="text-xs text-gray-500 mb-1">当前选择</p>
            <p className="text-sm text-gray-800 font-medium">
              {selectedStage === '高中'
                ? `${selectedStage} · ${selectedGrade} · ${selectedVolume} · ${selectedPublisher} · ${selectedMaterialType}`
                : `${selectedStage} · ${selectedGrade}${selectedVolume} · ${selectedPublisher} · ${selectedMaterialType}`}
            </p>
          </div>

          {/* 说明文字 */}
          <div className="p-3 bg-blue-50 rounded-lg mt-2">
            <p className="text-xs text-blue-600">
              当前为 mock 教材目录，后续将接入官方教材版本与章节目录。
            </p>
          </div>
        </div>
      </Modal>

      <Toast message={toastMessage} visible={showToast} />
    </div>
  )
}
