#!/bin/bash

# VibeGuide 开发环境启动脚本

echo "🚀 启动 VibeGuide 开发环境..."

# 检查Python环境
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 未安装，请先安装 Python3"
    exit 1
fi

# 检查Node.js环境
if ! command -v npm &> /dev/null; then
    echo "❌ Node.js/npm 未安装，请先安装 Node.js"
    exit 1
fi

# 检查虚拟环境
if [ ! -d "venv" ]; then
    echo "📦 创建Python虚拟环境..."
    python3 -m venv venv
fi

# 激活虚拟环境并安装依赖
echo "📦 激活虚拟环境并安装Python依赖..."
source venv/bin/activate
pip install -r requirements.txt

# 设置环境变量
export VITE_USE_REAL_AI=true

# 启动后端API服务器（后台运行）
echo "🔧 启动后端API服务器..."
source venv/bin/activate && python backend_api_simple.py &
BACKEND_PID=$!

# 等待后端启动
sleep 3

# 检查后端是否启动成功
if curl -s http://localhost:5000/api/health > /dev/null; then
    echo "✅ 后端API服务器启动成功 (PID: $BACKEND_PID)"
else
    echo "❌ 后端API服务器启动失败"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# 进入前端目录并启动开发服务器
echo "🎨 启动前端开发服务器..."
cd vibeguide-frontend

# 安装前端依赖（如果需要）
if [ ! -d "node_modules" ]; then
    echo "📦 安装前端依赖..."
    npm install
fi

# 启动前端开发服务器
echo "🌐 前端服务器即将启动..."
echo "📊 后端API: http://localhost:5000"
echo "🎯 前端应用: http://localhost:5174"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 设置清理函数
cleanup() {
    echo ""
    echo "🛑 正在停止服务..."
    kill $BACKEND_PID 2>/dev/null
    echo "✅ 所有服务已停止"
    exit 0
}

# 捕获退出信号
trap cleanup SIGINT SIGTERM

# 启动前端（前台运行）
npm run dev

# 如果前端退出，清理后端
cleanup