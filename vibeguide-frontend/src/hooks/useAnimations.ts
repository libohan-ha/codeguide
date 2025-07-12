import { useEffect, useState, useRef, useCallback } from 'react'

// 交集观察器动画钩子
export const useInViewAnimation = (
  threshold = 0.1,
  triggerOnce = true
) => {
  const [isInView, setIsInView] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (triggerOnce) {
            setHasTriggered(true)
          }
        } else if (!triggerOnce && !hasTriggered) {
          setIsInView(false)
        }
      },
      { threshold }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [threshold, triggerOnce, hasTriggered])

  return { ref, isInView }
}

// 滚动动画钩子
export const useScrollAnimation = () => {
  const [scrollY, setScrollY] = useState(0)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down')
  const [isScrolling, setIsScrolling] = useState(false)
  const lastScrollY = useRef(0)
  const scrollTimeoutRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const updateScrollY = () => {
      const currentScrollY = window.scrollY
      
      setScrollY(currentScrollY)
      setScrollDirection(currentScrollY > lastScrollY.current ? 'down' : 'up')
      setIsScrolling(true)
      
      lastScrollY.current = currentScrollY

      // 重置滚动状态
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      scrollTimeoutRef.current = window.setTimeout(() => {
        setIsScrolling(false)
      }, 150)
    }

    window.addEventListener('scroll', updateScrollY, { passive: true })
    return () => {
      window.removeEventListener('scroll', updateScrollY)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  return { scrollY, scrollDirection, isScrolling }
}

// 视差滚动钩子
export const useParallax = (speed = 0.5) => {
  const [offset, setOffset] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const element = ref.current
      if (!element) return

      const scrolled = window.scrollY
      const parallaxOffset = scrolled * speed

      setOffset(parallaxOffset)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return { ref, offset }
}

// 悬停动画钩子
export const useHoverAnimation = (
  config: {
    scale?: number
    rotate?: number
    translateX?: number
    translateY?: number
    duration?: number
  } = {}
) => {
  const [isHovered, setIsHovered] = useState(false)
  const [style, setStyle] = useState({})

  const {
    scale = 1.05,
    rotate = 0,
    translateX = 0,
    translateY = 0,
    duration = 300
  } = config

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
    setStyle({
      transform: `scale(${scale}) rotate(${rotate}deg) translate(${translateX}px, ${translateY}px)`,
      transition: `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`
    })
  }, [scale, rotate, translateX, translateY, duration])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    setStyle({
      transform: 'scale(1) rotate(0deg) translate(0px, 0px)',
      transition: `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`
    })
  }, [duration])

  return {
    isHovered,
    style,
    handlers: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave
    }
  }
}

// 序列动画钩子
export const useSequenceAnimation = (
  items: number,
  delay = 100,
  triggerOnMount = true
) => {
  const [activeIndex, setActiveIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)

  const playSequence = useCallback(() => {
    setIsPlaying(true)
    setActiveIndex(-1)

    const timers: NodeJS.Timeout[] = []

    for (let i = 0; i < items; i++) {
      const timer = setTimeout(() => {
        setActiveIndex(i)
        
        if (i === items - 1) {
          setTimeout(() => {
            setIsPlaying(false)
          }, delay)
        }
      }, i * delay)
      
      timers.push(timer)
    }

    return () => {
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [items, delay])

  const resetSequence = useCallback(() => {
    setActiveIndex(-1)
    setIsPlaying(false)
  }, [])

  useEffect(() => {
    if (triggerOnMount) {
      playSequence()
    }
  }, [triggerOnMount, playSequence])

  return {
    activeIndex,
    isPlaying,
    playSequence,
    resetSequence
  }
}

// 弹簧动画钩子
export const useSpringAnimation = (
  config: {
    from: number
    to: number
    stiffness?: number
    damping?: number
    mass?: number
  }
) => {
  const [value, setValue] = useState(config.from)
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef<number | undefined>(undefined)

  const {
    from,
    to,
    stiffness = 170,
    damping = 26,
    mass = 1
  } = config

  const animate = useCallback(() => {
    setIsAnimating(true)
    
    let velocity = 0
    let currentValue = from
    const targetValue = to

    const step = () => {
      const spring = -stiffness * (currentValue - targetValue)
      const damper = -damping * velocity
      const acceleration = (spring + damper) / mass

      velocity += acceleration
      currentValue += velocity

      setValue(currentValue)

      // 检查是否接近目标值
      if (Math.abs(currentValue - targetValue) < 0.001 && Math.abs(velocity) < 0.001) {
        setValue(targetValue)
        setIsAnimating(false)
        return
      }

      animationRef.current = window.requestAnimationFrame(step)
    }

    animationRef.current = window.requestAnimationFrame(step)
  }, [from, to, stiffness, damping, mass])

  const stop = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      setIsAnimating(false)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return {
    value,
    isAnimating,
    animate,
    stop
  }
}

// 手势识别钩子
export const useGesture = (
  element: React.RefObject<HTMLElement>,
  config: {
    onSwipeLeft?: () => void
    onSwipeRight?: () => void
    onSwipeUp?: () => void
    onSwipeDown?: () => void
    threshold?: number
  } = {}
) => {
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [isTracking, setIsTracking] = useState(false)

  const { threshold = 50 } = config

  useEffect(() => {
    const el = element.current
    if (!el) return

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      setStartPos({ x: touch.clientX, y: touch.clientY })
      setIsTracking(true)
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isTracking) return

      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - startPos.x
      const deltaY = touch.clientY - startPos.y

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // 水平滑动
        if (Math.abs(deltaX) > threshold) {
          if (deltaX > 0) {
            config.onSwipeRight?.()
          } else {
            config.onSwipeLeft?.()
          }
        }
      } else {
        // 垂直滑动
        if (Math.abs(deltaY) > threshold) {
          if (deltaY > 0) {
            config.onSwipeDown?.()
          } else {
            config.onSwipeUp?.()
          }
        }
      }

      setIsTracking(false)
    }

    const handleMouseDown = (e: MouseEvent) => {
      setStartPos({ x: e.clientX, y: e.clientY })
      setIsTracking(true)
    }

    const handleMouseUp = (e: MouseEvent) => {
      if (!isTracking) return

      const deltaX = e.clientX - startPos.x
      const deltaY = e.clientY - startPos.y

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > threshold) {
          if (deltaX > 0) {
            config.onSwipeRight?.()
          } else {
            config.onSwipeLeft?.()
          }
        }
      } else {
        if (Math.abs(deltaY) > threshold) {
          if (deltaY > 0) {
            config.onSwipeDown?.()
          } else {
            config.onSwipeUp?.()
          }
        }
      }

      setIsTracking(false)
    }

    el.addEventListener('touchstart', handleTouchStart, { passive: true })
    el.addEventListener('touchend', handleTouchEnd, { passive: true })
    el.addEventListener('mousedown', handleMouseDown)
    el.addEventListener('mouseup', handleMouseUp)

    return () => {
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchend', handleTouchEnd)
      el.removeEventListener('mousedown', handleMouseDown)
      el.removeEventListener('mouseup', handleMouseUp)
    }
  }, [element, startPos, isTracking, threshold, config])

  return { isTracking }
}

// 性能优化动画钩子
export const useOptimizedAnimation = (
  shouldAnimate: boolean,
  animationClass: string
) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const [classes, setClasses] = useState('')

  useEffect(() => {
    if (shouldAnimate) {
      setIsAnimating(true)
      setClasses(animationClass)

      // 动画结束后清理
      const timer = setTimeout(() => {
        setIsAnimating(false)
        setClasses('')
      }, 1000) // 根据动画持续时间调整

      return () => clearTimeout(timer)
    }
  }, [shouldAnimate, animationClass])

  return { isAnimating, classes }
}

// 所有hooks已经在上面单独导出