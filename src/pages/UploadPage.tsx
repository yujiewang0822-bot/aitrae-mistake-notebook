import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Info, Camera, Image, Zap } from 'lucide-react'
import Modal from '../components/ui/Modal'

export default function UploadPage() {
  const navigate = useNavigate()
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [flashOn, setFlashOn] = useState(false)

  const handleBack = () => {
    navigate('/home')
  }

  const handlePhoto = () => {
    navigate('/preview')
  }

  const handleGallery = () => {
    navigate('/preview')
  }

  return (
    <div className="min-h-screen bg-[#F6F8FB] flex flex-col">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 flex-shrink-0">
        <div className="pt-[max(env(safe-area-inset-top),0px)]">
          <div className="h-14 flex items-center px-4">
            <div className="w-10 h-10 flex items-center">
              <button
                onClick={handleBack}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
            </div>
            <div className="flex-1 text-center">
              <h1 className="text-lg font-semibold text-gray-900">拍照上传</h1>
            </div>
            <div className="w-10 h-10 flex items-center justify-end">
              <button
                onClick={() => setShowHelpModal(true)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <Info className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-shrink-0">
        <div className="bg-gray-900 relative overflow-hidden flex items-center justify-center p-4" style={{ height: '420px' }}>
          <div className="absolute inset-4 border-2 border-dashed border-blue-400 rounded-2xl flex items-center justify-center">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-2xl" />
            
            <div className="flex flex-col items-center px-4">
              <Camera className="w-14 h-14 text-gray-500 mb-3" />
              <p className="text-gray-400 text-sm text-center">请保持整页完整，避免阴影遮挡</p>
            </div>
          </div>
          
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-gray-400 text-xs text-center">支持整页拍照，系统将自动切分题目</p>
          </div>
        </div>

        <div className="bg-blue-50 border-t border-b border-blue-100 px-4 py-2">
          <p className="text-blue-700 text-sm text-center">拍整页作业即可，系统会自动拆分成单题。</p>
        </div>
      </div>

      <div className="mt-auto bg-white px-6 py-5 pb-[max(env(safe-area-inset-bottom),20px)]">
        <div className="flex items-center justify-between">
          <button 
            onClick={handleGallery}
            className="flex flex-col items-center gap-2"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${flashOn ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
              <Image className="w-7 h-7" />
            </div>
            <span className="text-xs text-gray-600">相册</span>
          </button>

          <button 
            onClick={handlePhoto}
            className="rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30 active:scale-95 transition-transform"
            style={{ width: '72px', height: '72px' }}
          >
            <div className="w-[56px] h-[56px] rounded-full border-4 border-white flex items-center justify-center">
              <Camera className="w-7 h-7 text-white" />
            </div>
          </button>

          <button 
            onClick={() => setFlashOn(!flashOn)}
            className="flex flex-col items-center gap-2"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${flashOn ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
              <Zap className="w-7 h-7" />
            </div>
            <span className={`text-xs transition-colors ${flashOn ? 'text-blue-600' : 'text-gray-600'}`}>补光</span>
          </button>
        </div>
      </div>

      <Modal
        open={showHelpModal}
        title="拍照上传说明"
        confirmText="我知道了"
        onConfirm={() => setShowHelpModal(false)}
        onCancel={() => setShowHelpModal(false)}
      >
        <ul className="space-y-3 text-gray-600 text-sm">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
            <span>保持整页作业完整</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
            <span>题目文字清晰可见</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
            <span>避免阴影遮挡</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
            <span>尽量让纸张边缘在取景框内</span>
          </li>
        </ul>
      </Modal>
    </div>
  )
}
