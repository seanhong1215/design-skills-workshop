# 色彩系統

## Primitive Tokens — 原始色階

### Neutral（中性灰）

| Token | Hex | 用途 |
|-------|-----|------|
| `--neutral-50` | #f8fafc | 最淺背景 |
| `--neutral-100` | #f1f5f9 | 次要背景 |
| `--neutral-200` | #e2e8f0 | 預設邊框 |
| `--neutral-300` | #cbd5e1 | 強調邊框 |
| `--neutral-400` | #94a3b8 | 靜音文字 |
| `--neutral-500` | #64748b | 次要圖示 |
| `--neutral-600` | #475569 | 次要文字 |
| `--neutral-700` | #334155 | Dark 邊框 |
| `--neutral-800` | #1e293b | Dark 卡片背景 |
| `--neutral-900` | #0f172a | 主要文字 / Dark 頁面背景 |

### Accent（藍色強調）

| Token | Hex | 用途 |
|-------|-----|------|
| `--accent-50` | #eff6ff | 最淺強調背景 |
| `--accent-100` | #dbeafe | 次要強調背景 |
| `--accent-400` | #60a5fa | Dark mode 主要強調色 |
| `--accent-500` | #3b82f6 | 中等強調 |
| `--accent-600` | #2563eb | Light mode 主要強調色（CTA）|
| `--accent-700` | #1d4ed8 | Hover 狀態 |

## Semantic Tokens — 語意角色

### Light Mode（預設）

| Semantic Token | Primitive Token | 像素值 |
|---------------|----------------|--------|
| `--color-bg-base` | `--neutral-50` | #f8fafc |
| `--color-bg-surface` | #ffffff | - |
| `--color-bg-overlay` | #ffffff | - |
| `--color-bg-subtle` | `--neutral-100` | #f1f5f9 |
| `--color-text-primary` | `--neutral-900` | #0f172a |
| `--color-text-secondary` | `--neutral-600` | #475569 |
| `--color-text-muted` | `--neutral-400` | #94a3b8 |
| `--color-text-inverse` | #ffffff | - |
| `--color-border-default` | `--neutral-200` | #e2e8f0 |
| `--color-border-strong` | `--neutral-300` | #cbd5e1 |
| `--color-accent-primary` | `--accent-600` | #2563eb |
| `--color-accent-hover` | `--accent-700` | #1d4ed8 |
| `--color-accent-subtle` | `--accent-100` | #dbeafe |

### Dark Mode（[data-theme="dark"]）

| Semantic Token | 覆寫值 |
|---------------|--------|
| `--color-bg-base` | `--neutral-900` (#0f172a) |
| `--color-bg-surface` | `--neutral-800` (#1e293b) |
| `--color-bg-subtle` | `--neutral-700` (#334155) |
| `--color-text-primary` | `--neutral-50` (#f8fafc) |
| `--color-text-secondary` | `--neutral-400` (#94a3b8) |
| `--color-border-default` | `--neutral-700` (#334155) |
| `--color-accent-primary` | `--accent-400` (#60a5fa) |

## 對比度驗證（WCAG AA 要求 4.5:1）

| 背景 | 文字 | 比值 | 狀態 |
|------|------|------|------|
| bg-surface (#fff) | text-primary (#0f172a) | 19.1:1 | 通過 |
| bg-surface (#fff) | text-secondary (#475569) | 5.9:1 | 通過 |
| accent-primary (#2563eb) | text-inverse (#fff) | 5.9:1 | 通過 |
| bg-base (#f8fafc) | text-muted (#94a3b8) | 2.9:1 | 裝飾用（不含文字）|

## 使用禁止事項

- 禁止直接使用 Primitive token 作為元件顏色（應使用 Semantic token）
- 禁止 hardcode 十六進位色碼（例：`color: #2563eb`）
- 文字顏色禁止使用 `--neutral-300` 以上（對比度不足）
