import { ReactNode, ButtonHTMLAttributes } from 'react'

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  className?: string
}

export default function PrimaryButton({
  children,
  className = '',
  disabled = false,
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      className={`
        w-full h-12 bg-primary-600 text-white rounded-xl text-sm font-semibold
        flex items-center justify-center
        transition-colors
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-700 active:bg-primary-800'}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
