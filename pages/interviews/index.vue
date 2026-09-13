<script setup lang="ts">
definePageMeta({ title: 'Interviews', resource: 'interviews', action: 'view' })

const agency = useAgencyStore()
const fmt = useFormat()
const tab = ref<'upcoming' | 'past'>('upcoming')
const ready = usePageReady()

const upcoming = computed(() =>
  agency.interviews.filter(item => item.status === 'scheduled').sort((a, b) => a.startsAt.localeCompare(b.startsAt))
)
const past = computed(() =>
  agency.interviews.filter(item => item.status !== 'scheduled').sort((a, b) => b.startsAt.localeCompare(a.startsAt))
)
const rows = computed(() => (tab.value === 'upcoming' ? upcoming.value : past.value))
</script>

<template>
  <div>
    <PageHeader eyebrow="Schedule" title="Interviews" description="Who is in front of a client, when, and whether we captured feedback.">
      <template #actions>
        <div class="flex rounded-md border border-slate-200 bg-white p-0.5">
          <button class="min-h-10 cursor-pointer rounded px-3 text-sm" :class="tab === 'upcoming' && 'bg-primary-50 font-semibold text-primary'" @click="tab = 'upcoming'">Upcoming</button>
          <button class="min-h-10 cursor-pointer rounded px-3 text-sm" :class="tab === 'past' && 'bg-primary-50 font-semibold text-primary'" @click="tab = 'past'">Past</button>
        </div>
      </template>
    </PageHeader>
    <AppSkeleton v-if="!ready" :rows="7" />
    <AppCard v-else flush>
      <div class="overflow-x-auto">
        <table class="min-w-[880px] w-full text-left text-sm">
          <thead class="border-b border-slate-200 bg-slate-50 text-xs uppercase text-ink-faint">
            <tr>
              <th class="px-4 py-2 font-medium">When</th>
              <th class="px-4 py-2 font-medium">Candidate</th>
              <th class="px-4 py-2 font-medium">Job / Client</th>
              <th class="px-4 py-2 font-medium">Interviewer</th>
              <th class="px-4 py-2 font-medium">Stage</th>
              <th class="px-4 py-2 font-medium">Status</th>
              <th class="px-4 py-2 font-medium">Feedback</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in rows" :key="item.id" class="border-b border-slate-100 align-top hover:bg-primary-50/60">
              <td class="px-4 py-2.5 font-mono text-xs tabular">{{ fmt.dateTime(item.startsAt) }}<p class="text-ink-faint">{{ item.durationMin }}m</p></td>
              <td class="px-4 py-2.5"><NuxtLink :to="`/candidates/${item.candidateId}`" class="text-primary hover:underline">{{ agency.candidateName(item.candidateId) }}</NuxtLink></td>
              <td class="px-4 py-2.5">
                <NuxtLink :to="`/jobs/${item.jobId}`" class="hover:underline">{{ agency.jobById[item.jobId]?.title }}</NuxtLink>
                <p class="text-xs text-ink-faint">{{ agency.clientById[agency.jobById[item.jobId]?.clientId ?? '']?.name }}</p>
              </td>
              <td class="px-4 py-2.5 text-ink-muted">{{ item.interviewer }}</td>
              <td class="px-4 py-2.5"><StatusBadge :value="item.stage" /></td>
              <td class="px-4 py-2.5"><StatusBadge :value="item.status" /></td>
              <td class="max-w-xs px-4 py-2.5 text-xs text-ink-muted">{{ item.feedback || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <AppEmpty v-if="!rows.length" title="Nothing in this list" body="Switch to Past if you are looking for completed loops." />
    </AppCard>
  </div>
</template>
