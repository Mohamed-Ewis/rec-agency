import type { PermissionActionName, PermissionResource } from './index'

declare module '#app' {
  interface PageMeta {
    title?: string
    public?: boolean
    resource?: PermissionResource
    action?: PermissionActionName
  }
}

export {}
