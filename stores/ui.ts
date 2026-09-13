import { defineStore } from 'pinia'

export interface ToastItem {
  id: string
  title: string
  tone: 'success' | 'error' | 'info'
}

export interface ConfirmState {
  open: boolean
  title: string
  body: string
  confirmLabel: string
  tone: 'danger' | 'default'
  resolve?: (ok: boolean) => void
}

export const useUiStore = defineStore('ui', () => {
  const sidebarOpen = useState('ui-sidebar', () => false)
  const sidebarCollapsed = useState('ui-sidebar-collapsed', () => false)
  const searchOpen = useState('ui-search', () => false)
  const toasts = useState<ToastItem[]>('ui-toasts', () => [])
  const confirm = useState<ConfirmState>('ui-confirm', () => ({
    open: false,
    title: '',
    body: '',
    confirmLabel: 'Confirm',
    tone: 'default'
  }))

  function toast(title: string, tone: ToastItem['tone'] = 'success') {
    const id = `t_${Date.now()}_${Math.random().toString(16).slice(2)}`
    toasts.value = [...toasts.value, { id, title, tone }]
    setTimeout(() => {
      toasts.value = toasts.value.filter(item => item.id !== id)
    }, 4000)
  }

  function ask(options: { title: string; body: string; confirmLabel?: string; tone?: 'danger' | 'default' }) {
    return new Promise<boolean>((resolve) => {
      confirm.value = {
        open: true,
        title: options.title,
        body: options.body,
        confirmLabel: options.confirmLabel ?? 'Confirm',
        tone: options.tone ?? 'default',
        resolve
      }
    })
  }

  function closeConfirm(ok: boolean) {
    confirm.value.resolve?.(ok)
    confirm.value = { ...confirm.value, open: false, resolve: undefined }
  }

  return {
    sidebarOpen,
    sidebarCollapsed,
    searchOpen,
    toasts,
    confirm,
    toast,
    ask,
    closeConfirm
  }
})
