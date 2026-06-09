<template>
  <div class="home-page">
    <main class="home">
      <section class="home__hero">
        <span class="home__hero-badge">📦 全部精選 · 免費送達</span>
        <h1 class="home__hero-title">探索你的下一件<br>心動好物</h1>
        <p class="home__hero-subtitle">精選超過 1,000 件商品，快速訂購，輕鬆送貨</p>
        <div class="home__hero-actions">
          <RouterLink :to="{ name: ROUTE_NAMES.PRODUCT_LIST }" class="home__btn home__btn--primary">立即領取</RouterLink>
          <RouterLink :to="{ name: ROUTE_NAMES.PRODUCT_LIST }" class="home__btn home__btn--outline">瀏覽分類</RouterLink>
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
            :showCartBtn="true"
            @click="goToProduct(product.id)"
            @add-to-cart="handleAddToCart"
          />
        </div>
      </section>
    </main>

    <footer class="home__footer">
      <p>© 2025 ShopLab. 所有商品最優惠，品質保證。</p>
      <div class="home__footer-links">
        <a href="#">關於我們</a>
        <a href="#">隱私政策</a>
        <a href="#">服務條款</a>
      </div>
    </footer>
  </div>
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

function goToProduct(id) {
  router.push({ name: ROUTE_NAMES.PRODUCT_DETAIL, params: { id } })
}

function handleAddToCart(product) {
  cartStore.addItem(product)
  notificationStore.success(`「${product.name}」已加入購物車`)
}
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 60px);
}

.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-6);
  flex: 1;
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
  max-width: 480px;
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

.home__footer {
  background-color: var(--color-bg-subtle);
  border-top: 1px solid var(--color-border-default);
  padding: var(--space-6);
  text-align: center;
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.home__footer-links {
  display: flex;
  gap: var(--space-6);
}

.home__footer-links a {
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: var(--text-xs);
  transition: color var(--transition-fast);
}

.home__footer-links a:hover {
  color: var(--color-accent-primary);
}
</style>
