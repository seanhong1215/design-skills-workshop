<template>
  <article class="product-card" @click="$emit('click', product)">
    <div class="product-card__image-wrap">
      <img :src="product.image" :alt="product.name" class="product-card__image" loading="lazy" />
      <span v-if="discountPercent > 0" class="product-card__badge">-{{ discountPercent }}%</span>
    </div>
    <div class="product-card__body">
      <p class="product-card__category">{{ product.category }}</p>
      <h3 class="product-card__name">{{ product.name }}</h3>
      <div class="product-card__rating">
        <Star :size="12" fill="currentColor" class="product-card__stars" />
        <span>{{ product.rating }}</span>
        <span class="product-card__review-count">({{ product.reviewCount }})</span>
      </div>
      <div class="product-card__prices">
        <span class="product-card__price">NT${{ product.price.toLocaleString() }}</span>
        <span v-if="product.originalPrice > product.price" class="product-card__original">
          NT${{ product.originalPrice.toLocaleString() }}
        </span>
      </div>
      <button v-if="showCartBtn" class="product-card__btn" @click.stop="$emit('add-to-cart', product)">
        <ShoppingCart :size="14" /> 加入購物車
      </button>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { ShoppingCart, Star } from 'lucide-vue-next'

const props = defineProps({
  product: { type: Object, required: true },
  showCartBtn: { type: Boolean, default: true }
})

defineEmits(['click', 'add-to-cart'])

const discountPercent = computed(() => {
  if (!props.product.originalPrice || props.product.originalPrice <= props.product.price) return 0
  return Math.round((1 - props.product.price / props.product.originalPrice) * 100)
})
</script>

<style scoped>
.product-card {
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow var(--transition-fast), transform var(--transition-fast);
}

.product-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-4px);
}

.product-card__image-wrap {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  background-color: var(--color-bg-subtle);
}

.product-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 300ms ease;
}

.product-card:hover .product-card__image {
  transform: scale(1.05);
}

.product-card__btn:active {
  transform: scale(0.95);
  transition: transform 100ms ease;
}

.product-card__badge {
  position: absolute;
  top: var(--space-3);
  left: var(--space-3);
  background-color: var(--color-promo);
  color: #fff;
  font-size: var(--text-xs);
  font-weight: 700;
  padding: 2px var(--space-2);
  border-radius: var(--radius-sm);
}

.product-card__body {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.product-card__category {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin: 0;
}

.product-card__name {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  line-height: var(--leading-tight);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-card__rating {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.product-card__stars {
  color: var(--color-rating);
  flex-shrink: 0;
}

.product-card__review-count {
  color: var(--color-text-muted);
}

.product-card__prices {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
}

.product-card__price {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-price);
}

.product-card__original {
  font-size: var(--text-sm);
  color: var(--color-price-original);
  text-decoration: line-through;
}

.product-card__btn {
  margin-top: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background-color: var(--color-accent-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  width: 100%;
}

.product-card__btn:hover {
  background-color: var(--color-accent-hover);
}
</style>
