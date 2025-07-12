import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Step {
  id: number
  title: string
  description: string
}

const steps: Step[] = [
  {
    id: 1,
    title: '描述项目',
    description: '详细描述您的项目想法'
  },
  {
    id: 2,
    title: '深入需求',
    description: 'AI分析并提出针对性问题'
  },
  {
    id: 3,
    title: '创建文档',
    description: '生成完整的开发文档'
  }
]

interface StepNavigationProps {
  currentStep: number
}

export default function StepNavigation({ currentStep }: StepNavigationProps) {
  return (
    <div className="w-full">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4 animate-fade-in">创建新项目</h1>
        <p className="text-lg text-gray-600 opacity-80 animate-fade-in-delay">使用AI Agent 辅助您完成专业的项目需求分析</p>
      </div>
      
      <nav className="flex items-center justify-between relative">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex items-center group">
              <div
                className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-full transition-all duration-500 ease-apple transform-gpu",
                  "hover:scale-110 hover:shadow-apple",
                  currentStep > step.id
                    ? "bg-gradient-primary text-white shadow-apple animate-scale-in"
                    : currentStep === step.id
                    ? "bg-gradient-glass border-2 border-primary-500 text-primary-600 shadow-apple animate-breathing"
                    : "bg-white/50 border-2 border-gray-300 text-gray-400 backdrop-blur-sm"
                )}
              >
                {currentStep > step.id ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-semibold">{step.id}</span>
                )}
              </div>
              <div className="ml-6">
                <div
                  className={cn(
                    "text-base font-semibold transition-all duration-300",
                    currentStep >= step.id 
                      ? "text-gray-900 group-hover:text-primary-600" 
                      : "text-gray-400"
                  )}
                >
                  {step.title}
                </div>
                <div
                  className={cn(
                    "text-sm transition-all duration-300",
                    currentStep >= step.id 
                      ? "text-gray-600 group-hover:text-gray-700" 
                      : "text-gray-400"
                  )}
                >
                  {step.description}
                </div>
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <div className="flex-1 mx-8 relative">
                <div
                  className={cn(
                    "h-1 rounded-full transition-all duration-500 ease-apple",
                    currentStep > step.id 
                      ? "bg-gradient-primary shadow-sm" 
                      : "bg-gray-200"
                  )}
                />
                {currentStep > step.id && (
                  <div className="absolute inset-0 bg-gradient-primary rounded-full opacity-50 blur-sm animate-pulse" />
                )}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  )
}