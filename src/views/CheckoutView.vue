<template>
  <div class="checkout-page">
    <header class="checkout-header">
      <RouterLink :to="{ name: ROUTE_NAMES.HOME }" class="checkout-header__logo">ShopLab</RouterLink>
      <div class="checkout__steps">
        <div class="step step--done">
          <span class="step__dot"></span>
          <span class="step__label">購物車</span>
        </div>
        <ChevronRight :size="14" class="step__arrow" />
        <div class="step step--active">
          <span class="step__dot"></span>
          <span class="step__label">結帳</span>
        </div>
        <ChevronRight :size="14" class="step__arrow" />
        <div class="step">
          <span class="step__dot step__dot--empty"></span>
          <span class="step__label">完成</span>
        </div>
      </div>
    </header>
    <main class="checkout">
    <div class="checkout__inner">

      <h1 class="checkout__page-title">填寫收件資訊</h1>
      <div class="checkout__content">
        <div class="checkout__form-col">
          <CheckoutForm :form="checkoutStore.form" :errors="checkoutStore.errors" />

          <button
            class="checkout__submit-btn"
            :disabled="checkoutStore.orderStatus === 'submitting' || cartStore.cartItems.length === 0"
            @click="handleSubmit"
          >
            <Loader2 v-if="checkoutStore.orderStatus === 'submitting'" :size="18" class="checkout__spinner" />
            <template v-else>
              <Lock :size="16" /> 確認付款 NT$ {{ cartStore.total.toLocaleString() }}
            </template>
          </button>
          <p class="checkout__ssl-notice">
            <Lock :size="12" /> 使用 SSL 加密傳輸，交易安全有保障
          </p>
        </div>

        <aside class="checkout__order-summary">
          <h2 class="checkout__summary-title">訂單確認</h2>
          <div class="checkout__summary-items">
            <div v-for="item in cartStore.cartItems" :key="item.product.id" class="checkout__summary-item">
              <img :src="item.product.image" :alt="item.product.name" class="checkout__summary-img" />
              <div class="checkout__summary-item-info">
                <p class="checkout__summary-item-name">{{ item.product.name }}</p>
                <p class="checkout__summary-item-price">NT$ {{ (item.product.price * item.qty).toLocaleString() }}</p>
              </div>
            </div>
          </div>
          <div class="checkout__summary-divider"></div>
          <div class="checkout__summary-total">
            <span>總計</span>
            <span>NT${{ cartStore.total.toLocaleString() }}</span>
          </div>
        </aside>
      </div>
    </div>
  </main>
  </div>
</template>

<script setup>
import { useRouter, RouterLink } from 'vue-router'
import { Lock, ChevronRight, Loader2 } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cart.js'
import { useCheckoutStore } from '@/stores/checkout.js'
import { ROUTE_NAMES } from '@/constants/routes.js'
import CheckoutForm from '@/components/shop/CheckoutForm.vue'

const router = useRouter()
const cartStore = useCartStore()
const checkoutStore = useCheckoutStore()

async function handleSubmit() {
  const success = await checkoutStore.submitOrder()
  if (success) {
    cartStore.clearCart()
    router.push({ name: ROUTE_NAMES.PAYMENT_SUCCESS, query: { orderId: checkoutStore.orderId } })
  }
}
</script>

<style scoped>
.checkout-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-base);
}

.checkout-header {
  height: 60px;
  background-color: var(--color-bg-surface);
  border-bottom: 1px solid var(--color-border-default);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-8);
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

.checkout-header__logo {
  font-weight: 700;
  font-size: var(--text-lg);
  color: var(--color-text-primary);
  text-decoration: none;
}

.checkout__steps {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.step {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.step__dot {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: var(--color-accent-primary);
  flex-shrink: 0;
}

.step__dot--empty {
  background-color: #EEF0F2;
}

.step__label {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.step--done .step__label {
  color: var(--color-text-muted);
}

.step--active .step__label {
  color: var(--color-text-primary);
  font-weight: 600;
}

.step__arrow {
  color: var(--color-border-default);
  flex-shrink: 0;
}

.checkout {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-6);
  flex: 1;
}

.checkout__content {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: var(--space-8);
  align-items: start;
}

@media (max-width: 900px) {
  .checkout__content {
    grid-template-columns: 1fr;
  }
}

.checkout__form-col {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.checkout__submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-4);
  background-color: var(--color-accent-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  font-weight: 700;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.checkout__submit-btn:hover:not(:disabled) {
  background-color: var(--color-accent-hover);
}

.checkout__submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.checkout__spinner {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.checkout__page-title {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-6);
}

.checkout__ssl-notice {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  text-align: center;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.checkout__order-summary {
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  position: sticky;
  top: 80px;
}

.checkout__summary-title {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-4);
}

.checkout__summary-items {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.checkout__summary-item {
  display: flex;
  gap: var(--space-3);
  align-items: center;
}

.checkout__summary-img {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}

.checkout__summary-item-name {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}

.checkout__summary-item-price {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-price);
  margin: 0;
}

.checkout__summary-divider {
  border-top: 1px solid var(--color-border-default);
  margin: var(--space-4) 0;
}

.checkout__summary-total {
  display: flex;
  justify-content: space-between;
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text-primary);
}

.checkout__summary-total span:last-child {
  color: var(--color-price);
}
</style>
