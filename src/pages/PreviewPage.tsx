import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Image } from 'lucide-react'
import Header from '../components/layout/Header'
import AppCard from '../components/ui/AppCard'
import PrimaryButton from '../components/ui/PrimaryButton'
import SecondaryButton from '../components/ui/SecondaryButton'
import Modal from '../components/ui/Modal'
import Toast from '../components/ui/Toast'

export default function PreviewPage() {
  const navigate = useNavigate()
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [showUnclearModal, setShowUnclearModal] = useState(false)
  const [showNoQuestionModal, setShowNoQuestionModal] = useState(false)

  const handleRetake = () => {
    navigate('/upload')
  }

  const handleGallery = () => {
    setToastMessage('已重新选择图片')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const handleStartRecognize = () => {
    navigate('/select-question')
  }

  const handleUnclearRetake = () => {
    setShowUnclearModal(false)
    navigate('/upload')
  }

  const handleUnclearGallery = () => {
    setShowUnclearModal(false)
    setToastMessage('已重新选择图片')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const handleNoQuestionRetake = () => {
    setShowNoQuestionModal(false)
    navigate('/upload')
  }

  return (
    <div className="min-h-screen bg-[#F6F8FB] flex flex-col">
      <Header
        title="图片预览"
        showBack
      />

      <div className="flex-1 flex flex-col px-4 py-4">
        <div className="flex-shrink-0">
          <AppCard className="p-0 overflow-hidden">
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center" style={{ height: '420px' }}>
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                <Image className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium mb-2">已选择作业图片</p>
              <p className="text-gray-400 text-sm text-center px-4">确认图片清晰完整后开始识别</p>
            </div>
          </AppCard>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mt-4 flex-shrink-0">
          <p className="text-blue-700 text-sm text-center">请确认题目完整、文字清晰、没有明显阴影遮挡。</p>
        </div>

        <div className="mt-auto pt-4 pb-[max(env(safe-area-inset-bottom),20px)]">
          <div className="flex gap-3">
            <div className="w-28">
              <SecondaryButton className="w-full" onClick={handleRetake}>
                重拍
              </SecondaryButton>
            </div>
            <div className="flex-1">
              <SecondaryButton className="w-full" onClick={handleGallery}>
                从相册选择
              </SecondaryButton>
            </div>
            <div className="flex-1">
              <PrimaryButton className="w-full" onClick={handleStartRecognize}>
                开始识别
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={showUnclearModal}
        title="图片不清晰"
        onConfirm={handleUnclearRetake}
        onCancel={() => setShowUnclearModal(false)}
        confirmText="重新拍摄"
        cancelText="从相册选择"
      >
        <p className="text-gray-600 text-sm">请重新拍摄，确保题目完整且无阴影遮挡。</p>
        <button
          onClick={handleUnclearGallery}
          className="mt-4 w-full h-11 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold"
        >
          从相册选择
        </button>
      </Modal>

      <Modal
        open={showNoQuestionModal}
        title="未检测到题目"
        onConfirm={handleNoQuestionRetake}
        onCancel={() => setShowNoQuestionModal(false)}
        confirmText="重新拍摄"
        cancelText="手动框选"
      >
        <p className="text-gray-600 text-sm">请调整拍摄角度，或手动框选题目区域。</p>
      </Modal>

      <Toast message={toastMessage} visible={showToast} />
    </div>
  )
}
