import { useCallback, useEffect } from 'react'
import { 
  useCurrentProject, 
  useCurrentStep, 
  useProjectsLoading,
  useProjectsError,
  useStoreActions 
} from '@/store/selectors'
import { useQuickActions } from '@/store/provider'
import type { ProjectData } from '@/types/store'

// 重新导出 ProjectData 以便向后兼容
export type { ProjectData }

export function useProjectForm() {
  // 使用全局状态
  const projectData = useCurrentProject()
  const currentStep = useCurrentStep()
  const isLoading = useProjectsLoading()
  const error = useProjectsError()
  
  // 获取store操作
  const {
    updateProjectDescription,
    updateProjectRequirements, 
    updateProjectAiQuestions,
    updateProjectDocuments,
    setCurrentStep: setStep,
    nextStep: next,
    prevStep: prev,
    goToStep: goTo,
    clearError,
    setCurrentProject
  } = useStoreActions()
  
  const { saveProject: quickSaveProject, createNewProject } = useQuickActions()
  
  // 如果没有当前项目，创建一个默认项目
  useEffect(() => {
    if (!projectData) {
      const defaultProject: ProjectData = {
        id: `project-${Date.now()}`,
        name: '新项目',
        description: '',
        requirements: '',
        aiQuestions: [],
        documents: {
          userJourney: '',
          prd: '',
          frontendDesign: '',
          backendDesign: '',
          databaseDesign: ''
        },
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      setCurrentProject(defaultProject)
    }
  }, [projectData, setCurrentProject])

  const updateDescription = useCallback((description: string) => {
    console.log('useProjectForm: updateDescription called with:', description)
    updateProjectDescription(description)
  }, [updateProjectDescription])

  const updateRequirements = useCallback((requirements: string) => {
    updateProjectRequirements(requirements)
  }, [updateProjectRequirements])

  const updateAiQuestions = useCallback((aiQuestions: ProjectData['aiQuestions']) => {
    updateProjectAiQuestions(aiQuestions)
  }, [updateProjectAiQuestions])

  const updateDocuments = useCallback((documents: Partial<ProjectData['documents']>) => {
    updateProjectDocuments(documents)
  }, [updateProjectDocuments])

  const nextStep = useCallback(() => {
    next()
  }, [next])

  const prevStep = useCallback(() => {
    prev()
  }, [prev])

  const goToStep = useCallback((step: number) => {
    goTo(step)
  }, [goTo])

  const resetForm = useCallback(() => {
    // 创建新项目或清除当前项目
    createNewProject({
      name: '新项目',
      description: '',
      requirements: '',
    })
    setStep(1)
    clearError('projects')
  }, [createNewProject, setStep, clearError])

  const saveProject = useCallback(async () => {
    return quickSaveProject()
  }, [quickSaveProject])

  const canProceedToStep = useCallback((step: number): boolean => {
    if (!projectData) return false
    
    switch (step) {
      case 1:
        return true
      case 2:
        return projectData.description.length >= 20
      case 3:
        return projectData.description.length >= 20 && projectData.aiQuestions.length > 0
      default:
        return false
    }
  }, [projectData])

  // 确保有默认项目数据
  const safeProjectData = projectData || {
    id: '',
    name: '',
    description: '',
    requirements: '',
    aiQuestions: [],
    documents: {
      userJourney: '',
      prd: '',
      frontendDesign: '',
      backendDesign: '',
      databaseDesign: ''
    },
    status: 'draft' as const,
    createdAt: '',
    updatedAt: ''
  }

  return {
    projectData: safeProjectData,
    currentStep,
    isLoading,
    error,
    updateDescription,
    updateRequirements,
    updateAiQuestions,
    updateDocuments,
    nextStep,
    prevStep,
    goToStep,
    resetForm,
    saveProject,
    canProceedToStep
  }
}