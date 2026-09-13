<script setup lang="ts">
import { credentials, users } from '~/data'
import { ROLE_LABELS } from '~/utils/constants'

definePageMeta({
  layout: 'auth',
  public: true,
  title: 'Sign in'
})

const auth = useAuthStore()
const route = useRoute()
const email = ref('')
const password = ref('')
const emailError = ref('')
const passwordError = ref('')
const formError = ref('')
const submitting = ref(false)

const demos = computed(() =>
  credentials.map((item) => {
    const user = users.find(entry => entry.id === item.userId)
    return {
      email: item.email,
      password: item.password,
      name: user?.name ?? item.email,
      role: user ? ROLE_LABELS[user.role] : ''
    }
  })
)

function validate() {
  emailError.value = ''
  passwordError.value = ''
  formError.value = ''
  if (!email.value.trim()) emailError.value = 'Enter your desk email.'
  else if (!email.value.includes('@')) emailError.value = 'Enter a valid email address.'
  if (!password.value) passwordError.value = 'Enter your password.'
  return !emailError.value && !passwordError.value
}

function fill(demoEmail: string, demoPassword: string) {
  email.value = demoEmail
  password.value = demoPassword
  emailError.value = ''
  passwordError.value = ''
  formError.value = ''
}

async function submit() {
  if (!validate() || submitting.value) return
  submitting.value = true
  await new Promise(resolve => setTimeout(resolve, 220))
  const result = auth.login(email.value, password.value)
  submitting.value = false
  if (!result.ok) {
    formError.value = result.error
    return
  }
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
  await navigateTo(redirect.startsWith('/') ? redirect : '/')
}
</script>

<template>
  <div class="w-full max-w-md">
    <div class="mb-6 flex items-center gap-3">
      <span class="flex h-10 w-10 items-center justify-center rounded-md bg-primary font-mono text-sm font-bold text-white">RA</span>
      <div>
        <p class="font-mono text-lg font-semibold text-ink">Rec Agency</p>
        <p class="text-xs text-ink-faint">Find talent, send jobs, collect the fee</p>
      </div>
    </div>

    <AppCard>
      <h1 class="font-mono text-xl font-semibold text-ink">Sign in</h1>
      <p class="mt-1 text-sm text-ink-muted">Your role — and every screen you can open — comes from the permissions on that account.</p>

      <form class="mt-5 space-y-4" @submit.prevent="submit">
        <p v-if="formError" class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">{{ formError }}</p>
        <AppInput
          v-model="email"
          label="Email"
          type="email"
          autocomplete="username"
          :error="emailError"
          @blur="email && !email.includes('@') ? emailError = 'Enter a valid email address.' : emailError = email ? '' : emailError"
        />
        <AppPasswordField v-model="password" label="Password" :error="passwordError" />
        <AppButton type="submit" variant="primary" class="w-full" :disabled="submitting">
          {{ submitting ? 'Checking…' : 'Sign in' }}
        </AppButton>
      </form>
    </AppCard>

    <AppCard class="mt-4" flush>
      <template #header>
        <div>
          <h2 class="text-sm font-semibold text-ink">Demo desk accounts</h2>
          <p class="text-xs text-ink-faint">Mock only. Click a row to fill the form.</p>
        </div>
      </template>
      <ul>
        <li v-for="demo in demos" :key="demo.email" class="border-b border-slate-100 last:border-0">
          <button
            type="button"
            class="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-left hover:bg-primary-50/70"
            @click="fill(demo.email, demo.password)"
          >
            <span>
              <span class="block text-sm font-medium text-ink">{{ demo.name }}</span>
              <span class="block font-mono text-xs text-ink-faint">{{ demo.email }}</span>
            </span>
            <AppBadge tone="blue" :label="demo.role" />
          </button>
        </li>
      </ul>
    </AppCard>
  </div>
</template>
