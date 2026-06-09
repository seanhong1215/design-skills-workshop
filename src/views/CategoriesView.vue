<template>
  <main class="categories">
    <nav class="categories__breadcrumb">
      <RouterLink :to="{ name: ROUTE_NAMES.HOME }">首頁</RouterLink>
      <span>/</span>
      <span>商品分類</span>
    </nav>

    <div class="categories__head">
      <h1 class="categories__title">商品分類</h1>
      <p class="categories__subtitle">瀏覽所有商品分類，找到您喜愛的商品</p>
    </div>

    <div class="categories__grid">
      <RouterLink
        v-for="cat in categoryCards"
        :key="cat.id"
        :to="cat.to"
        class="category-card"
        :style="{ '--card-bg': cat.bg, '--card-color': cat.color }"
      >
        <div class="category-card__icon-wrap">
          <component :is="cat.icon" :size="36" />
        </div>
        <h2 class="category-card__name">{{ cat.name }}</h2>
        <p class="category-card__desc">{{ cat.desc }}</p>
        <span class="category-card__link">{{ cat.linkText }} →</span>
      </RouterLink>
    </div>
  </main>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { Cpu, Bike, Armchair, LayoutGrid } from 'lucide-vue-next'
import { ROUTE_NAMES } from '@/constants/routes.js'

const categoryCards = [
  {
    id: 'electronics',
    icon: Cpu,
    name: '電子產品',
    desc: '耳機・手機・筆電・智慧裝置',
    linkText: '瀏覽商品',
    bg: '#EFF6FF',
    color: '#4A9FD8',
    to: { name: ROUTE_NAMES.PRODUCT_LIST, query: { category: '電子產品' } }
  },
  {
    id: 'sports',
    icon: Bike,
    name: '運動戶外',
    desc: '自行車・瑜珈・登山・露營',
    linkText: '瀏覽商品',
    bg: '#F0FDF4',
    color: '#16A34A',
    to: { name: ROUTE_NAMES.PRODUCT_LIST, query: { category: '運動戶外' } }
  },
  {
    id: 'home',
    icon: Armchair,
    name: '居家生活',
    desc: '家具・廚房・寢具・居家裝飾',
    linkText: '瀏覽商品',
    bg: '#FFF7ED',
    color: '#EA7C2A',
    to: { name: ROUTE_NAMES.PRODUCT_LIST, query: { category: '居家生活' } }
  },
  {
    id: 'all',
    icon: LayoutGrid,
    name: '全部商品',
    desc: '瀏覽 1,000+ 件精選商品',
    linkText: '立即探索',
    bg: '#F5F3FF',
    color: '#7C3AED',
    to: { name: ROUTE_NAMES.PRODUCT_LIST }
  }
]
</script>

<style scoped>
.categories {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-6);
}

/* 麵包屑：與 ProductListView 一致 */
.categories__breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin-bottom: var(--space-4);
}

.categories__breadcrumb a {
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.categories__breadcrumb a:hover {
  color: var(--color-accent-primary);
}

/* 頁頭：與 ProductListView h1/count 一致 */
.categories__head {
  margin-bottom: var(--space-8);
}

.categories__title {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-1);
}

.categories__subtitle {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin: 0;
}

/* 分類卡片 Grid */
.categories__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-5);
}

@media (max-width: 640px) {
  .categories__grid {
    grid-template-columns: 1fr;
  }
}

/* 卡片：使用 CSS custom properties 注入主題色 */
.category-card {
  background-color: var(--card-bg);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  min-height: 200px;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.category-card__icon-wrap {
  color: var(--card-color);
  display: flex;
}

.category-card__name {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
  line-height: var(--leading-tight);
}

.category-card__desc {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0;
  line-height: var(--leading-relaxed);
  flex: 1;
}

.category-card__link {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--card-color);
  margin-top: var(--space-1);
}
</style>
