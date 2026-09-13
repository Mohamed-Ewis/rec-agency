<script setup lang="ts">
const props = withDefaults(defineProps<{
  name: string
  hue?: number
  size?: 'sm' | 'md' | 'lg'
}>(), { hue: 210, size: 'md' })

const fmt = useFormat()
const sizeClass = computed(() => ({
  sm: 'h-7 w-7 text-[10px]',
  md: 'h-8 w-8 text-xs',
  lg: 'h-11 w-11 text-sm'
}[props.size]))
</script>

<template>
  <span
    class="inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
    :class="sizeClass"
    :style="{ backgroundColor: `hsl(${hue} 42% 38%)` }"
    :aria-hidden="true"
  >
    {{ fmt.initials(name) }}
  </span>
</template>
