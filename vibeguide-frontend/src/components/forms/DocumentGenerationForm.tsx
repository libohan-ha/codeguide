import { useState, useEffect } from 'react'
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui'
import { DocumentService, documentTemplates } from '@/services/documentService'
import { type ProjectData } from '@/hooks/useProjectForm'
import DocumentTabs from '@/components/documents/DocumentTabs'
import { cn } from '@/lib/utils'

interface DocumentGenerationFormProps {
  projectData: ProjectData
  onUpdateDocuments: (documents: ProjectData['documents']) => void
  onSaveProject: () => Promise<void>
  onBack: () => void
  className?: string
}

export default function DocumentGenerationForm({
  projectData,
  onUpdateDocuments,
  onSaveProject,
  onBack,
  className
}: DocumentGenerationFormProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationComplete, setGenerationComplete] = useState(false)
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // 检查是否已有文档内容
  const hasDocuments = documentTemplates.some(template => 
    projectData.documents[template.id] && projectData.documents[template.id].length > 0
  )

  useEffect(() => {
    if (hasDocuments) {
      setGenerationComplete(true)
    } else {
      // 自动开始生成文档
      generateDocuments()
    }
  }, [])

  const generateDocuments = async () => {
    setIsGenerating(true)
    setError('')
    setGenerationComplete(false)

    try {
      const documents = await DocumentService.generateAllDocuments({
        projectDescription: projectData.description,
        aiQuestions: projectData.aiQuestions
      })

      onUpdateDocuments(documents)
      setGenerationComplete(true)
    } catch (err) {
      setError('文档生成失败，请重试')
      console.error('Document generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveProject = async () => {
    setIsSaving(true)
    try {
      await onSaveProject()
      // 保存成功的提示可以在这里处理
    } catch (err) {
      console.error('Save project error:', err)
      alert('保存项目失败，请重试')
    } finally {
      setIsSaving(false)
    }
  }

  const handleRegenerate = () => {
    generateDocuments()
  }

  if (isGenerating) {
    return (
      <div className={cn('max-w-4xl mx-auto', className)}>
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">AI正在生成开发文档</h2>
            <p className="text-gray-600 mb-8">
              基于您的项目描述和需求分析，AI正在生成完整的开发文档套件...
            </p>
            
            <div className="space-y-4 mb-8">
              <LoadingSpinner size="lg" text="正在生成文档，请稍候（约需要30秒）" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {documentTemplates.map((template) => (
                  <div key={template.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl">{template.icon}</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{template.title}</div>
                      <div className="text-xs text-gray-600">{template.description}</div>
                    </div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  </div>
                ))}
              </div>
            </div>

            <div className="text-sm text-gray-500">
              生成高质量的开发文档需要一些时间，请耐心等待...
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error && !generationComplete) {
    return (
      <div className={cn('max-w-4xl mx-auto', className)}>
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">文档生成失败</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={onBack}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                返回上一步
              </button>
              <button
                onClick={handleRegenerate}
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

  if (generationComplete) {
    return (
      <div className={cn('max-w-6xl mx-auto', className)}>
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">文档生成完成！</h2>
              <p className="text-gray-600">
                AI已为您生成了完整的开发文档套件，您可以预览、编辑和下载这些文档。
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← 返回上一步
            </button>
            
            <button
              onClick={handleRegenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4" />
              重新生成
            </button>
          </div>
        </div>

        <DocumentTabs
          documents={projectData.documents}
          onSaveProject={handleSaveProject}
          isSaving={isSaving}
        />
      </div>
    )
  }

  return null
}