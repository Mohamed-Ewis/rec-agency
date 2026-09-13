<script setup lang="ts">
const props = defineProps<{
  items: { label: string; value: number }[]
}>()

const max = computed(() => Math.max(...props.items.map(item => item.value), 1))
</script>

<template>
  <ol class="space-y-2" aria-label="Pipeline conversion">
    <li v-for="(item, index) in items" :key="item.label">
      <div class="mb-1 flex items-center justify-between text-xs">
        <span class="text-ink-muted">{{ item.label }}</span>
        <span class="font-mono tabular text-ink">
          {{ item.value }}
          <span v-if="index > 0 && items[index - 1].value" class="text-ink-faint">
            · {{ Math.round((item.value / items[index - 1].value) * 100) }}%
          </span>
        </span>
      </div>
      <div class="h-2 overflow-hidden rounded bg-slate-100">
        <div
          class="h-full rounded bg-primary transition-all duration-200"
          :style="{ width: `${Math.max(8, (item.value / max) * 100)}%`, opacity: 1 - index * 0.07 }"
        />
      </div>
    </li>
  </ol>
</template>
