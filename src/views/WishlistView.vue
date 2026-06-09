<template>
  <main class="wishlist">
    <nav class="wishlist__breadcrumb">
      <RouterLink :to="{ name: ROUTE_NAMES.HOME }">首頁</RouterLink>
      <span>/</span>
      <span>收藏清單</span>
    </nav>

    <div class="wishlist__head">
      <h1 class="wishlist__title">收藏清單</h1>
      <p class="wishlist__count">{{ wishlistStore.count }} 件商品</p>
    </div>

    <!-- 有商品 -->
    <div v-if="wishlistStore.items.length > 0" class="wishlist__list">
      <div
        v-for="product in wishlistStore.items"
        :key="product.id"
        class="wishlist-item"
      >
        <RouterLink :to="{ name: ROUTE_NAMES.PRODUCT_DETAIL, params: { id: product.id } }" class="wishlist-item__image-wrap">
          <img :src="product.image" :alt="product.name" class="wishlist-item__image" />
        </RouterLink>

        <div class="wishlist-item__body">
          <p class="wishlist-item__category">{{ product.category }}</p>
          <RouterLink :to="{ name: ROUTE_NAMES.PRODUCT_DETAIL, params: { id: product.id } }" class="wishlist-item__name">
            {{ product.name }}
          </RouterLink>
          <div class="wishlist-item__prices">
            <span class="wishlist-item__price">NT${{ product.price.toLocaleString() }}</span>
            <span v-if="product.originalPrice > product.price" class="wishlist-item__original">
              NT${{ product.originalPrice.toLocaleString() }}
            </span>
          </div>
        </div>

        <div class="wishlist-item__actions">
          <button class="wishlist-item__cart-btn" @click="handleAddToCart(product)">
            <ShoppingCart :size="15" /> 加入購物車
          </button>
          <button class="wishlist-item__remove-btn" @click="handleRemove(product)" aria-label="移除收藏">
            <Trash2 :size="15" /> 移除
          </button>
        </div>
      </div>
    </div>

    <!-- 空狀態 -->
    <div v-else class="wishlist__empty">
      <Heart :size="48" class="wishlist__empty-icon" />
      <h2 class="wishlist__empty-title">收藏清單是空的</h2>
      <p class="wishlist__empty-desc">瀏覽商品並點擊愛心，將喜歡的商品加入收藏</p>
      <RouterLink :to="{ name: ROUTE_NAMES.PRODUCT_LIST }" class="wishlist__empty-btn">
        瀏覽商品
      </RouterLink>
    </div>
  </main>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { ShoppingCart, Trash2, Heart } from 'lucide-vue-next'
import { useWishlistStore } from '@/stores/wishlist.js'
import { useCartStore } from '@/stores/cart.js'
import { useNotificationStore } from '@/stores/notification.js'
import { ROUTE_NAMES } from '@/constants/routes.js'

const wishlistStore = useWishlistStore()
const cartStore = useCartStore()
const notificationStore = useNotificationStore()

function handleAddToCart(product) {
  cartStore.addItem(product, 1)
  notificationStore.success(`「${product.name}」已加入購物車`)
}

function handleRemove(product) {
  wishlistStore.remove(product.id)
  notificationStore.info(`「${product.name}」已移除收藏`)
}
</script>

<style scoped>
.wishlist {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-6);
}

.wishlist__breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin-bottom: var(--space-4);
}

.wishlist__breadcrumb a {
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.wishlist__breadcrumb a:hover {
  color: var(--color-accent-primary);
}

.wishlist__head {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
  margin-bottom: var(--space-8);
}

.wishlist__title {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.wishlist__count {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin: 0;
}

/* 商品列表 */
.wishlist__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.wishlist-item {
  display: grid;
  grid-template-columns: 100px 1fr auto;
  gap: var(--space-5);
  align-items: center;
  padding: var(--space-4) var(--space-5);
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  transition: box-shadow var(--transition-fast);
}

.wishlist-item:hover {
  box-shadow: var(--shadow-md);
}

@media (max-width: 600px) {
  .wishlist-item {
    grid-template-columns: 80px 1fr;
    grid-template-rows: auto auto;
  }
  .wishlist-item__actions {
    grid-column: 1 / -1;
    flex-direction: row;
  }
}

.wishlist-item__image-wrap {
  display: block;
  aspect-ratio: 1;
  border-radius: var(--radius-md);
  overflow: hidden;
  background-color: var(--color-bg-subtle);
  flex-shrink: 0;
}

.wishlist-item__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.wishlist-item__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  min-width: 0;
}

.wishlist-item__category {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin: 0;
}

.wishlist-item__name {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text-primary);
  text-decoration: none;
  line-height: var(--leading-tight);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.wishlist-item__name:hover {
  color: var(--color-accent-primary);
}

.wishlist-item__prices {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
  margin-top: var(--space-1);
}

.wishlist-item__price {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-price);
}

.wishlist-item__original {
  font-size: var(--text-sm);
  color: var(--color-price-original);
  text-decoration: line-through;
}

.wishlist-item__actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  flex-shrink: 0;
}

.wishlist-item__cart-btn,
.wishlist-item__remove-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.wishlist-item__cart-btn {
  background-color: var(--color-accent-primary);
  color: #fff;
  border: none;
}

.wishlist-item__cart-btn:hover {
  background-color: var(--color-accent-hover);
}

.wishlist-item__remove-btn {
  background: none;
  border: 1px solid var(--color-border-default);
  color: var(--color-text-secondary);
}

.wishlist-item__remove-btn:hover {
  border-color: var(--color-status-error);
  color: var(--color-status-error);
}

/* 空狀態 */
.wishlist__empty {
  text-align: center;
  padding: var(--space-16) var(--space-6);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

.wishlist__empty-icon {
  color: var(--color-border-default);
}

.wishlist__empty-title {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.wishlist__empty-desc {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.wishlist__empty-btn {
  margin-top: var(--space-2);
  padding: var(--space-3) var(--space-8);
  background-color: var(--color-accent-primary);
  color: #fff;
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  font-weight: 600;
  text-decoration: none;
  transition: background-color var(--transition-fast);
}

.wishlist__empty-btn:hover {
  background-color: var(--color-accent-hover);
}
</style>
