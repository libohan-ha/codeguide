import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import LandingPage from '@/pages/LandingPage'
import CreateProject from '@/pages/CreateProject'
import StepperDemo from '@/pages/StepperDemo'
import MainLayout from '@/components/layout/MainLayout'
import { 
  NotificationCenter, 
  GlobalLoader, 
  RouteTransition,
  ParticleBackground,
  FloatingActionButton
} from '@/components/ui'
import { Plus } from 'lucide-react'
import { useAppStore } from '@/store'

function AppContent() {
  const navigate = useNavigate()
  const setCurrentProject = useAppStore(state => state.setCurrentProject)

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
                <LandingPage />
              </MainLayout>
            } />
            <Route path="/create" element={
              <CreateProject />
            } />
            <Route path="/stepper-demo" element={
              <MainLayout>
                <StepperDemo />
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
