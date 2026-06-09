import { useNotificationStore } from '@/stores/notification.js'
import { NOTIFICATION_TYPES } from '@/constants/status.js'

export function useNotification() {
  const store = useNotificationStore()

  return {
    notify: (message) => store.push(message, NOTIFICATION_TYPES.INFO),
    success: (message) => store.push(message, NOTIFICATION_TYPES.SUCCESS),
    warning: (message) => store.push(message, NOTIFICATION_TYPES.WARNING),
    error: (message) => store.push(message, NOTIFICATION_TYPES.ERROR)
  }
}
