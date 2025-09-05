import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  pages: true,

  devtools: {
    enabled: true
  },

  modules: ['@nuxt/eslint', '@vueuse/nuxt'],

  css: ['~/assets/css/tailwind.css'],

  vite: {
    plugins: [tailwindcss()]
  },

  app: {
    rootId: 'app',
    pageTransition: {
      name: 'page',
      mode: 'out-in'
    },
    head: {
      titleTemplate: '%s | Privacy Off',
      htmlAttrs: {
        lang: 'pt'
      },
      meta: [
        { charset: 'utf-8' },
        {
          'http-equiv': 'Content-Language',
          content: 'pt'
        },
        {
          name: 'viewport',
          content: `width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no`
        },
        {
          name: 'format-detection',
          content: 'telephone=no'
        },
        {
          name: 'format-detection',
          content: 'address=no'
        },
        {
          name: 'referrer',
          content: 'origin'
        },
        {
          name: 'description',
          content: `Os packs e vídeos mais procurados da internet em um só portal. Conteúdos vazados, exclusivos e atualizados sempre.`
        },
        {
          property: 'og:site_name',
          content: 'Privacy Off'
        },
        {
          property: 'og:image',
          content: 'https://privacyoff.com/og-image.jpg'
        },
        {
          property: 'og:title',
          content: 'Privacy Off'
        },
        {
          property: 'og:description',
          content: `Os packs e vídeos mais procurados da internet em um só portal. Conteúdos vazados, exclusivos e atualizados sempre.`
        },
        {
          property: 'og:type',
          content: 'website'
        },
        {
          property: 'og:url',
          content: 'https://privacyoff.com/'
        },
        {
          property: 'og:updated_time',
          content: new Date().toISOString()
        }
      ],
      link: [
        { rel: 'dns-prefetch', href: 'https://privacyoff.com' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon-128.png' },
        { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' },
        { rel: 'shortcut icon', href: '/favicon.ico' }
      ]
    }
  }
})
