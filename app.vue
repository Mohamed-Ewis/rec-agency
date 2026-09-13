<script setup lang="ts">
const auth = useAuthStore()
</script>

<template>
  <div>
    <a class="skip-link" href="#main">Skip to main content</a>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <AppToasts />
    <AppConfirm />
    <AppCommandSearch v-if="auth.isAuthenticated" />
  </div>
</template>
