<template>
  <main class="product-list">
    <div class="product-list__inner">
      <aside class="product-list__sidebar">
        <h2 class="sidebar__title">商品篩選</h2>

        <div class="sidebar-section">
          <h3 class="sidebar-section__title">商品分類</h3>
          <ul class="sidebar-section__list">
            <li v-for="cat in categories" :key="cat">
              <button
                class="sidebar-section__item"
                :class="{ active: selectedCategory === cat }"
                @click="selectCategory(cat)"
              >
                <span class="sidebar-section__radio" :class="{ active: selectedCategory === cat }"></span>
                {{ cat }}
                <span class="sidebar-section__count">{{ categoryCount(cat) }}</span>
              </button>
            </li>
          </ul>
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
          <span>產品清單</span>
        </nav>

        <div class="product-list__head">
          <h1 class="product-list__h1">全部商品</h1>
          <p class="product-list__count-sub">共 {{ filteredProducts.length }} 件商品</p>
        </div>

        <div class="product-list__toolbar">
          <p class="product-list__count">顯示全部，共 {{ filteredProducts.length }} 件商品</p>
          <select v-model="sortBy" class="product-list__sort">
            <option value="default">排序：精選</option>
            <option value="price-asc">價格：低到高</option>
            <option value="price-desc">價格：高到低</option>
            <option value="rating">評分最高</option>
          </select>
        </div>

        <div v-if="pagedProducts.length > 0" class="product-list__grid">
          <ProductCard
            v-for="product in pagedProducts"
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

        <div v-if="totalPages > 1" class="product-list__pagination">
          <button
            v-for="p in totalPages"
            :key="p"
            class="pagination__btn"
            :class="{ active: p === currentPage }"
            @click="currentPage = p"
          >{{ p }}</button>
          <button
            class="pagination__btn pagination__next"
            :disabled="currentPage >= totalPages"
            @click="currentPage++"
          >下一頁 →</button>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useProductsStore } from '@/stores/products.js'
import { useCartStore } from '@/stores/cart.js'
import { categories } from '@/data/products.js'
import { ROUTE_NAMES } from '@/constants/routes.js'
import ProductCard from '@/components/shop/ProductCard.vue'

const PAGE_SIZE = 8

const router = useRouter()
const route = useRoute()
const productsStore = useProductsStore()
const cartStore = useCartStore()

const selectedCategory = ref('全部')
const sortBy = ref('default')
const priceMax = ref(15000)
const currentPage = ref(1)

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

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / PAGE_SIZE))

const pagedProducts = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredProducts.value.slice(start, start + PAGE_SIZE)
})

watch(filteredProducts, () => { currentPage.value = 1 })

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
  gap: var(--space-2);
  padding: var(--space-2) var(--space-2);
  border: none;
  background: none;
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  text-align: left;
}

.sidebar-section__item:hover {
  color: var(--color-text-primary);
}

.sidebar-section__item.active {
  color: var(--color-accent-primary);
  font-weight: 600;
}

.sidebar-section__radio {
  width: 14px;
  height: 14px;
  border-radius: var(--radius-full);
  border: 2px solid var(--color-border-strong);
  flex-shrink: 0;
  transition: border-color var(--transition-fast);
}

.sidebar-section__radio.active {
  border-color: var(--color-accent-primary);
  background-color: var(--color-accent-primary);
  box-shadow: 0 0 0 2px var(--color-accent-subtle);
}

.sidebar-section__count {
  margin-left: auto;
  font-size: var(--text-xs);
  color: var(--color-text-muted);
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
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
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

/* Pagination */
.product-list__pagination {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  justify-content: center;
  margin-top: var(--space-8);
}

.pagination__btn {
  min-width: 36px;
  height: 36px;
  padding: 0 var(--space-3);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  background-color: var(--color-bg-surface);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.pagination__btn:hover:not(:disabled) {
  border-color: var(--color-accent-primary);
  color: var(--color-accent-primary);
}

.pagination__btn.active {
  background-color: var(--color-accent-primary);
  border-color: var(--color-accent-primary);
  color: #fff;
  font-weight: 700;
}

.pagination__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination__next {
  padding: 0 var(--space-4);
}
</style>
