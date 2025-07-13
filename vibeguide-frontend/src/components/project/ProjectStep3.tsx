import { lazy, Suspense } from 'react'
import { useProjectForm } from '@/hooks/useProjectForm'
import { LoadingSpinner } from '@/components/ui'

// 懒加载文档生成表单组件
const DocumentGenerationForm = lazy(() => import('@/components/forms/DocumentGenerationForm'))

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
      <Suspense fallback={
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      }>
        <DocumentGenerationForm
          projectData={projectData}
          onUpdateDocuments={updateDocuments}
          onSaveProject={saveProject}
          onBack={prevStep}
        />
      </Suspense>
    </div>
  )
}