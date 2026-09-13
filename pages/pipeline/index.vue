<script setup lang="ts">
import { PIPELINE_STAGES } from '~/utils/constants'

definePageMeta({ title: 'Pipeline', resource: 'pipeline', action: 'view' })

const agency = useAgencyStore()
const auth = useAuthStore()
const { can } = usePermissions()
const ui = useUiStore()
const jobFilter = ref('all')
const dragging = ref<string | null>(null)

const jobOptions = computed(() => [
  { value: 'all', label: 'All open-related jobs' },
  ...agency.jobs.map(job => ({ value: job.id, label: job.title }))
])

const columns = computed(() =>
  PIPELINE_STAGES.map((stage) => ({
    ...stage,
    cards: agency.pipeline.filter(entry => entry.stage === stage.id && !entry.sideStage && (jobFilter.value === 'all' || entry.jobId === jobFilter.value))
  }))
)

function onDragStart(id: string) {
  if (!can('pipeline', 'edit')) return
  dragging.value = id
}

function onDrop(stage: typeof PIPELINE_STAGES[number]['id']) {
  if (!dragging.value || !can('pipeline', 'edit')) return
  const result = agency.movePipeline(dragging.value, stage, auth.currentUser?.id ?? '')
  if (result?.placement) {
    ui.toast(`Hire logged — invoice ${result.placement.invoiceId} raised`)
  } else {
    ui.toast('Stage updated')
  }
  dragging.value = null
}
</script>

<template>
  <div>
    <PageHeader eyebrow="Operate" title="Pipeline" description="Sourced to hired. Drag a card to change stage — mock only, no backend yet.">
      <template #actions>
        <div class="w-64">
          <AppSelect v-model="jobFilter" :options="jobOptions" />
        </div>
      </template>
    </PageHeader>

    <div class="flex gap-3 overflow-x-auto pb-4">
      <section
        v-for="column in columns"
        :key="column.id"
        class="flex w-64 shrink-0 flex-col rounded-lg border border-slate-200 bg-white"
        @dragover.prevent
        @drop="onDrop(column.id)"
      >
        <header class="flex items-center justify-between border-b border-slate-200 px-3 py-2">
          <h2 class="text-sm font-semibold text-ink">{{ column.label }}</h2>
          <span class="font-mono text-xs tabular text-ink-faint">{{ column.cards.length }}</span>
        </header>
        <ul class="min-h-[12rem] space-y-2 p-2">
          <li
            v-for="entry in column.cards"
            :key="entry.id"
            class="rounded-md border border-slate-200 bg-canvas p-2.5"
            :draggable="can('pipeline', 'edit')"
            @dragstart="onDragStart(entry.id)"
          >
            <NuxtLink :to="`/candidates/${entry.candidateId}`" class="text-sm font-medium text-primary hover:underline">
              {{ agency.candidateName(entry.candidateId) }}
            </NuxtLink>
            <p class="text-xs text-ink-faint">{{ agency.jobById[entry.jobId]?.title }}</p>
            <p class="mt-1 font-mono text-[11px] tabular text-ink">Match {{ entry.aiMatch.score }}</p>
          </li>
        </ul>
      </section>
    </div>
    <p v-if="!can('pipeline', 'edit')" class="text-xs text-ink-faint">View-only role — stage changes are disabled.</p>
  </div>
</template>
