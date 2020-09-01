<template>
  <v-app>
    <v-main class="bg">
      <v-btn v-if="isLogin" @click="logout">ログアウト</v-btn>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { auth } from "../plugins/firebase";

export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: "mdi-apps",
          title: "Welcome",
          to: "/",
        },
        {
          icon: "mdi-chart-bubble",
          title: "Inspire",
          to: "/inspire",
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "MADACA",
    };
  },
  computed: {
    isLogin() {
      return this.$store.getters.isLogin;
    },
  },
  mounted() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.$store.commit("setLogin", true);
      } else {
        this.$store.commit("setLogin", false);
      }
    });
  },
  methods: {
    logout() {
      auth.signOut();
    },
  },
};
</script>

<style>
.bg {
  width: 100%;
  height: 0;
  background-image: url("~@/assets/background.jpg");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}
</style>