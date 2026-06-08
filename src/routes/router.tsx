import { createBrowserRouter, Outlet } from 'react-router-dom'
import DeviceFrame from '../components/layout/DeviceFrame'
import LaunchPage from '../pages/LaunchPage'
import LoginPage from '../pages/LoginPage'
import OnboardingPage from '../pages/OnboardingPage'
import HomePage from '../pages/HomePage'
import UploadPage from '../pages/UploadPage'
import PreviewPage from '../pages/PreviewPage'
import SelectQuestionPage from '../pages/SelectQuestionPage'
import AnalyzePage from '../pages/AnalyzePage'
import SaveMistakePage from '../pages/SaveMistakePage'
import SaveSuccessPage from '../pages/SaveSuccessPage'
import MistakeDetailPage from '../pages/MistakeDetailPage'
import TodayReviewPage from '../pages/TodayReviewPage'
import PracticeCenterPage from '../pages/PracticeCenterPage'
import PracticePage from '../pages/PracticePage'
import PracticeResultPage from '../pages/PracticeResultPage'
import MistakeListPage from '../pages/MistakeListPage'
import StudyPlanPage from '../pages/StudyPlanPage'
import MessagePage from '../pages/MessagePage'
import ProfilePage from '../pages/ProfilePage'
import ExamPracticePage from '../pages/ExamPracticePage'
import KnowledgePracticePage from '../pages/KnowledgePracticePage'
import PracticeRecordsPage from '../pages/PracticeRecordsPage'
import PaperReviewPage from '../pages/PaperReviewPage'

function AppLayout() {
  return <DeviceFrame><Outlet /></DeviceFrame>
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { path: '/', element: <LaunchPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/onboarding', element: <OnboardingPage /> },
      { path: '/home', element: <HomePage /> },
      { path: '/upload', element: <UploadPage /> },
      { path: '/preview', element: <PreviewPage /> },
      { path: '/select-question', element: <SelectQuestionPage /> },
      { path: '/analyze', element: <AnalyzePage /> },
      { path: '/save-mistake', element: <SaveMistakePage /> },
      { path: '/save-success', element: <SaveSuccessPage /> },
      { path: '/mistake/:id', element: <MistakeDetailPage /> },
      { path: '/today-review', element: <TodayReviewPage /> },
      { path: '/practice', element: <PracticeCenterPage /> },
      { path: '/practice/:id', element: <PracticePage /> },
      { path: '/practice-result', element: <PracticeResultPage /> },
      { path: '/mistakes', element: <MistakeListPage /> },
      { path: '/study-plan', element: <StudyPlanPage /> },
      { path: '/exam-practice', element: <ExamPracticePage /> },
      { path: '/knowledge-practice', element: <KnowledgePracticePage /> },
      { path: '/paper-review', element: <PaperReviewPage /> },
      { path: '/practice-records', element: <PracticeRecordsPage /> },
      { path: '/message', element: <MessagePage /> },
      { path: '/profile', element: <ProfilePage /> },
    ]
  },
])

export default router
