import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Info, Target, CalendarDays, TrendingUp, BookOpen, Pencil, X, ChevronRight } from 'lucide-react'
import Header from '../components/layout/Header'
import AppCard from '../components/ui/AppCard'
import StatusTag from '../components/ui/StatusTag'
import PrimaryButton from '../components/ui/PrimaryButton'
import SecondaryButton from '../components/ui/SecondaryButton'
import Modal from '../components/ui/Modal'
import Toast from '../components/ui/Toast'

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
  
  const [showGoalModal, setShowGoalModal] = useState(false)
  const [examName, setExamName] = useState('期中考')
  const [examDate, setExamDate] = useState('2026-06-18')
  const [dailyDuration, setDailyDuration] = useState<'30' | '45' | '60'>('30')
  const [tempExamName, setTempExamName] = useState('')
  const [tempExamDate, setTempExamDate] = useState('')
  const [tempDailyDuration, setTempDailyDuration] = useState<'30' | '45' | '60'>('30')
  
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
    duration: dailyDuration,
    focusPoints: selectedFocusPoints
  }

  const priorityTopics = [
    {
      id: 1,
      priority: '第一优先级',
      name: '一元一次方程',
      reason: '错题数最多，移项符号错误重复出现',
      stats: { mistakes: 12, pending: 4, mastery: 70 },
      actionPath: '/practice/1?from=study-plan&type=priority'
    },
    {
      id: 2,
      priority: '第二优先级',
      name: '二次函数',
      reason: '顶点坐标判断正确率偏低',
      stats: { mistakes: 9, pending: 3, mastery: 62 },
      actionPath: '/practice/1?from=study-plan&type=priority'
    },
    {
      id: 3,
      priority: '第三优先级',
      name: '几何证明',
      reason: '证明步骤遗漏较多',
      stats: { mistakes: 7, pending: 5, mastery: 55 },
      actionPath: '/practice/1?from=study-plan&type=priority'
    }
  ]

  const stages = [
    {
      id: 1,
      name: '整理与补缺',
      period: '第1-3天',
      goal: '确认待完善错题，补齐章节归属和错因',
      focus: '一元一次方程、二次函数',
      actionPath: '/mistakes'
    },
    {
      id: 2,
      name: '专项巩固',
      period: '第4-10天',
      goal: '针对高频错因进行练习',
      focus: '移项符号错误、顶点坐标判断、证明步骤遗漏',
      actionPath: '/knowledge-practice'
    },
    {
      id: 3,
      name: '考前模拟',
      period: '第11-14天',
      goal: '通过专题组卷进行综合检测',
      focus: '期中模拟卷、薄弱单元混合练习',
      actionPath: '/exam-practice'
    }
  ]

  const planBasis = [
    '错题数量',
    '待复习状态',
    '单元掌握度',
    '高频错因',
    '最近练习正确率',
    '距离考试时间',
    '每日可用学习时间'
  ]

  const handleBack = () => {
    navigate('/home')
  }

  const handleViewInfo = () => {
    setShowInfoModal(true)
  }

  const handleTaskAction = (path: string) => {
    navigate(path)
  }

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
    setToastMessage('复习重点已更新')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
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
        <div className="text-center mb-4">
          <p className="text-gray-500 text-sm">根据考试目标和数学错题分布，生成阶段性复习规划</p>
        </div>

        <AppCard className="mb-4">
          <div className="flex items-center justify-between mb-4">
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
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-gray-500 text-xs mb-1">目标考试</p>
              <p className="text-gray-900 font-bold">{examGoal.name}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">考试时间</p>
              <p className="text-orange-500 font-bold">{examGoal.daysLeft}天后</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">每日可用时间</p>
              <p className="text-primary-600 font-bold">{examGoal.duration}分钟</p>
            </div>
          </div>
        </AppCard>

        <AppCard className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-600" />
              <span className="text-gray-900 font-semibold">复习优先级</span>
            </div>
            <button
              type="button"
              onClick={handleOpenFocusModal}
              className="text-primary-600 text-xs hover:text-primary-700 transition-colors"
            >
              调整复习重点
            </button>
          </div>
          <p className="text-gray-500 text-xs mb-3">AI 根据错题数量、待复习状态和最近练习表现排序</p>
          <div className="space-y-3">
            {priorityTopics.map(topic => (
              <div key={topic.id} className="p-3 bg-gray-50 rounded-xl">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <StatusTag type={topic.id === 1 ? 'error' : topic.id === 2 ? 'warning' : 'default'}>
                        {topic.priority}
                      </StatusTag>
                      <span className="text-gray-900 font-medium">{topic.name}</span>
                    </div>
                    <p className="text-gray-600 text-xs mb-2">{topic.reason}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-0.5 bg-white text-xs text-gray-600 rounded-full">
                        {topic.stats.mistakes}道错题
                      </span>
                      <span className="px-2 py-0.5 bg-white text-xs text-gray-600 rounded-full">
                        待复习{topic.stats.pending}道
                      </span>
                      <span className="px-2 py-0.5 bg-white text-xs text-gray-600 rounded-full">
                        掌握度{topic.stats.mastery}%
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTaskAction(topic.actionPath)}
                    className="px-3 py-1.5 bg-primary-500 text-white text-xs rounded-full hover:bg-primary-600 transition-colors flex items-center gap-1"
                  >
                    去练习
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </AppCard>

        <AppCard className="mb-4">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="w-5 h-5 text-primary-600" />
            <span className="text-gray-900 font-semibold">阶段复习安排</span>
          </div>
          <div className="space-y-4">
            {stages.map(stage => (
              <div key={stage.id} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    stage.id === 1 ? 'bg-primary-500 text-white' : 
                    stage.id === 2 ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'
                  }`}>
                    {stage.id}
                  </div>
                  {stage.id < 3 && <div className="w-0.5 h-full min-h-[60px] bg-gray-200 mt-2"></div>}
                </div>
                <div className="flex-1 pb-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-gray-900 font-medium">{stage.name}</h4>
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full">
                        {stage.period}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTaskAction(stage.actionPath)}
                      className="px-3 py-1 bg-primary-50 text-primary-600 text-xs rounded-full hover:bg-primary-100 transition-colors"
                    >
                      开始
                    </button>
                  </div>
                  <p className="text-gray-600 text-xs mb-1">目标：{stage.goal}</p>
                  <p className="text-gray-500 text-xs">重点：{stage.focus}</p>
                </div>
              </div>
            ))}
          </div>
        </AppCard>

        <AppCard className="mb-4 bg-blue-50 border-blue-100">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span className="text-gray-900 font-semibold">计划生成依据</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {planBasis.map((basis, index) => (
              <div key={index} className="flex items-center gap-2 text-gray-700 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                <span>{basis}</span>
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
            <PrimaryButton className="w-full" onClick={() => navigate('/practice')}>
              去练习中心
            </PrimaryButton>
          </div>
        </div>
      </div>

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

      <Modal
        open={showFocusModal}
        title="调整复习重点"
        onConfirm={handleSaveFocusPoints}
        onCancel={handleCancelFocusEdit}
        confirmText="保存修改"
        cancelText="取消"
      >
        <div className="space-y-4">
          <p className="text-gray-500 text-xs">AI 会根据你选择的重点调整复习优先级。</p>
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