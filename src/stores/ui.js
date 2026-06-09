import { defineStore } from 'pinia'
import { ref } from 'vue'
import { THEME } from '@/constants/status.js'

export const useUiStore = defineStore('ui', () => {
  const sidebarOpen = ref(true)
  const theme = ref(THEME.LIGHT)

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  function setTheme(newTheme) {
    theme.value = newTheme
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  return { sidebarOpen, theme, toggleSidebar, setTheme }
})
