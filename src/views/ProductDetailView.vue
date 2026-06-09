<template>
  <main class="product-detail">
    <div v-if="product" class="product-detail__inner">
      <nav class="product-detail__breadcrumb">
        <RouterLink :to="{ name: ROUTE_NAMES.HOME }">首頁</RouterLink>
        <span>/</span>
        <RouterLink :to="{ name: ROUTE_NAMES.PRODUCT_LIST }">商品</RouterLink>
        <span>/</span>
        <span>{{ product.name }}</span>
      </nav>

      <div class="product-detail__content">
        <div class="product-detail__gallery">
          <img :src="activeImage" :alt="product.name" class="product-detail__main-image" />
          <div class="product-detail__thumbnails">
            <img
              v-for="(img, i) in thumbnails"
              :key="i"
              :src="img"
              :alt="`${product.name} 圖片 ${i + 1}`"
              class="product-detail__thumbnail"
              :class="{ active: activeImage === img }"
              @click="activeImage = img"
            />
          </div>
        </div>

        <div class="product-detail__info">
          <p class="product-detail__category">{{ product.category }}</p>
          <h1 class="product-detail__name">{{ product.name }}</h1>

          <div class="product-detail__rating">
            <span class="product-detail__stars">
              <Star :size="15" fill="currentColor" />
              {{ product.rating }}
            </span>
            <span class="product-detail__review-count">{{ product.reviewCount }} 則評價</span>
          </div>

          <div class="product-detail__prices">
            <span class="product-detail__price">NT${{ product.price.toLocaleString() }}</span>
            <span v-if="product.originalPrice > product.price" class="product-detail__original">
              NT${{ product.originalPrice.toLocaleString() }}
            </span>
            <span v-if="discountPercent > 0" class="product-detail__discount-badge">
              省 {{ discountPercent }}%
            </span>
          </div>

          <p class="product-detail__description">{{ product.description }}</p>

          <div class="product-detail__stock">
            庫存：<span :class="product.stock > 5 ? 'stock--ok' : 'stock--low'">
              {{ product.stock > 0 ? `剩餘 ${product.stock} 件` : '缺貨中' }}
            </span>
          </div>

          <div class="product-detail__qty-row">
            <label class="product-detail__qty-label">購買數量</label>
            <div class="product-detail__qty-ctrl">
              <button class="qty-btn" @click="qty > 1 && qty--" :disabled="qty <= 1">−</button>
              <span class="qty-num">{{ qty }}</span>
              <button class="qty-btn" @click="qty < product.stock && qty++" :disabled="qty >= product.stock">+</button>
            </div>
          </div>

          <div class="product-detail__actions">
            <button class="product-detail__add-btn" :disabled="product.stock === 0" @click="handleAddToCart">
              <ShoppingCart :size="18" /> 加入購物車
            </button>
            <button class="product-detail__wish-btn" :class="{ active: isWished }" @click="handleWish" aria-label="收藏">
              <Heart :size="20" :fill="isWished ? '#ef4444' : 'none'" :color="isWished ? '#ef4444' : 'currentColor'" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="product-detail__not-found">
      <p>找不到商品</p>
      <RouterLink :to="{ name: ROUTE_NAMES.PRODUCT_LIST }">返回商品列表</RouterLink>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { ShoppingCart, Heart, Star } from 'lucide-vue-next'
import { useProductsStore } from '@/stores/products.js'
import { useCartStore } from '@/stores/cart.js'
import { useNotificationStore } from '@/stores/notification.js'
import { useWishlistStore } from '@/stores/wishlist.js'
import { ROUTE_NAMES } from '@/constants/routes.js'

const route = useRoute()
const productsStore = useProductsStore()
const cartStore = useCartStore()
const notificationStore = useNotificationStore()
const wishlistStore = useWishlistStore()

const qty = ref(1)
const activeImage = ref('')

const isWished = computed(() => product.value ? wishlistStore.isWished(product.value.id) : false)

const product = computed(() => productsStore.currentProduct)

const thumbnails = computed(() => {
  if (!product.value) return []
  return product.value.images ?? [product.value.image]
})

watch(product, (p) => {
  if (p) activeImage.value = (p.images ?? [p.image])[0]
}, { immediate: true })

onMounted(() => {
  productsStore.loadProduct(route.params.id)
  qty.value = 1
})

const discountPercent = computed(() => {
  if (!product.value?.originalPrice || product.value.originalPrice <= product.value.price) return 0
  return Math.round((1 - product.value.price / product.value.originalPrice) * 100)
})

function handleAddToCart() {
  if (!product.value) return
  cartStore.addItem(product.value, qty.value)
  notificationStore.success(`「${product.value.name}」× ${qty.value} 已加入購物車`)
}

function handleWish() {
  if (!product.value) return
  const added = wishlistStore.toggle(product.value)
  if (added) {
    notificationStore.success(`「${product.value.name}」已加入收藏`)
  } else {
    notificationStore.info(`「${product.value.name}」已移除收藏`)
  }
}
</script>

<style scoped>
.product-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-6);
}

.product-detail__breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-8);
}

.product-detail__breadcrumb a {
  color: var(--color-text-secondary);
  text-decoration: none;
}

.product-detail__breadcrumb a:hover {
  color: var(--color-accent-primary);
}

.product-detail__content {
  display: grid;
  grid-template-columns: 480px 1fr;
  gap: var(--space-12);
  align-items: start;
}

@media (max-width: 900px) {
  .product-detail__content {
    grid-template-columns: 1fr;
  }
}

.product-detail__gallery {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.product-detail__main-image {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: var(--radius-lg);
  background-color: var(--color-bg-subtle);
}

.product-detail__thumbnails {
  display: flex;
  gap: var(--space-3);
}

.product-detail__thumbnail {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: var(--radius-md);
  border: 2px solid var(--color-border-default);
  cursor: pointer;
  transition: border-color var(--transition-fast);
}

.product-detail__thumbnail:hover,
.product-detail__thumbnail.active {
  border-color: var(--color-accent-primary);
}

.product-detail__category {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin: 0 0 var(--space-2);
}

.product-detail__name {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-4);
  line-height: var(--leading-tight);
}

.product-detail__rating {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-5);
}

.product-detail__stars {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--color-rating);
  font-weight: 600;
}

.product-detail__review-count {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.product-detail__prices {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
  margin-bottom: var(--space-5);
}

.product-detail__price {
  font-size: var(--text-3xl);
  font-weight: 800;
  color: var(--color-price);
}

.product-detail__original {
  font-size: var(--text-lg);
  color: var(--color-price-original);
  text-decoration: line-through;
}

.product-detail__discount-badge {
  background-color: var(--color-promo-subtle);
  color: var(--color-promo);
  font-size: var(--text-sm);
  font-weight: 700;
  padding: 2px var(--space-2);
  border-radius: var(--radius-sm);
}

.product-detail__description {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin: 0 0 var(--space-5);
}

.product-detail__stock {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-5);
}

.stock--ok { color: var(--color-status-success); font-weight: 600; }
.stock--low { color: var(--color-promo); font-weight: 600; }

.product-detail__qty-row {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.product-detail__qty-label {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
}

.product-detail__qty-ctrl {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  padding: var(--space-1);
}

.qty-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: var(--radius-sm);
  font-size: var(--text-lg);
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: background-color var(--transition-fast);
}

.qty-btn:hover:not(:disabled) {
  background-color: var(--color-bg-subtle);
}

.qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-num {
  min-width: 32px;
  text-align: center;
  font-size: var(--text-base);
  font-weight: 600;
}

.product-detail__actions {
  display: flex;
  gap: var(--space-3);
  align-items: stretch;
}

.product-detail__add-btn {
  flex: 1;
  padding: var(--space-4);
  background-color: var(--color-accent-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  font-weight: 700;
  cursor: pointer;
  transition: background-color var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
}

.product-detail__add-btn:hover:not(:disabled) {
  background-color: var(--color-accent-hover);
}

.product-detail__add-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.product-detail__wish-btn {
  width: 52px;
  flex-shrink: 0;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  background: none;
  font-size: var(--text-xl);
  cursor: pointer;
  color: var(--color-text-muted);
  transition: all var(--transition-fast);
}

.product-detail__wish-btn:hover,
.product-detail__wish-btn.active {
  border-color: #ef4444;
  color: #ef4444;
}

.product-detail__not-found {
  text-align: center;
  padding: var(--space-16);
  color: var(--color-text-secondary);
}

.product-detail__not-found a {
  color: var(--color-accent-primary);
  text-decoration: none;
}
</style>
