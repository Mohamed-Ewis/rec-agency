<script setup lang="ts">
definePageMeta({
  title: 'Reports',
  resource: 'reports',
  action: 'view'
})

const agency = useAgencyStore()
const fmt = useFormat()
const { can } = usePermissions()

const hiresByMonth = [
  { label: 'Mar', value: 1, hint: 'Atlas historical' },
  { label: 'Apr', value: 0 },
  { label: 'May', value: 1, hint: 'Harbor' },
  { label: 'Jun', value: 0 },
  { label: 'Jul', value: 0 },
  { label: 'Aug', value: 1, hint: 'Meridian DE' },
  { label: 'Sep', value: 0, hint: 'No hire closed this month yet' }
]

const jobsByStatus = computed(() => {
  const counts: Record<string, number> = {}
  for (const job of agency.jobs) counts[job.status] = (counts[job.status] ?? 0) + 1
  return Object.entries(counts).map(([label, value]) => ({ label, value }))
})

const conversion = computed(() => {
  const stages = ['sourced', 'contacted', 'interested', 'screening', 'qualified', 'submitted', 'interview', 'offer', 'hired'] as const
  return stages.map(stage => ({
    label: stage,
    value: agency.pipeline.filter(entry => entry.stage === stage && !entry.sideStage).length
  }))
})

const workload = computed(() =>
  ['usr_james', 'usr_elena', 'usr_priya'].map(id => ({
    label: agency.userName(id).split(' ')[0],
    value: agency.pipeline.filter(entry => entry.ownerId === id && !entry.sideStage).length
  }))
)

const commissionByRecruiter = computed(() =>
  ['usr_james', 'usr_elena'].map(id => ({
    label: agency.userName(id).split(' ')[0],
    value: Math.round(agency.placements.filter(item => item.recruiterId === id).reduce((sum, item) => sum + item.recruiterCommission, 0) / 1000),
    hint: fmt.money(agency.placements.filter(item => item.recruiterId === id).reduce((sum, item) => sum + item.recruiterCommission, 0))
  }))
)
</script>

<template>
  <div>
    <PageHeader eyebrow="Insight" title="Reports" description="Simple operating numbers. Enough for a two-person desk, not a BI suite." />
    <p v-if="!can('reports', 'view')" class="text-sm text-red-800">You do not have report access.</p>
    <div v-else class="grid gap-4 xl:grid-cols-2">
      <AppCard>
        <AppBarChart title="Hires by month" summary="Placements completed by month in 2026" :items="hiresByMonth" />
      </AppCard>
      <AppCard>
        <AppBarChart title="Jobs by status" summary="Current job inventory by status" :items="jobsByStatus" color="#3B82F6" />
      </AppCard>
      <AppCard>
        <template #header><h2 class="text-sm font-semibold text-ink">Pipeline conversion</h2></template>
        <AppFunnel :items="conversion" />
      </AppCard>
      <AppCard>
        <AppBarChart title="Recruiter workload" summary="Live pipeline cards by owner" :items="workload" color="#1E3A8A" />
        <div class="mt-4 border-t border-slate-100 pt-3 text-sm">
          <p class="text-ink-muted">Collected revenue {{ fmt.money(agency.paidRevenue) }}</p>
          <p class="text-cta-700">Outstanding {{ fmt.money(agency.outstandingRevenue) }}</p>
        </div>
      </AppCard>
      <AppCard>
        <AppBarChart title="Recruiter commission" summary="Share of placed fees (thousands)" :items="commissionByRecruiter" color="#F59E0B" />
        <p class="mt-3 text-xs text-ink-faint">
          <NuxtLink to="/placements" class="text-primary hover:underline">Open commissions</NuxtLink>
          to collect invoices and clear guarantee windows.
        </p>
      </AppCard>
    </div>
  </div>
</template>
