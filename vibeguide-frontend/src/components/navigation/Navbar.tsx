import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Menu, X, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useBreakpoint } from '@/components/ui/ResponsiveContainer'
import { MagneticButton, ElasticScale } from '@/components/ui/MicroInteractions'
import { useScrollAnimation } from '@/hooks/useAnimations'

interface NavItem {
  label: string
  href: string
}

const navItems: NavItem[] = [
  { label: '首页', href: '/' }
]

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isMobile } = useBreakpoint()
  const { scrollDirection, isScrolling } = useScrollAnimation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  // 当路由改变时关闭移动菜单
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

  // 桌面导航
  const DesktopNav = () => (
    <nav className="hidden md:flex items-center space-x-2">
      {navItems.map((item, index) => {
        const isActive = location.pathname === item.href
        
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ease-apple',
              'relative overflow-hidden group',
              isActive 
                ? 'text-primary-600 bg-primary-50 shadow-sm' 
                : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50/50'
            )}
          >
            {item.label}
            {/* 活跃指示器 */}
            {isActive && (
              <div className="absolute bottom-0 left-1/2 w-6 h-0.5 bg-gradient-primary rounded-full transform -translate-x-1/2 animate-scale-in" />
            )}
          </Link>
        )
      })}
    </nav>
  )

  // 移动导航
  const MobileNav = () => (
    <div className="md:hidden">
      <ElasticScale scale={1.1} trigger="click">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={cn(
            'p-2 rounded-xl transition-all duration-300 ease-apple',
            'text-gray-600 hover:text-primary-600 hover:bg-primary-50',
            isMobileMenuOpen && 'bg-primary-50 text-primary-600'
          )}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </ElasticScale>
      
      {/* 移动菜单 */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl shadow-float animate-slide-down">
          <div className="p-4 space-y-2">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ease-apple',
                    'transform hover:translate-x-2',
                    isActive 
                      ? 'text-primary-600 bg-primary-50 shadow-sm' 
                      : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50/50'
                  )}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between">
                    <span>{item.label}</span>
                    {isActive && (
                      <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className={cn(
      'relative transition-all duration-300 ease-apple',
      // 根据滚动方向调整
      isScrolling && scrollDirection === 'up' && 'transform translate-y-[-2px]',
      isScrolling && scrollDirection === 'down' && 'transform translate-y-[2px]'
    )}>
      {isMobile ? <MobileNav /> : <DesktopNav />}
    </div>
  )
}