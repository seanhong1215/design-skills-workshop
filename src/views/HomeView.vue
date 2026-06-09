<template>
  <main class="home">
    <section class="home__hero">
      <span class="home__hero-badge">全新上市 ✦ 限時優惠</span>
      <h1 class="home__hero-title">探索精選好物<br>盡在 ShopLab</h1>
      <p class="home__hero-subtitle">精選電子、家具、運動戶外、廚房用品，每週上新，品質保證。</p>
      <div class="home__hero-actions">
        <RouterLink :to="{ name: ROUTE_NAMES.PRODUCT_LIST }" class="home__btn home__btn--primary">立即逛逛</RouterLink>
        <RouterLink :to="{ name: ROUTE_NAMES.CART }" class="home__btn home__btn--outline">查看購物車</RouterLink>
      </div>
    </section>

    <section class="home__featured">
      <div class="home__section-header">
        <h2 class="home__section-title">精選商品</h2>
        <RouterLink :to="{ name: ROUTE_NAMES.PRODUCT_LIST }" class="home__view-all">查看全部 →</RouterLink>
      </div>
      <div class="home__products-grid">
        <ProductCard
          v-for="product in featuredProducts"
          :key="product.id"
          :product="product"
          @click="goToProduct(product.id)"
          @add-to-cart="handleAddToCart"
        />
      </div>
    </section>

    <section class="home__categories">
      <h2 class="home__section-title">商品分類</h2>
      <div class="home__categories-grid">
        <RouterLink
          v-for="cat in categoryLinks"
          :key="cat.name"
          :to="{ name: ROUTE_NAMES.PRODUCT_LIST, query: { category: cat.name } }"
          class="home__category-card"
        >
          <span class="home__category-icon">{{ cat.icon }}</span>
          <span class="home__category-name">{{ cat.name }}</span>
        </RouterLink>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useProductsStore } from '@/stores/products.js'
import { useCartStore } from '@/stores/cart.js'
import { useNotificationStore } from '@/stores/notification.js'
import { ROUTE_NAMES } from '@/constants/routes.js'
import ProductCard from '@/components/shop/ProductCard.vue'

const router = useRouter()
const productsStore = useProductsStore()
const cartStore = useCartStore()
const notificationStore = useNotificationStore()

productsStore.loadProducts()

const featuredProducts = computed(() => productsStore.products.slice(0, 3))

const categoryLinks = [
  { name: '電子產品', icon: '💻' },
  { name: '家具', icon: '🪑' },
  { name: '運動戶外', icon: '🏕️' },
  { name: '廚房用品', icon: '☕' }
]

function goToProduct(id) {
  router.push({ name: ROUTE_NAMES.PRODUCT_DETAIL, params: { id } })
}

function handleAddToCart(product) {
  cartStore.addItem(product)
  notificationStore.success(`「${product.name}」已加入購物車`)
}
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-6);
}

.home__hero {
  text-align: center;
  padding: var(--space-16) 0 var(--space-12);
}

.home__hero-badge {
  display: inline-block;
  background-color: var(--color-accent-subtle);
  color: var(--color-accent-primary);
  font-size: var(--text-sm);
  font-weight: 600;
  padding: var(--space-1) var(--space-4);
  border-radius: var(--radius-full);
  margin-bottom: var(--space-6);
}

.home__hero-title {
  font-size: var(--text-4xl);
  font-weight: 800;
  line-height: var(--leading-tight);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-6);
}

.home__hero-subtitle {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-8);
  max-width: 540px;
  margin-left: auto;
  margin-right: auto;
}

.home__hero-actions {
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  flex-wrap: wrap;
}

.home__btn {
  padding: var(--space-3) var(--space-8);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  font-weight: 600;
  text-decoration: none;
  transition: all var(--transition-fast);
}

.home__btn--primary {
  background-color: var(--color-accent-primary);
  color: #fff;
}

.home__btn--primary:hover {
  background-color: var(--color-accent-hover);
}

.home__btn--outline {
  border: 2px solid var(--color-border-strong);
  color: var(--color-text-primary);
}

.home__btn--outline:hover {
  border-color: var(--color-accent-primary);
  color: var(--color-accent-primary);
}

.home__featured {
  margin-bottom: var(--space-16);
}

.home__section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-6);
}

.home__section-title {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.home__view-all {
  font-size: var(--text-sm);
  color: var(--color-accent-primary);
  text-decoration: none;
  font-weight: 500;
}

.home__view-all:hover {
  text-decoration: underline;
}

.home__products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-6);
}

.home__categories {
  margin-bottom: var(--space-16);
}

.home__categories .home__section-title {
  margin-bottom: var(--space-6);
}

.home__categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: var(--space-4);
}

.home__category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-6);
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  text-decoration: none;
  transition: all var(--transition-fast);
}

.home__category-card:hover {
  border-color: var(--color-accent-primary);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.home__category-icon {
  font-size: 2rem;
}

.home__category-name {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-primary);
}
</style>
