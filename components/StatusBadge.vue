<script setup lang="ts">
const props = defineProps<{ value: string }>()

const tone = computed(() => {
  const value = props.value
  if (['open', 'hired', 'paid', 'done', 'completed', 'active', 'cleared', 'replied'].includes(value)) return 'green'
  if (['urgent', 'overdue', 'cancelled', 'no_show', 'closed', 'rejected', 'declined', 'replaced'].includes(value)) return 'red'
  if (['paused', 'offer', 'outstanding', 'draft', 'drafted', 'in_progress', 'scheduled', 'guarantee'].includes(value)) return 'amber'
  if (['filled', 'submitted', 'qualified', 'interview', 'sent'].includes(value)) return 'blue'
  return 'neutral'
})

const label = computed(() => props.value.replaceAll('_', ' '))
</script>

<template>
  <AppBadge :tone="tone" :label="label" />
</template>
