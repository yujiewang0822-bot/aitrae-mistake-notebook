import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, CalendarDays, Target, TrendingUp, ChevronRight, ArrowLeft } from 'lucide-react'
import AppCard from '../components/ui/AppCard'
import Toast from '../components/ui/Toast'

export default function MessagePage() {
  const navigate = useNavigate()
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'review',
      title: '今天有 5 道错题需要复习',
      content: '其中 2 道是一元一次方程相关错题，建议优先完成。',
      time: '今天 09:00',
      read: false,
      link: '/today-review'
    },
    {
      id: '2',
      type: 'plan',
      title: 'AI 已生成本周学习计划',
      content: '根据你的期中考试目标，建议先复习薄弱知识点。',
      time: '昨天 20:30',
      read: false,
      link: '/study-plan'
    },
    {
      id: '3',
      type: 'practice',
      title: '举一反三练习完成',
      content: '本次练习正确率 80%，符号变化仍需注意。',
      time: '昨天 18:10',
      read: false,
      link: '/practice-result'
    },
    {
      id: '4',
      type: 'system',
      title: '错题已成功保存',
      content: '系统已为你安排明天首次复习。',
      time: '昨天 17:45',
      read: true,
      link: '/mistake/1'
    },
    {
      id: '5',
      type: 'review',
      title: '一道错题进入重点关注',
      content: '二次函数顶点坐标判断上次复习未掌握。',
      time: '前天 16:20',
      read: true,
      link: '/mistake/1'
    }
  ])

  const tabs = [
    { key: 'all', label: '全部' },
    { key: 'review', label: '复习提醒' },
    { key: 'plan', label: '学习计划' },
    { key: 'practice', label: '练习反馈' },
    { key: 'system', label: '系统通知' }
  ]

  const filteredMessages = activeTab === 'all'
    ? messages
    : messages.filter(m => m.type === activeTab)

  const unreadCount = messages.filter(m => !m.read).length
  const todayCount = messages.filter(m => m.time.includes('今天')).length
  const practiceCount = messages.filter(m => m.type === 'practice').length

  const handleBack = () => {
    navigate('/home')
  }

  const handleMarkAllRead = () => {
    setMessages(messages.map(m => ({ ...m, read: true })))
    setToastMessage('已全部标记为已读')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const handleMessageClick = (link: string) => {
    navigate(link)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'review':
        return <CalendarDays className="w-4 h-4 text-blue-500" />
      case 'plan':
        return <Target className="w-4 h-4 text-purple-500" />
      case 'practice':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'system':
        return <Bell className="w-4 h-4 text-gray-500" />
      default:
        return <Bell className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F8FB] flex flex-col">
      {/* 自定义顶部栏 */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <button
          type="button"
          onClick={handleBack}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-gray-900 font-medium text-lg">消息提醒</h1>
        <button
          type="button"
          onClick={handleMarkAllRead}
          className="px-3 py-1.5 text-primary-600 text-sm font-medium whitespace-nowrap hover:bg-primary-50 rounded-lg transition-colors"
        >
          全部已读
        </button>
      </div>

      <div className="flex-1 px-4 py-4 overflow-y-auto">
        <AppCard className="mb-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-1">未读消息</p>
              <p className="text-gray-900 font-bold text-xl">{unreadCount} 条</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-1">今日提醒</p>
              <p className="text-blue-600 font-bold text-xl">{todayCount} 条</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-1">学习反馈</p>
              <p className="text-green-600 font-bold text-xl">{practiceCount} 条</p>
            </div>
          </div>
        </AppCard>

        {/* 分类筛选 */}
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {tabs.map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 消息列表 */}
        {filteredMessages.length > 0 ? (
          <div className="space-y-3">
            {filteredMessages.map(message => (
              <div
                key={message.id}
                className={`cursor-pointer ${!message.read ? 'border-l-4 border-l-blue-500' : ''}`}
                onClick={() => handleMessageClick(message.link)}
              >
                <AppCard className="hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      {getTypeIcon(message.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {!message.read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                        )}
                        <h4 className={`text-sm font-medium truncate ${!message.read ? 'text-gray-900' : 'text-gray-600'}`}>
                          {message.title}
                        </h4>
                      </div>
                      <p className="text-gray-500 text-xs mb-1 line-clamp-2">{message.content}</p>
                      <p className="text-gray-400 text-xs">{message.time}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-2" />
                  </div>
                </AppCard>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm mb-4">暂无消息</p>
            <button
              type="button"
              onClick={() => navigate('/home')}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
            >
              返回首页
            </button>
          </div>
        )}
      </div>

      <Toast message={toastMessage} visible={showToast} />
    </div>
  )
}
