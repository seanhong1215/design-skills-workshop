# CLAUDE.md — DesignSkill 專案說明

> 此文件讓 Claude 了解專案背景、目錄結構與工作規範。

## 專案概要

- **名稱：** DesignSkill
- **類型：** 課程作業 — Vue3 + Pinia 學習專案
- **目標：** 學習 Vue3 Composition API + Pinia 設計模式，整合 Claude AI 工具進行設計輔助
- **技術棧：** Vue3 (Composition API) + Pinia + Vue Router 4 + Vite 5

## 目錄職責

| 目錄 | 職責 |
|------|------|
| `src/views/` | 路由對應頁面，組合 components，讀寫 store |
| `src/components/` | 純 UI 元件，透過 props/emit 通訊，不直接存取 store |
| `src/stores/` | Pinia stores，管理跨元件共享狀態 |
| `src/composables/` | 可複用有狀態邏輯（useXxx 命名） |
| `src/services/` | API 呼叫封裝，唯一與後端通訊入口 |
| `src/constants/` | 常數、路由名稱、Enum 值 |
| `src/utils/` | 純函式工具，無副作用 |
| `src/assets/styles/` | Design tokens 與全域樣式 |
| `.claude/skills/` | Claude AI 技能腳本 |
| `docs/design/` | 設計文件與規範 |

## 命名規範

| 類型 | 規範 | 範例 |
|------|------|------|
| 元件 | PascalCase | `AppButton.vue`、`UserCard.vue` |
| 非元件 JS | camelCase | `userService.js`、`useAuth.js` |
| CSS class | kebab-case | `.app-button`、`.card-title` |
| 常數 | UPPER_SNAKE_CASE | `ROUTE_NAMES.HOME` |
| Store | useXxxStore | `useAuthStore` |
| Composable | useXxx | `useAuth`、`usePagination` |

## 設計原則

1. Composition API + `<script setup>` 語法優先
2. 使用 Design Tokens（CSS variables），禁止 hardcode 顏色值
3. Pinia store 使用 Setup Store 語法（函式風格）
4. 路由使用 Lazy Loading（`() => import(...)`）
5. 元件只透過 props/emit 通訊，不直接存取 store

## 可用 AI 技能（.claude/skills/）

| 技能 | 觸發時機 |
|------|---------|
| `vue-arch` | Vue3 元件架構、Pinia 設計模式、資料流 |
| `visual-design` | 視覺系統、色彩 token、排版、元件樣式 |
| `engineering-spec` | 命名規範、資料夾結構、API 格式 |
| `image-gen` | 生成 AI 圖片 prompt（Banner、Icon 等）|
| `e2e-payment-test` | 綠界金流完整流程 E2E 測試（Playwright）|

## 設計文件

主設計規格位於 `docs/design/DESIGN.md`，包含色彩 token、排版規範、元件樣式規格。

## 開發指令

```bash
npm run dev        # 啟動開發伺服器 (http://localhost:5173)
npm run build      # 生產建置
npm run lint       # 修正 ESLint 問題
npm run lint:check # 檢查 ESLint（不修正）
```
