import { type ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ModernCardProps {
  children: ReactNode
  variant?: 'default' | 'glass' | 'gradient' | 'floating' | 'interactive'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'apple' | 'float'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  border?: boolean
  hover?: boolean
  glow?: boolean
  className?: string
  onClick?: () => void
}

const ModernCard = forwardRef<HTMLDivElement, ModernCardProps>(
  ({
    children,
    variant = 'default',
    size = 'md',
    shadow = 'md',
    rounded = 'xl',
    border = true,
    hover = false,
    glow = false,
    className,
    onClick,
    ...props
  }, ref) => {
    const baseClasses = cn(
      'relative overflow-hidden',
      'transition-all duration-300 ease-apple',
      'transform-gpu',
      
      // 交互效果
      onClick && 'cursor-pointer',
      hover && !onClick && 'hover:shadow-lg hover:-translate-y-1',
      onClick && 'hover:shadow-lg hover:-translate-y-1 active:translate-y-0 active:scale-98',
      
      // 发光效果
      glow && 'hover:shadow-glow'
    )

    const sizeClasses = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10'
    }

    const shadowClasses = {
      none: 'shadow-none',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl',
      apple: 'shadow-apple',
      float: 'shadow-float'
    }

    const roundedClasses = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      '2xl': 'rounded-2xl',
      '3xl': 'rounded-3xl'
    }

    const variantClasses = {
      default: cn(
        'bg-white',
        border && 'border border-gray-200',
        'backdrop-blur-sm'
      ),
      
      glass: cn(
        'glass',
        'text-gray-800',
        !border && 'border-0'
      ),
      
      gradient: cn(
        'bg-gradient-glass',
        'text-gray-800',
        border && 'border border-white/20'
      ),
      
      floating: cn(
        'bg-white',
        border && 'border border-gray-200',
        'animate-floating'
      ),
      
      interactive: cn(
        'bg-white',
        border && 'border border-gray-200',
        'hover:bg-gradient-glass',
        'hover:border-white/30'
      )
    }

    const cardContent = (
      <>
        {/* 微光效果 */}
        {(variant === 'gradient' || variant === 'interactive') && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        )}
        
        {/* 呼吸光晕 */}
        {glow && (
          <div className="absolute -inset-1 bg-gradient-primary opacity-20 blur-xl animate-breathing pointer-events-none" />
        )}

        {/* 内容层，确保在最上层 */}
        <div className="relative z-10">
          {children}
        </div>
      </>
    )

    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(
          baseClasses,
          sizeClasses[size],
          shadowClasses[shadow],
          roundedClasses[rounded],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {cardContent}
      </div>
    )
  }
)

ModernCard.displayName = 'ModernCard'

export default ModernCard