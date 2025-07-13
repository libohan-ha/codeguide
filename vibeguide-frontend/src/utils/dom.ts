/**
 * DOM 操作工具函数
 */

// 元素查询
export const $ = (selector: string, context: Document | Element = document): Element | null => {
  return context.querySelector(selector)
}

export const $$ = (selector: string, context: Document | Element = document): NodeListOf<Element> => {
  return context.querySelectorAll(selector)
}

// 类名操作
export const addClass = (element: Element, ...classNames: string[]): void => {
  element.classList.add(...classNames)
}

export const removeClass = (element: Element, ...classNames: string[]): void => {
  element.classList.remove(...classNames)
}

export const toggleClass = (element: Element, className: string, force?: boolean): boolean => {
  return element.classList.toggle(className, force)
}

export const hasClass = (element: Element, className: string): boolean => {
  return element.classList.contains(className)
}

// 样式操作
export const setStyle = (element: HTMLElement, styles: Partial<CSSStyleDeclaration>): void => {
  Object.assign(element.style, styles)
}

export const getStyle = (element: HTMLElement, property: string): string => {
  return window.getComputedStyle(element).getPropertyValue(property)
}

// 属性操作
export const setAttr = (element: Element, name: string, value: string): void => {
  element.setAttribute(name, value)
}

export const getAttr = (element: Element, name: string): string | null => {
  return element.getAttribute(name)
}

export const removeAttr = (element: Element, name: string): void => {
  element.removeAttribute(name)
}

export const hasAttr = (element: Element, name: string): boolean => {
  return element.hasAttribute(name)
}

// 数据属性操作
export const setData = (element: HTMLElement, key: string, value: any): void => {
  element.dataset[key] = JSON.stringify(value)
}

export const getData = <T = any>(element: HTMLElement, key: string): T | null => {
  const value = element.dataset[key]
  if (value === undefined) return null
  
  try {
    return JSON.parse(value)
  } catch {
    return value as unknown as T
  }
}

// 元素创建
export const createElement = <K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  attributes?: Partial<HTMLElementTagNameMap[K]> & { className?: string; textContent?: string },
  children?: (Element | string)[]
): HTMLElementTagNameMap[K] => {
  const element = document.createElement(tagName)
  
  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value as string
      } else if (key === 'textContent') {
        element.textContent = value as string
      } else if (key.startsWith('data-')) {
        element.setAttribute(key, String(value))
      } else {
        (element as any)[key] = value
      }
    })
  }
  
  if (children) {
    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child))
      } else {
        element.appendChild(child)
      }
    })
  }
  
  return element
}

// 元素位置和尺寸
export const getRect = (element: Element): DOMRect => {
  return element.getBoundingClientRect()
}

export const getOffset = (element: HTMLElement): { top: number; left: number } => {
  const rect = element.getBoundingClientRect()
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
  
  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft
  }
}

export const getViewportSize = (): { width: number; height: number } => {
  return {
    width: window.innerWidth || document.documentElement.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight
  }
}

// 滚动操作
export const scrollTo = (
  element: Element | Window,
  options: ScrollToOptions | { top?: number; left?: number; behavior?: 'auto' | 'smooth' }
): void => {
  if ('scrollTo' in element) {
    element.scrollTo(options)
  }
}

export const scrollIntoView = (
  element: Element,
  options?: boolean | ScrollIntoViewOptions
): void => {
  element.scrollIntoView(options)
}

export const getScrollPosition = (): { x: number; y: number } => {
  return {
    x: window.pageXOffset || document.documentElement.scrollLeft,
    y: window.pageYOffset || document.documentElement.scrollTop
  }
}

// 事件操作
export const on = <K extends keyof HTMLElementEventMap>(
  element: Element | Window | Document,
  event: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions | boolean
): void => {
  element.addEventListener(event, handler as EventListener, options)
}

export const off = <K extends keyof HTMLElementEventMap>(
  element: Element | Window | Document,
  event: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  options?: EventListenerOptions | boolean
): void => {
  element.removeEventListener(event, handler as EventListener, options)
}

export const once = <K extends keyof HTMLElementEventMap>(
  element: Element | Window | Document,
  event: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions | boolean
): void => {
  const wrappedHandler = (e: Event) => {
    handler(e as HTMLElementEventMap[K])
    element.removeEventListener(event, wrappedHandler, options)
  }
  element.addEventListener(event, wrappedHandler, options)
}

// 表单操作
export const serializeForm = (form: HTMLFormElement): Record<string, any> => {
  const formData = new FormData(form)
  const result: Record<string, any> = {}
  
  for (const [key, value] of formData.entries()) {
    if (result[key]) {
      if (Array.isArray(result[key])) {
        result[key].push(value)
      } else {
        result[key] = [result[key], value]
      }
    } else {
      result[key] = value
    }
  }
  
  return result
}

export const resetForm = (form: HTMLFormElement): void => {
  form.reset()
}

// 焦点管理
export const focus = (element: HTMLElement): void => {
  element.focus()
}

export const blur = (element: HTMLElement): void => {
  element.blur()
}

export const getFocusedElement = (): Element | null => {
  return document.activeElement
}

// 可见性检测
export const isVisible = (element: Element): boolean => {
  const rect = element.getBoundingClientRect()
  const viewport = getViewportSize()
  
  return (
    rect.top < viewport.height &&
    rect.bottom > 0 &&
    rect.left < viewport.width &&
    rect.right > 0
  )
}

export const isInViewport = (element: Element, threshold: number = 0): boolean => {
  const rect = element.getBoundingClientRect()
  const viewport = getViewportSize()
  
  return (
    rect.top >= -threshold &&
    rect.left >= -threshold &&
    rect.bottom <= viewport.height + threshold &&
    rect.right <= viewport.width + threshold
  )
}

// 元素关系
export const closest = (element: Element, selector: string): Element | null => {
  return element.closest(selector)
}

export const matches = (element: Element, selector: string): boolean => {
  return element.matches(selector)
}

export const contains = (parent: Element, child: Element): boolean => {
  return parent.contains(child)
}

// 文本选择
export const selectText = (element: HTMLElement): void => {
  const range = document.createRange()
  range.selectNodeContents(element)
  
  const selection = window.getSelection()
  if (selection) {
    selection.removeAllRanges()
    selection.addRange(range)
  }
}

export const getSelectedText = (): string => {
  const selection = window.getSelection()
  return selection ? selection.toString() : ''
}

// 剪贴板操作
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // 降级方案
      const textArea = createElement('textarea', {
        value: text,
        style: {
          position: 'fixed',
          left: '-999999px',
          top: '-999999px'
        } as any
      })
      
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      const result = document.execCommand('copy')
      document.body.removeChild(textArea)
      
      return result
    }
  } catch {
    return false
  }
}

// 防抖的 resize 监听器
export const onResize = (callback: () => void, delay: number = 100): (() => void) => {
  let timeoutId: number
  
  const handler = () => {
    clearTimeout(timeoutId)
    timeoutId = window.setTimeout(callback, delay)
  }
  
  window.addEventListener('resize', handler)
  
  return () => {
    clearTimeout(timeoutId)
    window.removeEventListener('resize', handler)
  }
}

// 媒体查询
export const matchMedia = (query: string): {
  matches: boolean
  addListener: (callback: (matches: boolean) => void) => () => void
} => {
  const mediaQuery = window.matchMedia(query)
  
  return {
    matches: mediaQuery.matches,
    addListener: (callback: (matches: boolean) => void) => {
      const handler = (e: MediaQueryListEvent) => callback(e.matches)
      mediaQuery.addListener(handler)
      
      return () => mediaQuery.removeListener(handler)
    }
  }
}