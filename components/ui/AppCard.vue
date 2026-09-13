<script setup lang="ts">
defineProps<{
  padded?: boolean
  flush?: boolean
}>()
</script>

<template>
  <section class="rounded-lg border border-slate-200 bg-white shadow-sm">
    <header v-if="$slots.header" class="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
      <slot name="header" />
    </header>
    <div :class="flush ? '' : (padded === false ? 'px-4 py-3' : 'p-4')">
      <slot />
    </div>
  </section>
</template>
