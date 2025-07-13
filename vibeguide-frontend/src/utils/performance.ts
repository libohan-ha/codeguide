/**
 * 性能优化工具函数
 */

// 防抖函数
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }

    const callNow = immediate && !timeout

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)

    if (callNow) func(...args)
  }
}

// 节流函数
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false

  return function executedFunction(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// 延迟执行
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 批量执行任务
export const batchTasks = async <T>(
  tasks: Array<() => Promise<T>>,
  batchSize: number = 3
): Promise<T[]> => {
  const results: T[] = []
  
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize)
    const batchResults = await Promise.all(batch.map(task => task()))
    results.push(...batchResults)
  }
  
  return results
}

// 重试机制
export const retry = async <T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<T> => {
  let lastError: Error

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      
      if (attempt === maxAttempts) {
        throw lastError
      }
      
      await delay(delayMs * attempt) // 指数退避
    }
  }

  throw lastError!
}

// 缓存函数结果
export const memoize = <TArgs extends any[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  getKey?: (...args: TArgs) => string
): ((...args: TArgs) => TReturn) => {
  const cache = new Map<string, TReturn>()

  return (...args: TArgs): TReturn => {
    const key = getKey ? getKey(...args) : JSON.stringify(args)
    
    if (cache.has(key)) {
      return cache.get(key)!
    }

    const result = fn(...args)
    cache.set(key, result)
    return result
  }
}

// 异步缓存
export const memoizeAsync = <TArgs extends any[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  getKey?: (...args: TArgs) => string,
  ttl?: number
): ((...args: TArgs) => Promise<TReturn>) => {
  const cache = new Map<string, { value: TReturn; timestamp: number }>()

  return async (...args: TArgs): Promise<TReturn> => {
    const key = getKey ? getKey(...args) : JSON.stringify(args)
    const now = Date.now()
    
    const cached = cache.get(key)
    if (cached && (!ttl || now - cached.timestamp < ttl)) {
      return cached.value
    }

    const result = await fn(...args)
    cache.set(key, { value: result, timestamp: now })
    return result
  }
}

// 性能测量
export const measurePerformance = async <T>(
  name: string,
  fn: () => Promise<T> | T
): Promise<T> => {
  const start = performance.now()
  
  try {
    const result = await fn()
    const end = performance.now()
    
    console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`)
    return result
  } catch (error) {
    const end = performance.now()
    console.error(`[Performance] ${name} failed after ${(end - start).toFixed(2)}ms:`, error)
    throw error
  }
}

// 虚拟滚动辅助函数
export const calculateVirtualScrollRange = (
  containerHeight: number,
  itemHeight: number,
  totalItems: number,
  scrollTop: number,
  overscan: number = 5
): { startIndex: number; endIndex: number } => {
  const visibleItems = Math.ceil(containerHeight / itemHeight)
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(totalItems - 1, startIndex + visibleItems + overscan * 2)
  
  return { startIndex, endIndex }
}

// 图片懒加载
export const createImageLoader = (): {
  observe: (element: HTMLImageElement) => void
  unobserve: (element: HTMLImageElement) => void
  disconnect: () => void
} => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          const src = img.dataset.src
          
          if (src) {
            img.src = src
            img.removeAttribute('data-src')
            observer.unobserve(img)
          }
        }
      })
    },
    {
      rootMargin: '50px',
    }
  )

  return {
    observe: (element: HTMLImageElement) => observer.observe(element),
    unobserve: (element: HTMLImageElement) => observer.unobserve(element),
    disconnect: () => observer.disconnect(),
  }
}

// 请求优先级队列
export class RequestQueue {
  private high: Array<() => Promise<any>> = []
  private normal: Array<() => Promise<any>> = []
  private low: Array<() => Promise<any>> = []
  private running = 0
  private maxConcurrent: number

  constructor(maxConcurrent: number = 3) {
    this.maxConcurrent = maxConcurrent
  }

  add<T>(
    request: () => Promise<T>,
    priority: 'high' | 'normal' | 'low' = 'normal'
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const wrappedRequest = async () => {
        try {
          const result = await request()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      }

      switch (priority) {
        case 'high':
          this.high.push(wrappedRequest)
          break
        case 'normal':
          this.normal.push(wrappedRequest)
          break
        case 'low':
          this.low.push(wrappedRequest)
          break
      }

      this.process()
    })
  }

  private async process() {
    if (this.running >= this.maxConcurrent) return

    const nextRequest = this.high.shift() || this.normal.shift() || this.low.shift()
    if (!nextRequest) return

    this.running++

    try {
      await nextRequest()
    } finally {
      this.running--
      this.process() // 处理下一个请求
    }
  }
}