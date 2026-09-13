import type { PermissionActionName, PermissionResource } from '~/types'
import { hasPermission } from '~/utils/permissions'

export function usePermissions() {
  const auth = useAuthStore()

  function can(resource: PermissionResource, action: PermissionActionName = 'view') {
    return hasPermission(auth.permissions, resource, action)
  }

  const canWrite = computed(() => can('jobs', 'edit') || can('candidates', 'edit') || can('tasks', 'edit'))

  return {
    can,
    canWrite,
    role: computed(() => auth.role),
    user: computed(() => auth.currentUser),
    permissions: computed(() => auth.permissions)
  }
}
