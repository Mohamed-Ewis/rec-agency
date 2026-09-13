<script setup lang="ts">
withDefaults(defineProps<{ rows?: number; cards?: number }>(), { rows: 6, cards: 0 })
</script>

<template>
  <div class="space-y-3" aria-busy="true" aria-live="polite">
    <span class="sr-only">Loading</span>
    <div v-if="cards" class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <div v-for="n in cards" :key="n" class="h-20 animate-pulse rounded-lg bg-slate-200/80" />
    </div>
    <div class="overflow-hidden rounded-lg border border-slate-200">
      <div v-for="n in rows" :key="n" class="h-11 border-b border-slate-100 bg-slate-100/80 last:border-0">
        <div class="h-full w-2/3 animate-pulse bg-slate-200/70" />
      </div>
    </div>
  </div>
</template>
