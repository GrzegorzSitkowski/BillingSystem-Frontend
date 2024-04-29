// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import colors from 'vuetify/util/colors'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    defaults: {
      global: {
      },
      VList: {
      },
    },
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          colors: {
            'brand': colors.blue.lighten3,
          }
        },
        dark :{
          colors: {
            'brand': colors.blue.darken3
          }
        }
      }
    }
  })
  app.vueApp.use(vuetify)
})