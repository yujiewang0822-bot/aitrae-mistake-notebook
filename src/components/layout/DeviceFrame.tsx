import { ReactNode } from 'react'
import BottomNav from './BottomNav'

interface DeviceFrameProps {
  children: ReactNode
}

export default function DeviceFrame({ children }: DeviceFrameProps) {
  return (
    <div className="min-h-screen bg-[#F6F8FB] w-full">
      <main className="w-full max-w-[1200px] mx-auto px-8 pt-4 pb-[96px] md:px-8">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
