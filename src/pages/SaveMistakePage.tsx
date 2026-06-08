import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tags, AlertCircle, Target, CalendarDays, Pencil, X, BookOpen, ChevronLeft } from 'lucide-react'
import AppCard from '../components/ui/AppCard'
import StatusTag from '../components/ui/StatusTag'
import PrimaryButton from '../components/ui/PrimaryButton'
import SecondaryButton from '../components/ui/SecondaryButton'
import Modal from '../components/ui/Modal'
import Toast from '../components/ui/Toast'

/**
 * 归集错题页面
 * 
 * 页面职责：
 * - 确认错题归属信息（单元/课时/来源），使错题能进入正确的章节结构
 * - 确认知识点和错误类型，用于更细粒度的归因分析
 * 
 * 数据结构：
 * - 单元/课时：用于错题本归档，决定错题放在哪个章节
 * - 知识点：用于更细粒度归因，描述这道题考什么
 * - 错误类型：描述为什么错
 */
export default function SaveMistakePage() {
  const navigate = useNavigate()
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [showDiscardModal, setShowDiscardModal] = useState(false)
  const [showKnowledgeModal, setShowKnowledgeModal] = useState(false)
  const [showCustomErrorModal, setShowCustomErrorModal] = useState(false)
  const [customErrorInput, setCustomErrorInput] = useState('')

  // 错误类型相关状态
  const defaultErrorTypes = ['计算错误', '概念理解错误', '审题错误', '步骤遗漏']
  const [errorType, setErrorType] = useState('计算错误')
  const [errorTypes, setErrorTypes] = useState(['计算错误', '概念理解错误', '审题错误', '步骤遗漏'])
  const [difficulty, setDifficulty] = useState('中等')
  const [masteryStatus, setMasteryStatus] = useState('需复习')
  
  // 归属信息相关状态
  const [selectedChapter, setSelectedChapter] = useState('第一单元 一元一次方程')
  const [selectedLesson, setSelectedLesson] = useState('第2课 移项与合并同类项')
  const [source, setSource] = useState('同步练习册')
  const [customSource, setCustomSource] = useState('')
  
  // 题目来源选项
  const sourceOptions = ['同步练习册', '期中模拟卷', '课本习题', '老师讲义', '自定义']
  
  // 单元与课时关联数据
  const chapterLessons: Record<string, string[]> = {
    '第一单元 一元一次方程': ['第1课 等式性质', '第2课 移项与合并同类项', '第3课 方程应用'],
    '第二单元 二次函数': ['第1课 函数图像', '第2课 顶点坐标', '第3课 图像平移'],
    '第三单元 几何证明': ['第1课 全等三角形', '第2课 辅助线构造', '第3课 证明步骤表达']
  }
  const chapters = Object.keys(chapterLessons)

  // 知识点相关状态
  const [selectedKnowledgePoints, setSelectedKnowledgePoints] = useState<string[]>([
    '一元一次方程',
    '移项',
    '方程计算'
  ])
  const difficulties = ['简单', '中等', '困难']
  const masteryStatuses = ['未掌握', '需复习', '已掌握']
  
  const defaultKnowledgePoints = [
    '一元一次方程',
    '移项',
    '方程计算',
    '等式性质',
    '解方程',
    '代数运算',
    '计算规范',
    '应用题建模'
  ]
  const [customKnowledgePoints, setCustomKnowledgePoints] = useState<string[]>([])
  const [showCustomKnowledgeInput, setShowCustomKnowledgeInput] = useState(false)
  const [customKnowledgeInput, setCustomKnowledgeInput] = useState('')

  const allKnowledgePoints = [...defaultKnowledgePoints, ...customKnowledgePoints]

  // 单元切换时更新课时选项
  const handleChapterChange = (chapter: string) => {
    setSelectedChapter(chapter)
    // 切换单元时重置课时为第一个
    setSelectedLesson(chapterLessons[chapter][0])
  }

  // 跳过保存
  const handleSkip = () => {
    setToastMessage(`已使用 AI 推荐信息保存`)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      navigate('/save-success')
    }, 1500)
  }

  // 知识点编辑
  const handleEditKnowledge = () => {
    setShowKnowledgeModal(true)
  }

  // 自定义错误类型
  const handleOpenCustomErrorModal = () => {
    setShowCustomErrorModal(true)
    setCustomErrorInput('')
  }

  const handleSaveCustomError = () => {
    const input = customErrorInput.trim()
    if (!input) {
      setToastMessage('请输入错误类型')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
      return
    }
    if (errorTypes.includes(input)) {
      setToastMessage('该错误类型已存在')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
      return
    }
    setErrorTypes([...errorTypes, input])
    setErrorType(input)
    setShowCustomErrorModal(false)
    setCustomErrorInput('')
    setToastMessage('自定义错误类型已添加')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const handleDeleteCustomError = (type: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newErrorTypes = errorTypes.filter(t => t !== type)
    setErrorTypes(newErrorTypes)
    if (errorType === type) {
      setErrorType('计算错误')
      setToastMessage('自定义错误类型已删除，已切换为计算错误')
    } else {
      setToastMessage('自定义错误类型已删除')
    }
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  // 知识点切换
  const handleKnowledgeToggle = (point: string) => {
    setSelectedKnowledgePoints(prev => {
      const isSelected = prev.includes(point)
      if (isSelected) {
        if (prev.length === 1) {
          setToastMessage('至少保留一个知识点')
          setShowToast(true)
          setTimeout(() => setShowToast(false), 2000)
          return prev
        }
        return prev.filter(p => p !== point)
      }
      return [...prev, point]
    })
  }

  const handleAddCustomKnowledge = () => {
    const input = customKnowledgeInput.trim()
    if (!input) {
      setToastMessage('请输入知识点')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
      return
    }
    if (allKnowledgePoints.includes(input)) {
      setToastMessage('该知识点已存在')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
      return
    }
    setCustomKnowledgePoints([...customKnowledgePoints, input])
    setSelectedKnowledgePoints([...selectedKnowledgePoints, input])
    setCustomKnowledgeInput('')
    setShowCustomKnowledgeInput(false)
    setToastMessage('自定义知识点已添加')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const handleCancelAddKnowledge = () => {
    setShowCustomKnowledgeInput(false)
    setCustomKnowledgeInput('')
  }

  const handleDeleteCustomKnowledge = (point: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setCustomKnowledgePoints(customKnowledgePoints.filter(p => p !== point))
    setSelectedKnowledgePoints(selectedKnowledgePoints.filter(p => p !== point))
    if (selectedKnowledgePoints.length === 1) {
      setSelectedKnowledgePoints(['一元一次方程'])
    }
    setToastMessage('自定义知识点已删除')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const handleSaveKnowledge = () => {
    setShowKnowledgeModal(false)
    setShowCustomKnowledgeInput(false)
    setCustomKnowledgeInput('')
    setToastMessage('知识点已更新')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  // 放弃保存
  const handleDiscard = () => {
    setShowDiscardModal(true)
  }

  const handleConfirmDiscard = () => {
    setShowDiscardModal(false)
    navigate('/home')
  }

  const handleContinueEditing = () => {
    setShowDiscardModal(false)
  }

  // 确认保存
  const handleSave = () => {
    setToastMessage(`已保存到：${selectedChapter} · ${selectedLesson}`)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      navigate('/save-success')
    }, 1500)
  }

  // 返回处理
  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className="min-h-screen bg-[#F6F8FB] flex flex-col">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <button
          type="button"
          onClick={handleBack}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-gray-900 font-medium text-lg">归集错题</h1>
        <button
          type="button"
          onClick={handleSkip}
          className="px-3 py-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
        >
          跳过
        </button>
      </div>

      <div className="flex-1 px-4 py-4 overflow-y-auto">
        {/* 引导提示 */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-4">
          <p className="text-blue-700 text-sm">确认章节、知识点和错因，让错题进入正确的位置</p>
        </div>

        {/* 模块1：错题摘要 */}
        <AppCard className="mb-4">
          <h3 className="text-gray-900 font-semibold mb-3">错题摘要</h3>
          <div className="space-y-2">
            <div>
              <p className="text-gray-500 text-xs mb-1">题目摘要</p>
              <p className="text-gray-800">解方程：3x - 5 = 10</p>
            </div>
            <div className="flex gap-4">
              <div>
                <p className="text-gray-500 text-xs mb-1">我的答案</p>
                <p className="text-red-600 font-mono">x = 3</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">正确答案</p>
                <p className="text-green-600 font-mono font-semibold">x = 5</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">AI判定</p>
                <StatusTag type="error">错误</StatusTag>
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">错误原因简述</p>
              <p className="text-gray-800 text-sm">移项时遗漏负号</p>
            </div>
          </div>
        </AppCard>

        {/* 模块2：归属信息 */}
        <AppCard className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-primary-600" />
            <h3 className="text-gray-900 font-semibold">归属信息</h3>
          </div>
          <p className="text-gray-500 text-xs mb-4">AI 已根据题目内容推荐归属位置，你可以手动调整。</p>
          
          {/* 教材信息 */}
          <div className="mb-4 p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">教材信息</span>
              </div>
              <span className="text-gray-800 font-medium">八年级上册 · 人教版</span>
            </div>
            <p className="text-gray-400 text-xs mt-2">如需修改教材，可前往"我的"页面或错题本顶部切换。</p>
          </div>

          {/* 所属单元 */}
          <div className="mb-4">
            <p className="text-gray-500 text-xs mb-2">所属单元</p>
            <div className="flex flex-wrap gap-2">
              {chapters.map(chapter => (
                <button
                  key={chapter}
                  type="button"
                  onClick={() => handleChapterChange(chapter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedChapter === chapter
                      ? 'bg-primary-100 text-primary-700 border border-primary-200'
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {chapter}
                </button>
              ))}
            </div>
          </div>

          {/* 所属课时 */}
          <div className="mb-4">
            <p className="text-gray-500 text-xs mb-2">所属课时</p>
            <div className="flex flex-wrap gap-2">
              {chapterLessons[selectedChapter].map(lesson => (
                <button
                  key={lesson}
                  type="button"
                  onClick={() => setSelectedLesson(lesson)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedLesson === lesson
                      ? 'bg-primary-100 text-primary-700 border border-primary-200'
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {lesson}
                </button>
              ))}
            </div>
          </div>

          {/* 题目来源 */}
          <div>
            <p className="text-gray-500 text-xs mb-2">题目来源</p>
            <div className="flex flex-wrap gap-2">
              {sourceOptions.map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSource(option)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    source === option
                      ? 'bg-primary-100 text-primary-700 border border-primary-200'
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            {source === '自定义' && (
              <input
                type="text"
                placeholder="请输入题目来源"
                value={customSource}
                onChange={(e) => setCustomSource(e.target.value)}
                className="mt-2 w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            )}
          </div>
        </AppCard>

        {/* 模块3：知识点确认 */}
        <AppCard className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-gray-900 font-semibold flex items-center gap-2">
                <Tags className="w-4 h-4 text-primary-600" />
                知识点确认
              </h3>
            </div>
            <button 
              type="button"
              onClick={handleEditKnowledge}
              className="flex items-center gap-1 text-gray-400 hover:text-gray-600 active:text-gray-700 active:scale-95 transition-all cursor-pointer"
            >
              <Pencil className="w-4 h-4" />
              <span className="text-xs">编辑</span>
            </button>
          </div>
          <p className="text-gray-400 text-xs mb-3">
            知识点用于更细粒度归因，单元/课时用于错题本归档。
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedKnowledgePoints.map(point => (
              <StatusTag key={point} type="ai">{point}</StatusTag>
            ))}
          </div>
        </AppCard>

        {/* 模块4：错误类型 */}
        <AppCard className="mb-4">
          <h3 className="text-gray-900 font-semibold flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-red-500" />
            错误类型
          </h3>
          <div className="flex flex-wrap gap-2">
            {errorTypes.map(type => {
              const isDefault = defaultErrorTypes.includes(type)
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setErrorType(type)}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    errorType === type
                      ? 'bg-red-100 text-red-700 ring-2 ring-red-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type}
                  {!isDefault && (
                    <button
                      type="button"
                      onClick={(e) => handleDeleteCustomError(type, e)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-gray-500 text-white rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </button>
              )
            })}
          </div>
          <button
            type="button"
            onClick={handleOpenCustomErrorModal}
            className="mt-3 flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
          >
            <span className="text-xl">+</span>
            <span>自定义错误类型</span>
          </button>
        </AppCard>

        {/* 模块5：难度与掌握状态 */}
        <AppCard className="mb-4">
          <h3 className="text-gray-900 font-semibold flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-yellow-600" />
            难度与掌握状态
          </h3>
          
          <div className="mb-4">
            <p className="text-gray-500 text-xs mb-2">难度</p>
            <div className="flex flex-wrap gap-2">
              {difficulties.map(diff => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setDifficulty(diff)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    difficulty === diff
                      ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-gray-500 text-xs mb-2">掌握状态</p>
            <div className="flex flex-wrap gap-2">
              {masteryStatuses.map(status => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setMasteryStatus(status)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    masteryStatus === status
                      ? 'bg-green-100 text-green-700 ring-2 ring-green-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </AppCard>

        {/* 模块6：复习安排 */}
        <AppCard className="mb-4">
          <h3 className="text-gray-900 font-semibold flex items-center gap-2 mb-3">
            <CalendarDays className="w-4 h-4 text-blue-600" />
            复习安排
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">首次复习</span>
              <span className="text-gray-800">明天</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">第二次复习</span>
              <span className="text-gray-800">3天后</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">第三次复习</span>
              <span className="text-gray-800">7天后</span>
            </div>
          </div>
          <p className="text-gray-400 text-xs mt-3">系统会根据你的掌握情况自动调整复习时间。</p>
        </AppCard>
      </div>

      {/* 底部按钮 */}
      <div className="px-4 py-4 pb-[max(env(safe-area-inset-bottom),20px)] bg-white border-t border-gray-100">
        <div className="flex gap-3">
          <div className="flex-1">
            <SecondaryButton className="w-full" onClick={handleDiscard}>
              暂不保存
            </SecondaryButton>
          </div>
          <div className="flex-1">
            <PrimaryButton className="w-full" onClick={handleSave}>
              确认保存
            </PrimaryButton>
          </div>
        </div>
      </div>

      {/* Modal：放弃保存 */}
      <Modal
        open={showDiscardModal}
        title="确定不保存这道错题吗？"
        onCancel={handleContinueEditing}
        onConfirm={handleConfirmDiscard}
        confirmText="继续编辑"
        cancelText="暂不保存"
      >
        <p className="text-gray-600 text-sm">不保存后，本次 AI 识别和归因结果将不会加入错题本。你也可以继续编辑后再保存。</p>
      </Modal>

      {/* Modal：编辑知识点 */}
      <Modal
        open={showKnowledgeModal}
        title="编辑知识点"
        onConfirm={handleSaveKnowledge}
        confirmText="保存修改"
        cancelText="取消"
      >
        <div>
          <p className="text-gray-500 text-xs mb-2">点击选择或取消知识点（至少选择一个）</p>
          <div className="flex flex-wrap gap-2">
            {allKnowledgePoints.map(point => {
              const isDefault = defaultKnowledgePoints.includes(point)
              return (
                <button
                  key={point}
                  type="button"
                  onClick={() => handleKnowledgeToggle(point)}
                  className={`relative px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedKnowledgePoints.includes(point)
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  {point}
                  {!isDefault && (
                    <button
                      type="button"
                      onClick={(e) => handleDeleteCustomKnowledge(point, e)}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-gray-400 text-white rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  )}
                </button>
              )
            })}
          </div>
          
          {/* 自定义知识点入口 */}
          {!showCustomKnowledgeInput ? (
            <button
              type="button"
              onClick={() => setShowCustomKnowledgeInput(true)}
              className="mt-3 flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors w-full"
            >
              <span className="text-xl">+</span>
              <span>自定义知识点</span>
            </button>
          ) : (
            <div className="mt-3 p-3 bg-gray-50 rounded-xl">
              <input
                type="text"
                value={customKnowledgeInput}
                onChange={(e) => setCustomKnowledgeInput(e.target.value)}
                placeholder="请输入知识点，例如：等式基本性质"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                maxLength={20}
                autoFocus
              />
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={handleCancelAddKnowledge}
                  className="flex-1 h-8 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleAddCustomKnowledge}
                  className="flex-1 h-8 bg-primary-500 text-white rounded-lg text-xs font-medium hover:bg-primary-600 transition-colors"
                >
                  添加
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Modal：自定义错误类型 */}
      <Modal
        open={showCustomErrorModal}
        title="自定义错误类型"
        onConfirm={handleSaveCustomError}
        confirmText="保存"
        cancelText="取消"
      >
        <input
          type="text"
          value={customErrorInput}
          onChange={(e) => setCustomErrorInput(e.target.value)}
          placeholder="请输入错误类型，例如：符号处理错误"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          maxLength={20}
        />
      </Modal>

      <Toast message={toastMessage} visible={showToast} />
    </div>
  )
}
