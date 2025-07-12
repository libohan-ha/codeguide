import { useProjectForm } from '@/hooks/useProjectForm'
import ProjectStep1 from '@/components/project/ProjectStep1'
import ProjectStep2 from '@/components/project/ProjectStep2'
import ProjectStep3 from '@/components/project/ProjectStep3'
import ProjectLayout from '@/components/layout/ProjectLayout'

export default function CreateProject() {
  const {
    projectData,
    currentStep,
    updateDescription,
    updateAiQuestions,
    updateDocuments,
    saveProject,
    nextStep,
    prevStep
  } = useProjectForm()

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProjectStep1
            projectData={projectData}
            updateDescription={updateDescription}
            nextStep={nextStep}
          />
        )
      case 2:
        return (
          <ProjectStep2
            projectData={projectData}
            updateAiQuestions={updateAiQuestions}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )
      case 3:
        return (
          <ProjectStep3
            projectData={projectData}
            updateDocuments={updateDocuments}
            saveProject={async () => {
              await saveProject()
            }}
            prevStep={prevStep}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-glass relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-primary opacity-5 rounded-full blur-3xl animate-floating" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-ocean opacity-5 rounded-full blur-3xl animate-floating-delayed" />
      </div>
      
      <ProjectLayout currentStep={currentStep}>
        <div className="space-y-8 relative z-10">
          <div className="animate-fade-in">
            {renderCurrentStep()}
          </div>
          
        </div>
      </ProjectLayout>
    </div>
  )
}