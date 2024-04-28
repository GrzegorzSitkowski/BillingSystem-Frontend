import vuetify, {transformAssetUrls} from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  devtools: {enabled: false},
  ssr: false,
  build: {
    transpile: ['vuetify'],
  },

  imports:{
    dirs: ['stores'],
  },

  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        config.plugins?.push(vuetify({autoImport: true}))
      })
    },
    '@pinia/nuxt',
    '@ueuse/nuxt'
  ],
  vite:{
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  }
})