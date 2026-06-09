import { defineStore } from 'pinia'
import { ref } from 'vue'
import { NOTIFICATION_TYPES } from '@/constants/status.js'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([])

  function push(message, type = NOTIFICATION_TYPES.INFO) {
    const id = Date.now()
    notifications.value.push({ id, message, type })
    setTimeout(() => remove(id), 3000)
  }

  function remove(id) {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  return { notifications, push, remove }
})
