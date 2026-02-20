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
  defaults: {
    VBtn: {
      color: 'primary',
      size: 'large',
      elevation: 0,
      variant: 'elevated',
      rounded: 'lg',
      class: 'font-weight-bold text-body-1',
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          background: '#F7F4EB',
          surface: '#F7F4EB',
          'surface-variant': '#EBE5D5',
          primary: '#4E342E',
          secondary: '#795548',
          accent: '#558B2F',
          error: '#BA1A1A',
          info: '#4E342E',
          success: '#558B2F',
          warning: '#795548',
          card: '#FFFFFF',
          'badge-optional': '#795548',
          'badge-shared': '#558B2F',
        },
      },
    },
  },
})