<!-- layouts/default.vue -->
<template>
  <div class="site-wrapper">
    <AppNavbar />
    <main>
      <slot />
    </main>
    <AppFooter />
    <Toaster position="bottom-center" richColors />
  </div>
</template>

<script setup lang="ts">
import { Toaster } from 'vue-sonner'
</script>

<style>
.site-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}
</style>
