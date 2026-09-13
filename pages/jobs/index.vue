<script setup lang="ts">
import type { Job, JobPriority, WorkMode } from '~/types'

definePageMeta({ title: 'Jobs', resource: 'jobs', action: 'view' })

const agency = useAgencyStore()
const ui = useUiStore()
const auth = useAuthStore()
const { can } = usePermissions()
const fmt = useFormat()
const ready = usePageReady()
const query = ref('')
const status = ref('all')
const priority = ref('all')
const owner = ref('all')
const selected = ref<string[]>([])

const filtered = computed(() =>
  agency.jobs.filter((job) => {
    if (status.value !== 'all' && job.status !== status.value) return false
    if (priority.value !== 'all' && job.priority !== priority.value) return false
    if (owner.value !== 'all' && job.ownerId !== owner.value) return false
    const hay = `${job.title} ${agency.clientById[job.clientId]?.name ?? ''} ${job.location}`.toLowerCase()
    return hay.includes(query.value.trim().toLowerCase())
  })
)

const table = useTable(filtered, { pageSize: 8 })

const statusOptions = [
  { value: 'all', label: 'All statuses' },
  { value: 'open', label: 'Open' },
  { value: 'paused', label: 'Paused' },
  { value: 'filled', label: 'Filled' },
  { value: 'closed', label: 'Closed' },
  { value: 'draft', label: 'Draft' }
]
const priorityOptions = [
  { value: 'all', label: 'All priorities' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' }
]
const ownerOptions = computed(() => [
  { value: 'all', label: 'All owners' },
  ...agency.users.filter(user => user.role !== 'viewer').map(user => ({ value: user.id, label: user.name }))
])

function toggle(id: string) {
  selected.value = selected.value.includes(id) ? selected.value.filter(item => item !== id) : [...selected.value, id]
}

async function pause(job: Job) {
  if (!can('jobs', 'edit')) return
  const ok = await ui.ask({ title: 'Pause this job?', body: `${job.title} will stop appearing as an open mandate.`, confirmLabel: 'Pause', tone: 'danger' })
  if (ok) {
    agency.setJobStatus(job.id, 'paused', actorId())
    ui.toast('Job paused')
  }
}

async function closeJob(job: Job) {
  if (!can('jobs', 'edit')) return
  const ok = await ui.ask({ title: 'Close this job?', body: 'Use this when the brief is cancelled, not filled.', confirmLabel: 'Close job', tone: 'danger' })
  if (ok) {
    agency.setJobStatus(job.id, 'closed', actorId())
    ui.toast('Job closed')
  }
}

function duplicate(job: Job) {
  const copy = agency.duplicateJob(job.id, actorId())
  ui.toast('Draft copy created')
  if (copy) navigateTo(`/jobs/${copy.id}`)
}

const createOpen = ref(false)
const title = ref('')
const clientId = ref('')
const priorityValue = ref<JobPriority>('medium')
const seniority = ref('Senior')
const location = ref('')
const workMode = ref<WorkMode>('hybrid')
const salaryMin = ref('80000')
const salaryMax = ref('110000')
const targetHireDate = ref('2026-10-31')
const mustHave = ref('')
const description = ref('')
const titleError = ref('')
const clientError = ref('')
const submitting = ref(false)

const clientOptions = computed(() =>
  agency.clients.map(client => ({ value: client.id, label: client.name }))
)

function actorId() {
  return auth.currentUser?.id ?? ''
}

function resetForm() {
  title.value = ''
  clientId.value = agency.clients[0]?.id ?? ''
  priorityValue.value = 'medium'
  seniority.value = 'Senior'
  location.value = ''
  workMode.value = 'hybrid'
  salaryMin.value = '80000'
  salaryMax.value = '110000'
  targetHireDate.value = '2026-10-31'
  mustHave.value = ''
  description.value = ''
  titleError.value = ''
  clientError.value = ''
}

function openCreate() {
  resetForm()
  createOpen.value = true
}

function splitSkills(value: string) {
  return value.split(',').map(item => item.trim()).filter(Boolean)
}

function createJob() {
  titleError.value = title.value.trim() ? '' : 'Enter a job title.'
  clientError.value = clientId.value ? '' : 'Choose a client.'
  if (titleError.value || clientError.value || submitting.value || !actorId()) return

  const min = Number(salaryMin.value)
  const max = Number(salaryMax.value)
  if (!Number.isFinite(min) || !Number.isFinite(max) || min <= 0 || max < min) {
    ui.toast('Enter a valid salary range', 'error')
    return
  }

  submitting.value = true
  const job = agency.createJob({
    title: title.value.trim(),
    clientId: clientId.value,
    status: 'open',
    priority: priorityValue.value,
    seniority: seniority.value.trim() || 'Senior',
    location: location.value.trim() || 'Remote UK',
    workMode: workMode.value,
    salaryMin: min,
    salaryMax: max,
    ownerId: actorId(),
    targetHireDate: targetHireDate.value,
    mustHave: splitSkills(mustHave.value),
    niceToHave: [],
    description: description.value.trim() || 'Intake created from the desk. Add the full brief on the job page.',
    headcount: 1
  }, actorId())
  submitting.value = false
  createOpen.value = false
  ui.toast('Job created')
  navigateTo(`/jobs/${job.id}`)
}
</script>

<template>
  <div>
    <PageHeader eyebrow="Desk" title="Jobs" description="Mandates, owners, and whether the brief is actually moving.">
      <template #actions>
        <AppButton v-if="can('jobs', 'create')" variant="primary" @click="openCreate">New job</AppButton>
      </template>
    </PageHeader>

    <div class="mb-4 grid gap-3 md:grid-cols-4">
      <AppInput v-model="query" label="Search" hint="Title, client, or location" />
      <AppSelect v-model="status" label="Status" :options="statusOptions" />
      <AppSelect v-model="priority" label="Priority" :options="priorityOptions" />
      <AppSelect v-model="owner" label="Owner" :options="ownerOptions" />
    </div>
    <p class="mb-3 text-xs text-ink-faint">Saved view: Open + my desk — static filter chrome, same as production later.</p>

    <AppSkeleton v-if="!ready" :rows="8" />
    <AppCard v-else flush>
      <div class="overflow-x-auto">
        <table class="min-w-[860px] w-full text-left text-sm">
          <thead class="border-b border-slate-200 bg-slate-50 text-xs uppercase text-ink-faint">
            <tr>
              <th class="px-3 py-2"><span class="sr-only">Select</span></th>
              <th class="px-3 py-2 font-medium">Job</th>
              <th class="px-3 py-2 font-medium">Client</th>
              <th class="px-3 py-2 font-medium">Status</th>
              <th class="px-3 py-2 font-medium">Priority</th>
              <th class="px-3 py-2 font-medium">Owner</th>
              <th class="px-3 py-2 font-medium">Candidates</th>
              <th class="px-3 py-2 font-medium">Salary</th>
              <th class="px-3 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="job in table.rows" :key="job.id" class="border-b border-slate-100 hover:bg-primary-50/60">
              <td class="px-3 py-2">
                <input type="checkbox" class="cursor-pointer" :checked="selected.includes(job.id)" :aria-label="`Select ${job.title}`" @change="toggle(job.id)">
              </td>
              <td class="px-3 py-2">
                <NuxtLink :to="`/jobs/${job.id}`" class="font-medium text-primary hover:underline">{{ job.title }}</NuxtLink>
                <p class="text-xs text-ink-faint">{{ job.location }} · {{ job.workMode }}</p>
              </td>
              <td class="px-3 py-2">
                <NuxtLink :to="`/clients/${job.clientId}`" class="hover:underline">{{ agency.clientById[job.clientId]?.name }}</NuxtLink>
              </td>
              <td class="px-3 py-2"><StatusBadge :value="job.status" /></td>
              <td class="px-3 py-2"><PriorityBadge :value="job.priority" /></td>
              <td class="px-3 py-2 text-ink-muted">{{ agency.userName(job.ownerId) }}</td>
              <td class="px-3 py-2 font-mono tabular">{{ agency.entriesForJob(job.id).length }}</td>
              <td class="px-3 py-2 font-mono text-xs tabular">{{ fmt.compactMoney(job.salaryMin) }}–{{ fmt.compactMoney(job.salaryMax) }}</td>
              <td class="px-3 py-2">
                <div class="flex flex-wrap gap-1">
                  <NuxtLink :to="`/jobs/${job.id}`" class="text-xs text-primary hover:underline">Open</NuxtLink>
                  <NuxtLink v-if="can('sourcing', 'view') && (job.status === 'open' || job.status === 'paused')" :to="`/sourcing?job=${job.id}`" class="text-xs text-primary hover:underline">Source</NuxtLink>
                  <button v-if="can('jobs', 'create')" class="cursor-pointer text-xs text-ink-muted hover:underline" @click="duplicate(job)">Duplicate</button>
                  <button v-if="can('jobs', 'edit') && job.status === 'open'" class="cursor-pointer text-xs text-ink-muted hover:underline" @click="pause(job)">Pause</button>
                  <button v-if="can('jobs', 'edit') && job.status !== 'closed'" class="cursor-pointer text-xs text-red-700 hover:underline" @click="closeJob(job)">Close</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <AppEmpty v-if="!filtered.length" title="No jobs match" body="Clear a filter or try a client name. Open mandates still live under Status = Open." />
      <AppPagination :page="table.page" :page-count="table.pageCount" :total="filtered.length" @update:page="table.page = $event" />
    </AppCard>

    <AppDrawer :open="createOpen" title="New job" @close="createOpen = false">
      <form class="space-y-4" @submit.prevent="createJob">
        <AppInput v-model="title" label="Title" hint="e.g. Senior Backend Engineer" :error="titleError" />
        <AppSelect v-model="clientId" label="Client" :options="clientOptions" />
        <p v-if="clientError" class="text-xs text-red-700" role="alert">{{ clientError }}</p>
        <div class="grid gap-3 sm:grid-cols-2">
          <AppSelect
            v-model="priorityValue"
            label="Priority"
            :options="[
              { value: 'urgent', label: 'Urgent' },
              { value: 'high', label: 'High' },
              { value: 'medium', label: 'Medium' },
              { value: 'low', label: 'Low' }
            ]"
          />
          <AppInput v-model="seniority" label="Seniority" />
        </div>
        <div class="grid gap-3 sm:grid-cols-2">
          <AppInput v-model="location" label="Location" hint="City or Remote UK" />
          <AppSelect
            v-model="workMode"
            label="Work mode"
            :options="[
              { value: 'remote', label: 'Remote' },
              { value: 'hybrid', label: 'Hybrid' },
              { value: 'onsite', label: 'On-site' }
            ]"
          />
        </div>
        <div class="grid gap-3 sm:grid-cols-2">
          <AppInput v-model="salaryMin" label="Salary min (GBP)" type="number" />
          <AppInput v-model="salaryMax" label="Salary max (GBP)" type="number" />
        </div>
        <AppInput v-model="targetHireDate" label="Target hire date" type="date" />
        <AppInput v-model="mustHave" label="Must-have skills" hint="Comma-separated, e.g. TypeScript, Node.js" />
        <label class="block">
          <span class="mb-1 block text-sm font-medium text-ink">Description</span>
          <textarea
            v-model="description"
            rows="4"
            class="min-h-[96px] w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </label>
      </form>
      <template #footer>
        <div class="flex justify-end gap-2">
          <AppButton variant="ghost" @click="createOpen = false">Cancel</AppButton>
          <AppButton variant="primary" :disabled="submitting" @click="createJob">
            {{ submitting ? 'Creating…' : 'Create job' }}
          </AppButton>
        </div>
      </template>
    </AppDrawer>
  </div>
</template>
