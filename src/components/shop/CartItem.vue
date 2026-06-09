<template>
  <div class="cart-item">
    <img :src="item.product.image" :alt="item.product.name" class="cart-item__image" />
    <div class="cart-item__info">
      <p class="cart-item__name">{{ item.product.name }}</p>
      <p class="cart-item__price">NT${{ item.product.price.toLocaleString() }}</p>
    </div>
    <div class="cart-item__qty">
      <button class="cart-item__qty-btn" @click="$emit('update-qty', item.product.id, item.qty - 1)" :disabled="item.qty <= 1">−</button>
      <span class="cart-item__qty-num">{{ item.qty }}</span>
      <button class="cart-item__qty-btn" @click="$emit('update-qty', item.product.id, item.qty + 1)" :disabled="item.qty >= item.product.stock">+</button>
    </div>
    <p class="cart-item__subtotal">NT${{ (item.product.price * item.qty).toLocaleString() }}</p>
    <button class="cart-item__remove" @click="$emit('remove', item.product.id)" aria-label="移除">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
defineProps({
  item: { type: Object, required: true }
})
defineEmits(['update-qty', 'remove'])
</script>

<style scoped>
.cart-item {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4) 0;
  border-bottom: 1px solid var(--color-border-default);
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item__image {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: var(--radius-md);
  background-color: var(--color-bg-subtle);
  flex-shrink: 0;
}

.cart-item__info {
  flex: 1;
  min-width: 0;
}

.cart-item__name {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cart-item__price {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.cart-item__qty {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  padding: var(--space-1);
}

.cart-item__qty-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: var(--radius-sm);
  font-size: var(--text-base);
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: background-color var(--transition-fast);
}

.cart-item__qty-btn:hover:not(:disabled) {
  background-color: var(--color-bg-subtle);
  color: var(--color-text-primary);
}

.cart-item__qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.cart-item__qty-num {
  min-width: 24px;
  text-align: center;
  font-size: var(--text-sm);
  font-weight: 600;
}

.cart-item__subtotal {
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--color-price);
  margin: 0;
  min-width: 80px;
  text-align: right;
}

.cart-item__remove {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-muted);
  padding: var(--space-2);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color var(--transition-fast);
}

.cart-item__remove:hover {
  color: var(--color-status-error);
}
</style>
