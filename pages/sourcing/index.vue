<script setup lang="ts">
definePageMeta({ title: 'Sourcing', resource: 'sourcing', action: 'view' })

const route = useRoute()
const agency = useAgencyStore()
const auth = useAuthStore()
const ui = useUiStore()
const { can } = usePermissions()
const fmt = useFormat()
const ready = usePageReady()

const jobId = ref(typeof route.query.job === 'string' ? route.query.job : agency.openJobs[0]?.id ?? '')
const query = ref('')
const location = ref('all')
const minYears = ref('0')
const maxSalary = ref('all')
const availability = ref('all')
const minScore = ref('0')

const sendOpen = ref(false)
const sendCandidateId = ref('')

const jobOptions = computed(() =>
  agency.jobs
    .filter(job => job.status === 'open' || job.status === 'paused')
    .map(job => ({ value: job.id, label: `${job.title} — ${agency.clientById[job.clientId]?.name ?? ''}` }))
)

const locations = computed(() => {
  const cities = new Set(agency.candidates.map(item => item.location.split(',')[0]?.trim()).filter(Boolean) as string[])
  return ['all', ...[...cities].sort()]
})

const rows = computed(() => {
  if (!jobId.value) return []
  return agency.talentForJob(jobId.value).filter((row) => {
    if (Number(minYears.value) && row.candidate.yearsExperience < Number(minYears.value)) return false
    if (maxSalary.value !== 'all' && row.candidate.salaryExpectation > Number(maxSalary.value)) return false
    if (availability.value !== 'all' && row.candidate.availability !== availability.value) return false
    if (location.value !== 'all' && !row.candidate.location.startsWith(location.value)) return false
    if (Number(minScore.value) && row.match.score < Number(minScore.value)) return false
    const hay = `${row.candidate.firstName} ${row.candidate.lastName} ${row.candidate.skills.join(' ')} ${row.candidate.currentTitle} ${row.candidate.location}`.toLowerCase()
    return hay.includes(query.value.trim().toLowerCase())
  })
})

const table = useTable(rows, { pageSize: 8 })
const selectedJob = computed(() => agency.jobById[jobId.value])

function addToJob(candidateId: string) {
  if (!jobId.value || !auth.currentUser) return
  agency.addCandidateToJob(jobId.value, candidateId, auth.currentUser.id)
  ui.toast('Added to the client pipeline as Sourced')
}

function openSend(candidateId: string) {
  sendCandidateId.value = candidateId
  sendOpen.value = true
}
</script>

<template>
  <div>
    <PageHeader
      eyebrow="Market"
      title="Sourcing"
      description="Find people who fit a client brief — then add them to the pipeline or send the job."
    >
      <template #actions>
        <NuxtLink v-if="jobId" :to="`/jobs/${jobId}`" class="text-sm font-medium text-primary hover:underline">Open brief</NuxtLink>
      </template>
    </PageHeader>

    <div class="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      <AppSelect v-model="jobId" label="Client job" :options="jobOptions.length ? jobOptions : [{ value: '', label: 'No live jobs' }]" />
      <AppInput v-model="query" label="Search talent" hint="Name, skill, title, city" />
      <AppSelect v-model="location" label="Location" :options="locations.map(item => ({ value: item, label: item === 'all' ? 'Any city' : item }))" />
      <AppSelect
        v-model="minYears"
        label="Min. years"
        :options="[
          { value: '0', label: 'Any experience' },
          { value: '3', label: '3+ years' },
          { value: '5', label: '5+ years' },
          { value: '7', label: '7+ years' },
          { value: '10', label: '10+ years' }
        ]"
      />
      <AppSelect
        v-model="maxSalary"
        label="Max expectation"
        :options="[
          { value: 'all', label: 'Any salary' },
          { value: '90000', label: 'Up to £90k' },
          { value: '110000', label: 'Up to £110k' },
          { value: '130000', label: 'Up to £130k' },
          { value: '160000', label: 'Up to £160k' }
        ]"
      />
      <AppSelect
        v-model="availability"
        label="Availability"
        :options="[
          { value: 'all', label: 'Any availability' },
          { value: 'immediate', label: 'Immediate' },
          { value: '2_weeks', label: '2 weeks' },
          { value: '1_month', label: '1 month' },
          { value: 'notice', label: 'Notice' },
          { value: 'passive', label: 'Passive' }
        ]"
      />
      <AppSelect
        v-model="minScore"
        label="Match floor"
        :options="[
          { value: '0', label: 'Show all scores' },
          { value: '60', label: '60+ worth a look' },
          { value: '80', label: '80+ send-ready' }
        ]"
      />
    </div>

    <p v-if="selectedJob" class="mb-3 text-xs text-ink-faint">
      Ranking against {{ selectedJob.title }} must-haves:
      {{ selectedJob.mustHave.join(', ') }}. Score is a recommendation, not a hire.
    </p>

    <AppSkeleton v-if="!ready" :rows="8" />
    <AppCard v-else flush>
      <div class="overflow-x-auto">
        <table class="min-w-[980px] w-full text-left text-sm">
          <thead class="border-b border-slate-200 bg-slate-50 text-xs uppercase text-ink-faint">
            <tr>
              <th class="px-4 py-2 font-medium">Talent</th>
              <th class="px-4 py-2 font-medium">Skills</th>
              <th class="px-4 py-2 font-medium">Years</th>
              <th class="px-4 py-2 font-medium">Expect.</th>
              <th class="px-4 py-2 font-medium">Avail.</th>
              <th class="px-4 py-2 font-medium">Match</th>
              <th class="px-4 py-2 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in table.rows" :key="row.candidate.id" class="border-b border-slate-100 hover:bg-primary-50/60">
              <td class="px-4 py-2.5">
                <NuxtLink :to="`/candidates/${row.candidate.id}`" class="font-medium text-primary hover:underline">
                  {{ row.candidate.firstName }} {{ row.candidate.lastName }}
                </NuxtLink>
                <p class="text-xs text-ink-faint">{{ row.candidate.currentTitle }} · {{ row.candidate.location }}</p>
              </td>
              <td class="px-4 py-2.5">
                <div class="flex flex-wrap gap-1">
                  <AppBadge v-for="skill in row.match.matchedSkills.slice(0, 3)" :key="skill" :label="skill" tone="green" />
                  <AppBadge v-for="skill in row.match.missingSkills.slice(0, 2)" :key="skill" :label="skill" tone="amber" />
                </div>
              </td>
              <td class="px-4 py-2.5 font-mono tabular">{{ row.candidate.yearsExperience }}</td>
              <td class="px-4 py-2.5 font-mono text-xs tabular">{{ fmt.compactMoney(row.candidate.salaryExpectation) }}</td>
              <td class="px-4 py-2.5"><StatusBadge :value="row.candidate.availability" /></td>
              <td class="px-4 py-2.5">
                <p class="font-mono text-sm font-semibold tabular">{{ row.match.score }}</p>
                <p class="text-[11px] text-ink-faint">{{ row.onJob ? 'On pipeline' : row.lastSent ? `Sent ${row.lastSent.status}` : 'Not on job' }}</p>
              </td>
              <td class="px-4 py-2.5">
                <div class="flex flex-wrap gap-1">
                  <AppButton
                    v-if="can('pipeline', 'create') && !row.onJob"
                    size="sm"
                    @click="addToJob(row.candidate.id)"
                  >
                    Add to job
                  </AppButton>
                  <AppButton
                    v-if="can('opportunities', 'create') || can('opportunities', 'edit')"
                    size="sm"
                    variant="primary"
                    @click="openSend(row.candidate.id)"
                  >
                    Send job
                  </AppButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <AppEmpty v-if="!rows.length" title="No talent matches these filters" body="Widen the score floor or clear city and salary. The mock pool is the desk database — not a live LinkedIn search." />
      <AppPagination :page="table.page" :page-count="table.pageCount" :total="rows.length" @update:page="table.page = $event" />
    </AppCard>

    <SendOpportunityDrawer
      :open="sendOpen"
      :candidate-id="sendCandidateId"
      :job-id="jobId"
      @close="sendOpen = false"
    />
  </div>
</template>
