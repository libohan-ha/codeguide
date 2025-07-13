/**
 * 存储工具函数
 */

// 存储错误类
export class StorageError extends Error {
  public operation: string
  public key?: string

  constructor(message: string, operation: string, key?: string) {
    super(message)
    this.name = 'StorageError'
    this.operation = operation
    this.key = key
  }
}

// 通用存储接口
export interface Storage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
  clear(): void
  key(index: number): string | null
  readonly length: number
}

// 安全的 localStorage 操作
export const safeLocalStorage = {
  isAvailable(): boolean {
    try {
      const test = '__storage_test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  },

  get<T = any>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key)
      if (item === null) return defaultValue ?? null
      return JSON.parse(item)
    } catch (error) {
      console.error(`Failed to get item from localStorage: ${key}`, error)
      return defaultValue ?? null
    }
  },

  set<T = any>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Failed to set item in localStorage: ${key}`, error)
      return false
    }
  },

  remove(key: string): boolean {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Failed to remove item from localStorage: ${key}`, error)
      return false
    }
  },

  clear(): boolean {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('Failed to clear localStorage', error)
      return false
    }
  },

  keys(): string[] {
    try {
      return Object.keys(localStorage)
    } catch (error) {
      console.error('Failed to get localStorage keys', error)
      return []
    }
  },

  size(): number {
    try {
      return localStorage.length
    } catch (error) {
      console.error('Failed to get localStorage size', error)
      return 0
    }
  }
}

// 安全的 sessionStorage 操作
export const safeSessionStorage = {
  isAvailable(): boolean {
    try {
      const test = '__storage_test__'
      sessionStorage.setItem(test, test)
      sessionStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  },

  get<T = any>(key: string, defaultValue?: T): T | null {
    try {
      const item = sessionStorage.getItem(key)
      if (item === null) return defaultValue ?? null
      return JSON.parse(item)
    } catch (error) {
      console.error(`Failed to get item from sessionStorage: ${key}`, error)
      return defaultValue ?? null
    }
  },

  set<T = any>(key: string, value: T): boolean {
    try {
      sessionStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Failed to set item in sessionStorage: ${key}`, error)
      return false
    }
  },

  remove(key: string): boolean {
    try {
      sessionStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Failed to remove item from sessionStorage: ${key}`, error)
      return false
    }
  },

  clear(): boolean {
    try {
      sessionStorage.clear()
      return true
    } catch (error) {
      console.error('Failed to clear sessionStorage', error)
      return false
    }
  }
}

// 带过期时间的存储
export const createExpiringStorage = (storage: typeof safeLocalStorage) => {
  interface ExpiringItem<T> {
    value: T
    expiry: number
  }

  return {
    get<T = any>(key: string, defaultValue?: T): T | null {
      const item = storage.get<ExpiringItem<T>>(key)
      
      if (!item) return defaultValue ?? null
      
      if (Date.now() > item.expiry) {
        storage.remove(key)
        return defaultValue ?? null
      }
      
      return item.value
    },

    set<T = any>(key: string, value: T, ttlMs: number): boolean {
      const item: ExpiringItem<T> = {
        value,
        expiry: Date.now() + ttlMs
      }
      return storage.set(key, item)
    },

    remove(key: string): boolean {
      return storage.remove(key)
    },

    clear(): boolean {
      return storage.clear()
    }
  }
}

// Cookie 操作
export const cookies = {
  get(name: string): string | null {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop()?.split(';').shift() || '')
    }
    return null
  },

  set(
    name: string,
    value: string,
    options: {
      expires?: Date | number
      path?: string
      domain?: string
      secure?: boolean
      sameSite?: 'Strict' | 'Lax' | 'None'
    } = {}
  ): void {
    let cookieString = `${name}=${encodeURIComponent(value)}`

    if (options.expires) {
      if (typeof options.expires === 'number') {
        const date = new Date()
        date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000)
        cookieString += `; expires=${date.toUTCString()}`
      } else {
        cookieString += `; expires=${options.expires.toUTCString()}`
      }
    }

    if (options.path) cookieString += `; path=${options.path}`
    if (options.domain) cookieString += `; domain=${options.domain}`
    if (options.secure) cookieString += '; secure'
    if (options.sameSite) cookieString += `; samesite=${options.sameSite}`

    document.cookie = cookieString
  },

  remove(name: string, path: string = '/'): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`
  },

  getAll(): Record<string, string> {
    const cookies: Record<string, string> = {}
    document.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=')
      if (name && value) {
        cookies[name] = decodeURIComponent(value)
      }
    })
    return cookies
  }
}

// IndexedDB 封装
export class IndexedDBStorage {
  private dbName: string
  private version: number
  private db: IDBDatabase | null = null

  constructor(dbName: string, version: number = 1) {
    this.dbName = dbName
    this.version = version
  }

  async init(stores: Array<{ name: string; keyPath?: string; autoIncrement?: boolean }>): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(new StorageError('Failed to open IndexedDB', 'init'))

      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        
        stores.forEach(store => {
          if (!db.objectStoreNames.contains(store.name)) {
            db.createObjectStore(store.name, {
              keyPath: store.keyPath,
              autoIncrement: store.autoIncrement
            })
          }
        })
      }
    })
  }

  async get<T = any>(storeName: string, key: string): Promise<T | null> {
    if (!this.db) throw new StorageError('Database not initialized', 'get', key)

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.get(key)

      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(new StorageError('Failed to get item', 'get', key))
    })
  }

  async set<T = any>(storeName: string, key: string, value: T): Promise<void> {
    if (!this.db) throw new StorageError('Database not initialized', 'set', key)

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.put({ ...value, id: key })

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new StorageError('Failed to set item', 'set', key))
    })
  }

  async remove(storeName: string, key: string): Promise<void> {
    if (!this.db) throw new StorageError('Database not initialized', 'remove', key)

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.delete(key)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new StorageError('Failed to remove item', 'remove', key))
    })
  }

  async clear(storeName: string): Promise<void> {
    if (!this.db) throw new StorageError('Database not initialized', 'clear')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.clear()

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new StorageError('Failed to clear store', 'clear'))
    })
  }

  close(): void {
    if (this.db) {
      this.db.close()
      this.db = null
    }
  }
}

// 统一存储管理器
export const createStorageManager = () => {
  const localStorage = safeLocalStorage
  const sessionStorage = safeSessionStorage
  const expiringStorage = createExpiringStorage(localStorage)

  return {
    // 持久化存储
    persistent: localStorage,
    
    // 会话存储
    session: sessionStorage,
    
    // 过期存储
    expiring: expiringStorage,
    
    // Cookie
    cookies,
    
    // 自动选择存储方式
    auto: {
      get<T = any>(key: string, defaultValue?: T): T | null {
        return localStorage.get(key, defaultValue)
      },
      
      set<T = any>(key: string, value: T, persistent: boolean = true): boolean {
        if (persistent) {
          return localStorage.set(key, value)
        } else {
          return sessionStorage.set(key, value)
        }
      },
      
      remove(key: string): boolean {
        const localRemoved = localStorage.remove(key)
        const sessionRemoved = sessionStorage.remove(key)
        return localRemoved || sessionRemoved
      }
    }
  }
}

// 默认存储管理器实例
export const storage = createStorageManager()