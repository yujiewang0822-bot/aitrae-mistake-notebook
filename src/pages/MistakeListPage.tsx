import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, BookOpen, ChevronDown } from 'lucide-react'
import Header from '../components/layout/Header'
import BottomNav from '../components/layout/BottomNav'
import AppCard from '../components/ui/AppCard'
import PrimaryButton from '../components/ui/PrimaryButton'
import MistakeCard from '../components/business/MistakeCard'
import { mistakes, homeSummary } from '../data/mockData'

export default function MistakeListPage() {
  const navigate = useNavigate()
  const [selectedTag, setSelectedTag] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filterTags = [
    { key: 'all', label: '全部' },
    { key: 'pending', label: '待复习' },
    { key: 'reviewing', label: '待强化' },
    { key: 'mastered', label: '已掌握' },
    { key: 'exam', label: '考试重点' }
  ]

  const filterMistakes = mistakes.filter(mistake => {
    const matchesTag = selectedTag === 'all' || mistake.status === selectedTag
    const matchesSearch = searchQuery === '' || 
      mistake.knowledgePoint.includes(searchQuery) ||
      mistake.questionText.includes(searchQuery) ||
      mistake.tags.some(tag => tag.includes(searchQuery))
    return matchesTag && matchesSearch
  })

  return (
    <div className="pb-20">
      <Header title="错题本" />

      <div className="px-4 pt-4">
        <p className="text-sm text-gray-500 mb-4">查看你反复出错的知识点</p>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索知识点、题目、标签"
            className="w-full h-11 pl-10 pr-4 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <AppCard className="mb-4">
          <div className="flex justify-around">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">{homeSummary.totalMistakes}</div>
              <span className="text-xs text-gray-500">错题总数</span>
            </div>
            <div className="w-px bg-gray-200" />
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-500 mb-1">{homeSummary.pendingMasterMistakes}</div>
              <span className="text-xs text-gray-500">待复习</span>
            </div>
            <div className="w-px bg-gray-200" />
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500 mb-1">{homeSummary.masteredMistakes}</div>
              <span className="text-xs text-gray-500">已掌握</span>
            </div>
          </div>
        </AppCard>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {filterTags.map(tag => (
            <button
              key={tag.key}
              onClick={() => setSelectedTag(tag.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedTag === tag.key
                  ? 'bg-primary-100 text-primary-700 border border-primary-200'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {['学科', '知识点', '错误类型', '掌握状态', '最近更新'].map((item) => (
            <button
              key={item}
              className="flex items-center gap-1 px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm text-gray-600 whitespace-nowrap"
            >
              <span>{item}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          ))}
        </div>

        {filterMistakes.length > 0 ? (
          <div className="space-y-3">
            {filterMistakes.map(mistake => (
              <MistakeCard
                key={mistake.id}
                mistake={mistake}
                onClick={() => navigate(`/mistake/${mistake.id}`)}
              />
            ))}
          </div>
        ) : (
          <AppCard className="p-8 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">还没有错题</h3>
            <p className="text-sm text-gray-500 mb-4">先拍照录入一道吧</p>
            <PrimaryButton onClick={() => navigate('/upload')}>
              去录入
            </PrimaryButton>
          </AppCard>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
