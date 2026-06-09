# UI 設計指南

## 間距系統

以 4px 為基礎單位（8px 倍數格線），所有間距值都使用 Design Token：

```css
/* 使用 token */
margin-bottom: var(--space-4);  /* 正確 */
margin-bottom: 16px;            /* 禁止 */
```

常用間距場景：
- 元件內部元素間距：`--space-3` 或 `--space-4`
- 卡片內距：`--space-6`
- 區塊間距：`--space-8` 或 `--space-12`
- 頁面頂部 padding：`--space-8`

## 版面布局

- 最大內容寬度：1200px（`max-width: 1200px; margin: 0 auto;`）
- 頁面水平 padding：`--space-6` (24px)
- Header 高度：60px（sticky）

## 響應式斷點

| 名稱 | 寬度 | 說明 |
|------|------|------|
| sm | 640px | 手機橫向 |
| md | 768px | 平板 |
| lg | 1024px | 桌面小 |
| xl | 1280px | 桌面大 |

```css
/* Mobile First 原則 */
.container { padding: var(--space-4); }          /* 手機 */
@media (min-width: 768px) { ... }                /* 平板 + */
@media (min-width: 1024px) { ... }               /* 桌面 + */
```

## 圓角規範

| Token | 值 | 使用場景 |
|-------|-----|---------|
| `--radius-sm` | 4px | 輸入框、小元件 |
| `--radius-md` | 8px | 按鈕、標籤 |
| `--radius-lg` | 12px | 卡片、面板 |
| `--radius-xl` | 16px | 大型容器 |
| `--radius-full` | 9999px | Badge、Avatar、圓形按鈕 |

## 陰影規範

| Token | 使用場景 |
|-------|---------|
| `--shadow-sm` | 卡片靜止狀態 |
| `--shadow-md` | 卡片 hover、下拉選單 |
| `--shadow-lg` | Modal、Popover |
| `--shadow-xl` | 頂層浮動元素 |

## 可及性規範

### Focus Ring
所有可互動元素必須有可見的 focus ring：
```css
:focus-visible {
  outline: 2px solid var(--color-accent-primary);
  outline-offset: 2px;
}
```

### 對比度
- 正文對背景：最低 4.5:1（WCAG AA）
- 大字（18px+ 或 14px bold）：最低 3:1

### ARIA
- 圖示按鈕必須有 `aria-label`
- 模態框使用 `role="dialog"` + `aria-modal="true"`
- 表單欄位必須關聯 `<label>`

### 鍵盤導航
- 所有互動元素可被 Tab 鍵聚焦
- 模態框開啟時焦點鎖定在 modal 內
- Esc 鍵可關閉 Modal / Dropdown

## 動態與過渡

統一使用 Token 定義的過渡時長：
```css
transition: color var(--transition-fast);         /* 顏色切換：150ms */
transition: transform var(--transition-normal);   /* 移動：250ms */
transition: opacity var(--transition-slow);       /* 淡入淡出：400ms */
```

避免不必要的動畫，遵循 `prefers-reduced-motion` 使用者偏好。
