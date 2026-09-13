<script setup lang="ts">
const props = defineProps<{
  label?: string
  hint?: string
  error?: string
  autocomplete?: string
}>()

const model = defineModel<string>({ default: '' })
const visible = ref(false)
const id = useId()
</script>

<template>
  <div>
    <label :for="id" class="mb-1 block text-sm font-medium text-ink">{{ label ?? 'Password' }}</label>
    <div class="relative">
      <input
        :id="id"
        v-model="model"
        :type="visible ? 'text' : 'password'"
        :autocomplete="autocomplete ?? 'current-password'"
        class="min-h-11 w-full rounded-md border bg-white px-3 pr-12 text-sm text-slate-800 transition duration-200 placeholder:text-slate-400 focus:border-primary focus:shadow-[0_0_0_3px_#1E40AF20] focus:outline-none"
        :class="error ? 'border-red-400' : 'border-slate-200'"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${id}-error` : undefined"
      >
      <button
        type="button"
        class="absolute inset-y-0 right-0 min-w-11 cursor-pointer text-xs font-medium text-primary hover:underline"
        :aria-label="visible ? 'Hide password' : 'Show password'"
        @click="visible = !visible"
      >
        {{ visible ? 'Hide' : 'Show' }}
      </button>
    </div>
    <p v-if="error" :id="`${id}-error`" class="mt-1 text-xs text-red-700" role="alert">{{ error }}</p>
    <p v-else-if="hint" class="mt-1 text-xs text-ink-faint">{{ hint }}</p>
  </div>
</template>
