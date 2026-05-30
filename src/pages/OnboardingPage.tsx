import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, UserProfile } from '../data/mockAuth'
import PrimaryButton from '../components/ui/PrimaryButton'
import Header from '../components/layout/Header'

// 年级选项
const GRADE_OPTIONS = ['初一', '初二', '初三', '高一', '高二', '高三']
// 教材版本选项
const TEXTBOOK_OPTIONS = ['人教版', '北师大版', '苏教版', '沪教版', '暂不确定']
// 考试目标选项
const EXAM_GOAL_OPTIONS = ['月考', '期中', '期末', '中考', '高考', '暂无']

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { completeOnboarding } = useAuth()

  const [grade, setGrade] = useState('')
  const [textbookVersion, setTextbookVersion] = useState('')
  const [examGoal, setExamGoal] = useState('')

  const handleComplete = () => {
    if (!grade || !textbookVersion || !examGoal) {
      alert('请完成所有选项')
      return
    }

    const profile: UserProfile = {
      grade,
      textbookVersion,
      examGoal
    }
    completeOnboarding(profile)
    navigate('/home', { replace: true })
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="px-6 pt-6">
        <h1 className="text-xl font-bold text-gray-900 mb-8">
          先了解一下你的学习情况
        </h1>

        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-600 mb-4">年级</h3>
          <div className="grid grid-cols-3 gap-3">
            {GRADE_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => setGrade(option)}
                className={`py-3 px-4 rounded-xl text-sm font-medium transition-colors ${
                  grade === option
                    ? 'bg-primary-100 text-primary-600 border border-primary-200'
                    : 'bg-gray-50 text-gray-700 border border-gray-100'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-600 mb-4">教材版本</h3>
          <div className="grid grid-cols-2 gap-3">
            {TEXTBOOK_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => setTextbookVersion(option)}
                className={`py-3 px-4 rounded-xl text-sm font-medium transition-colors ${
                  textbookVersion === option
                    ? 'bg-primary-100 text-primary-600 border border-primary-200'
                    : 'bg-gray-50 text-gray-700 border border-gray-100'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h3 className="text-sm font-medium text-gray-600 mb-4">近期考试目标</h3>
          <div className="grid grid-cols-3 gap-3">
            {EXAM_GOAL_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => setExamGoal(option)}
                className={`py-3 px-4 rounded-xl text-sm font-medium transition-colors ${
                  examGoal === option
                    ? 'bg-primary-100 text-primary-600 border border-primary-200'
                    : 'bg-gray-50 text-gray-700 border border-gray-100'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 pb-8">
        <PrimaryButton 
          onClick={handleComplete}
          disabled={!grade || !textbookVersion || !examGoal}
        >
          完成设置
        </PrimaryButton>
      </div>
    </div>
  )
}
