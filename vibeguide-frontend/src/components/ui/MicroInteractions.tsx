import React, { useEffect, useState, useRef } from 'react'
import { cn } from '@/lib/utils'

// 磁性按钮效果
interface MagneticButtonProps {
  children: React.ReactNode
  strength?: number
  className?: string
  disabled?: boolean
  onClick?: () => void
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  strength = 0.3,
  className,
  disabled = false,
  onClick
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const buttonRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (disabled || !buttonRef.current) return

    const rect = buttonRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const deltaX = (e.clientX - centerX) * strength
    const deltaY = (e.clientY - centerY) * strength

    setPosition({ x: deltaX, y: deltaY })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
    setIsHovered(false)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  return (
    <div
      ref={buttonRef}
      className={cn(
        'relative transition-all duration-300 ease-apple inline-block',
        'transform-gpu will-change-transform',
        !disabled && 'hover:scale-105',
        className
      )}
      style={{
        transform: `translate(${position.x}px, ${position.y}px) ${isHovered ? 'scale(1.05)' : 'scale(1)'}`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

// 弹性缩放效果
interface ElasticScaleProps {
  children: React.ReactNode
  scale?: number
  className?: string
  trigger?: 'hover' | 'click' | 'focus'
}

export const ElasticScale: React.FC<ElasticScaleProps> = ({
  children,
  scale = 1.05,
  className,
  trigger = 'hover'
}) => {
  const [isTriggered, setIsTriggered] = useState(false)

  const handleTrigger = () => {
    setIsTriggered(true)
    setTimeout(() => setIsTriggered(false), 200)
  }

  const triggerProps = {
    [trigger === 'hover' ? 'onMouseEnter' : trigger === 'click' ? 'onClick' : 'onFocus']: handleTrigger,
    ...(trigger === 'hover' && { onMouseLeave: () => setIsTriggered(false) })
  }

  return (
    <div
      className={cn(
        'transition-transform duration-200 ease-elastic cursor-pointer',
        'transform-gpu will-change-transform',
        className
      )}
      style={{
        transform: `scale(${isTriggered ? scale : 1})`,
      }}
      {...triggerProps}
    >
      {children}
    </div>
  )
}

// 涟漪效果
interface RippleEffectProps {
  children: React.ReactNode
  color?: string
  className?: string
  disabled?: boolean
}

export const RippleEffect: React.FC<RippleEffectProps> = ({
  children,
  color = 'rgba(255, 255, 255, 0.6)',
  className,
  disabled = false
}) => {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const handleClick = (e: React.MouseEvent) => {
    if (disabled || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()

    setRipples(prev => [...prev, { x, y, id }])

    // 清除涟漪
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id))
    }, 1000)
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden cursor-pointer',
        'transform-gpu will-change-transform',
        className
      )}
      onClick={handleClick}
    >
      {children}
      
      {/* 涟漪动画 */}
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="absolute rounded-full pointer-events-none animate-ping"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: '20px',
            height: '20px',
            backgroundColor: color,
            transform: 'translate(-50%, -50%)',
            animation: 'ripple 1s ease-out forwards'
          }}
        />
      ))}
    </div>
  )
}

// 浮动操作按钮
interface FloatingActionButtonProps {
  children: React.ReactNode
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  className?: string
  onClick?: () => void
  tooltip?: string
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  children,
  position = 'bottom-right',
  className,
  onClick,
  tooltip
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  }

  return (
    <div className="relative">
      <button
        className={cn(
          'fixed z-50 w-14 h-14 rounded-full shadow-float',
          'bg-gradient-primary text-white',
          'transition-all duration-300 ease-apple',
          'transform-gpu will-change-transform',
          'hover:scale-110 hover:shadow-glow',
          'active:scale-95',
          'flex items-center justify-center',
          positionClasses[position],
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        <div className={cn(
          'transition-transform duration-200 ease-apple',
          isHovered && 'scale-110'
        )}>
          {children}
        </div>
        
        {/* 脉冲效果 */}
        <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-75 animate-ping" />
      </button>
      
      {/* 工具提示 */}
      {tooltip && isHovered && (
        <div className={cn(
          'fixed z-50 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg',
          'transform transition-all duration-200 ease-apple',
          'animate-fade-in whitespace-nowrap',
          position.includes('right') ? 'right-20' : 'left-20',
          position.includes('bottom') ? 'bottom-8' : 'top-8'
        )}>
          {tooltip}
          <div className={cn(
            'absolute w-2 h-2 bg-gray-900 transform rotate-45',
            position.includes('right') ? 'right-[-4px]' : 'left-[-4px]',
            position.includes('bottom') ? 'bottom-3' : 'top-3'
          )} />
        </div>
      )}
    </div>
  )
}

// 粒子背景效果
interface ParticleBackgroundProps {
  count?: number
  color?: string
  speed?: number
  className?: string
}

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  count = 50,
  color = 'rgba(59, 130, 246, 0.3)',
  speed = 1,
  className
}) => {
  const [particles, setParticles] = useState<Array<{
    id: number
    x: number
    y: number
    size: number
    speedX: number
    speedY: number
  }>>([])

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * speed,
        speedY: (Math.random() - 0.5) * speed
      }))
      setParticles(newParticles)
    }

    generateParticles()
  }, [count, speed])

  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-floating opacity-60"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: color,
            animationDelay: `${particle.id * 0.1}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  )
}

// 鼠标跟随效果
interface MouseFollowerProps {
  children: React.ReactNode
  className?: string
  offset?: { x: number; y: number }
}

export const MouseFollower: React.FC<MouseFollowerProps> = ({
  children,
  className,
  offset = { x: 10, y: 10 }
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX + offset.x,
        y: e.clientY + offset.y
      })
      setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [offset])

  return (
    <div
      className={cn(
        'fixed z-50 pointer-events-none transition-all duration-100 ease-apple',
        'transform-gpu will-change-transform',
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0',
        className
      )}
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)'
      }}
    >
      {children}
    </div>
  )
}

// 所有组件已经在上面单独导出