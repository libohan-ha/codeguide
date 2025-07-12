import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useStepper } from './StepperProvider'
import { cn } from '@/lib/utils'

interface StepperControlsProps {
  className?: string
  nextLabel?: string
  prevLabel?: string
  showStepNumbers?: boolean
  onNext?: () => void | Promise<void>
  onPrev?: () => void | Promise<void>
  nextDisabled?: boolean
  prevDisabled?: boolean
}

export default function StepperControls({
  className,
  nextLabel = '下一步',
  prevLabel = '上一步',
  showStepNumbers = true,
  onNext,
  onPrev,
  nextDisabled = false,
  prevDisabled = false
}: StepperControlsProps) {
  const { currentStep, totalSteps, nextStep, prevStep, canGoNext, canGoPrev } = useStepper()

  const handleNext = async () => {
    if (onNext) {
      await onNext()
    } else {
      nextStep()
    }
  }

  const handlePrev = async () => {
    if (onPrev) {
      await onPrev()
    } else {
      prevStep()
    }
  }

  const getCurrentStepNumber = () => {
    if (typeof currentStep === 'number') return currentStep
    return 1 // fallback
  }

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <button
        onClick={handlePrev}
        disabled={!canGoPrev || prevDisabled}
        className={cn(
          "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
          canGoPrev && !prevDisabled
            ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            : "text-gray-400 cursor-not-allowed"
        )}
      >
        <ChevronLeft className="w-4 h-4" />
        {prevLabel}
      </button>

      {showStepNumbers && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>第 {getCurrentStepNumber()} 步</span>
          <span className="text-gray-400">共 {totalSteps} 步</span>
        </div>
      )}

      <button
        onClick={handleNext}
        disabled={!canGoNext || nextDisabled}
        className={cn(
          "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
          canGoNext && !nextDisabled
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        )}
      >
        {nextLabel}
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}