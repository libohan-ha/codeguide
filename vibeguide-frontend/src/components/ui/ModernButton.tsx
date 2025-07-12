import { type ReactNode, forwardRef } from 'react'
import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ModernButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost' | 'glass'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  gradient?: boolean
  glow?: boolean
  floating?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

const ModernButton = forwardRef<HTMLButtonElement, ModernButtonProps>(
  ({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon: Icon,
    iconPosition = 'left',
    fullWidth = false,
    gradient = false,
    glow = false,
    floating = false,
    onClick,
    type = 'button',
    className,
    ...props
  }, ref) => {
    const baseClasses = cn(
      // 基础样式
      'relative inline-flex items-center justify-center',
      'font-medium rounded-xl',
      'transition-all duration-300 ease-apple',
      'focus:outline-none focus:ring-4 focus:ring-opacity-50',
      'transform-gpu',
      'select-none',
      
      // 悬停效果
      'hover:shadow-lg hover:-translate-y-1',
      'active:translate-y-0 active:scale-95',
      
      // 禁用状态
      disabled && 'opacity-50 cursor-not-allowed transform-none hover:translate-y-0 hover:shadow-none',
      
      // 全宽
      fullWidth && 'w-full',
      
      // 浮动效果
      floating && 'animate-floating',
      
      // 发光效果
      glow && !disabled && 'shadow-glow hover:shadow-glow-lg'
    )

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm gap-1.5',
      md: 'px-4 py-2.5 text-base gap-2',
      lg: 'px-6 py-3 text-lg gap-2.5',
      xl: 'px-8 py-4 text-xl gap-3'
    }

    const variantClasses = {
      primary: gradient
        ? 'bg-gradient-primary text-white shadow-apple focus:ring-primary-500'
        : 'bg-primary-600 hover:bg-primary-700 text-white shadow-apple focus:ring-primary-500',
      
      secondary: gradient
        ? 'bg-gradient-ocean text-white shadow-glass focus:ring-secondary-500'
        : 'bg-secondary-600 hover:bg-secondary-700 text-white shadow-md focus:ring-secondary-500',
      
      success: gradient
        ? 'bg-gradient-success text-white shadow-md focus:ring-success-500'
        : 'bg-success-600 hover:bg-success-700 text-white shadow-md focus:ring-success-500',
      
      warning: gradient
        ? 'bg-gradient-warm text-white shadow-md focus:ring-warning-500'
        : 'bg-warning-600 hover:bg-warning-700 text-white shadow-md focus:ring-warning-500',
      
      danger: 'bg-danger-600 hover:bg-danger-700 text-white shadow-md focus:ring-danger-500',
      
      ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 border border-gray-300 focus:ring-gray-500',
      
      glass: 'glass text-gray-800 hover:bg-white/20 focus:ring-primary-500 border-0'
    }

    const iconSizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-7 h-7'
    }

    const loadingSpinner = (
      <svg
        className={cn('animate-spin', iconSizeClasses[size])}
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    )

    const buttonContent = (
      <>
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            {loadingSpinner}
          </span>
        )}
        
        <span className={cn('flex items-center gap-2', loading && 'opacity-0')}>
          {Icon && iconPosition === 'left' && (
            <Icon className={iconSizeClasses[size]} />
          )}
          
          <span className="relative">
            {children}
            {glow && !disabled && (
              <span className="absolute inset-0 bg-gradient-primary opacity-0 blur-md group-hover:opacity-30 transition-opacity duration-300" />
            )}
          </span>
          
          {Icon && iconPosition === 'right' && (
            <Icon className={iconSizeClasses[size]} />
          )}
        </span>
        
        {/* 微光效果 */}
        {!disabled && (
          <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 animate-shimmer" />
        )}
      </>
    )

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        onClick={onClick}
        className={cn(
          baseClasses,
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {buttonContent}
      </button>
    )
  }
)

ModernButton.displayName = 'ModernButton'

export default ModernButton