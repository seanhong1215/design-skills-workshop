# E2E 金流付款測試 Skill

> 此 Skill 定義綠界 ECPay 金流完整 E2E 測試的執行規範，適用於 Claude Code 搭配 MCP Playwright 工具。

## 測試目標

驗證以下完整使用者流程無異常：
1. 瀏覽商品 → 加入購物車
2. 前往結帳頁 → 填寫收件資訊
3. 確認付款 → 導向 ECPay 付款頁
4. 完成測試付款（綠界測試信用卡）
5. 導回商店 `/payment/result` → 顯示付款成功
6. 頁面狀態正確，不重複觸發成功流程

---

## 前置條件

| 項目 | 需求 |
|------|------|
| Dev server | `npm run dev:all`（前端 5173 + 後端 3001 同時運行） |
| 環境設定 | `.env` 含有效的 `ECPAY_MERCHANT_ID`、`ECPAY_HASH_KEY`、`ECPAY_HASH_IV` |
| 測試環境 | `ECPAY_IS_STAGE=true`（使用綠界測試環境） |
| 瀏覽器 | Playwright MCP（Chromium） |

### 綠界測試信用卡資料

| 欄位 | 值 |
|------|-----|
| 卡號 | 4311-9522-2222-2222 |
| 有效期 | 任意未來年月（如 12/26） |
| 安全碼 | 任意 3 碼（如 222） |

---

## 測試步驟

### Step 1：啟動確認

```bash
# 確認 dev server 運行中
curl -s http://localhost:5173 | grep -q "ShopLab" && echo "Frontend OK" || echo "Frontend NOT running"
curl -s http://localhost:3001/api/ecpay/return -X POST | grep -q "OK" && echo "Backend OK" || echo "Backend NOT running"
```

### Step 2：瀏覽器操作流程（Playwright）

**2-1 進入首頁**
- 導航至 `http://localhost:5173`
- 確認頁面標題含「ShopLab」
- 截圖記錄初始狀態

**2-2 加入商品至購物車**
- 點擊「立即逛逛」或商品卡片
- 進入任一商品詳情頁
- 點擊「加入購物車」按鈕
- 確認：購物車 icon/按鈕數量更新

**2-3 前往結帳**
- 點擊購物車按鈕，進入 `/cart`
- 確認購物車有商品
- 點擊「前往結帳」或「立即結帳」
- 確認進入 `/checkout`

**2-4 填寫收件資訊**
- 姓名欄位填入：`測試用戶`
- 電話欄位填入：`0912345678`
- 地址欄位填入：`台北市信義區信義路五段7號`
- 確認三個欄位均無錯誤提示

**2-5 提交訂單**
- 點擊「確認付款 NT$ XXX」按鈕
- 確認按鈕進入 loading 狀態（Loader2 spinner）
- 確認頁面導向綠界付款頁（URL 含 `payment-stage.ecpay.com.tw`）

**2-6 完成 ECPay 測試付款**
- 在綠界付款頁確認訂單金額正確
- 選擇信用卡付款（若有選項）
- 填入測試卡號：`4311952222222222`（無空格）
- 填入有效期：`1226`
- 填入安全碼：`222`
- 點擊「確認付款」
- 等待處理完成

**2-7 驗證付款結果頁**
- 確認導回 URL 含 `/payment/result?tradeNo=SL...&amount=...`
- 確認頁面進入 loading 狀態（「確認付款結果中...」）
- 等待輪詢完成（最多 10 秒）
- **關鍵驗證：** 確認顯示「付款成功！」並含訂單編號
- **關鍵驗證：** 確認頁面不會再次導向或重複觸發任何成功動作
- 截圖記錄最終狀態

---

## 預期結果（正常流程）

| 步驟 | 預期 | 注意點 |
|------|------|--------|
| 結帳按鈕 | spinner 狀態，頁面保持 | 不應出現 JS 錯誤 |
| 導向 ECPay | URL 為 payment-stage.ecpay.com.tw | CheckMacValue 驗證通過 |
| 導回商店 | `/payment/result?tradeNo=...` | tradeNo 參數存在 |
| 查詢狀態 | loading → success | 最多 5 次輪詢 |
| 成功畫面 | 訂單編號、金額、時間 | **只出現一次** |
| 繼續購物 | 點擊後進入商品列表 | 無殘留狀態 |

---

## 異常情境測試

### A — 欄位驗證失敗

- **操作：** 結帳表單留空，直接點「確認付款」
- **預期：** 各欄位顯示紅色錯誤訊息，不發出 API 請求
- **驗證：** `姓名不得為空`、`電話不得為空`、`地址不得為空`

### B — 付款取消（在 ECPay 頁面按返回）

- **操作：** 導向 ECPay 後按瀏覽器返回或取消
- **預期：** 導回 `/payment/result`，輪詢後顯示「付款未完成」
- **驗證：** 出現「返回購物車」按鈕，購物車狀態已清空（因 clearCart 在跳轉前執行）

### C — 無 tradeNo 直接訪問結果頁

- **操作：** 直接訪問 `http://localhost:5173/payment/result`（無 query string）
- **預期：** 顯示「無法取得付款結果」，提示從購物流程重新付款
- **驗證：** 錯誤 icon 出現，有「回首頁」按鈕

### D — 付款成功後的頁面狀態

- **操作：** 付款成功後，點擊「繼續購物」再回到購物車
- **預期：** 購物車為空，結帳 store 狀態已重置
- **驗證：** `orderStatus` 不殘留 `'submitting'` 或 `'success'`，不觸發任何重定向

---

## 已知問題排查（執行前先讀）

### 問題：付款成功後「又跑一次付款成功」

**可能原因分析：**

1. **`checkoutStore.orderStatus` 殘留 `'success'`**
   - 舊版 `submitOrder()` 會將 `orderStatus` 設為 `'success'`
   - 若有任何元件 `watch(() => checkoutStore.orderStatus)` 在 `'success'` 時導向成功頁，就會重複觸發
   - 修正方向：確認 `checkout.js` 的 `submitOrder()` 不被新流程呼叫；或在 `PaymentResultView` 載入時呼叫 `checkoutStore.resetOrder()`

2. **`PaymentSuccessView` 路由守衛**
   - 確認 `/checkout/success` 沒有 navigation guard 會在特定狀態下自動導向

3. **Pinia store 跨頁面持久化**
   - Pinia 預設 store 狀態在頁面重整後會重置，但 SPA 路由切換後狀態保留
   - 確認 `orderStatus` 在 `PaymentResultView` 進入時被 reset

**立即修正步驟（若確認為 orderStatus 殘留）：**
```javascript
// PaymentResultView.vue — onMounted 中加入
import { useCheckoutStore } from '@/stores/checkout.js'
const checkoutStore = useCheckoutStore()
onMounted(() => {
  checkoutStore.resetOrder()  // 清除結帳狀態，防止殘留
  checkPayment()
})
```

---

## Playwright MCP 指令參考

```
# 截圖
mcp__playwright__screenshot

# 導航
mcp__playwright__navigate

# 點擊元素
mcp__playwright__click

# 填寫欄位
mcp__playwright__fill

# 等待元素
mcp__playwright__waitForSelector

# 取得頁面內容
mcp__playwright__evaluate
```

---

## 測試報告格式

每次測試結束需提供：

```
## E2E 付款測試報告

**日期：** YYYY-MM-DD
**環境：** Stage（測試環境）
**結果：** PASS / FAIL

### 執行步驟
1. ✅/❌ 步驟描述 → 觀察結果
   [截圖或輸出]

### 發現的問題
- ⚠️ 問題描述（若有）

### 修正內容
- 已修正：xxx（若有）
```

---

## 注意事項

- **不可真實付款**：務必使用 `ECPAY_IS_STAGE=true` 測試環境
- **HashKey/HashIV 安全**：不得在截圖或報告中暴露 `.env` 內容
- **commit 規範**：修正後的 commit 不加 Co-Authored-By 署名
- **由用戶 push**：Claude 只負責 commit，不執行 git push
