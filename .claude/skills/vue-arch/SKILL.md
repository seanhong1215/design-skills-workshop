---
name: vue-arch
description: 當使用者詢問 Vue3 元件架構設計、Pinia store 模式、Composition API 最佳實踐、或 Vue Router 設計時觸發。
---

# VUE-ARCH 技能 — Vue3 架構設計

## 觸發時機

- 詢問如何拆分元件、決定邏輯放哪一層
- 詢問 Pinia store 應如何設計 state / getters / actions
- 詢問 props/emit vs store 的取捨
- 詢問如何抽取 composable
- 詢問 Vue Router 導航守衛、路由設計

## 本專案架構原則

### 層次職責
```
views/          ← 路由頁面，組合 components，呼叫 service + 讀寫 store
  ↓ 使用
components/     ← 純 UI，只透過 props/emit 通訊，不直接存取 store
  ↓ 讀寫
stores/         ← Pinia Setup Store，跨元件共享狀態
  ↓ 封裝
composables/    ← 可複用有狀態邏輯（useXxx 命名）
  ↓ 呼叫
services/       ← axios API 封裝，唯一與後端通訊入口
  ↓ 使用
utils/          ← 純函式，無副作用
```

### Pinia Setup Store 模式
```js
// stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // State = ref()
  const user = ref(null)
  // Getters = computed()
  const isLoggedIn = computed(() => !!user.value)
  // Actions = functions
  function logout() { user.value = null }

  return { user, isLoggedIn, logout }
})
```

### 路由 Lazy Loading
```js
// router/index.js — 所有 component 使用動態 import
{ path: '/', component: () => import('@/views/HomeView.vue') }
```

## 參考文件
- `src/router/index.js` — 路由設計範例
- `src/stores/auth.js` — Store 模式範例
- `src/composables/useNotification.js` — Composable 範例
- `docs/design/DESIGN.md` — 整體設計規格
