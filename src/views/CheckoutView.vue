<template>
  <main class="checkout">
    <div class="checkout__inner">
      <div class="checkout__header">
        <div class="checkout__steps">
          <span class="checkout__step checkout__step--done">● 訂購中</span>
          <span class="checkout__step-sep">—</span>
          <span class="checkout__step checkout__step--active">● 填寫</span>
          <span class="checkout__step-sep">—</span>
          <span class="checkout__step">○ 完成</span>
        </div>
      </div>

      <div class="checkout__content">
        <div class="checkout__form-col">
          <CheckoutForm :form="checkoutStore.form" :errors="checkoutStore.errors" />

          <button
            class="checkout__submit-btn"
            :disabled="checkoutStore.orderStatus === 'submitting' || cartStore.cartItems.length === 0"
            @click="handleSubmit"
          >
            <span v-if="checkoutStore.orderStatus === 'submitting'" class="checkout__spinner">⟳</span>
            {{ checkoutStore.orderStatus === 'submitting' ? '處理中...' : `確認付款 NT$${cartStore.total.toLocaleString()}` }}
          </button>
          <p class="checkout__ssl-notice">
            🔒 以 SSL 加密保護您的付款資訊，交易安全有保障
          </p>
        </div>

        <aside class="checkout__order-summary">
          <h2 class="checkout__summary-title">訂單確認</h2>
          <div class="checkout__summary-items">
            <div v-for="item in cartStore.cartItems" :key="item.product.id" class="checkout__summary-item">
              <img :src="item.product.image" :alt="item.product.name" class="checkout__summary-img" />
              <div class="checkout__summary-item-info">
                <p class="checkout__summary-item-name">{{ item.product.name }}</p>
                <p class="checkout__summary-item-price">NT${{ item.product.price.toLocaleString() }} × {{ item.qty }}</p>
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
</template>

<script setup>
import { useRouter } from 'vue-router'
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
.checkout {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-6);
}

.checkout__header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: var(--space-6);
}

.checkout__steps {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.checkout__step {
  font-size: var(--text-xs);
}

.checkout__step-sep {
  color: var(--color-border-default);
  font-size: var(--text-xs);
}

.checkout__step--done {
  color: var(--color-status-success);
  font-weight: 600;
}

.checkout__step--active {
  color: var(--color-accent-primary);
  font-weight: 700;
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
  display: inline-block;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.checkout__ssl-notice {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  text-align: center;
  margin: 0;
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
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
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
</style>
