<template>
  <AppHeader v-if="!route.meta.hideHeader" />
  <RouterView v-slot="{ Component }">
    <Transition name="page" mode="out-in">
      <component :is="Component" :key="route.path" />
    </Transition>
  </RouterView>
  <AppToast />
</template>

<script setup>
import { RouterView, useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppToast from '@/components/common/AppToast.vue'

const route = useRoute()
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 300ms ease-in-out;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
