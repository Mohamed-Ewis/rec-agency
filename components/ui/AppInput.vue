<script setup lang="ts">
defineOptions({ inheritAttrs: false })

defineProps<{
  label?: string
  hint?: string
  error?: string
  type?: string
}>()

const model = defineModel<string>({ default: '' })
const id = useId()
</script>

<template>
  <label class="block" :for="id">
    <span v-if="label" class="mb-1 block text-sm font-medium text-ink">{{ label }}</span>
    <input
      :id="id"
      v-model="model"
      v-bind="$attrs"
      :type="type ?? 'text'"
      class="min-h-11 w-full rounded-md border bg-white px-3 text-sm text-slate-800 transition duration-200 placeholder:text-slate-400 focus:border-primary focus:shadow-[0_0_0_3px_#1E40AF20] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      :class="error ? 'border-red-400' : 'border-slate-200'"
      :aria-invalid="!!error"
    >
    <span v-if="error" class="mt-1 block text-xs text-red-700" role="alert">{{ error }}</span>
    <span v-else-if="hint" class="mt-1 block text-xs text-ink-faint">{{ hint }}</span>
  </label>
</template>
