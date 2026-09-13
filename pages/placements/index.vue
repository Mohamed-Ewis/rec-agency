<script setup lang="ts">
definePageMeta({ title: 'Commissions', resource: 'placements', action: 'view' })

const agency = useAgencyStore()
const auth = useAuthStore()
const ui = useUiStore()
const { can } = usePermissions()
const fmt = useFormat()
const ready = usePageReady()
const status = ref('all')

const filtered = computed(() =>
  agency.placements
    .filter(item => status.value === 'all' || item.status === status.value)
    .slice()
    .sort((a, b) => b.placedAt.localeCompare(a.placedAt))
)

function invoiceFor(id: string) {
  return agency.invoices.find(item => item.id === id)
}

async function collect(invoiceId: string) {
  if (!auth.currentUser) return
  const ok = await ui.ask({
    title: 'Mark invoice paid?',
    body: 'This is mock collection — it records the fee as received on the desk.',
    confirmLabel: 'Mark paid'
  })
  if (!ok) return
  const result = agency.markInvoicePaid(invoiceId, auth.currentUser.id)
  ui.toast(result.ok ? 'Fee collected' : result.error ?? 'Could not collect', result.ok ? 'success' : 'error')
}

async function clearGuarantee(placementId: string) {
  if (!auth.currentUser) return
  agency.setPlacementStatus(placementId, 'cleared', auth.currentUser.id)
  ui.toast('Guarantee cleared')
}
</script>

<template>
  <div>
    <PageHeader
      eyebrow="Market"
      title="Commissions"
      description="A hire is not the finish. Invoice the client fee, watch the guarantee, then keep the recruiter share."
    />

    <section class="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
      <AppKpi label="Fees collected" :value="fmt.compactMoney(agency.paidRevenue)" hint="Paid invoices" tone="ok" />
      <AppKpi label="Fees outstanding" :value="fmt.compactMoney(agency.outstandingCommission)" hint="Still to collect" tone="warn" />
      <AppKpi label="In guarantee" :value="agency.placementsInGuarantee.length" hint="Replacement window open" />
      <AppKpi label="Recruiter share" :value="fmt.compactMoney(agency.recruiterCommissionYtd)" hint="40% of placed fees" />
    </section>

    <div class="mb-3 w-64">
      <AppSelect
        v-model="status"
        label="Placement status"
        :options="[
          { value: 'all', label: 'All placements' },
          { value: 'guarantee', label: 'In guarantee' },
          { value: 'cleared', label: 'Cleared' },
          { value: 'replaced', label: 'Replaced' }
        ]"
      />
    </div>

    <AppSkeleton v-if="!ready" :rows="6" />
    <AppCard v-else flush>
      <div class="overflow-x-auto">
        <table class="min-w-[1020px] w-full text-left text-sm">
          <thead class="border-b border-slate-200 bg-slate-50 text-xs uppercase text-ink-faint">
            <tr>
              <th class="px-4 py-2 font-medium">Placed</th>
              <th class="px-4 py-2 font-medium">Candidate</th>
              <th class="px-4 py-2 font-medium">Job / client</th>
              <th class="px-4 py-2 font-medium">Salary</th>
              <th class="px-4 py-2 font-medium">Client fee</th>
              <th class="px-4 py-2 font-medium">Your share</th>
              <th class="px-4 py-2 font-medium">Invoice</th>
              <th class="px-4 py-2 font-medium">Guarantee</th>
              <th class="px-4 py-2 font-medium" />
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filtered" :key="item.id" class="border-b border-slate-100 hover:bg-primary-50/60">
              <td class="px-4 py-2.5 font-mono text-xs tabular">{{ fmt.date(item.placedAt) }}</td>
              <td class="px-4 py-2.5">
                <NuxtLink :to="`/candidates/${item.candidateId}`" class="font-medium text-primary hover:underline">{{ agency.candidateName(item.candidateId) }}</NuxtLink>
                <p class="text-xs text-ink-faint">{{ agency.userName(item.recruiterId) }}</p>
              </td>
              <td class="px-4 py-2.5">
                <NuxtLink :to="`/jobs/${item.jobId}`" class="text-primary hover:underline">{{ agency.jobById[item.jobId]?.title }}</NuxtLink>
                <p class="text-xs text-ink-faint">{{ agency.clientById[item.clientId]?.name }}</p>
              </td>
              <td class="px-4 py-2.5 font-mono text-xs tabular">{{ fmt.money(item.salary) }}</td>
              <td class="px-4 py-2.5">
                <p class="font-mono text-xs tabular">{{ fmt.money(item.feeAmount) }}</p>
                <p class="text-[11px] text-ink-faint">{{ item.feePercent }}%</p>
              </td>
              <td class="px-4 py-2.5 font-mono text-xs tabular">{{ fmt.money(item.recruiterCommission) }}</td>
              <td class="px-4 py-2.5">
                <p class="font-mono text-xs">{{ item.invoiceId }}</p>
                <StatusBadge :value="invoiceFor(item.invoiceId)?.status ?? 'draft'" />
              </td>
              <td class="px-4 py-2.5">
                <StatusBadge :value="item.status" />
                <p class="text-[11px] text-ink-faint">Until {{ fmt.date(item.guaranteeUntil) }}</p>
              </td>
              <td class="px-4 py-2.5">
                <div class="flex flex-col gap-1">
                  <AppButton
                    v-if="can('placements', 'manage') && invoiceFor(item.invoiceId) && invoiceFor(item.invoiceId)?.status !== 'paid'"
                    size="sm"
                    variant="primary"
                    @click="collect(item.invoiceId)"
                  >
                    Collect
                  </AppButton>
                  <AppButton
                    v-if="can('placements', 'manage') && item.status === 'guarantee'"
                    size="sm"
                    @click="clearGuarantee(item.id)"
                  >
                    Clear
                  </AppButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <AppEmpty v-if="!filtered.length" title="No placements in this filter" body="Move a pipeline card to Hired to raise a fee, invoice, and recruiter share." />
    </AppCard>
  </div>
</template>
