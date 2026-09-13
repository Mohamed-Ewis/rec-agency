<script setup lang="ts">
import { LogOut, Menu, PanelLeft, Search } from 'lucide-vue-next'
import { ROLE_LABELS } from '~/utils/constants'

const ui = useUiStore()
const auth = useAuthStore()
const { initials } = useFormat()
const menuOpen = ref(false)

function openSearch() {
  ui.searchOpen = true
}

async function signOut() {
  menuOpen.value = false
  auth.logout()
  await navigateTo('/login')
}
</script>

<template>
  <header class="flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-3 md:px-5">
    <button class="min-h-10 min-w-10 cursor-pointer rounded-md hover:bg-slate-100 lg:hidden" aria-label="Open menu" @click="ui.sidebarOpen = true">
      <Menu class="mx-auto h-5 w-5" :stroke-width="1.75" />
    </button>
    <button class="hidden min-h-10 min-w-10 cursor-pointer rounded-md hover:bg-slate-100 lg:inline-flex" aria-label="Collapse sidebar" @click="ui.sidebarCollapsed = !ui.sidebarCollapsed">
      <PanelLeft class="mx-auto h-5 w-5" :stroke-width="1.75" />
    </button>
    <button
      class="flex min-h-10 flex-1 cursor-pointer items-center gap-2 rounded-md border border-slate-200 bg-canvas px-3 text-left text-sm text-ink-faint transition duration-200 hover:border-primary/40"
      @click="openSearch"
    >
      <Search class="h-4 w-4" :stroke-width="1.75" />
      <span class="flex-1">Search jobs, candidates, clients</span>
      <kbd class="hidden rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-ink-muted sm:inline">Ctrl K</kbd>
    </button>
    <div v-if="auth.currentUser" class="relative">
      <button
        class="flex min-h-11 cursor-pointer items-center gap-2 rounded-md px-1.5 hover:bg-slate-100"
        :aria-expanded="menuOpen"
        aria-haspopup="menu"
        @click="menuOpen = !menuOpen"
      >
        <AppAvatar :name="auth.currentUser.name" :hue="auth.currentUser.avatarHue" />
        <div class="hidden leading-tight sm:block">
          <p class="text-sm font-medium text-ink">{{ auth.currentUser.name }}</p>
          <p class="text-[11px] text-ink-faint">{{ ROLE_LABELS[auth.currentUser.role] }}</p>
        </div>
        <span class="sr-only">{{ initials(auth.currentUser.name) }}</span>
      </button>
      <div
        v-if="menuOpen"
        class="absolute right-0 z-20 mt-1 w-56 rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
        role="menu"
      >
        <p class="px-3 py-2 text-xs text-ink-muted">{{ auth.currentUser.email }}</p>
        <NuxtLink to="/settings" class="block px-3 py-2 text-sm text-ink hover:bg-primary-50" role="menuitem" @click="menuOpen = false">
          Account settings
        </NuxtLink>
        <button class="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm text-red-800 hover:bg-red-50" role="menuitem" @click="signOut">
          <LogOut class="h-4 w-4" :stroke-width="1.75" />
          Sign out
        </button>
      </div>
    </div>
  </header>
</template>
