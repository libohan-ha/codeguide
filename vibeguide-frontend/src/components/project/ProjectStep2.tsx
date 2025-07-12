import RequirementAnalysisForm from '@/components/forms/RequirementAnalysisForm'
import { useProjectForm } from '@/hooks/useProjectForm'

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
    // 转换为期望的格式，添加默认type
    const formattedAnswers = answers.map(answer => ({
      ...answer,
      type: 'text' as const,
      options: undefined
    }))
    updateAiQuestions(formattedAnswers)
    nextStep()
  }

  return (
    <div className="space-y-6">
      <RequirementAnalysisForm
        projectDescription={projectData.description}
        onComplete={handleComplete}
        onBack={prevStep}
      />
    </div>
  )
}