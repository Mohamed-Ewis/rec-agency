<script setup lang="ts">
definePageMeta({ title: 'Client', resource: 'clients', action: 'view' })

const route = useRoute()
const agency = useAgencyStore()
const ui = useUiStore()
const { can } = usePermissions()
const fmt = useFormat()
const editOpen = ref(false)
const draftName = ref('')
const draftIndustry = ref('')
const draftWebsite = ref('')
const draftLocation = ref('')
const draftFee = ref('')
const draftAgreement = ref('')
const draftNotes = ref('')
const draftContactName = ref('')
const draftContactTitle = ref('')
const draftContactEmail = ref('')
const draftContactPhone = ref('')

const client = computed(() => agency.clients.find(item => item.id === route.params.id as string))
if (!client.value) throw createError({ statusCode: 404, statusMessage: 'Client not found' })

const clientJobs = computed(() => agency.jobs.filter(job => job.clientId === client.value!.id))
const placements = computed(() => agency.placements.filter(item => item.clientId === client.value!.id))
const clientInvoices = computed(() => agency.invoices.filter(item => item.clientId === client.value!.id))
const timeline = computed(() => agency.activities.filter(item => item.clientId === client.value!.id).sort((a, b) => b.at.localeCompare(a.at)))
const primaryContact = computed(() => client.value?.contacts.find(item => item.isPrimary) ?? client.value?.contacts[0])

function openEdit() {
  if (!client.value) return
  draftName.value = client.value.name
  draftIndustry.value = client.value.industry
  draftWebsite.value = client.value.website
  draftLocation.value = client.value.location
  draftFee.value = String(client.value.feePercent)
  draftAgreement.value = client.value.agreement
  draftNotes.value = client.value.notes
  const contact = primaryContact.value
  draftContactName.value = contact?.name ?? ''
  draftContactTitle.value = contact?.title ?? ''
  draftContactEmail.value = contact?.email ?? ''
  draftContactPhone.value = contact?.phone ?? ''
  editOpen.value = true
}

function saveEdit() {
  if (!client.value) return
  const name = draftName.value.trim()
  if (!name) {
    ui.toast('Enter a client name', 'error')
    return
  }
  const fee = Number(draftFee.value)
  if (!Number.isFinite(fee) || fee <= 0) {
    ui.toast('Enter a valid fee percent', 'error')
    return
  }
  const existing = client.value.contacts
  const primary = primaryContact.value
  const nextContact = {
    id: primary?.id || '',
    name: draftContactName.value.trim(),
    title: draftContactTitle.value.trim(),
    email: draftContactEmail.value.trim(),
    phone: draftContactPhone.value.trim(),
    isPrimary: true
  }
  const contacts = nextContact.name
    ? [nextContact, ...existing.filter(item => item.id !== primary?.id).map(item => ({ ...item, isPrimary: false }))]
    : existing.filter(item => item.id !== primary?.id).map((item, index) => ({ ...item, isPrimary: index === 0 }))
  agency.updateClient(client.value.id, {
    name,
    industry: draftIndustry.value.trim(),
    website: draftWebsite.value.trim(),
    location: draftLocation.value.trim(),
    feePercent: fee,
    agreement: draftAgreement.value.trim(),
    notes: draftNotes.value.trim(),
    contacts
  })
  ui.toast('Client updated')
  editOpen.value = false
}
</script>

<template>
  <div v-if="client">
    <PageHeader :title="client.name" :description="client.industry">
      <template #crumbs>
        <NuxtLink to="/clients" class="hover:underline">Clients</NuxtLink> / {{ client.name }}
      </template>
      <template #actions>
        <AppButton v-if="can('clients', 'edit')" size="sm" @click="openEdit">Edit</AppButton>
      </template>
    </PageHeader>

    <div class="grid gap-4 xl:grid-cols-12">
      <div class="space-y-4 xl:col-span-8">
        <AppCard>
          <template #header><h2 class="text-sm font-semibold text-ink">Company</h2></template>
          <dl class="grid gap-3 text-sm sm:grid-cols-2">
            <div><dt class="text-xs text-ink-faint">Website</dt><dd><a v-if="client.website" :href="client.website" class="text-primary hover:underline" target="_blank" rel="noreferrer">{{ client.website.replace('https://', '') }}</a><span v-else class="text-ink-faint">—</span></dd></div>
            <div><dt class="text-xs text-ink-faint">Location</dt><dd>{{ client.location }}</dd></div>
            <div><dt class="text-xs text-ink-faint">Fee</dt><dd>{{ client.feePercent }}%</dd></div>
            <div><dt class="text-xs text-ink-faint">Owner</dt><dd>{{ agency.userName(client.ownerId) }}</dd></div>
            <div class="sm:col-span-2"><dt class="text-xs text-ink-faint">Agreement</dt><dd class="text-ink-muted">{{ client.agreement }}</dd></div>
            <div class="sm:col-span-2"><dt class="text-xs text-ink-faint">Notes</dt><dd class="text-ink-muted">{{ client.notes }}</dd></div>
          </dl>
        </AppCard>

        <AppCard>
          <template #header><h2 class="text-sm font-semibold text-ink">Contacts</h2></template>
          <ul class="space-y-2 text-sm">
            <li v-for="contact in client.contacts" :key="contact.id" class="flex flex-wrap items-center justify-between gap-2 rounded-md border border-slate-100 px-3 py-2">
              <div>
                <p class="font-medium text-ink">{{ contact.name }} <span v-if="contact.isPrimary" class="text-xs text-ink-faint">Primary</span></p>
                <p class="text-xs text-ink-muted">{{ contact.title }}</p>
              </div>
              <div class="text-right text-xs">
                <a :href="`mailto:${contact.email}`" class="text-primary hover:underline">{{ contact.email }}</a>
                <p class="text-ink-faint">{{ contact.phone }}</p>
              </div>
            </li>
          </ul>
        </AppCard>

        <AppCard flush>
          <template #header><h2 class="text-sm font-semibold text-ink">Jobs</h2></template>
          <ul>
            <li v-for="job in clientJobs" :key="job.id" class="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-2.5 last:border-0">
              <NuxtLink :to="`/jobs/${job.id}`" class="text-sm font-medium text-primary hover:underline">{{ job.title }}</NuxtLink>
              <StatusBadge :value="job.status" />
            </li>
          </ul>
        </AppCard>
      </div>

      <div class="space-y-4 xl:col-span-4">
        <AppCard>
          <template #header><h2 class="text-sm font-semibold text-ink">Placements & fees</h2></template>
          <p class="text-sm text-ink-muted">{{ placements.length }} hire{{ placements.length === 1 ? '' : 's' }} on file.</p>
          <ul class="mt-3 space-y-2 text-sm">
            <li v-for="item in placements" :key="item.id" class="rounded-md border border-slate-100 px-3 py-2">
              <div class="flex justify-between gap-2">
                <NuxtLink :to="`/candidates/${item.candidateId}`" class="text-primary hover:underline">{{ agency.candidateName(item.candidateId) }}</NuxtLink>
                <span class="font-mono text-xs tabular">{{ fmt.money(item.feeAmount) }}</span>
              </div>
              <p class="text-xs text-ink-faint">{{ item.feePercent }}% · share {{ fmt.money(item.recruiterCommission) }} · {{ item.status }}</p>
            </li>
            <li v-for="invoice in clientInvoices" :key="invoice.id" class="flex justify-between gap-2">
              <span class="font-mono text-xs">{{ invoice.id }}</span>
              <span class="font-mono tabular">{{ fmt.money(invoice.amount) }}</span>
              <StatusBadge :value="invoice.status" />
            </li>
          </ul>
        </AppCard>
        <AppCard flush>
          <template #header><h2 class="text-sm font-semibold text-ink">Activity</h2></template>
          <ol class="divide-y divide-slate-100">
            <li v-for="item in timeline" :key="item.id" class="px-4 py-3">
              <p class="text-sm font-medium text-ink">{{ item.title }}</p>
              <p class="text-xs text-ink-muted">{{ item.body }}</p>
              <p class="mt-1 text-[11px] text-ink-faint">{{ fmt.relative(item.at) }}</p>
            </li>
          </ol>
        </AppCard>
      </div>
    </div>

    <AppDrawer :open="editOpen" title="Edit client" @close="editOpen = false">
      <form class="space-y-4" @submit.prevent="saveEdit">
        <AppInput v-model="draftName" label="Name" />
        <div class="grid gap-3 sm:grid-cols-2">
          <AppInput v-model="draftIndustry" label="Industry" />
          <AppInput v-model="draftLocation" label="Location" />
        </div>
        <div class="grid gap-3 sm:grid-cols-2">
          <AppInput v-model="draftWebsite" label="Website" />
          <AppInput v-model="draftFee" label="Fee percent" type="number" />
        </div>
        <label class="block">
          <span class="mb-1 block text-sm font-medium text-ink">Agreement</span>
          <textarea
            v-model="draftAgreement"
            rows="3"
            class="min-h-[80px] w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </label>
        <p class="text-sm font-medium text-ink">Primary contact</p>
        <div class="grid gap-3 sm:grid-cols-2">
          <AppInput v-model="draftContactName" label="Contact name" />
          <AppInput v-model="draftContactTitle" label="Title" />
        </div>
        <div class="grid gap-3 sm:grid-cols-2">
          <AppInput v-model="draftContactEmail" label="Contact email" type="email" />
          <AppInput v-model="draftContactPhone" label="Contact phone" />
        </div>
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
