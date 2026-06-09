<template>
  <main class="home">
    <section class="home__hero">
      <h1 class="home__title">DesignSkill</h1>
      <p class="home__subtitle">Vue3 + Pinia 設計學習專案</p>
      <div class="home__actions">
        <AppButton @click="goToAbout">關於專案</AppButton>
        <AppButton variant="secondary" @click="toggleTheme">切換主題</AppButton>
      </div>
    </section>

    <section class="home__cards">
      <AppCard v-for="card in featureCards" :key="card.title">
        <h3>{{ card.title }}</h3>
        <p>{{ card.description }}</p>
      </AppCard>
    </section>
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUiStore } from '@/stores/ui.js'
import { ROUTE_NAMES } from '@/constants/routes.js'
import { THEME } from '@/constants/status.js'
import AppButton from '@/components/common/AppButton.vue'
import AppCard from '@/components/common/AppCard.vue'

const router = useRouter()
const uiStore = useUiStore()

const featureCards = [
  { title: 'Vue3 Composition API', description: '使用 <script setup> 語法，搭配 ref/computed/watch 管理元件狀態。' },
  { title: 'Pinia 狀態管理', description: '以 Setup Store 模式集中管理跨元件共享狀態，取代 Vuex。' },
  { title: 'Design Tokens', description: 'CSS Variables 實現 Primitive → Semantic 兩層 Token 架構，支援 Light/Dark 模式。' }
]

function goToAbout() {
  router.push({ name: ROUTE_NAMES.ABOUT })
}

function toggleTheme() {
  uiStore.setTheme(uiStore.theme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT)
}
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-6);
}

.home__hero {
  text-align: center;
  padding: var(--space-16) 0;
}

.home__title {
  font-size: var(--text-4xl);
  margin-bottom: var(--space-4);
}

.home__subtitle {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-8);
}

.home__actions {
  display: flex;
  gap: var(--space-4);
  justify-content: center;
}

.home__cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-6);
  margin-top: var(--space-12);
}
</style>
