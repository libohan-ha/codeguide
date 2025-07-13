/**
 * 验证工具函数
 */

// 邮箱验证
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// URL验证
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// 密码强度验证
export const validatePassword = (password: string): {
  isValid: boolean
  score: number
  feedback: string[]
} => {
  const feedback: string[] = []
  let score = 0

  if (password.length >= 8) {
    score += 1
  } else {
    feedback.push('密码至少需要8个字符')
  }

  if (/[A-Z]/.test(password)) {
    score += 1
  } else {
    feedback.push('需要包含大写字母')
  }

  if (/[a-z]/.test(password)) {
    score += 1
  } else {
    feedback.push('需要包含小写字母')
  }

  if (/\d/.test(password)) {
    score += 1
  } else {
    feedback.push('需要包含数字')
  }

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1
  } else {
    feedback.push('需要包含特殊字符')
  }

  return {
    isValid: score >= 4,
    score,
    feedback
  }
}

// 手机号验证（中国）
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

// 身份证号验证（中国）
export const isValidIdCard = (idCard: string): boolean => {
  const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  return idCardRegex.test(idCard)
}

// 文件类型验证
export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.some(type => {
    if (type.startsWith('.')) {
      return file.name.toLowerCase().endsWith(type)
    }
    return file.type === type
  })
}

// 文件大小验证
export const isValidFileSize = (file: File, maxSizeInBytes: number): boolean => {
  return file.size <= maxSizeInBytes
}

// 项目名称验证
export const validateProjectName = (name: string): {
  isValid: boolean
  message?: string
} => {
  if (!name.trim()) {
    return { isValid: false, message: '项目名称不能为空' }
  }

  if (name.length < 2) {
    return { isValid: false, message: '项目名称至少需要2个字符' }
  }

  if (name.length > 50) {
    return { isValid: false, message: '项目名称不能超过50个字符' }
  }

  const invalidChars = /[<>:"/\\|?*]/
  if (invalidChars.test(name)) {
    return { isValid: false, message: '项目名称包含无效字符' }
  }

  return { isValid: true }
}

// 表单字段验证
export const required = (value: any): string | undefined => {
  if (value === null || value === undefined || value === '') {
    return '此字段为必填项'
  }
  if (typeof value === 'string' && !value.trim()) {
    return '此字段为必填项'
  }
}

export const minLength = (min: number) => (value: string): string | undefined => {
  if (value && value.length < min) {
    return `至少需要${min}个字符`
  }
}

export const maxLength = (max: number) => (value: string): string | undefined => {
  if (value && value.length > max) {
    return `不能超过${max}个字符`
  }
}

export const pattern = (regex: RegExp, message: string) => (value: string): string | undefined => {
  if (value && !regex.test(value)) {
    return message
  }
}

// 复合验证器
export const validateField = (value: any, validators: Array<(value: any) => string | undefined>): string | undefined => {
  for (const validator of validators) {
    const error = validator(value)
    if (error) return error
  }
}

// 颜色代码验证
export const isValidHexColor = (color: string): boolean => {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  return hexRegex.test(color)
}

// JSON字符串验证
export const isValidJSON = (str: string): boolean => {
  try {
    JSON.parse(str)
    return true
  } catch {
    return false
  }
}