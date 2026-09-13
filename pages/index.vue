<script setup lang="ts">
import { PIPELINE_STAGES, WEEK_END, WEEK_START } from '~/utils/constants'

definePageMeta({ title: 'Dashboard' })

const agency = useAgencyStore()
const fmt = useFormat()
const ready = usePageReady(280)
const ownerFilter = ref('all')

const interviewsThisWeek = computed(() =>
  agency.interviews.filter((item) => {
    const day = item.startsAt.slice(0, 10)
    return day >= WEEK_START && day <= WEEK_END && item.status !== 'cancelled'
  })
)

const upcoming = computed(() =>
  agency.interviews
    .filter(item => item.status === 'scheduled' && item.startsAt >= '2026-09-13')
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .slice(0, 6)
)

const recent = computed(() =>
  agency.activities
    .slice()
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 7)
)

const jobsAttention = computed(() => {
  return agency.jobs
    .filter((job) => {
      if (ownerFilter.value !== 'all' && job.ownerId !== ownerFilter.value) return false
      if (job.status === 'paused' || (job.status === 'open' && job.priority === 'urgent')) return true
      const entries = agency.entriesForJob(job.id)
      if (job.status === 'open' && entries.length === 0) return true
      const latest = entries.map(entry => entry.updatedAt).sort().at(-1)
      if (job.status === 'open' && latest && latest < '2026-09-06') return true
      if (job.status === 'open' && entries.some(entry => entry.stage === 'submitted') && !agency.interviews.some(item => item.jobId === job.id && item.status === 'scheduled')) {
        return job.id === 'job_ops' || job.id === 'job_be'
      }
      return false
    })
    .slice(0, 6)
})

const pipelineItems = computed(() =>
  PIPELINE_STAGES.map(stage => ({
    label: stage.label,
    value: agency.pipeline.filter(entry => entry.stage === stage.id && !entry.sideStage).length
  }))
)

const workload = computed(() => {
  return ['usr_james', 'usr_elena'].map((id) => {
    const openJobs = agency.jobs.filter(job => job.ownerId === id && job.status === 'open').length
    const active = agency.pipeline.filter(entry => entry.ownerId === id && !entry.sideStage && entry.stage !== 'hired').length
    const openTasks = agency.tasks.filter(task => task.ownerId === id && task.status !== 'done' && task.status !== 'cancelled').length
    return {
      label: agency.userName(id).split(' ')[0],
      value: openJobs + active,
      hint: `${openJobs} jobs · ${active} live · ${openTasks} tasks`
    }
  })
})

const ownerOptions = [
  { value: 'all', label: 'All owners' },
  { value: 'usr_james', label: 'James Okonkwo' },
  { value: 'usr_elena', label: 'Elena Varga' }
]
</script>

<template>
  <div>
    <PageHeader
      eyebrow="Operate"
      title="Desk"
      description="Win the brief, send the job to the right seeker, close the hire, collect the fee."
    >
      <template #actions>
        <div class="w-52">
          <AppSelect v-model="ownerFilter" label="Owner" :options="ownerOptions" />
        </div>
      </template>
    </PageHeader>

    <AppSkeleton v-if="!ready" :cards="8" :rows="5" />

    <template v-else>
      <section class="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">
        <AppKpi label="Open jobs" :value="agency.openJobs.length" hint="Live mandates" />
        <AppKpi label="Active candidates" :value="agency.activeCandidateIds.size" hint="In pipeline" />
        <AppKpi label="Interviews this week" :value="interviewsThisWeek.length" hint="8–14 Sep" />
        <AppKpi label="Offers" :value="agency.offers.length" tone="warn" hint="Need closing" />
        <AppKpi label="Hires" :value="agency.hires.length" tone="ok" hint="YTD placements" />
        <AppKpi label="Revenue" :value="fmt.compactMoney(agency.paidRevenue)" hint="Collected 2026" />
        <AppKpi label="Outstanding" :value="fmt.compactMoney(agency.outstandingRevenue)" tone="warn" hint="Overdue invoices" />
        <AppKpi label="Open tasks" :value="agency.tasks.filter(t => t.status !== 'done').length" hint="Across the desk" />
      </section>

      <section class="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
        <AppKpi label="Jobs sent" :value="agency.sentThisWeek" hint="Outreach this week" />
        <AppKpi label="Awaiting reply" :value="agency.awaitingReply" hint="Seekers not yet back" />
        <AppKpi label="Guarantee window" :value="agency.placementsInGuarantee.length" hint="Hires still at risk" />
        <AppKpi label="Commission due" :value="fmt.compactMoney(agency.outstandingCommission)" tone="warn" hint="Unpaid placement fees" />
      </section>

      <div class="mt-5 grid gap-4 xl:grid-cols-12">
        <AppCard class="xl:col-span-7">
          <template #header>
            <div>
              <h2 class="text-sm font-semibold text-ink">Pipeline snapshot</h2>
              <p class="text-xs text-ink-faint">Stage counts with conversion from the previous step</p>
            </div>
          </template>
          <AppFunnel :items="pipelineItems" />
        </AppCard>
        <AppCard class="xl:col-span-5">
          <template #header>
            <h2 class="text-sm font-semibold text-ink">Recruiter workload</h2>
          </template>
          <AppBarChart
            title=""
            summary="James and Elena live workload from open jobs plus active pipeline"
            :items="workload"
          />
        </AppCard>
      </div>

      <div class="mt-4 grid gap-4 xl:grid-cols-12">
        <AppCard class="xl:col-span-6" flush>
          <template #header>
            <h2 class="text-sm font-semibold text-ink">Upcoming interviews</h2>
            <NuxtLink to="/interviews" class="text-xs font-medium text-primary hover:underline">View all</NuxtLink>
          </template>
          <table class="w-full text-left text-sm">
            <thead class="border-b border-slate-200 bg-slate-50 text-xs uppercase text-ink-faint">
              <tr>
                <th class="px-4 py-2 font-medium">When</th>
                <th class="px-4 py-2 font-medium">Candidate</th>
                <th class="px-4 py-2 font-medium">Job</th>
                <th class="px-4 py-2 font-medium">Stage</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in upcoming" :key="item.id" class="border-b border-slate-100 last:border-0 hover:bg-primary-50/60">
                <td class="px-4 py-2.5 font-mono text-xs tabular text-ink">{{ fmt.dateTime(item.startsAt) }}</td>
                <td class="px-4 py-2.5">
                  <NuxtLink :to="`/candidates/${item.candidateId}`" class="text-primary hover:underline">{{ agency.candidateName(item.candidateId) }}</NuxtLink>
                </td>
                <td class="px-4 py-2.5 text-ink-muted">{{ agency.jobById[item.jobId]?.title }}</td>
                <td class="px-4 py-2.5"><StatusBadge :value="item.stage" /></td>
              </tr>
            </tbody>
          </table>
          <AppEmpty v-if="!upcoming.length" title="No upcoming interviews" body="Nothing scheduled from today. Add one from Interviews if a client loop is confirmed." />
        </AppCard>

        <AppCard class="xl:col-span-6" flush>
          <template #header>
            <h2 class="text-sm font-semibold text-ink">Jobs needing attention</h2>
            <NuxtLink to="/jobs" class="text-xs font-medium text-primary hover:underline">Jobs</NuxtLink>
          </template>
          <ul>
            <li v-for="job in jobsAttention" :key="job.id" class="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-2.5 last:border-0 hover:bg-primary-50/60">
              <div>
                <NuxtLink :to="`/jobs/${job.id}`" class="text-sm font-medium text-primary hover:underline">{{ job.title }}</NuxtLink>
                <p class="text-xs text-ink-faint">{{ agency.clientById[job.clientId]?.name }} · {{ agency.userName(job.ownerId) }}</p>
              </div>
              <div class="flex items-center gap-2">
                <PriorityBadge :value="job.priority" />
                <StatusBadge :value="job.status" />
              </div>
            </li>
          </ul>
        </AppCard>
      </div>

      <AppCard class="mt-4" flush>
        <template #header>
          <h2 class="text-sm font-semibold text-ink">Recent activity</h2>
          <NuxtLink to="/activities" class="text-xs font-medium text-primary hover:underline">Timeline</NuxtLink>
        </template>
        <ul>
          <li v-for="item in recent" :key="item.id" class="grid grid-cols-[7rem_1fr_9rem] gap-3 border-b border-slate-100 px-4 py-2.5 text-sm last:border-0">
            <StatusBadge :value="item.type.replace('_', ' ')" />
            <div>
              <p class="font-medium text-ink">{{ item.title }}</p>
              <p class="text-xs text-ink-muted">{{ item.body }}</p>
            </div>
            <p class="text-right text-xs text-ink-faint">{{ fmt.relative(item.at) }} · {{ agency.userName(item.actorId) }}</p>
          </li>
        </ul>
      </AppCard>
    </template>
  </div>
</template>
