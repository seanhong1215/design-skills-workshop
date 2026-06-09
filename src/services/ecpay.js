import axios from 'axios'

export async function createEcpayOrder(cartItems, total) {
  const { data } = await axios.post('/api/ecpay/create-order', { cartItems, total })
  return data  // { tradeNo, aioUrl, params }
}

export async function queryPaymentResult(tradeNo) {
  const { data } = await axios.get(`/api/ecpay/query/${tradeNo}`)
  return data  // { tradeStatus, tradeNo, tradeAmt, paymentDate, isPaid }
}

export function submitEcpayForm(aioUrl, params) {
  const form = document.createElement('form')
  form.method = 'post'
  form.action = aioUrl
  for (const [key, value] of Object.entries(params)) {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = key
    input.value = String(value)
    form.appendChild(input)
  }
  document.body.appendChild(form)
  form.submit()
}
