const githubPages = process.env.GITHUB_PAGES === 'true'

export default defineNuxtConfig({
  compatibilityDate: '2025-09-13',
  devtools: { enabled: false },
  ssr: !githubPages,
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@vueuse/nuxt'],
  css: ['~/assets/css/main.css'],
  components: [{ path: '~/components', pathPrefix: false }],
  app: {
    head: {
      title: 'rec-agency',
      titleTemplate: '%s · rec-agency',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'rec-agency — technical recruitment operations' },
        { name: 'theme-color', content: '#1E40AF' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=Fira+Sans:wght@400;500;600;700&display=swap'
        }
      ]
    }
  },
  typescript: {
    strict: true,
    typeCheck: false
  },
  build: {
    transpile: ['lucide-vue-next']
  }
})
