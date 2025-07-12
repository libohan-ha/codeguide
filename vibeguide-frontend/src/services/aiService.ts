export interface AIQuestion {
  id: string
  question: string
  type: 'text' | 'multiple_choice' | 'rating'
  options?: string[]
  required: boolean
}

export interface AIQuestionsResponse {
  questions: AIQuestion[]
  analysis: string
}

export interface GenerateQuestionsRequest {
  projectDescription: string
}

export interface AnswerQuestionsRequest {
  projectDescription: string
  questions: Array<{
    id: string
    question: string
    answer: string
  }>
}

// AI服务配置
const USE_REAL_AI = import.meta.env.VITE_USE_REAL_AI === 'true'

// AI服务类 - 支持真实API和模拟数据
export class AIService {
  private static async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  static async generateQuestions(request: GenerateQuestionsRequest): Promise<AIQuestionsResponse> {
    // 如果启用真实AI，调用API
    if (USE_REAL_AI) {
      try {
        return await callAIGenerateQuestions(request.projectDescription)
      } catch (error) {
        console.warn('真实AI API调用失败，回退到模拟数据:', error)
        // 回退到模拟数据
      }
    }

    // 模拟数据逻辑
    // 模拟API延迟
    await this.delay(2000)

    // 根据项目描述生成问题
    const questions: AIQuestion[] = [
      {
        id: '1',
        question: '您的目标用户群体是谁？请详细描述用户特征。',
        type: 'text',
        required: true
      },
      {
        id: '2', 
        question: '您希望这个项目解决什么核心问题？',
        type: 'text',
        required: true
      },
      {
        id: '3',
        question: '您预期的项目规模是？',
        type: 'multiple_choice',
        options: ['小型个人项目', '中型团队项目', '大型企业项目'],
        required: true
      },
      {
        id: '4',
        question: '您对项目的技术复杂度有什么要求？',
        type: 'rating',
        required: false
      },
      {
        id: '5',
        question: '您是否有特定的技术栈偏好？如果有，请说明。',
        type: 'text',
        required: false
      }
    ]

    // 根据项目描述内容调整问题
    if (request.projectDescription.includes('管理')) {
      questions.push({
        id: '6',
        question: '您需要什么级别的权限管理功能？',
        type: 'multiple_choice',
        options: ['基础用户权限', '角色权限管理', '复杂权限体系'],
        required: true
      })
    }

    if (request.projectDescription.includes('数据') || request.projectDescription.includes('信息')) {
      questions.push({
        id: '7',
        question: '您预期需要存储和处理多少数据量？',
        type: 'multiple_choice',
        options: ['少量数据(< 10万条)', '中等数据(10万-100万条)', '大量数据(> 100万条)'],
        required: true
      })
    }

    return {
      questions: questions.slice(0, 5), // 限制为3-5个问题
      analysis: `基于您的项目描述"${request.projectDescription.slice(0, 50)}..."，AI分析认为以下问题对于完善项目需求最为重要。请详细回答这些问题，以便生成更精准的开发文档。`
    }
  }

  static async analyzeAnswers(request: AnswerQuestionsRequest): Promise<string> {
    // 如果启用真实AI，调用API
    if (USE_REAL_AI) {
      try {
        return await callAIAnalyzeAnswers(
          request.projectDescription,
          request.questions
        )
      } catch (error) {
        console.warn('真实AI API调用失败，回退到模拟数据:', error)
        // 回退到模拟数据
      }
    }

    // 模拟数据逻辑
    // 模拟API延迟
    await this.delay(1500)

    const analysis = `
基于您的项目描述和问题回答，AI已完成需求分析：

**项目概述：** ${request.projectDescription.slice(0, 100)}...

**核心需求分析：**
${request.questions.map((q, index) => 
  `${index + 1}. ${q.question}\n   回答：${q.answer}`
).join('\n\n')}

**AI建议：**
- 推荐采用现代化的技术栈
- 建议实施敏捷开发流程
- 重点关注用户体验设计
- 考虑后期的扩展性和维护性

现在可以进入下一步生成详细的开发文档。
    `

    return analysis.trim()
  }
}

// API配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

// 真实的AI API调用函数
export async function callAIGenerateQuestions(projectDescription: string): Promise<AIQuestionsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/generate-questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectDescription
      }),
    })

    if (!response.ok) {
      throw new Error(`AI API调用失败: ${response.status}`)
    }

    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'AI API返回错误')
    }

    return result.data
  } catch (error) {
    console.error('AI API Error:', error)
    throw error
  }
}

export async function callAIAnalyzeAnswers(
  projectDescription: string, 
  questions: Array<{id: string, question: string, answer: string}>
): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/analyze-answers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectDescription,
        questions
      }),
    })

    if (!response.ok) {
      throw new Error(`AI API调用失败: ${response.status}`)
    }

    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'AI API返回错误')
    }

    return result.data.analysis
  } catch (error) {
    console.error('AI API Error:', error)
    throw error
  }
}

export async function callAIGenerateDocument(
  type: string,
  projectDescription: string,
  requirements: string
): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/generate-document`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        projectDescription,
        requirements
      }),
    })

    if (!response.ok) {
      throw new Error(`AI API调用失败: ${response.status}`)
    }

    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'AI API返回错误')
    }

    return result.data.content
  } catch (error) {
    console.error('AI API Error:', error)
    throw error
  }
}