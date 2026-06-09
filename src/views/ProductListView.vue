<template>
  <main class="product-list">
    <div class="product-list__inner">
      <aside class="product-list__sidebar">
        <h2 class="sidebar__title">篩選條件</h2>

        <div class="sidebar-section">
          <h3 class="sidebar-section__title">商品分類</h3>
          <div class="sidebar-section__pills">
            <button
              v-for="cat in categories"
              :key="cat"
              class="sidebar-pill"
              :class="{ active: selectedCategory === cat }"
              @click="selectCategory(cat)"
            >{{ cat }}</button>
          </div>
        </div>

        <div class="sidebar-section">
          <h3 class="sidebar-section__title">價格範圍</h3>
          <div class="sidebar-price">
            <div class="sidebar-price__inputs">
              <span class="sidebar-price__val">NT$0</span>
              <span class="sidebar-price__sep">—</span>
              <span class="sidebar-price__val">NT${{ priceMax.toLocaleString() }}</span>
            </div>
            <input v-model="priceMax" type="range" min="500" max="15000" step="500" class="sidebar-price__range" />
          </div>
        </div>
      </aside>

      <section class="product-list__main">
        <nav class="product-list__breadcrumb">
          <RouterLink :to="{ name: ROUTE_NAMES.HOME }">首頁</RouterLink>
          <span>/</span>
          <span>全部商品</span>
        </nav>

        <div class="product-list__head">
          <h1 class="product-list__h1">全部商品</h1>
          <p class="product-list__count-sub">共 {{ filteredProducts.length }} 件商品</p>
        </div>

        <div class="product-list__toolbar">
          <p class="product-list__count">共 {{ filteredProducts.length }} 件商品</p>
          <select v-model="sortBy" class="product-list__sort">
            <option value="default">排序：推薦</option>
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
            :showCartBtn="false"
            @click="goToProduct(product.id)"
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

import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useProductsStore } from '@/stores/products.js'
import { categories } from '@/data/products.js'
import { ROUTE_NAMES } from '@/constants/routes.js'
import ProductCard from '@/components/shop/ProductCard.vue'

const router = useRouter()
const route = useRoute()
const productsStore = useProductsStore()

const selectedCategory = ref('全部')
const sortBy = ref('default')
const priceMax = ref(15000)

onMounted(() => {
  productsStore.loadProducts()
  if (route.query.category) selectedCategory.value = route.query.category
})

watch(() => route.query.category, (val) => {
  if (val) selectedCategory.value = val
})

const filteredProducts = computed(() => {
  let list = productsStore.products
  if (selectedCategory.value !== '全部') list = list.filter(p => p.category === selectedCategory.value)
  list = list.filter(p => p.price <= priceMax.value)
  if (sortBy.value === 'price-asc') return [...list].sort((a, b) => a.price - b.price)
  if (sortBy.value === 'price-desc') return [...list].sort((a, b) => b.price - a.price)
  if (sortBy.value === 'rating') return [...list].sort((a, b) => b.rating - a.rating)
  return list
})

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
</script>

<style scoped>
.product-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-6);
}

.product-list__inner {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: var(--space-8);
  align-items: start;
}

@media (max-width: 768px) {
  .product-list__inner { grid-template-columns: 1fr; }
}

/* Sidebar */
.sidebar__title {
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-5);
}

.sidebar-section {
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-5);
  border-bottom: 1px solid var(--color-border-default);
}

.sidebar-section:last-child {
  border-bottom: none;
}

.sidebar-section__title {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-3);
}

.sidebar-section__pills {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.sidebar-pill {
  padding: var(--space-2) var(--space-4);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-full);
  background: none;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  text-align: left;
  transition: all var(--transition-fast);
}

.sidebar-pill:hover {
  border-color: var(--color-accent-primary);
  color: var(--color-accent-primary);
}

.sidebar-pill.active {
  background-color: var(--color-accent-primary);
  border-color: var(--color-accent-primary);
  color: #fff;
  font-weight: 600;
}

.sidebar-price {
  padding: var(--space-1) 0;
}

.sidebar-price__inputs {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-2);
}

.sidebar-price__val {
  font-weight: 500;
}

.sidebar-price__range {
  width: 100%;
  accent-color: var(--color-accent-primary);
}

/* Main content */
.product-list__breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin-bottom: var(--space-4);
}

.product-list__breadcrumb a {
  color: var(--color-text-secondary);
  text-decoration: none;
}

.product-list__breadcrumb a:hover {
  color: var(--color-accent-primary);
}

.product-list__head {
  margin-bottom: var(--space-2);
}

.product-list__h1 {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-1);
}

.product-list__count-sub {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin: 0 0 var(--space-5);
}

.product-list__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-6);
  padding: var(--space-3) var(--space-4);
  background-color: var(--color-bg-subtle);
  border-radius: var(--radius-md);
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
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-5);
}

@media (max-width: 900px) {
  .product-list__grid { grid-template-columns: repeat(2, 1fr); }
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
