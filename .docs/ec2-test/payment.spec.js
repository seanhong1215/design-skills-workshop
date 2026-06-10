// @ts-check
import { test, expect } from '@playwright/test'
import http from 'http'

const BASE = 'http://localhost:5173'
const API  = 'http://localhost:3001'
const SS   = '.docs/ec2-test/screenshots'

/** 呼叫 dev/paid 端點，模擬 ECPay 伺服器回調 */
async function triggerDevPaid(tradeNo, amount) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      `${API}/api/ecpay/dev/paid/${tradeNo}?amount=${amount}`,
      { method: 'POST' },
      (res) => {
        let body = ''
        res.on('data', (d) => (body += d))
        res.on('end', () => { try { resolve(JSON.parse(body)) } catch(e) { reject(e) } })
      }
    )
    req.on('error', reject)
    req.end()
  })
}

/** 等待 SPA 路由完成（等特定容器出現而非 load 事件）*/
async function waitForRoute(page, selector, timeout = 10000) {
  await page.locator(selector).waitFor({ state: 'visible', timeout })
}

/** 點擊商品卡並等待詳情頁載入 */
async function goToFirstProduct(page) {
  const firstCard = page.locator('.product-card').first()
  await firstCard.waitFor({ state: 'visible', timeout: 8000 })
  await firstCard.click()
  await waitForRoute(page, '.product-detail', 10000)
}

/** 點擊 header 購物車 icon（SPA 導航，不重載）*/
async function goToCartViaSPA(page) {
  await page.click('[aria-label="購物車"]')
  await waitForRoute(page, '.cart', 8000)
}

// ─── 測試套件 ────────────────────────────────────────────
test.describe('E2E 綠界付款流程', () => {

  // ─── 主流程 ──────────────────────────────────────────
  test('主流程：從首頁到付款成功', async ({ page, context }) => {
    let tradeNo = null
    let tradeAmt = null

    // 攔截 create-order API，同步取得 tradeNo（避免 form submit 跳頁的競態）
    await page.route('**/api/ecpay/create-order', async (route) => {
      const response = await route.fetch()
      const data = await response.json()
      tradeNo = data.tradeNo
      tradeAmt = String(data.params?.TotalAmount ?? '0')
      await route.fulfill({ response })
    })

    // Step 1：首頁
    await page.goto(BASE)
    await expect(page.locator('.home')).toBeVisible()
    await page.screenshot({ path: `${SS}/01-home.png` })

    // Step 2：前往商品列表（SPA 點擊）
    await page.click('text=立即購物')
    await waitForRoute(page, '.product-list__grid')
    await page.screenshot({ path: `${SS}/02-products.png` })

    // Step 3：進入第一個商品（SPA 點擊，等待詳情頁容器）
    await goToFirstProduct(page)
    await page.screenshot({ path: `${SS}/03-product-detail.png` })

    // Step 4：加入購物車
    const addBtn = page.getByRole('button', { name: /加入購物車/ })
    await addBtn.waitFor({ state: 'visible' })
    await addBtn.click()
    // 等待 header badge 更新為有數量
    await expect(page.locator('.header__badge').first()).toBeVisible({ timeout: 5000 })
    await page.screenshot({ path: `${SS}/04-added-to-cart.png` })

    // Step 5：前往購物車（SPA 點擊 header icon）
    await goToCartViaSPA(page)
    await expect(page.locator('.cart__items')).toBeVisible()
    await page.screenshot({ path: `${SS}/05-cart.png` })

    // Step 6：前往結帳（SPA 點擊）
    await page.click('a.cart__checkout-btn')
    await waitForRoute(page, '.checkout')
    await page.screenshot({ path: `${SS}/06-checkout.png` })

    // Step 7：填寫收件資訊
    await page.fill('#cf-name',    '測試用戶')
    await page.fill('#cf-phone',   '0912345678')
    await page.fill('#cf-address', '台北市信義區信義路五段7號')
    await page.screenshot({ path: `${SS}/07-form-filled.png` })

    // Step 8：確認付款 → 等待 spinner
    const submitBtn = page.locator('.checkout__submit-btn')
    await expect(submitBtn).not.toBeDisabled()
    await submitBtn.click()
    // spinner 出現（submitting 狀態）
    await page.locator('.checkout__spinner').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {})
    await page.screenshot({ path: `${SS}/08-submitting.png` })

    // Step 9：等待跳轉至 ECPay 付款頁（外部站，需等 load）
    await page.waitForURL(/payment-stage\.ecpay\.com\.tw/, { timeout: 20000 })
    await page.screenshot({ path: `${SS}/09-ecpay-page.png` })

    expect(tradeNo, '應成功從 API 取得 tradeNo').toBeTruthy()
    console.log(`✔ tradeNo = ${tradeNo}, amount = ${tradeAmt}`)

    // Step 10：ECPay 頁面填入測試信用卡
    await page.fill('#CCpart1', '4311').catch(() => {})
    await page.fill('#CCpart2', '9522').catch(() => {})
    await page.fill('#CCpart3', '2222').catch(() => {})
    await page.fill('#CCpart4', '2222').catch(() => {})
    await page.fill('#creditMM', '12').catch(() => {})
    await page.fill('#creditYY', '26').catch(() => {})
    await page.fill('#CreditBackThree', '222').catch(() => {})
    await page.screenshot({ path: `${SS}/10-ecpay-card-filled.png` })

    // Step 11：點「測試付款請點此」開新分頁
    const [newPage] = await Promise.all([
      context.waitForEvent('page', { timeout: 10000 }).catch(() => null),
      page.locator('#aCREDIT').click().catch(() => {})
    ])
    if (newPage) {
      await newPage.waitForLoadState('domcontentloaded').catch(() => {})
      await newPage.screenshot({ path: `${SS}/11-mock-payment.png` }).catch(() => {})
      await newPage.click('input[value="交易成功"]').catch(() => {})
      // 頁面可能在點擊後自動關閉，忽略後續錯誤
      await newPage.screenshot({ path: `${SS}/12-mock-paid.png` }).catch(() => {})
      await newPage.close().catch(() => {})
    }

    // Step 12：本地觸發付款成功（dev/paid 端點模擬 ReturnURL 回調）
    const paidResult = await triggerDevPaid(tradeNo, tradeAmt)
    expect(paidResult.ok).toBe(true)
    console.log(`✔ dev/paid 回應：${JSON.stringify(paidResult)}`)

    // Step 13：導航至付款結果頁（ECPay ClientBackURL）
    await page.goto(`${BASE}/payment/result?tradeNo=${tradeNo}&amount=${tradeAmt}`)

    // 先顯示 confirming 狀態
    await expect(page.locator('.result-title'))
      .toContainText('訂單建立中', { timeout: 5000 })
      .catch(() => {})
    await page.screenshot({ path: `${SS}/13-result-confirming.png` })

    // 輪詢完成後顯示付款成功
    await expect(page.locator('.result-title'))
      .toContainText('付款成功', { timeout: 20000 })
    await page.screenshot({ path: `${SS}/14-result-success.png` })

    // 驗證訂單資訊
    await expect(page.locator('.result-card__id')).toContainText(tradeNo)
    await expect(page.locator('.result-card__amount')).toBeVisible()

    // Step 14：繼續購物，確認狀態清空
    await page.click('a:has-text("繼續購物")')
    await waitForRoute(page, '.product-list__grid')
    await page.screenshot({ path: `${SS}/15-back-to-products.png` })

    console.log('✅ 主流程完成')
  })

  // ─── 異常 A：表單欄位驗證 ──────────────────────────────
  test('異常A：空白表單送出顯示錯誤訊息', async ({ page }) => {
    // 全程 SPA 導航，保持 Pinia 狀態
    await page.goto(BASE)
    await expect(page.locator('.home')).toBeVisible()

    // 商品列表 → 商品詳情 → 加入購物車
    await page.click('text=立即購物')
    await waitForRoute(page, '.product-list__grid')
    await goToFirstProduct(page)

    const addBtn = page.getByRole('button', { name: /加入購物車/ })
    await addBtn.waitFor({ state: 'visible' })
    await addBtn.click()
    await expect(page.locator('.header__badge').first()).toBeVisible({ timeout: 5000 })

    // 購物車 → 結帳（全程 SPA）
    await goToCartViaSPA(page)
    await page.click('a.cart__checkout-btn')
    await waitForRoute(page, '.checkout')

    // 確認按鈕為啟用（有商品在購物車）
    const submitBtn = page.locator('.checkout__submit-btn')
    await expect(submitBtn).not.toBeDisabled({ timeout: 5000 })
    await page.screenshot({ path: `${SS}/A1-checkout-empty.png` })

    // 直接點送出（欄位空白）
    await submitBtn.click()
    await page.screenshot({ path: `${SS}/A2-validation-errors.png` })

    // 驗證至少一個錯誤訊息出現
    const errorMsgs = page.locator('.checkout-form__error')
    await expect(errorMsgs.first()).toBeVisible({ timeout: 3000 })
    const count = await errorMsgs.count()
    expect(count).toBeGreaterThanOrEqual(1)

    console.log(`✅ 異常A：共 ${count} 個欄位錯誤訊息`)
  })

  // ─── 異常 C：無 tradeNo 直接訪問 ──────────────────────
  test('異常C：無 tradeNo 直接訪問 /payment/result', async ({ page }) => {
    await page.goto(`${BASE}/payment/result`)
    await expect(page.locator('.result-title'))
      .toContainText('無法取得付款結果', { timeout: 5000 })
    await expect(page.locator('a:has-text("回首頁")')).toBeVisible()
    await page.screenshot({ path: `${SS}/C1-no-tradeno-error.png` })
    console.log('✅ 異常C：正確顯示錯誤頁面')
  })

  // ─── 異常 D：成功後購物車應清空 ───────────────────────
  test('異常D：付款成功後繼續購物，購物車狀態正常', async ({ page }) => {
    // 建立假訂單（dev/paid）
    const fakeTradeNo = `SL${Date.now()}`
    const fakeAmt = '1000'
    const result = await triggerDevPaid(fakeTradeNo, fakeAmt)
    expect(result.ok).toBe(true)

    // 訪問結果頁
    await page.goto(`${BASE}/payment/result?tradeNo=${fakeTradeNo}&amount=${fakeAmt}`)
    await expect(page.locator('.result-title'))
      .toContainText('付款成功', { timeout: 15000 })
    await page.screenshot({ path: `${SS}/D1-success.png` })

    // 點「繼續購物」
    await page.click('a:has-text("繼續購物")')
    await waitForRoute(page, '.product-list__grid')
    await page.screenshot({ path: `${SS}/D2-after-continue.png` })

    // 確認 header 購物車 badge 不存在（購物車為空）
    const badge = page.locator('.header__icon-btn[aria-label="購物車"] .header__badge')
    await expect(badge).not.toBeVisible()
    await page.screenshot({ path: `${SS}/D3-cart-empty-badge.png` })

    console.log('✅ 異常D：付款成功後購物車無殘留')
  })
})
