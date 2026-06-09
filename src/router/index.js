import { createRouter, createWebHistory } from 'vue-router'
import { ROUTE_NAMES } from '@/constants/routes.js'

const routes = [
  {
    path: '/',
    name: ROUTE_NAMES.HOME,
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/about',
    name: ROUTE_NAMES.ABOUT,
    component: () => import('@/views/AboutView.vue')
  },
  {
    path: '/categories',
    name: ROUTE_NAMES.CATEGORIES,
    component: () => import('@/views/CategoriesView.vue')
  },
  {
    path: '/wishlist',
    name: ROUTE_NAMES.WISHLIST,
    component: () => import('@/views/WishlistView.vue')
  },
  {
    path: '/products',
    name: ROUTE_NAMES.PRODUCT_LIST,
    component: () => import('@/views/ProductListView.vue')
  },
  {
    path: '/products/:id',
    name: ROUTE_NAMES.PRODUCT_DETAIL,
    component: () => import('@/views/ProductDetailView.vue')
  },
  {
    path: '/cart',
    name: ROUTE_NAMES.CART,
    component: () => import('@/views/CartView.vue')
  },
  {
    path: '/checkout',
    name: ROUTE_NAMES.CHECKOUT,
    component: () => import('@/views/CheckoutView.vue'),
    meta: { hideHeader: true }
  },
  {
    path: '/checkout/success',
    name: ROUTE_NAMES.PAYMENT_SUCCESS,
    component: () => import('@/views/PaymentSuccessView.vue'),
    meta: { hideHeader: true }
  },
  {
    path: '/payment/result',
    name: ROUTE_NAMES.PAYMENT_RESULT,
    component: () => import('@/views/PaymentResultView.vue'),
    meta: { hideHeader: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: ROUTE_NAMES.NOT_FOUND,
    component: () => import('@/views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  }
})

export default router
