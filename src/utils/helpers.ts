export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: '待复习',
    reviewing: '复习中',
    mastered: '已掌握',
    completed: '已完成',
  }
  return statusMap[status] || status
}

export const getDifficultyText = (difficulty: string): string => {
  const difficultyMap: Record<string, string> = {
    easy: '简单',
    medium: '中等',
    hard: '困难',
  }
  return difficultyMap[difficulty] || difficulty
}
