<template>
  <v-app>
    <v-container fluid>
      <v-row justify="center" align-content="center">
        <v-col>
          <H2>MADACA ログイン</H2>
        </v-col>
      </v-row>
      <v-row justify="center" align-content="center">
        <v-col>
          <p>
            <v-btn class="ma-2" x-large @click="loginByGoogle">
              <v-icon color="primary">{{ mdiGoogle }}</v-icon>Googleアカウントで参加
            </v-btn>
          </p>
        </v-col>
      </v-row>
      <v-row justify="center" align-content="center">
        <v-col>
          <p>
            <v-btn :disabled="emailSent" clas="ma-2" x-large @click="loginByEmailLink">
              <v-icon color="accent">{{ mdiEmail }}</v-icon>メールアドレスで参加
            </v-btn>
          </p>
        </v-col>
      </v-row>
      <v-overlay :value="isLoading">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
      <v-snackbar v-model="emailSent" color="success" top>メールを送信しました。受信したメールのリンクからログインしてください。</v-snackbar>
    </v-container>
  </v-app>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
import { auth } from "../plugins/firebase";
import { mdiGoogle, mdiEmail } from "@mdi/js";
import { isNull } from "util";

export default {
  name: "login",
  data() {
    return {
      mdiGoogle,
      mdiEmail,
      emailSent: false,
      isLoading: false,
    };
  },
  mounted() {
    this.isLoading = true;

    if (auth.isSignInWithEmailLink(window.location.href)) {
      var email = this.$cookiz.get("email");
      if (email) {
        auth.signInWithEmailLink(email, window.location.href);
        this.$cookiz.set("email", null);
      }
    }

    auth.onAuthStateChanged((user) => {
      this.isLoading = false;
      if (user) {
        this.$router.replace("/");
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

      var email = this.$cookiz.get("email");
      if (!email) {
        email = window.prompt("メールアドレスを入力してください");
      }
      if (email) {
        var app = this;
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
