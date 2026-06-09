<template>
  <button
    :class="['btn', `btn--${variant}`, `btn--${size}`]"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: v => ['primary', 'secondary', 'ghost'].includes(v)
  },
  size: {
    type: String,
    default: 'md',
    validator: v => ['sm', 'md', 'lg'].includes(v)
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-family: var(--font-sans);
  font-weight: 500;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  cursor: pointer;
  transition: background-color var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
  white-space: nowrap;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Sizes */
.btn--sm { height: 32px; padding: 0 var(--space-3); font-size: var(--text-sm); }
.btn--md { height: 40px; padding: 0 var(--space-5); font-size: var(--text-sm); }
.btn--lg { height: 48px; padding: 0 var(--space-6); font-size: var(--text-base); }

/* Variants */
.btn--primary {
  background-color: var(--color-accent-primary);
  color: var(--color-text-inverse);
}
.btn--primary:hover:not(:disabled) {
  background-color: var(--color-accent-hover);
}

.btn--secondary {
  background-color: var(--color-accent-subtle);
  color: var(--color-accent-primary);
  border-color: var(--color-accent-primary);
}
.btn--secondary:hover:not(:disabled) {
  background-color: var(--color-accent-primary);
  color: var(--color-text-inverse);
}

.btn--ghost {
  background-color: transparent;
  color: var(--color-text-primary);
}
.btn--ghost:hover:not(:disabled) {
  background-color: var(--color-bg-subtle);
}
</style>
