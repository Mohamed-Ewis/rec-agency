<script setup lang="ts">
import type { OpportunityStatus } from '~/types'

definePageMeta({ title: 'Send jobs', resource: 'opportunities', action: 'view' })

const route = useRoute()
const agency = useAgencyStore()
const { can } = usePermissions()
const fmt = useFormat()
const ready = usePageReady()

const candidateId = ref(typeof route.query.candidate === 'string' ? route.query.candidate : agency.candidates[0]?.id ?? '')
const jobId = ref(typeof route.query.job === 'string' ? route.query.job : agency.openJobs[0]?.id ?? '')
const status = ref('all')
const channel = ref('all')
const sendOpen = ref(Boolean(route.query.candidate && route.query.job))

const candidateOptions = computed(() =>
  agency.candidates.map(item => ({ value: item.id, label: `${item.firstName} ${item.lastName} — ${item.currentTitle}` }))
)
const jobOptions = computed(() =>
  agency.jobs
    .filter(job => job.status === 'open' || job.status === 'paused')
    .map(job => ({ value: job.id, label: `${job.title} — ${agency.clientById[job.clientId]?.name ?? ''}` }))
)

const previewMatch = computed(() => agency.matchFor(candidateId.value, jobId.value))
const previewFee = computed(() => agency.feePreview(candidateId.value, jobId.value))

const filtered = computed(() =>
  agency.opportunities.filter((item) => {
    if (status.value !== 'all' && item.status !== status.value) return false
    if (channel.value !== 'all' && item.channel !== channel.value) return false
    return true
  }).slice().sort((a, b) => b.sentAt.localeCompare(a.sentAt))
)

const table = useTable(filtered, { pageSize: 8 })

function mark(id: string, next: OpportunityStatus) {
  const auth = useAuthStore()
  if (!auth.currentUser) return
  agency.setOpportunityStatus(id, next, auth.currentUser.id)
}
</script>

<template>
  <div>
    <PageHeader
      eyebrow="Market"
      title="Send jobs"
      description="Match an open client brief to a seeker, send it (mock email or LinkedIn), then track the reply."
    />

    <div class="grid gap-4 xl:grid-cols-12">
      <AppCard class="xl:col-span-5">
        <template #header>
          <div>
            <h2 class="text-sm font-semibold text-ink">Compose outreach</h2>
            <p class="text-xs text-ink-faint">Pick a person and a live mandate. The desk drafts the note.</p>
          </div>
        </template>
        <div class="space-y-3">
          <AppSelect v-model="candidateId" label="Job seeker" :options="candidateOptions" />
          <AppSelect v-model="jobId" label="Job to send" :options="jobOptions.length ? jobOptions : [{ value: '', label: 'No live jobs' }]" />
          <div v-if="previewMatch" class="rounded-md border border-slate-200 bg-slate-50 p-3">
            <div class="flex items-center justify-between">
              <p class="text-xs font-medium uppercase text-ink-faint">Fit</p>
              <p class="font-mono text-xl font-semibold">{{ previewMatch.score }}</p>
            </div>
            <p class="mt-1 text-xs text-ink-muted">{{ previewMatch.explanation }}</p>
            <div class="mt-2 flex flex-wrap gap-1">
              <AppBadge v-for="skill in previewMatch.matchedSkills" :key="skill" :label="skill" tone="green" />
              <AppBadge v-for="skill in previewMatch.missingSkills" :key="`m-${skill}`" :label="skill" tone="amber" />
            </div>
            <p v-if="previewFee" class="mt-2 text-xs text-ink-faint">
              Expected fee {{ fmt.money(previewFee.feeAmount) }} · your share {{ fmt.money(previewFee.recruiterCommission) }}
            </p>
          </div>
          <div class="flex justify-end">
            <AppButton
              variant="primary"
              :disabled="!candidateId || !jobId || !(can('opportunities', 'create') || can('opportunities', 'edit'))"
              @click="sendOpen = true"
            >
              Review & send
            </AppButton>
          </div>
        </div>
      </AppCard>

      <AppCard class="xl:col-span-7">
        <template #header>
          <div>
            <h2 class="text-sm font-semibold text-ink">Why this exists</h2>
            <p class="text-xs text-ink-faint">The second half of the agency: jobs go to people, not only people to clients.</p>
          </div>
        </template>
        <ol class="space-y-2 text-sm text-ink-muted">
          <li>1. Source talent against a client brief.</li>
          <li>2. Send the role to the seeker and wait for a real reply.</li>
          <li>3. If they want it, they enter the client pipeline.</li>
          <li>4. Hire raises the invoice and the recruiter commission automatically.</li>
        </ol>
        <p class="mt-3 text-xs text-ink-faint">Outreach is simulated. No email or LinkedIn message is actually delivered in this phase.</p>
      </AppCard>
    </div>

    <div class="mt-4 mb-3 grid gap-3 md:grid-cols-2">
      <AppSelect
        v-model="status"
        label="Status"
        :options="[
          { value: 'all', label: 'All statuses' },
          { value: 'sent', label: 'Sent — awaiting reply' },
          { value: 'replied', label: 'Replied' },
          { value: 'declined', label: 'Declined' },
          { value: 'drafted', label: 'Drafted' }
        ]"
      />
      <AppSelect
        v-model="channel"
        label="Channel"
        :options="[
          { value: 'all', label: 'All channels' },
          { value: 'email', label: 'Email' },
          { value: 'linkedin', label: 'LinkedIn' }
        ]"
      />
    </div>

    <AppSkeleton v-if="!ready" :rows="6" />
    <AppCard v-else flush>
      <div class="overflow-x-auto">
        <table class="min-w-[920px] w-full text-left text-sm">
          <thead class="border-b border-slate-200 bg-slate-50 text-xs uppercase text-ink-faint">
            <tr>
              <th class="px-4 py-2 font-medium">When</th>
              <th class="px-4 py-2 font-medium">Seeker</th>
              <th class="px-4 py-2 font-medium">Job</th>
              <th class="px-4 py-2 font-medium">Channel</th>
              <th class="px-4 py-2 font-medium">Status</th>
              <th class="px-4 py-2 font-medium">Owner</th>
              <th class="px-4 py-2 font-medium" />
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in table.rows" :key="item.id" class="border-b border-slate-100 hover:bg-primary-50/60">
              <td class="px-4 py-2.5 font-mono text-xs tabular">{{ fmt.relative(item.sentAt) }}</td>
              <td class="px-4 py-2.5">
                <NuxtLink :to="`/candidates/${item.candidateId}`" class="font-medium text-primary hover:underline">{{ agency.candidateName(item.candidateId) }}</NuxtLink>
                <p class="text-xs text-ink-faint">{{ item.subject }}</p>
              </td>
              <td class="px-4 py-2.5">
                <NuxtLink :to="`/jobs/${item.jobId}`" class="text-primary hover:underline">{{ agency.jobById[item.jobId]?.title }}</NuxtLink>
              </td>
              <td class="px-4 py-2.5"><StatusBadge :value="item.channel" /></td>
              <td class="px-4 py-2.5"><StatusBadge :value="item.status" /></td>
              <td class="px-4 py-2.5 text-ink-muted">{{ agency.userName(item.actorId) }}</td>
              <td class="px-4 py-2.5">
                <div v-if="can('opportunities', 'edit') && item.status === 'sent'" class="flex gap-1">
                  <AppButton size="sm" @click="mark(item.id, 'replied')">Replied</AppButton>
                  <AppButton size="sm" variant="ghost" @click="mark(item.id, 'declined')">Declined</AppButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <AppEmpty v-if="!filtered.length" title="No outreach in this filter" body="Send a job from the composer, from Sourcing, or from a candidate profile." />
      <AppPagination :page="table.page" :page-count="table.pageCount" :total="filtered.length" @update:page="table.page = $event" />
    </AppCard>

    <SendOpportunityDrawer
      :open="sendOpen"
      :candidate-id="candidateId"
      :job-id="jobId"
      @close="sendOpen = false"
    />
  </div>
</template>
