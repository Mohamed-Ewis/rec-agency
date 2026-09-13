<script setup lang="ts">
definePageMeta({ title: 'Job', resource: 'jobs', action: 'view' })

const route = useRoute()
const agency = useAgencyStore()
const ui = useUiStore()
const auth = useAuthStore()
const { can } = usePermissions()
const fmt = useFormat()

const job = computed(() => agency.jobs.find(item => item.id === route.params.id as string))
if (!job.value) {
  throw createError({ statusCode: 404, statusMessage: 'Job not found' })
}

const entries = computed(() => agency.entriesForJob(job.value!.id))
const timeline = computed(() => agency.activities.filter(item => item.jobId === job.value!.id).sort((a, b) => b.at.localeCompare(a.at)))
const addOpen = ref(false)
const editOpen = ref(false)
const sendOpen = ref(false)
const sendCandidateId = ref('')
const candidateId = ref(agency.candidates[0]?.id ?? '')
const draftTitle = ref('')
const suggested = computed(() =>
  agency.talentForJob(job.value!.id).filter(row => !row.onJob).slice(0, 5)
)

watch(job, (value) => {
  if (value) draftTitle.value = value.title
}, { immediate: true })

const candidateOptions = computed(() =>
  agency.candidates
    .filter(candidate => !entries.value.some(entry => entry.candidateId === candidate.id))
    .map(candidate => ({ value: candidate.id, label: `${candidate.firstName} ${candidate.lastName}` }))
)

function addCandidate() {
  if (!job.value || !candidateId.value) return
  agency.addCandidateToJob(job.value.id, candidateId.value, auth.currentUser?.id ?? '')
  ui.toast('Candidate added to job')
  addOpen.value = false
}

function saveEdit() {
  if (!job.value) return
  agency.updateJob(job.value.id, { title: draftTitle.value })
  ui.toast('Job updated')
  editOpen.value = false
}

async function pause() {
  if (!job.value) return
  const ok = await ui.ask({ title: 'Pause job?', body: 'Open candidates stay, but the mandate leaves the live board.', confirmLabel: 'Pause', tone: 'danger' })
  if (ok) agency.setJobStatus(job.value.id, 'paused', auth.currentUser.id)
}

async function closeJob() {
  if (!job.value) return
  const ok = await ui.ask({ title: 'Close job?', body: 'This is for cancelled briefs, not successful hires.', confirmLabel: 'Close', tone: 'danger' })
  if (ok) agency.setJobStatus(job.value.id, 'closed', auth.currentUser.id)
}

function duplicate() {
  if (!job.value) return
  const copy = agency.duplicateJob(job.value.id, auth.currentUser.id)
  if (copy) navigateTo(`/jobs/${copy.id}`)
}
</script>

<template>
  <div v-if="job">
    <PageHeader :title="job.title" :description="agency.clientById[job.clientId]?.name">
      <template #crumbs>
        <NuxtLink to="/jobs" class="hover:underline">Jobs</NuxtLink> / {{ job.title }}
      </template>
      <template #actions>
        <AppButton v-if="can('jobs', 'edit')" size="sm" @click="editOpen = true">Edit</AppButton>
        <AppButton v-if="can('jobs', 'create')" size="sm" @click="duplicate">Duplicate</AppButton>
        <AppButton v-if="can('jobs', 'edit') && job.status === 'open'" size="sm" @click="pause">Pause</AppButton>
        <AppButton v-if="can('jobs', 'edit')" size="sm" variant="danger" @click="closeJob">Close</AppButton>
        <AppButton v-if="can('sourcing', 'view')" size="sm" @click="navigateTo(`/sourcing?job=${job.id}`)">Find talent</AppButton>
        <AppButton v-if="can('pipeline', 'create')" size="sm" variant="primary" @click="addOpen = true">Add candidate</AppButton>
      </template>
    </PageHeader>

    <div class="mb-4 flex flex-wrap gap-2">
      <StatusBadge :value="job.status" />
      <PriorityBadge :value="job.priority" />
      <AppBadge :label="job.workMode" />
      <AppBadge tone="blue" :label="agency.userName(job.ownerId)" />
    </div>

    <div class="grid gap-4 xl:grid-cols-12">
      <div class="space-y-4 xl:col-span-8">
        <AppCard>
          <template #header><h2 class="text-sm font-semibold text-ink">Brief</h2></template>
          <dl class="grid gap-3 text-sm sm:grid-cols-2">
            <div><dt class="text-xs text-ink-faint">Client</dt><dd><NuxtLink :to="`/clients/${job.clientId}`" class="text-primary hover:underline">{{ agency.clientById[job.clientId]?.name }}</NuxtLink></dd></div>
            <div><dt class="text-xs text-ink-faint">Location</dt><dd>{{ job.location }}</dd></div>
            <div><dt class="text-xs text-ink-faint">Salary</dt><dd class="font-mono tabular">{{ fmt.money(job.salaryMin) }} – {{ fmt.money(job.salaryMax) }}</dd></div>
            <div><dt class="text-xs text-ink-faint">Target hire</dt><dd>{{ fmt.date(job.targetHireDate) }}</dd></div>
            <div class="sm:col-span-2"><dt class="text-xs text-ink-faint">Description</dt><dd class="text-ink-muted">{{ job.description }}</dd></div>
            <div><dt class="text-xs text-ink-faint">Must-have</dt><dd class="mt-1 flex flex-wrap gap-1"><AppBadge v-for="skill in job.mustHave" :key="skill" :label="skill" tone="blue" /></dd></div>
            <div><dt class="text-xs text-ink-faint">Nice-to-have</dt><dd class="mt-1 flex flex-wrap gap-1"><AppBadge v-for="skill in job.niceToHave" :key="skill" :label="skill" /></dd></div>
          </dl>
        </AppCard>

        <AppCard flush>
          <template #header><h2 class="text-sm font-semibold text-ink">Pipeline on this job</h2></template>
          <div class="overflow-x-auto">
            <table class="min-w-[640px] w-full text-left text-sm">
              <thead class="bg-slate-50 text-xs uppercase text-ink-faint">
                <tr>
                  <th class="px-4 py-2 font-medium">Candidate</th>
                  <th class="px-4 py-2 font-medium">Stage</th>
                  <th class="px-4 py-2 font-medium">Match</th>
                  <th class="px-4 py-2 font-medium">Updated</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="entry in entries" :key="entry.id" class="border-t border-slate-100">
                  <td class="px-4 py-2.5">
                    <NuxtLink :to="`/candidates/${entry.candidateId}`" class="text-primary hover:underline">{{ agency.candidateName(entry.candidateId) }}</NuxtLink>
                  </td>
                  <td class="px-4 py-2.5"><StatusBadge :value="entry.sideStage ?? entry.stage" /></td>
                  <td class="px-4 py-2.5 font-mono tabular">{{ entry.aiMatch.score }}</td>
                  <td class="px-4 py-2.5 text-xs text-ink-faint">{{ fmt.relative(entry.updatedAt) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <AppEmpty v-if="!entries.length" title="No candidates yet" body="Add someone from the desk or source list." />
        </AppCard>

        <AppCard flush>
          <template #header>
            <div>
              <h2 class="text-sm font-semibold text-ink">Suggested talent</h2>
              <p class="text-xs text-ink-faint">Ranked from the desk pool against this brief.</p>
            </div>
            <NuxtLink :to="`/sourcing?job=${job.id}`" class="text-xs font-medium text-primary hover:underline">All matches</NuxtLink>
          </template>
          <ul>
            <li v-for="row in suggested" :key="row.candidate.id" class="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-2.5 last:border-0">
              <div>
                <NuxtLink :to="`/candidates/${row.candidate.id}`" class="text-sm font-medium text-primary hover:underline">
                  {{ row.candidate.firstName }} {{ row.candidate.lastName }}
                </NuxtLink>
                <p class="text-xs text-ink-faint">{{ row.candidate.currentTitle }} · match {{ row.match.score }}</p>
              </div>
              <div class="flex gap-1">
                <AppButton v-if="can('pipeline', 'create')" size="sm" @click="agency.addCandidateToJob(job.id, row.candidate.id, auth.currentUser?.id ?? ''); ui.toast('Added to pipeline')">Add</AppButton>
                <AppButton
                  v-if="can('opportunities', 'create') || can('opportunities', 'edit')"
                  size="sm"
                  variant="primary"
                  @click="sendCandidateId = row.candidate.id; sendOpen = true"
                >
                  Send
                </AppButton>
              </div>
            </li>
          </ul>
          <AppEmpty v-if="!suggested.length" title="Everyone matching is already on the job" body="Open Sourcing to widen the filters." />
        </AppCard>
      </div>

      <AppCard class="xl:col-span-4" flush>
        <template #header><h2 class="text-sm font-semibold text-ink">Activity</h2></template>
        <ol class="divide-y divide-slate-100">
          <li v-for="item in timeline" :key="item.id" class="px-4 py-3">
            <p class="text-sm font-medium text-ink">{{ item.title }}</p>
            <p class="text-xs text-ink-muted">{{ item.body }}</p>
            <p class="mt-1 text-[11px] text-ink-faint">{{ fmt.dateTime(item.at) }} · {{ agency.userName(item.actorId) }}</p>
          </li>
        </ol>
        <AppEmpty v-if="!timeline.length" title="No activity" body="Notes, submissions, and status changes will land here." />
      </AppCard>
    </div>

    <AppDrawer :open="addOpen" title="Add candidate" @close="addOpen = false">
      <AppSelect v-model="candidateId" label="Candidate" :options="candidateOptions.length ? candidateOptions : [{ value: '', label: 'Everyone is already on this job' }]" />
      <template #footer>
        <div class="flex justify-end gap-2">
          <AppButton variant="ghost" @click="addOpen = false">Cancel</AppButton>
          <AppButton variant="primary" :disabled="!candidateOptions.length" @click="addCandidate">Add</AppButton>
        </div>
      </template>
    </AppDrawer>

    <SendOpportunityDrawer
      :open="sendOpen"
      :candidate-id="sendCandidateId"
      :job-id="job.id"
      @close="sendOpen = false"
    />

    <AppDrawer :open="editOpen" title="Edit job" @close="editOpen = false">
      <AppInput v-model="draftTitle" label="Title" />
      <template #footer>
        <div class="flex justify-end gap-2">
          <AppButton variant="ghost" @click="editOpen = false">Cancel</AppButton>
          <AppButton variant="primary" @click="saveEdit">Save</AppButton>
        </div>
      </template>
    </AppDrawer>
  </div>
</template>
