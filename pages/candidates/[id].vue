<script setup lang="ts">
import type { Availability } from '~/types'

definePageMeta({ title: 'Candidate', resource: 'candidates', action: 'view' })

const route = useRoute()
const agency = useAgencyStore()
const auth = useAuthStore()
const ui = useUiStore()
const { can } = usePermissions()
const fmt = useFormat()
const note = ref('')
const sendOpen = ref(false)
const sendJobId = ref('')
const editOpen = ref(false)
const draftFirstName = ref('')
const draftLastName = ref('')
const draftEmail = ref('')
const draftPhone = ref('')
const draftLocation = ref('')
const draftTitle = ref('')
const draftLinkedinUrl = ref('')
const draftSkills = ref('')
const draftYears = ref('')
const draftSalary = ref('')
const draftAvailability = ref<Availability>('2_weeks')
const draftSource = ref('')
const draftNotes = ref('')
const draftCvSummary = ref('')

const availabilityOptions = [
  { value: 'immediate', label: 'Immediate' },
  { value: '2_weeks', label: '2 weeks' },
  { value: '1_month', label: '1 month' },
  { value: 'notice', label: 'Notice' },
  { value: 'passive', label: 'Passive' }
]

const candidate = computed(() => agency.candidates.find(item => item.id === route.params.id as string))
if (!candidate.value) throw createError({ statusCode: 404, statusMessage: 'Candidate not found' })

const entries = computed(() => agency.entriesForCandidate(candidate.value!.id))
const primaryMatch = computed(() => entries.value.find(entry => !entry.sideStage) ?? entries.value[0])
const timeline = computed(() => agency.activities.filter(item => item.candidateId === candidate.value!.id).sort((a, b) => b.at.localeCompare(a.at)))
const suggestedJobs = computed(() => agency.jobsForCandidate(candidate.value!.id).slice(0, 5))

function saveNote() {
  if (!note.value.trim() || !candidate.value) return
  agency.addNote(note.value.trim(), auth.currentUser?.id ?? '', { candidateId: candidate.value.id })
  note.value = ''
  ui.toast('Note added')
}

function openEdit() {
  if (!candidate.value) return
  draftFirstName.value = candidate.value.firstName
  draftLastName.value = candidate.value.lastName
  draftEmail.value = candidate.value.email
  draftPhone.value = candidate.value.phone
  draftLocation.value = candidate.value.location
  draftTitle.value = candidate.value.currentTitle
  draftLinkedinUrl.value = candidate.value.linkedinUrl
  draftSkills.value = candidate.value.skills.join(', ')
  draftYears.value = String(candidate.value.yearsExperience)
  draftSalary.value = String(candidate.value.salaryExpectation)
  draftAvailability.value = candidate.value.availability
  draftSource.value = candidate.value.source
  draftNotes.value = candidate.value.notes
  draftCvSummary.value = candidate.value.cvSummary
  editOpen.value = true
}

function saveEdit() {
  if (!candidate.value) return
  const first = draftFirstName.value.trim()
  const last = draftLastName.value.trim()
  if (!first || !last) {
    ui.toast('Enter a first and last name', 'error')
    return
  }
  const years = Number(draftYears.value)
  const salary = Number(draftSalary.value)
  if (!Number.isFinite(years) || years < 0 || !Number.isFinite(salary) || salary < 0) {
    ui.toast('Enter a valid experience and salary', 'error')
    return
  }
  agency.updateCandidate(candidate.value.id, {
    firstName: first,
    lastName: last,
    email: draftEmail.value.trim(),
    phone: draftPhone.value.trim(),
    location: draftLocation.value.trim(),
    currentTitle: draftTitle.value.trim(),
    linkedinUrl: draftLinkedinUrl.value.trim(),
    skills: draftSkills.value.split(',').map(item => item.trim()).filter(Boolean),
    yearsExperience: years,
    salaryExpectation: salary,
    availability: draftAvailability.value,
    source: draftSource.value.trim(),
    notes: draftNotes.value.trim(),
    cvSummary: draftCvSummary.value.trim()
  })
  ui.toast('Candidate updated')
  editOpen.value = false
}
</script>

<template>
  <div v-if="candidate">
    <PageHeader :title="`${candidate.firstName} ${candidate.lastName}`" :description="candidate.currentTitle">
      <template #crumbs>
        <NuxtLink to="/candidates" class="hover:underline">Candidates</NuxtLink> / {{ candidate.firstName }} {{ candidate.lastName }}
      </template>
      <template #actions>
        <AppButton v-if="can('candidates', 'edit')" size="sm" @click="openEdit">Edit</AppButton>
        <AppButton v-if="can('opportunities', 'view')" size="sm" @click="navigateTo(`/opportunities?candidate=${candidate.id}`)">Find jobs</AppButton>
        <AppButton
          v-if="suggestedJobs[0] && (can('opportunities', 'create') || can('opportunities', 'edit'))"
          size="sm"
          variant="primary"
          @click="sendJobId = suggestedJobs[0].job.id; sendOpen = true"
        >
          Send best job
        </AppButton>
      </template>
    </PageHeader>

    <div class="grid gap-4 xl:grid-cols-12">
      <div class="space-y-4 xl:col-span-8">
        <AppCard>
          <template #header><h2 class="text-sm font-semibold text-ink">Profile</h2></template>
          <dl class="grid gap-3 text-sm sm:grid-cols-2">
            <div><dt class="text-xs text-ink-faint">Email</dt><dd><a :href="`mailto:${candidate.email}`" class="text-primary hover:underline">{{ candidate.email }}</a></dd></div>
            <div><dt class="text-xs text-ink-faint">Phone</dt><dd>{{ candidate.phone }}</dd></div>
            <div><dt class="text-xs text-ink-faint">Location</dt><dd>{{ candidate.location }}</dd></div>
            <div><dt class="text-xs text-ink-faint">LinkedIn</dt><dd><a v-if="candidate.linkedinUrl" :href="candidate.linkedinUrl" class="text-primary hover:underline" target="_blank" rel="noreferrer">{{ candidate.linkedinUrl }}</a><span v-else class="text-ink-faint">—</span></dd></div>
            <div><dt class="text-xs text-ink-faint">Experience</dt><dd>{{ candidate.yearsExperience }} years</dd></div>
            <div><dt class="text-xs text-ink-faint">Salary expectation</dt><dd class="font-mono tabular">{{ fmt.money(candidate.salaryExpectation) }}</dd></div>
            <div><dt class="text-xs text-ink-faint">Availability</dt><dd><StatusBadge :value="candidate.availability" /></dd></div>
            <div><dt class="text-xs text-ink-faint">Source</dt><dd>{{ candidate.source }}</dd></div>
            <div class="sm:col-span-2"><dt class="text-xs text-ink-faint">CV summary</dt><dd class="text-ink-muted">{{ candidate.cvSummary }}</dd></div>
            <div class="sm:col-span-2"><dt class="text-xs text-ink-faint">Skills</dt><dd class="mt-1 flex flex-wrap gap-1"><AppBadge v-for="skill in candidate.skills" :key="skill" :label="skill" tone="blue" /></dd></div>
            <div class="sm:col-span-2"><dt class="text-xs text-ink-faint">Tags</dt><dd class="mt-1 flex flex-wrap gap-1"><AppBadge v-for="tag in candidate.tags" :key="tag" :label="tag" /></dd></div>
            <div class="sm:col-span-2"><dt class="text-xs text-ink-faint">Notes</dt><dd class="text-ink-muted">{{ candidate.notes }}</dd></div>
          </dl>
        </AppCard>

        <AppCard v-if="primaryMatch">
          <template #header>
            <div>
              <h2 class="text-sm font-semibold text-ink">AI match</h2>
              <p class="text-xs text-ink-faint">Mock recommendation — not a hiring decision.</p>
            </div>
            <p class="font-mono text-2xl font-semibold text-ink">{{ primaryMatch.aiMatch.score }}</p>
          </template>
          <p class="text-sm text-ink-muted">
            Against
            <NuxtLink :to="`/jobs/${primaryMatch.jobId}`" class="text-primary hover:underline">{{ agency.jobById[primaryMatch.jobId]?.title }}</NuxtLink>
          </p>
          <div class="mt-3 grid gap-3 md:grid-cols-2">
            <div>
              <p class="mb-1 text-xs font-medium uppercase text-ink-faint">Matched</p>
              <div class="flex flex-wrap gap-1"><AppBadge v-for="skill in primaryMatch.aiMatch.matchedSkills" :key="skill" :label="skill" tone="green" /></div>
            </div>
            <div>
              <p class="mb-1 text-xs font-medium uppercase text-ink-faint">Missing</p>
              <div class="flex flex-wrap gap-1">
                <AppBadge v-for="skill in primaryMatch.aiMatch.missingSkills" :key="skill" :label="skill" tone="amber" />
                <span v-if="!primaryMatch.aiMatch.missingSkills.length" class="text-xs text-ink-muted">None against must-haves</span>
              </div>
            </div>
          </div>
          <p class="mt-3 text-sm text-slate-700">{{ primaryMatch.aiMatch.explanation }}</p>
          <p class="mt-2 text-sm font-medium text-ink">Next: {{ primaryMatch.aiMatch.nextAction }}</p>
        </AppCard>

        <AppCard flush>
          <template #header>
            <div>
              <h2 class="text-sm font-semibold text-ink">Jobs that fit this person</h2>
              <p class="text-xs text-ink-faint">Open and paused briefs ranked by must-have overlap.</p>
            </div>
          </template>
          <ul>
            <li v-for="row in suggestedJobs" :key="row.job.id" class="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-2.5 last:border-0">
              <div>
                <NuxtLink :to="`/jobs/${row.job.id}`" class="text-sm font-medium text-primary hover:underline">{{ row.job.title }}</NuxtLink>
                <p class="text-xs text-ink-faint">{{ agency.clientById[row.job.clientId]?.name }} · match {{ row.match.score }}{{ row.lastSent ? ` · last ${row.lastSent.status}` : '' }}</p>
              </div>
              <AppButton
                v-if="can('opportunities', 'create') || can('opportunities', 'edit')"
                size="sm"
                variant="primary"
                @click="sendJobId = row.job.id; sendOpen = true"
              >
                Send
              </AppButton>
            </li>
          </ul>
        </AppCard>

        <AppCard flush>
          <template #header><h2 class="text-sm font-semibold text-ink">Jobs & pipeline</h2></template>
          <ul>
            <li v-for="entry in entries" :key="entry.id" class="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-2.5 last:border-0">
              <div>
                <NuxtLink :to="`/jobs/${entry.jobId}`" class="text-sm font-medium text-primary hover:underline">{{ agency.jobById[entry.jobId]?.title }}</NuxtLink>
                <p class="text-xs text-ink-faint">{{ agency.clientById[agency.jobById[entry.jobId]?.clientId ?? '']?.name }}</p>
              </div>
              <StatusBadge :value="entry.sideStage ?? entry.stage" />
            </li>
          </ul>
        </AppCard>
      </div>

      <div class="space-y-4 xl:col-span-4">
        <AppCard>
          <template #header><h2 class="text-sm font-semibold text-ink">Add note</h2></template>
          <textarea v-model="note" rows="3" class="min-h-[88px] w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none" :disabled="!can('activities', 'create')" />
          <div class="mt-2 flex justify-end">
            <AppButton size="sm" variant="primary" :disabled="!can('activities', 'create')" @click="saveNote">Save note</AppButton>
          </div>
        </AppCard>
        <AppCard flush>
          <template #header><h2 class="text-sm font-semibold text-ink">Activity</h2></template>
          <ol class="divide-y divide-slate-100">
            <li v-for="item in timeline" :key="item.id" class="px-4 py-3">
              <p class="text-sm font-medium text-ink">{{ item.title }}</p>
              <p class="text-xs text-ink-muted">{{ item.body }}</p>
              <p class="mt-1 text-[11px] text-ink-faint">{{ fmt.dateTime(item.at) }} · {{ agency.userName(item.actorId) }}</p>
            </li>
          </ol>
        </AppCard>
      </div>
    </div>

    <SendOpportunityDrawer
      :open="sendOpen"
      :candidate-id="candidate.id"
      :job-id="sendJobId"
      @close="sendOpen = false"
    />

    <AppDrawer :open="editOpen" title="Edit candidate" @close="editOpen = false">
      <form class="space-y-4" @submit.prevent="saveEdit">
        <div class="grid gap-3 sm:grid-cols-2">
          <AppInput v-model="draftFirstName" label="First name" />
          <AppInput v-model="draftLastName" label="Last name" />
        </div>
        <div class="grid gap-3 sm:grid-cols-2">
          <AppInput v-model="draftEmail" label="Email" type="email" />
          <AppInput v-model="draftPhone" label="Phone" />
        </div>
        <div class="grid gap-3 sm:grid-cols-2">
          <AppInput v-model="draftTitle" label="Current title" />
          <AppInput v-model="draftLocation" label="Location" />
        </div>
        <AppInput v-model="draftLinkedinUrl" label="LinkedIn URL" hint="Paste a profile URL — stored as text only" />
        <AppInput v-model="draftSkills" label="Skills" hint="Comma-separated" />
        <div class="grid gap-3 sm:grid-cols-2">
          <AppInput v-model="draftYears" label="Years experience" type="number" />
          <AppInput v-model="draftSalary" label="Salary expectation (GBP)" type="number" />
        </div>
        <div class="grid gap-3 sm:grid-cols-2">
          <AppSelect v-model="draftAvailability" label="Availability" :options="availabilityOptions" />
          <AppInput v-model="draftSource" label="Source" />
        </div>
        <label class="block">
          <span class="mb-1 block text-sm font-medium text-ink">CV summary</span>
          <textarea
            v-model="draftCvSummary"
            rows="3"
            class="min-h-[80px] w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </label>
        <label class="block">
          <span class="mb-1 block text-sm font-medium text-ink">Notes</span>
          <textarea
            v-model="draftNotes"
            rows="3"
            class="min-h-[80px] w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </label>
      </form>
      <template #footer>
        <div class="flex justify-end gap-2">
          <AppButton variant="ghost" @click="editOpen = false">Cancel</AppButton>
          <AppButton variant="primary" @click="saveEdit">Save</AppButton>
        </div>
      </template>
    </AppDrawer>
  </div>
</template>
