import { type ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'
import StepNavigation from './StepNavigation'

interface ProjectLayoutProps {
  children: ReactNode
  currentStep?: number
  showSteps?: boolean
}

export default function ProjectLayout({ 
  children, 
  currentStep = 1,
  showSteps = true
}: ProjectLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {showSteps && (
            <div className="mb-8">
              <StepNavigation currentStep={currentStep} />
            </div>
          )}
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}