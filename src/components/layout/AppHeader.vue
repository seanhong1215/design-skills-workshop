<template>
  <header class="header">
    <div class="header__inner">
      <RouterLink :to="{ name: ROUTE_NAMES.HOME }" class="header__logo">
        ShopLab
      </RouterLink>
      <nav class="header__nav">
        <RouterLink :to="{ name: ROUTE_NAMES.HOME }">首頁</RouterLink>
        <RouterLink :to="{ name: ROUTE_NAMES.PRODUCT_LIST }">商品</RouterLink>
      </nav>
      <div class="header__actions">
        <RouterLink :to="{ name: ROUTE_NAMES.CART }" class="header__cart-btn">
          購物車{{ cartStore.itemCount > 0 ? ` (${cartStore.itemCount})` : '' }}
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cart.js'
import { ROUTE_NAMES } from '@/constants/routes.js'

const cartStore = useCartStore()
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
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.header__nav a:hover,
.header__nav a.router-link-active {
  color: var(--color-text-primary);
}

.header__actions {
  display: flex;
  align-items: center;
}

.header__cart-btn {
  display: inline-flex;
  align-items: center;
  padding: var(--space-2) var(--space-5);
  background-color: var(--color-accent-primary);
  color: #fff;
  font-size: var(--text-sm);
  font-weight: 600;
  border-radius: var(--radius-full);
  text-decoration: none;
  transition: background-color var(--transition-fast);
  white-space: nowrap;
}

.header__cart-btn:hover {
  background-color: var(--color-accent-hover);
}
</style>
