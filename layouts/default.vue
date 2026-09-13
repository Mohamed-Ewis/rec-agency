<script setup lang="ts">
const ui = useUiStore()
const auth = useAuthStore()
const route = useRoute()

useSeoMeta({
  title: () => (route.meta.title as string) || 'Dashboard'
})

watch(
  () => [auth.sessionUserId, auth.currentUser] as const,
  ([sessionId, user]) => {
    if (sessionId && !user) {
      auth.logout()
      navigateTo('/login')
    }
  }
)
</script>

<template>
  <div class="flex min-h-dvh bg-canvas">
    <div class="hidden lg:block">
      <div class="sticky top-0 h-dvh">
        <AppSidebar />
      </div>
    </div>
    <div v-if="ui.sidebarOpen" class="fixed inset-0 z-40 lg:hidden">
      <button class="absolute inset-0 bg-slate-950/40 cursor-pointer" aria-label="Close menu" @click="ui.sidebarOpen = false" />
      <div class="relative h-full w-64">
        <AppSidebar />
      </div>
    </div>
    <div class="flex min-w-0 flex-1 flex-col">
      <AppTopbar />
      <main id="main" class="mx-auto w-full max-w-dashboard flex-1 px-3 py-5 md:px-6">
        <slot />
      </main>
    </div>
  </div>
</template>
