import { useNavigate } from 'react-router-dom'
import { Sparkles, BookOpen, Tags, Target, Brain, TrendingUp, AlertCircle, ChevronRight, BarChart3 } from 'lucide-react'
import BottomNav from '../components/layout/BottomNav'
import AppCard from '../components/ui/AppCard'
import PrimaryButton from '../components/ui/PrimaryButton'
import SecondaryButton from '../components/ui/SecondaryButton'

/**
 * 练习中心页面
 * 
 * 页面核心职责：
 * - 系统推荐练习：基于错题数据智能推荐最需要巩固的练习
 * - 自主选择练习：用户根据复习目标自主选择练习方式
 * - 练习反馈：展示最近练习效果和数据
 * 
 * 数据策略：
 * - 推荐依据：错题数量、待复习状态、重复错误次数、最近练习正确率
 */
export default function PracticeCenterPage() {
  const navigate = useNavigate()

  // 系统推荐练习数据
  const recommendedPractice = {
    title: '一元一次方程专项练习',
    reason: '第一单元错题最多，近 7 天重复出现移项符号错误。',
    details: {
      chapter: '第一单元 一元一次方程',
      totalMistakes: 12,
      pendingReview: 4,
      highFrequencyError: '移项符号错误',
      estimatedTime: '15 分钟'
    }
  }

  // 自主选择练习入口数据
  const selfStudyOptions = [
    {
      id: 'chapter',
      title: '按章节练习',
      description: '从单元/课时选择错题练习',
      data: '覆盖 6 个章节',
      icon: BookOpen,
      iconColor: 'purple',
      path: '/mistakes'
    },
    {
      id: 'knowledge',
      title: '按知识点练习',
      description: '选择具体知识点专项训练',
      data: '8 个知识点',
      icon: Tags,
      iconColor: 'blue',
      path: '/knowledge-practice'
    },
    {
      id: 'exam',
      title: '考试专题练习',
      description: '围绕月考、期中、期末自动组卷',
      data: '可自定义组卷',
      icon: Target,
      iconColor: 'green',
      path: '/exam-practice'
    },
    {
      id: 'similar',
      title: '举一反三',
      description: '根据已保存错题生成同类题',
      data: '推荐 8 道题',
      icon: Brain,
      iconColor: 'orange',
      path: '/practice/1?from=practice-center&type=similar'
    }
  ]

  // 练习反馈数据
  const practiceFeedback = {
    weeklyCount: 36,
    accuracy: 76,
    topImprovement: '计算错误减少'
  }

  // 练习反馈文案
  const feedbackText = '最近练习后，一元一次方程的计算错误有所下降，但二次函数顶点坐标仍需加强。'

  return (
    <div className="pb-24">
      <div className="px-4 pt-4">
        {/* 页面标题 */}
        <h1 className="text-xl font-bold text-gray-900 mb-2">练习中心</h1>
        <p className="text-sm text-gray-500 mb-6">根据你的数学错题，推荐最需要巩固的练习</p>

        {/* 模块一：系统推荐练习 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">根据你的错题推荐</h2>
          <p className="text-sm text-gray-500 mb-4">优先练习近期重复出错、未掌握或集中在同一单元的题目。</p>
          
          {/* 推荐卡片 - 更突出 */}
          <AppCard className="p-5 border-2 border-primary-100 bg-gradient-to-br from-white to-primary-50/30">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg mb-1">{recommendedPractice.title}</h3>
                <p className="text-sm text-gray-600">{recommendedPractice.reason}</p>
              </div>
            </div>

            {/* 推荐依据 */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-medium text-gray-500">推荐依据</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">章节：</span>
                  <span className="text-gray-900 font-medium">{recommendedPractice.details.chapter}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">错题数：</span>
                  <span className="text-gray-900 font-medium">{recommendedPractice.details.totalMistakes} 道</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">待复习：</span>
                  <span className="text-gray-900 font-medium">{recommendedPractice.details.pendingReview} 道</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">高频错因：</span>
                  <span className="text-red-600 font-medium">{recommendedPractice.details.highFrequencyError}</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500">预计用时：{recommendedPractice.details.estimatedTime}</span>
              </div>
            </div>

            <PrimaryButton 
              className="w-full" 
              onClick={() => navigate('/practice/1?from=practice-center&type=recommend')}
            >
              开始推荐练习
            </PrimaryButton>

            {/* 数据来源说明 */}
            <p className="text-xs text-gray-400 mt-4 text-center">
              推荐依据来自：错题数量、待复习状态、重复错误次数、最近练习正确率
            </p>
          </AppCard>
        </div>

        {/* 模块二：自主选择练习 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">自主选择练习</h2>
          <p className="text-sm text-gray-500 mb-4">也可以根据自己的复习目标选择练习方式。</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {selfStudyOptions.map((option) => {
              const IconComponent = option.icon
              const iconBgColors: Record<string, string> = {
                purple: 'bg-purple-100',
                blue: 'bg-blue-100',
                green: 'bg-green-100',
                orange: 'bg-orange-100'
              }
              const iconTextColors: Record<string, string> = {
                purple: 'text-purple-600',
                blue: 'text-blue-600',
                green: 'text-green-600',
                orange: 'text-orange-600'
              }

              return (
                <AppCard key={option.id} className="p-4">
                  <div 
                    className="cursor-pointer"
                    onClick={() => navigate(option.path)}
                  >
                    <div className={`w-12 h-12 rounded-xl ${iconBgColors[option.iconColor]} flex items-center justify-center mb-3`}>
                      <IconComponent className={`w-6 h-6 ${iconTextColors[option.iconColor]}`} />
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900">{option.title}</h3>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{option.description}</p>
                    <span className="text-xs text-gray-400">{option.data}</span>
                  </div>
                </AppCard>
              )
            })}
          </div>
        </div>

        {/* 模块三：练习反馈 */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">最近练习反馈</h2>

          {/* 反馈数据卡片 */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <AppCard className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">{practiceFeedback.weeklyCount} 题</div>
              <div className="text-xs text-gray-500">本周练习</div>
            </AppCard>
            <AppCard className="p-4 text-center">
              <div className="text-2xl font-bold text-primary-600 mb-1">{practiceFeedback.accuracy}%</div>
              <div className="text-xs text-gray-500">平均正确率</div>
            </AppCard>
            <AppCard className="p-4 text-center">
              <div className="text-lg font-bold text-green-600 mb-1">{practiceFeedback.topImprovement}</div>
              <div className="text-xs text-gray-500">提升最多</div>
            </AppCard>
          </div>

          {/* 反馈文案 */}
          <AppCard className="p-4 bg-blue-50 border border-blue-100 mb-4">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">{feedbackText}</p>
            </div>
          </AppCard>

          <SecondaryButton 
            className="w-full" 
            onClick={() => navigate('/practice-records')}
          >
            查看练习记录
          </SecondaryButton>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
