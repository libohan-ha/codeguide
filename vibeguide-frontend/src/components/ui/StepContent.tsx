import { type ReactNode } from 'react'
import { useStepper } from './StepperProvider'
import { cn } from '@/lib/utils'

interface StepContentProps {
  step: string | number
  children: ReactNode
  className?: string
}

export default function StepContent({ step, children, className }: StepContentProps) {
  const { currentStep } = useStepper()

  if (currentStep !== step) {
    return null
  }

  return (
    <div className={cn("w-full", className)}>
      {children}
    </div>
  )
}