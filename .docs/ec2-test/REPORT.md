# E2E 付款測試報告

**日期：** 2026-06-10  
**環境：** Stage（綠界測試環境）  
**結果：** ✅ PASS（4/4）  
**執行時間：** 19.5 秒  
**測試框架：** Playwright 1.60.0（headless Chromium）

---

## 執行步驟

### 主流程：從首頁到付款成功

| # | 步驟 | 狀態 | 截圖 |
|---|------|------|------|
| 1 | 首頁載入，確認 `.home` 容器可見 | ✅ | `01-home.png` |
| 2 | 點擊「立即購物」→ SPA 導航至 `/products` | ✅ | `02-products.png` |
| 3 | 點擊第一個商品卡 → 進入商品詳情頁 | ✅ | `03-product-detail.png` |
| 4 | 點擊「加入購物車」→ header badge 出現數量 | ✅ | `04-added-to-cart.png` |
| 5 | 點擊 header 購物車 icon → SPA 導航至 `/cart` | ✅ | `05-cart.png` |
| 6 | 點擊「前往結帳」→ SPA 導航至 `/checkout` | ✅ | `06-checkout.png` |
| 7 | 填寫收件資訊（姓名、電話、地址） | ✅ | `07-form-filled.png` |
| 8 | 點擊「確認付款」→ spinner 出現（submitting 狀態） | ✅ | `08-submitting.png` |
| 9 | form submit → 跳轉至 `payment-stage.ecpay.com.tw` | ✅ | `09-ecpay-page.png` |
| 10 | 填入測試信用卡（4311-9522-2222-2222, 12/26, 222） | ✅ | `10-ecpay-card-filled.png` |
| 11 | 點擊「測試付款請點此」→ MockScanCodePay 分頁開啟 | ✅ | `11-mock-payment.png` |
| 12 | 點擊「交易成功」→ 分頁自動關閉 | ✅ | — |
| 13 | 呼叫 `POST /api/ecpay/dev/paid/:tradeNo` 模擬回調 | ✅ | — |
| 14 | 導航至 `/payment/result?tradeNo=...` → confirming 狀態 | ✅ | `13-result-confirming.png` |
| 15 | 輪詢完成 → 顯示「付款成功！」含訂單編號與金額 | ✅ | `14-result-success.png` |
| 16 | 點擊「繼續購物」→ 回商品列表，無殘留狀態 | ✅ | `15-back-to-products.png` |

**範例 tradeNo：** `SL1781066573050`  
**範例金額：** NT$ 1,290  
**dev/paid 回應：** `{"ok":true,"tradeAmt":"1290","paymentDate":"2026-06-10 12:42:55"}`

---

### 異常A：空白表單送出顯示錯誤訊息

| 步驟 | 狀態 |
|------|------|
| 加商品至購物車（SPA 導航，保持 Pinia 狀態） | ✅ |
| 前往結帳，確認按鈕為啟用狀態 | ✅ |
| 空白點擊送出，出現 **3 個**欄位錯誤訊息 | ✅ |
| 確認無發出 API 請求 | ✅ |

截圖：`A1-checkout-empty.png`、`A2-validation-errors.png`

---

### 異常C：無 tradeNo 直接訪問 `/payment/result`

| 步驟 | 狀態 |
|------|------|
| 直接訪問 `http://localhost:5173/payment/result`（無 query string） | ✅ |
| 顯示「無法取得付款結果」錯誤標題 | ✅ |
| 出現「回首頁」按鈕 | ✅ |

截圖：`C1-no-tradeno-error.png`

---

### 異常D：付款成功後繼續購物，購物車狀態正常

| 步驟 | 狀態 |
|------|------|
| 透過 dev/paid 建立假訂單，訪問結果頁 | ✅ |
| 顯示「付款成功！」 | ✅ |
| 點擊「繼續購物」→ 商品列表 | ✅ |
| header 購物車 badge 不可見（購物車為空） | ✅ |

截圖：`D1-success.png`、`D2-after-continue.png`、`D3-cart-empty-badge.png`

---

## 發現的問題

無。所有測試均通過，功能符合預期。

---

## 技術備注

- **WSL2 環境限制**：無 X Server，瀏覽器以 headless 模式運行，所有狀態透過截圖記錄。
- **tradeNo 捕獲方式**：使用 `page.route('**/api/ecpay/create-order')` 攔截，避免 form submit 跳頁時的競態條件。
- **SPA 導航策略**：全程使用 click-based 導航（非 `page.goto`），保持 Pinia store 狀態不被重置。
- **ECPay ReturnURL 替代**：使用 `POST /api/ecpay/dev/paid/:tradeNo`（`ECPAY_IS_STAGE=true` 限定）模擬伺服器回調。
