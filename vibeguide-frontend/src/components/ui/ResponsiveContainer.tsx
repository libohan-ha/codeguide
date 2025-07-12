import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface ResponsiveContainerProps {
  children: React.ReactNode
  className?: string
  adaptive?: boolean // 是否启用自适应布局
  fluid?: boolean // 是否流体布局
  centerContent?: boolean // 是否居中内容
}

// 断点检测 Hook
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<'sm' | 'md' | 'lg' | 'xl' | '2xl'>('lg')
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth
      
      if (width < 640) {
        setBreakpoint('sm')
        setIsMobile(true)
        setIsTablet(false)
        setIsDesktop(false)
      } else if (width < 768) {
        setBreakpoint('md')
        setIsMobile(false)
        setIsTablet(true)
        setIsDesktop(false)
      } else if (width < 1024) {
        setBreakpoint('lg')
        setIsMobile(false)
        setIsTablet(true)
        setIsDesktop(false)
      } else if (width < 1280) {
        setBreakpoint('xl')
        setIsMobile(false)
        setIsTablet(false)
        setIsDesktop(true)
      } else {
        setBreakpoint('2xl')
        setIsMobile(false)
        setIsTablet(false)
        setIsDesktop(true)
      }
    }

    updateBreakpoint()
    window.addEventListener('resize', updateBreakpoint)
    
    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])

  return { breakpoint, isMobile, isTablet, isDesktop }
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({ 
  children, 
  className,
  adaptive = true,
  fluid = false,
  centerContent = false
}) => {
  const { isMobile, isTablet, isDesktop } = useBreakpoint()
  const [isAnimating, setIsAnimating] = useState(false)

  // 当断点变化时触发动画
  useEffect(() => {
    if (adaptive) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isMobile, isTablet, isDesktop, adaptive])

  return (
    <div
      className={cn(
        'w-full transition-all duration-300 ease-apple',
        
        // 基础容器样式
        !fluid && 'container mx-auto',
        fluid && 'w-full',
        
        // 响应式内边距
        'px-4 sm:px-6 lg:px-8',
        
        // 自适应动画
        adaptive && isAnimating && 'transform scale-[0.98]',
        adaptive && !isAnimating && 'transform scale-100',
        
        // 居中内容
        centerContent && 'flex items-center justify-center min-h-[50vh]',
        
        className
      )}
    >
      {/* 内容容器 */}
      <div
        className={cn(
          'w-full transition-all duration-300 ease-apple',
          
          // 响应式最大宽度
          !fluid && [
            isMobile && 'max-w-full',
            isTablet && 'max-w-4xl',
            isDesktop && 'max-w-6xl'
          ],
          
          // 自适应布局
          adaptive && [
            isMobile && 'space-y-4',
            isTablet && 'space-y-6',
            isDesktop && 'space-y-8'
          ]
        )}
      >
        {children}
      </div>
      
      {/* 响应式指示器（仅在开发模式显示） */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 z-50 px-2 py-1 bg-black/80 text-white text-xs rounded backdrop-blur-sm">
          {isMobile && '📱 Mobile'}
          {isTablet && '📱 Tablet'}
          {isDesktop && '🖥️ Desktop'}
        </div>
      )}
    </div>
  )
}

// 响应式网格组件
interface ResponsiveGridProps {
  children: React.ReactNode
  cols?: {
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: string
  className?: string
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  cols = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 'gap-6',
  className
}) => {
  const { isMobile, isTablet } = useBreakpoint()

  return (
    <div
      className={cn(
        'grid transition-all duration-300 ease-apple',
        gap,
        
        // 响应式列数
        `grid-cols-${cols.sm || 1}`,
        `md:grid-cols-${cols.md || 2}`,
        `lg:grid-cols-${cols.lg || 3}`,
        `xl:grid-cols-${cols.xl || 4}`,
        
        // 移动端优化
        isMobile && 'gap-4',
        isTablet && 'gap-5',
        
        className
      )}
    >
      {children}
    </div>
  )
}

// 响应式堆叠组件
interface ResponsiveStackProps {
  children: React.ReactNode
  direction?: 'vertical' | 'horizontal' | 'responsive'
  spacing?: string
  breakpoint?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export const ResponsiveStack: React.FC<ResponsiveStackProps> = ({
  children,
  direction = 'responsive',
  spacing = 'gap-4',
  breakpoint = 'md',
  className
}) => {
  return (
    <div
      className={cn(
        'transition-all duration-300 ease-apple',
        spacing,
        
        // 方向控制
        direction === 'vertical' && 'flex flex-col',
        direction === 'horizontal' && 'flex flex-row',
        direction === 'responsive' && [
          'flex flex-col',
          breakpoint === 'sm' && 'sm:flex-row',
          breakpoint === 'md' && 'md:flex-row',
          breakpoint === 'lg' && 'lg:flex-row',
          breakpoint === 'xl' && 'xl:flex-row'
        ],
        
        className
      )}
    >
      {children}
    </div>
  )
}

export default ResponsiveContainer