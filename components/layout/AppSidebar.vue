<script setup lang="ts">
import {
  Activity,
  Banknote,
  BarChart3,
  Briefcase,
  Building2,
  CalendarDays,
  CheckSquare,
  Kanban,
  LayoutDashboard,
  Search,
  Send,
  Settings,
  Shield,
  Users
} from 'lucide-vue-next'
import { NAV_ITEMS } from '~/utils/constants'

const icons = {
  LayoutDashboard,
  Briefcase,
  Users,
  Building2,
  Kanban,
  CalendarDays,
  Activity,
  CheckSquare,
  BarChart3,
  Shield,
  Settings,
  Search,
  Send,
  Banknote
}

const route = useRoute()
const ui = useUiStore()
const { can } = usePermissions()

const items = computed(() =>
  NAV_ITEMS.filter((item) => {
    if (!('resource' in item) || !item.resource) return true
    return can(item.resource, item.action)
  })
)

const groups = computed(() => {
  const map = new Map<string, typeof items.value>()
  for (const item of items.value) {
    const list = map.get(item.group) ?? []
    list.push(item)
    map.set(item.group, list)
  }
  return [...map.entries()]
})

function isActive(to: string) {
  if (to === '/') return route.path === '/'
  return route.path === to || route.path.startsWith(`${to}/`)
}
</script>

<template>
  <aside
    class="flex h-full flex-col border-r border-slate-200 bg-white"
    :class="ui.sidebarCollapsed ? 'w-16' : 'w-52'"
  >
    <div class="flex h-14 items-center gap-2 border-b border-slate-200 px-3">
      <span class="flex h-8 w-8 items-center justify-center rounded-md bg-primary font-mono text-xs font-bold text-white">RA</span>
      <div v-if="!ui.sidebarCollapsed">
        <p class="font-mono text-sm font-semibold text-ink">rec-agency</p>
        <p class="text-[11px] text-ink-faint">Recruitment ops</p>
      </div>
    </div>
    <nav class="flex-1 overflow-y-auto px-2 py-3" aria-label="Primary">
      <div v-for="[group, links] in groups" :key="group" class="mb-4">
        <p v-if="!ui.sidebarCollapsed" class="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-ink-faint">{{ group }}</p>
        <NuxtLink
          v-for="item in links"
          :key="item.to"
          :to="item.to"
          class="mb-0.5 flex min-h-10 items-center gap-2 rounded-md px-2 text-sm transition duration-200 hover:bg-primary-50"
          :class="isActive(item.to) ? 'bg-primary-50 font-semibold text-primary' : 'text-slate-700'"
          :title="item.label"
          @click="ui.sidebarOpen = false"
        >
          <component :is="icons[item.icon]" class="h-4 w-4 shrink-0" :stroke-width="1.75" />
          <span v-if="!ui.sidebarCollapsed">{{ item.label }}</span>
        </NuxtLink>
      </div>
    </nav>
  </aside>
</template>
