<template>
  <header class="header">
    <div class="header__inner">
      <RouterLink :to="{ name: ROUTE_NAMES.HOME }" class="header__logo">
        ShopLab
      </RouterLink>

      <nav class="header__nav">
        <RouterLink :to="{ name: ROUTE_NAMES.HOME }">首頁</RouterLink>
        <RouterLink :to="{ name: ROUTE_NAMES.PRODUCT_LIST }">全部商品</RouterLink>
        <RouterLink :to="{ name: ROUTE_NAMES.ABOUT }">關於</RouterLink>
      </nav>

      <div class="header__actions">
        <div class="header__search">
          <Search :size="14" class="header__search-icon" />
          <input
            v-model="searchQuery"
            class="header__search-input"
            type="text"
            placeholder="搜尋商品..."
            @keydown.enter="handleSearch"
          />
        </div>

        <!-- 收藏 -->
        <RouterLink :to="{ name: ROUTE_NAMES.WISHLIST }" class="header__icon-btn" aria-label="收藏清單">
          <Heart :size="20" />
          <span v-if="wishlistStore.count > 0" class="header__badge">{{ wishlistStore.count }}</span>
        </RouterLink>

        <!-- 購物車 -->
        <RouterLink :to="{ name: ROUTE_NAMES.CART }" class="header__icon-btn" aria-label="購物車">
          <ShoppingCart :size="20" />
          <span v-if="cartStore.itemCount > 0" class="header__badge">{{ cartStore.itemCount }}</span>
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { Search, ShoppingCart, Heart } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cart.js'
import { useWishlistStore } from '@/stores/wishlist.js'
import { ROUTE_NAMES } from '@/constants/routes.js'

const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const router = useRouter()
const searchQuery = ref('')

function handleSearch() {
  if (!searchQuery.value.trim()) return
  router.push({ name: ROUTE_NAMES.PRODUCT_LIST, query: { q: searchQuery.value.trim() } })
  searchQuery.value = ''
}
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--color-bg-surface);
  border-bottom: 1px solid var(--color-border-default);
}

.header__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-6);
  height: 60px;
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.header__logo {
  font-weight: 700;
  font-size: var(--text-lg);
  color: var(--color-text-primary);
  text-decoration: none;
  flex-shrink: 0;
}

.header__nav {
  display: flex;
  gap: var(--space-6);
  flex: 1;
}

.header__nav a {
  position: relative;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.header__nav a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--color-accent-primary);
  transition: width 150ms ease;
}

.header__nav a:hover,
.header__nav a.router-link-active {
  color: var(--color-text-primary);
}

.header__nav a.router-link-active::after {
  width: 100%;
}

.header__actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

/* Search */
.header__search {
  position: relative;
  display: flex;
  align-items: center;
}

.header__search-icon {
  position: absolute;
  left: var(--space-3);
  color: var(--color-text-muted);
  pointer-events: none;
  display: flex;
}

.header__search-input {
  padding: var(--space-2) var(--space-3) var(--space-2) var(--space-8);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  background-color: var(--color-bg-subtle);
  width: 180px;
  transition: border-color var(--transition-fast), width var(--transition-fast);
}

.header__search-input:focus {
  outline: none;
  border-color: var(--color-accent-primary);
  width: 220px;
  background-color: var(--color-bg-surface);
}

/* Icon buttons (Heart / Cart) */
.header__icon-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: background-color var(--transition-fast), color var(--transition-fast);
}

.header__icon-btn:hover {
  background-color: var(--color-bg-subtle);
  color: var(--color-text-primary);
}

.header__icon-btn.router-link-active {
  color: var(--color-accent-primary);
}

/* Badge */
.header__badge {
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 16px;
  height: 16px;
  background-color: var(--color-accent-primary);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
}
</style>
