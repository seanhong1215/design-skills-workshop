# 排版規範

## 字型堆疊

```css
--font-sans:  'Inter', 'Noto Sans TC', ui-sans-serif, system-ui, sans-serif;
--font-mono:  'JetBrains Mono', ui-monospace, monospace;
```

- **Inter**：英文主字型，幾何感強、易讀性高
- **Noto Sans TC**：中文主字型，覆蓋繁體中文字符
- **ui-sans-serif / system-ui**：系統字型 fallback

## Type Scale

| Token | rem | px | 用途 |
|-------|-----|----|------|
| `--text-xs` | 0.75rem | 12px | caption、badge |
| `--text-sm` | 0.875rem | 14px | label、次要文字、按鈕 |
| `--text-base` | 1rem | 16px | 正文 |
| `--text-lg` | 1.125rem | 18px | 較大正文 |
| `--text-xl` | 1.25rem | 20px | 元件標題 (h3) |
| `--text-2xl` | 1.5rem | 24px | 區塊標題 (h2) |
| `--text-3xl` | 1.875rem | 30px | 頁面副標題 |
| `--text-4xl` | 2.25rem | 36px | 頁面主標題 (h1) |

## 字重使用規範

| 字重 | 值 | 用途 |
|------|-----|------|
| Regular | 400 | 正文、說明文字 |
| Medium | 500 | label、badge、按鈕 |
| SemiBold | 600 | 標題（h2～h4） |
| Bold | 700 | 主標題（h1）、Logo |

## 層次對應規則

| 層次 | font-size | font-weight | line-height |
|------|-----------|-------------|-------------|
| h1（頁面標題）| `--text-4xl` | 700 | `--leading-tight` (1.25) |
| h2（區塊標題）| `--text-2xl` | 600 | `--leading-tight` |
| h3（元件標題）| `--text-xl` | 600 | `--leading-tight` |
| h4（小標題）| `--text-lg` | 600 | `--leading-normal` (1.5) |
| body（正文）| `--text-base` | 400 | `--leading-relaxed` (1.75) |
| label（標籤）| `--text-sm` | 500 | `--leading-normal` |
| caption（說明）| `--text-xs` | 400 | `--leading-normal` |

## 中文排版注意事項

- 中文正文行高建議使用 `--leading-relaxed` (1.75)，英文可用 1.5
- 中文標題字重 600 即可，不需 700（視覺上已夠明顯）
- 避免全大寫（uppercase）用於中文
- 中英混排時，中英文之間建議加半形空格

## 禁止事項

- 禁止使用 px 單位直接設定 font-size（應使用 Token）
- 正文禁止使用 `--text-xs`（閱讀困難）
- 連續段落之間應有 `--space-4` 以上間距
