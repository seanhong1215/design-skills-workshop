# DesignSkill — 視覺設計系統

> 版本：v1.0 | 更新日期：2026-06-09

## 1. 設計原則

| 原則 | 說明 |
|------|------|
| Token 優先 | 所有視覺值透過 CSS variables 定義，禁止 hardcode |
| 語意命名 | Token 以用途命名（`--color-accent-primary`），而非顏色值（`--blue-600`）|
| 對比合規 | 所有文字對比度達 WCAG AA（4.5:1）|
| Dark Mode | 使用 `[data-theme="dark"]` 覆寫 Semantic token，不反轉色彩 |

## 2. Token 架構

```
Primitive Tokens（原始色值）
  --neutral-50 ~ --neutral-900
  --accent-50 ~ --accent-700
        ↓
Semantic Tokens（語意角色）
  --color-bg-base
  --color-text-primary
  --color-accent-primary
        ↓
[data-theme="dark"] 覆寫 Semantic 層
```

Token 實作：`src/assets/styles/tokens.css`

## 3. 色彩系統

詳見 [color-system.md](./color-system.md)

| 角色 Token | Light 值 | 用途 |
|-----------|---------|------|
| `--color-bg-base` | `--neutral-50` (#f8fafc) | 最底層頁面背景 |
| `--color-bg-surface` | #ffffff | 卡片、面板 |
| `--color-bg-subtle` | `--neutral-100` | 次要背景、hover |
| `--color-text-primary` | `--neutral-900` | 正文、標題 |
| `--color-text-secondary` | `--neutral-600` | 次要文字、標籤 |
| `--color-text-muted` | `--neutral-400` | 說明文字 |
| `--color-accent-primary` | `--accent-600` (#2563eb) | CTA、連結、focus ring |
| `--color-border-default` | `--neutral-200` | 通用邊框 |

## 4. 排版

詳見 [typography.md](./typography.md)

| 層次 | Token | 字重 | 用途 |
|------|-------|------|------|
| 頁面標題 | `--text-4xl` (36px) | 700 | h1 |
| 區塊標題 | `--text-2xl` (24px) | 600 | h2 |
| 元件標題 | `--text-xl` (20px) | 600 | h3 |
| 正文 | `--text-base` (16px) | 400 | 段落 |
| 標籤 | `--text-sm` (14px) | 500 | label |
| 說明 | `--text-xs` (12px) | 400 | caption、badge |

字型堆疊：`'Inter', 'Noto Sans TC', ui-sans-serif, system-ui`

## 5. 間距系統

以 4px 為基礎單位，--space-N = N × 4px / 4 rem 換算：

| Token | 值 | 像素 |
|-------|-----|------|
| `--space-1` | 0.25rem | 4px |
| `--space-2` | 0.5rem | 8px |
| `--space-4` | 1rem | 16px |
| `--space-6` | 1.5rem | 24px |
| `--space-8` | 2rem | 32px |
| `--space-12` | 3rem | 48px |

## 6. 元件規格

詳見 [component-spec.md](./component-spec.md)

### Button

| 變體 | 背景 | 文字 | 邊框 |
|------|------|------|------|
| Primary | `accent-primary` | inverse | none |
| Secondary | `accent-subtle` | `accent-primary` | `accent-primary` |
| Ghost | transparent | `text-primary` | none |

尺寸：`sm`=32px / `md`=40px / `lg`=48px

### Card
- 背景：`--color-bg-surface`
- 邊框：`1px solid var(--color-border-default)`
- 圓角：`--radius-lg` (12px)
- 內距：`--space-6` (24px)
- 陰影：`--shadow-sm`

### Badge
- 高度：22px
- 字型：`--text-xs`，weight 500
- 圓角：`--radius-full`（pill）
- 變體：default / success / warning / error / info

## 7. UI 設計指南

詳見 [ui-guidelines.md](./ui-guidelines.md)
