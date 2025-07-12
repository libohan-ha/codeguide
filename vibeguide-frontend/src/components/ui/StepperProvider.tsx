import { createContext, useContext, useState, type ReactNode } from 'react'

interface StepperContextType {
  currentStep: string | number
  totalSteps: number
  goToStep: (step: string | number) => void
  nextStep: () => void
  prevStep: () => void
  canGoNext: boolean
  canGoPrev: boolean
}

const StepperContext = createContext<StepperContextType | undefined>(undefined)

interface StepperProviderProps {
  children: ReactNode
  initialStep?: string | number
  steps: (string | number)[]
  onStepChange?: (step: string | number) => void
}

export function StepperProvider({ 
  children, 
  initialStep, 
  steps,
  onStepChange 
}: StepperProviderProps) {
  const [currentStep, setCurrentStep] = useState(initialStep || steps[0])

  const currentIndex = steps.indexOf(currentStep)
  const totalSteps = steps.length

  const goToStep = (step: string | number) => {
    if (steps.includes(step)) {
      setCurrentStep(step)
      onStepChange?.(step)
    }
  }

  const nextStep = () => {
    const nextIndex = currentIndex + 1
    if (nextIndex < totalSteps) {
      const nextStep = steps[nextIndex]
      setCurrentStep(nextStep)
      onStepChange?.(nextStep)
    }
  }

  const prevStep = () => {
    const prevIndex = currentIndex - 1
    if (prevIndex >= 0) {
      const prevStep = steps[prevIndex]
      setCurrentStep(prevStep)
      onStepChange?.(prevStep)
    }
  }

  const canGoNext = currentIndex < totalSteps - 1
  const canGoPrev = currentIndex > 0

  return (
    <StepperContext.Provider value={{
      currentStep,
      totalSteps,
      goToStep,
      nextStep,
      prevStep,
      canGoNext,
      canGoPrev
    }}>
      {children}
    </StepperContext.Provider>
  )
}

export function useStepper() {
  const context = useContext(StepperContext)
  if (context === undefined) {
    throw new Error('useStepper must be used within a StepperProvider')
  }
  return context
}