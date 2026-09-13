<script setup lang="ts">
const props = defineProps<{
  tone?: 'neutral' | 'blue' | 'amber' | 'green' | 'red' | 'slate'
  label: string
}>()

const classes: Record<NonNullable<typeof props.tone>, string> = {
  neutral: 'bg-slate-100 text-slate-700',
  blue: 'bg-primary-50 text-primary-800',
  amber: 'bg-cta-50 text-cta-700',
  green: 'bg-emerald-50 text-emerald-800',
  red: 'bg-red-50 text-red-800',
  slate: 'bg-slate-200 text-slate-800'
}
</script>

<template>
  <span class="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium capitalize" :class="classes[tone ?? 'neutral']">
    {{ label }}
  </span>
</template>
