import { useState, useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { Brain, MessageSquare, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LoadingSpinner } from '@/components/ui'
import { AIService, type AIQuestion } from '@/services/aiService'
import { useAppStore } from '@/store'

interface RequirementAnalysisFormProps {
  projectDescription: string
  onComplete: (answers: Array<{ id: string; question: string; answer: string }>) => void
  onBack: () => void
  className?: string
}

export default function RequirementAnalysisForm({
  projectDescription,
  onComplete,
  onBack,
  className
}: RequirementAnalysisFormProps) {
  const { 
    currentProject, 
    isLoading, 
    error, 
    updateProjectAiQuestions, 
    setLoading, 
    setError 
  } = useAppStore(
    useShallow(state => ({
      currentProject: state.currentProject,
      isLoading: state.loading.aiGeneration,
      error: state.errors.aiGeneration,
      updateProjectAiQuestions: state.updateProjectAiQuestions,
      setLoading: state.setLoading,
      setError: state.setError
    }))
  )

  const questions = currentProject?.aiQuestions || []
  // 使用本地 state 管理答案
  const [answers, setAnswers] = useState<Record<string, string>>({})
  
  useEffect(() => {
    // 组件挂载时，用store中已有的答案初始化本地answers state
    const initialAnswers: Record<string, string> = {}
    questions.forEach(q => {
      if (q.answer) {
        initialAnswers[q.id] = q.answer
      }
    })
    setAnswers(initialAnswers)

    // 仅当全局store中没有问题时，才去请求
    if (questions.length === 0) {
      generateQuestions()
    }
  }, [projectDescription]) // 依赖项保留projectDescription，在新项目开始时触发

  const generateQuestions = async () => {
    if (!projectDescription) {
      setError('aiGeneration', '项目描述不能为空。')
      return
    }
    
    try {
      setLoading('aiGeneration', true)
      setError('aiGeneration', null)
      
      const response = await AIService.generateQuestions({
        projectDescription
      })
      
      // AI返回的问题不包含answer字段，这里我们给它加上
      const questionsWithAnswerField = response.questions.map(q => ({ ...q, answer: '' }))
      
      updateProjectAiQuestions(questionsWithAnswerField)
      // 注意：analysis目前没有地方存储在全局状态，如果需要，要扩展store
    } catch (err) {
      setError('aiGeneration', '生成问题失败，请重试')
      console.error('Generate questions error:', err)
    } finally {
      setLoading('aiGeneration', false)
    }
  }

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const getRequiredAnswers = () => {
    return questions.filter(q => q.required).every(q => answers[q.id]?.trim())
  }

  const getAllAnswers = () => {
    return questions.map(q => ({
      id: q.id,
      question: q.question,
      answer: answers[q.id] || ''
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!getRequiredAnswers()) {
      setError('aiGeneration', '请回答所有必填问题')
      return
    }

    setLoading('saving', true)
    setError('aiGeneration', null)

    try {
      const answeredQuestions = getAllAnswers().filter(a => a.answer.trim())
      
      // 在提交完成时，把最终答案更新回全局store
      const finalQuestions = questions.map(q => ({
        ...q,
        answer: answers[q.id] || ''
      }))
      updateProjectAiQuestions(finalQuestions)
      
      onComplete(answeredQuestions)
    } catch (err) {
      setError('aiGeneration', '提交失败，请重试')
    } finally {
      setLoading('saving', false)
    }
  }

  const renderQuestion = (question: AIQuestion) => {
    const value = answers[question.id] || ''

    switch (question.type) {
      case 'text':
        return (
          <textarea
            value={value}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="请详细回答这个问题..."
            className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-900"
            required={question.required}
          />
        )

      case 'multiple_choice':
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  required={question.required}
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )

      case 'rating':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleAnswerChange(question.id, rating.toString())}
                  className={cn(
                    "w-10 h-10 rounded-full border-2 font-medium transition-colors",
                    value === rating.toString()
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-gray-300 text-gray-600 hover:border-blue-300"
                  )}
                >
                  {rating}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>简单</span>
              <span>复杂</span>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className={cn('max-w-4xl mx-auto', className)}>
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">AI正在分析您的项目</h2>
            <p className="text-gray-600 mb-6">基于您的项目描述，AI正在生成针对性的需求分析问题...</p>
            <LoadingSpinner size="lg" text="分析中，请稍候" />
          </div>
        </div>
      </div>
    )
  }

  if (error && questions.length === 0) {
    return (
      <div className={cn('max-w-4xl mx-auto', className)}>
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">生成问题失败</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={onBack}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                返回上一步
              </button>
              <button
                onClick={generateQuestions}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                重新生成
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('max-w-4xl mx-auto', className)}>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">深入需求分析</h2>
          </div>
          
          {/* AI分析目前没有存储在全局，暂时注释或使用本地state */}
          {/* {analysis && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-blue-900 mb-2">AI分析</h3>
              <p className="text-sm text-blue-800">{analysis}</p>
            </div>
          )} */}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {questions.map((question, index) => (
            <div key={question.id} className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-medium text-gray-600">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    {question.question}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {renderQuestion(question)}
                </div>
                {answers[question.id]?.trim() && (
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                )}
              </div>
            </div>
          ))}

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← 返回上一步
            </button>

            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                已回答 {Object.values(answers).filter(a => a.trim()).length} / {questions.length} 个问题
              </div>
              
              <button
                type="submit"
                disabled={!getRequiredAnswers() || isLoading}
                className={cn(
                  "flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all duration-200",
                  getRequiredAnswers() && !isLoading
                    ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                )}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    处理中...
                  </>
                ) : (
                  <>
                    下一步：生成文档
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}