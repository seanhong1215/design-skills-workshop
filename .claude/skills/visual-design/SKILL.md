---
name: visual-design
description: 為此 Vue3 專案設計視覺規格：色彩 tokens、排版、元件樣式、light/dark 模式。
---

# VISUAL-DESIGN 技能 — 視覺設計系統

## 觸發時機

- 詢問如何定義或修改 Design Tokens（CSS variables）
- 詢問元件（Button、Card、Modal）的樣式規格
- 詢問如何實作 dark mode
- 詢問色彩對比是否符合 WCAG 標準
- 需要新增元件樣式

## 本專案設計系統位置

| 類型 | 位置 |
|------|------|
| Token 定義 | `src/assets/styles/tokens.css` |
| Reset + 基礎樣式 | `src/assets/styles/base.css` |
| 完整規格 | `docs/design/DESIGN.md` |
| 色彩系統 | `docs/design/color-system.md` |
| 排版規範 | `docs/design/typography.md` |
| 元件規格 | `docs/design/component-spec.md` |
| UI 指南 | `docs/design/ui-guidelines.md` |

## Token 使用原則

```css
/* 正確：使用 Semantic token */
color: var(--color-text-primary);
background: var(--color-bg-surface);

/* 禁止：直接用 Primitive token 或 hardcode */
color: var(--neutral-900);    /* 禁止 */
color: #0f172a;               /* 禁止 */
```

## Dark Mode 切換

透過 `useUiStore().setTheme('dark')` 設定 `document.documentElement` 的 `data-theme` attribute，CSS 自動套用 `[data-theme="dark"]` 覆寫規則。

## 元件樣式範例

```css
/* 使用 Token 撰寫元件樣式 */
.card {
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
}
```
