// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2026-05-13',
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@pinia/nuxt',
    '@nuxt/image',
    '@nuxtjs/seo',
  ],

  components: [
    { path: '~/components/landing', pathPrefix: false },
    { path: '~/components/global',  pathPrefix: false },
    { path: '~/components/ui',      pathPrefix: false },
    '~/components'
  ],

  css: ['~/assets/css/main.css'],

  vite: {
    optimizeDeps: {
      include: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
    },
  },

  // Paksa dark mode di level HTML — tidak ada toggle
  app: {
    head: {
      htmlAttrs: { class: 'dark' },
      titleTemplate: '%s | Portfolio',
      viewport: 'width=device-width, initial-scale=1',
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  routeRules: {
    '/': { prerender: true },
    '/projects/**': { isr: 3600 },
    '/admin/**': { ssr: false },  // Admin = SPA murni (Firebase adalah client SDK)
  },

  runtimeConfig: {
    public: {
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY || '',
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID || '',
      firebaseMessagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
      firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID || '',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || '',
      siteName: process.env.NUXT_PUBLIC_SITE_NAME || '',
    },
  },
})
