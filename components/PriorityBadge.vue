<script setup lang="ts">
defineProps<{ value: string }>()
</script>

<template>
  <AppBadge
    :tone="value === 'urgent' ? 'red' : value === 'high' ? 'amber' : value === 'medium' ? 'blue' : 'neutral'"
    :label="value"
  />
</template>
