<script setup lang="ts">
definePageMeta({ title: 'Candidates', resource: 'candidates', action: 'view' })

const agency = useAgencyStore()
const query = ref('')
const source = ref('all')
const owner = ref('all')
const ready = usePageReady()

const sources = computed(() => ['all', ...new Set(agency.candidates.map(item => item.source))])
const filtered = computed(() =>
  agency.candidates.filter((candidate) => {
    if (source.value !== 'all' && candidate.source !== source.value) return false
    if (owner.value !== 'all' && candidate.ownerId !== owner.value) return false
    const hay = `${candidate.firstName} ${candidate.lastName} ${candidate.skills.join(' ')} ${candidate.currentTitle} ${candidate.location}`.toLowerCase()
    return hay.includes(query.value.trim().toLowerCase())
  })
)
const table = useTable(filtered, { pageSize: 10 })
const fmt = useFormat()
</script>

<template>
  <div>
    <PageHeader eyebrow="Desk" title="Candidates" description="People we can actually represent — source, skills, and where they sit in a brief." />
    <div class="mb-4 grid gap-3 md:grid-cols-3">
      <AppInput v-model="query" label="Search" hint="Name, skill, title, city" />
      <AppSelect v-model="source" label="Source" :options="sources.map(item => ({ value: item, label: item === 'all' ? 'All sources' : item }))" />
      <AppSelect
        v-model="owner"
        label="Owner"
        :options="[{ value: 'all', label: 'All owners' }, ...agency.users.map(user => ({ value: user.id, label: user.name }))]"
      />
    </div>
    <AppSkeleton v-if="!ready" :rows="8" />
    <AppCard v-else flush>
      <div class="overflow-x-auto">
        <table class="min-w-[900px] w-full text-left text-sm">
          <thead class="border-b border-slate-200 bg-slate-50 text-xs uppercase text-ink-faint">
            <tr>
              <th class="px-4 py-2 font-medium">Candidate</th>
              <th class="px-4 py-2 font-medium">Title</th>
              <th class="px-4 py-2 font-medium">Skills</th>
              <th class="px-4 py-2 font-medium">Expect.</th>
              <th class="px-4 py-2 font-medium">Availability</th>
              <th class="px-4 py-2 font-medium">Owner</th>
              <th class="px-4 py-2 font-medium">Jobs</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="candidate in table.rows" :key="candidate.id" class="border-b border-slate-100 hover:bg-primary-50/60">
              <td class="px-4 py-2.5">
                <NuxtLink :to="`/candidates/${candidate.id}`" class="font-medium text-primary hover:underline">
                  {{ candidate.firstName }} {{ candidate.lastName }}
                </NuxtLink>
                <p class="text-xs text-ink-faint">{{ candidate.location }} · {{ candidate.source }}</p>
              </td>
              <td class="px-4 py-2.5 text-ink-muted">{{ candidate.currentTitle }}</td>
              <td class="px-4 py-2.5">
                <div class="flex flex-wrap gap-1">
                  <AppBadge v-for="skill in candidate.skills.slice(0, 3)" :key="skill" :label="skill" />
                </div>
              </td>
              <td class="px-4 py-2.5 font-mono text-xs tabular">{{ fmt.compactMoney(candidate.salaryExpectation) }}</td>
              <td class="px-4 py-2.5"><StatusBadge :value="candidate.availability" /></td>
              <td class="px-4 py-2.5 text-ink-muted">{{ agency.userName(candidate.ownerId) }}</td>
              <td class="px-4 py-2.5 font-mono tabular">{{ agency.entriesForCandidate(candidate.id).length }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <AppEmpty v-if="!filtered.length" title="No candidates match" body="Try a skill like Nuxt, Kubernetes, or a city. Clear source if the list looks too narrow." />
      <AppPagination :page="table.page" :page-count="table.pageCount" :total="filtered.length" @update:page="table.page = $event" />
    </AppCard>
  </div>
</template>
