<template>
  <main class="product-list">
    <div class="product-list__inner">
      <aside class="product-list__sidebar">
        <div class="sidebar-section">
          <h3 class="sidebar-section__title">商品分類</h3>
          <ul class="sidebar-section__list">
            <li v-for="cat in categories" :key="cat">
              <button
                class="sidebar-section__item"
                :class="{ active: selectedCategory === cat }"
                @click="selectCategory(cat)"
              >
                {{ cat }}
                <span class="sidebar-section__count">{{ categoryCount(cat) }}</span>
              </button>
            </li>
          </ul>
        </div>
        <div class="sidebar-section">
          <h3 class="sidebar-section__title">價格範圍</h3>
          <div class="sidebar-price">
            <label class="sidebar-price__label">
              <input v-model="priceMax" type="range" min="500" max="15000" step="500" class="sidebar-price__range" />
              <span>NT$500 ~ NT${{ priceMax.toLocaleString() }}</span>
            </label>
          </div>
        </div>
      </aside>

      <section class="product-list__main">
        <div class="product-list__toolbar">
          <p class="product-list__count">共 {{ filteredProducts.length }} 件商品</p>
          <select v-model="sortBy" class="product-list__sort">
            <option value="default">預設排序</option>
            <option value="price-asc">價格：低到高</option>
            <option value="price-desc">價格：高到低</option>
            <option value="rating">評分最高</option>
          </select>
        </div>

        <div v-if="filteredProducts.length > 0" class="product-list__grid">
          <ProductCard
            v-for="product in filteredProducts"
            :key="product.id"
            :product="product"
            @click="goToProduct(product.id)"
            @add-to-cart="handleAddToCart"
          />
        </div>
        <div v-else class="product-list__empty">
          <p>沒有符合條件的商品</p>
          <button @click="resetFilters" class="product-list__reset-btn">清除篩選</button>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProductsStore } from '@/stores/products.js'
import { useCartStore } from '@/stores/cart.js'
import { useNotificationStore } from '@/stores/notification.js'
import { categories } from '@/data/products.js'
import { ROUTE_NAMES } from '@/constants/routes.js'
import ProductCard from '@/components/shop/ProductCard.vue'

const router = useRouter()
const route = useRoute()
const productsStore = useProductsStore()
const cartStore = useCartStore()
const notificationStore = useNotificationStore()

const selectedCategory = ref('全部')
const sortBy = ref('default')
const priceMax = ref(15000)

onMounted(() => {
  productsStore.loadProducts()
  if (route.query.category) {
    selectedCategory.value = route.query.category
  }
})

watch(() => route.query.category, (val) => {
  if (val) selectedCategory.value = val
})

const filteredProducts = computed(() => {
  let list = productsStore.products
  if (selectedCategory.value !== '全部') {
    list = list.filter(p => p.category === selectedCategory.value)
  }
  list = list.filter(p => p.price <= priceMax.value)
  if (sortBy.value === 'price-asc') return [...list].sort((a, b) => a.price - b.price)
  if (sortBy.value === 'price-desc') return [...list].sort((a, b) => b.price - a.price)
  if (sortBy.value === 'rating') return [...list].sort((a, b) => b.rating - a.rating)
  return list
})

function categoryCount(cat) {
  if (cat === '全部') return productsStore.products.length
  return productsStore.products.filter(p => p.category === cat).length
}

function selectCategory(cat) {
  selectedCategory.value = cat
}

function resetFilters() {
  selectedCategory.value = '全部'
  sortBy.value = 'default'
  priceMax.value = 15000
}

function goToProduct(id) {
  router.push({ name: ROUTE_NAMES.PRODUCT_DETAIL, params: { id } })
}

function handleAddToCart(product) {
  cartStore.addItem(product)
  notificationStore.success(`「${product.name}」已加入購物車`)
}
</script>

<style scoped>
.product-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-6);
}

.product-list__inner {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: var(--space-8);
  align-items: start;
}

@media (max-width: 768px) {
  .product-list__inner {
    grid-template-columns: 1fr;
  }
}

.sidebar-section {
  margin-bottom: var(--space-6);
}

.sidebar-section__title {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-3);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.sidebar-section__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.sidebar-section__item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-3);
  border: none;
  background: none;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  text-align: left;
}

.sidebar-section__item:hover {
  background-color: var(--color-bg-subtle);
  color: var(--color-text-primary);
}

.sidebar-section__item.active {
  background-color: var(--color-accent-subtle);
  color: var(--color-accent-primary);
  font-weight: 600;
}

.sidebar-section__count {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  background-color: var(--color-bg-subtle);
  padding: 2px 6px;
  border-radius: var(--radius-full);
}

.sidebar-price {
  padding: var(--space-2) var(--space-3);
}

.sidebar-price__label {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.sidebar-price__range {
  width: 100%;
  accent-color: var(--color-accent-primary);
}

.product-list__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-6);
}

.product-list__count {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.product-list__sort {
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  background-color: var(--color-bg-surface);
  cursor: pointer;
}

.product-list__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--space-5);
}

.product-list__empty {
  text-align: center;
  padding: var(--space-16);
  color: var(--color-text-secondary);
}

.product-list__reset-btn {
  margin-top: var(--space-4);
  padding: var(--space-2) var(--space-6);
  background-color: var(--color-accent-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  cursor: pointer;
}
</style>
