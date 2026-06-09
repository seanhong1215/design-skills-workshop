<template>
  <Teleport to="body">
    <TransitionGroup name="toast" tag="div" class="toast-container">
      <div
        v-for="n in notificationStore.notifications"
        :key="n.id"
        class="toast"
        :class="`toast--${n.type}`"
      >
        {{ n.message }}
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup>
import { useNotificationStore } from '@/stores/notification.js'
const notificationStore = useNotificationStore()
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: var(--space-6);
  right: var(--space-6);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  pointer-events: none;
}

.toast {
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: 500;
  box-shadow: var(--shadow-lg);
  max-width: 320px;
  pointer-events: auto;
}

.toast--success {
  background-color: var(--color-status-success);
  color: #fff;
}

.toast--error {
  background-color: var(--color-status-error);
  color: #fff;
}

.toast--info {
  background-color: var(--color-accent-primary);
  color: #fff;
}

.toast--warning {
  background-color: var(--color-status-warning);
  color: #fff;
}

.toast-enter-active,
.toast-leave-active {
  transition: all var(--transition-normal);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
