import { lazy, Suspense } from 'react'
import { useProjectForm } from '@/hooks/useProjectForm'
import { LoadingSpinner } from '@/components/ui'

// 懒加载复杂表单组件
const RequirementAnalysisForm = lazy(() => import('@/components/forms/RequirementAnalysisForm'))

interface ProjectStep2Props {
  projectData: ReturnType<typeof useProjectForm>['projectData']
  updateAiQuestions: ReturnType<typeof useProjectForm>['updateAiQuestions']
  nextStep: ReturnType<typeof useProjectForm>['nextStep']
  prevStep: ReturnType<typeof useProjectForm>['prevStep']
}

export default function ProjectStep2({ 
  projectData, 
  updateAiQuestions,
  nextStep,
  prevStep
}: ProjectStep2Props) {
  const handleComplete = (answers: Array<{ id: string; question: string; answer: string }>) => {
    // 转换为期望的格式，添加默认type和required
    const formattedAnswers = answers.map(answer => ({
      ...answer,
      type: 'text' as const,
      options: undefined,
      required: false
    }))
    updateAiQuestions(formattedAnswers)
    nextStep()
  }

  return (
    <div className="space-y-6">
      <Suspense fallback={
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      }>
        <RequirementAnalysisForm
          projectDescription={projectData.description}
          onComplete={handleComplete}
          onBack={prevStep}
        />
      </Suspense>
    </div>
  )
}