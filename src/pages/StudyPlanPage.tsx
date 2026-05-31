import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Info, Target, CalendarDays, Clock, TrendingUp, BookOpen, PenTool, Pencil, X } from 'lucide-react'
import Header from '../components/layout/Header'
import AppCard from '../components/ui/AppCard'
import StatusTag from '../components/ui/StatusTag'
import PrimaryButton from '../components/ui/PrimaryButton'
import SecondaryButton from '../components/ui/SecondaryButton'
import Modal from '../components/ui/Modal'
import Toast from '../components/ui/Toast'

interface TodayTask {
  id: number
  title: string
  type: string
  duration: number
  reason: string
  status: 'pending' | 'inProgress' | 'completed'
  actionText: string
  actionPath: string
}

interface WeakKnowledge {
  name: string
  status: string
}

interface WeekPlan {
  day: number
  label: string
  tasks: string[]
}

const PRESET_FOCUS_POINTS = [
  '一元一次方程',
  '二次函数',
  '几何证明',
  '分式方程',
  '三角形全等',
  '概率',
  '应用题建模'
]

export default function StudyPlanPage() {
  const navigate = useNavigate()
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [showInfoModal, setShowInfoModal] = useState(false)
  
  // 考试目标编辑相关状态
  const [showGoalModal, setShowGoalModal] = useState(false)
  const [examName, setExamName] = useState('期中考试')
  const [examDate, setExamDate] = useState('2026-06-15')
  const [dailyDuration, setDailyDuration] = useState<'30' | '45' | '60'>('45')
  const [tempExamName, setTempExamName] = useState('')
  const [tempExamDate, setTempExamDate] = useState('')
  const [tempDailyDuration, setTempDailyDuration] = useState<'30' | '45' | '60'>('45')
  
  // 当前重点编辑相关状态
  const [showFocusModal, setShowFocusModal] = useState(false)
  const [selectedFocusPoints, setSelectedFocusPoints] = useState<string[]>(['一元一次方程', '二次函数', '几何证明'])
  const [customFocusPoints, setCustomFocusPoints] = useState<string[]>([])
  const [tempSelectedFocusPoints, setTempSelectedFocusPoints] = useState<string[]>([])
  const [tempCustomFocusPoints, setTempCustomFocusPoints] = useState<string[]>([])
  const [showAddFocusInput, setShowAddFocusInput] = useState(false)
  const [newFocusInput, setNewFocusInput] = useState('')

  const examGoal = {
    name: examName,
    daysLeft: 14,
    strategy: '先补薄弱知识点，再进行专题练习',
    focusPoints: selectedFocusPoints
  }

  const planStats = {
    cycle: 7,
    todayTasks: 3,
    completed: 1,
    duration: 35,
    completionRate: 33
  }

  const todayTasks: TodayTask[] = [
    {
      id: 1,
      title: '复习一元一次方程错题',
      type: '错题复习',
      duration: 10,
      reason: '近7天计算错误重复出现',
      status: 'pending',
      actionText: '开始复习',
      actionPath: '/today-review'
    },
    {
      id: 2,
      title: '完成二次函数专题练习',
      type: '专题练习',
      duration: 15,
      reason: '近期正确率低于 70%',
      status: 'inProgress',
      actionText: '开始练习',
      actionPath: '/practice/1'
    },
    {
      id: 3,
      title: '整理几何证明错因',
      type: '错因复盘',
      duration: 10,
      reason: '步骤遗漏类错误较多',
      status: 'completed',
      actionText: '查看详情',
      actionPath: '/mistake/1'
    }
  ]

  const weakKnowledge: WeakKnowledge[] = [
    { name: '一元一次方程', status: '需重点复习' },
    { name: '二次函数', status: '正确率偏低' },
    { name: '三角形全等', status: '易重复出错' },
    { name: '分式方程', status: '需重点复习' }
  ]

  const weekPlan: WeekPlan[] = [
    { day: 1, label: '今天', tasks: ['错题复习', '一元一次方程练习'] },
    { day: 2, label: '明天', tasks: ['二次函数专题'] },
    { day: 3, label: '第3天', tasks: ['几何证明复盘'] },
    { day: 4, label: '第4天', tasks: ['分式方程练习'] },
    { day: 5, label: '第5天', tasks: ['综合小测'] },
    { day: 6, label: '第6天', tasks: ['重点错题回看'] },
    { day: 7, label: '第7天', tasks: ['考前模拟复习'] }
  ]

  const handleBack = () => {
    navigate('/home')
  }

  const handleViewInfo = () => {
    setShowInfoModal(true)
  }

  const handleStartTodayPlan = () => {
    navigate('/today-review')
  }

  const handleTaskAction = (path: string) => {
    navigate(path)
  }

  // 考试目标编辑相关函数
  const handleOpenGoalModal = () => {
    setTempExamName(examName)
    setTempExamDate(examDate)
    setTempDailyDuration(dailyDuration)
    setShowGoalModal(true)
  }

  const handleCancelGoalEdit = () => {
    setShowGoalModal(false)
  }

  const handleSaveGoal = () => {
    if (!tempExamName.trim()) {
      setToastMessage('考试名称不能为空')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
      return
    }
    setExamName(tempExamName)
    setExamDate(tempExamDate)
    setDailyDuration(tempDailyDuration)
    setShowGoalModal(false)
    setToastMessage('考试目标已更新')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  // 当前重点编辑相关函数
  const handleOpenFocusModal = () => {
    setTempSelectedFocusPoints([...selectedFocusPoints])
    setTempCustomFocusPoints([...customFocusPoints])
    setShowAddFocusInput(false)
    setNewFocusInput('')
    setShowFocusModal(true)
  }

  const handleCancelFocusEdit = () => {
    setShowFocusModal(false)
    setShowAddFocusInput(false)
    setNewFocusInput('')
  }

  const handleToggleFocusPoint = (point: string) => {
    if (tempSelectedFocusPoints.includes(point)) {
      if (tempSelectedFocusPoints.length > 1) {
        setTempSelectedFocusPoints(tempSelectedFocusPoints.filter(p => p !== point))
      } else {
        setToastMessage('至少保留一个重点')
        setShowToast(true)
        setTimeout(() => setShowToast(false), 2000)
      }
    } else {
      setTempSelectedFocusPoints([...tempSelectedFocusPoints, point])
    }
  }

  const handleAddCustomFocusPoint = () => {
    setShowAddFocusInput(true)
  }

  const handleCancelAddFocus = () => {
    setShowAddFocusInput(false)
    setNewFocusInput('')
  }

  const handleConfirmAddFocus = () => {
    if (!newFocusInput.trim()) {
      setToastMessage('请输入重点知识点')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
      return
    }
    const allPoints = [...PRESET_FOCUS_POINTS, ...tempCustomFocusPoints]
    if (allPoints.includes(newFocusInput.trim())) {
      setToastMessage('该重点已存在')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
      return
    }
    setTempCustomFocusPoints([...tempCustomFocusPoints, newFocusInput.trim()])
    setTempSelectedFocusPoints([...tempSelectedFocusPoints, newFocusInput.trim()])
    setShowAddFocusInput(false)
    setNewFocusInput('')
    setToastMessage('自定义重点已添加')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const handleDeleteCustomFocusPoint = (point: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newCustomPoints = tempCustomFocusPoints.filter(p => p !== point)
    setTempCustomFocusPoints(newCustomPoints)
    
    if (tempSelectedFocusPoints.includes(point)) {
      const newSelectedPoints = tempSelectedFocusPoints.filter(p => p !== point)
      if (newSelectedPoints.length === 0) {
        setTempSelectedFocusPoints(['一元一次方程'])
      } else {
        setTempSelectedFocusPoints(newSelectedPoints)
      }
    }
    setToastMessage('自定义重点已删除')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const handleSaveFocusPoints = () => {
    if (tempSelectedFocusPoints.length === 0) {
      setToastMessage('至少保留一个重点')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
      return
    }
    setSelectedFocusPoints([...tempSelectedFocusPoints])
    setCustomFocusPoints([...tempCustomFocusPoints])
    setShowFocusModal(false)
    setToastMessage('当前重点已更新')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case '错题复习':
        return BookOpen
      case '专题练习':
        return TrendingUp
      case '错因复盘':
        return PenTool
      default:
        return BookOpen
    }
  }

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'pending':
        return <StatusTag type="default">待完成</StatusTag>
      case 'inProgress':
        return <StatusTag type="warning">进行中</StatusTag>
      case 'completed':
        return <StatusTag type="success">已完成</StatusTag>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F8FB] flex flex-col">
      <Header
        title="AI学习计划"
        showBack
        rightAction={
          <button
            type="button"
            onClick={handleViewInfo}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Info className="w-5 h-5 text-gray-600" />
          </button>
        }
      />

      <div className="flex-1 px-4 py-4 overflow-y-auto">
        <AppCard className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary-600" />
              <span className="text-gray-900 font-semibold">考试目标</span>
            </div>
            <button
              type="button"
              onClick={handleOpenGoalModal}
              className="flex items-center gap-1 text-gray-400 hover:text-gray-600 active:text-gray-700 active:scale-95 transition-all cursor-pointer"
            >
              <Pencil className="w-4 h-4" />
              <span className="text-xs">编辑目标</span>
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">近期目标</span>
              <span className="text-gray-900 font-medium">{examGoal.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">剩余时间</span>
              <span className="text-orange-500 font-medium">{examGoal.daysLeft} 天</span>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl mt-2">
              <p className="text-blue-700 text-sm">
                <span className="font-medium">推荐策略：</span>{examGoal.strategy}
              </p>
            </div>
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-600 text-xs">当前重点：</span>
                <button
                  type="button"
                  onClick={handleOpenFocusModal}
                  className="text-primary-600 text-xs hover:text-primary-700 transition-colors"
                >
                  编辑重点
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {examGoal.focusPoints.map((point, index) => (
                  <StatusTag key={index} type="ai">{point}</StatusTag>
                ))}
              </div>
            </div>
          </div>
        </AppCard>

        <AppCard className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary-600" />
              <span className="text-gray-900 font-semibold">学习计划概览</span>
            </div>
            <span className="text-primary-600 font-bold text-xl">{planStats.completionRate}%</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-1">计划周期</p>
              <p className="text-gray-800 font-bold text-lg">{planStats.cycle} 天</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-1">今日任务</p>
              <p className="text-gray-800 font-bold text-lg">{planStats.todayTasks} 项</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-1">已完成</p>
              <p className="text-green-600 font-bold text-lg">{planStats.completed} 项</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-1">预计用时</p>
              <p className="text-gray-800 font-bold text-lg">{planStats.duration} 分钟</p>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all" 
              style={{ width: `${planStats.completionRate}%` }}
            ></div>
          </div>
        </AppCard>

        <AppCard className="mb-4 bg-purple-50 border-purple-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <Target className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-gray-900 font-semibold">计划生成依据</span>
          </div>
          <p className="text-gray-600 text-sm mb-3">
            AI会根据你的错题记录、掌握状态、练习表现和考试时间，动态生成学习计划。
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
              <span>错题数量</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
              <span>重复错误频率</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
              <span>最近复习结果</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
              <span>举一反三正确率</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
              <span>距离考试时间</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
              <span>用户学习目标</span>
            </div>
          </div>
        </AppCard>

        <AppCard className="mb-4">
          <h3 className="text-gray-900 font-semibold flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-primary-600" />
            今日计划任务
          </h3>
          <div className="space-y-3">
            {todayTasks.map(task => {
              const TypeIcon = getTypeIcon(task.type)
              return (
                <div 
                  key={task.id} 
                  className="p-3 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        task.status === 'completed' ? 'bg-green-100' : 
                        task.status === 'inProgress' ? 'bg-orange-100' : 'bg-blue-100'
                      }`}>
                        <TypeIcon className={`w-4 h-4 ${
                          task.status === 'completed' ? 'text-green-600' : 
                          task.status === 'inProgress' ? 'text-orange-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div>
                        <p className="text-gray-900 font-medium">{task.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <StatusTag type="default">{task.type}</StatusTag>
                          <span className="text-gray-400 text-xs">{task.duration} 分钟</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusTag(task.status)}
                      {task.status !== 'completed' && (
                        <button
                          type="button"
                          onClick={() => handleTaskAction(task.actionPath)}
                          className="px-3 py-1 bg-primary-500 text-white text-xs rounded-full hover:bg-primary-600 transition-colors"
                        >
                          {task.actionText}
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs ml-10">复习原因：{task.reason}</p>
                </div>
              )
            })}
          </div>
        </AppCard>

        <AppCard className="mb-4">
          <h3 className="text-gray-900 font-semibold mb-3">当前薄弱知识点</h3>
          <div className="space-y-2">
            {weakKnowledge.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <StatusTag type="error">{item.name}</StatusTag>
                <span className="text-gray-500 text-sm">{item.status}</span>
              </div>
            ))}
          </div>
        </AppCard>

        <AppCard className="mb-4">
          <h3 className="text-gray-900 font-semibold flex items-center gap-2 mb-4">
            <CalendarDays className="w-4 h-4 text-primary-600" />
            接下来 7 天安排
          </h3>
          <div className="space-y-3">
            {weekPlan.map(day => (
              <div key={day.day} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    day.day === 1 ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <span className="text-xs font-medium">{day.day}</span>
                  </div>
                  {day.day < 7 && <div className="w-0.5 h-full min-h-[40px] bg-gray-200 mt-1"></div>}
                </div>
                <div className="flex-1 pb-3">
                  <p className={`text-sm font-medium mb-1 ${day.day === 1 ? 'text-primary-600' : 'text-gray-700'}`}>
                    {day.label}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {day.tasks.map((task, index) => (
                      <span key={index} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                        {task}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AppCard>
      </div>

      <div className="px-4 py-4 pb-[max(env(safe-area-inset-bottom),20px)] bg-white border-t border-gray-100">
        <div className="flex gap-3">
          <div className="flex-1">
            <SecondaryButton className="w-full" onClick={handleBack}>
              返回首页
            </SecondaryButton>
          </div>
          <div className="flex-1">
            <PrimaryButton className="w-full" onClick={handleStartTodayPlan}>
              开始今日计划
            </PrimaryButton>
          </div>
        </div>
      </div>

      {/* AI学习计划说明 Modal */}
      <Modal
        open={showInfoModal}
        title="AI学习计划说明"
        confirmText="我知道了"
        onCancel={() => setShowInfoModal(false)}
      >
        <p className="text-gray-600 text-sm">
          系统会结合你的错题记录、薄弱知识点、掌握状态和近期考试目标，为你生成阶段性复习计划。
        </p>
      </Modal>

      {/* 编辑考试目标 Modal */}
      <Modal
        open={showGoalModal}
        title="编辑考试目标"
        onConfirm={handleSaveGoal}
        onCancel={handleCancelGoalEdit}
        confirmText="保存"
        cancelText="取消"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">考试名称</label>
            <input
              type="text"
              value={tempExamName}
              onChange={(e) => setTempExamName(e.target.value)}
              placeholder="请输入考试名称"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              maxLength={50}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">考试日期</label>
            <input
              type="text"
              value={tempExamDate}
              onChange={(e) => setTempExamDate(e.target.value)}
              placeholder="请输入考试日期"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              maxLength={20}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">每日可学习时长</label>
            <div className="flex gap-2">
              {(['30', '45', '60'] as const).map((duration) => (
                <button
                  key={duration}
                  type="button"
                  onClick={() => setTempDailyDuration(duration)}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                    tempDailyDuration === duration
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {duration}分钟
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* 编辑当前重点 Modal */}
      <Modal
        open={showFocusModal}
        title="编辑当前重点"
        onConfirm={handleSaveFocusPoints}
        onCancel={handleCancelFocusEdit}
        confirmText="保存修改"
        cancelText="取消"
      >
        <div className="space-y-4">
          <div>
            <p className="text-gray-700 text-sm font-medium mb-2">预设重点</p>
            <div className="flex flex-wrap gap-2">
              {PRESET_FOCUS_POINTS.map((point) => (
                <button
                  key={point}
                  type="button"
                  onClick={() => handleToggleFocusPoint(point)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    tempSelectedFocusPoints.includes(point)
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {point}
                </button>
              ))}
            </div>
          </div>
          
          {tempCustomFocusPoints.length > 0 && (
            <div>
              <p className="text-gray-700 text-sm font-medium mb-2">自定义重点</p>
              <div className="flex flex-wrap gap-2">
                {tempCustomFocusPoints.map((point) => (
                  <div
                    key={point}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm ${
                      tempSelectedFocusPoints.includes(point)
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleFocusPoint(point)}
                      className="cursor-pointer"
                    >
                      {point}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteCustomFocusPoint(point, e)}
                      className="ml-1 hover:opacity-70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!showAddFocusInput ? (
            <button
              type="button"
              onClick={handleAddCustomFocusPoint}
              className="w-full py-2 border border-dashed border-gray-300 rounded-xl text-gray-500 text-sm hover:border-primary-500 hover:text-primary-600 transition-colors"
            >
              + 自定义重点
            </button>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                value={newFocusInput}
                onChange={(e) => setNewFocusInput(e.target.value)}
                placeholder="请输入重点知识点"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                maxLength={20}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCancelAddFocus}
                  className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAddFocus}
                  className="flex-1 py-2 bg-primary-500 text-white rounded-xl text-sm hover:bg-primary-600 transition-colors"
                >
                  添加
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      <Toast message={toastMessage} visible={showToast} />
    </div>
  )
}
