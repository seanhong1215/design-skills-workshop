---
name: engineering-spec
description: 為此 Vue3 + Pinia 專案提供命名規範、資料夾結構、API 格式、元件設計規範。
---

# ENG-SPEC 技能 — 工程設計規範

## 觸發時機

- 詢問元件、檔案、store 的命名規範
- 詢問某個邏輯應放在 views / components / composables / utils
- 詢問 API service 層如何設計
- 進行程式碼審查時對照規範

## 命名規範速查

| 類型 | 規範 | 範例 |
|------|------|------|
| Vue 元件 | PascalCase | `AppButton.vue`、`UserCard.vue` |
| Store | useXxxStore | `useAuthStore`、`useUiStore` |
| Composable | useXxx | `useAuth`、`usePagination` |
| 非元件 JS | camelCase | `userService.js`、`dateUtils.js` |
| CSS class | kebab-case | `.app-button`、`.card-title` |
| 常數 | UPPER_SNAKE_CASE | `ROUTE_NAMES.HOME` |
| 路由 path | kebab-case | `/user-profile`、`/order-detail` |

## 層次判斷規則

| 邏輯類型 | 放哪裡 |
|---------|--------|
| 頁面組合、路由跳轉 | `views/` |
| 純 UI 渲染、props/emit | `components/` |
| 跨元件共享狀態 | `stores/` |
| 可複用有狀態邏輯（含 ref）| `composables/` |
| HTTP 請求、API URL | `services/` |
| 純函式、無副作用 | `utils/` |
| 路由名稱、Enum 值 | `constants/` |

## API Service 設計

```js
// services/api.js — axios instance
const api = axios.create({ baseURL: '/api', timeout: 10000 })

// services/userService.js — 依資源分檔
import api from './api.js'
export function getUser(id) { return api.get(`/users/${id}`) }
export function updateUser(id, data) { return api.put(`/users/${id}`, data) }
```

## 本專案規範文件

- 完整規範：`CLAUDE.md`
- 設計規格：`docs/design/DESIGN.md`
