<script setup lang="ts">
definePageMeta({ title: 'Clients', resource: 'clients', action: 'view' })

const agency = useAgencyStore()
const query = ref('')
const ready = usePageReady()
const fmt = useFormat()

const filtered = computed(() =>
  agency.clients.filter((client) => {
    const hay = `${client.name} ${client.industry} ${client.location}`.toLowerCase()
    return hay.includes(query.value.trim().toLowerCase())
  })
)
</script>

<template>
  <div>
    <PageHeader eyebrow="Desk" title="Clients" description="Who we work for, the fee, and which briefs are live." />
    <div class="mb-4 max-w-sm">
      <AppInput v-model="query" label="Search" hint="Company, industry, city" />
    </div>
    <AppSkeleton v-if="!ready" :cards="6" :rows="1" />
    <div v-else class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      <NuxtLink
        v-for="client in filtered"
        :key="client.id"
        :to="`/clients/${client.id}`"
        class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:border-primary/40"
      >
        <p class="font-mono text-sm font-semibold text-ink">{{ client.name }}</p>
        <p class="text-xs text-ink-faint">{{ client.industry }} · {{ client.location }}</p>
        <p class="mt-3 text-sm text-ink-muted">Fee {{ client.feePercent }}% · {{ agency.jobs.filter(job => job.clientId === client.id && job.status === 'open').length }} open jobs</p>
        <p class="mt-1 font-mono text-xs tabular text-ink-faint">Owner {{ agency.userName(client.ownerId) }} · since {{ fmt.date(client.createdAt) }}</p>
      </NuxtLink>
    </div>
    <AppEmpty v-if="ready && !filtered.length" title="No clients match" body="Try an industry like fintech or a city name." />
  </div>
</template>
