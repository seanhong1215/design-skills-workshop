<template>
  <main class="not-found">
    <p class="not-found__code">404</p>
    <h1>找不到頁面</h1>
    <p>您要找的頁面不存在或已被移除。</p>
    <AppButton @click="router.push({ name: ROUTE_NAMES.HOME })">回到首頁</AppButton>
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ROUTE_NAMES } from '@/constants/routes.js'
import AppButton from '@/components/common/AppButton.vue'

const router = useRouter()
</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  text-align: center;
  padding: var(--space-8);
  gap: var(--space-4);
}

.not-found__code {
  font-size: var(--text-4xl);
  font-weight: 700;
  color: var(--color-accent-primary);
}

h1 {
  font-size: var(--text-2xl);
}

p {
  color: var(--color-text-secondary);
}
</style>
