import { hasPermission } from '~/utils/permissions'

export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.prerender) return

  const auth = useAuthStore()

  if (to.meta.public) {
    if (auth.isAuthenticated && to.path === '/login') {
      return navigateTo('/')
    }
    return
  }

  if (!auth.isAuthenticated) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }

  const resource = to.meta.resource
  const action = to.meta.action ?? 'view'
  if (resource && !hasPermission(auth.permissions, resource, action)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'You do not have permission for this page',
      fatal: true
    })
  }
})
