import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

const PageTransition: React.FC<PageTransitionProps> = ({ children, className }) => {
  const location = useLocation()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displayLocation, setDisplayLocation] = useState(location)

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setIsTransitioning(true)
      
      const timer = setTimeout(() => {
        setDisplayLocation(location)
        setIsTransitioning(false)
      }, 300) // 过渡时间
      
      return () => clearTimeout(timer)
    }
  }, [location, displayLocation])

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* 当前页面 */}
      <div
        className={cn(
          'transition-all duration-300 ease-apple',
          isTransitioning 
            ? 'opacity-0 transform translate-x-[-20px]' 
            : 'opacity-100 transform translate-x-0'
        )}
      >
        {children}
      </div>
      
      {/* 过渡遮罩 */}
      {isTransitioning && (
        <div className="absolute inset-0 bg-gradient-glass backdrop-blur-sm animate-fade-in" />
      )}
    </div>
  )
}

// 路由级别的页面过渡 - 简化版本
export const RouteTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [currentPath, setCurrentPath] = useState(location.pathname)

  useEffect(() => {
    if (location.pathname !== currentPath) {
      setIsTransitioning(true)
      
      // 立即更新路径，避免阻塞导航
      setCurrentPath(location.pathname)
      
      // 短暂的过渡效果
      const timer = setTimeout(() => {
        setIsTransitioning(false)
      }, 150)
      
      return () => clearTimeout(timer)
    }
  }, [location.pathname, currentPath])

  return (
    <div className="min-h-screen relative">
      <div
        className={cn(
          'transition-opacity duration-150 ease-out',
          isTransitioning ? 'opacity-90' : 'opacity-100'
        )}
      >
        {children}
      </div>
    </div>
  )
}

export default PageTransition