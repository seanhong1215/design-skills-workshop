# DesignSkill

Vue3 + Pinia 課程作業專案，學習 Composition API、狀態管理與設計系統整合，串接綠界 ECPay 金流。

## 技術棧

| 技術 | 版本 | 用途 |
|------|------|------|
| Vue 3 | ^3.4 | 前端框架（Composition API） |
| Pinia | ^2.1 | 狀態管理 |
| Vue Router | ^4.3 | 路由管理 |
| Vite | ^5.0 | 建構工具 |
| Express | ^4.19 | 後端伺服器（ECPay API） |
| Axios | ^1.6 | HTTP 客戶端 |
| Playwright | ^1.60 | E2E 自動化測試 |

## 快速開始

```bash
# 安裝依賴
npm install

# 同時啟動前端（5173）與後端（3001）
npm run dev:all

# 單獨啟動
npm run dev     # 前端
npm run server  # 後端

# 建置生產版本
npm run build
```

## E2E 測試

```bash
# 需先啟動 dev:all，再執行
npx playwright test --config=playwright.config.js
```

測試結果（影片、截圖）存於 `.docs/ec2-test/test-results/`，報告見 [`.docs/ec2-test/REPORT.md`](./.docs/ec2-test/REPORT.md)。

## 環境設定

複製 `.env.example` 為 `.env`，填入綠界測試憑證：

```
ECPAY_MERCHANT_ID=...
ECPAY_HASH_KEY=...
ECPAY_HASH_IV=...
ECPAY_IS_STAGE=true
```

## 專案結構

請參閱 [CLAUDE.md](./CLAUDE.md) 取得完整的目錄職責與命名規範說明。

## 設計文件

視覺設計規格位於 [`docs/design/`](./docs/design/)，包含色彩系統、排版規範與元件規格。

## AI 技能

Claude AI 技能腳本位於 [`.claude/skills/`](./.claude/skills/)，覆蓋 Vue 架構、視覺設計、工程規範、E2E 金流測試四個面向。
