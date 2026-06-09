<template>
  <AppHeader v-if="!route.meta.hideHeader" />
  <RouterView />
  <AppToast />
</template>

<script setup>
import { RouterView, useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppToast from '@/components/common/AppToast.vue'

const route = useRoute()
</script>
