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
        <RouterLink :to="{ name: ROUTE_NAMES.CART }" class="header__cart">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <span v-if="cartStore.itemCount > 0" class="header__cart-badge">
            {{ cartStore.itemCount > 99 ? '99+' : cartStore.itemCount }}
          </span>
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
  gap: var(--space-4);
}

.header__cart {
  position: relative;
  display: flex;
  align-items: center;
  color: var(--color-text-secondary);
  text-decoration: none;
  padding: var(--space-2);
  border-radius: var(--radius-md);
  transition: color var(--transition-fast);
}

.header__cart:hover {
  color: var(--color-accent-primary);
}

.header__cart-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: var(--color-badge-bg);
  color: var(--color-badge-text);
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
