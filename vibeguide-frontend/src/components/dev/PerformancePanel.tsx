import { memo, useEffect, useState } from 'react'
import { Activity, BarChart3, Globe, HardDrive, Zap } from 'lucide-react'
import { ModernCard } from '@/components/ui'
import { createPerformanceMonitor } from '@/utils/performance-monitor'

interface PerformancePanelProps {
  isVisible: boolean
  onToggle: () => void
}

interface MetricItem {
  name: string
  value: number
  rating?: string
  unit?: string
}

const PerformancePanel = memo(({ isVisible, onToggle }: PerformancePanelProps) => {
  const [monitor] = useState(() => createPerformanceMonitor())
  const [coreWebVitals, setCoreWebVitals] = useState<MetricItem[]>([])
  const [customMetrics, setCustomMetrics] = useState<MetricItem[]>([])
  const [memoryUsage, setMemoryUsage] = useState<{ used: number; total: number; limit: number } | null>(null)
  const [networkInfo, setNetworkInfo] = useState<any>(null)
  const [slowResources, setSlowResources] = useState<{ name: string; duration: number }[]>([])

  useEffect(() => {
    if (!isVisible) return

    const updateMetrics = () => {
      const report = monitor.getPerformanceReport()
      setCoreWebVitals(report.coreWebVitals)
      setCustomMetrics(report.customMetrics)
      setMemoryUsage(report.memoryUsage)
      setNetworkInfo(report.networkInfo)
      setSlowResources(report.slowResources.slice(0, 5)) // 只显示前5个慢资源
    }

    // 立即更新一次
    updateMetrics()

    // 定期更新
    const interval = setInterval(updateMetrics, 2000)

    return () => {
      clearInterval(interval)
    }
  }, [isVisible, monitor])

  useEffect(() => {
    return () => {
      monitor.disconnect()
    }
  }, [monitor])

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={onToggle}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
        >
          <Activity className="w-4 h-4" />
          Performance
        </button>
      </div>
    )
  }

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'text-green-600 bg-green-50'
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-50'
      case 'poor': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const formatValue = (value: number, unit?: string) => {
    if (unit === 'MB') return `${value.toFixed(1)} MB`
    if (value < 1000) return `${value.toFixed(1)}ms`
    return `${(value / 1000).toFixed(2)}s`
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-[80vh] overflow-y-auto">
      <ModernCard variant="glass" size="sm" shadow="float" className="backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Performance Monitor</h3>
          </div>
          <button
            onClick={onToggle}
            className="text-gray-500 hover:text-gray-700 text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Core Web Vitals */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-purple-600" />
            <h4 className="font-medium text-sm text-gray-700">Core Web Vitals</h4>
          </div>
          <div className="space-y-2">
            {coreWebVitals.map(metric => (
              <div key={metric.name} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{metric.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono">{formatValue(metric.value)}</span>
                  {metric.rating && (
                    <span className={`px-2 py-1 rounded text-xs ${getRatingColor(metric.rating)}`}>
                      {metric.rating}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Metrics */}
        {customMetrics.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <h4 className="font-medium text-sm text-gray-700">Loading Metrics</h4>
            </div>
            <div className="space-y-2">
              {customMetrics.map(metric => (
                <div key={metric.name} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{metric.name}</span>
                  <span className="font-mono">{formatValue(metric.value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Memory Usage */}
        {memoryUsage && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <HardDrive className="w-4 h-4 text-green-600" />
              <h4 className="font-medium text-sm text-gray-700">Memory Usage</h4>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Used</span>
                <span className="font-mono">{memoryUsage.used} MB</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total</span>
                <span className="font-mono">{memoryUsage.total} MB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(memoryUsage.used / memoryUsage.total) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Network Info */}
        {networkInfo && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-indigo-600" />
              <h4 className="font-medium text-sm text-gray-700">Network</h4>
            </div>
            <div className="space-y-2">
              {networkInfo.effectiveType && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Type</span>
                  <span className="font-mono">{networkInfo.effectiveType}</span>
                </div>
              )}
              {networkInfo.downlink && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Downlink</span>
                  <span className="font-mono">{networkInfo.downlink} Mbps</span>
                </div>
              )}
              {networkInfo.rtt && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">RTT</span>
                  <span className="font-mono">{networkInfo.rtt}ms</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Slow Resources */}
        {slowResources.length > 0 && (
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-2">Slow Resources</h4>
            <div className="space-y-1">
              {slowResources.map((resource, index) => (
                <div key={index} className="text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 truncate flex-1 mr-2">
                      {resource.name.split('/').pop()}
                    </span>
                    <span className="font-mono text-red-600">
                      {formatValue(resource.duration)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            Updates every 2s • {import.meta.env.DEV ? 'Development' : 'Production'} Build
          </div>
        </div>
      </ModernCard>
    </div>
  )
})

PerformancePanel.displayName = 'PerformancePanel'

export default PerformancePanel