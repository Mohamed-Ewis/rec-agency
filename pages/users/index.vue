<script setup lang="ts">
import type { Role, User } from '~/types'
import { permissionsForRole } from '~/utils/permissions'
import { ROLE_LABELS } from '~/utils/constants'

definePageMeta({
  title: 'Users',
  resource: 'users',
  action: 'view'
})

const agency = useAgencyStore()
const auth = useAuthStore()
const ui = useUiStore()
const { can } = usePermissions()

const canManage = computed(() => can('users', 'edit'))

const roleOptions = (Object.keys(ROLE_LABELS) as Role[]).map(role => ({
  value: role,
  label: ROLE_LABELS[role]
}))

function isLastAdmin(user: User) {
  return user.role === 'admin' && user.active && agency.activeAdmins.length <= 1
}

async function onRole(user: User, next: string) {
  const result = agency.updateUserRole(user.id, next as Role, auth.currentUser?.id ?? user.id)
  if (!result.ok) {
    ui.toast(result.error ?? 'Could not change role', 'error')
    return
  }
  ui.toast(`${user.name} is now ${ROLE_LABELS[next as Role]}`)
}

async function onStatus(user: User, next: string) {
  const active = next === 'active'
  if (!active) {
    const ok = await ui.ask({
      title: `Disable ${user.name}?`,
      body: 'They will not be able to sign in until you activate them again.',
      confirmLabel: 'Disable account',
      tone: 'danger'
    })
    if (!ok) return
  }
  const result = agency.setUserActive(user.id, active, auth.currentUser?.id ?? user.id)
  if (!result.ok) {
    ui.toast(result.error ?? 'Could not update account', 'error')
    return
  }
  ui.toast(active ? `${user.name} is active` : `${user.name} is disabled`)
  if (!active && user.id === auth.currentUser?.id) {
    auth.logout()
    await navigateTo('/login')
  }
}
</script>

<template>
  <div>
    <PageHeader
      eyebrow="Admin"
      title="Users & roles"
      description="Change a role to move its permission set. Disable an account to block sign-in."
    />
    <AppCard flush>
      <div class="overflow-x-auto">
        <table class="min-w-[880px] w-full text-left text-sm">
          <thead class="border-b border-slate-200 bg-slate-50 text-xs uppercase text-ink-faint">
            <tr>
              <th class="px-4 py-2 font-medium">User</th>
              <th class="px-4 py-2 font-medium">Role</th>
              <th class="px-4 py-2 font-medium">Permissions</th>
              <th class="px-4 py-2 font-medium">Title</th>
              <th class="px-4 py-2 font-medium">Email</th>
              <th class="px-4 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in agency.users" :key="user.id" class="border-b border-slate-100 align-top">
              <td class="px-4 py-2.5">
                <div class="flex items-center gap-2">
                  <AppAvatar :name="user.name" :hue="user.avatarHue" />
                  <div>
                    <p class="font-medium text-ink">{{ user.name }}</p>
                    <p v-if="user.id === auth.currentUser?.id" class="text-xs text-ink-faint">You</p>
                  </div>
                </div>
              </td>
              <td class="w-44 px-4 py-2">
                <AppSelect
                  v-if="canManage"
                  :model-value="user.role"
                  :options="roleOptions"
                  :disabled="isLastAdmin(user)"
                  :aria-label="`Role for ${user.name}`"
                  @update:model-value="onRole(user, $event)"
                />
                <AppBadge v-else tone="blue" :label="ROLE_LABELS[user.role]" />
                <p v-if="canManage && isLastAdmin(user)" class="mt-1 text-[11px] text-ink-faint">Last active admin</p>
              </td>
              <td class="px-4 py-3 font-mono text-xs tabular text-ink-muted">{{ permissionsForRole(user.role).length }}</td>
              <td class="px-4 py-3 text-ink-muted">{{ user.title }}</td>
              <td class="px-4 py-3 text-ink-muted">{{ user.email }}</td>
              <td class="px-4 py-2.5">
                <AppStatusRadio
                  v-if="canManage"
                  :name="`status-${user.id}`"
                  :model-value="user.active ? 'active' : 'disabled'"
                  :disabled="isLastAdmin(user)"
                  :aria-label="`Activation for ${user.name}`"
                  @update:model-value="onStatus(user, $event)"
                />
                <StatusBadge v-else :value="user.active ? 'active' : 'disabled'" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </AppCard>
  </div>
</template>
