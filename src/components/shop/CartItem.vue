<template>
  <div class="cart-item">
    <img :src="item.product.image" :alt="item.product.name" class="cart-item__image" />
    <div class="cart-item__info">
      <p class="cart-item__name">{{ item.product.name }}</p>
      <p class="cart-item__meta">{{ item.product.category }} · {{ item.qty }} 件</p>
    </div>
    <p class="cart-item__unit-price">NT${{ item.product.price.toLocaleString() }}</p>
    <div class="cart-item__qty">
      <button class="cart-item__qty-btn" @click="$emit('update-qty', item.product.id, item.qty - 1)" :disabled="item.qty <= 1">−</button>
      <span class="cart-item__qty-num">{{ item.qty }}</span>
      <button class="cart-item__qty-btn" @click="$emit('update-qty', item.product.id, item.qty + 1)" :disabled="item.qty >= item.product.stock">+</button>
    </div>
    <p class="cart-item__subtotal">NT${{ (item.product.price * item.qty).toLocaleString() }}</p>
    <button class="cart-item__remove" @click="$emit('remove', item.product.id)">刪除</button>
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
  padding: var(--space-5) 0;
  border-bottom: 1px solid var(--color-border-default);
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item__image {
  width: 64px;
  height: 64px;
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
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cart-item__meta {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin: 0;
}

.cart-item__unit-price {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0;
  min-width: 70px;
  text-align: right;
}

.cart-item__qty {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  padding: 2px var(--space-1);
}

.cart-item__qty-btn {
  width: 26px;
  height: 26px;
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
  min-width: 20px;
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
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  padding: var(--space-1) var(--space-2);
  transition: color var(--transition-fast);
  flex-shrink: 0;
}

.cart-item__remove:hover {
  color: var(--color-status-error);
  text-decoration: underline;
}
</style>
