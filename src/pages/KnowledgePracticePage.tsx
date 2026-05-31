import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Info, Tags, BookOpen, Target, Clock, ChevronRight } from 'lucide-react'
import AppCard from '../components/ui/AppCard'
import StatusTag from '../components/ui/StatusTag'
import PrimaryButton from '../components/ui/PrimaryButton'
import Modal from '../components/ui/Modal'
import Toast from '../components/ui/Toast'

interface RecommendItem {
  id: number
  title: string
  description: string
  questionCount: number
  duration: number
  difficulty: string
}

const recommendItems: RecommendItem[] = [
  {
    id: 1,
    title: '一元一次方程移项',
    description: '近7天重复出错，建议优先练习',
    questionCount: 6,
    duration: 12,
    difficulty: '中等'
  },
  {
    id: 2,
    title: '二次函数顶点坐标',
    description: '正确率偏低，需要巩固概念',
    questionCount: 5,
    duration: 10,
    difficulty: '中等'
  },
  {
    id: 3,
    title: '几何辅助线证明',
    description: '步骤遗漏较多，建议专项训练',
    questionCount: 4,
    duration: 15,
    difficulty: '困难'
  }
]

const knowledgePoints = [
  '一元一次方程',
  '二次函数',
  '几何证明',
  '分式方程',
  '概率基础',
  '应用题建模',
  '等式性质',
  '计算规范'
]

interface ChapterItem {
  id: number
  title: string
  mastery: number
  mistakeCount: number
}

const chapterItems: ChapterItem[] = [
  {
    id: 1,
    title: '七年级上 · 一元一次方程',
    mastery: 70,
    mistakeCount: 12
  },
  {
    id: 2,
    title: '八年级上 · 几何证明',
    mastery: 58,
    mistakeCount: 9
  },
  {
    id: 3,
    title: '九年级上 · 二次函数',
    mastery: 62,
    mistakeCount: 15
  }
]

interface RecentItem {
  id: number
  title: string
  accuracy: number
  date: string
}

const recentItems: RecentItem[] = [
  {
    id: 1,
    title: '一元一次方程专项',
    accuracy: 80,
    date: '昨天'
  },
  {
    id: 2,
    title: '二次函数基础练习',
    accuracy: 60,
    date: '2天前'
  },
  {
    id: 3,
    title: '几何证明步骤训练',
    accuracy: 67,
    date: '3天前'
  }
]

export default function KnowledgePracticePage() {
  const navigate = useNavigate()
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [selectedKnowledgePoints, setSelectedKnowledgePoints] = useState<string[]>([])

  const handleBack = () => {
    navigate('/practice')
  }

  const handleViewInfo = () => {
    setShowInfoModal(true)
  }

  const handleStartRecommend = () => {
    navigate('/practice/1?from=knowledge-practice&type=recommend')
  }

  const handleKnowledgePointToggle = (kp: string) => {
    if (selectedKnowledgePoints.includes(kp)) {
      setSelectedKnowledgePoints(selectedKnowledgePoints.filter(k => k !== kp))
    } else {
      setSelectedKnowledgePoints([...selectedKnowledgePoints, kp])
    }
  }

  const handleGenerateCustom = () => {
    if (selectedKnowledgePoints.length === 0) {
      setToastMessage('请至少选择一个知识点')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
      return
    }
    setToastMessage('已生成知识点练习')
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      navigate('/practice/1?from=knowledge-practice&type=custom')
    }, 1500)
  }

  const handleStartChapter = () => {
    navigate('/practice/1?from=knowledge-practice&type=chapter')
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
                onClick={handleStartRecommend}
                className="w-full text-left"
              >
                <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="text-gray-900 font-medium mb-1">{item.title}</h4>
                      <p className="text-gray-500 text-sm">{item.description}</p>
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
                    <StatusTag type={item.difficulty === '困难' ? 'error' : item.difficulty === '中等' ? 'warning' : 'success'}>
                      {item.difficulty}
                    </StatusTag>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </AppCard>

        <AppCard className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Tags className="w-5 h-5 text-blue-600" />
            <h3 className="text-gray-900 font-semibold">按知识点选择</h3>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {knowledgePoints.map(kp => (
              <button
                key={kp}
                type="button"
                onClick={() => handleKnowledgePointToggle(kp)}
                className={`px-3 py-2 rounded-xl text-sm transition-colors ${
                  selectedKnowledgePoints.includes(kp)
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {kp}
              </button>
            ))}
          </div>

          <PrimaryButton className="w-full" onClick={handleGenerateCustom}>
            生成练习
          </PrimaryButton>
        </AppCard>

        <AppCard className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-orange-600" />
            <h3 className="text-gray-900 font-semibold">按章节练习</h3>
          </div>

          <div className="space-y-3">
            {chapterItems.map(item => (
              <div key={item.id} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-gray-900 font-medium">{item.title}</h4>
                </div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">已掌握</span>
                      <span className="text-xs text-primary-600 font-medium">{item.mastery}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all"
                        style={{ width: `${item.mastery}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">错题 {item.mistakeCount} 道</span>
                </div>
                <PrimaryButton className="w-full" onClick={handleStartChapter}>
                  练习本章
                </PrimaryButton>
              </div>
            ))}
          </div>
        </AppCard>

        <AppCard className="mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-green-600" />
            <h3 className="text-gray-900 font-semibold">最近练过</h3>
          </div>

          <div className="space-y-3">
            {recentItems.map(item => (
              <div key={item.id} className="p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <h4 className="text-gray-900 font-medium">{item.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{item.date}</span>
                    <StatusTag type={item.accuracy >= 70 ? 'success' : 'warning'}>
                      {item.accuracy}%
                    </StatusTag>
                  </div>
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
        <p className="text-gray-600 text-sm">
          系统会根据你的错题记录和薄弱知识点推荐练习内容。你也可以按章节或知识点手动选择练习。
        </p>
      </Modal>

      <Toast message={toastMessage} visible={showToast} />
    </div>
  )
}
