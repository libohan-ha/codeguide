// 全局状态类型定义

export interface ProjectData {
  id?: string
  name: string
  description: string
  requirements: string
  aiQuestions: Array<{
    id: string
    question: string
    answer: string
    type: 'text' | 'choice' | 'number'
    options?: string[]
  }>
  documents: {
    userJourney: string
    prd: string
    frontendDesign: string
    backendDesign: string
    databaseDesign: string
  }
  createdAt?: string
  updatedAt?: string
  status: 'draft' | 'in_progress' | 'completed'
}

export interface UserData {
  id?: string
  name: string
  email: string
  avatar?: string
  preferences: {
    theme: 'light' | 'dark' | 'system'
    language: 'zh-CN' | 'en-US'
    notifications: {
      email: boolean
      push: boolean
      inApp: boolean
    }
  }
  subscription?: {
    plan: 'free' | 'pro' | 'enterprise'
    expiresAt?: string
    features: string[]
  }
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  language: 'zh-CN' | 'en-US'
  sidebarCollapsed: boolean
  debugMode: boolean
  autoSave: boolean
  showTutorial: boolean
}

export interface NotificationItem {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: string
  read?: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

export interface LoadingState {
  global: boolean
  projects: boolean
  documents: boolean
  aiGeneration: boolean
  saving: boolean
}

export interface ErrorState {
  global: string | null
  projects: string | null
  documents: string | null
  aiGeneration: string | null
  network: string | null
  saving: string | null
}

// API状态类型
export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
  timestamp: string
}

// 历史记录类型
export interface HistoryItem {
  id: string
  action: 'create' | 'update' | 'delete' | 'generate'
  target: 'project' | 'document' | 'requirement'
  targetId: string
  title: string
  timestamp: string
  data?: any
}