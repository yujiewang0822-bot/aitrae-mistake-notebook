import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Info, Sparkles, Settings, Clock, ChevronRight, CheckCircle } from 'lucide-react'
import AppCard from '../components/ui/AppCard'
import StatusTag from '../components/ui/StatusTag'
import PrimaryButton from '../components/ui/PrimaryButton'
import Modal from '../components/ui/Modal'
import Toast from '../components/ui/Toast'

interface ExamPaper {
  id: number
  title: string
  description: string
  questionCount: number
  duration: number
  difficulty: string
  knowledgePoints: string[]
  type: string
}

const examPapers: ExamPaper[] = [
  {
    id: 1,
    title: '期中考前模拟卷',
    description: '覆盖近期高频错题和考试重点',
    questionCount: 10,
    duration: 25,
    difficulty: '中等',
    knowledgePoints: ['一元一次方程', '二次函数', '几何证明'],
    type: 'mock'
  },
  {
    id: 2,
    title: '薄弱知识点专项卷',
    description: '针对近期反复出错的知识点强化',
    questionCount: 8,
    duration: 20,
    difficulty: '中等',
    knowledgePoints: ['一元一次方程', '分式方程'],
    type: 'weakness'
  },
  {
    id: 3,
    title: '错题同类强化卷',
    description: '根据已保存错题生成同类变式题',
    questionCount: 6,
    duration: 15,
    difficulty: '中等',
    knowledgePoints: ['移项', '计算规范'],
    type: 'similar'
  },
  {
    id: 4,
    title: '基础巩固卷',
    description: '适合快速检查基础掌握情况',
    questionCount: 10,
    duration: 18,
    difficulty: '简单',
    knowledgePoints: ['基础运算', '等式性质'],
    type: 'basic'
  }
]

interface RecentRecord {
  id: number
  title: string
  questionCount: number
  status: string
  accuracy?: number
  date: string
  buttonText: string
  type: string
}

const recentRecords: RecentRecord[] = [
  {
    id: 1,
    title: '期中模拟卷 01',
    questionCount: 10,
    status: '已完成',
    accuracy: 80,
    date: '昨天',
    buttonText: '查看结果',
    type: 'result'
  },
  {
    id: 2,
    title: '二次函数专项卷',
    questionCount: 8,
    status: '未完成',
    date: '今天',
    buttonText: '继续练习',
    type: 'continue'
  },
  {
    id: 3,
    title: '几何证明强化卷',
    questionCount: 6,
    status: '已完成',
    accuracy: 67,
    date: '前天',
    buttonText: '查看结果',
    type: 'result'
  }
]

const chapters = [
  '一元一次方程',
  '二次函数',
  '几何证明',
  '分式方程',
  '概率基础'
]

const questionCounts = ['5题', '10题', '15题']
const difficulties = ['简单', '中等', '困难', '混合']
const practiceGoals = ['基础巩固', '查漏补缺', '考前模拟', '易错强化']

export default function ExamPracticePage() {
  const navigate = useNavigate()
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  
  const [selectedChapters, setSelectedChapters] = useState<string[]>([])
  const [selectedQuestionCount, setSelectedQuestionCount] = useState('10题')
  const [selectedDifficulty, setSelectedDifficulty] = useState('中等')
  const [selectedGoal, setSelectedGoal] = useState('查漏补缺')

  const handleBack = () => {
    navigate('/practice')
  }

  const handleViewInfo = () => {
    setShowInfoModal(true)
  }

  const handleStartExam = (paper: ExamPaper) => {
    navigate(`/practice/1?from=exam-practice&type=${paper.type}`)
  }

  const handleChapterToggle = (chapter: string) => {
    if (selectedChapters.includes(chapter)) {
      setSelectedChapters(selectedChapters.filter(c => c !== chapter))
    } else {
      setSelectedChapters([...selectedChapters, chapter])
    }
  }

  const handleGenerateCustom = () => {
    if (selectedChapters.length === 0) {
      setToastMessage('请至少选择一个章节或知识点')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
      return
    }
    setToastMessage('已根据你的条件生成练习卷')
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      navigate('/practice/1?from=exam-practice&type=custom')
    }, 1500)
  }

  const handleRecentRecord = (record: RecentRecord) => {
    if (record.type === 'result') {
      navigate('/practice-result')
    } else {
      navigate(`/practice/1?from=exam-practice&type=continue`)
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
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-gray-900 font-medium text-lg">考试专题练习</h1>
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
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="text-gray-900 font-semibold">AI推荐试卷</h3>
          </div>
          <p className="text-gray-500 text-sm mb-4">根据你的近期目标和薄弱知识点生成</p>
          
          <div className="space-y-3">
            {examPapers.map(paper => (
              <button
                key={paper.id}
                type="button"
                onClick={() => handleStartExam(paper)}
                className="w-full text-left"
              >
                <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="text-gray-900 font-medium mb-1">{paper.title}</h4>
                      <p className="text-gray-500 text-sm">{paper.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="px-2 py-1 bg-white rounded text-xs text-gray-600">
                      {paper.questionCount}题
                    </span>
                    <span className="px-2 py-1 bg-white rounded text-xs text-gray-600">
                      {paper.duration}分钟
                    </span>
                    <StatusTag type={paper.difficulty === '简单' ? 'success' : 'warning'}>
                      {paper.difficulty}
                    </StatusTag>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {paper.knowledgePoints.map((kp, index) => (
                      <span key={index} className="px-2 py-0.5 bg-blue-50 rounded text-xs text-blue-600">
                        {kp}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </AppCard>

        <AppCard className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="w-5 h-5 text-blue-600" />
            <h3 className="text-gray-900 font-semibold">自定义组卷</h3>
          </div>
          <p className="text-gray-500 text-sm mb-4">按章节、知识点、难度和题量生成练习卷</p>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">章节范围</label>
              <div className="flex flex-wrap gap-2">
                {chapters.map(chapter => (
                  <button
                    key={chapter}
                    type="button"
                    onClick={() => handleChapterToggle(chapter)}
                    className={`px-3 py-2 rounded-xl text-sm transition-colors ${
                      selectedChapters.includes(chapter)
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {chapter}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">题量</label>
              <div className="flex gap-2">
                {questionCounts.map(count => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setSelectedQuestionCount(count)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                      selectedQuestionCount === count
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">难度</label>
              <div className="flex gap-2">
                {difficulties.map(diff => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                      selectedDifficulty === diff
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">练习目标</label>
              <div className="grid grid-cols-2 gap-2">
                {practiceGoals.map(goal => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => setSelectedGoal(goal)}
                    className={`py-2 rounded-xl text-sm font-medium transition-colors ${
                      selectedGoal === goal
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>

            <PrimaryButton className="w-full mt-2" onClick={handleGenerateCustom}>
              生成练习卷
            </PrimaryButton>
          </div>
        </AppCard>

        <AppCard className="mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-orange-600" />
            <h3 className="text-gray-900 font-semibold">最近生成</h3>
          </div>

          <div className="space-y-3">
            {recentRecords.map(record => (
              <button
                key={record.id}
                type="button"
                onClick={() => handleRecentRecord(record)}
                className="w-full text-left"
              >
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-gray-900 font-medium">{record.title}</h4>
                      {record.status === '已完成' && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <p className="text-gray-500 text-sm">
                      {record.questionCount}题
                      {record.accuracy !== undefined && `｜正确率 ${record.accuracy}%`}
                      {record.status === '未完成' && `｜${record.status}`}
                      {record.date !== '今天' && `｜${record.date}`}
                    </p>
                  </div>
                  <span className="text-primary-600 text-sm font-medium">{record.buttonText} →</span>
                </div>
              </button>
            ))}
          </div>
        </AppCard>
      </div>

      <Modal
        open={showInfoModal}
        title="考试专题练习说明"
        confirmText="我知道了"
        onCancel={() => setShowInfoModal(false)}
      >
        <p className="text-gray-600 text-sm">
          系统会根据你的考试目标、薄弱知识点、错题记录和章节范围，自动生成练习卷。你也可以手动选择知识点、题量和难度进行自定义组卷。
        </p>
      </Modal>

      <Toast message={toastMessage} visible={showToast} />
    </div>
  )
}
