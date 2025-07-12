import { useState } from 'react'
import { FileText, MessageSquare, Download } from 'lucide-react'
import { 
  Stepper, 
  StepperProvider, 
  StepperControls, 
  StepContent,
  type StepItem 
} from '@/components/ui'

const projectSteps: StepItem[] = [
  {
    id: 1,
    title: '描述项目',
    description: '详细描述您的项目想法',
    icon: <FileText className="w-4 h-4" />
  },
  {
    id: 2,
    title: '深入需求',
    description: 'AI分析并提出针对性问题',
    icon: <MessageSquare className="w-4 h-4" />
  },
  {
    id: 3,
    title: '创建文档',
    description: '生成完整的开发文档',
    icon: <Download className="w-4 h-4" />
  }
]

export default function StepperDemo() {
  const [formData, setFormData] = useState({
    projectDescription: '',
    requirements: '',
    documents: []
  })

  const handleStepChange = (step: string | number) => {
    console.log('Step changed to:', step)
  }

  const handleNext = () => {
    // 这里可以添加验证逻辑
    console.log('Next step clicked')
  }

  const handlePrev = () => {
    console.log('Previous step clicked')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <StepperProvider 
        steps={[1, 2, 3]} 
        initialStep={1}
        onStepChange={handleStepChange}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">创建新项目</h1>
          <p className="text-gray-600">使用AI Agent 辅助您完成专业的项目需求分析</p>
        </div>

        {/* 步骤指示器 */}
        <div className="mb-8">
          <Stepper 
            steps={projectSteps}
            currentStep={1}
            variant="numbered"
            orientation="horizontal"
          />
        </div>

        {/* 步骤内容 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <StepContent step={1}>
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">描述您的项目</h2>
              <p className="text-gray-600">请详细描述您想要开发的项目，至少20个字。</p>
              <textarea
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="例如：我想开发一个在线图书管理系统，用户可以浏览图书、借阅图书、管理个人借阅记录..."
                value={formData.projectDescription}
                onChange={(e) => setFormData({...formData, projectDescription: e.target.value})}
              />
            </div>
          </StepContent>

          <StepContent step={2}>
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">回答AI生成的问题</h2>
              <p className="text-gray-600">AI已经分析了您的项目描述，请回答以下问题以完善需求：</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    1. 您的目标用户群体是谁？
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="例如：学生、图书管理员、普通读者"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    2. 您希望支持哪些核心功能？
                  </label>
                  <textarea
                    className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="例如：用户注册登录、图书搜索、借阅管理、归还提醒"
                  />
                </div>
              </div>
            </div>
          </StepContent>

          <StepContent step={3}>
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">生成开发文档</h2>
              <p className="text-gray-600">AI正在为您生成完整的开发文档...</p>
              <div className="grid grid-cols-2 gap-4">
                {['用户旅程地图', '产品需求PRD', '前端设计文档', '后端设计文档', '数据库设计'].map((doc) => (
                  <div key={doc} className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-900">{doc}</h3>
                    <p className="text-sm text-gray-600 mt-1">已生成</p>
                  </div>
                ))}
              </div>
            </div>
          </StepContent>
        </div>

        {/* 步骤控制器 */}
        <StepperControls 
          onNext={handleNext}
          onPrev={handlePrev}
          nextDisabled={false}
          prevDisabled={false}
        />
      </StepperProvider>
    </div>
  )
}