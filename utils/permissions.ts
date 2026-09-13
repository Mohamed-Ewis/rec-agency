import type { PermissionActionName, PermissionKey, PermissionResource, Role } from '~/types'

export const ROLE_GRANTS: Record<Role, Record<PermissionResource, PermissionActionName[]>> = {
  admin: {
    jobs: ['view', 'create', 'edit', 'delete', 'manage'],
    candidates: ['view', 'create', 'edit', 'delete', 'manage'],
    clients: ['view', 'create', 'edit', 'delete', 'manage'],
    pipeline: ['view', 'create', 'edit', 'manage'],
    interviews: ['view', 'create', 'edit', 'manage'],
    activities: ['view', 'create', 'edit'],
    tasks: ['view', 'create', 'edit', 'delete'],
    reports: ['view', 'manage'],
    users: ['view', 'create', 'edit', 'delete', 'manage'],
    settings: ['view', 'edit', 'manage'],
    sourcing: ['view', 'create', 'edit', 'manage'],
    opportunities: ['view', 'create', 'edit', 'manage'],
    placements: ['view', 'create', 'edit', 'manage']
  },
  manager: {
    jobs: ['view', 'edit'],
    candidates: ['view', 'edit'],
    clients: ['view', 'edit'],
    pipeline: ['view', 'edit'],
    interviews: ['view', 'edit'],
    activities: ['view', 'create'],
    tasks: ['view', 'create', 'edit'],
    reports: ['view', 'manage'],
    users: [],
    settings: ['view'],
    sourcing: ['view', 'edit'],
    opportunities: ['view', 'edit'],
    placements: ['view', 'edit', 'manage']
  },
  recruiter: {
    jobs: ['view', 'create', 'edit'],
    candidates: ['view', 'create', 'edit'],
    clients: ['view', 'create', 'edit'],
    pipeline: ['view', 'create', 'edit'],
    interviews: ['view', 'create', 'edit'],
    activities: ['view', 'create'],
    tasks: ['view', 'create', 'edit'],
    reports: ['view'],
    users: [],
    settings: ['view'],
    sourcing: ['view', 'create', 'edit'],
    opportunities: ['view', 'create', 'edit'],
    placements: ['view']
  },
  viewer: {
    jobs: ['view'],
    candidates: ['view'],
    clients: ['view'],
    pipeline: ['view'],
    interviews: ['view'],
    activities: ['view'],
    tasks: ['view'],
    reports: [],
    users: [],
    settings: ['view'],
    sourcing: ['view'],
    opportunities: ['view'],
    placements: ['view']
  }
}

export function permissionsForRole(role: Role): PermissionKey[] {
  const grants = ROLE_GRANTS[role]
  const keys: PermissionKey[] = []
  for (const resource of Object.keys(grants) as PermissionResource[]) {
    for (const action of grants[resource]) {
      keys.push(`${resource}:${action}`)
    }
  }
  return keys
}

export function hasPermission(permissions: PermissionKey[], resource: PermissionResource, action: PermissionActionName) {
  return permissions.includes(`${resource}:${action}`)
}
