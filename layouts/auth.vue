<script setup lang="ts">
const route = useRoute()
useSeoMeta({
  title: () => (route.meta.title as string) || 'Sign in'
})
</script>

<template>
  <div class="flex min-h-dvh items-center justify-center bg-canvas px-4 py-10">
    <slot />
  </div>
</template>
