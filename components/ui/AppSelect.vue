<script setup lang="ts">
defineProps<{
  label?: string
  options: { value: string; label: string }[]
  disabled?: boolean
}>()

const model = defineModel<string>({ default: '' })
const id = useId()
</script>

<template>
  <label class="block" :for="id">
    <span v-if="label" class="mb-1 block text-sm font-medium text-ink">{{ label }}</span>
    <select
      :id="id"
      v-model="model"
      :disabled="disabled"
      class="min-h-11 w-full cursor-pointer rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 transition duration-200 focus:border-primary focus:shadow-[0_0_0_3px_#1E40AF20] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
    >
      <option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
    </select>
  </label>
</template>
