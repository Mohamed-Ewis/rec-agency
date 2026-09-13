<script setup lang="ts">
const ui = useUiStore()
const agency = useAgencyStore()
const query = ref('')
const active = ref(0)
const router = useRouter()

const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (q.length < 1) {
    return [
      ...agency.jobs.slice(0, 3).map(job => ({ type: 'Job', label: job.title, to: `/jobs/${job.id}` })),
      ...agency.candidates.slice(0, 3).map(candidate => ({ type: 'Candidate', label: `${candidate.firstName} ${candidate.lastName}`, to: `/candidates/${candidate.id}` }))
    ]
  }
  const pages = [
    { type: 'Page', label: 'Sourcing', to: '/sourcing' },
    { type: 'Page', label: 'Send jobs', to: '/opportunities' },
    { type: 'Page', label: 'Commissions', to: '/placements' }
  ].filter((item) => {
    if (item.label.toLowerCase().includes(q)) return true
    return q.length >= 3 && ['source', 'talent', 'send', 'commission', 'fee', 'invoice', 'placement'].some(key => key.includes(q) || q.includes(key))
  })
  const jobs = agency.jobs
    .filter(job => job.title.toLowerCase().includes(q))
    .slice(0, 5)
    .map(job => ({ type: 'Job', label: job.title, to: `/jobs/${job.id}` }))
  const candidates = agency.candidates
    .filter(candidate => `${candidate.firstName} ${candidate.lastName} ${candidate.skills.join(' ')}`.toLowerCase().includes(q))
    .slice(0, 5)
    .map(candidate => ({ type: 'Candidate', label: `${candidate.firstName} ${candidate.lastName}`, to: `/candidates/${candidate.id}` }))
  const clients = agency.clients
    .filter(client => client.name.toLowerCase().includes(q) || client.industry.toLowerCase().includes(q))
    .slice(0, 4)
    .map(client => ({ type: 'Client', label: client.name, to: `/clients/${client.id}` }))
  return [...pages, ...jobs, ...candidates, ...clients]
})

function go(to: string) {
  ui.searchOpen = false
  query.value = ''
  router.push(to)
}

function onKey(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    ui.searchOpen = !ui.searchOpen
  }
  if (!ui.searchOpen) return
  if (event.key === 'Escape') ui.searchOpen = false
  if (event.key === 'ArrowDown') active.value = Math.min(results.value.length - 1, active.value + 1)
  if (event.key === 'ArrowUp') active.value = Math.max(0, active.value - 1)
  if (event.key === 'Enter' && results.value[active.value]) go(results.value[active.value].to)
}

watch(results, () => { active.value = 0 })

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <div v-if="ui.searchOpen" class="fixed inset-0 z-[65] flex items-start justify-center px-4 pt-[12vh]">
      <button class="absolute inset-0 bg-slate-950/40 cursor-pointer" aria-label="Close search" @click="ui.searchOpen = false" />
      <div role="dialog" aria-label="Global search" class="relative w-full max-w-xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
        <input
          v-model="query"
          class="min-h-12 w-full border-b border-slate-200 px-4 text-sm outline-none"
          placeholder="Search jobs, candidates, clients…"
          aria-label="Search jobs, candidates, and clients"
          autofocus
        >
        <ul v-if="results.length" class="max-h-80 overflow-auto py-1">
          <li v-for="(item, index) in results" :key="item.to">
            <button
              class="flex w-full cursor-pointer items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-primary-50"
              :class="index === active && 'bg-primary-50'"
              @click="go(item.to)"
            >
              <span class="text-ink">{{ item.label }}</span>
              <span class="text-xs text-ink-faint">{{ item.type }}</span>
            </button>
          </li>
        </ul>
        <AppEmpty
          v-else
          title="No matches"
          body="Try a job title, candidate name, skill, or client. Suggestions appear as you type."
        />
      </div>
    </div>
  </Teleport>
</template>
