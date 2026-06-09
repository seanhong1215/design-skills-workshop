<template>
  <div class="checkout-form">
    <h2 class="checkout-form__title">填寫收件資訊</h2>

    <section class="checkout-form__section">
      <h3 class="checkout-form__section-title">收件人資訊</h3>
      <div class="checkout-form__field">
        <label class="checkout-form__label" for="cf-name">姓名 *</label>
        <input
          id="cf-name"
          v-model="form.name"
          class="checkout-form__input"
          :class="{ 'checkout-form__input--error': errors.name }"
          type="text"
          placeholder="請輸入真實姓名"
        />
        <p v-if="errors.name" class="checkout-form__error">{{ errors.name }}</p>
      </div>
      <div class="checkout-form__field">
        <label class="checkout-form__label" for="cf-phone">電話 *</label>
        <input
          id="cf-phone"
          v-model="form.phone"
          class="checkout-form__input"
          :class="{ 'checkout-form__input--error': errors.phone }"
          type="tel"
          placeholder="0912-345-678"
        />
        <p v-if="errors.phone" class="checkout-form__error">{{ errors.phone }}</p>
      </div>
      <div class="checkout-form__field">
        <label class="checkout-form__label" for="cf-address">地址 *</label>
        <input
          id="cf-address"
          v-model="form.address"
          class="checkout-form__input"
          :class="{ 'checkout-form__input--error': errors.address }"
          type="text"
          placeholder="台北市信義區信義路五段7號"
        />
        <p v-if="errors.address" class="checkout-form__error">{{ errors.address }}</p>
      </div>
    </section>

    <section class="checkout-form__section">
      <h3 class="checkout-form__section-title">付款方式</h3>
      <label class="checkout-form__radio">
        <input v-model="form.paymentMethod" type="radio" value="credit" />
        <span class="checkout-form__radio-label">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          信用卡 / 金融卡
        </span>
      </label>
      <label class="checkout-form__radio">
        <input v-model="form.paymentMethod" type="radio" value="atm" />
        <span class="checkout-form__radio-label">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          銀行轉帳（ATM）
        </span>
      </label>
    </section>
  </div>
</template>

<script setup>
defineProps({
  form: { type: Object, required: true },
  errors: { type: Object, default: () => ({}) }
})
</script>

<style scoped>
.checkout-form__title {
  font-size: var(--text-xl);
  font-weight: 700;
  margin: 0 0 var(--space-6);
  color: var(--color-text-primary);
}

.checkout-form__section {
  margin-bottom: var(--space-8);
}

.checkout-form__section-title {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-4);
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--color-border-default);
}

.checkout-form__field {
  margin-bottom: var(--space-4);
}

.checkout-form__label {
  display: block;
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-2);
}

.checkout-form__input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  color: var(--color-text-primary);
  background-color: var(--color-bg-surface);
  transition: border-color var(--transition-fast);
  box-sizing: border-box;
}

.checkout-form__input:focus {
  outline: none;
  border-color: var(--color-accent-primary);
  box-shadow: 0 0 0 3px var(--color-accent-subtle);
}

.checkout-form__input--error {
  border-color: var(--color-status-error);
}

.checkout-form__error {
  margin: var(--space-1) 0 0;
  font-size: var(--text-xs);
  color: var(--color-status-error);
}

.checkout-form__radio {
  display: flex;
  align-items: center;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-3);
  cursor: pointer;
  transition: border-color var(--transition-fast), background-color var(--transition-fast);
}

.checkout-form__radio:has(input:checked) {
  border-color: var(--color-accent-primary);
  background-color: var(--color-accent-subtle);
}

.checkout-form__radio input {
  margin-right: var(--space-3);
  accent-color: var(--color-accent-primary);
}

.checkout-form__radio-label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-primary);
}
</style>
