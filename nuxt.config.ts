// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    'radix-vue',
    'vuetify-nuxt-module'
  ],

  routeRules: {
    '/': { prerender: true }
  },
  app:{
    head:{
      title:"Nuxt Nav",
      link:[
        {
          rel:"icon",type:"image/x-icon",href:"favicon.ico"
        }
      ]
    }
  },

  compatibilityDate: '2024-08-29'
})
