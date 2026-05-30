import { ReactNode } from 'react'
import { Wifi, Signal } from 'lucide-react'

interface DeviceFrameProps {
  children: ReactNode
}

function DeviceStatusBar() {
  return (
    <div className="bg-white h-[64px] flex items-center justify-between px-6 border-b border-gray-100 flex-shrink-0">
      <div className="flex items-center">
        <span className="text-sm font-semibold text-gray-900">9:41</span>
      </div>

      <div className="absolute left-1/2 transform -translate-x-1/2 w-28 h-6 bg-black rounded-full" />

      <div className="flex items-center gap-2">
        <Signal className="w-4 h-4 text-gray-900" />
        <Wifi className="w-4 h-4 text-gray-900" />
        <div className="w-6 h-3 border border-gray-900 rounded-sm relative">
          <div className="absolute inset-0 bg-gray-900 rounded-[1px] mr-0.5" style={{ width: '75%' }} />
        </div>
      </div>
    </div>
  )
}

export default function DeviceFrame({ children }: DeviceFrameProps) {
  return (
    <>
      {/* 桌面端 iPhone 预览框 */}
      <div className="hidden md:flex min-h-screen items-center justify-center bg-gray-200 p-6">
        {/* iPhone 外壳 */}
        <div className="w-[430px] h-[900px] bg-gray-900 rounded-[56px] p-[18px] shadow-2xl">
          {/* 内部屏幕区域 */}
          <div className="w-full h-full bg-[#F6F8FB] rounded-[40px] overflow-hidden relative flex flex-col">
            {/* 状态栏 */}
            <DeviceStatusBar />
            
            {/* 内容区域 */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* 移动端真实页面 */}
      <div className="md:hidden min-h-screen bg-gray-200">
        <div className="max-w-[430px] min-h-screen mx-auto bg-[#F6F8FB] relative overflow-x-hidden">
          {children}
        </div>
      </div>
    </>
  )
}
