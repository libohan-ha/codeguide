import { useState } from 'react'
import { AlertCircle, Lightbulb, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ModernCard, ModernButton } from '@/components/ui'

interface ProjectDescriptionFormProps {
  value: string
  onChange: (value: string) => void
  onNext: () => void
  className?: string
}

export default function ProjectDescriptionForm({
  value,
  onChange,
  onNext,
  className
}: ProjectDescriptionFormProps) {
  const [error, setError] = useState('')

  const minLength = 20
  const isValid = value.length >= minLength
  const charCount = value.length

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isValid) {
      setError(`项目描述至少需要${minLength}个字符，当前只有${charCount}个字符`)
      return
    }
    
    setError('')
    onNext()
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    console.log('ProjectDescriptionForm: Input changed to:', newValue)
    onChange(newValue)
    
    if (error && newValue.length >= minLength) {
      setError('')
    }
  }

  const handlePromptClick = () => {
    const examplePrompt = "我想开发一个创新的在线学习平台，专注于IT领域的互动式编程教育。核心功能包括：1. 根据用户的学习路径和进度，智能推荐课程和练习题。2. 提供一个内嵌在网页中的真实编程环境（类似于VS Code），支持多种主流编程语言，如Python, JavaScript, Java等。3. 引入游戏化学习机制，用户可以通过完成挑战、获得成就来提升等级，并解锁更高级的课程。4. 建立一个活跃的社区，用户可以在其中提问、分享项目、并参与技术讨论。目标用户是初学者和希望提升技能的在职开发者。"
    onChange(examplePrompt)
  }

  return (
    <div className={cn('max-w-4xl mx-auto', className)}>
      <ModernCard variant="glass" size="lg" shadow="apple" className="animate-fade-in">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-apple">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">描述您的项目</h2>
          </div>
          <p className="text-lg text-gray-600 opacity-90 leading-relaxed">
            请详细描述您想要开发的项目，包括主要功能、目标用户和预期效果。描述越详细，AI生成的文档就越精准。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              项目描述 <span className="text-red-500">*</span>
            </label>
            
            <div className="relative">
              <textarea
                value={value}
                onChange={handleChange}
                placeholder="例如：我想开发一个在线图书管理系统，用户可以浏览图书、借阅图书、管理个人借阅记录。管理员可以管理图书信息、用户信息和借阅记录..."
                className={cn(
                  "w-full h-48 p-6 glass border border-white/20 rounded-xl resize-none",
                  "focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 ease-apple",
                  "placeholder:text-gray-400 text-gray-900 backdrop-blur-sm",
                  "transform-gpu hover:shadow-apple",
                  "!text-gray-900 dark:!text-gray-100",
                  error ? "border-danger-300 bg-danger-50/50" : ""
                )}
                maxLength={2000}
              />
              
              <div className="absolute bottom-4 right-4 flex items-center gap-3">
                <span className={cn(
                  "text-sm font-medium px-3 py-1 rounded-full transition-all duration-300",
                  isValid 
                    ? "text-success-600 bg-success-100/80 backdrop-blur-sm" 
                    : charCount > 0 
                      ? "text-warning-600 bg-warning-100/80 backdrop-blur-sm" 
                      : "text-gray-400 bg-gray-100/80 backdrop-blur-sm"
                )}>
                  {charCount}/{minLength}+
                </span>
                {isValid && (
                  <div className="w-6 h-6 bg-success-500 rounded-full flex items-center justify-center shadow-sm animate-scale-in">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 mt-3 p-3 bg-danger-50/80 border border-danger-200 rounded-lg backdrop-blur-sm animate-fade-in">
                <AlertCircle className="w-5 h-5 text-danger-500" />
                <span className="text-sm text-danger-700 font-medium">{error}</span>
              </div>
            )}

            <div className="mt-3 flex items-center justify-between">
              <button 
                type="button" 
                onClick={handlePromptClick}
                className="flex items-center gap-2 rounded-lg p-2 transition-all duration-200 ease-apple hover:bg-primary-50/80 active:scale-95"
              >
                <Lightbulb className="w-5 h-5 text-primary-600" />
                <span className="text-sm text-primary-600 font-medium">写作提示</span>
              </button>
              
              <div className="text-xs text-gray-500">
                最多2000字符
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              第 1 步，共 3 步
            </div>
            
            <ModernButton
              type="submit"
              disabled={!isValid}
              variant="primary"
              gradient
              glow
              size="lg"
              className="px-8"
            >
              下一步：深入需求
            </ModernButton>
          </div>
        </form>
      </ModernCard>
    </div>
  )
}