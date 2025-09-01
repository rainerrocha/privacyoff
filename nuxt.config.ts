// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  pages: true,

  devtools: {
    enabled: true
  },

  modules: ['@nuxtjs/tailwindcss', '@nuxt/eslint', '@nuxt/image', '@vueuse/nuxt'],

  css: ['~/assets/css/tailwind.css']
})
