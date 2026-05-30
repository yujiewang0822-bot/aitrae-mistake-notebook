import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface ToastProps {
  message: string
  visible: boolean
  duration?: number
  onClose?: () => void
}

export default function Toast({
  message,
  visible,
  duration = 2000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(visible)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (visible) {
      setIsVisible(true)
      timerRef.current = window.setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, duration)
    } else {
      setIsVisible(false)
    }
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current)
      }
    }
  }, [visible, duration, onClose])

  if (!isVisible) return null

  return createPortal(
    <div className="fixed z-50 left-1/2 -translate-x-1/2 mb-4 px-6 py-3 bg-gray-800 text-white text-sm rounded-full shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-200" style={{ bottom: 'calc(max(env(safe-area-inset-bottom), 0px) + 16px)' }}>
      {message}
    </div>,
    document.body
  )
}
