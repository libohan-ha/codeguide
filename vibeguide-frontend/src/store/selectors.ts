import { useAppStore } from './index'

// 基础选择器
export const useUser = () => useAppStore(state => state.user)
export const useIsAuthenticated = () => useAppStore(state => state.isAuthenticated)
export const useCurrentProject = () => useAppStore(state => state.currentProject)
export const useProjects = () => useAppStore(state => state.projects)
export const useCurrentStep = () => useAppStore(state => state.currentStep)
export const useSettings = () => useAppStore(state => state.settings)
export const useNotifications = () => useAppStore(state => state.notifications)
export const useLoading = () => useAppStore(state => state.loading)
export const useGlobalLoading = () => useAppStore(state => state.loading.global)
export const useProjectsLoading = () => useAppStore(state => state.loading.projects)
export const useErrors = () => useAppStore(state => state.errors)
export const useProjectsError = () => useAppStore(state => state.errors.projects)

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