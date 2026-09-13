<script setup lang="ts">
import { ROLE_LABELS } from '~/utils/constants'

definePageMeta({
  title: 'Settings',
  resource: 'settings',
  action: 'view'
})

const { can, user, permissions } = usePermissions()
const auth = useAuthStore()
const ui = useUiStore()
const workspace = ref('Rec Agency')
const timezone = ref('Europe/London')
const canEdit = computed(() => can('settings', 'edit'))

function save() {
  if (!canEdit.value) {
    ui.toast('You do not have permission to change settings', 'error')
    return
  }
  ui.toast('Workspace settings saved (mock)')
}

async function signOut() {
  auth.logout()
  await navigateTo('/login')
}
</script>

<template>
  <div>
    <PageHeader eyebrow="Admin" title="Settings" description="Workspace defaults and the permissions attached to your signed-in account." />
    <div class="grid gap-4 lg:grid-cols-2">
      <AppCard>
        <template #header><h2 class="text-sm font-semibold text-ink">Workspace</h2></template>
        <div class="space-y-3">
          <AppInput
            v-model="workspace"
            label="Name"
            :hint="canEdit ? 'Shown in the sidebar' : 'Read only — your account cannot edit settings'"
            :disabled="!canEdit"
          />
          <AppSelect
            v-model="timezone"
            label="Timezone"
            :disabled="!canEdit"
            :options="[
              { value: 'Europe/London', label: 'Europe/London' },
              { value: 'Europe/Dublin', label: 'Europe/Dublin' }
            ]"
          />
          <AppButton v-if="canEdit" variant="primary" @click="save">Save</AppButton>
        </div>
      </AppCard>
      <AppCard>
        <template #header><h2 class="text-sm font-semibold text-ink">Signed in</h2></template>
        <template v-if="user">
          <p class="text-sm font-medium text-ink">{{ user.name }}</p>
          <p class="text-sm text-ink-muted">{{ user.email }} · {{ ROLE_LABELS[user.role] }}</p>
          <p class="mt-3 text-xs font-medium uppercase tracking-wide text-ink-faint">Permissions on this role</p>
          <div class="mt-2 flex flex-wrap gap-1">
            <AppBadge v-for="key in permissions" :key="key" :label="key" />
          </div>
          <div class="mt-4">
            <AppButton variant="danger" @click="signOut">Sign out</AppButton>
          </div>
        </template>
      </AppCard>
    </div>
  </div>
</template>
