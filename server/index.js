import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { buildOrderParams, queryTradeInfo } from './ecpay.js'

const app = express()
const PORT = process.env.PORT || 3001

const MERCHANT_ID = process.env.ECPAY_MERCHANT_ID
const HASH_KEY    = process.env.ECPAY_HASH_KEY
const HASH_IV     = process.env.ECPAY_HASH_IV
const IS_STAGE    = process.env.ECPAY_IS_STAGE !== 'false'

// In-memory store: tradeNo → { tradeStatus, tradeAmt, paymentDate }
// Used when ECPay cannot POST to localhost ReturnURL
const localPaymentStore = new Map()

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.post('/api/ecpay/create-order', (req, res) => {
  const { cartItems, total } = req.body

  if (!Array.isArray(cartItems) || !cartItems.length || !total) {
    return res.status(400).json({ error: '缺少購物車資料' })
  }

  try {
    const result = buildOrderParams({
      cartItems,
      total: Math.round(total),
      merchantId: MERCHANT_ID,
      hashKey: HASH_KEY,
      hashIv: HASH_IV,
      isStage: IS_STAGE,
      clientBackUrl: 'http://localhost:5173/payment/result',
      returnUrl: 'http://localhost:3001/api/ecpay/return'
    })
    res.json(result)
  } catch (err) {
    console.error('[ECPay create-order]', err)
    res.status(500).json({ error: err.message })
  }
})

// ECPay server-side callback — saves result to local store
app.post('/api/ecpay/return', (req, res) => {
  const { MerchantTradeNo, TradeStatus, TradeAmt, PaymentDate } = req.body
  if (MerchantTradeNo) {
    localPaymentStore.set(MerchantTradeNo, {
      tradeStatus: TradeStatus ?? '0',
      tradeAmt: TradeAmt ?? '0',
      paymentDate: PaymentDate ?? ''
    })
    console.log(`[ECPay return] ${MerchantTradeNo} status=${TradeStatus}`)
  }
  res.send('1|OK')
})

// Dev-only: manually mark a trade as paid (replaces ngrok for local E2E tests)
app.post('/api/ecpay/dev/paid/:tradeNo', (req, res) => {
  if (!IS_STAGE) return res.status(403).json({ error: 'dev endpoint only available in stage mode' })
  const { tradeNo } = req.params
  const tradeAmt = req.body.amount ?? req.query.amount ?? '0'
  const paymentDate = new Date().toLocaleString('sv-SE').replace('T', ' ')
  localPaymentStore.set(tradeNo, { tradeStatus: '1', tradeAmt, paymentDate })
  console.log(`[ECPay dev/paid] manually marked ${tradeNo} as paid`)
  res.json({ ok: true, tradeNo, tradeAmt, paymentDate })
})

app.get('/api/ecpay/query/:tradeNo', async (req, res) => {
  const { tradeNo } = req.params

  // Check local store first (covers both real return callback and dev/paid trigger)
  if (localPaymentStore.has(tradeNo)) {
    const local = localPaymentStore.get(tradeNo)
    return res.json({
      tradeStatus: local.tradeStatus,
      tradeNo,
      tradeAmt: local.tradeAmt,
      paymentDate: local.paymentDate,
      isPaid: local.tradeStatus === '1'
    })
  }

  try {
    const result = await queryTradeInfo({
      tradeNo,
      merchantId: MERCHANT_ID,
      hashKey: HASH_KEY,
      hashIv: HASH_IV,
      isStage: IS_STAGE
    })
    res.json({
      tradeStatus: result.TradeStatus,
      tradeNo: result.MerchantTradeNo,
      tradeAmt: result.TradeAmt,
      paymentDate: result.PaymentDate,
      isPaid: result.TradeStatus === '1'
    })
  } catch (err) {
    console.error('[ECPay query]', err)
    res.status(500).json({ error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`[ECPay server] http://localhost:${PORT}`)
})
