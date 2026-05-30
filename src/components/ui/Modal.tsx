import { ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  children?: ReactNode
}

export default function Modal({
  open,
  title,
  description,
  confirmText = '确定',
  cancelText = '取消',
  onConfirm,
  onCancel,
  children,
}: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm mx-0 sm:mx-4 p-6 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 fade-in duration-200">
        {/* 右上角关闭按钮 */}
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        )}
        
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-2 pr-10">{title}</h3>
        )}
        {description && (
          <p className="text-gray-600 mb-6 text-sm">{description}</p>
        )}
        {children}
        {(onConfirm || onCancel) && (
          <div className="flex gap-3 mt-6">
            {onCancel && (
              <button
                className="flex-1 h-11 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold"
                onClick={onCancel}
              >
                {cancelText}
              </button>
            )}
            {onConfirm && (
              <button
                className="flex-1 h-11 bg-primary-600 text-white rounded-xl text-sm font-semibold"
                onClick={onConfirm}
              >
                {confirmText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
