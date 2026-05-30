export interface UserProfile {
  grade: string
  textbookVersion: string
  examGoal: string
}

export interface MockAuthState {
  isLoggedIn: boolean
  hasCompletedOnboarding: boolean
  userProfile: UserProfile
}

export interface HomeSummary {
  todayReviewCount: number
  continuousStudyDays: number
  weeklyAccuracy: number
  todayAddedMistakes: number
  totalMistakes: number
  pendingMasterMistakes: number
  masteredMistakes: number
}

export interface Mistake {
  id: string
  subject: string
  grade: string
  textbookVersion: string
  chapter: string
  knowledgePoint: string
  errorType: string
  status: 'pending' | 'reviewing' | 'mastered'
  lastReviewTime: string
  wrongCount: number
  questionText: string
  userAnswer: string
  correctAnswer: string
  aiReason: string
  aiSuggestion: string
  tags: string[]
}

export interface ReviewTask {
  id: string
  mistakeId: string
  taskType: 'daily' | 'weekly' | 'monthly' | 'exam'
  priority: 'high' | 'medium' | 'low'
  reason: string
  status: 'pending' | 'completed'
}

export interface StudyPlan {
  id: string
  examGoal: string
  daysLeft: number
  progress: number
  totalTasks: number
  completedTasks: number
  weakPoints: string[]
  tasks: StudyPlanTask[]
}

export interface StudyPlanTask {
  id: string
  title: string
  description: string
  subject: string
  chapter: string
  status: 'pending' | 'in-progress' | 'completed'
  dueDate: string
}

export interface PracticeQuestion {
  id: string
  mistakeId: string
  questionText: string
  options: string[]
  correctAnswer: string
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  knowledgePoint: string
}

export interface Message {
  id: string
  type: 'review' | 'practice' | 'system' | 'exam'
  title: string
  content: string
  time: string
  read: boolean
}
