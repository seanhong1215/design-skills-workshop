import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const cartItems = ref([])

  const itemCount = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.qty, 0)
  )

  const subtotal = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.product.price * item.qty, 0)
  )

  const discount = computed(() => (subtotal.value >= 3000 ? 200 : 0))

  const total = computed(() => subtotal.value - discount.value)

  function addItem(product, qty = 1) {
    const existing = cartItems.value.find(i => i.product.id === product.id)
    if (existing) {
      existing.qty = Math.min(existing.qty + qty, product.stock)
    } else {
      cartItems.value.push({ product, qty: Math.min(qty, product.stock) })
    }
  }

  function removeItem(productId) {
    cartItems.value = cartItems.value.filter(i => i.product.id !== productId)
  }

  function updateQty(productId, qty) {
    const item = cartItems.value.find(i => i.product.id === productId)
    if (!item) return
    if (qty <= 0) {
      removeItem(productId)
    } else {
      item.qty = Math.min(qty, item.product.stock)
    }
  }

  function clearCart() {
    cartItems.value = []
  }

  return { cartItems, itemCount, subtotal, discount, total, addItem, removeItem, updateQty, clearCart }
})
