<script setup lang="ts">
definePageMeta({ title: 'Tasks', resource: 'tasks', action: 'view' })

const agency = useAgencyStore()
const auth = useAuthStore()
const { can } = usePermissions()
const ui = useUiStore()
const fmt = useFormat()
const ready = usePageReady()
const status = ref('openish')
const owner = ref('all')
const createOpen = ref(false)
const title = ref('')
const dueAt = ref('2026-09-20')
const priority = ref('medium')

const filtered = computed(() =>
  agency.tasks.filter((task) => {
    if (owner.value !== 'all' && task.ownerId !== owner.value) return false
    if (status.value === 'openish') return task.status === 'open' || task.status === 'in_progress'
    if (status.value !== 'all' && task.status !== status.value) return false
    return true
  }).sort((a, b) => a.dueAt.localeCompare(b.dueAt))
)

function complete(id: string) {
  if (!can('tasks', 'edit')) return
  agency.updateTask(id, { status: 'done' })
  ui.toast('Task marked done')
}

function createTask() {
  if (!title.value.trim()) return
  agency.addTask({
    title: title.value.trim(),
    dueAt: dueAt.value,
    priority: priority.value as 'low' | 'medium' | 'high',
    status: 'open',
    ownerId: auth.currentUser.id
  })
  title.value = ''
  createOpen.value = false
  ui.toast('Task added')
}
</script>

<template>
  <div>
    <PageHeader eyebrow="Schedule" title="Tasks" description="Due dates, owners, and the related brief — nothing more.">
      <template #actions>
        <AppButton v-if="can('tasks', 'create')" variant="primary" @click="createOpen = true">New task</AppButton>
      </template>
    </PageHeader>
    <div class="mb-4 grid gap-3 md:grid-cols-2">
      <AppSelect
        v-model="status"
        label="Status"
        :options="[
          { value: 'openish', label: 'Open + in progress' },
          { value: 'all', label: 'All' },
          { value: 'done', label: 'Done' }
        ]"
      />
      <AppSelect
        v-model="owner"
        label="Owner"
        :options="[{ value: 'all', label: 'All owners' }, ...agency.users.map(user => ({ value: user.id, label: user.name }))]"
      />
    </div>
    <AppSkeleton v-if="!ready" :rows="8" />
    <AppCard v-else flush>
      <div class="overflow-x-auto">
        <table class="min-w-[820px] w-full text-left text-sm">
          <thead class="border-b border-slate-200 bg-slate-50 text-xs uppercase text-ink-faint">
            <tr>
              <th class="px-4 py-2 font-medium">Task</th>
              <th class="px-4 py-2 font-medium">Due</th>
              <th class="px-4 py-2 font-medium">Priority</th>
              <th class="px-4 py-2 font-medium">Related</th>
              <th class="px-4 py-2 font-medium">Owner</th>
              <th class="px-4 py-2 font-medium">Status</th>
              <th class="px-4 py-2 font-medium" />
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in filtered" :key="task.id" class="border-b border-slate-100 hover:bg-primary-50/60">
              <td class="px-4 py-2.5 font-medium text-ink">{{ task.title }}</td>
              <td class="px-4 py-2.5 font-mono text-xs tabular" :class="task.dueAt <= '2026-09-13' && task.status !== 'done' && 'text-red-800'">{{ fmt.date(task.dueAt) }}</td>
              <td class="px-4 py-2.5"><PriorityBadge :value="task.priority" /></td>
              <td class="px-4 py-2.5 text-xs text-ink-muted">
                <NuxtLink v-if="task.candidateId" :to="`/candidates/${task.candidateId}`" class="text-primary hover:underline">{{ agency.candidateName(task.candidateId) }}</NuxtLink>
                <span v-if="task.jobId"> · <NuxtLink :to="`/jobs/${task.jobId}`" class="hover:underline">{{ agency.jobById[task.jobId]?.title }}</NuxtLink></span>
              </td>
              <td class="px-4 py-2.5 text-ink-muted">{{ agency.userName(task.ownerId) }}</td>
              <td class="px-4 py-2.5"><StatusBadge :value="task.status" /></td>
              <td class="px-4 py-2.5">
                <button v-if="can('tasks', 'edit') && task.status !== 'done'" class="cursor-pointer text-xs text-primary hover:underline" @click="complete(task.id)">Done</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <AppEmpty v-if="!filtered.length" title="No tasks in this view" body="Switch to All, or create one if you can edit." />
    </AppCard>

    <AppModal :open="createOpen" title="New task" @close="createOpen = false">
      <div class="space-y-3">
        <AppInput v-model="title" label="Title" />
        <AppInput v-model="dueAt" label="Due date" hint="YYYY-MM-DD" />
        <AppSelect v-model="priority" label="Priority" :options="[{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }]" />
      </div>
      <div class="mt-5 flex justify-end gap-2">
        <AppButton variant="ghost" @click="createOpen = false">Cancel</AppButton>
        <AppButton variant="primary" @click="createTask">Create</AppButton>
      </div>
    </AppModal>
  </div>
</template>
