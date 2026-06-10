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
| 本地觸發 | `POST /api/ecpay/dev/paid/:tradeNo` 取代 ngrok（僅限 stage 模式）|

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
- 填入測試卡號欄位（id: CCpart1~CCpart4）：`4311` `9522` `2222` `2222`
- 填入有效期（id: creditMM / creditYY）：`12` / `26`
- 填入安全碼（id: CreditBackThree）：`222`
- 點擊右側橘色「測試付款請點此」（id: `aCREDIT`）
  - 此連結會在新分頁開啟 MockScanCodePay 模擬付款頁
  - 切換至新分頁，確認卡號 `4311952222222222` 已帶入
  - 點擊「交易成功」按鈕（`input[value="交易成功"]`）
  - 新分頁關閉後記錄 tradeNo（從 ECPay 頁面訂單資訊取得）

**2-6b 本地觸發付款成功（方案B — 取代 ngrok）**

> ECPay 無法 POST 至 `localhost:3001`，使用後端 dev 端點在本機模擬 ReturnURL 回調

```bash
# 將 {tradeNo} 替換為實際訂單編號（如 SL1781062707199），{amount} 替換為金額
curl -s -X POST "http://localhost:3001/api/ecpay/dev/paid/{tradeNo}?amount={amount}"
```

- 確認回應：`{"ok":true,"tradeNo":"SL...","tradeAmt":"...","paymentDate":"..."}`
- 此端點僅在 `ECPAY_IS_STAGE=true` 時有效，正式環境會回傳 403

**2-7 驗證付款結果頁**
- 導航至 `http://localhost:5173/payment/result?tradeNo={tradeNo}&amount={amount}`
- 確認頁面進入 `confirming` 狀態（Loader2 spinner + 「訂單建立中...」）
- 等待輪詢完成（最多 10 秒，每 2 秒一次，共 5 次）
- **關鍵驗證：** 確認顯示「付款成功！」並含訂單編號與金額
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
