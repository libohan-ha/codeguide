import React from 'react'
import { useGlobalLoading } from '@/store/selectors'
import { cn } from '@/lib/utils'

const GlobalLoader: React.FC = () => {
  const isLoading = useGlobalLoading()

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="glass rounded-2xl p-8 flex flex-col items-center gap-4 shadow-float">
        {/* 苹果风格的加载动画 */}
        <div className="relative">
          <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute inset-0 w-12 h-12 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900 mb-1">
            处理中...
          </p>
          <p className="text-sm text-gray-600">
            请稍候，正在为您处理请求
          </p>
        </div>
      </div>
    </div>
  )
}

// 特定加载状态组件
interface SpecificLoaderProps {
  type: 'projects' | 'documents' | 'aiGeneration' | 'saving'
  className?: string
}

export const SpecificLoader: React.FC<SpecificLoaderProps> = ({ type, className }) => {
  const messages = {
    projects: '加载项目中...',
    documents: '生成文档中...',
    aiGeneration: 'AI分析中...',
    saving: '保存中...'
  }

  return (
    <div className={cn('flex items-center gap-3 p-4', className)}>
      <div className="relative">
        <div className="w-6 h-6 border-2 border-gray-200 rounded-full"></div>
        <div className="absolute inset-0 w-6 h-6 border-2 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <span className="text-sm text-gray-600">{messages[type]}</span>
    </div>
  )
}

// 内联加载器组件
interface InlineLoaderProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
  className?: string
}

export const InlineLoader: React.FC<InlineLoaderProps> = ({ 
  size = 'md', 
  message,
  className 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3'
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative">
        <div className={cn('border-gray-200 rounded-full', sizeClasses[size])}></div>
        <div className={cn(
          'absolute inset-0 border-primary-500 rounded-full border-t-transparent animate-spin',
          sizeClasses[size]
        )}></div>
      </div>
      {message && (
        <span className="text-sm text-gray-600">{message}</span>
      )}
    </div>
  )
}

export default GlobalLoader