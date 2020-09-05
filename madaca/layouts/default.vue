<template>
  <v-app>
    <v-main>
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
};
</script>

<style>
.container {
  max-width: 100vw;
  padding: 0px;
}
.v-main {
  background-image: url("~@/assets/background.jpg");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}
</style>