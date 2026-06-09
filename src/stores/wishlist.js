import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useWishlistStore = defineStore('wishlist', () => {
  const items = ref([])

  const count = computed(() => items.value.length)

  function isWished(productId) {
    return items.value.some(p => p.id === productId)
  }

  function toggle(product) {
    const idx = items.value.findIndex(p => p.id === product.id)
    if (idx !== -1) {
      items.value.splice(idx, 1)
      return false
    } else {
      items.value.push(product)
      return true
    }
  }

  function remove(productId) {
    const idx = items.value.findIndex(p => p.id === productId)
    if (idx !== -1) items.value.splice(idx, 1)
  }

  return { items, count, isWished, toggle, remove }
})
