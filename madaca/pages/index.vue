<template>
  <div>
    <v-container fluid fill-height v-scroll-lock="true">
      <v-layout column justify-center align-center>
        <v-flex xs12 sm8 md6>
          <div class="mt-5">
            <v-img
              width="300px"
              :src="require('@/assets/madaca_logo.png')"
            ></v-img>
            <div class="text-center mt-1" style="color: black; font-size: 1em">
              <p>あつまったえき：{{ stationCount }}</p>
            </div>
          </div>
          <div class="text-center mt-7">
            <p>
              <v-btn
                large
                rounded
                class="menueBtn"
                width="200px"
                @click="showUkkariTouch"
                >うっかりタッチ</v-btn
              >
            </p>
          </div>
          <div class="text-center mt-7">
            <p>
              <v-btn
                large
                rounded
                class="menueBtn"
                width="200px"
                @click="routeMap"
                >ろせんず</v-btn
              >
            </p>
          </div>
          <div class="text-center mt-7">
            <p>
              <v-btn large rounded class="menueBtn" width="200px" @click="story"
                >ストーリー</v-btn
              >
            </p>
          </div>
          <div class="text-center mt-7">
            <p>
              <v-btn large rounded class="menueBtn" width="200px" @click="howto"
                >つかいかた</v-btn
              >
            </p>
          </div>
          <div class="text-center mt-7">
            <p>
              <v-btn
                large
                rounded
                class="menueBtn"
                width="200px"
                @click="setting"
                >せってい</v-btn
              >
            </p>
          </div>
          <v-overlay :value="isLoading">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
          </v-overlay>
        </v-flex>
      </v-layout>
    </v-container>
    <v-footer color="transparent">
      <v-layout class="mt-10 mb-3" justify-center align-center>
        <v-img max-width="100" :src="require('@/assets/vrlogo.png')"></v-img>
      </v-layout>
    </v-footer>
  </div>
</template>

<script>
import { auth } from "../plugins/firebase";
import { firestore } from "../plugins/firebase";
import { functions } from "../plugins/firebase";

export default {
  name: "HomePage",
  head() {
    return {
      script: [
        { src: "/js/bookmark_bubble.js" },
        { src: "/js/add_shortcut.js", body: true },
      ],
      link: [
          {
            rel: 'apple-touch-icon-precomposed',
            href: '/apple-touch-icon-precomposed.png'
          }
        ]
    };
  },
  data() {
    return {
      isLoading: false,
      isRegisterd: false,
      stationCount: 0,
      userName: "",
    };
  },
  mounted() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        firestore
          .collection("Users")
          .doc(user.uid)
          .get()
          .then((doc) => {
            if (!doc.exists) {
              this.createUser(user);
            } else {
              this.nameCheck(doc.data());
            }
          })
          .catch((error) => {
            console.error("Error getting document:", error);
          });
      }
    });
  },
  methods: {
    createUser(user) {
      firestore
        .collection("Users")
        .doc(user.uid)
        .set({
          stationId: null,
          userName: null,
        })
        .then((doc) => {
          console.log("Document successfully written!");
          this.isRegisterd = false;
          this.$router.replace("/register");
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
    },
    nameCheck(userDoc) {
      if (!userDoc.userName || !userDoc.stationId) {
        this.isRegisterd = false;
        this.$router.replace("/register");
      } else {
        this.userName = userDoc.userName;
        this.stationCount = userDoc.stations.length;
        this.isRegisterd = true;
      }
    },
    showUkkariTouch() {
      location.href = "/ukkaritouch.html";
    },
    routeMap() {
      this.$router.push("/routemap");
    },
    story() {
      this.$router.push("/story");
    },
    howto() {
      this.$router.push("/howto");
    },
    setting() {
      this.$router.push("/setting");
    },
  },
};
</script>

<style scoped>
.menueBtn .v-btn__content {
  font-weight: 300;
}
</style>