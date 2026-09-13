<script setup lang="ts">
defineProps<{
  name: string
  disabled?: boolean
  ariaLabel?: string
}>()

const model = defineModel<string>({ default: 'active' })
const groupId = useId()

const options = [
  { value: 'active', label: 'Active' },
  { value: 'disabled', label: 'Off' }
] as const
</script>

<template>
  <fieldset
    class="m-0 inline-flex rounded-full border p-0.5"
    :class="disabled ? 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-60' : model === 'active' ? 'border-emerald-200 bg-emerald-50/70' : 'border-slate-300 bg-slate-100'"
    :aria-label="ariaLabel ?? 'Account status'"
    :disabled="disabled"
  >
    <legend class="sr-only">{{ ariaLabel ?? 'Account status' }}</legend>
    <label
      v-for="option in options"
      :key="option.value"
      class="relative flex min-h-8 min-w-[4.25rem] cursor-pointer items-center justify-center gap-1.5 rounded-full px-2.5 text-xs font-medium transition duration-200"
      :class="[
        disabled && 'cursor-not-allowed',
        model === option.value && option.value === 'active' && 'bg-emerald-700 text-white shadow-sm',
        model === option.value && option.value === 'disabled' && 'bg-slate-700 text-white shadow-sm',
        model !== option.value && 'text-ink-muted hover:text-ink'
      ]"
    >
      <input
        :id="`${groupId}-${option.value}`"
        v-model="model"
        type="radio"
        :name="name"
        :value="option.value"
        :disabled="disabled"
        class="peer sr-only"
      >
      <span
        class="flex h-2.5 w-2.5 items-center justify-center rounded-full border"
        :class="model === option.value ? 'border-white/80 bg-white' : 'border-current'"
        aria-hidden="true"
      >
        <span
          class="h-1.5 w-1.5 rounded-full transition duration-200"
          :class="model === option.value ? (option.value === 'active' ? 'bg-emerald-700' : 'bg-slate-700') : 'bg-transparent'"
        />
      </span>
      {{ option.label }}
    </label>
  </fieldset>
</template>
