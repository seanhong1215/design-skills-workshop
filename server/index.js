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

app.use(cors({ origin: 'http://localhost:5173' }))
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

// ECPay can't reach localhost — responds 1|OK just in case
app.post('/api/ecpay/return', (_req, res) => {
  res.send('1|OK')
})

app.get('/api/ecpay/query/:tradeNo', async (req, res) => {
  try {
    const result = await queryTradeInfo({
      tradeNo: req.params.tradeNo,
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
