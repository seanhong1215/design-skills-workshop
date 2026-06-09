<template>
  <AppHeader />
  <RouterView />
  <AppToast />
</template>

<script setup>
import { RouterView } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppToast from '@/components/common/AppToast.vue'
</script>
