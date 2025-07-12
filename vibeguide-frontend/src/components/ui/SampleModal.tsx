import React from 'react'
import { Link } from 'react-router-dom'
import { X, FileText, Users, Code, Database, Smartphone, Globe } from 'lucide-react'
import { ModernButton, ModernCard } from '@/components/ui'

interface SampleModalProps {
  isOpen: boolean
  onClose: () => void
}

const sampleProject = {
  title: "智能待办事项管理应用",
  description: "一个基于React和Node.js的现代化待办事项管理应用，支持团队协作、智能提醒和数据可视化功能。",
  targetUsers: [
    "个人用户 - 管理日常任务和生活计划",
    "团队成员 - 协作完成项目任务",
    "项目经理 - 跟踪项目进度和分配任务"
  ],
  features: [
    "用户注册登录系统",
    "任务创建、编辑、删除功能",
    "任务分类和标签管理",
    "团队协作和任务分配",
    "智能提醒和通知",
    "数据统计和可视化报表",
    "移动端响应式设计"
  ],
  techStack: {
    frontend: "React + TypeScript + Tailwind CSS",
    backend: "Node.js + Express + JWT认证",
    database: "MongoDB + Mongoose",
    deployment: "Vercel + MongoDB Atlas"
  },
  documents: [
    {
      name: "产品需求文档 (PRD)",
      icon: FileText,
      description: "详细的功能需求、用户故事和验收标准"
    },
    {
      name: "用户旅程地图",
      icon: Users,
      description: "用户使用流程和关键触点分析"
    },
    {
      name: "前端技术设计",
      icon: Code,
      description: "组件架构、状态管理和路由设计"
    },
    {
      name: "后端API文档",
      icon: Database,
      description: "接口设计、数据模型和认证方案"
    },
    {
      name: "移动端适配方案",
      icon: Smartphone,
      description: "响应式设计和PWA实现方案"
    },
    {
      name: "部署运维指南",
      icon: Globe,
      description: "部署流程、监控和性能优化"
    }
  ]
}

export default function SampleModal({ isOpen, onClose }: SampleModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <ModernCard
          variant="glass"
          size="xl"
          shadow="float"
          rounded="2xl"
          className="bg-white/95 backdrop-blur-md border border-white/20"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">项目示例预览</h2>
              <p className="text-gray-600 mt-1">了解VibeGuide如何帮助您生成完整的开发文档</p>
            </div>
            <ModernButton
              variant="glass"
              size="sm"
              onClick={onClose}
              className="p-2 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </ModernButton>
          </div>

          {/* Project Overview */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-primary-600" />
              项目概述
            </h3>
            <ModernCard variant="interactive" size="md" className="mb-4">
              <h4 className="font-semibold text-lg text-gray-900 mb-2">{sampleProject.title}</h4>
              <p className="text-gray-700 leading-relaxed">{sampleProject.description}</p>
            </ModernCard>
          </div>

          {/* Target Users */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-primary-600" />
              目标用户
            </h3>
            <div className="grid gap-3">
              {sampleProject.targetUsers.map((user, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{user}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Code className="w-5 h-5 mr-2 text-primary-600" />
              核心功能
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sampleProject.features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-secondary-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Database className="w-5 h-5 mr-2 text-primary-600" />
              技术栈
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(sampleProject.techStack).map(([key, value]) => (
                <ModernCard key={key} variant="interactive" size="sm" className="flex-1">
                  <div className="text-sm font-medium text-primary-600 uppercase tracking-wide mb-1">
                    {key === 'frontend' ? '前端' : key === 'backend' ? '后端' : key === 'database' ? '数据库' : '部署'}
                  </div>
                  <div className="text-gray-900 font-medium">{value}</div>
                </ModernCard>
              ))}
            </div>
          </div>

          {/* Generated Documents */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              AI生成的开发文档
            </h3>
            <p className="text-gray-600 mb-6">基于以上项目信息，VibeGuide将自动生成以下专业文档：</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sampleProject.documents.map((doc, index) => (
                <ModernCard key={index} variant="interactive" size="md" hover className="text-center group">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-xl mb-4 group-hover:scale-110 transition-transform">
                    <doc.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{doc.name}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{doc.description}</p>
                </ModernCard>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6 text-center">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              想要为您的项目生成类似的文档吗？
            </h4>
            <p className="text-gray-600 mb-4">
              只需3个步骤，即可获得完整的项目开发文档
            </p>
            <Link to="/create">
              <ModernButton
                variant="primary"
                size="lg"
                gradient
                glow
                onClick={onClose}
                className="px-8 py-3"
              >
                立即开始创建
              </ModernButton>
            </Link>
          </div>
        </ModernCard>
      </div>
    </div>
  )
}