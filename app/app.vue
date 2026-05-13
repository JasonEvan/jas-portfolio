<!-- app.vue -->
<script setup lang="ts">
const { initAuthListener } = useAuth();
if (import.meta.client) initAuthListener();
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
