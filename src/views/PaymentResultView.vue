<template>
  <div class="result-page">
    <header class="result-header">
      <RouterLink :to="{ name: ROUTE_NAMES.HOME }" class="result-header__logo">ShopLab</RouterLink>
      <RouterLink :to="{ name: ROUTE_NAMES.HOME }" class="result-header__orders">我的訂單</RouterLink>
    </header>

    <main class="result-main">
      <div class="result-inner">

        <!-- 付款成功（含驗證中） -->
        <template v-if="status === 'success' || status === 'confirming'">
          <div class="result-icon" :class="status === 'success' ? 'result-icon--success' : 'result-icon--confirming'">
            <Check v-if="status === 'success'" :size="36" stroke-width="2.5" />
            <Loader2 v-else :size="32" class="result-spin" />
          </div>
          <h1 class="result-title">{{ status === 'success' ? '付款成功！' : '訂單建立中...' }}</h1>

          <div class="result-card">
            <p class="result-card__top">{{ status === 'success' ? '訂單已成立' : '正在確認交易狀態' }}</p>
            <div class="result-card__row result-card__row--center">
              <span class="result-card__label">訂單編號</span>
              <span class="result-card__id">{{ tradeNo }}</span>
            </div>
            <div v-if="tradeAmt" class="result-card__row">
              <span>付款金額</span>
              <span class="result-card__amount">NT$ {{ Number(tradeAmt).toLocaleString() }}</span>
            </div>
            <div v-if="paymentDate" class="result-card__row">
              <span>付款時間</span>
              <span>{{ paymentDate }}</span>
            </div>
            <div class="result-card__divider"></div>
            <p class="result-card__notice"><Mail :size="13" /> 確認信已寄至您的信箱</p>
          </div>

          <div v-if="status === 'success'" class="result-actions">
            <RouterLink :to="{ name: ROUTE_NAMES.PRODUCT_LIST }" class="result-btn result-btn--primary">
              <ShoppingBag :size="16" /> 繼續購物
            </RouterLink>
            <RouterLink :to="{ name: ROUTE_NAMES.HOME }" class="result-btn result-btn--outline">
              <Receipt :size="16" /> 查看訂單
            </RouterLink>
          </div>
        </template>

        <!-- 付款失敗 -->
        <template v-else-if="status === 'failed'">
          <div class="result-icon result-icon--failed">
            <XCircle :size="36" />
          </div>
          <h1 class="result-title">付款未完成</h1>
          <p class="result-desc">交易狀態：{{ statusMessage }}，請重新下單或聯繫客服</p>

          <div class="result-actions">
            <RouterLink :to="{ name: ROUTE_NAMES.CART }" class="result-btn result-btn--primary">
              返回購物車
            </RouterLink>
            <RouterLink :to="{ name: ROUTE_NAMES.HOME }" class="result-btn result-btn--outline">
              回首頁
            </RouterLink>
          </div>
        </template>

        <!-- 查詢錯誤 / 無 tradeNo -->
        <template v-else>
          <div class="result-icon result-icon--failed">
            <AlertCircle :size="36" />
          </div>
          <h1 class="result-title">無法取得付款結果</h1>
          <p class="result-desc">{{ errorMessage }}</p>

          <div class="result-actions">
            <RouterLink :to="{ name: ROUTE_NAMES.HOME }" class="result-btn result-btn--primary">
              回首頁
            </RouterLink>
          </div>
        </template>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { Check, XCircle, AlertCircle, Loader2, Mail, ShoppingBag, Receipt } from 'lucide-vue-next'
import { queryPaymentResult } from '@/services/ecpay.js'
import { ROUTE_NAMES } from '@/constants/routes.js'

const route = useRoute()

const tradeNo = ref(route.query.tradeNo ?? '')
const tradeAmt = ref(route.query.amount ?? '')
const paymentDate = ref('')
// confirming = 有訂單資訊但尚未 API 驗證；success = 已驗證；failed / error = 異常
const status = ref('error')
const statusMessage = ref('')
const errorMessage = ref('')

const MAX_RETRY = 5
const RETRY_DELAY = 2000

function getCacheKey() {
  return tradeNo.value ? `ecpay_paid_${tradeNo.value}` : null
}

function restoreFromCache() {
  const key = getCacheKey()
  if (!key) return false
  try {
    const cached = sessionStorage.getItem(key)
    if (!cached) return false
    const { amt, date } = JSON.parse(cached)
    tradeAmt.value = amt
    paymentDate.value = date
    status.value = 'success'
    return true
  } catch {
    return false
  }
}

function saveToCache(amt, date) {
  const key = getCacheKey()
  if (!key) return
  try {
    sessionStorage.setItem(key, JSON.stringify({ amt, date }))
  } catch { /* 忽略 */ }
}

async function verifyPayment(retryCount = 0) {
  try {
    const result = await queryPaymentResult(tradeNo.value)

    if (result.isPaid) {
      const amt = result.tradeAmt || tradeAmt.value
      const date = result.paymentDate || ''
      tradeAmt.value = amt
      paymentDate.value = date
      saveToCache(amt, date)
      status.value = 'success'
      return
    }

    if (result.tradeStatus === '0' && retryCount < MAX_RETRY) {
      await new Promise(r => setTimeout(r, RETRY_DELAY))
      return verifyPayment(retryCount + 1)
    }

    statusMessage.value = result.tradeStatus === '10200095' ? '付款失敗' : `代碼 ${result.tradeStatus}`
    status.value = 'failed'
  } catch {
    if (retryCount < MAX_RETRY) {
      await new Promise(r => setTimeout(r, RETRY_DELAY))
      return verifyPayment(retryCount + 1)
    }
    // 背景驗證失敗但已顯示 confirming，保守地降為 error
    if (status.value === 'confirming') {
      status.value = 'error'
      errorMessage.value = '無法連線至付款查詢服務，請聯繫客服確認訂單狀態'
    }
  }
}

onMounted(() => {
  if (!tradeNo.value) {
    status.value = 'error'
    errorMessage.value = '缺少訂單編號，請從購物流程重新付款'
    return
  }

  // 已快取（重複進入）→ 直接顯示成功，不重複動畫
  if (restoreFromCache()) return

  // 第一次從 ECPay 導回：立即顯示訂單資訊，背景驗證
  status.value = 'confirming'
  verifyPayment()
})
</script>

<style scoped>
.result-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-base);
}

.result-header {
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

.result-header__logo {
  font-weight: 700;
  font-size: var(--text-lg);
  color: var(--color-text-primary);
  text-decoration: none;
}

.result-header__orders {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.result-header__orders:hover {
  color: var(--color-accent-primary);
}

.result-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8) var(--space-6);
}

.result-inner {
  max-width: 460px;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-5);
}

/* Icon circle */
.result-icon {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: scaleIn 400ms ease forwards;
}

.result-icon--confirming {
  background-color: var(--color-bg-subtle);
  color: var(--color-accent-primary);
}

.result-icon--success {
  background-color: #dcfce7;
  color: var(--color-status-success);
}

.result-icon--failed {
  background-color: #fee2e2;
  color: var(--color-status-error);
}

@keyframes scaleIn {
  from { transform: scale(0); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}

.result-spin {
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.result-title {
  font-size: var(--text-3xl);
  font-weight: 800;
  color: var(--color-text-primary);
  margin: 0;
}

.result-desc {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0;
  line-height: var(--leading-relaxed);
}

/* Info card */
.result-card {
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

.result-card__top {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  text-align: center;
  margin: 0;
}

.result-card__row {
  display: flex;
  justify-content: space-between;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.result-card__row--center {
  justify-content: center;
  gap: var(--space-2);
}

.result-card__label {
  color: var(--color-text-secondary);
}

.result-card__id {
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--color-text-primary);
  font-family: var(--font-mono);
}

.result-card__amount {
  font-weight: 700;
  color: var(--color-price);
}

.result-card__divider {
  border-top: 1px solid var(--color-border-default);
}

.result-card__notice {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  text-align: center;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

/* Action buttons */
.result-actions {
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
  justify-content: center;
}

.result-btn {
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

.result-btn--primary {
  background-color: var(--color-accent-primary);
  color: #fff;
}

.result-btn--primary:hover {
  background-color: var(--color-accent-hover);
}

.result-btn--outline {
  border: 2px solid var(--color-border-strong);
  color: var(--color-text-primary);
}

.result-btn--outline:hover {
  border-color: var(--color-accent-primary);
  color: var(--color-accent-primary);
}
</style>
