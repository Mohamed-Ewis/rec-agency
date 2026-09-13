<script setup lang="ts">
const props = defineProps<{
  open: boolean
  title: string
}>()
const emit = defineEmits<{ close: [] }>()

function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape') emit('close')
}

watch(() => props.open, (open) => {
  if (!import.meta.client) return
  document.body.style.overflow = open ? 'hidden' : ''
  if (open) window.addEventListener('keydown', onKey)
  else window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-[55]">
      <button class="absolute inset-0 bg-slate-950/40 cursor-pointer" aria-label="Close panel" @click="emit('close')" />
      <aside class="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col border-l border-slate-200 bg-white shadow-xl">
        <header class="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-3">
          <h2 class="font-mono text-base font-semibold text-ink">{{ title }}</h2>
          <button class="min-h-10 min-w-10 cursor-pointer rounded-md text-ink-muted hover:bg-slate-100" aria-label="Close" @click="emit('close')">×</button>
        </header>
        <div class="flex-1 overflow-auto p-5">
          <slot />
        </div>
        <footer v-if="$slots.footer" class="border-t border-slate-200 px-5 py-3">
          <slot name="footer" />
        </footer>
      </aside>
    </div>
  </Teleport>
</template>
