import DocumentGenerationForm from '@/components/forms/DocumentGenerationForm'
import { useProjectForm } from '@/hooks/useProjectForm'

interface ProjectStep3Props {
  projectData: ReturnType<typeof useProjectForm>['projectData']
  updateDocuments: ReturnType<typeof useProjectForm>['updateDocuments']
  saveProject: () => Promise<void>
  prevStep: ReturnType<typeof useProjectForm>['prevStep']
}

export default function ProjectStep3({ 
  projectData, 
  updateDocuments,
  saveProject,
  prevStep
}: ProjectStep3Props) {
  return (
    <div className="space-y-6">
      <DocumentGenerationForm
        projectData={projectData}
        onUpdateDocuments={updateDocuments}
        onSaveProject={saveProject}
        onBack={prevStep}
      />
    </div>
  )
}