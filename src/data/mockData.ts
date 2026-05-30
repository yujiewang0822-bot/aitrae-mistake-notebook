import type { HomeSummary, Mistake, ReviewTask, StudyPlan, PracticeQuestion, Message } from '../types'

export const homeSummary: HomeSummary = {
  todayReviewCount: 5,
  continuousStudyDays: 7,
  weeklyAccuracy: 82,
  todayAddedMistakes: 3,
  totalMistakes: 45,
  pendingMasterMistakes: 12,
  masteredMistakes: 33
}

export const mistakes: Mistake[] = [
  {
    id: 'm1',
    subject: '数学',
    grade: '初二',
    textbookVersion: '人教版',
    chapter: '一元二次方程',
    knowledgePoint: '因式分解法',
    errorType: '计算错误',
    status: 'reviewing',
    lastReviewTime: '2024-01-20',
    wrongCount: 2,
    questionText: '已知一元二次方程 x² - 5x + 6 = 0，求方程的两个根。',
    userAnswer: 'x₁ = 1, x₂ = 6',
    correctAnswer: 'x₁ = 2, x₂ = 3',
    aiReason: '你在因式分解时出现了错误，将常数项6分解为1×6，正确应该是2×3。',
    aiSuggestion: '建议多练习因式分解的基本方法，可以尝试使用十字相乘法进行快速分解。',
    tags: ['方程', '因式分解']
  },
  {
    id: 'm2',
    subject: '数学',
    grade: '初二',
    textbookVersion: '人教版',
    chapter: '二次函数',
    knowledgePoint: '函数求值',
    errorType: '概念理解错误',
    status: 'pending',
    lastReviewTime: '2024-01-18',
    wrongCount: 1,
    questionText: '若函数 f(x) = x² - 2x + 3，求 f(2) 的值。',
    userAnswer: 'f(2) = 5',
    correctAnswer: 'f(2) = 3',
    aiReason: '你在代入计算时出现错误，正确计算应该是：f(2) = 2² - 2×2 + 3 = 4 - 4 + 3 = 3。',
    aiSuggestion: '建议在代入数值时分步计算，避免跳步导致的计算错误。',
    tags: ['函数', '求值']
  },
  {
    id: 'm3',
    subject: '数学',
    grade: '初二',
    textbookVersion: '人教版',
    chapter: '勾股定理',
    knowledgePoint: '勾股定理应用',
    errorType: '公式记错',
    status: 'mastered',
    lastReviewTime: '2024-01-15',
    wrongCount: 1,
    questionText: '直角三角形两直角边分别为3和4，求斜边长度。',
    userAnswer: '斜边长度为5',
    correctAnswer: '斜边长度为5',
    aiReason: '回答正确！你掌握了勾股定理的基本应用。',
    aiSuggestion: '继续保持，可以尝试更复杂的勾股定理应用题。',
    tags: ['几何', '勾股定理']
  },
  {
    id: 'm4',
    subject: '数学',
    grade: '初二',
    textbookVersion: '人教版',
    chapter: '一次函数',
    knowledgePoint: '斜率计算',
    errorType: '计算错误',
    status: 'reviewing',
    lastReviewTime: '2024-01-19',
    wrongCount: 3,
    questionText: '已知直线经过点(1, 3)和(3, 7)，求直线的斜率。',
    userAnswer: '斜率为2',
    correctAnswer: '斜率为2',
    aiReason: '回答正确！斜率计算公式：(7-3)/(3-1) = 4/2 = 2。',
    aiSuggestion: '掌握得很好，可以尝试解决更复杂的直线方程问题。',
    tags: ['函数', '斜率']
  },
  {
    id: 'm5',
    subject: '数学',
    grade: '初二',
    textbookVersion: '人教版',
    chapter: '不等式',
    knowledgePoint: '一元一次不等式',
    errorType: '不等号方向错误',
    status: 'pending',
    lastReviewTime: '2024-01-17',
    wrongCount: 2,
    questionText: '解不等式：2x - 5 > 3',
    userAnswer: 'x > 4',
    correctAnswer: 'x > 4',
    aiReason: '回答正确！解题过程：2x > 8，所以 x > 4。',
    aiSuggestion: '注意在乘除负数时需要改变不等号方向。',
    tags: ['不等式', '求解']
  },
  {
    id: 'm6',
    subject: '数学',
    grade: '初二',
    textbookVersion: '人教版',
    chapter: '分式',
    knowledgePoint: '分式化简',
    errorType: '通分错误',
    status: 'pending',
    lastReviewTime: '2024-01-20',
    wrongCount: 1,
    questionText: '化简：1/(x+1) + 1/(x-1)',
    userAnswer: '2x/(x²-1)',
    correctAnswer: '2x/(x²-1)',
    aiReason: '回答正确！通分后计算：(x-1+x+1)/[(x+1)(x-1)] = 2x/(x²-1)。',
    aiSuggestion: '分式运算掌握得不错，继续保持。',
    tags: ['分式', '化简']
  }
]

export const reviewTasks: ReviewTask[] = [
  {
    id: 'rt1',
    mistakeId: 'm1',
    taskType: 'daily',
    priority: 'high',
    reason: '连续错误2次，需要重点复习',
    status: 'pending'
  },
  {
    id: 'rt2',
    mistakeId: 'm2',
    taskType: 'daily',
    priority: 'medium',
    reason: '首次错误，需要巩固',
    status: 'pending'
  },
  {
    id: 'rt3',
    mistakeId: 'm4',
    taskType: 'weekly',
    priority: 'high',
    reason: '每周复习任务',
    status: 'pending'
  },
  {
    id: 'rt4',
    mistakeId: 'm5',
    taskType: 'daily',
    priority: 'medium',
    reason: '需要复习不等式知识点',
    status: 'completed'
  },
  {
    id: 'rt5',
    mistakeId: 'm6',
    taskType: 'daily',
    priority: 'low',
    reason: '新添加的错题',
    status: 'pending'
  }
]

export const studyPlan: StudyPlan = {
  id: 'sp1',
  examGoal: '期中考试',
  daysLeft: 14,
  progress: 35,
  totalTasks: 20,
  completedTasks: 7,
  weakPoints: ['一元二次方程', '二次函数', '分式运算'],
  tasks: [
    {
      id: 't1',
      title: '一元二次方程专项练习',
      description: '完成10道一元二次方程求解题目',
      subject: '数学',
      chapter: '一元二次方程',
      status: 'completed',
      dueDate: '2024-01-21'
    },
    {
      id: 't2',
      title: '二次函数图像分析',
      description: '复习二次函数的开口方向、顶点坐标等知识点',
      subject: '数学',
      chapter: '二次函数',
      status: 'completed',
      dueDate: '2024-01-22'
    },
    {
      id: 't3',
      title: '因式分解复习',
      description: '复习提公因式法、公式法、十字相乘法',
      subject: '数学',
      chapter: '因式分解',
      status: 'completed',
      dueDate: '2024-01-23'
    },
    {
      id: 't4',
      title: '一次函数应用题',
      description: '完成5道一次函数应用题',
      subject: '数学',
      chapter: '一次函数',
      status: 'in-progress',
      dueDate: '2024-01-24'
    },
    {
      id: 't5',
      title: '勾股定理综合练习',
      description: '完成勾股定理相关的几何应用题',
      subject: '数学',
      chapter: '勾股定理',
      status: 'pending',
      dueDate: '2024-01-25'
    },
    {
      id: 't6',
      title: '不等式专题复习',
      description: '复习一元一次不等式及不等式组',
      subject: '数学',
      chapter: '不等式',
      status: 'pending',
      dueDate: '2024-01-26'
    },
    {
      id: 't7',
      title: '分式运算练习',
      description: '完成分式化简、通分、约分练习',
      subject: '数学',
      chapter: '分式',
      status: 'pending',
      dueDate: '2024-01-27'
    }
  ]
}

export const practiceQuestions: PracticeQuestion[] = [
  {
    id: 'pq1',
    mistakeId: 'm1',
    questionText: '解方程：x² - 7x + 12 = 0',
    options: ['x₁=3, x₂=4', 'x₁=2, x₂=6', 'x₁=1, x₂=12', 'x₁=4, x₂=5'],
    correctAnswer: 'x₁=3, x₂=4',
    explanation: '使用因式分解法：x² - 7x + 12 = (x-3)(x-4) = 0，所以 x₁=3, x₂=4',
    difficulty: 'easy',
    knowledgePoint: '因式分解法'
  },
  {
    id: 'pq2',
    mistakeId: 'm1',
    questionText: '解方程：2x² + 5x - 3 = 0',
    options: ['x₁=1/2, x₂=-3', 'x₁=1, x₂=-3', 'x₁=1/2, x₂=3', 'x₁=2, x₂=-3'],
    correctAnswer: 'x₁=1/2, x₂=-3',
    explanation: '使用求根公式：x = (-5±√(25+24))/4 = (-5±7)/4，所以 x₁=1/2, x₂=-3',
    difficulty: 'medium',
    knowledgePoint: '求根公式'
  },
  {
    id: 'pq3',
    mistakeId: 'm2',
    questionText: '若函数 f(x) = 3x² - 4x + 1，求 f(-1) 的值。',
    options: ['f(-1)=8', 'f(-1)=6', 'f(-1)=-6', 'f(-1)=-8'],
    correctAnswer: 'f(-1)=8',
    explanation: '代入 x=-1：f(-1) = 3×(-1)² - 4×(-1) + 1 = 3 + 4 + 1 = 8',
    difficulty: 'easy',
    knowledgePoint: '函数求值'
  },
  {
    id: 'pq4',
    mistakeId: 'm4',
    questionText: '已知直线经过点(0, 2)和(2, 6)，求直线的斜率。',
    options: ['斜率为2', '斜率为1', '斜率为3', '斜率为4'],
    correctAnswer: '斜率为2',
    explanation: '斜率计算公式：(6-2)/(2-0) = 4/2 = 2',
    difficulty: 'easy',
    knowledgePoint: '斜率计算'
  },
  {
    id: 'pq5',
    mistakeId: 'm6',
    questionText: '化简：1/x - 1/(x+1)',
    options: ['1/(x(x+1))', '2x/(x(x+1))', '(x+1)/x', '1/(x²+x)'],
    correctAnswer: '1/(x(x+1))',
    explanation: '通分后计算：(x+1-x)/[x(x+1)] = 1/[x(x+1)]',
    difficulty: 'medium',
    knowledgePoint: '分式化简'
  }
]

export const messages: Message[] = [
  {
    id: 'msg1',
    type: 'review',
    title: '今日复习提醒',
    content: '您有 5 道错题需要复习，请及时完成',
    time: '08:00',
    read: false
  },
  {
    id: 'msg2',
    type: 'practice',
    title: '举一反三练习',
    content: '根据您的错题记录，为您推荐了 5 道相似题目',
    time: '09:30',
    read: false
  },
  {
    id: 'msg3',
    type: 'exam',
    title: '考试倒计时',
    content: '距离期中考试还有 14 天，请合理安排复习计划',
    time: '10:00',
    read: true
  },
  {
    id: 'msg4',
    type: 'system',
    title: '学习报告',
    content: '本周您共整理了 8 道错题，正确率达到 82%',
    time: '昨天',
    read: true
  },
  {
    id: 'msg5',
    type: 'review',
    title: '复习完成',
    content: '您已完成今日的复习任务，继续保持！',
    time: '昨天',
    read: true
  }
]
