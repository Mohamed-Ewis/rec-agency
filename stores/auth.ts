import { defineStore } from 'pinia'
import { credentials } from '~/data'
import type { PermissionKey, Role, User } from '~/types'
import { permissionsForRole } from '~/utils/permissions'

export const useAuthStore = defineStore('auth', () => {
  const sessionUserId = useCookie<string | null>('ra-session', {
    sameSite: 'lax',
    default: () => null
  })

  const currentUser = computed<User | null>(() => {
    if (!sessionUserId.value) return null
    const agency = useAgencyStore()
    const user = agency.users.find(item => item.id === sessionUserId.value)
    if (!user?.active) return null
    return user
  })

  const isAuthenticated = computed(() => currentUser.value !== null)
  const role = computed<Role | null>(() => currentUser.value?.role ?? null)
  const permissions = computed<PermissionKey[]>(() => {
    return currentUser.value ? permissionsForRole(currentUser.value.role) : []
  })

  function login(email: string, password: string) {
    const agency = useAgencyStore()
    const normalised = email.trim().toLowerCase()
    const match = credentials.find(item => item.email.toLowerCase() === normalised)
    if (!match || match.password !== password) {
      return { ok: false as const, error: 'Email or password is not recognised.' }
    }
    const user = agency.users.find(item => item.id === match.userId)
    if (!user?.active) {
      return { ok: false as const, error: 'This desk account is disabled.' }
    }
    sessionUserId.value = user.id
    return { ok: true as const, user }
  }

  function logout() {
    sessionUserId.value = null
  }

  return {
    sessionUserId,
    currentUser,
    isAuthenticated,
    role,
    permissions,
    login,
    logout
  }
})
