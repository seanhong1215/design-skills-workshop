<template>
  <main class="about">
    <AppCard>
      <h1>關於 DesignSkill</h1>
      <p>本專案為 Vue3 + Pinia 課程作業，學習 Composition API、狀態管理與設計系統整合。</p>
      <ul class="about__stack">
        <li v-for="item in stack" :key="item.name">
          <strong>{{ item.name }}</strong>：{{ item.desc }}
        </li>
      </ul>
      <AppButton @click="router.back()">返回</AppButton>
    </AppCard>
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router'
import AppButton from '@/components/common/AppButton.vue'
import AppCard from '@/components/common/AppCard.vue'

const router = useRouter()

const stack = [
  { name: 'Vue 3', desc: 'Composition API + <script setup> 語法' },
  { name: 'Pinia', desc: 'Setup Store 狀態管理' },
  { name: 'Vue Router 4', desc: 'Lazy Loading 路由' },
  { name: 'Vite 5', desc: '快速建構工具' },
  { name: 'Design Tokens', desc: 'CSS Variables 視覺系統' }
]
</script>

<style scoped>
.about {
  max-width: 720px;
  margin: var(--space-12) auto;
  padding: 0 var(--space-6);
}

h1 {
  font-size: var(--text-2xl);
  margin-bottom: var(--space-4);
}

p {
  color: var(--color-text-secondary);
  margin-bottom: var(--space-6);
  line-height: var(--leading-relaxed);
}

.about__stack {
  margin-bottom: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.about__stack li {
  color: var(--color-text-secondary);
}
</style>
