import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, FileText, Zap, Users, Sparkles, Rocket } from 'lucide-react'
import { 
  ModernButton, 
  ModernCard,
  ResponsiveContainer,
  ResponsiveGrid,
  MagneticButton,
  ElasticScale,
  RippleEffect,
  useBreakpoint
} from '@/components/ui'
import { useInViewAnimation, useHoverAnimation, useSequenceAnimation } from '@/hooks/useAnimations'

export default function LandingPage() {
  const features = [
    {
      icon: FileText,
      title: '智能文档生成',
      description: '自动生成用户旅程地图、PRD、前后端设计文档等完整开发文档'
    },
    {
      icon: Zap,
      title: 'AI驱动分析',
      description: '基于AI深度分析项目需求，提供专业的技术建议和解决方案'
    },
    {
      icon: Users,
      title: '新手友好',
      description: '专为编程新手设计，提供step-by-step的项目开发指导'
    }
  ]

  const { isMobile } = useBreakpoint()
  const { ref: heroRef, isInView: heroInView } = useInViewAnimation(0.2)
  const { ref: featuresRef, isInView: featuresInView } = useInViewAnimation(0.3)
  const { ref: ctaRef, isInView: ctaInView } = useInViewAnimation(0.4)
  const { activeIndex, playSequence } = useSequenceAnimation(features.length, 150)
  const { style: heroStyle, handlers: heroHandlers } = useHoverAnimation({
    scale: 1.02,
    duration: 500
  })
  
  // 当特性卡片进入视野时播放序列动画
  React.useEffect(() => {
    if (featuresInView) {
      playSequence()
    }
  }, [featuresInView, playSequence])

  return (
    <ResponsiveContainer fluid className="min-h-screen bg-gradient-glass relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-primary opacity-10 rounded-full blur-3xl animate-floating" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-ocean opacity-10 rounded-full blur-3xl animate-floating-delayed" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-gradient-warm opacity-5 rounded-full blur-3xl animate-breathing" />
      </div>
      {/* Hero Section */}
      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div 
          ref={heroRef}
          className={`text-center max-w-5xl mx-auto transition-all duration-1000 ease-apple ${
            heroInView 
              ? 'opacity-100 transform translate-y-0' 
              : 'opacity-0 transform translate-y-12'
          }`}
          style={heroStyle}
          {...heroHandlers}
        >
          <ElasticScale scale={1.05} trigger="hover">
            <div className="flex items-center justify-center mb-6">
              <RippleEffect>
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-primary/10 border border-primary-200/50 rounded-full backdrop-blur-sm cursor-pointer">
                  <Sparkles className="w-4 h-4 text-primary-600" />
                  <span className="text-sm font-medium text-primary-700">AI驱动的智能开发平台</span>
                </div>
              </RippleEffect>
            </div>
          </ElasticScale>
          
          <div className="relative">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold mb-8">
              <span className="bg-gradient-primary bg-clip-text text-transparent animate-shimmer">智能AI开发</span>
              <br />
              <span className="bg-gradient-ocean bg-clip-text text-transparent">文档平台</span>
            </h1>
            
            {/* 文字动画装饰 */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary-400 rounded-full animate-bounce opacity-60" />
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-secondary-400 rounded-full animate-pulse opacity-40" />
          </div>
          
          <p className="text-xl lg:text-2xl leading-relaxed text-gray-600 max-w-3xl mx-auto mb-12">
            为编程新手提供专业的项目开发指导，通过AI智能分析生成完整的开发文档，
            <br className="hidden sm:block" />
            让项目从想法到实现变得<span className="text-primary-600 font-semibold">简单高效</span>
          </p>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <MagneticButton strength={0.3}>
              <Link to="/create">
                <ModernButton
                  size={isMobile ? 'lg' : 'xl'}
                  variant="primary"
                  gradient
                  glow
                  floating
                  className="group px-8 py-4 text-xl"
                >
                  <Rocket className="w-6 h-6 mr-2 group-hover:animate-bounce" />
                  开始创建项目
                  <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                </ModernButton>
              </Link>
            </MagneticButton>
            
            <ElasticScale scale={1.1} trigger="hover">
              <ModernButton
                size={isMobile ? 'lg' : 'xl'}
                variant="glass"
                className="text-xl px-8 py-4"
              >
                查看示例
                <ArrowRight className="w-5 h-5 ml-2" />
              </ModernButton>
            </ElasticScale>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-32 relative">
          <div 
            ref={featuresRef}
            className={`text-center mb-16 transition-all duration-700 ease-apple ${
              featuresInView 
                ? 'opacity-100 transform translate-y-0' 
                : 'opacity-0 transform translate-y-8'
            }`}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-primary bg-clip-text text-transparent">为什么选择</span>
              <span className="text-gray-900"> VibeGuide？</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              三大核心优势，让您的开发之路更加顺畅
            </p>
          </div>
          
          <ResponsiveGrid 
            cols={{ sm: 1, md: 2, lg: 3, xl: 3 }}
            gap="gap-8"
            className="max-w-6xl mx-auto"
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ease-apple ${
                  activeIndex >= index 
                    ? 'opacity-100 transform translate-y-0' 
                    : 'opacity-0 transform translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <MagneticButton strength={0.15}>
                  <ModernCard
                    variant="interactive"
                    size="lg"
                    shadow="apple"
                    hover
                    glow
                    className="text-center group h-full cursor-pointer"
                  >
                    <ElasticScale scale={1.1} trigger="hover">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-6 shadow-apple group-hover:shadow-glow transition-all duration-500">
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                    </ElasticScale>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {feature.description}
                    </p>
                  </ModernCard>
                </MagneticButton>
              </div>
            ))}
          </ResponsiveGrid>
        </div>

        {/* CTA Section */}
        <div
          ref={ctaRef}
          className={`mt-32 transition-all duration-700 ease-apple ${
            ctaInView 
              ? 'opacity-100 transform translate-y-0' 
              : 'opacity-0 transform translate-y-8'
          }`}
        >
          <RippleEffect>
            <ModernCard
              variant="gradient"
              size="xl"
              shadow="float"
              rounded="3xl"
              glow
              className="text-center relative overflow-hidden cursor-pointer bg-gradient-to-br from-primary-500 via-primary-600 to-purple-600 border-0"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/95 via-primary-600/95 to-purple-600/95" />
              
              {/* 添加一些装饰性的渐变层 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              <div className="absolute inset-0 bg-gradient-radial from-white/5 via-transparent to-transparent" />
              
              <div className="relative z-10 py-4">
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 drop-shadow-lg">
                  准备开始您的项目了吗？
                </h2>
                <p className="text-white/95 text-xl mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-sm">
                  只需<span className="font-bold text-white bg-white/10 px-2 py-1 rounded-lg">3个步骤</span>，即可获得完整的项目开发文档。
                  <br className="hidden sm:block" />
                  让AI成为您的开发伙伴，从需求分析到技术实现，全程陪伴。
                </p>
                
                <MagneticButton strength={0.2}>
                  <Link to="/create">
                    <ModernButton
                      size="xl"
                      variant="secondary"
                      className="bg-white/95 backdrop-blur-sm text-primary-600 hover:bg-white hover:scale-105 px-10 py-5 text-xl font-bold group rounded-2xl shadow-xl border-0"
                    >
                      <Sparkles className="w-6 h-6 mr-3 group-hover:animate-spin" />
                      免费开始创建
                      <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                    </ModernButton>
                  </Link>
                </MagneticButton>
              </div>
              
              {/* Enhanced Decorative elements */}
              <div className="absolute top-6 left-6 w-3 h-3 bg-white/30 rounded-full animate-floating" />
              <div className="absolute top-16 left-16 w-2 h-2 bg-white/20 rounded-full animate-floating-delayed" />
              <div className="absolute bottom-6 right-6 w-4 h-4 bg-white/25 rounded-full animate-floating-delayed" />
              <div className="absolute bottom-16 right-16 w-2 h-2 bg-white/15 rounded-full animate-floating" />
              <div className="absolute top-1/2 right-10 w-3 h-3 bg-white/20 rounded-full animate-breathing" />
              <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-white/25 rounded-full animate-pulse" />
              <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-white/25 rounded-full animate-pulse" style={{animationDelay: '1s'}} />
              
              {/* 边缘发光效果 */}
              <div className="absolute inset-0 rounded-3xl border border-white/20" />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
            </ModernCard>
          </RippleEffect>
        </div>
      </div>
    </ResponsiveContainer>
  )
}