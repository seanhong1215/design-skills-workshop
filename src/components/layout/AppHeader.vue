<template>
  <header class="header">
    <div class="header__inner">
      <RouterLink :to="{ name: ROUTE_NAMES.HOME }" class="header__logo">
        DesignSkill
      </RouterLink>
      <nav class="header__nav">
        <RouterLink :to="{ name: ROUTE_NAMES.HOME }">首頁</RouterLink>
        <RouterLink :to="{ name: ROUTE_NAMES.ABOUT }">關於</RouterLink>
      </nav>
      <AppButton size="sm" variant="ghost" @click="uiStore.toggleSidebar()">
        選單
      </AppButton>
    </div>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useUiStore } from '@/stores/ui.js'
import { ROUTE_NAMES } from '@/constants/routes.js'
import AppButton from '@/components/common/AppButton.vue'

const uiStore = useUiStore()
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--color-bg-surface);
  border-bottom: 1px solid var(--color-border-default);
}

.header__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-6);
  height: 60px;
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.header__logo {
  font-weight: 700;
  font-size: var(--text-lg);
  color: var(--color-text-primary);
}

.header__nav {
  display: flex;
  gap: var(--space-6);
  flex: 1;
}

.header__nav a {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  transition: color var(--transition-fast);
}

.header__nav a:hover,
.header__nav a.router-link-active {
  color: var(--color-text-primary);
  text-decoration: none;
}
</style>
