# VibeGuide - AI驱动的项目需求分析和文档生成工具

VibeGuide是一个智能化的项目管理工具，能够通过AI技术帮助用户分析项目需求并生成专业的开发文档。

## 🚀 快速开始

### 环境要求
- Python 3.8+
- Node.js 16+
- npm 或 yarn

### 一键启动
```bash
# 克隆项目后，在项目根目录运行：
chmod +x start_dev.sh
./start_dev.sh
```

这个脚本将自动：
1. 创建Python虚拟环境
2. 安装所有依赖
3. 启动后端API服务器 (localhost:5000)
4. 启动前端开发服务器 (localhost:5174)

### 手动启动

#### 1. 启动后端API
```bash
# 创建虚拟环境
python3 -m venv venv
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 启动后端
python backend_api.py
```

#### 2. 启动前端
```bash
cd vibeguide-frontend
npm install
npm run dev
```

## 🤖 AI服务配置

### AI服务说明
- **当前版本**: 使用 `backend_api_simple.py` 提供模拟AI服务
- **完整AI版本**: `backend_api.py` 集成DeepSeek API（需要API配置）
- **前端智能切换**: 根据 `VITE_USE_REAL_AI` 自动选择真实AI或模拟数据

### 切换模式
- **启用后端API**: 设置环境变量 `VITE_USE_REAL_AI=true` 
- **仅前端模拟**: 设置环境变量 `VITE_USE_REAL_AI=false`

## 📋 功能特性

### 核心功能
- ✅ 项目描述输入和验证
- ✅ AI驱动的需求问题生成
- ✅ 智能需求分析
- ✅ 多类型文档自动生成：
  - 用户旅程地图
  - 产品需求文档(PRD)
  - 前端设计方案
  - 后端架构设计
  - 数据库设计

### 技术亮点
- 🎨 现代化苹果风格UI设计
- 🔄 智能状态管理 (Zustand + Immer)
- 🌐 响应式设计和动画效果
- 🔧 TypeScript全栈开发
- 🚀 模块化组件架构
- 🛡️ 智能错误处理和降级

## 🏗️ 技术栈

### 前端
- React 19 + TypeScript
- Vite (构建工具)
- Tailwind CSS (样式)
- Zustand (状态管理)
- React Router (路由)

### 后端
- Python Flask
- OpenAI SDK (DeepSeek API)
- Flask-CORS (跨域支持)

## 🧪 测试

### API测试
```bash
# 测试后端API
source venv/bin/activate
python test_api.py
```

### 健康检查
```bash
curl http://localhost:5000/api/health
```

## 📁 项目结构

```
geminiapi/
├── ai.py                 # AI服务配置示例
├── backend_api.py         # Flask后端API
├── requirements.txt       # Python依赖
├── start_dev.sh          # 一键启动脚本
├── test_api.py           # API测试脚本
├── venv/                 # Python虚拟环境
└── vibeguide-frontend/   # React前端应用
    ├── src/
    │   ├── components/   # React组件
    │   ├── hooks/        # 自定义Hooks
    │   ├── services/     # API服务层
    │   ├── store/        # 状态管理
    │   └── types/        # TypeScript类型
    ├── package.json
    └── vite.config.ts
```

## 🔧 开发说明

详细的开发指南请参考 [CLAUDE.md](./CLAUDE.md)

## 📝 待办事项

- [ ] 用户认证系统
- [ ] 项目历史和版本管理
- [ ] 导出功能增强 (PDF, Word)
- [ ] 多语言支持
- [ ] 云端存储集成

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License