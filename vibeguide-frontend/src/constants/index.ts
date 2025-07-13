// 应用常量
export const APP_CONSTANTS = {
  APP_NAME: 'VibeGuide',
  VERSION: '0.0.0',
  
  // API 配置
  API_TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  
  // 分页配置
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // 动画时长
  ANIMATION_DURATION: {
    SHORT: 150,
    MEDIUM: 300,
    LONG: 500,
    EXTRA_LONG: 700,
  },
  
  // 缓动函数
  EASING: {
    EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)',
    EASE_OUT: 'cubic-bezier(0, 0, 0.2, 1)',
    EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    EASE_APPLE: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    EASE_BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    EASE_ELASTIC: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  
  // 存储键名
  STORAGE_KEYS: {
    THEME: 'vibeguide-theme',
    LANGUAGE: 'vibeguide-language',
    TUTORIAL_COMPLETED: 'vibeguide-tutorial-completed',
    PROJECTS: 'vibeguide-projects',
    USER_PREFERENCES: 'vibeguide-user-preferences',
  },
  
  // 路由路径
  ROUTES: {
    HOME: '/',
    CREATE: '/create',
    STEPPER_DEMO: '/stepper-demo',
    PROJECTS: '/projects',
    SETTINGS: '/settings',
    PROFILE: '/profile',
  },
  
  // 文件大小限制
  FILE_LIMITS: {
    MAX_UPLOAD_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx'],
  },
  
  // UI 配置
  UI: {
    SIDEBAR_WIDTH: 280,
    HEADER_HEIGHT: 64,
    FOOTER_HEIGHT: 80,
    BREAKPOINTS: {
      SM: 640,
      MD: 768,
      LG: 1024,
      XL: 1280,
      '2XL': 1536,
    },
  },
} as const

// 项目步骤配置
export const PROJECT_STEPS = [
  {
    id: 1,
    title: '项目描述',
    description: '详细描述您的项目需求和目标',
    icon: 'FileText',
  },
  {
    id: 2,
    title: '需求分析',
    description: 'AI智能分析并生成针对性问题',
    icon: 'Brain',
  },
  {
    id: 3,
    title: '文档生成',
    description: '生成完整的开发文档和指南',
    icon: 'FileCheck',
  },
] as const

// 通知类型配置
export const NOTIFICATION_TYPES = {
  INFO: {
    type: 'info' as const,
    icon: 'Info',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800',
    iconColor: 'text-blue-600',
  },
  SUCCESS: {
    type: 'success' as const,
    icon: 'CheckCircle',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-800',
    iconColor: 'text-green-600',
  },
  WARNING: {
    type: 'warning' as const,
    icon: 'AlertTriangle',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-800',
    iconColor: 'text-yellow-600',
  },
  ERROR: {
    type: 'error' as const,
    icon: 'AlertCircle',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-800',
    iconColor: 'text-red-600',
  },
} as const

// 默认配置
export const DEFAULT_CONFIGS = {
  PROJECT: {
    name: '新项目',
    description: '',
    requirements: '',
    status: 'draft' as const,
    documents: {
      userJourney: '',
      prd: '',
      frontendDesign: '',
      backendDesign: '',
      databaseDesign: '',
    },
    aiQuestions: [],
  },
  
  USER_SETTINGS: {
    theme: 'light' as const,
    language: 'zh-CN' as const,
    sidebarCollapsed: false,
    debugMode: false,
    autoSave: true,
    showTutorial: true,
  },
  
  NOTIFICATION: {
    duration: 5000,
    position: 'top-right' as const,
    showProgress: true,
    pauseOnHover: true,
  },
} as const

// 环境变量配置
export const ENV = {
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
  USE_REAL_AI: import.meta.env.VITE_USE_REAL_AI === 'true',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
} as const