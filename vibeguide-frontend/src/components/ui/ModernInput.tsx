import { forwardRef, useState } from 'react'
import { type LucideIcon, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ModernInputProps {
  label?: string
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onFocus?: () => void
  onBlur?: () => void
  disabled?: boolean
  required?: boolean
  error?: string
  helperText?: string
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  variant?: 'default' | 'glass' | 'minimal'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  autoFocus?: boolean
  maxLength?: number
  className?: string
}

const ModernInput = forwardRef<HTMLInputElement, ModernInputProps>(
  ({
    label,
    placeholder,
    type = 'text',
    value,
    defaultValue,
    onChange,
    onFocus,
    onBlur,
    disabled = false,
    required = false,
    error,
    helperText,
    icon: Icon,
    iconPosition = 'left',
    variant = 'default',
    size = 'md',
    fullWidth = false,
    autoFocus = false,
    maxLength,
    className,
    ...props
  }, ref) => {
    const [focused, setFocused] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [internalValue, setInternalValue] = useState(defaultValue || '')

    const isControlled = value !== undefined
    const inputValue = isControlled ? value : internalValue

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      if (!isControlled) {
        setInternalValue(newValue)
      }
      onChange?.(newValue)
    }

    const handleFocus = () => {
      setFocused(true)
      onFocus?.()
    }

    const handleBlur = () => {
      setFocused(false)
      onBlur?.()
    }

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword)
    }

    const hasValue = inputValue && inputValue.length > 0
    const isPassword = type === 'password'
    const actualType = isPassword && showPassword ? 'text' : type

    const containerClasses = cn(
      'relative',
      fullWidth && 'w-full'
    )

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-5 py-4 text-lg'
    }

    const inputClasses = cn(
      // 基础样式
      'w-full border rounded-xl',
      'transition-all duration-300 ease-apple',
      'focus:outline-none',
      'placeholder:text-gray-400',
      'text-gray-900 dark:text-gray-100',
      '!text-gray-900 dark:!text-gray-100',
      'transform-gpu',
      
      // 尺寸
      sizeClasses[size],
      
      // 图标间距
      Icon && iconPosition === 'left' && 'pl-12',
      Icon && iconPosition === 'right' && 'pr-12',
      isPassword && 'pr-12',
      
      // 禁用状态
      disabled && 'opacity-50 cursor-not-allowed',
      
      // 错误状态
      error && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500',
      
      // 正常状态
      !error && !disabled && [
        variant === 'default' && 'border-gray-300 bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20',
        variant === 'glass' && 'glass border-white/20 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20',
        variant === 'minimal' && 'border-0 border-b-2 rounded-none bg-transparent focus:border-primary-500'
      ],
      
      // 聚焦效果
      focused && !error && 'shadow-apple',
      
      className
    )

    const labelClasses = cn(
      'absolute left-4 transition-all duration-200 ease-apple pointer-events-none',
      'text-gray-500',
      
      // 浮动标签效果
      (focused || hasValue) ? [
        'top-2 text-xs font-medium',
        focused && !error && 'text-primary-600',
        error && 'text-danger-600'
      ] : [
        size === 'sm' && 'top-2.5 text-sm',
        size === 'md' && 'top-3.5 text-base',
        size === 'lg' && 'top-4.5 text-lg'
      ]
    )

    const iconClasses = cn(
      'absolute top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-200',
      
      size === 'sm' && 'w-4 h-4',
      size === 'md' && 'w-5 h-5',
      size === 'lg' && 'w-6 h-6',
      
      iconPosition === 'left' && 'left-4',
      iconPosition === 'right' && 'right-4',
      
      focused && !error && 'text-primary-500',
      error && 'text-danger-500'
    )

    return (
      <div className={containerClasses}>
        <div className="relative">
          <input
            ref={ref}
            type={actualType}
            value={inputValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            required={required}
            autoFocus={autoFocus}
            maxLength={maxLength}
            placeholder={label ? '' : placeholder}
            className={inputClasses}
            {...props}
          />
          
          {/* 浮动标签 */}
          {label && (
            <label className={labelClasses}>
              {label}
              {required && <span className="text-danger-500 ml-1">*</span>}
            </label>
          )}
          
          {/* 左侧图标 */}
          {Icon && iconPosition === 'left' && (
            <Icon className={iconClasses} />
          )}
          
          {/* 右侧图标 */}
          {Icon && iconPosition === 'right' && !isPassword && (
            <Icon className={iconClasses} />
          )}
          
          {/* 密码可见性切换 */}
          {isPassword && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className={cn(iconClasses, 'cursor-pointer hover:text-primary-600')}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          )}
          
          {/* 聚焦时的发光效果 */}
          {focused && !error && (
            <div className="absolute inset-0 rounded-xl bg-primary-500/5 pointer-events-none animate-pulse" />
          )}
        </div>
        
        {/* 错误信息或帮助文本 */}
        {(error || helperText) && (
          <div className="mt-2 text-sm">
            {error ? (
              <span className="text-danger-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </span>
            ) : (
              <span className="text-gray-500">{helperText}</span>
            )}
          </div>
        )}
      </div>
    )
  }
)

ModernInput.displayName = 'ModernInput'

export default ModernInput