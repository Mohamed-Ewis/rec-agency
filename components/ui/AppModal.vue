<script setup lang="ts">
const props = defineProps<{
  open: boolean
  title: string
  wide?: boolean
}>()
const emit = defineEmits<{ close: [] }>()

function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape') emit('close')
}

watch(() => props.open, (open) => {
  if (import.meta.client) {
    document.body.style.overflow = open ? 'hidden' : ''
    if (open) window.addEventListener('keydown', onKey)
    else window.removeEventListener('keydown', onKey)
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    document.body.style.overflow = ''
    window.removeEventListener('keydown', onKey)
  }
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button class="absolute inset-0 bg-slate-950/50 cursor-pointer" aria-label="Close dialog" @click="emit('close')" />
      <div
        role="dialog"
        aria-modal="true"
        :aria-label="title"
        class="relative max-h-[90vh] w-full overflow-auto rounded-xl bg-white p-6 shadow-xl"
        :class="wide ? 'max-w-2xl' : 'max-w-lg'"
      >
        <div class="mb-4 flex items-start justify-between gap-3">
          <h2 class="font-mono text-lg font-semibold text-ink">{{ title }}</h2>
          <button class="min-h-10 min-w-10 cursor-pointer rounded-md text-ink-muted hover:bg-slate-100" aria-label="Close" @click="emit('close')">×</button>
        </div>
        <slot />
      </div>
    </div>
  </Teleport>
</template>
