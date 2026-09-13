<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
  disabled?: boolean
  type?: 'button' | 'submit'
}>(), {
  variant: 'secondary',
  size: 'md',
  type: 'button'
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition duration-200 disabled:cursor-not-allowed disabled:opacity-50"
    :class="[
      size === 'sm' ? 'min-h-10 px-2.5 text-sm' : 'min-h-11 px-3.5 text-sm',
      variant === 'primary' && 'bg-cta text-white hover:bg-cta-600',
      variant === 'secondary' && 'border-2 border-primary bg-white text-primary hover:bg-primary-50',
      variant === 'ghost' && 'text-ink hover:bg-slate-100',
      variant === 'danger' && 'bg-red-700 text-white hover:bg-red-800',
      'cursor-pointer'
    ]"
  >
    <slot />
  </button>
</template>
