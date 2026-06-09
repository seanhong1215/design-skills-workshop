<template>
  <span :class="['badge', `badge--${type}`]">
    <slot />
  </span>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'default',
    validator: v => ['default', 'success', 'warning', 'error', 'info'].includes(v)
  }
})
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 var(--space-2);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 500;
  white-space: nowrap;
}

.badge--default {
  background-color: var(--color-bg-subtle);
  color: var(--color-text-secondary);
}
.badge--success {
  background-color: #dcfce7;
  color: #15803d;
}
.badge--warning {
  background-color: #fef9c3;
  color: #a16207;
}
.badge--error {
  background-color: #fee2e2;
  color: #b91c1c;
}
.badge--info {
  background-color: var(--color-accent-subtle);
  color: var(--color-accent-primary);
}
</style>
