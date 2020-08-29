<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-flex
      xs12
      sm8
      md6
    >
      <div class="text-center">
        <p> </p>
        <H2>MADACA ログイン</H2>
        <p> </p>
      </div>
      <div class="text-center">
        <p>
          <v-btn x-large @click="loginByGoogle">
            <v-icon>{{ mdiGoogle }}</v-icon>Googleアカウントで参加
          </v-btn>
        </p>
      </div>
      <div class="text-center">
        <p>
          <v-btn :disabled="emailSent" clas="ma-2" x-large @click="loginByEmailLink">
            <v-icon>{{ mdiEmail }}</v-icon>メールアドレスで参加
          </v-btn>
        </p>
      </div>
      <v-overlay :value="isLoading">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
      <v-snackbar v-model="emailSent" color="success" top>メールを送信しました。受信したメールのリンクからログインしてください。</v-snackbar>
    </v-flex>
  </v-layout>
</template>

<script>
import { mdiGoogle, mdiEmail } from '@mdi/js'
import firebase from 'firebase/app'
import 'firebase/auth'
import { auth } from '../plugins/firebase'

export default {
  name: 'login',
  data () {
    return {
      mdiGoogle,
      mdiEmail,
      emailSent: false,
      isLoading: false
    }
  },
  mounted () {
    this.isLoading = true

    if (auth.isSignInWithEmailLink(window.location.href)) {
      const email = this.$cookiz.get('email')
      if (email) {
        auth.signInWithEmailLink(email, window.location.href)
        this.$cookiz.set('email', null)
      }
    }

    auth.onAuthStateChanged((user) => {
      this.isLoading = false
      if (user) {
        this.$router.replace('/')
      }
    })
  },
  methods: {
    loginByGoogle () {
      auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider())
    },
    loginByEmailLink () {
      const actionCodeSettings = {
        url: window.location.href,
        handleCodeInApp: true
      }

      let email = this.$cookiz.get('email')
      if (!email) {
        email = window.prompt('メールアドレスを入力してください')
      }
      if (email) {
        const app = this
        auth
          .sendSignInLinkToEmail(email, actionCodeSettings)
          .then(function () {
            app.$cookiz.set('email', email)
            app.emailSent = true
          })
          .catch(function (error) {
            alert('エラーが起きました。メールアドレスを確認してください。')
            console.error(error)
          })
      }
    }
  }
}
</script>
