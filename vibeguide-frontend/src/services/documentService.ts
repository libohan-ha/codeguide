import { type ProjectData } from '@/hooks/useProjectForm'
import { callAIGenerateDocument } from './aiService'

export interface DocumentTemplate {
  id: keyof ProjectData['documents']
  title: string
  description: string
  icon: string
}

export const documentTemplates: DocumentTemplate[] = [
  {
    id: 'userJourney',
    title: '用户旅程地图',
    description: '描述用户与产品交互的完整流程',
    icon: '🗺️'
  },
  {
    id: 'prd',
    title: '产品需求PRD',
    description: '详细的产品需求和功能规格说明',
    icon: '📋'
  },
  {
    id: 'frontendDesign',
    title: '前端设计文档',
    description: '前端架构、组件设计和技术选型',
    icon: '🎨'
  },
  {
    id: 'backendDesign',
    title: '后端设计文档',
    description: '后端架构、API设计和数据流程',
    icon: '⚙️'
  },
  {
    id: 'databaseDesign',
    title: '数据库设计',
    description: '数据库结构、表设计和关系模型',
    icon: '🗄️'
  }
]

export interface GenerateDocumentsRequest {
  projectDescription: string
  aiQuestions: Array<{
    id: string
    question: string
    answer: string
  }>
}

// 文档服务配置
const USE_REAL_AI = import.meta.env.VITE_USE_REAL_AI === 'true'

export class DocumentService {
  private static async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  static async generateAllDocuments(request: GenerateDocumentsRequest): Promise<ProjectData['documents']> {
    const { projectDescription, aiQuestions } = request
    const requirements = aiQuestions.map(q => `${q.question}: ${q.answer}`).join('\n')

    if (USE_REAL_AI) {
      try {
        // 并行生成所有文档
        const [userJourney, prd, frontendDesign, backendDesign, databaseDesign] = await Promise.all([
          callAIGenerateDocument('userJourney', projectDescription, requirements),
          callAIGenerateDocument('prd', projectDescription, requirements),
          callAIGenerateDocument('frontendDesign', projectDescription, requirements),
          callAIGenerateDocument('backendDesign', projectDescription, requirements),
          callAIGenerateDocument('databaseDesign', projectDescription, requirements)
        ])

        return {
          userJourney,
          prd,
          frontendDesign,
          backendDesign,
          databaseDesign
        }
      } catch (error) {
        console.warn('真实AI API调用失败，回退到模拟数据:', error)
        // 回退到模拟数据
      }
    }

    // 模拟数据逻辑
    // 模拟AI文档生成过程
    await this.delay(3000)

    return {
      userJourney: this.generateUserJourneyMap(projectDescription, requirements),
      prd: this.generatePRD(projectDescription, requirements),
      frontendDesign: this.generateFrontendDesign(projectDescription, requirements),
      backendDesign: this.generateBackendDesign(projectDescription, requirements),
      databaseDesign: this.generateDatabaseDesign(projectDescription, requirements)
    }
  }

  private static generateUserJourneyMap(description: string, _answers: string): string {
    return `# 用户旅程地图

## 项目概述
${description}

## 核心用户群体
基于需求分析，识别出以下核心用户群体：
- 主要用户：普通终端用户
- 管理用户：系统管理员
- 访客用户：未注册用户

## 用户旅程阶段

### 1. 认知阶段
- **触点**：搜索引擎、口碑推荐、广告
- **用户行为**：了解产品功能和价值
- **用户情感**：好奇、谨慎
- **痛点**：信息不够清晰、缺乏信任感

### 2. 考虑阶段
- **触点**：产品官网、试用版本、用户评价
- **用户行为**：对比竞品、评估功能
- **用户情感**：期待、比较
- **痛点**：功能复杂、学习成本高

### 3. 购买/注册阶段
- **触点**：注册页面、支付流程
- **用户行为**：完成注册、设置账户
- **用户情感**：决心、紧张
- **痛点**：注册流程复杂、信息过多

### 4. 使用阶段
- **触点**：产品界面、帮助文档、客服
- **用户行为**：日常使用产品功能
- **用户情感**：满意、熟练
- **痛点**：操作不直观、功能难找

### 5. 推荐阶段
- **触点**：社交媒体、朋友圈、论坛
- **用户行为**：分享使用体验、推荐给他人
- **用户情感**：满足、自豪
- **机会点**：激励用户推荐、建立忠诚度

## 关键改进建议
1. 简化用户注册流程
2. 提供清晰的新手指导
3. 优化核心功能的用户体验
4. 建立用户反馈机制
5. 设计用户激励体系

## 成功指标
- 用户注册转化率 > 15%
- 新用户留存率（7日）> 40%
- 用户满意度评分 > 4.0/5.0
- 用户推荐意愿 > 60%`
  }

  private static generatePRD(description: string, answers: string): string {
    return `# 产品需求文档 (PRD)

## 1. 产品概述

### 1.1 产品背景
${description}

### 1.2 产品目标
基于需求分析，本产品旨在：
- 解决用户在相关领域的核心痛点
- 提供高效、易用的解决方案
- 建立可持续的商业价值

### 1.3 目标用户
${answers.includes('用户') ? '根据需求分析，目标用户群体已明确定义' : '需要进一步明确目标用户群体'}

## 2. 核心功能需求

### 2.1 用户管理模块
**优先级：P0**
- 用户注册/登录
- 个人信息管理
- 权限管理
- 账户安全

**验收标准：**
- 支持邮箱/手机号注册
- 登录成功率 > 99%
- 密码安全等级：中等以上

### 2.2 核心业务模块
**优先级：P0**
- 主要业务功能实现
- 数据CRUD操作
- 业务流程管理
- 状态跟踪

**验收标准：**
- 核心功能响应时间 < 2秒
- 数据准确性 100%
- 支持并发用户 > 1000

### 2.3 系统管理模块
**优先级：P1**
- 系统配置管理
- 数据统计分析
- 日志管理
- 系统监控

**验收标准：**
- 管理后台操作响应时间 < 3秒
- 数据统计准确性 > 99.9%
- 系统可用性 > 99.5%

## 3. 非功能性需求

### 3.1 性能需求
- 页面加载时间 < 3秒
- API响应时间 < 2秒
- 系统并发支持 > 1000用户
- 数据库查询优化

### 3.2 安全需求
- 数据加密传输 (HTTPS)
- 用户数据隐私保护
- SQL注入防护
- XSS攻击防护

### 3.3 可用性需求
- 系统可用性 > 99.5%
- 故障恢复时间 < 30分钟
- 数据备份机制
- 灾难恢复预案

## 4. 技术约束
- 支持主流浏览器（Chrome、Firefox、Safari、Edge）
- 移动端适配（响应式设计）
- 数据库性能优化
- 服务器负载均衡

## 5. 项目里程碑
- **阶段1**：核心功能开发 (4周)
- **阶段2**：系统集成测试 (2周)
- **阶段3**：性能优化 (1周)
- **阶段4**：上线部署 (1周)

## 6. 风险评估
- **技术风险**：中等 - 采用成熟技术栈
- **进度风险**：低 - 合理的时间安排
- **人员风险**：低 - 团队技能匹配
- **需求风险**：中等 - 需持续与用户沟通

## 7. 成功指标
- 用户注册量增长 > 20%/月
- 用户活跃度 > 60%
- 用户满意度 > 4.0/5.0
- 系统稳定性 > 99.5%`
  }

  private static generateFrontendDesign(_description: string, _answers: string): string {
    return `# 前端设计文档

## 1. 技术架构

### 1.1 技术栈选择
- **框架**：React 18 + TypeScript
- **状态管理**：Zustand / Redux Toolkit
- **路由管理**：React Router v6
- **UI组件库**：Tailwind CSS + Shadcn/UI
- **构建工具**：Vite
- **包管理**：npm/yarn

### 1.2 项目结构
\`\`\`
src/
├── components/          # 通用组件
│   ├── ui/             # 基础UI组件
│   ├── forms/          # 表单组件
│   ├── layout/         # 布局组件
│   └── business/       # 业务组件
├── pages/              # 页面组件
├── hooks/              # 自定义Hooks
├── services/           # API服务
├── utils/              # 工具函数
├── types/              # TypeScript类型定义
├── styles/             # 样式文件
└── assets/             # 静态资源
\`\`\`

## 2. 组件设计

### 2.1 组件分层
- **页面层**：完整的页面组件
- **容器层**：业务逻辑容器组件
- **展示层**：纯展示组件
- **基础层**：通用UI组件

### 2.2 核心组件

#### 用户界面组件
\`\`\`typescript
interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
}

const UserProfileCard: React.FC<{
  user: UserProfile
  onEdit: () => void
}> = ({ user, onEdit }) => {
  // 组件实现
}
\`\`\`

#### 数据展示组件
\`\`\`typescript
interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  onRowClick?: (row: T) => void
  loading?: boolean
}

const DataTable = <T,>({ 
  data, 
  columns, 
  onRowClick,
  loading 
}: DataTableProps<T>) => {
  // 组件实现
}
\`\`\`

## 3. 状态管理

### 3.1 全局状态
\`\`\`typescript
interface AppState {
  user: User | null
  theme: 'light' | 'dark'
  language: string
  loading: boolean
}

const useAppStore = create<AppState>((set) => ({
  user: null,
  theme: 'light',
  language: 'zh-CN',
  loading: false,
  setUser: (user) => set({ user }),
  setTheme: (theme) => set({ theme }),
  setLoading: (loading) => set({ loading })
}))
\`\`\`

### 3.2 本地状态
- 使用 useState 管理组件内部状态
- 使用 useReducer 管理复杂状态逻辑
- 使用自定义 Hooks 抽象状态逻辑

## 4. 路由设计

### 4.1 路由结构
\`\`\`typescript
const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'profile', element: <Profile /> },
      { path: 'settings', element: <Settings /> }
    ]
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> }
    ]
  }
]
\`\`\`

### 4.2 路由守卫
- 认证路由保护
- 权限验证
- 重定向逻辑

## 5. 性能优化

### 5.1 代码分割
\`\`\`typescript
const LazyComponent = lazy(() => import('./Component'))

const App = () => (
  <Suspense fallback={<Loading />}>
    <LazyComponent />
  </Suspense>
)
\`\`\`

### 5.2 缓存策略
- React.memo 优化组件重渲染
- useMemo/useCallback 优化计算和函数
- React Query 缓存服务端数据

### 5.3 资源优化
- 图片懒加载
- 虚拟滚动
- 代码压缩
- Tree Shaking

## 6. 测试策略

### 6.1 单元测试
- 使用 Jest + React Testing Library
- 组件测试覆盖率 > 80%
- 工具函数测试覆盖率 > 95%

### 6.2 集成测试
- API 集成测试
- 路由测试
- 状态管理测试

### 6.3 E2E测试
- 使用 Playwright/Cypress
- 关键用户路径测试
- 跨浏览器兼容性测试

## 7. 部署方案

### 7.1 构建配置
\`\`\`typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  }
})
\`\`\`

### 7.2 环境配置
- 开发环境：热重载、源码调试
- 测试环境：接近生产的配置
- 生产环境：压缩、优化、CDN

## 8. 开发规范

### 8.1 代码规范
- ESLint + Prettier 配置
- TypeScript 严格模式
- 组件命名规范
- 文件组织规范

### 8.2 Git工作流
- Feature分支开发
- Code Review流程
- 自动化CI/CD
- 版本发布流程`
  }

  private static generateBackendDesign(_description: string, _answers: string): string {
    return `# 后端设计文档

## 1. 系统架构

### 1.1 整体架构
- **架构模式**：分层架构 + 微服务（可选）
- **技术栈**：Node.js + Express + TypeScript
- **数据库**：PostgreSQL（主库）+ Redis（缓存）
- **部署方式**：Docker + Kubernetes

### 1.2 系统分层
\`\`\`
┌─────────────────┐
│   表示层 (API)   │  Express Routes + Middleware
├─────────────────┤
│   业务逻辑层     │  Service Layer + Business Logic
├─────────────────┤
│   数据访问层     │  Repository Pattern + ORM
├─────────────────┤
│   数据存储层     │  PostgreSQL + Redis
└─────────────────┘
\`\`\`

## 2. API设计

### 2.1 RESTful API规范
\`\`\`typescript
// 用户相关API
GET    /api/v1/users           # 获取用户列表
GET    /api/v1/users/:id       # 获取单个用户
POST   /api/v1/users           # 创建用户
PUT    /api/v1/users/:id       # 更新用户
DELETE /api/v1/users/:id       # 删除用户

// 认证相关API
POST   /api/v1/auth/login      # 用户登录
POST   /api/v1/auth/register   # 用户注册
POST   /api/v1/auth/refresh    # 刷新token
POST   /api/v1/auth/logout     # 用户登出
\`\`\`

### 2.2 API响应格式
\`\`\`typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: {
    code: string
    details?: any
  }
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// 成功响应
{
  "success": true,
  "data": { "id": 1, "name": "用户名" },
  "message": "操作成功"
}

// 错误响应
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "details": "用户不存在"
  },
  "message": "请求失败"
}
\`\`\`

## 3. 数据模型设计

### 3.1 核心实体模型
\`\`\`typescript
// 用户实体
interface User {
  id: string
  email: string
  username: string
  passwordHash: string
  profile: UserProfile
  roles: Role[]
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

// 用户配置文件
interface UserProfile {
  id: string
  userId: string
  firstName: string
  lastName: string
  avatar?: string
  bio?: string
  preferences: UserPreferences
}

// 角色权限
interface Role {
  id: string
  name: string
  permissions: Permission[]
  description?: string
}
\`\`\`

### 3.2 业务实体模型
基于项目需求，设计相应的业务实体：
- 核心业务对象
- 关联关系定义
- 数据完整性约束
- 索引优化策略

## 4. 服务层设计

### 4.1 服务接口
\`\`\`typescript
interface UserService {
  createUser(userData: CreateUserDto): Promise<User>
  getUserById(id: string): Promise<User | null>
  updateUser(id: string, userData: UpdateUserDto): Promise<User>
  deleteUser(id: string): Promise<void>
  getUsersByQuery(query: UserQuery): Promise<PaginatedResult<User>>
}

class UserServiceImpl implements UserService {
  constructor(
    private userRepository: UserRepository,
    private cacheService: CacheService,
    private eventBus: EventBus
  ) {}

  async createUser(userData: CreateUserDto): Promise<User> {
    // 业务逻辑实现
    const user = await this.userRepository.create(userData)
    await this.eventBus.emit('user.created', user)
    return user
  }
}
\`\`\`

### 4.2 数据访问层
\`\`\`typescript
interface UserRepository {
  create(userData: CreateUserDto): Promise<User>
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  update(id: string, userData: UpdateUserDto): Promise<User>
  delete(id: string): Promise<void>
  findMany(query: UserQuery): Promise<PaginatedResult<User>>
}

class UserRepositoryImpl implements UserRepository {
  constructor(private db: Database) {}

  async findById(id: string): Promise<User | null> {
    return this.db.user.findUnique({
      where: { id },
      include: {
        profile: true,
        roles: {
          include: {
            permissions: true
          }
        }
      }
    })
  }
}
\`\`\`

## 5. 认证与授权

### 5.1 JWT认证
\`\`\`typescript
interface JwtPayload {
  userId: string
  email: string
  roles: string[]
  iat: number
  exp: number
}

class AuthService {
  generateTokens(user: User): {
    accessToken: string
    refreshToken: string
  } {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      roles: user.roles.map(r => r.name),
      iat: Date.now(),
      exp: Date.now() + 15 * 60 * 1000 // 15分钟
    }

    return {
      accessToken: jwt.sign(payload, process.env.JWT_SECRET),
      refreshToken: this.generateRefreshToken(user.id)
    }
  }
}
\`\`\`

### 5.2 权限控制
\`\`\`typescript
const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User
    const hasPermission = user.roles.some(role =>
      role.permissions.some(p => p.name === permission)
    )

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        error: { code: 'INSUFFICIENT_PERMISSIONS' }
      })
    }

    next()
  }
}

// 使用示例
router.delete('/users/:id', 
  authenticate, 
  requirePermission('users.delete'), 
  deleteUser
)
\`\`\`

## 6. 缓存策略

### 6.1 Redis缓存
\`\`\`typescript
class CacheService {
  constructor(private redis: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key)
    return value ? JSON.parse(value) : null
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    await this.redis.setex(key, ttl, JSON.stringify(value))
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern)
    if (keys.length > 0) {
      await this.redis.del(...keys)
    }
  }
}
\`\`\`

### 6.2 缓存策略
- **用户信息**：TTL 30分钟
- **配置数据**：TTL 24小时
- **频繁查询**：TTL 5分钟
- **计算结果**：TTL 1小时

## 7. 错误处理

### 7.1 统一错误处理
\`\`\`typescript
class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public isOperational = true
  ) {
    super(message)
    Error.captureStackTrace(this, this.constructor)
  }
}

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        details: err.message
      }
    })
  }

  // 未知错误
  logger.error('Unexpected error:', err)
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      details: '服务器内部错误'
    }
  })
}
\`\`\`

## 8. 性能优化

### 8.1 数据库优化
- 查询优化和索引设计
- 连接池配置
- 读写分离
- 分页查询优化

### 8.2 API优化
- 响应压缩
- 请求去重
- 批量操作接口
- GraphQL（可选）

## 9. 监控与日志

### 9.1 日志系统
\`\`\`typescript
import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
})
\`\`\`

### 9.2 性能监控
- API响应时间监控
- 数据库查询性能
- 内存和CPU使用率
- 错误率统计

## 10. 部署与运维

### 10.1 Docker化
\`\`\`dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

### 10.2 环境配置
- 开发环境：本地开发配置
- 测试环境：模拟生产环境
- 生产环境：高可用配置`
  }

  private static generateDatabaseDesign(_description: string, _answers: string): string {
    return `# 数据库设计文档

## 1. 数据库概述

### 1.1 技术选型
- **主数据库**：PostgreSQL 14+
- **缓存数据库**：Redis 6+
- **搜索引擎**：Elasticsearch（可选）
- **ORM框架**：Prisma / TypeORM

### 1.2 设计原则
- **规范化**：遵循第三范式，避免数据冗余
- **性能优化**：合理使用索引和分区
- **扩展性**：支持水平扩展和读写分离
- **数据完整性**：完善的约束和外键关系

## 2. 数据库架构

### 2.1 整体架构
\`\`\`
┌─────────────────┐    ┌─────────────────┐
│   应用服务器     │────│   主数据库       │
│                │    │   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘
         │                       │
         │              ┌─────────────────┐
         │──────────────│   缓存数据库     │
                        │   (Redis)       │
                        └─────────────────┘
\`\`\`

### 2.2 数据库实例
- **主库**：处理读写操作
- **从库**：处理只读查询（可选）
- **缓存**：热点数据缓存

## 3. 核心表设计

### 3.1 用户管理表

#### users 用户表
\`\`\`sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);
\`\`\`

#### user_profiles 用户配置表
\`\`\`sql
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url TEXT,
    bio TEXT,
    phone VARCHAR(20),
    birth_date DATE,
    gender VARCHAR(10),
    language VARCHAR(10) DEFAULT 'zh-CN',
    timezone VARCHAR(50) DEFAULT 'Asia/Shanghai',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE UNIQUE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
\`\`\`

### 3.2 权限管理表

#### roles 角色表
\`\`\`sql
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(200) NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 初始数据
INSERT INTO roles (name, display_name, description, is_system) VALUES
('admin', '管理员', '系统管理员，拥有所有权限', TRUE),
('user', '普通用户', '普通用户，基础权限', TRUE);
\`\`\`

#### permissions 权限表
\`\`\`sql
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(200) NOT NULL,
    description TEXT,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 示例权限数据
INSERT INTO permissions (name, display_name, description, resource, action) VALUES
('users.read', '查看用户', '查看用户信息', 'users', 'read'),
('users.create', '创建用户', '创建新用户', 'users', 'create'),
('users.update', '更新用户', '修改用户信息', 'users', 'update'),
('users.delete', '删除用户', '删除用户账户', 'users', 'delete');
\`\`\`

#### user_roles 用户角色关联表
\`\`\`sql
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, role_id)
);

-- 索引
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);
\`\`\`

#### role_permissions 角色权限关联表
\`\`\`sql
CREATE TABLE role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(role_id, permission_id)
);

-- 索引
CREATE INDEX idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission_id ON role_permissions(permission_id);
\`\`\`

### 3.3 业务核心表
根据具体项目需求设计业务表，以下为通用示例：

#### categories 分类表
\`\`\`sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_sort_order ON categories(sort_order);
\`\`\`

### 3.4 系统日志表

#### audit_logs 审计日志表
\`\`\`sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(255),
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
\`\`\`

## 4. 视图设计

### 4.1 用户完整信息视图
\`\`\`sql
CREATE VIEW user_full_info AS
SELECT 
    u.id,
    u.email,
    u.username,
    u.status,
    u.email_verified,
    u.created_at,
    p.first_name,
    p.last_name,
    p.avatar_url,
    p.bio,
    p.phone,
    ARRAY_AGG(r.name) as roles,
    ARRAY_AGG(DISTINCT perm.name) as permissions
FROM users u
LEFT JOIN user_profiles p ON u.id = p.user_id
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
LEFT JOIN role_permissions rp ON r.id = rp.role_id
LEFT JOIN permissions perm ON rp.permission_id = perm.id
WHERE u.deleted_at IS NULL
GROUP BY u.id, u.email, u.username, u.status, u.email_verified, u.created_at,
         p.first_name, p.last_name, p.avatar_url, p.bio, p.phone;
\`\`\`

## 5. 索引策略

### 5.1 主键索引
- 所有表都使用UUID作为主键
- 自动创建聚簇索引

### 5.2 唯一索引
\`\`\`sql
-- 用户邮箱唯一索引
CREATE UNIQUE INDEX idx_users_email_unique ON users(email) WHERE deleted_at IS NULL;

-- 用户名唯一索引
CREATE UNIQUE INDEX idx_users_username_unique ON users(username) WHERE deleted_at IS NULL;
\`\`\`

### 5.3 复合索引
\`\`\`sql
-- 用户状态和创建时间复合索引
CREATE INDEX idx_users_status_created ON users(status, created_at);

-- 审计日志复合索引
CREATE INDEX idx_audit_logs_user_action ON audit_logs(user_id, action, created_at);
\`\`\`

## 6. 分区策略

### 6.1 时间分区（审计日志表）
\`\`\`sql
-- 按月分区审计日志表
CREATE TABLE audit_logs_y2024m01 PARTITION OF audit_logs
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE audit_logs_y2024m02 PARTITION OF audit_logs
FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
\`\`\`

## 7. 数据完整性

### 7.1 外键约束
- 严格的外键关系维护数据完整性
- 级联删除和更新策略

### 7.2 检查约束
\`\`\`sql
-- 用户状态检查约束
ALTER TABLE users ADD CONSTRAINT chk_users_status 
CHECK (status IN ('active', 'inactive', 'suspended', 'pending'));

-- 邮箱格式检查约束
ALTER TABLE users ADD CONSTRAINT chk_users_email_format 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
\`\`\`

## 8. 性能优化

### 8.1 查询优化
- 使用EXPLAIN ANALYZE分析查询计划
- 避免N+1查询问题
- 合理使用连接查询

### 8.2 连接池配置
\`\`\`javascript
// 数据库连接池配置
const pool = {
  min: 2,           // 最小连接数
  max: 10,          // 最大连接数
  acquire: 30000,   // 获取连接超时时间
  idle: 10000,      // 连接空闲时间
  evict: 60000      // 连接回收时间
}
\`\`\`

## 9. 备份与恢复

### 9.1 备份策略
- **全量备份**：每日凌晨执行
- **增量备份**：每小时执行
- **日志备份**：实时归档

### 9.2 恢复策略
\`\`\`bash
# 全量恢复
pg_restore -d database_name backup_file.dump

# 时间点恢复
pg_ctl start -D /data/postgres -o "-c wal_level=replica"
\`\`\`

## 10. 监控指标

### 10.1 性能指标
- 连接数使用率
- 查询响应时间
- 慢查询统计
- 锁等待时间

### 10.2 存储指标
- 数据库大小增长趋势
- 表空间使用率
- 索引使用效率
- 死锁检测

## 11. 安全考虑

### 11.1 数据加密
- 传输加密（SSL/TLS）
- 存储加密（敏感字段）
- 密码哈希（bcrypt）

### 11.2 访问控制
- 数据库用户权限最小化
- 应用连接账户分离
- 审计日志完整性

这个数据库设计为项目提供了坚实的数据存储基础，支持用户管理、权限控制、业务数据存储和系统监控等核心功能。`
  }
}