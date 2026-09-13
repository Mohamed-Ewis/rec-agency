<script setup lang="ts">
const error = useError()
const status = computed(() => error.value?.statusCode ?? 500)
</script>

<template>
  <div class="flex min-h-dvh items-center justify-center bg-canvas px-4">
    <div class="max-w-md">
      <p class="font-mono text-sm text-primary">{{ status }}</p>
      <h1 class="mt-1 font-mono text-2xl font-semibold text-ink">
        {{ status === 403 ? 'You do not have permission' : status === 404 ? 'This record is not on the desk' : 'Something broke' }}
      </h1>
      <p class="mt-2 text-sm text-ink-muted">
        {{ status === 403 ? 'This page is held by a permission your role does not include. Sign in with another desk account, or go back.' : status === 404 ? 'The job, candidate, or client link is stale. Go back to the list and pick a live record.' : 'Reload, or return to the desk. Mock data never left the browser.' }}
      </p>
      <NuxtLink to="/" class="mt-4 inline-flex min-h-10 items-center text-sm font-medium text-primary hover:underline">Back to desk</NuxtLink>
    </div>
  </div>
</template>
