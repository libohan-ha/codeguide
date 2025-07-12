import { useState } from 'react'
import { Download, Package, Save, Loader2 } from 'lucide-react'
import { documentTemplates, type DocumentTemplate } from '@/services/documentService'
import { type ProjectData } from '@/hooks/useProjectForm'
import DocumentViewer from './DocumentViewer'
import { cn } from '@/lib/utils'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'

interface DocumentTabsProps {
  documents: ProjectData['documents']
  onSaveProject: () => Promise<void>
  isSaving?: boolean
  className?: string
}

export default function DocumentTabs({
  documents,
  onSaveProject,
  isSaving = false,
  className
}: DocumentTabsProps) {
  const [activeTab, setActiveTab] = useState<DocumentTemplate['id']>('userJourney')

  const getDocumentContent = (docId: DocumentTemplate['id']): string => {
    return documents[docId] || '文档生成中...'
  }

  const getCurrentTemplate = () => {
    return documentTemplates.find(t => t.id === activeTab)!
  }

  const handleDownloadSingle = (docId: DocumentTemplate['id']) => {
    const template = documentTemplates.find(t => t.id === docId)!
    const content = documents[docId]
    
    if (!content) {
      alert('文档内容为空，无法下载')
      return
    }

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
    saveAs(blob, `${template.title}.md`)
  }

  const handleDownloadAll = async () => {
    const zip = new JSZip()
    
    // 添加所有文档到ZIP
    documentTemplates.forEach(template => {
      const content = documents[template.id]
      if (content) {
        zip.file(`${template.title}.md`, content)
      }
    })

    // 生成并下载ZIP文件
    try {
      const blob = await zip.generateAsync({ type: 'blob' })
      saveAs(blob, 'project-documents.zip')
    } catch (error) {
      console.error('Failed to generate ZIP:', error)
      alert('下载失败，请重试')
    }
  }

  const allDocumentsGenerated = documentTemplates.every(template => 
    documents[template.id] && documents[template.id].length > 0
  )

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 overflow-hidden', className)}>
      {/* Header with Actions */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-900">生成的开发文档</h2>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadAll}
            disabled={!allDocumentsGenerated}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              allDocumentsGenerated
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            )}
          >
            <Package className="w-4 h-4" />
            批量下载ZIP
          </button>

          <button
            onClick={onSaveProject}
            disabled={isSaving}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                保存项目
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto border-b border-gray-200 bg-gray-50">
        {documentTemplates.map((template) => {
          const hasContent = documents[template.id] && documents[template.id].length > 0
          
          return (
            <button
              key={template.id}
              onClick={() => setActiveTab(template.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                activeTab === template.id
                  ? "border-blue-500 text-blue-600 bg-white"
                  : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              )}
            >
              <span className="text-lg">{template.icon}</span>
              <span>{template.title}</span>
              {hasContent && (
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              )}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="p-4">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{getCurrentTemplate().title}</h3>
              <p className="text-sm text-gray-600">{getCurrentTemplate().description}</p>
            </div>
            
            <button
              onClick={() => handleDownloadSingle(activeTab)}
              disabled={!documents[activeTab] || documents[activeTab].length === 0}
              className={cn(
                "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                documents[activeTab] && documents[activeTab].length > 0
                  ? "text-blue-600 border border-blue-600 hover:bg-blue-50"
                  : "text-gray-400 border border-gray-300 cursor-not-allowed"
              )}
            >
              <Download className="w-4 h-4" />
              下载此文档
            </button>
          </div>
        </div>

        <DocumentViewer
          title={getCurrentTemplate().title}
          content={getDocumentContent(activeTab)}
          onDownload={() => handleDownloadSingle(activeTab)}
        />
      </div>
    </div>
  )
}