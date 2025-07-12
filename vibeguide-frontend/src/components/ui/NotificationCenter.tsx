import React from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { useNotifications, useStoreActions } from '@/store/selectors'
import { cn } from '@/lib/utils'
import ModernCard from './ModernCard'

const NotificationCenter: React.FC = () => {
  const notifications = useNotifications()
  const { removeNotification } = useStoreActions()

  if (notifications.length === 0) return null

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-success-500" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-danger-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning-500" />
      case 'info':
      default:
        return <Info className="w-5 h-5 text-primary-500" />
    }
  }


  const getBorderColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-success-500'
      case 'error':
        return 'border-l-danger-500'
      case 'warning':
        return 'border-l-warning-500'
      case 'info':
      default:
        return 'border-l-primary-500'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
      {notifications.slice(0, 5).map((notification) => (
        <ModernCard
          key={notification.id}
          variant="glass"
          size="sm"
          shadow="apple"
          className={cn(
            'border-l-4 animate-slide-in-right',
            getBorderColor(notification.type)
          )}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(notification.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                {notification.title}
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {notification.message}
              </p>
              
              {notification.action && (
                <button
                  onClick={notification.action.onClick}
                  className="mt-2 text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  {notification.action.label}
                </button>
              )}
            </div>
            
            <button
              onClick={() => removeNotification(notification.id)}
              className="flex-shrink-0 p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </ModernCard>
      ))}
      
      {notifications.length > 5 && (
        <div className="text-center">
          <button className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
            还有 {notifications.length - 5} 条通知...
          </button>
        </div>
      )}
    </div>
  )
}

export default NotificationCenter