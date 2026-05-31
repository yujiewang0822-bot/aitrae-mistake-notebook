import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Info, TrendingUp, AlertCircle } from 'lucide-react'
import AppCard from '../components/ui/AppCard'
import StatusTag from '../components/ui/StatusTag'
import PrimaryButton from '../components/ui/PrimaryButton'
import SecondaryButton from '../components/ui/SecondaryButton'
import Modal from '../components/ui/Modal'

interface PracticeRecordItem {
  id: number
  title: string
  questionCount: number
  accuracy: number
  date: string
}

const practiceRecords: PracticeRecordItem[] = [
  {
    id: 1,
    title: '期中模拟卷 01',
    questionCount: 10,
    accuracy: 80,
    date: '昨天'
  },
  {
    id: 2,
    title: '一元一次方程专项',
    questionCount: 6,
    accuracy: 83,
    date: '昨天'
  },
  {
    id: 3,
    title: '二次函数顶点坐标',
    questionCount: 5,
    accuracy: 60,
    date: '2天前'
  },
  {
    id: 4,
    title: '几何证明步骤训练',
    questionCount: 6,
    accuracy: 67,
    date: '3天前'
  },
  {
    id: 5,
    title: '错题同类强化练习',
    questionCount: 5,
    accuracy: 80,
    date: '4天前'
  }
]

interface WeaknessItem {
  id: number
  title: string
  description: string
}

const weaknessItems: WeaknessItem[] = [
  {
    id: 1,
    title: '二次函数',
    description: '正确率偏低'
  },
  {
    id: 2,
    title: '几何证明',
    description: '步骤遗漏较多'
  },
  {
    id: 3,
    title: '分式方程',
    description: '易重复出错'
  }
]

export default function PracticeRecordsPage() {
  const navigate = useNavigate()
  const [showInfoModal, setShowInfoModal] = useState(false)

  const handleBack = () => {
    navigate('/practice')
  }

  const handleViewInfo = () => {
    setShowInfoModal(true)
  }

  const handleViewResult = () => {
    navigate('/practice-result')
  }

  const handleStartWeaknessPractice = () => {
    navigate('/practice/1?from=practice-records&type=weakness')
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
        <h1 className="text-gray-900 font-medium text-lg">练习记录</h1>
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
          <h3 className="text-gray-900 font-semibold mb-4">练习总览</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-1">累计练习</p>
              <p className="text-gray-900 font-bold text-xl">36 组</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-1">完成题目</p>
              <p className="text-gray-900 font-bold text-xl">186 题</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-1">平均正确率</p>
              <p className="text-primary-600 font-bold text-2xl">76%</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-1">连续练习</p>
              <p className="text-green-600 font-bold text-xl">5 天</p>
            </div>
          </div>
        </AppCard>

        <AppCard className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <h3 className="text-gray-900 font-semibold">正确率变化</h3>
          </div>

          <div className="space-y-3 mb-4">
            <div className="p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">本周正确率</span>
                <span className="text-lg font-bold text-green-600">78%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">上周正确率</span>
                <span className="text-lg font-bold text-gray-700">71%</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 text-green-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span className="font-medium text-lg">+7%</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 text-center">
            近期练习稳定提升，计算类错误有所减少。
          </p>
        </AppCard>

        <AppCard className="mb-6">
          <h3 className="text-gray-900 font-semibold mb-4">最近练习记录</h3>

          <div className="space-y-3">
            {practiceRecords.map(item => (
              <div key={item.id} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-gray-900 font-medium mb-1">{item.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{item.questionCount}题</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                  <StatusTag type={item.accuracy >= 70 ? 'success' : 'warning'}>
                    {item.accuracy}%
                  </StatusTag>
                </div>
                <SecondaryButton className="w-full" onClick={handleViewResult}>
                  查看结果
                </SecondaryButton>
              </div>
            ))}
          </div>
        </AppCard>

        <AppCard className="mb-4">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <h3 className="text-gray-900 font-semibold">仍需加强</h3>
          </div>

          <div className="space-y-3">
            {weaknessItems.map(item => (
              <div key={item.id} className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-gray-900 font-medium mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <PrimaryButton onClick={handleStartWeaknessPractice}>
                    去练习
                  </PrimaryButton>
                </div>
              </div>
            ))}
          </div>
        </AppCard>
      </div>

      <Modal
        open={showInfoModal}
        title="练习记录说明"
        confirmText="我知道了"
        onCancel={() => setShowInfoModal(false)}
      >
        <p className="text-gray-600 text-sm">
          练习记录会帮助你回顾历史练习表现，查看正确率变化和仍需加强的知识点。
        </p>
      </Modal>
    </div>
  )
}
