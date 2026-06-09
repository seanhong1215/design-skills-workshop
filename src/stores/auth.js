import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') ?? null)

  const isLoggedIn = computed(() => !!token.value)
  const userName = computed(() => user.value?.name ?? '')

  function setUser(userData) {
    user.value = userData
  }

  function setToken(newToken) {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
  }

  function logout() {
    user.value = null
    setToken(null)
  }

  return { user, token, isLoggedIn, userName, setUser, setToken, logout }
})
