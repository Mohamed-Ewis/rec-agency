<script setup lang="ts">
const props = defineProps<{
  title: string
  summary: string
  items: { label: string; value: number; hint?: string }[]
  color?: string
}>()

const max = computed(() => Math.max(...props.items.map(item => item.value), 1))
</script>

<template>
  <figure>
    <figcaption class="sr-only">{{ summary }}</figcaption>
    <p class="mb-3 text-sm font-semibold text-ink">{{ title }}</p>
    <ul class="space-y-2.5" :aria-label="title">
      <li v-for="item in items" :key="item.label" class="grid grid-cols-[7rem_1fr_2.5rem] items-center gap-2">
        <span class="truncate text-xs text-ink-muted">{{ item.label }}</span>
        <div class="h-2.5 overflow-hidden rounded bg-slate-100" :title="item.hint ?? String(item.value)">
          <div
            class="h-full rounded transition-all duration-200"
            :style="{ width: `${(item.value / max) * 100}%`, background: color ?? '#1E40AF' }"
          />
        </div>
        <span class="text-right font-mono text-xs tabular text-ink">{{ item.value }}</span>
      </li>
    </ul>
  </figure>
</template>
