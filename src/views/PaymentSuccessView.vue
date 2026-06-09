<template>
  <div class="success-page">
    <header class="success-header">
      <RouterLink :to="{ name: ROUTE_NAMES.HOME }" class="success-header__logo">ShopLab</RouterLink>
      <RouterLink :to="{ name: ROUTE_NAMES.HOME }" class="success-header__orders">我的訂單</RouterLink>
    </header>

    <main class="payment-success">
      <div class="payment-success__inner">
        <div class="payment-success__check">
          <Check :size="32" stroke-width="2.5" />
        </div>

        <h1 class="payment-success__title">付款成功！</h1>

        <div class="payment-success__card">
          <p class="payment-success__card-top">訂單已成立</p>
          <div class="payment-success__order-row">
            <span class="payment-success__order-label">訂單編號</span>
            <span class="payment-success__order-id">{{ orderId }}</span>
          </div>
          <div class="payment-success__card-row">
            <span>付款金額</span>
            <span class="payment-success__amount">NT$ {{ amount }}</span>
          </div>
          <div class="payment-success__card-divider"></div>
          <p class="payment-success__email-notice">
            <Mail :size="14" /> 確認信已寄至 user@example.com
          </p>
        </div>

        <div class="payment-success__actions">
          <RouterLink :to="{ name: ROUTE_NAMES.PRODUCT_LIST }" class="payment-success__btn payment-success__btn--primary">
            <ShoppingBag :size="16" /> 繼續購物
          </RouterLink>
          <RouterLink :to="{ name: ROUTE_NAMES.HOME }" class="payment-success__btn payment-success__btn--outline">
            <Receipt :size="16" /> 查看訂單
          </RouterLink>
        </div>

        <div class="payment-success__countdown">
          <Clock :size="14" />
          5 秒後自動返回首頁
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { Check, Mail, ShoppingBag, Receipt, Clock } from 'lucide-vue-next'
import { ROUTE_NAMES } from '@/constants/routes.js'

const route = useRoute()
const orderId = ref(route.query.orderId ?? `SL-${Date.now()}`)
const amount = ref(route.query.amount ? Number(route.query.amount).toLocaleString() : '3,580')
</script>

<style scoped>
.success-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-base);
}

.success-header {
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
}

.success-header__logo {
  font-weight: 700;
  font-size: var(--text-lg);
  color: var(--color-text-primary);
  text-decoration: none;
}

.success-header__orders {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.success-header__orders:hover {
  color: var(--color-accent-primary);
}

.payment-success {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8) var(--space-6);
}

.payment-success__inner {
  max-width: 460px;
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
  animation: scaleIn 400ms ease forwards;
}

@keyframes scaleIn {
  from { transform: scale(0); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}

.payment-success__title {
  font-size: var(--text-3xl);
  font-weight: 800;
  color: var(--color-text-primary);
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
  text-align: left;
}

.payment-success__card-top {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  text-align: center;
  margin: 0;
}

.payment-success__order-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
}

.payment-success__order-label {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.payment-success__order-id {
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--color-text-primary);
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
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.payment-success__actions {
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
  justify-content: center;
}

.payment-success__btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 14px 28px;
  border-radius: 9999px;
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
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin: 0;
}
</style>
