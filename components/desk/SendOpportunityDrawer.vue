<script setup lang="ts">
import type { OutreachChannel } from '~/types'
import { draftJobOutreach } from '~/utils/matching'

const props = defineProps<{
  open: boolean
  candidateId: string
  jobId: string
}>()

const emit = defineEmits<{ close: [] }>()

const agency = useAgencyStore()
const auth = useAuthStore()
const ui = useUiStore()
const { can } = usePermissions()
const fmt = useFormat()

const channel = ref<OutreachChannel>('email')
const subject = ref('')
const body = ref('')

const candidate = computed(() => agency.candidateById[props.candidateId])
const job = computed(() => agency.jobById[props.jobId])
const match = computed(() => agency.matchFor(props.candidateId, props.jobId))
const fee = computed(() => agency.feePreview(props.candidateId, props.jobId))

watch(
  () => [props.open, props.candidateId, props.jobId] as const,
  ([open]) => {
    if (!open || !candidate.value || !job.value) return
    const clientName = agency.clientById[job.value.clientId]?.name ?? 'our client'
    const draft = draftJobOutreach(candidate.value, job.value, clientName)
    subject.value = draft.subject
    body.value = draft.body
    channel.value = 'email'
  }
)

function send() {
  if (!can('opportunities', 'create') && !can('opportunities', 'edit')) return
  if (!auth.currentUser || !subject.value.trim() || !body.value.trim()) return
  const result = agency.sendOpportunity(
    {
      candidateId: props.candidateId,
      jobId: props.jobId,
      channel: channel.value,
      subject: subject.value.trim(),
      body: body.value.trim()
    },
    auth.currentUser.id
  )
  if (result) {
    ui.toast('Job sent to the seeker — mock outreach logged')
    emit('close')
  }
}
</script>

<template>
  <AppDrawer :open="open" title="Send this job to the seeker" @close="emit('close')">
    <div v-if="candidate && job" class="space-y-4">
      <div>
        <p class="text-sm font-medium text-ink">{{ candidate.firstName }} {{ candidate.lastName }}</p>
        <p class="text-xs text-ink-faint">{{ job.title }} · {{ fee?.clientName }}</p>
      </div>
      <div v-if="match" class="rounded-md border border-slate-200 bg-slate-50 p-3">
        <div class="flex items-center justify-between">
          <p class="text-xs font-medium uppercase text-ink-faint">Match</p>
          <p class="font-mono text-lg font-semibold text-ink">{{ match.score }}</p>
        </div>
        <p class="mt-1 text-xs text-ink-muted">{{ match.explanation }}</p>
        <p class="mt-1 text-xs font-medium text-ink">{{ match.nextAction }}</p>
      </div>
      <p v-if="fee" class="text-xs text-ink-muted">
        If they place at {{ fmt.money(fee.salary) }}, client fee is {{ fee.feePercent }}%
        ({{ fmt.money(fee.feeAmount) }}) and desk share is {{ fmt.money(fee.recruiterCommission) }}.
      </p>
      <AppSelect
        v-model="channel"
        label="Channel"
        :options="[
          { value: 'email', label: 'Email (mock)' },
          { value: 'linkedin', label: 'LinkedIn (mock)' }
        ]"
      />
      <AppInput v-model="subject" label="Subject" />
      <label class="block">
        <span class="mb-1 block text-sm font-medium text-ink">Message</span>
        <textarea
          v-model="body"
          rows="8"
          class="min-h-[160px] w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
        <span class="mt-1 block text-xs text-ink-faint">Nothing leaves the desk — this writes an opportunity, activity, and a follow-up task.</span>
      </label>
    </div>
    <template #footer>
      <div class="flex justify-end gap-2">
        <AppButton variant="ghost" @click="emit('close')">Cancel</AppButton>
        <AppButton variant="primary" :disabled="!subject.trim() || !body.trim()" @click="send">Send job</AppButton>
      </div>
    </template>
  </AppDrawer>
</template>
