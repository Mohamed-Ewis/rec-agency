<script setup lang="ts">
const ui = useUiStore()
</script>

<template>
  <div class="pointer-events-none fixed bottom-4 right-4 z-[70] flex w-80 flex-col gap-2" aria-live="polite">
    <div
      v-for="toast in ui.toasts"
      :key="toast.id"
      class="pointer-events-auto rounded-lg border bg-white px-3 py-2.5 text-sm shadow-lg"
      :class="toast.tone === 'error' ? 'border-red-200 text-red-800' : toast.tone === 'info' ? 'border-primary-200 text-ink' : 'border-emerald-200 text-emerald-900'"
    >
      {{ toast.title }}
    </div>
  </div>
</template>
