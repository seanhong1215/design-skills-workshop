<template>
  <main class="cart">
    <div class="cart__inner">
      <div class="cart__header">
        <h1 class="cart__title">購物車</h1>
        <span v-if="cartStore.cartItems.length > 0" class="cart__item-count">{{ cartStore.itemCount }} 件商品</span>
      </div>

      <div v-if="cartStore.cartItems.length > 0" class="cart__content">
        <section class="cart__items">
          <CartItem
            v-for="item in cartStore.cartItems"
            :key="item.product.id"
            :item="item"
            @update-qty="cartStore.updateQty"
            @remove="cartStore.removeItem"
          />
        </section>

        <aside class="cart__summary">
          <h2 class="cart__summary-title">訂單摘要</h2>
          <div class="cart__summary-rows">
            <div class="cart__summary-row">
              <span>商品小計</span>
              <span>NT${{ cartStore.subtotal.toLocaleString() }}</span>
            </div>
            <div class="cart__summary-row">
              <span>運費</span>
              <span class="cart__free-shipping">免費</span>
            </div>
            <div v-if="cartStore.discount > 0" class="cart__summary-row cart__summary-row--discount">
              <span>折扣</span>
              <span>– NT$ {{ cartStore.discount.toLocaleString() }}</span>
            </div>
          </div>
          <div class="cart__summary-total">
            <span>總計</span>
            <span>NT${{ cartStore.total.toLocaleString() }}</span>
          </div>
          <RouterLink :to="{ name: ROUTE_NAMES.CHECKOUT }" class="cart__checkout-btn">
            🔒 前往結帳
          </RouterLink>
          <RouterLink :to="{ name: ROUTE_NAMES.PRODUCT_LIST }" class="cart__continue-link">
            繼續購物
          </RouterLink>
        </aside>
      </div>

      <div v-else class="cart__empty">
        <div class="cart__empty-icon">🛒</div>
        <h2>購物車是空的</h2>
        <p>去商品列表挑選你喜歡的商品吧！</p>
        <RouterLink :to="{ name: ROUTE_NAMES.PRODUCT_LIST }" class="cart__shop-btn">
          前往購物
        </RouterLink>
      </div>
    </div>
  </main>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cart.js'
import { ROUTE_NAMES } from '@/constants/routes.js'
import CartItem from '@/components/shop/CartItem.vue'

const cartStore = useCartStore()
</script>

<style scoped>
.cart {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-6);
}

.cart__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-6);
}

.cart__title {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.cart__item-count {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.cart__content {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: var(--space-8);
  align-items: start;
}

@media (max-width: 900px) {
  .cart__content {
    grid-template-columns: 1fr;
  }
}

.cart__items {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.cart__summary {
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.cart__summary-title {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.cart__summary-rows {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.cart__summary-row {
  display: flex;
  justify-content: space-between;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.cart__summary-row--discount {
  color: var(--color-status-success);
}

.cart__summary-row--hint {
  font-size: var(--text-xs);
  color: var(--color-promo);
}

.cart__free-shipping {
  color: var(--color-status-success);
  font-weight: 600;
}

.cart__summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text-primary);
  padding-top: var(--space-4);
  border-top: 2px solid var(--color-border-default);
}

.cart__checkout-btn {
  display: block;
  text-align: center;
  padding: var(--space-4);
  background-color: var(--color-accent-primary);
  color: #fff;
  text-decoration: none;
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  font-weight: 700;
  transition: background-color var(--transition-fast);
}

.cart__checkout-btn:hover {
  background-color: var(--color-accent-hover);
}

.cart__continue-link {
  text-align: center;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  text-decoration: none;
}

.cart__continue-link:hover {
  color: var(--color-accent-primary);
}

.cart__empty {
  text-align: center;
  padding: var(--space-16);
  color: var(--color-text-secondary);
}

.cart__empty-icon {
  font-size: 4rem;
  margin-bottom: var(--space-4);
}

.cart__empty h2 {
  font-size: var(--text-xl);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.cart__shop-btn {
  display: inline-block;
  margin-top: var(--space-6);
  padding: var(--space-3) var(--space-8);
  background-color: var(--color-accent-primary);
  color: #fff;
  text-decoration: none;
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  font-weight: 600;
  transition: background-color var(--transition-fast);
}

.cart__shop-btn:hover {
  background-color: var(--color-accent-hover);
}
</style>
