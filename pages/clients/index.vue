<script setup lang="ts">
definePageMeta({ title: 'Clients', resource: 'clients', action: 'view' })

const agency = useAgencyStore()
const ui = useUiStore()
const auth = useAuthStore()
const { can } = usePermissions()
const query = ref('')
const ready = usePageReady()
const fmt = useFormat()

const filtered = computed(() =>
  agency.clients.filter((client) => {
    const hay = `${client.name} ${client.industry} ${client.location}`.toLowerCase()
    return hay.includes(query.value.trim().toLowerCase())
  })
)

const createOpen = ref(false)
const name = ref('')
const industry = ref('')
const website = ref('')
const location = ref('')
const feePercent = ref('20')
const agreement = ref('')
const notes = ref('')
const contactName = ref('')
const contactTitle = ref('')
const contactEmail = ref('')
const contactPhone = ref('')
const nameError = ref('')
const submitting = ref(false)

function actorId() {
  return auth.currentUser?.id ?? ''
}

function resetForm() {
  name.value = ''
  industry.value = ''
  website.value = ''
  location.value = ''
  feePercent.value = '20'
  agreement.value = ''
  notes.value = ''
  contactName.value = ''
  contactTitle.value = ''
  contactEmail.value = ''
  contactPhone.value = ''
  nameError.value = ''
}

function openCreate() {
  resetForm()
  createOpen.value = true
}

function createClient() {
  nameError.value = name.value.trim() ? '' : 'Enter a client name.'
  if (nameError.value || submitting.value || !actorId()) return

  const fee = Number(feePercent.value)
  if (!Number.isFinite(fee) || fee <= 0) {
    ui.toast('Enter a valid fee percent', 'error')
    return
  }

  const contacts = contactName.value.trim()
    ? [{
        id: '',
        name: contactName.value.trim(),
        title: contactTitle.value.trim(),
        email: contactEmail.value.trim(),
        phone: contactPhone.value.trim(),
        isPrimary: true
      }]
    : []

  submitting.value = true
  const client = agency.createClient({
    name: name.value.trim(),
    industry: industry.value.trim() || 'Unspecified',
    website: website.value.trim(),
    location: location.value.trim() || 'Remote UK',
    feePercent: fee,
    agreement: agreement.value.trim() || 'Intake created from the desk. Add the commercial terms on the client page.',
    ownerId: actorId(),
    notes: notes.value.trim(),
    contacts
  }, actorId())
  submitting.value = false
  createOpen.value = false
  ui.toast('Client created')
  navigateTo(`/clients/${client.id}`)
}
</script>

<template>
  <div>
    <PageHeader eyebrow="Desk" title="Clients" description="Who we work for, the fee, and which briefs are live.">
      <template #actions>
        <AppButton v-if="can('clients', 'create')" variant="primary" @click="openCreate">New client</AppButton>
      </template>
    </PageHeader>
    <div class="mb-4 max-w-sm">
      <AppInput v-model="query" label="Search" hint="Company, industry, city" />
    </div>
    <AppSkeleton v-if="!ready" :cards="6" :rows="1" />
    <div v-else class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      <NuxtLink
        v-for="client in filtered"
        :key="client.id"
        :to="`/clients/${client.id}`"
        class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:border-primary/40"
      >
        <p class="font-mono text-sm font-semibold text-ink">{{ client.name }}</p>
        <p class="text-xs text-ink-faint">{{ client.industry }} · {{ client.location }}</p>
        <p class="mt-3 text-sm text-ink-muted">Fee {{ client.feePercent }}% · {{ agency.jobs.filter(job => job.clientId === client.id && job.status === 'open').length }} open jobs</p>
        <p class="mt-1 font-mono text-xs tabular text-ink-faint">Owner {{ agency.userName(client.ownerId) }} · since {{ fmt.date(client.createdAt) }}</p>
      </NuxtLink>
    </div>
    <AppEmpty v-if="ready && !filtered.length" title="No clients match" body="Try an industry like fintech or a city name." />

    <AppDrawer :open="createOpen" title="New client" @close="createOpen = false">
      <form class="space-y-4" @submit.prevent="createClient">
        <AppInput v-model="name" label="Name" hint="e.g. Meridian Health" :error="nameError" />
        <div class="grid gap-3 sm:grid-cols-2">
          <AppInput v-model="industry" label="Industry" hint="e.g. Fintech" />
          <AppInput v-model="location" label="Location" hint="City or Remote UK" />
        </div>
        <div class="grid gap-3 sm:grid-cols-2">
          <AppInput v-model="website" label="Website" hint="https://…" />
          <AppInput v-model="feePercent" label="Fee percent" type="number" />
        </div>
        <label class="block">
          <span class="mb-1 block text-sm font-medium text-ink">Agreement</span>
          <textarea
            v-model="agreement"
            rows="3"
            class="min-h-[80px] w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </label>
        <p class="text-sm font-medium text-ink">Primary contact</p>
        <div class="grid gap-3 sm:grid-cols-2">
          <AppInput v-model="contactName" label="Contact name" />
          <AppInput v-model="contactTitle" label="Title" />
        </div>
        <div class="grid gap-3 sm:grid-cols-2">
          <AppInput v-model="contactEmail" label="Contact email" type="email" />
          <AppInput v-model="contactPhone" label="Contact phone" />
        </div>
        <label class="block">
          <span class="mb-1 block text-sm font-medium text-ink">Notes</span>
          <textarea
            v-model="notes"
            rows="3"
            class="min-h-[80px] w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </label>
      </form>
      <template #footer>
        <div class="flex justify-end gap-2">
          <AppButton variant="ghost" @click="createOpen = false">Cancel</AppButton>
          <AppButton variant="primary" :disabled="submitting" @click="createClient">
            {{ submitting ? 'Creating…' : 'Create client' }}
          </AppButton>
        </div>
      </template>
    </AppDrawer>
  </div>
</template>
