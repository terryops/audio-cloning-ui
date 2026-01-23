export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ['@nuxt/ui'],

  ui: {
    icons: ['lucide']
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Reddit+Sans:wght@400;500;600;700&display=swap'
        }
      ]
    }
  },

  compatibilityDate: '2024-11-01'
})
