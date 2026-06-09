# 元件規格

## AppButton

**Props：**

| Prop | 類型 | 預設 | 可選值 |
|------|------|------|--------|
| `variant` | String | `primary` | `primary` / `secondary` / `ghost` |
| `size` | String | `md` | `sm` / `md` / `lg` |
| `disabled` | Boolean | `false` | - |

**尺寸規格：**

| Size | 高度 | 水平內距 | font-size |
|------|------|---------|-----------|
| sm | 32px | 12px | `--text-sm` |
| md | 40px | 20px | `--text-sm` |
| lg | 48px | 24px | `--text-base` |

**狀態：** default / hover / active / disabled（opacity: 0.5, cursor: not-allowed）

**變體色彩規格：**

| 變體 | 背景 | 文字色 | 邊框 | hover 背景 |
|------|------|--------|------|------------|
| primary | `accent-primary` | `text-inverse` | none | `accent-hover` |
| secondary | `accent-subtle` | `accent-primary` | `accent-primary` | `accent-primary` (文字變 inverse) |
| ghost | transparent | `text-primary` | none | `bg-subtle` |

---

## AppCard

**Props：** 無（透過 slot 傳入內容）

**樣式規格：**
- 背景：`--color-bg-surface`
- 邊框：`1px solid var(--color-border-default)`
- 圓角：`--radius-lg` (12px)
- 內距：`--space-6` (24px)
- 陰影：`--shadow-sm`
- 內部排列：flex column，gap `--space-4`

---

## AppBadge

**Props：**

| Prop | 類型 | 預設 | 可選值 |
|------|------|------|--------|
| `type` | String | `default` | `default` / `success` / `warning` / `error` / `info` |

**樣式規格：**
- 高度：22px
- 水平內距：`--space-2` (8px)
- 圓角：`--radius-full` (pill)
- 字型：`--text-xs`，weight 500

**變體色彩：**

| Type | 背景 | 文字 |
|------|------|------|
| default | `bg-subtle` | `text-secondary` |
| success | #dcfce7 | #15803d |
| warning | #fef9c3 | #a16207 |
| error | #fee2e2 | #b91c1c |
| info | `accent-subtle` | `accent-primary` |

---

## AppHeader

**Props：** 無

**結構：**
- sticky top，z-index: 100
- 高度：60px
- 背景：`bg-surface`
- 底部邊框：`1px solid border-default`
- 內容區寬：max 1200px，水平 padding `--space-6`

**子元件：**
- Logo（RouterLink → HOME）
- 導航連結（HOME、ABOUT）
- 菜單按鈕（`AppButton ghost sm`，觸發 `uiStore.toggleSidebar()`）

---

## 元件使用範例

```vue
<AppButton>送出</AppButton>
<AppButton variant="secondary" size="sm">取消</AppButton>
<AppButton variant="ghost" :disabled="true">停用</AppButton>

<AppCard>
  <h3>卡片標題</h3>
  <p>卡片內容</p>
</AppCard>

<AppBadge type="success">已完成</AppBadge>
<AppBadge type="warning">進行中</AppBadge>
```
