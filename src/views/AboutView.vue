<template>
  <div class="about-page">
    <section class="about-hero">
      <h1 class="about-hero__title">關於 ShopLab</h1>
      <p class="about-hero__subtitle">我們相信購物就是快速、安心、有意義的體驗</p>
      <div class="about-hero__actions">
        <RouterLink :to="{ name: ROUTE_NAMES.PRODUCT_LIST }" class="about-btn about-btn--primary">立即購物</RouterLink>
        <a href="#contact" class="about-btn about-btn--outline" @click.prevent="scrollToContact">聯絡我們</a>
      </div>
    </section>

    <section class="about-story">
      <div class="about-story__inner">
        <div class="about-story__image-wrap">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80"
            alt="購物體驗"
            class="about-story__image"
          />
        </div>
        <div class="about-story__content">
          <p class="about-story__label">我們的故事</p>
          <h2 class="about-story__title">打造最好的購物體驗</h2>
          <p class="about-story__text">
            ShopLab 成立於 2020 年，致力為每位顧客提供安心、便捷、有趣的購物體驗。
            我們精選來自全球各地的優質商品，結合快速物流與貼心服務，讓您在家就能享受購物樂趣。
          </p>
        </div>
      </div>
    </section>

    <section class="about-features">
      <div class="about-features__grid">
        <div v-for="feat in features" :key="feat.id" class="feature-card">
          <component :is="feat.icon" :size="28" :color="feat.color" class="feature-card__icon" />
          <h3 class="feature-card__title">{{ feat.title }}</h3>
          <p class="feature-card__desc">{{ feat.desc }}</p>
        </div>
      </div>
    </section>

    <!-- 聯絡我們表單 -->
    <section id="contact" ref="contactRef" class="about-contact">
      <div class="about-contact__inner">
        <div class="about-contact__head">
          <Mail :size="32" class="about-contact__icon" />
          <h2 class="about-contact__title">聯絡我們</h2>
          <p class="about-contact__subtitle">有任何問題或建議，歡迎留言，我們將在 1 個工作天內回覆</p>
        </div>

        <form v-if="!submitted" class="contact-form" @submit.prevent="handleSubmit" novalidate>
          <div class="contact-form__row">
            <div class="contact-form__field" :class="{ error: errors.name }">
              <label class="contact-form__label">姓名 <span>*</span></label>
              <input v-model="form.name" class="contact-form__input" type="text" placeholder="您的姓名" />
              <p v-if="errors.name" class="contact-form__error">{{ errors.name }}</p>
            </div>
            <div class="contact-form__field" :class="{ error: errors.email }">
              <label class="contact-form__label">電子郵件 <span>*</span></label>
              <input v-model="form.email" class="contact-form__input" type="email" placeholder="your@email.com" />
              <p v-if="errors.email" class="contact-form__error">{{ errors.email }}</p>
            </div>
          </div>
          <div class="contact-form__field" :class="{ error: errors.subject }">
            <label class="contact-form__label">主旨 <span>*</span></label>
            <input v-model="form.subject" class="contact-form__input" type="text" placeholder="您的問題主旨" />
            <p v-if="errors.subject" class="contact-form__error">{{ errors.subject }}</p>
          </div>
          <div class="contact-form__field" :class="{ error: errors.message }">
            <label class="contact-form__label">訊息內容 <span>*</span></label>
            <textarea v-model="form.message" class="contact-form__textarea" rows="5" placeholder="請描述您的問題或建議…"></textarea>
            <p v-if="errors.message" class="contact-form__error">{{ errors.message }}</p>
          </div>
          <button type="submit" class="contact-form__submit" :disabled="submitting">
            <Loader2 v-if="submitting" :size="16" class="contact-form__spinner" />
            <Send v-else :size="16" />
            {{ submitting ? '傳送中…' : '送出訊息' }}
          </button>
        </form>

        <div v-else class="contact-success">
          <div class="contact-success__check">
            <Check :size="28" stroke-width="2.5" />
          </div>
          <h3 class="contact-success__title">訊息已送出！</h3>
          <p class="contact-success__desc">感謝您的來信，我們將在 1 個工作天內回覆至 {{ form.email }}</p>
          <button class="contact-success__reset" @click="resetForm">再次留言</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ShieldCheck, Truck, Headphones, Mail, Send, Loader2, Check } from 'lucide-vue-next'
import { ROUTE_NAMES } from '@/constants/routes.js'

const features = [
  {
    id: 'safe',
    icon: ShieldCheck,
    color: '#16A34A',
    title: '安心保障',
    desc: '正品品質，7 天無理由退換，消費者保護'
  },
  {
    id: 'delivery',
    icon: Truck,
    color: '#4A9FD8',
    title: '快速配送',
    desc: '全台 48 小時到貨，偏遠地區另計'
  },
  {
    id: 'support',
    icon: Headphones,
    color: '#EA7C2A',
    title: '優質客服',
    desc: '週一至週日 09:00–21:00 線上客服服務'
  }
]

const contactRef = ref(null)
const submitted = ref(false)
const submitting = ref(false)

const form = ref({ name: '', email: '', subject: '', message: '' })
const errors = ref({})

function scrollToContact() {
  contactRef.value?.scrollIntoView({ behavior: 'smooth' })
}

function validate() {
  const e = {}
  if (!form.value.name.trim()) e.name = '請輸入姓名'
  if (!form.value.email.trim()) {
    e.email = '請輸入電子郵件'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    e.email = '電子郵件格式不正確'
  }
  if (!form.value.subject.trim()) e.subject = '請輸入主旨'
  if (!form.value.message.trim()) e.message = '請輸入訊息內容'
  errors.value = e
  return Object.keys(e).length === 0
}

async function handleSubmit() {
  if (!validate()) return
  submitting.value = true
  await new Promise(r => setTimeout(r, 1000))
  submitting.value = false
  submitted.value = true
}

function resetForm() {
  form.value = { name: '', email: '', subject: '', message: '' }
  errors.value = {}
  submitted.value = false
}
</script>

<style scoped>
.about-page {
  max-width: 1200px;
  margin: 0 auto;
}

/* Hero */
.about-hero {
  background-color: var(--color-bg-subtle);
  text-align: center;
  padding: var(--space-16) var(--space-6);
}

.about-hero__title {
  font-size: var(--text-4xl);
  font-weight: 800;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-4);
}

.about-hero__subtitle {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-8);
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
}

.about-hero__actions {
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  flex-wrap: wrap;
}

.about-btn {
  padding: var(--space-3) var(--space-8);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  font-weight: 600;
  text-decoration: none;
  transition: all var(--transition-fast);
  cursor: pointer;
  border: none;
}

.about-btn--primary {
  background-color: var(--color-accent-primary);
  color: #fff;
}

.about-btn--primary:hover {
  background-color: var(--color-accent-hover);
}

.about-btn--outline {
  border: 2px solid var(--color-border-strong);
  color: var(--color-text-primary);
  background: none;
}

.about-btn--outline:hover {
  border-color: var(--color-accent-primary);
  color: var(--color-accent-primary);
}

/* Story */
.about-story {
  padding: var(--space-16) var(--space-6);
}

.about-story__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-12);
  align-items: center;
  max-width: 960px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .about-story__inner {
    grid-template-columns: 1fr;
  }
}

.about-story__image-wrap {
  border-radius: var(--radius-xl);
  overflow: hidden;
  aspect-ratio: 4 / 3;
}

.about-story__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.about-story__label {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-accent-primary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 var(--space-3);
}

.about-story__title {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-5);
  line-height: var(--leading-tight);
}

.about-story__text {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin: 0;
}

/* Features */
.about-features {
  background-color: var(--color-bg-subtle);
  padding: var(--space-12) var(--space-6);
}

.about-features__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
  max-width: 900px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .about-features__grid {
    grid-template-columns: 1fr;
  }
}

.feature-card {
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.feature-card__icon {
  flex-shrink: 0;
}

.feature-card__title {
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.feature-card__desc {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin: 0;
}

/* Contact */
.about-contact {
  padding: var(--space-16) var(--space-6);
}

.about-contact__inner {
  max-width: 680px;
  margin: 0 auto;
}

.about-contact__head {
  text-align: center;
  margin-bottom: var(--space-8);
}

.about-contact__icon {
  color: var(--color-accent-primary);
  margin-bottom: var(--space-3);
}

.about-contact__title {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-2);
}

.about-contact__subtitle {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

/* Form */
.contact-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.contact-form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

@media (max-width: 600px) {
  .contact-form__row { grid-template-columns: 1fr; }
}

.contact-form__field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.contact-form__label {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
}

.contact-form__label span {
  color: var(--color-status-error);
}

.contact-form__input,
.contact-form__textarea {
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  background-color: var(--color-bg-surface);
  transition: border-color var(--transition-fast);
  font-family: inherit;
  resize: vertical;
}

.contact-form__input:focus,
.contact-form__textarea:focus {
  outline: none;
  border-color: var(--color-accent-primary);
}

.contact-form__field.error .contact-form__input,
.contact-form__field.error .contact-form__textarea {
  border-color: var(--color-status-error);
}

.contact-form__error {
  font-size: var(--text-xs);
  color: var(--color-status-error);
  margin: 0;
}

.contact-form__submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-8);
  background-color: var(--color-accent-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--transition-fast);
  align-self: flex-end;
}

.contact-form__submit:hover:not(:disabled) {
  background-color: var(--color-accent-hover);
}

.contact-form__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.contact-form__spinner {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Success state */
.contact-success {
  text-align: center;
  padding: var(--space-12) var(--space-6);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

.contact-success__check {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-full);
  background-color: #dcfce7;
  color: var(--color-status-success);
  display: flex;
  align-items: center;
  justify-content: center;
}

.contact-success__title {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.contact-success__desc {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.contact-success__reset {
  margin-top: var(--space-2);
  padding: var(--space-2) var(--space-6);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  background: none;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.contact-success__reset:hover {
  border-color: var(--color-accent-primary);
  color: var(--color-accent-primary);
}
</style>
