import { type ReactNode } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface StepItem {
  id: string | number
  title: string
  description?: string
  icon?: ReactNode
  status?: 'pending' | 'current' | 'completed' | 'error'
}

interface StepperProps {
  steps: StepItem[]
  currentStep: string | number
  orientation?: 'horizontal' | 'vertical'
  variant?: 'default' | 'minimal' | 'numbered'
  className?: string
  onStepClick?: (stepId: string | number) => void
  allowClickNavigation?: boolean
}

export default function Stepper({
  steps,
  currentStep,
  orientation = 'horizontal',
  variant = 'default',
  className,
  onStepClick,
  allowClickNavigation = false
}: StepperProps) {
  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentStep)
  }

  const getStepStatus = (step: StepItem, index: number): StepItem['status'] => {
    if (step.status) return step.status
    
    const currentIndex = getCurrentStepIndex()
    if (index < currentIndex) return 'completed'
    if (index === currentIndex) return 'current'
    return 'pending'
  }

  const handleStepClick = (stepId: string | number) => {
    if (allowClickNavigation && onStepClick) {
      onStepClick(stepId)
    }
  }

  const renderStepIndicator = (step: StepItem, status: StepItem['status']) => {
    const baseClasses = "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200"
    
    const statusClasses = {
      completed: "bg-blue-600 border-blue-600 text-white",
      current: "border-blue-600 text-blue-600 bg-blue-50",
      pending: "border-gray-300 text-gray-400 bg-white",
      error: "border-red-600 text-red-600 bg-red-50"
    }

    const sizeClasses = variant === 'minimal' ? 'w-6 h-6' : 'w-8 h-8'
    const currentStatus = status || 'pending'

    return (
      <div className={cn(baseClasses, statusClasses[currentStatus], sizeClasses)}>
        {currentStatus === 'completed' ? (
          <Check className="w-4 h-4" />
        ) : step.icon ? (
          step.icon
        ) : variant === 'numbered' ? (
          <span className="text-sm font-semibold">{step.id}</span>
        ) : (
          <div className={cn(
            "w-2 h-2 rounded-full",
            currentStatus === 'current' ? "bg-blue-600" : 
            currentStatus === 'pending' ? "bg-gray-300" : "bg-white"
          )} />
        )}
      </div>
    )
  }

  const renderStepContent = (step: StepItem, status: StepItem['status']) => {
    if (variant === 'minimal') return null

    const currentStatus = status || 'pending'

    return (
      <div className={cn(
        "ml-3",
        orientation === 'vertical' && "pb-4"
      )}>
        <div className={cn(
          "text-sm font-medium transition-colors",
          currentStatus === 'current' || currentStatus === 'completed' ? "text-gray-900" : "text-gray-400"
        )}>
          {step.title}
        </div>
        {step.description && (
          <div className={cn(
            "text-xs mt-1 transition-colors",
            currentStatus === 'current' || currentStatus === 'completed' ? "text-gray-600" : "text-gray-400"
          )}>
            {step.description}
          </div>
        )}
      </div>
    )
  }

  const renderConnector = (index: number, status: StepItem['status']) => {
    if (index === steps.length - 1) return null

    const currentStatus = status || 'pending'
    const isCompleted = currentStatus === 'completed'
    
    if (orientation === 'horizontal') {
      return (
        <div className={cn(
          "flex-1 h-0.5 mx-4 transition-colors duration-200",
          isCompleted ? "bg-blue-600" : "bg-gray-300"
        )} />
      )
    } else {
      return (
        <div className={cn(
          "w-0.5 h-8 ml-4 transition-colors duration-200",
          isCompleted ? "bg-blue-600" : "bg-gray-300"
        )} />
      )
    }
  }

  if (orientation === 'horizontal') {
    return (
      <div className={cn("w-full", className)}>
        <nav className="flex items-center">
          {steps.map((step, index) => {
            const status = getStepStatus(step, index)
            
            return (
              <div key={step.id} className="flex items-center flex-1 last:flex-none">
                <div 
                  className={cn(
                    "flex items-center",
                    allowClickNavigation && "cursor-pointer hover:opacity-80"
                  )}
                  onClick={() => handleStepClick(step.id)}
                >
                  {renderStepIndicator(step, status)}
                  {renderStepContent(step, status)}
                </div>
                {renderConnector(index, status)}
              </div>
            )
          })}
        </nav>
      </div>
    )
  }

  return (
    <div className={cn("w-full", className)}>
      <nav className="flex flex-col">
        {steps.map((step, index) => {
          const status = getStepStatus(step, index)
          
          return (
            <div key={step.id}>
              <div 
                className={cn(
                  "flex items-start",
                  allowClickNavigation && "cursor-pointer hover:opacity-80"
                )}
                onClick={() => handleStepClick(step.id)}
              >
                {renderStepIndicator(step, status)}
                {renderStepContent(step, status)}
              </div>
              {renderConnector(index, status)}
            </div>
          )
        })}
      </nav>
    </div>
  )
}