<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  description?: string
}>()
</script>

<template>
  <div class="mb-5 flex flex-wrap items-start justify-between gap-3">
    <div>
      <p v-if="eyebrow" class="text-xs font-medium uppercase tracking-wide text-ink-faint">{{ eyebrow }}</p>
      <h1 class="font-mono text-xl font-semibold text-ink md:text-2xl">{{ title }}</h1>
      <p v-if="description" class="mt-1 max-w-2xl text-sm text-ink-muted">{{ description }}</p>
      <nav v-if="$slots.crumbs" class="mt-2 text-xs text-ink-faint" aria-label="Breadcrumb">
        <slot name="crumbs" />
      </nav>
    </div>
    <div v-if="$slots.actions" class="flex flex-wrap items-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>
