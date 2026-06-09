import { defineStore } from 'pinia'
import { ref } from 'vue'
import { products as mockProducts } from '@/data/products.js'

export const useProductsStore = defineStore('products', () => {
  const products = ref([])
  const currentProduct = ref(null)
  const isLoading = ref(false)

  function loadProducts() {
    isLoading.value = true
    products.value = mockProducts
    isLoading.value = false
  }

  function loadProduct(id) {
    isLoading.value = true
    currentProduct.value = mockProducts.find(p => p.id === Number(id)) ?? null
    isLoading.value = false
  }

  return { products, currentProduct, isLoading, loadProducts, loadProduct }
})
