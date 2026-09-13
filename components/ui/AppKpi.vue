<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  hint?: string
  tone?: 'default' | 'warn' | 'ok'
}>()
</script>

<template>
  <article class="rounded-lg border border-slate-200 bg-white px-3 py-3">
    <p class="text-xs font-medium uppercase tracking-wide text-ink-faint">{{ label }}</p>
    <p
      class="mt-1 font-mono text-2xl font-semibold tabular leading-none"
      :class="tone === 'warn' ? 'text-cta-700' : tone === 'ok' ? 'text-emerald-800' : 'text-ink'"
    >
      {{ value }}
    </p>
    <p v-if="hint" class="mt-1.5 text-xs text-ink-muted">{{ hint }}</p>
  </article>
</template>
