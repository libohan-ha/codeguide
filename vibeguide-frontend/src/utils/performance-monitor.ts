/**
 * 性能监控工具
 */

// 性能指标接口
export interface PerformanceMetrics {
  // 核心网页指标
  fcp?: number // First Contentful Paint
  lcp?: number // Largest Contentful Paint
  fid?: number // First Input Delay
  cls?: number // Cumulative Layout Shift
  ttfb?: number // Time to First Byte
  
  // 自定义指标
  domReady?: number
  loadComplete?: number
  interactionReady?: number
  
  // 内存使用
  usedJSHeapSize?: number
  totalJSHeapSize?: number
  jsHeapSizeLimit?: number
  
  // 网络信息
  connectionType?: string
  effectiveType?: string
  downlink?: number
  rtt?: number
}

// 性能监控器类
export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {}
  private observers: PerformanceObserver[] = []
  private startTime: number = performance.now()
  private onMetricUpdate?: (metric: string, value: number) => void
  
  constructor(onMetricUpdate?: (metric: string, value: number) => void) {
    this.onMetricUpdate = onMetricUpdate
    this.init()
  }

  private init(): void {
    this.observeNavigationTiming()
    this.observePaintTiming()
    this.observeLargestContentfulPaint()
    this.observeFirstInputDelay()
    this.observeCumulativeLayoutShift()
    this.observeMemoryUsage()
    this.observeNetworkInformation()
    this.observeCustomMetrics()
  }

  // 导航时序监控
  private observeNavigationTiming(): void {
    if ('navigation' in performance && 'getEntriesByType' in performance) {
      const [navigationEntry] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
      
      if (navigationEntry) {
        this.metrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart
        this.metrics.domReady = navigationEntry.domContentLoadedEventEnd - navigationEntry.fetchStart
        this.metrics.loadComplete = navigationEntry.loadEventEnd - navigationEntry.fetchStart
        
        this.notifyMetric('ttfb', this.metrics.ttfb)
        this.notifyMetric('domReady', this.metrics.domReady)
        this.notifyMetric('loadComplete', this.metrics.loadComplete)
      }
    }
  }

  // Paint 时序监控
  private observePaintTiming(): void {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              this.metrics.fcp = entry.startTime
              this.notifyMetric('fcp', this.metrics.fcp)
            }
          }
        })
        
        observer.observe({ entryTypes: ['paint'] })
        this.observers.push(observer)
      } catch (error) {
        console.warn('Paint timing observation failed:', error)
      }
    }
  }

  // Largest Contentful Paint 监控
  private observeLargestContentfulPaint(): void {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          
          if (lastEntry) {
            this.metrics.lcp = lastEntry.startTime
            this.notifyMetric('lcp', this.metrics.lcp)
          }
        })
        
        observer.observe({ entryTypes: ['largest-contentful-paint'] })
        this.observers.push(observer)
      } catch (error) {
        console.warn('LCP observation failed:', error)
      }
    }
  }

  // First Input Delay 监控
  private observeFirstInputDelay(): void {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const perfEntry = entry as any
            if (perfEntry.processingStart && entry.startTime) {
              this.metrics.fid = perfEntry.processingStart - entry.startTime
              this.notifyMetric('fid', this.metrics.fid)
            }
          }
        })
        
        observer.observe({ entryTypes: ['first-input'] })
        this.observers.push(observer)
      } catch (error) {
        console.warn('FID observation failed:', error)
      }
    }
  }

  // Cumulative Layout Shift 监控
  private observeCumulativeLayoutShift(): void {
    if ('PerformanceObserver' in window) {
      try {
        let cumulativeScore = 0
        
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const perfEntry = entry as any
            if (!perfEntry.hadRecentInput) {
              cumulativeScore += perfEntry.value
            }
          }
          
          this.metrics.cls = cumulativeScore
          this.notifyMetric('cls', this.metrics.cls)
        })
        
        observer.observe({ entryTypes: ['layout-shift'] })
        this.observers.push(observer)
      } catch (error) {
        console.warn('CLS observation failed:', error)
      }
    }
  }

  // 内存使用监控
  private observeMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      
      this.metrics.usedJSHeapSize = memory.usedJSHeapSize
      this.metrics.totalJSHeapSize = memory.totalJSHeapSize
      this.metrics.jsHeapSizeLimit = memory.jsHeapSizeLimit
      
      // 定期更新内存使用情况
      setInterval(() => {
        if ('memory' in performance) {
          const currentMemory = (performance as any).memory
          this.metrics.usedJSHeapSize = currentMemory.usedJSHeapSize
          this.notifyMetric('memoryUsage', currentMemory.usedJSHeapSize / (1024 * 1024)) // MB
        }
      }, 10000) // 每10秒更新一次
    }
  }

  // 网络信息监控
  private observeNetworkInformation(): void {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      
      this.metrics.connectionType = connection.type
      this.metrics.effectiveType = connection.effectiveType
      this.metrics.downlink = connection.downlink
      this.metrics.rtt = connection.rtt
      
      // 监听网络变化
      connection.addEventListener('change', () => {
        this.metrics.connectionType = connection.type
        this.metrics.effectiveType = connection.effectiveType
        this.metrics.downlink = connection.downlink
        this.metrics.rtt = connection.rtt
        
        this.notifyMetric('networkChange', Date.now())
      })
    }
  }

  // 自定义指标监控
  private observeCustomMetrics(): void {
    // React 组件渲染完成
    const checkInteractionReady = () => {
      if (document.readyState === 'complete') {
        // 等待 React 渲染完成的简单检查
        setTimeout(() => {
          const interactiveElements = document.querySelectorAll('button, a, input, select, textarea')
          if (interactiveElements.length > 0) {
            this.metrics.interactionReady = performance.now() - this.startTime
            this.notifyMetric('interactionReady', this.metrics.interactionReady)
          }
        }, 100)
      } else {
        setTimeout(checkInteractionReady, 100)
      }
    }
    
    checkInteractionReady()
  }

  // 通知指标更新
  private notifyMetric(name: string, value: number): void {
    if (this.onMetricUpdate) {
      this.onMetricUpdate(name, value)
    }
    
    // 控制台输出（仅开发环境）
    if (import.meta.env.DEV) {
      console.log(`[Performance] ${name}:`, value.toFixed(2))
    }
  }

  // 获取所有指标
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  // 标记自定义时间点
  public mark(name: string): void {
    if ('mark' in performance) {
      performance.mark(name)
    }
  }

  // 测量自定义时间段
  public measure(name: string, startMark?: string, endMark?: string): number | undefined {
    if ('measure' in performance) {
      try {
        performance.measure(name, startMark, endMark)
        const measures = performance.getEntriesByName(name, 'measure')
        const lastMeasure = measures[measures.length - 1]
        
        if (lastMeasure) {
          this.notifyMetric(name, lastMeasure.duration)
          return lastMeasure.duration
        }
      } catch (error) {
        console.warn(`Failed to measure ${name}:`, error)
      }
    }
  }

  // 获取资源加载时间
  public getResourceTiming(): PerformanceResourceTiming[] {
    return performance.getEntriesByType('resource') as PerformanceResourceTiming[]
  }

  // 分析慢资源
  public getSlowResources(threshold: number = 1000): PerformanceResourceTiming[] {
    return this.getResourceTiming().filter(resource => 
      resource.duration > threshold
    )
  }

  // 获取性能报告
  public getPerformanceReport(): {
    coreWebVitals: { name: string; value: number; rating: string }[]
    customMetrics: { name: string; value: number }[]
    slowResources: { name: string; duration: number }[]
    memoryUsage: { used: number; total: number; limit: number } | null
    networkInfo: { type?: string; effectiveType?: string; downlink?: number; rtt?: number } | null
  } {
    // Core Web Vitals 评级
    const getRating = (metric: string, value: number): string => {
      const thresholds: Record<string, { good: number; needsImprovement: number }> = {
        fcp: { good: 1800, needsImprovement: 3000 },
        lcp: { good: 2500, needsImprovement: 4000 },
        fid: { good: 100, needsImprovement: 300 },
        cls: { good: 0.1, needsImprovement: 0.25 },
      }
      
      const threshold = thresholds[metric]
      if (!threshold) return 'unknown'
      
      if (value <= threshold.good) return 'good'
      if (value <= threshold.needsImprovement) return 'needs-improvement'
      return 'poor'
    }

    const coreWebVitals = [
      { name: 'FCP', value: this.metrics.fcp || 0, rating: getRating('fcp', this.metrics.fcp || 0) },
      { name: 'LCP', value: this.metrics.lcp || 0, rating: getRating('lcp', this.metrics.lcp || 0) },
      { name: 'FID', value: this.metrics.fid || 0, rating: getRating('fid', this.metrics.fid || 0) },
      { name: 'CLS', value: this.metrics.cls || 0, rating: getRating('cls', this.metrics.cls || 0) },
    ].filter(metric => metric.value > 0)

    const customMetrics = [
      { name: 'TTFB', value: this.metrics.ttfb || 0 },
      { name: 'DOM Ready', value: this.metrics.domReady || 0 },
      { name: 'Load Complete', value: this.metrics.loadComplete || 0 },
      { name: 'Interaction Ready', value: this.metrics.interactionReady || 0 },
    ].filter(metric => metric.value > 0)

    const slowResources = this.getSlowResources().map(resource => ({
      name: resource.name,
      duration: resource.duration
    }))

    const memoryUsage = this.metrics.usedJSHeapSize ? {
      used: Math.round(this.metrics.usedJSHeapSize / (1024 * 1024)),
      total: Math.round((this.metrics.totalJSHeapSize || 0) / (1024 * 1024)),
      limit: Math.round((this.metrics.jsHeapSizeLimit || 0) / (1024 * 1024))
    } : null

    const networkInfo = this.metrics.connectionType ? {
      type: this.metrics.connectionType,
      effectiveType: this.metrics.effectiveType,
      downlink: this.metrics.downlink,
      rtt: this.metrics.rtt
    } : null

    return {
      coreWebVitals,
      customMetrics,
      slowResources,
      memoryUsage,
      networkInfo
    }
  }

  // 清理观察器
  public disconnect(): void {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

// 创建全局性能监控实例
export const createPerformanceMonitor = (onMetricUpdate?: (metric: string, value: number) => void) => {
  return new PerformanceMonitor(onMetricUpdate)
}

// 性能数据上报
export const reportPerformanceData = async (data: PerformanceMetrics, endpoint?: string): Promise<void> => {
  if (!endpoint) return

  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        metrics: data,
      }),
    })
  } catch (error) {
    console.warn('Failed to report performance data:', error)
  }
}