<script setup lang="ts">
import type { ActivityType } from '~/types'

definePageMeta({ title: 'Activities', resource: 'activities', action: 'view' })

const agency = useAgencyStore()
const fmt = useFormat()
const type = ref<'all' | ActivityType>('all')
const query = ref('')
const ready = usePageReady()

const types: { value: typeof type.value; label: string }[] = [
  { value: 'all', label: 'All types' },
  { value: 'email', label: 'Email' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'call', label: 'Call' },
  { value: 'note', label: 'Note' },
  { value: 'interview', label: 'Interview' },
  { value: 'task', label: 'Task' },
  { value: 'status_change', label: 'Status change' }
]

const filtered = computed(() =>
  agency.activities
    .filter((item) => {
      if (type.value !== 'all' && item.type !== type.value) return false
      const hay = `${item.title} ${item.body}`.toLowerCase()
      return hay.includes(query.value.trim().toLowerCase())
    })
    .slice()
    .sort((a, b) => b.at.localeCompare(a.at))
)
</script>

<template>
  <div>
    <PageHeader eyebrow="Schedule" title="Activities" description="One timeline for email, LinkedIn, calls, notes, interviews, tasks, and status changes." />
    <div class="mb-4 grid gap-3 md:grid-cols-2">
      <AppInput v-model="query" label="Search" />
      <AppSelect v-model="type" label="Type" :options="types" />
    </div>
    <AppSkeleton v-if="!ready" :rows="8" />
    <AppCard v-else flush>
      <ol>
        <li v-for="item in filtered" :key="item.id" class="grid gap-3 border-b border-slate-100 px-4 py-3 last:border-0 md:grid-cols-[7rem_1fr_10rem]">
          <StatusBadge :value="item.type.replace('_', ' ')" />
          <div>
            <p class="text-sm font-medium text-ink">{{ item.title }}</p>
            <p class="text-sm text-ink-muted">{{ item.body }}</p>
            <p class="mt-1 text-xs text-ink-faint">
              <NuxtLink v-if="item.candidateId" :to="`/candidates/${item.candidateId}`" class="text-primary hover:underline">{{ agency.candidateName(item.candidateId) }}</NuxtLink>
              <span v-if="item.jobId"> · <NuxtLink :to="`/jobs/${item.jobId}`" class="hover:underline">{{ agency.jobById[item.jobId]?.title }}</NuxtLink></span>
            </p>
          </div>
          <p class="text-xs text-ink-faint md:text-right">{{ fmt.dateTime(item.at) }}<br>{{ agency.userName(item.actorId) }}</p>
        </li>
      </ol>
      <AppEmpty v-if="!filtered.length" title="No activities match" body="Clear the type filter or try a candidate name in search." />
    </AppCard>
  </div>
</template>
