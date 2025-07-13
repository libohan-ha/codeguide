/**
 * API 相关工具函数
 */

// API 错误类
export class ApiError extends Error {
  public status: number
  public statusText: string
  public data?: any

  constructor(status: number, statusText: string, data?: any) {
    super(`API Error ${status}: ${statusText}`)
    this.name = 'ApiError'
    this.status = status
    this.statusText = statusText
    this.data = data
  }
}

// 请求配置接口
export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: any
  timeout?: number
  retries?: number
  retryDelay?: number
}

// 创建带有默认配置的请求函数
export const createApiClient = (baseURL: string, defaultConfig: Partial<RequestConfig> = {}) => {
  return async <T = any>(endpoint: string, config: RequestConfig = {}): Promise<T> => {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = 30000,
      retries = 3,
      retryDelay = 1000,
    } = { ...defaultConfig, ...config }

    const url = `${baseURL}${endpoint}`
    const controller = new AbortController()
    
    // 设置超时
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const requestOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      signal: controller.signal,
    }

    if (body && method !== 'GET') {
      requestOptions.body = typeof body === 'string' ? body : JSON.stringify(body)
    }

    let lastError: Error

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await fetch(url, requestOptions)
        
        clearTimeout(timeoutId)

        if (!response.ok) {
          const errorData = await response.json().catch(() => null)
          throw new ApiError(response.status, response.statusText, errorData)
        }

        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          return await response.json()
        }
        
        return await response.text() as T
      } catch (error) {
        lastError = error as Error
        
        // 如果是最后一次尝试或者是非网络错误，直接抛出
        if (attempt === retries - 1 || error instanceof ApiError) {
          clearTimeout(timeoutId)
          throw error
        }
        
        // 等待后重试
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)))
      }
    }

    clearTimeout(timeoutId)
    throw lastError!
  }
}

// 默认 API 客户端
const apiClient = createApiClient(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000')

// 便捷方法
export const api = {
  get: <T = any>(endpoint: string, config?: Omit<RequestConfig, 'method'>) =>
    apiClient<T>(endpoint, { ...config, method: 'GET' }),
    
  post: <T = any>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method' | 'body'>) =>
    apiClient<T>(endpoint, { ...config, method: 'POST', body }),
    
  put: <T = any>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method' | 'body'>) =>
    apiClient<T>(endpoint, { ...config, method: 'PUT', body }),
    
  patch: <T = any>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method' | 'body'>) =>
    apiClient<T>(endpoint, { ...config, method: 'PATCH', body }),
    
  delete: <T = any>(endpoint: string, config?: Omit<RequestConfig, 'method'>) =>
    apiClient<T>(endpoint, { ...config, method: 'DELETE' }),
}

// URL 构建器
export const buildUrl = (base: string, params?: Record<string, any>): string => {
  const url = new URL(base, window.location.origin)
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url.searchParams.append(key, String(value))
      }
    })
  }
  
  return url.toString()
}

// 查询参数序列化
export const serializeQuery = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, String(item)))
      } else {
        searchParams.append(key, String(value))
      }
    }
  })
  
  return searchParams.toString()
}

// FormData 构建器
export const buildFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData()
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (value instanceof File || value instanceof Blob) {
        formData.append(key, value)
      } else if (Array.isArray(value)) {
        value.forEach(item => formData.append(key, String(item)))
      } else {
        formData.append(key, String(value))
      }
    }
  })
  
  return formData
}

// 上传文件
export const uploadFile = async (
  endpoint: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const formData = new FormData()
    formData.append('file', file)

    if (onProgress) {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100
          onProgress(progress)
        }
      })
    }

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText)
          resolve(response)
        } catch {
          resolve(xhr.responseText)
        }
      } else {
        reject(new ApiError(xhr.status, xhr.statusText))
      }
    })

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'))
    })

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload aborted'))
    })

    xhr.open('POST', endpoint)
    xhr.send(formData)
  })
}

// 下载文件
export const downloadFile = async (url: string, filename?: string): Promise<void> => {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new ApiError(response.status, response.statusText)
    }

    const blob = await response.blob()
    const downloadUrl = window.URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename || url.split('/').pop() || 'download'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    window.URL.revokeObjectURL(downloadUrl)
  } catch (error) {
    throw error
  }
}

// 请求拦截器类型
export type RequestInterceptor = (config: RequestConfig) => RequestConfig
export type ResponseInterceptor = <T>(response: T) => T
export type ErrorInterceptor = (error: Error) => Promise<never> | Error

// 带拦截器的 API 客户端
export class InterceptorApiClient {
  private requestInterceptors: RequestInterceptor[] = []
  private responseInterceptors: ResponseInterceptor[] = []
  private errorInterceptors: ErrorInterceptor[] = []
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor)
  }

  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor)
  }

  addErrorInterceptor(interceptor: ErrorInterceptor) {
    this.errorInterceptors.push(interceptor)
  }

  async request<T = any>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    try {
      // 应用请求拦截器
      let finalConfig = config
      for (const interceptor of this.requestInterceptors) {
        finalConfig = interceptor(finalConfig)
      }

      const result = await createApiClient(this.baseURL)(endpoint, finalConfig)

      // 应用响应拦截器
      let finalResult = result
      for (const interceptor of this.responseInterceptors) {
        finalResult = interceptor(finalResult)
      }

      return finalResult
    } catch (error) {
      // 应用错误拦截器
      for (const interceptor of this.errorInterceptors) {
        const handledError = interceptor(error as Error)
        if (handledError instanceof Promise) {
          await handledError
        }
      }
      throw error
    }
  }
}