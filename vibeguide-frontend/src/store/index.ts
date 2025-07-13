import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { ProjectData, UserData, AppSettings, NotificationItem } from '@/types/store'

// 简化的状态接口
interface AppState {
  // 用户相关
  user: UserData | null
  isAuthenticated: boolean
  
  // 项目相关
  currentProject: ProjectData | null
  projects: ProjectData[]
  currentStep: number
  
  // 应用设置
  settings: AppSettings
  
  // 通知
  notifications: NotificationItem[]
  
  // 加载状态
  loading: {
    global: boolean
    projects: boolean
    documents: boolean
    aiGeneration: boolean
    saving: boolean
  }
  
  // 错误状态
  errors: {
    global: string | null
    projects: string | null
    documents: string | null
    aiGeneration: string | null
    network: string | null
    saving: string | null
  }
}

// 操作接口
interface AppActions {
  // 项目操作
  setCurrentProject: (project: ProjectData | null) => void
  addProject: (project: ProjectData) => void
  updateProject: (id: string, updates: Partial<ProjectData>) => void
  setCurrentStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  
  // 项目数据更新
  updateProjectDescription: (description: string) => void
  updateProjectRequirements: (requirements: string) => void
  updateProjectAiQuestions: (questions: ProjectData['aiQuestions']) => void
  updateProjectDocuments: (documents: Partial<ProjectData['documents']>) => void
  
  // 通知操作
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
  
  // 加载状态
  setLoading: (key: keyof AppState['loading'], loading: boolean) => void
  
  // 错误状态
  setError: (key: keyof AppState['errors'], error: string | null) => void
  clearError: (key: keyof AppState['errors']) => void
}

type AppStore = AppState & AppActions

// 默认设置
const defaultSettings: AppSettings = {
  theme: 'system',
  language: 'zh-CN',
  sidebarCollapsed: false,
  debugMode: false,
  autoSave: true,
  showTutorial: true,
}

// 创建store
export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      immer((set) => ({
        // 初始状态
        user: null,
        isAuthenticated: false,
        currentProject: null,
        projects: [],
        currentStep: 1,
        settings: defaultSettings,
        notifications: [],
        loading: {
          global: false,
          projects: false,
          documents: false,
          aiGeneration: false,
          saving: false,
        },
        errors: {
          global: null,
          projects: null,
          documents: null,
          aiGeneration: null,
          network: null,
          saving: null,
        },

        // 项目操作
        setCurrentProject: (project) => set((state) => {
          state.currentProject = project
          if (project) {
            state.currentStep = 1
          }
        }),

        addProject: (project) => set((state) => {
          const newProject = {
            ...project,
            id: project.id || `project-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          state.projects.push(newProject)
          state.currentProject = newProject
        }),

        updateProject: (id, updates) => set((state) => {
          const projectIndex = state.projects.findIndex(p => p.id === id)
          if (projectIndex !== -1) {
            Object.assign(state.projects[projectIndex], {
              ...updates,
              updatedAt: new Date().toISOString(),
            })
            if (state.currentProject?.id === id) {
              Object.assign(state.currentProject, state.projects[projectIndex])
            }
          }
        }),

        setCurrentStep: (step) => set((state) => {
          state.currentStep = step
        }),

        nextStep: () => set((state) => {
          if (state.currentStep < 3) {
            state.currentStep += 1
          }
        }),

        prevStep: () => set((state) => {
          if (state.currentStep > 1) {
            state.currentStep -= 1
          }
        }),

        goToStep: (step) => set((state) => {
          if (step >= 1 && step <= 3) {
            state.currentStep = step
          }
        }),

        // 项目数据更新
        updateProjectDescription: (description) => set((state) => {
          console.log('Store: updateProjectDescription called with:', description)
          console.log('Store: currentProject exists:', !!state.currentProject)
          
          if (state.currentProject) {
            state.currentProject.description = description
            state.currentProject.updatedAt = new Date().toISOString()
            console.log('Store: Updated existing project description to:', state.currentProject.description)
          } else {
            // 如果没有当前项目，创建一个新项目
            const newProject: ProjectData = {
              id: `project-${Date.now()}`,
              name: '新项目',
              description,
              requirements: '',
              aiQuestions: [],
              documents: {
                userJourney: '',
                prd: '',
                frontendDesign: '',
                backendDesign: '',
                databaseDesign: '',
              },
              status: 'draft',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
            state.currentProject = newProject
            state.projects.push(newProject)
            console.log('Store: Created new project with description:', newProject.description)
          }
        }),

        updateProjectRequirements: (requirements) => set((state) => {
          if (state.currentProject) {
            state.currentProject.requirements = requirements
            state.currentProject.updatedAt = new Date().toISOString()
          }
        }),

        updateProjectAiQuestions: (questions) => set((state) => {
          if (state.currentProject) {
            state.currentProject.aiQuestions = questions
            state.currentProject.updatedAt = new Date().toISOString()
          }
        }),

        updateProjectDocuments: (documents) => set((state) => {
          if (state.currentProject) {
            Object.assign(state.currentProject.documents, documents)
            state.currentProject.updatedAt = new Date().toISOString()
          }
        }),

        // 通知操作
        addNotification: (notification) => set((state) => {
          const newNotification: NotificationItem = {
            ...notification,
            id: `notification-${Date.now()}`,
            timestamp: new Date().toISOString(),
            read: false,
          }
          state.notifications.unshift(newNotification)
        }),

        removeNotification: (id) => set((state) => {
          state.notifications = state.notifications.filter(n => n.id !== id)
        }),

        clearNotifications: () => set((state) => {
          state.notifications = []
        }),

        // 加载状态
        setLoading: (key, loading) => set((state) => {
          state.loading[key] = loading
        }),

        // 错误状态
        setError: (key, error) => set((state) => {
          state.errors[key] = error
        }),

        clearError: (key) => set((state) => {
          state.errors[key] = null
        }),
      })),
      {
        name: 'vibeguide-app-store',
        partialize: (state) => ({
          projects: state.projects,
          settings: state.settings,
        }),
      }
    ),
    {
      name: 'vibeguide-store',
    }
  )
)

export type { AppStore, ProjectData, UserData, AppSettings, NotificationItem }