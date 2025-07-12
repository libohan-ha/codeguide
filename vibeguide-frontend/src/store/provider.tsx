import React, { createContext, useContext, type ReactNode } from 'react'
import { useAppStore } from './index'
import type { ProjectData } from '@/types/store'

// Store Context
interface StoreContextValue {
  quickActions: {
    showSuccess: (message: string) => void
    showError: (message: string) => void
    showInfo: (message: string) => void
    showWarning: (message: string) => void
    createNewProject: (projectData: Partial<ProjectData>) => void
    saveProject: () => Promise<void>
  }
}

const StoreContext = createContext<StoreContextValue | null>(null)

interface StoreProviderProps {
  children: ReactNode
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ 
  children 
}) => {
  const store = useAppStore()
  
  // 创建快捷操作
  const quickActions: StoreContextValue['quickActions'] = {
    showSuccess: (message: string) => {
      store.addNotification({
        type: 'success',
        title: '操作成功',
        message,
      })
    },
    
    showError: (message: string) => {
      store.addNotification({
        type: 'error',
        title: '操作失败',
        message,
      })
    },
    
    showInfo: (message: string) => {
      store.addNotification({
        type: 'info',
        title: '提示',
        message,
      })
    },
    
    showWarning: (message: string) => {
      store.addNotification({
        type: 'warning',
        title: '警告',
        message,
      })
    },
    
    createNewProject: (projectData: Partial<ProjectData>) => {
      const newProject: ProjectData = {
        id: `project-${Date.now()}`,
        name: projectData.name || '新项目',
        description: projectData.description || '',
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
        ...projectData,
      }
      
      store.addProject(newProject)
      quickActions.showSuccess(`项目 "${newProject.name}" 创建成功`)
    },
    
    saveProject: async () => {
      const currentProject = store.currentProject
      if (!currentProject) {
        quickActions.showError('没有要保存的项目')
        return
      }
      
      try {
        store.setLoading('saving', true)
        
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        store.updateProject(currentProject.id!, {
          ...currentProject,
          updatedAt: new Date().toISOString(),
        })
        
        quickActions.showSuccess('项目保存成功')
        
      } catch (error) {
        console.error('Save project failed:', error)
        quickActions.showError('保存项目失败，请重试')
      } finally {
        store.setLoading('saving', false)
      }
    },
  }
  
  const contextValue: StoreContextValue = {
    quickActions,
  }
  
  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  )
}

// Hook to use store context
export const useStoreContext = () => {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStoreContext must be used within a StoreProvider')
  }
  return context
}

// 便捷的hooks
export const useQuickActions = () => {
  const { quickActions } = useStoreContext()
  return quickActions
}

// 导出默认的Provider
export default StoreProvider