<script setup lang="ts">
import type { Availability } from '~/types'

definePageMeta({ title: 'Candidates', resource: 'candidates', action: 'view' })

const agency = useAgencyStore()
const ui = useUiStore()
const auth = useAuthStore()
const { can } = usePermissions()
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

const createOpen = ref(false)
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const phone = ref('')
const location = ref('')
const currentTitle = ref('')
const linkedinUrl = ref('')
const skills = ref('')
const yearsExperience = ref('5')
const salaryExpectation = ref('90000')
const availability = ref<Availability>('2_weeks')
const sourceValue = ref('Inbound')
const notes = ref('')
const firstNameError = ref('')
const lastNameError = ref('')
const submitting = ref(false)

const availabilityOptions = [
  { value: 'immediate', label: 'Immediate' },
  { value: '2_weeks', label: '2 weeks' },
  { value: '1_month', label: '1 month' },
  { value: 'notice', label: 'Notice' },
  { value: 'passive', label: 'Passive' }
]

function actorId() {
  return auth.currentUser?.id ?? ''
}

function splitList(value: string) {
  return value.split(',').map(item => item.trim()).filter(Boolean)
}

function resetForm() {
  firstName.value = ''
  lastName.value = ''
  email.value = ''
  phone.value = ''
  location.value = ''
  currentTitle.value = ''
  linkedinUrl.value = ''
  skills.value = ''
  yearsExperience.value = '5'
  salaryExpectation.value = '90000'
  availability.value = '2_weeks'
  sourceValue.value = 'Inbound'
  notes.value = ''
  firstNameError.value = ''
  lastNameError.value = ''
}

function openCreate() {
  resetForm()
  createOpen.value = true
}

function createCandidate() {
  firstNameError.value = firstName.value.trim() ? '' : 'Enter a first name.'
  lastNameError.value = lastName.value.trim() ? '' : 'Enter a last name.'
  if (firstNameError.value || lastNameError.value || submitting.value || !actorId()) return

  const years = Number(yearsExperience.value)
  const salary = Number(salaryExpectation.value)
  if (!Number.isFinite(years) || years < 0 || !Number.isFinite(salary) || salary < 0) {
    ui.toast('Enter a valid experience and salary', 'error')
    return
  }

  submitting.value = true
  const candidate = agency.createCandidate({
    firstName: firstName.value.trim(),
    lastName: lastName.value.trim(),
    email: email.value.trim(),
    phone: phone.value.trim(),
    location: location.value.trim() || 'Remote UK',
    linkedinUrl: linkedinUrl.value.trim(),
    cvSummary: notes.value.trim() || 'Intake created from the desk. Add the full CV summary on the candidate page.',
    skills: splitList(skills.value),
    yearsExperience: years,
    currentTitle: currentTitle.value.trim() || 'Candidate',
    salaryExpectation: salary,
    availability: availability.value,
    source: sourceValue.value.trim() || 'Inbound',
    tags: [],
    ownerId: actorId(),
    notes: notes.value.trim()
  }, actorId())
  submitting.value = false
  createOpen.value = false
  ui.toast('Candidate created')
  navigateTo(`/candidates/${candidate.id}`)
}
</script>

<template>
  <div>
    <PageHeader eyebrow="Desk" title="Candidates" description="People we can actually represent — source, skills, and where they sit in a brief.">
      <template #actions>
        <AppButton v-if="can('candidates', 'create')" variant="primary" @click="openCreate">New candidate</AppButton>
      </template>
    </PageHeader>
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

    <AppDrawer :open="createOpen" title="New candidate" @close="createOpen = false">
      <form class="space-y-4" @submit.prevent="createCandidate">
        <div class="grid gap-3 sm:grid-cols-2">
          <AppInput v-model="firstName" label="First name" :error="firstNameError" />
          <AppInput v-model="lastName" label="Last name" :error="lastNameError" />
        </div>
        <div class="grid gap-3 sm:grid-cols-2">
          <AppInput v-model="email" label="Email" type="email" />
          <AppInput v-model="phone" label="Phone" />
        </div>
        <div class="grid gap-3 sm:grid-cols-2">
          <AppInput v-model="currentTitle" label="Current title" hint="e.g. Senior Backend Engineer" />
          <AppInput v-model="location" label="Location" hint="City or Remote UK" />
        </div>
        <AppInput v-model="linkedinUrl" label="LinkedIn URL" hint="Paste a profile URL — stored as text only" />
        <AppInput v-model="skills" label="Skills" hint="Comma-separated, e.g. TypeScript, Node.js" />
        <div class="grid gap-3 sm:grid-cols-2">
          <AppInput v-model="yearsExperience" label="Years experience" type="number" />
          <AppInput v-model="salaryExpectation" label="Salary expectation (GBP)" type="number" />
        </div>
        <div class="grid gap-3 sm:grid-cols-2">
          <AppSelect v-model="availability" label="Availability" :options="availabilityOptions" />
          <AppInput v-model="sourceValue" label="Source" hint="e.g. Inbound, Referral" />
        </div>
        <label class="block">
          <span class="mb-1 block text-sm font-medium text-ink">Notes</span>
          <textarea
            v-model="notes"
            rows="4"
            class="min-h-[96px] w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </label>
      </form>
      <template #footer>
        <div class="flex justify-end gap-2">
          <AppButton variant="ghost" @click="createOpen = false">Cancel</AppButton>
          <AppButton variant="primary" :disabled="submitting" @click="createCandidate">
            {{ submitting ? 'Creating…' : 'Create candidate' }}
          </AppButton>
        </div>
      </template>
    </AppDrawer>
  </div>
</template>
