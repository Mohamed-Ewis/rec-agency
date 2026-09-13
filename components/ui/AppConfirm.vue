<script setup lang="ts">
const ui = useUiStore()
</script>

<template>
  <AppModal :open="ui.confirm.open" :title="ui.confirm.title" @close="ui.closeConfirm(false)">
    <p class="text-sm text-ink-muted">{{ ui.confirm.body }}</p>
    <div class="mt-5 flex justify-end gap-2">
      <AppButton variant="ghost" @click="ui.closeConfirm(false)">Cancel</AppButton>
      <AppButton :variant="ui.confirm.tone === 'danger' ? 'danger' : 'primary'" @click="ui.closeConfirm(true)">
        {{ ui.confirm.confirmLabel }}
      </AppButton>
    </div>
  </AppModal>
</template>
