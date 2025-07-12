import ProjectDescriptionForm from '@/components/forms/ProjectDescriptionForm'
import { useProjectForm } from '@/hooks/useProjectForm'
import { useInViewAnimation } from '@/hooks/useAnimations'
import { PageTransition } from '@/components/ui'

interface ProjectStep1Props {
  projectData: ReturnType<typeof useProjectForm>['projectData']
  updateDescription: ReturnType<typeof useProjectForm>['updateDescription']
  nextStep: ReturnType<typeof useProjectForm>['nextStep']
}

export default function ProjectStep1({ 
  projectData, 
  updateDescription, 
  nextStep 
}: ProjectStep1Props) {
  const { ref, isInView } = useInViewAnimation(0.3)
  
  return (
    <PageTransition>
      <div 
        ref={ref}
        className={`space-y-6 transition-all duration-700 ease-apple ${
          isInView 
            ? 'opacity-100 transform translate-y-0' 
            : 'opacity-0 transform translate-y-8'
        }`}
      >
        <ProjectDescriptionForm
          value={projectData.description}
          onChange={updateDescription}
          onNext={nextStep}
        />
      </div>
    </PageTransition>
  )
}