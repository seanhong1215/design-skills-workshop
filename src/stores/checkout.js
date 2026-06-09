import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useCheckoutStore = defineStore('checkout', () => {
  const form = ref({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'credit'
  })

  const orderStatus = ref('idle')
  const orderId = ref(null)
  const errors = ref({})

  watch(() => form.value.name,    () => { if (errors.value.name)    errors.value = { ...errors.value, name: undefined } })
  watch(() => form.value.phone,   () => { if (errors.value.phone)   errors.value = { ...errors.value, phone: undefined } })
  watch(() => form.value.address, () => { if (errors.value.address) errors.value = { ...errors.value, address: undefined } })

  function validate() {
    const e = {}
    if (!form.value.name.trim()) e.name = '請輸入姓名'
    if (!form.value.phone.trim()) e.phone = '請輸入電話'
    if (!form.value.address.trim()) e.address = '請輸入地址'
    errors.value = e
    return Object.keys(e).length === 0
  }

  function setOrderStatus(status) {
    orderStatus.value = status
  }

  async function submitOrder() {
    if (!validate()) return false

    orderStatus.value = 'submitting'
    orderId.value = null

    await new Promise(resolve => setTimeout(resolve, 1500))

    const id = `SL-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(Math.floor(Math.random() * 9000) + 1000)}`
    orderId.value = id
    orderStatus.value = 'success'
    return true
  }

  function resetOrder() {
    orderStatus.value = 'idle'
    orderId.value = null
    errors.value = {}
  }

  return { form, orderStatus, orderId, errors, validate, setOrderStatus, submitOrder, resetOrder }
})
