import { useState } from 'react'
import { User, BookOpen, CheckCircle, Flame, TrendingUp, ChevronRight } from 'lucide-react'
import BottomNav from '../components/layout/BottomNav'
import AppCard from '../components/ui/AppCard'
import SecondaryButton from '../components/ui/SecondaryButton'
import Modal from '../components/ui/Modal'
import Toast from '../components/ui/Toast'
import { useAuth } from '../data/mockAuth'
import { homeSummary } from '../data/mockData'

export default function ProfilePage() {
  const { userProfile } = useAuth()
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [showEditModal, setShowEditModal] = useState(false)

  const [nickname, setNickname] = useState(userProfile.nickname || '小明同学')
  const [grade, setGrade] = useState(userProfile.grade || '初二')
  const [textbookVersion, setTextbookVersion] = useState(userProfile.textbookVersion || '人教版')
  const [customTextbook, setCustomTextbook] = useState('')
  const [examGoal, setExamGoal] = useState(userProfile.examGoal || '期中考')
  const [customGoal, setCustomGoal] = useState('')

  const showToast = (message: string) => {
    setToastMessage(message)
    setToastVisible(true)
    setTimeout(() => {
      setToastVisible(false)
    }, 2000)
  }

  const handleLogout = () => {
    showToast('已退出登录')
  }

  const handleSettingClick = () => {
    showToast('功能建设中')
  }

  const handleSaveProfile = () => {
    if (textbookVersion === '自定义' && !customTextbook.trim()) {
      showToast('请输入教材版本')
      return
    }
    if (examGoal === '自定义' && !customGoal.trim()) {
      showToast('请输入当前目标')
      return
    }
    setShowEditModal(false)
    showToast('个人信息已更新')
  }

  const handleCancelEdit = () => {
    setNickname(userProfile.nickname || '小明同学')
    setGrade(userProfile.grade || '初二')
    setTextbookVersion(userProfile.textbookVersion || '人教版')
    setCustomTextbook('')
    setExamGoal(userProfile.examGoal || '期中考')
    setCustomGoal('')
    setShowEditModal(false)
  }

  const gradeOptions = ['初一', '初二', '初三', '高一', '高二', '高三']
  const textbookOptions = ['人教版', '北师大版', '苏科版', '浙教版', '沪教版', '湘教版', '自定义']
  const goalOptions = ['单元测验', '月考', '期中考', '期末考', '中考', '自定义']

  const currentTextbook = textbookVersion === '自定义' ? customTextbook : textbookVersion
  const currentGoal = examGoal === '自定义' ? customGoal : examGoal

  return (
    <div className="pb-24">
      <div className="px-4 pt-4">
        {/* 个人资料卡片 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
          <div className="flex items-center gap-4">
            {/* 头像 */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
              <User className="w-8 h-8 text-white" />
            </div>

            {/* 中间信息区 */}
            <div className="flex-1 min-w-0">
              {/* 用户名 - 横向显示 */}
              <h2 className="text-xl font-bold text-gray-900 whitespace-nowrap overflow-hidden text-overflow-ellipsis">
                {nickname}
              </h2>
              {/* 副标题 - 横向显示 */}
              <p className="text-sm text-gray-500 mt-1 whitespace-nowrap">
                {grade} · {currentTextbook} · {currentGoal}
              </p>
              {/* 标签行 - 横向排列 */}
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs whitespace-nowrap">{grade}</span>
                <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs whitespace-nowrap">{currentTextbook}</span>
                <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs whitespace-nowrap">{currentGoal}</span>
              </div>
            </div>

            {/* 右侧按钮 */}
            <button
              type="button"
              onClick={() => setShowEditModal(true)}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 flex-shrink-0 whitespace-nowrap"
            >
              编辑资料
            </button>
          </div>
        </div>

        <AppCard className="p-4 mb-4">
          <h3 className="font-semibold text-gray-900 mb-4">学习数据</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">{homeSummary.totalMistakes}</div>
                <div className="text-xs text-gray-500">已收录错题</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">{homeSummary.masteredMistakes}</div>
                <div className="text-xs text-gray-500">已掌握</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">{homeSummary.continuousStudyDays}天</div>
                <div className="text-xs text-gray-500">连续学习</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">{homeSummary.weeklyAccuracy}%</div>
                <div className="text-xs text-gray-500">本周正确率</div>
              </div>
            </div>
          </div>
        </AppCard>

        <AppCard className="mb-4">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">学习设置</h3>
          </div>
          <div>
            <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50">
              <span className="text-gray-700">年级与教材</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50">
              <span className="text-gray-700">考试目标</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50">
              <span className="text-gray-700">复习提醒</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button 
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50"
              onClick={handleSettingClick}
            >
              <span className="text-gray-700">数据导出</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </AppCard>

        <AppCard className="mb-4">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">账号与支持</h3>
          </div>
          <div>
            <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50">
              <span className="text-gray-700">用户协议</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50">
              <span className="text-gray-700">隐私政策</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button 
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50"
              onClick={handleSettingClick}
            >
              <span className="text-gray-700">意见反馈</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50">
              <span className="text-gray-700">关于 AI数学错题本</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </AppCard>

        <SecondaryButton className="w-full" onClick={handleLogout}>
          退出登录
        </SecondaryButton>
      </div>

      <Modal
        open={showEditModal}
        title="编辑个人信息"
        confirmText="保存"
        onConfirm={handleSaveProfile}
        onCancel={handleCancelEdit}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">昵称</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="请输入昵称"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">年级</label>
            <div className="flex flex-wrap gap-2">
              {gradeOptions.map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGrade(g)}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">教材版本</label>
            <div className="flex flex-wrap gap-2">
              {textbookOptions.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTextbookVersion(t)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    textbookVersion === t
                      ? 'bg-primary-100 text-primary-700 border border-primary-200'
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            {textbookVersion === '自定义' && (
              <input
                type="text"
                placeholder="请输入教材版本"
                value={customTextbook}
                onChange={(e) => setCustomTextbook(e.target.value)}
                className="mt-2 w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">当前目标</label>
            <div className="flex flex-wrap gap-2">
              {goalOptions.map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setExamGoal(g)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    examGoal === g
                      ? 'bg-primary-100 text-primary-700 border border-primary-200'
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
            {examGoal === '自定义' && (
              <input
                type="text"
                placeholder="请输入当前目标"
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
                className="mt-2 w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            )}
          </div>
        </div>
      </Modal>

      <BottomNav />

      <Toast message={toastMessage} visible={toastVisible} />
    </div>
  )
}
