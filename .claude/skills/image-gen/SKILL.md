---
name: image-gen
description: 為此 Vue3 專案的 UI 截圖、Hero Banner、Icon、背景紋理生成 AI 圖片 prompt。支援 Midjourney、DALL-E、Stable Diffusion、ChatGPT Image 2（gpt-image-1）。
---

# IMAGE-GEN 技能 — AI 圖片 Prompt 生成

## 觸發時機

- 需要為頁面生成 Hero Banner 圖片
- 需要 placeholder 或展示用圖片的 AI prompt
- 需要 UI mockup 風格的截圖
- 需要 icon 或插圖的生成 prompt

## 本專案視覺風格

- **調性：** 簡潔、現代、科技感
- **色系：** 藍色（#2563eb）為主，中性灰輔助
- **風格：** Flat design、輕度玻璃效果（glassmorphism）
- **參考：** Linear、Vercel、Notion 視覺語言

## Midjourney Prompt 模板

```
[主題描述], clean minimal UI design, blue and white color scheme,
modern tech aesthetic, flat design with subtle glassmorphism,
soft shadows, high contrast, professional, 4K --ar 16:9 --v 6
```

## DALL-E Prompt 模板

```
[主題描述], minimalist web UI illustration, blue (#2563eb) accent color,
neutral gray tones, clean modern design, professional tech product style,
white background, subtle shadows
```

## 常用場景範例

### Hero Banner
```
Abstract technology background with flowing blue gradient lines,
minimal geometric shapes, clean modern aesthetic,
suitable for SaaS product hero section --ar 16:9 --v 6
```

### Dashboard Mockup
```
Modern web dashboard UI screenshot, data visualization charts,
blue accent colors, clean card layout, dark sidebar,
professional admin panel design --ar 4:3 --v 6
```

### 圖示/Icon（SVG 風格）
```
Simple flat icon set for web app, line icons, blue color (#2563eb),
minimal strokes, consistent style, transparent background
```

## ChatGPT Image 2（gpt-image-1）Prompt 模板

> 不需要 `--ar`、`--v` 等特殊參數，使用自然語言詳細描述即可獲得最佳效果。

```
[主題描述]。風格為簡潔現代，以藍色（#2563eb）為主色調，
搭配中性灰背景，採用 flat design 帶輕微玻璃效果（glassmorphism），
白色底色、柔和陰影，專業科技產品感，適合用於 SaaS 網站的視覺設計。
整體參考 Linear、Vercel、Notion 的視覺語言。
```

### Hero Banner（gpt-image-1）
```
一張適合 SaaS 產品首頁 Hero 區塊的橫幅背景圖。畫面呈現流動的藍色漸層線條
與簡約幾何圖形，色調以深藍（#1e40af）和亮藍（#2563eb）為主，
白色為輔，整體感覺乾淨、科技、現代，無文字內容，比例 16:9。
```

### Dashboard Mockup（gpt-image-1）
```
一張現代 Web 管理後台的 UI 截圖風格插圖。畫面包含資料視覺化圖表、
藍色強調色卡片佈局、深色側邊欄，整體為專業管理系統風格，
乾淨的排版，無真實文字，比例 4:3。
```

### 圖示/Icon（gpt-image-1）
```
一組簡潔的扁平風格網頁應用程式圖示，線條風格，主色為藍色（#2563eb），
筆觸一致，透明背景，現代極簡設計，適合用於 SaaS 產品介面。
```
