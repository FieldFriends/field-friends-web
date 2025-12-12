/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          'badge-required': '#e07b8cff',
          'badge-optional': '#7c8ea3ff',
          'badge-shared': '#1bc236ff',
          'primary': '#ff5f05',
          'secondary': '#2f115fff',
          'tertiary': '#ffbeacff',
        },
      },
    },
  },
})