<script setup lang="ts">
defineProps<{
  title: string
  body: string
}>()
</script>

<template>
  <div class="flex flex-col items-start gap-2 px-4 py-10">
    <p class="text-sm font-semibold text-ink">{{ title }}</p>
    <p class="max-w-md text-sm text-ink-muted">{{ body }}</p>
    <div v-if="$slots.action" class="mt-2">
      <slot name="action" />
    </div>
  </div>
</template>
