import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { lazy, Suspense, useState } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { 
  NotificationCenter, 
  GlobalLoader, 
  RouteTransition,
  ParticleBackground,
  FloatingActionButton,
  LoadingSpinner
} from '@/components/ui'
import PerformancePanel from '@/components/dev/PerformancePanel'
import { Plus } from 'lucide-react'
import { useAppStore } from '@/store'
import { ENV } from '@/constants'

// 懒加载页面组件
const LandingPage = lazy(() => import('@/pages/LandingPage'))
const CreateProject = lazy(() => import('@/pages/CreateProject'))
const StepperDemo = lazy(() => import('@/pages/StepperDemo'))

// 通用加载组件
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="lg" />
  </div>
)

function AppContent() {
  const navigate = useNavigate()
  const setCurrentProject = useAppStore(state => state.setCurrentProject)
  const [showPerformancePanel, setShowPerformancePanel] = useState(false)

  const handleCreateNewProject = () => {
    setCurrentProject(null)
    navigate('/create')
  }

  return (
    <div className="relative min-h-screen">
      {/* 粒子背景 */}
      <ParticleBackground 
        count={30} 
        color="rgba(59, 130, 246, 0.1)" 
        speed={0.5}
        className="fixed inset-0 z-0"
      />
      
      {/* 主要内容 */}
      <div className="relative z-10">
        <RouteTransition>
          <Routes>
            <Route path="/" element={
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <LandingPage />
                </Suspense>
              </MainLayout>
            } />
            <Route path="/create" element={
              <Suspense fallback={<PageLoader />}>
                <CreateProject />
              </Suspense>
            } />
            <Route path="/stepper-demo" element={
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <StepperDemo />
                </Suspense>
              </MainLayout>
            } />
          </Routes>
        </RouteTransition>
      </div>
      
      {/* 全局组件 */}
      <NotificationCenter />
      <GlobalLoader />
      
      {/* 浮动操作按钮 */}
      <FloatingActionButton
        position="bottom-right"
        tooltip="创建新项目"
        onClick={handleCreateNewProject}
      >
        <Plus className="w-6 h-6" />
      </FloatingActionButton>

      {/* 性能监控面板 - 仅开发环境 */}
      {ENV.IS_DEV && (
        <PerformancePanel
          isVisible={showPerformancePanel}
          onToggle={() => setShowPerformancePanel(!showPerformancePanel)}
        />
      )}
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
