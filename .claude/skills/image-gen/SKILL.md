---
name: image-gen
description: 為此 Vue3 專案的 UI 截圖、Hero Banner、Icon、背景紋理生成 AI 圖片 prompt。支援 Midjourney、DALL-E、Stable Diffusion。
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
