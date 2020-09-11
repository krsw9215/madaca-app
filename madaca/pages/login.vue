<template>
  <div>
    <v-layout column justify-center align-center>
      <v-flex xs12 sm8 md6>
        <div class="mt-5">
          <v-img width="300px" :src="require('@/assets/madaca_logo.png')"></v-img>
        </div>
        <div v-if="!isLoading">
          <div class="text-center mt-1">
            <H2>ログイン</H2>
          </div>
          <div class="text-center mt-3">
            <p>
              <v-btn x-large @click="loginByGoogle">
                <v-icon>{{ mdiGoogle }}</v-icon>Googleアカウントで参加
              </v-btn>
            </p>
          </div>
          <div class="text-center mt-3">
            <p>
              <v-btn :disabled="emailSent" clas="ma-2" x-large @click="loginByEmailLink">
                <v-icon>{{ mdiEmail }}</v-icon>メールアドレスで参加
              </v-btn>
            </p>
          </div>
        </div>
        <v-overlay :value="isLoading">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <v-snackbar v-model="emailSent" color="success" top>メールを送信しました。受信したメールのリンクからログインしてください。</v-snackbar>
      </v-flex>
    </v-layout>
    <v-footer color="transparent">
      <v-layout class="mt-10 mb-3" justify-center align-center>
        <v-img max-width="100" :src="require('@/assets/vrlogo.png')"></v-img>
      </v-layout>
    </v-footer>
  </div>
</template>

<script>
import { mdiGoogle, mdiEmail } from "@mdi/js";
import firebase from "firebase/app";
import "firebase/auth";
import { auth } from "../plugins/firebase";

export default {
  name: "login",
  data() {
    return {
      mdiGoogle,
      mdiEmail,
      emailSent: false,
      isLoading: true,
    };
  },
  mounted() {
    this.isLoading = true;

    if (auth.isSignInWithEmailLink(window.location.href)) {
      const email = this.$cookiz.get("email");
      if (!email) {
        email = window.prompt("登録に使用したメールアドレスを入力してください");
      }
      if (email) {
        auth.signInWithEmailLink(email, window.location.href);
        this.$cookiz.set("email", null);
      }
    }

    auth.onAuthStateChanged((user) => {
      if (user) {
        this.$router.replace("/");
      } else {
        this.isLoading = false;
      }
    });
  },
  methods: {
    loginByGoogle() {
      auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
    },
    loginByEmailLink() {
      const actionCodeSettings = {
        url: window.location.href,
        handleCodeInApp: true,
      };

      let email = this.$cookiz.get("email");
      if (!email) {
        email = window.prompt("メールアドレスを入力してください");
      }
      if (email) {
        const app = this;
        auth
          .sendSignInLinkToEmail(email, actionCodeSettings)
          .then(function () {
            app.$cookiz.set("email", email);
            app.emailSent = true;
          })
          .catch(function (error) {
            alert("エラーが起きました。メールアドレスを確認してください。");
            console.error(error);
          });
      }
    },
  },
};
</script>
