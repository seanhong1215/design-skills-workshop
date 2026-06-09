<template>
  <main class="payment-success">
    <div class="payment-success__inner">
      <div class="payment-success__check">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>

      <h1 class="payment-success__title">付款成功！</h1>
      <p class="payment-success__subtitle">感謝您的訂購，我們將盡快為您處理。</p>

      <div class="payment-success__card">
        <p class="payment-success__label">訂單編號</p>
        <p class="payment-success__order-id">{{ orderId }}</p>
        <div class="payment-success__card-divider"></div>
        <div class="payment-success__card-row">
          <span>訂單金額</span>
          <span class="payment-success__amount">NT${{ amount }}</span>
        </div>
        <p class="payment-success__email-notice">
          訂單確認信已發送至您的信箱，請注意查收。
        </p>
      </div>

      <div class="payment-success__actions">
        <RouterLink :to="{ name: ROUTE_NAMES.PRODUCT_LIST }" class="payment-success__btn payment-success__btn--primary">
          繼續購物
        </RouterLink>
        <RouterLink :to="{ name: ROUTE_NAMES.HOME }" class="payment-success__btn payment-success__btn--outline">
          回到首頁
        </RouterLink>
      </div>

      <p class="payment-success__countdown">
        {{ countdown }} 秒後自動返回首頁
      </p>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, RouterLink, useRouter } from 'vue-router'
import { useCheckoutStore } from '@/stores/checkout.js'
import { ROUTE_NAMES } from '@/constants/routes.js'

const route = useRoute()
const router = useRouter()
const checkoutStore = useCheckoutStore()

const orderId = ref(route.query.orderId ?? `SL-${Date.now()}`)
const amount = ref(route.query.amount ?? '—')
const countdown = ref(5)

let timer = null

onMounted(() => {
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      checkoutStore.resetOrder()
      router.push({ name: ROUTE_NAMES.HOME })
    }
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.payment-success {
  min-height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8) var(--space-6);
  background-color: var(--color-bg-base);
}

.payment-success__inner {
  max-width: 480px;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-5);
}

.payment-success__check {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-full);
  background-color: #dcfce7;
  color: var(--color-status-success);
  display: flex;
  align-items: center;
  justify-content: center;
}

.payment-success__title {
  font-size: var(--text-3xl);
  font-weight: 800;
  color: var(--color-text-primary);
  margin: 0;
}

.payment-success__subtitle {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  margin: 0;
}

.payment-success__card {
  width: 100%;
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.payment-success__label {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.payment-success__order-id {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
  font-family: var(--font-mono);
}

.payment-success__card-divider {
  border-top: 1px solid var(--color-border-default);
}

.payment-success__card-row {
  display: flex;
  justify-content: space-between;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.payment-success__amount {
  font-weight: 700;
  color: var(--color-price);
}

.payment-success__email-notice {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin: 0;
}

.payment-success__actions {
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
  justify-content: center;
}

.payment-success__btn {
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: 600;
  text-decoration: none;
  transition: all var(--transition-fast);
}

.payment-success__btn--primary {
  background-color: var(--color-accent-primary);
  color: #fff;
}

.payment-success__btn--primary:hover {
  background-color: var(--color-accent-hover);
}

.payment-success__btn--outline {
  border: 2px solid var(--color-border-strong);
  color: var(--color-text-primary);
}

.payment-success__btn--outline:hover {
  border-color: var(--color-accent-primary);
  color: var(--color-accent-primary);
}

.payment-success__countdown {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin: 0;
}
</style>
