import { useShallow } from 'zustand/react/shallow'
import { useAppStore } from './index'

// 优化的基础选择器 - 使用浅比较避免不必要的重渲染
export const useUser = () => useAppStore(state => state.user)
export const useIsAuthenticated = () => useAppStore(state => state.isAuthenticated)
export const useCurrentProject = () => useAppStore(state => state.currentProject)
export const useProjects = () => useAppStore(useShallow(state => state.projects))
export const useCurrentStep = () => useAppStore(state => state.currentStep)
export const useSettings = () => useAppStore(useShallow(state => state.settings))
export const useNotifications = () => useAppStore(useShallow(state => state.notifications))

// 加载状态选择器 - 更细粒度的选择器
export const useLoading = () => useAppStore(useShallow(state => state.loading))
export const useGlobalLoading = () => useAppStore(state => state.loading.global)
export const useProjectsLoading = () => useAppStore(state => state.loading.projects)
export const useAiLoading = () => useAppStore(state => state.loading.aiGeneration)
export const useDocumentsLoading = () => useAppStore(state => state.loading.documents)
export const useSavingLoading = () => useAppStore(state => state.loading.saving)

// 错误状态选择器 - 更细粒度的选择器
export const useErrors = () => useAppStore(useShallow(state => state.errors))
export const useProjectsError = () => useAppStore(state => state.errors.projects)
export const useAiError = () => useAppStore(state => state.errors.aiGeneration)
export const useDocumentsError = () => useAppStore(state => state.errors.documents)
export const useSavingError = () => useAppStore(state => state.errors.saving)

// 组合选择器 - 减少组件中的多次选择器调用
export const useProjectState = () => useAppStore(useShallow(state => ({
  currentProject: state.currentProject,
  currentStep: state.currentStep,
  isLoading: state.loading.projects,
  error: state.errors.projects
})))

export const useAiState = () => useAppStore(useShallow(state => ({
  isLoading: state.loading.aiGeneration,
  error: state.errors.aiGeneration
})))

export const useDocumentState = () => useAppStore(useShallow(state => ({
  isLoading: state.loading.documents,
  error: state.errors.documents
})))

// 使用传统方式获取actions，避免Zustand选择器问题
export const useStoreActions = () => {
  const store = useAppStore()
  return {
    updateProjectDescription: store.updateProjectDescription,
    updateProjectRequirements: store.updateProjectRequirements,
    updateProjectAiQuestions: store.updateProjectAiQuestions,
    updateProjectDocuments: store.updateProjectDocuments,
    setCurrentStep: store.setCurrentStep,
    nextStep: store.nextStep,
    prevStep: store.prevStep,
    goToStep: store.goToStep,
    clearError: store.clearError,
    addProject: store.addProject,
    updateProject: store.updateProject,
    setCurrentProject: store.setCurrentProject,
    addNotification: store.addNotification,
    removeNotification: store.removeNotification,
    clearNotifications: store.clearNotifications,
    setLoading: store.setLoading,
    setError: store.setError
  }
}