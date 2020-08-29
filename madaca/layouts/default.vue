<template>
  <v-app dark>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-btn v-if="isLogin" @click="logout">
        ログアウト
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer
      :fixed="fixed"
      app
    >
      <span>&copy; 2020 Landing Apps Inc.</span>
    </v-footer>
  </v-app>
</template>

<script>
import { auth } from '../plugins/firebase'

export default {
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'MADACA'
    }
  },
  computed: {
    isLogin () {
      return this.$store.getters.isLogin
    }
  },
  mounted () {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.$store.commit('setLogin', true)
      } else {
        this.$store.commit('setLogin', false)
      }
    })
  },
  methods: {
    logout () {
      auth.signOut()
    }
  }
}
</script>
