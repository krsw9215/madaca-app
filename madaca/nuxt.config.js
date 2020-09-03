import colors from 'vuetify/es5/util/colors'
import path from 'path'
import fs from 'fs'

export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0"' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      { src: 'https://aframe.io/releases/1.0.4/aframe.min.js' },
      { src: 'https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar-nft.js' }
    ]
  },
  server: {
    port: 8000, 
    host: '0.0.0.0',
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'cert/localhost.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert/localhost.crt'))
    }
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/firebase',
  ],

  router: {
    middleware: ['auth']
  },
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/vuetify',
    '@nuxt/typescript-build'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    ['cookie-universal-nuxt', { alias: 'cookiz', parseJSON: false }],
    '@nuxtjs/axios'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
   vuetify: {
    customVariables: ['~/assets/variables.scss'],
    options: {
      customProperties: true
    },
    dark: false,
    theme: {
      themes: {
        light: {
          background: '#eeeef0'
        }
      }
    }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
