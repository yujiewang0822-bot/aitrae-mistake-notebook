import { ReactNode, ButtonHTMLAttributes } from 'react'

interface SecondaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  className?: string
}

export default function SecondaryButton({
  children,
  className = '',
  disabled = false,
  ...props
}: SecondaryButtonProps) {
  return (
    <button
      className={`
        w-full h-11 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold
        flex items-center justify-center
        transition-colors
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 active:bg-gray-100'}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
