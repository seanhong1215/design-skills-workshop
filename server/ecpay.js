import crypto from 'node:crypto'

function ecpayUrlEncode(source) {
  let encoded = encodeURIComponent(source)
    .replace(/%20/g, '+')
    .replace(/~/g, '%7e')
    .replace(/'/g, '%27')
  encoded = encoded.toLowerCase()
  const map = {
    '%2d': '-', '%5f': '_', '%2e': '.', '%21': '!',
    '%2a': '*', '%28': '(', '%29': ')'
  }
  for (const [k, v] of Object.entries(map)) {
    encoded = encoded.split(k).join(v)
  }
  return encoded
}

export function generateCheckMacValue(params, hashKey, hashIv) {
  const filtered = Object.fromEntries(
    Object.entries(params).filter(([k]) => k !== 'CheckMacValue')
  )
  const sorted = Object.keys(filtered)
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
  const paramStr = sorted.map(k => `${k}=${filtered[k]}`).join('&')
  const raw = `HashKey=${hashKey}&${paramStr}&HashIV=${hashIv}`
  const encoded = ecpayUrlEncode(raw)
  return crypto.createHash('sha256').update(encoded, 'utf8').digest('hex').toUpperCase()
}

function getTaiwanDateTime() {
  return new Date().toLocaleString('sv-SE', {
    timeZone: 'Asia/Taipei',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  }).replace(/-/g, '/')
}

export function buildOrderParams({ cartItems, total, merchantId, hashKey, hashIv, isStage, clientBackUrl, returnUrl }) {
  const tradeNo = `SL${Date.now()}`
  const itemName = cartItems
    .map(i => `${i.product.name} x${i.qty}`)
    .join('#')
    .slice(0, 400)

  const params = {
    MerchantID: merchantId,
    MerchantTradeNo: tradeNo,
    MerchantTradeDate: getTaiwanDateTime(),
    PaymentType: 'aio',
    TotalAmount: String(total),
    TradeDesc: 'ShopLab Order',
    ItemName: itemName,
    ReturnURL: returnUrl,
    ClientBackURL: `${clientBackUrl}?tradeNo=${tradeNo}&amount=${total}`,
    ChoosePayment: 'Credit',
    EncryptType: '1'
  }

  params.CheckMacValue = generateCheckMacValue(params, hashKey, hashIv)

  const aioUrl = isStage
    ? 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5'
    : 'https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5'

  return { tradeNo, aioUrl, params }
}

export async function queryTradeInfo({ tradeNo, merchantId, hashKey, hashIv, isStage }) {
  const timeStamp = String(Math.floor(Date.now() / 1000))
  const params = {
    MerchantID: merchantId,
    MerchantTradeNo: tradeNo,
    TimeStamp: timeStamp
  }
  params.CheckMacValue = generateCheckMacValue(params, hashKey, hashIv)

  const queryUrl = isStage
    ? 'https://payment-stage.ecpay.com.tw/Cashier/QueryTradeInfo/V5'
    : 'https://payment.ecpay.com.tw/Cashier/QueryTradeInfo/V5'

  const resp = await fetch(queryUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params).toString()
  })

  if (!resp.ok) throw new Error(`ECPay QueryTradeInfo HTTP ${resp.status}`)

  const text = await resp.text()
  return Object.fromEntries(new URLSearchParams(text))
}
