<script setup lang="ts">
defineProps<{
  page: number
  pageCount: number
  total: number
}>()
const emit = defineEmits<{ 'update:page': [value: number] }>()
</script>

<template>
  <div class="flex items-center justify-between gap-3 px-1 py-3 text-sm text-ink-muted">
    <p>{{ total }} results</p>
    <div class="flex items-center gap-2">
      <AppButton size="sm" variant="ghost" :disabled="page <= 1" @click="emit('update:page', page - 1)">Previous</AppButton>
      <span class="font-mono text-ink">{{ page }} / {{ pageCount }}</span>
      <AppButton size="sm" variant="ghost" :disabled="page >= pageCount" @click="emit('update:page', page + 1)">Next</AppButton>
    </div>
  </div>
</template>
