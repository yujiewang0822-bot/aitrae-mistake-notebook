import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Target, BookOpen, Brain, AlertCircle, ChevronRight, Sparkles, CheckCircle } from 'lucide-react'
import BottomNav from '../components/layout/BottomNav'
import AppCard from '../components/ui/AppCard'
import StatusTag from '../components/ui/StatusTag'
import PrimaryButton from '../components/ui/PrimaryButton'
import SecondaryButton from '../components/ui/SecondaryButton'
import Modal from '../components/ui/Modal'
import Toast from '../components/ui/Toast'
import { messages } from '../data/mockData'

export default function HomePage() {
  const navigate = useNavigate()
  const [todayCheckedIn, setTodayCheckedIn] = useState(false)
  const [showNoMistakeModal, setShowNoMistakeModal] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [isNewUser, setIsNewUser] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [showChapterModal, setShowChapterModal] = useState(false)
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set())
  
  const unreadCount = messages.filter(m => !m.read).length

  const toggleChapter = (chapterName: string) => {
    const newExpanded = new Set(expandedChapters)
    if (newExpanded.has(chapterName)) {
      newExpanded.delete(chapterName)
    } else {
      newExpanded.add(chapterName)
    }
    setExpandedChapters(newExpanded)
  }

  interface ChapterNode {
    name: string
    mistakeCount: number
    status: string
    statusType: 'error' | 'warning' | 'success' | 'default'
    tip: string
    isExpanded: boolean
    lessons?: { id: number; name: string; count: number }[]
    mastered?: number
    pending?: number
  }

  const chapterDistribution: ChapterNode[] = [
    { 
      name: '第一单元 一元一次方程', 
      mistakeCount: 12, 
      status: '高频错题', 
      statusType: 'error' as const, 
      tip: '移项符号错误较多',
      isExpanded: false,
      mastered: 8,
      pending: 4,
      lessons: [
        { id: 1, name: '第1课 等式性质', count: 3 },
        { id: 2, name: '第2课 移项与合并同类项', count: 5 },
        { id: 3, name: '第3课 方程应用', count: 4 }
      ]
    },
    { 
      name: '第二单元 二次函数', 
      mistakeCount: 9, 
      status: '需关注', 
      statusType: 'warning' as const, 
      tip: '顶点坐标判断正确率偏低',
      isExpanded: false,
      mastered: 6,
      pending: 3,
      lessons: [
        { id: 4, name: '第1课 函数图像', count: 3 },
        { id: 5, name: '第2课 顶点坐标', count: 4 },
        { id: 6, name: '第3课 图像平移', count: 2 }
      ]
    },
    { 
      name: '第三单元 几何证明', 
      mistakeCount: 7, 
      status: '需关注', 
      statusType: 'warning' as const, 
      tip: '证明步骤遗漏较多',
      isExpanded: false,
      mastered: 2,
      pending: 5,
      lessons: [
        { id: 7, name: '第1课 全等三角形', count: 3 },
        { id: 8, name: '第2课 辅助线构造', count: 2 },
        { id: 9, name: '第3课 证明步骤表达', count: 2 }
      ]
    },
    { 
      name: '第四单元 概率基础', 
      mistakeCount: 0, 
      status: '暂无错题', 
      statusType: 'default' as const, 
      tip: '当前没有该章节错题记录',
      isExpanded: false
    },
    { 
      name: '第五单元 统计与图表', 
      mistakeCount: 4, 
      status: '掌握良好', 
      statusType: 'success' as const, 
      tip: '图表解读正确率较高',
      isExpanded: false,
      mastered: 4,
      pending: 0,
      lessons: [
        { id: 10, name: '第1课 数据收集', count: 2 },
        { id: 11, name: '第2课 图表制作', count: 2 }
      ]
    },
    { 
      name: '第六单元 比例与相似', 
      mistakeCount: 3, 
      status: '掌握良好', 
      statusType: 'success' as const, 
      tip: '比例计算正确率较高',
      isExpanded: false,
      mastered: 3,
      pending: 0
    }
  ]

  const handleCheckIn = () => {
    setTodayCheckedIn(true)
    setShowNoMistakeModal(false)
    if (isNewUser) {
      setToastMessage('今日学习记录已完成，之后有错题可以随时录入')
    } else {
      setToastMessage('今日学习记录已完成，继续保持')
    }
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const handleToggleUserType = () => {
    setIsNewUser(!isNewUser)
    setTodayCheckedIn(false)
  }

  return (
    <div className="bg-[#F6F8FB] min-h-screen">
      <div className="px-4 pt-4 md:px-0 md:pt-6">
        {/* 顶部标题和消息图标 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isNewUser ? '开始记录你的第一道数学错题吧' : '今天也记录一下数学学习问题吧'}
            </h1>
            <p className="text-gray-500 text-sm">
              {isNewUser ? '拍照录入一道错题，AI 会帮你识别题目、判断答案并分析错因。' : '每天记录一次，才能看见自己真正反复出错的地方'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* 消息图标 - 移动端显示 */}
            <button 
              onClick={() => navigate('/message')}
              className="relative p-2 md:hidden"
            >
              <Bell className="w-6 h-6 text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
            {/* 用户状态切换按钮 */}
            <button
              onClick={handleToggleUserType}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors hidden md:block"
            >
              {isNewUser ? '切换为老用户演示' : '切换为新用户演示'}
            </button>
          </div>
        </div>

        {/* 第一行：左侧主卡片 + 右侧栏 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* 左侧主卡片 - 今日数学错题打卡 */}
          <div className="lg:col-span-2">
            <AppCard className="p-5 border border-primary-100">
              {isNewUser ? (
                <>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">先录入第一道错题</h3>
                  <p className="text-gray-500 text-sm mb-4">从一道数学错题开始，系统会逐步帮你建立属于自己的错题本。</p>
                  
                  <div className="flex justify-around mb-6 py-3 bg-gray-50 rounded-xl">
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">今日状态</div>
                      <div className="text-lg font-bold text-primary-600">
                        {todayCheckedIn ? '已完成' : '未开始'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">当前错题</div>
                      <div className="text-lg font-bold text-gray-900">0道</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">学习记录</div>
                      <div className="text-lg font-bold text-gray-900">等待建立</div>
                    </div>
                  </div>

                  {todayCheckedIn && (
                    <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-green-600" />
                        <h4 className="font-medium text-gray-900">今日学习记录已完成</h4>
                      </div>
                      <p className="text-sm text-gray-600">之后有错题可以随时录入，系统会帮你分析整理。</p>
                    </div>
                  )}

                  {!todayCheckedIn && (
                    <>
                      <PrimaryButton className="w-full mb-3" onClick={() => navigate('/upload')}>
                        拍照录入第一道错题
                      </PrimaryButton>
                      <SecondaryButton className="w-full" onClick={() => setShowNoMistakeModal(true)}>
                        我今天没有错题
                      </SecondaryButton>
                    </>
                  )}

                  {todayCheckedIn && (
                    <PrimaryButton className="w-full" onClick={() => navigate('/upload')}>
                      录入错题
                    </PrimaryButton>
                  )}
                </>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">今日数学错题打卡</h3>
                  <p className="text-gray-500 text-sm mb-4">有错题就拍照录入，没错题也可以完成今日学习记录。</p>
                  
                  <div className="flex justify-around mb-6 py-3 bg-gray-50 rounded-xl">
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">今日状态</div>
                      <div className="text-lg font-bold text-primary-600">
                        {todayCheckedIn ? '已打卡' : '未打卡'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">连续记录</div>
                      <div className="text-lg font-bold text-gray-900">7天</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">本周记录</div>
                      <div className="text-lg font-bold text-gray-900">5次</div>
                    </div>
                  </div>

                  {todayCheckedIn && (
                    <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-green-600" />
                        <h4 className="font-medium text-gray-900">今日已完成学习记录</h4>
                      </div>
                      <p className="text-sm text-gray-600">今天没有错题也很棒，系统已记录你的学习状态。</p>
                    </div>
                  )}

                  {!todayCheckedIn && (
                    <>
                      <PrimaryButton className="w-full mb-3" onClick={() => navigate('/upload')}>
                        拍照录入错题
                      </PrimaryButton>
                      <SecondaryButton className="w-full" onClick={() => setShowNoMistakeModal(true)}>
                        今天没有错题
                      </SecondaryButton>
                    </>
                  )}

                  {todayCheckedIn && (
                    <PrimaryButton className="w-full" onClick={() => navigate('/upload')}>
                      继续录入错题
                    </PrimaryButton>
                  )}
                </>
              )}
            </AppCard>
          </div>

          {!isNewUser && (
            <div className="space-y-4">
              {/* 今日记录状态 */}
              <AppCard className="p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">今日记录</span>
                  <div className="flex items-center gap-2">
                    {todayCheckedIn ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">已完成</span>
                      </>
                    ) : (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                        <span className="text-sm text-gray-500">等待记录</span>
                      </>
                    )}
                  </div>
                </div>
                {todayCheckedIn && (
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-100 rounded-full text-xs font-medium text-green-600">
                      +5 学习积分
                    </span>
                    <span className="px-2 py-1 bg-blue-100 rounded-full text-xs font-medium text-blue-600">
                      连续 7 天
                    </span>
                  </div>
                )}
              </AppCard>

              {/* 继续完善轻提示 */}
              <AppCard className="p-4 bg-blue-50 border border-blue-100">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">还有 1 道错题待确认</h4>
                    <p className="text-sm text-gray-600 mb-2">AI 已识别题目，等待你确认章节、知识点和错因。</p>
                    <button 
                      onClick={() => navigate('/save-mistake')}
                      className="text-primary-600 font-medium text-sm"
                    >
                      继续完善 →
                    </button>
                  </div>
                </div>
              </AppCard>
            </div>
          )}
        </div>

        {isNewUser ? (
          /* 新用户引导模块 */
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">录入后你可以获得</h3>
            <AppCard className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">自动识别题目和答案</h4>
                  <p className="text-xs text-gray-500">AI 智能识别拍照内容</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                    <Brain className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">AI 分析错误原因</h4>
                  <p className="text-xs text-gray-500">智能诊断错因类型</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">按章节生成错题本</h4>
                  <p className="text-xs text-gray-500">自动整理分类</p>
                </div>
              </div>
            </AppCard>
          </div>
        ) : (
          /* 老用户：数学错题概览 */
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">数学错题概览</h3>
            <AppCard>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/mistakes?filter=all')}
                  className="text-center hover:bg-gray-50 rounded-lg transition-colors py-2 -my-2"
                >
                  <div className="text-xl font-bold text-gray-900 mb-1 hover:underline underline-offset-2">45道</div>
                  <span className="text-xs text-gray-500">已记录</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowChapterModal(true)
                  }}
                  className="text-center hover:bg-gray-50 rounded-lg transition-colors py-2 -my-2"
                >
                  <div className="text-xl font-bold text-primary-600 mb-1 hover:underline underline-offset-2">6个</div>
                  <span className="text-xs text-gray-500">覆盖章节 →</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/mistakes?filter=mastered')}
                  className="text-center hover:bg-gray-50 rounded-lg transition-colors py-2 -my-2"
                >
                  <div className="text-xl font-bold text-green-600 mb-1 hover:underline underline-offset-2">33道</div>
                  <span className="text-xs text-gray-500">已掌握</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/mistakes?filter=review')}
                  className="text-center hover:bg-gray-50 rounded-lg transition-colors py-2 -my-2"
                >
                  <div className="text-xl font-bold text-amber-600 mb-1 hover:underline underline-offset-2">12道</div>
                  <span className="text-xs text-gray-500">待复习</span>
                </button>
              </div>
              <p className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg mt-4">
                错题主要集中在：一元一次方程、二次函数
              </p>
            </AppCard>
          </div>
        )}

        {!isNewUser && (
          /* 老用户：主动复习与练习 */
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">想复习一下？</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <AppCard className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/mistakes')}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-0.5">按章节复习</h4>
                    <p className="text-xs text-gray-500">查看各单元错题分布</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </AppCard>

              <AppCard className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/exam-practice')}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Brain className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-0.5">期中专题练习</h4>
                    <p className="text-xs text-gray-500">根据考试目标自动组卷</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </AppCard>

              <AppCard className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/knowledge-practice')}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-0.5">薄弱点练习</h4>
                    <p className="text-xs text-gray-500">根据错题记录专项练习</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </AppCard>
            </div>
          </div>
        )}
      </div>

      <Modal
        open={showNoMistakeModal}
        title={isNewUser ? '今天没有错题？' : '今天没有错题？'}
        confirmText="确认打卡"
        onConfirm={handleCheckIn}
        onCancel={() => setShowNoMistakeModal(false)}
      >
        <p className="text-gray-600 text-sm">
          {isNewUser ? '如果今天确实没有需要记录的数学错题，也可以先完成一次学习记录。之后有错题时，再拍照录入即可。' : '如果今天确实没有需要记录的数学错题，也可以完成一次学习打卡。系统会保留你的学习记录，帮助你形成连续记录习惯。'}
        </p>
      </Modal>

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
              <span className="font-semibold">八年级上册 · 人教版</span>
            </div>
          </div>
        </div>
        
        {/* 连接线 */}
        <div className="flex justify-center mb-4">
          <div className="w-0.5 h-4 bg-gray-300" />
        </div>
        
        {/* 章节节点列表 - 支持滚动 */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {chapterDistribution.map((chapter, index) => {
            const isExpanded = expandedChapters.has(chapter.name)
            return (
              <div key={chapter.name} className={`flex gap-4 ${chapter.mistakeCount > 0 ? '' : 'opacity-50'}`}>
                {/* 连接线 */}
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${chapter.mistakeCount > 0 ? 'bg-primary-500' : 'bg-gray-300'}`} />
                  {index < chapterDistribution.length - 1 && (
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
                          <StatusTag type={chapter.statusType}>{chapter.status}</StatusTag>
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
                      {chapter.tip}
                    </p>
                    {chapter.mistakeCount > 0 && chapter.mastered !== undefined && chapter.pending !== undefined && (
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span>已掌握 {chapter.mastered} 道</span>
                        <span className="text-gray-300">|</span>
                        <span>待复习 {chapter.pending} 道</span>
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
                            onClick={() => navigate(`/mistakes?chapter=${chapter.name}&lesson=${lesson.name}`)}
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
